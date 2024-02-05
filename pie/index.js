var Event = require("bcore/event");
var $ = require("jquery");
var _ = require("lodash");
var Echarts = require("echarts");

/**
 * 马良基础类
 */
module.exports = Event.extend(
  function Base(container, config) {
    this.config = {
      theme: {},
    };
    this.container = $(container); //容器
    this.apis = config.apis; //hook一定要有
    this._data = null; //数据
    this.chart = null; //图表
    this.interval = null;
    this.init(config);
  },
  {
    /**
     * 公有初始化
     */
    init: function (config) {
      //1.初始化,合并配置
      this.mergeConfig(config);
      //2.刷新布局,针对有子组件的组件 可有可无
      this.updateLayout();
      //3.子组件实例化
      this.chart = Echarts.init(this.container[0]);
      //4.如果有需要, 更新样式
      this.updateStyle();
    },
    /**
     * 绘制
     * @param data
     * @param options 不一定有
     * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
     */
    render: function (data, config) {
      clearInterval(this.interval);
      this.chart = Echarts.init(this.container[0]);
      data = this.data(data);
      console.log("data==", data);
      var cfg = this.mergeConfig(config);
      //更新图表
      const options = {
        color: [
          "#0080FF",
          "#FFD300",
          "#F28018",
          "#2BA471",
          "#F86470",
          "#029cd4",
          "#ae6fde",
        ],
        legend: {
          top: cfg.legend.top, // 需配置
          left: cfg.legend.left,
          orient: cfg.legend.orient, // 需配置
          textStyle: {
            color: cfg.legend.color,
            fontSize: cfg.legend.fontSize,
            fontWeight: 500,
            width: cfg.legend.width,
            overflow: "truncate",
            ellipsis: "...",
          },
          tooltip: {
            trigger: "item",
            show: cfg.legend.showTooltip,
          },
          itemWidth: cfg.legend.itemWidth,
          itemHeight: cfg.legend.itemHeight,
          itemGap: cfg.legend.itemGap,
          formatter: function (name) {
            let res = name;
            if (cfg.legend.showValue) {
              const d = data.find((item) => {
                return item[cfg.nameField] === name;
              });
              res = `${res}    ${new Intl.NumberFormat("en-US").format(
                d[cfg.valueField]
              )}${cfg.legend.valueSuffix}`;
            }
            if (cfg.legend.showProportion) {
              const total = data.reduce(function (acc, obj) {
                return acc + obj[cfg.valueField];
              }, 0);
              console.log(total);
              const d = data.find((item) => {
                return item[cfg.nameField] === name;
              });
              console.log(d);
              const proportion =
                ((d[cfg.valueField] / total) * 100).toFixed(
                  cfg.legend.proportionPrecision
                ) + "%";
              res = `${res}    ${proportion}`;
            }
            return res;
          },
        },
        tooltip: {
          padding: [8, 10],
          confine: cfg.tooltip.confine,
          formatter: (params) => {
            let res = params.data.name;
            if (cfg.tooltip.showValue) {
              res = `${res}&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:600'>${
                new Intl.NumberFormat("en-US").format(params.data.value) +
                cfg.legend.valueSuffix
              }</span>`;
            }
            if (cfg.tooltip.showProportion) {
              res = `${res}&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:600'>${params.percent.toFixed(
                cfg.legend.proportionPrecision
              )}%</span>`;
            }
            return res;
          },
          borderWidth: 0,
        },
        series: [
          {
            type: "pie",
            colorBy: "data",
            center: [cfg.center.x, cfg.center.y], // 需配置
            radius: [cfg.center.inner, cfg.center.outer], // 需配置
            label: {
              show: cfg.label.show,
              position: cfg.label.position,
            },
            data: data.map((d) => {
              return {
                name: d[cfg.nameField],
                value: d[cfg.valueField],
              };
            }),
          },
        ],
      };
      console.log(options);

      this.chart.setOption(options);

      var currentIdx = -1;
      const playCarousel = () => {
        currentIdx = (currentIdx + 1) % data.length;
        this.chart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: currentIdx,
        });
      };
      clearInterval(this.interval);
      if (!cfg.tooltip.auto) {
        clearInterval(this.interval);
        this.chart.dispatchAction({
          type: "hideTip",
        });
        this.chart.off("mouseover");
        this.chart.off("mouseout");
      }
      if (cfg.tooltip.auto) {
        this.interval = setInterval(playCarousel, cfg.tooltip.autoTime);
        this.chart.on("mouseover", () => {
          clearInterval(this.interval);
        });
        this.chart.on("mouseout", () => {
          this.interval = setInterval(playCarousel, cfg.tooltip.autoTime);
        });
      }

      //如果有需要的话,更新样式
      this.updateStyle();
    },
    /**
     *
     * @param width
     * @param height
     */
    resize: function (width, height) {
      // this.updateLayout(width, height);
      //更新图表
      this.chart.resize();
    },
    /**
     * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
     * 暂时可以不填内容
     */
    setColors: function () {
      //比如
      //var cfg = this.config;
      //cfg.color = cfg.theme.series[0] || cfg.color;
    },
    /**
     * 数据,设置和获取数据
     * @param data
     * @returns {*|number}
     */
    data: function (data) {
      if (data) {
        this._data = data;
      }
      return this._data;
    },
    /**
     * 更新配置
     * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
     * [注] 有数组的配置一定要替换
     * @param config
     * @private
     */
    mergeConfig: function (config) {
      if (!config) {
        return this.config;
      }
      this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
      this.setColors();
      this.config = _.defaultsDeep(config || {}, this.config);
      return this.config;
    },
    /**
     * 更新布局
     * 可有可无
     */
    updateLayout: function () {},
    /**
     * 更新样式
     * 有些子组件控制不到的,但是需要控制改变的,在这里实现
     */
    updateStyle: function () {
      var cfg = this.config;
      this.container.css({
        "font-size": cfg.size + "px",
        color: cfg.color || "#fff",
      });
    },
    /**
     * 更新配置
     * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
     */
    // updateOptions: function (options) {
    //   console.log(options);
    // },
    /**
     * 更新某些配置
     * 给可以增量更新配置的组件用
     */
    // updateXXX: function () {},
    /**
     * 销毁组件
     */
    destroy: function () {
      console.log("请实现 destroy 方法");
    },
  }
);
