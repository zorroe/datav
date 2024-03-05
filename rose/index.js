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
      this.chart && this.chart.clear();
      this.chart = Echarts.init(this.container[0]);
      data = this.data(data);

      var cfg = this.mergeConfig(config);

      const normalColors = cfg.itemColor.split("-");
      const emphasisColors = cfg.emphasisColor.split("-");

      const new_data = data.map((d, idx) => {
        return {
          name: d[cfg.nameField],
          v: d[cfg.valueField],
          value: cfg.pieValueStart - idx * 10,
        };
      });

      const length = new_data.length;
      for (let index = 0; index < length; index++) {
        new_data.push({
          value: 0,
          itemStyle: {
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              color: "rgba(0,0,0,0)",
            },
          },
        });
      }
      console.log(new_data);

      //更新图表
      const options = {
        // color: [
        //   {
        //     type: "linear",
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [
        //       {
        //         offset: 0,
        //         color: normalColors[0], // 0% 处的颜色
        //       },
        //       {
        //         offset: 1,
        //         color: normalColors[1], // 100% 处的颜色
        //       },
        //     ],
        //     global: false, // 缺省为 false
        //   },
        // ],

        legend: {
          show: cfg.legend.isShow,
          top: cfg.legend.top, // 需配置
          left: cfg.legend.left,
          orient: cfg.legend.orient, // 需配置
          textStyle: {
            color: cfg.legend.color,
            fontSize: cfg.legend.fontSize,
            fontWeight: 500,
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
            console.log(data);
            const name = params.data.name;
            let res = name;
            if (cfg.tooltip.showValue) {
              res = `${res}&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:600'>${
                new Intl.NumberFormat("en-US").format(params.data.v) +
                cfg.legend.valueSuffix
              }</span>`;
            }

            if (cfg.tooltip.showProportion) {
              const total = data.reduce(function (acc, obj) {
                return acc + obj[cfg.valueField];
              }, 0);

              const d = data.find((n) => n[cfg.nameField] === name);
              console.log(`total: ${total} --- value: ${d[cfg.valueField]}`);
              const proportion = (d[cfg.valueField] / total) * 100;

              res = `${res}&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:600'>${proportion.toFixed(
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
              show: false,
            },
            startAngle: 180,
            roseType: "area",
            itemStyle: {
              borderRadius: cfg.series.borderRadius,
              borderWidth: cfg.series.borderWidth,
              borderColor: cfg.series.borderColor,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: normalColors[0], // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: normalColors[1], // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: emphasisColors[0], // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: emphasisColors[1], // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            data: new_data,
          },
        ],
      };

      if (cfg.legend.width.fixed) {
        options.legend.textStyle.width = cfg.legend.width.value;
      }
      console.log(options);

      this.chart.clear();
      this.chart.setOption(options);

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
