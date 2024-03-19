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
    clearInterval(this.interval);
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
      if (this.chart) {
        this.chart.clear();
      }
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
      data = this.data(data);
      var cfg = this.mergeConfig(config);

      data.forEach((d) => {
        d.trueValue = cfg.xAxis.max - d[cfg.series.encodeX];
        if (d.trueValue < 0) {
          d.trueValue = 0;
        }
      });
      const clientWidth = this.container.context.clientWidth;
      const barLength = clientWidth - cfg.grid.left - cfg.grid.right;
      const color = cfg.markColor.split("-");
      // 不显示图例
      const legend = {
        show: false,
      };
      // 不显示提示框
      const tooltip = {
        show: false,
      };
      const grid = {
        left: cfg.grid.left,
        right: cfg.grid.right,
        top: cfg.grid.top,
        bottom: cfg.grid.bottom,
        containLabel: cfg.grid.containLabel,
      };

      const dataset = {
        source: data,
      };

      const xAxis = {
        max: cfg.xAxis.max,
        inverse: true,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      };

      const yAxis = {
        type: "category",
        position: "right",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      };

      const markPointXs = cfg.series.markPointX
        .split("-")
        .map((item) => Number(item));
      const markPointColors = cfg.series.markPointColor.split("-");
      const series = [
        {
          type: "bar",
          encode: {
            x: "trueValue",
            y: cfg.series.encodeY,
          },
          showBackground: true,
          backgroundStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 1,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#FF3C35", // 0% 处的颜色
                },
                {
                  offset: 0.25,
                  color: "#FE8C55",
                },
                {
                  offset: 0.35,
                  color: "#FBDF69",
                },
                {
                  offset: 0.5,
                  color: "#5ECD81",
                },
                {
                  offset: 1,
                  color: "#3B9FF7", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            borderColor: "#FFF",
            borderWidth: 1,
          },
          barWidth: cfg.series.barWidth,
          markPoint: {
            symbol: "rect",
            symbolSize: [cfg.series.markPointWidth, cfg.series.markPointHeight],
            data: markPointXs.map((item, idx) => {
              return {
                x: item * barLength,
                itemStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 1,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: cfg.markColor, // 0% 处的颜色
                      },
                      {
                        offset: 0.3,
                        color: cfg.markColor,
                      },
                      {
                        offset: 0.3,
                        color: markPointColors[idx],
                      },
                      {
                        offset: 0.7,
                        color: markPointColors[idx],
                      },
                      {
                        offset: 0.7,
                        color: cfg.markColor,
                      },
                      {
                        offset: 1,
                        color: cfg.markColor, // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              };
            }),
          },
          labelLayout: {
            x: cfg.grid.left,
            width: barLength,
          },
          // 在图形的上方显示标签，显示数值以及分类名
          label: {
            show: true,
            position: "top",
            offset: [0, cfg.series.label.offsetTop],
            formatter: function (params) {
              return `{cate|${params.data[cfg.series.encodeY]}}{value|${
                params.data[cfg.series.label.numStrField]
              }}`;
            },
            rich: {
              cate: {
                color: cfg.series.label.cateColor,
                fontSize: cfg.series.label.cateSize,
                fontWeight: cfg.series.label.cateWeight,
              },
              value: {
                color: cfg.series.label.valueColor,
                align: "right",
                fontSize: cfg.series.label.valueSize,
                fontWeight: cfg.series.label.valueWeight,
              },
            },
          },
        },
      ];

      const options = {
        color,
        legend,
        tooltip,
        grid,
        dataset,
        xAxis,
        yAxis,
        series,
      };
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
    //updateOptions: function (options) {},
    /**
     * 更新某些配置
     * 给可以增量更新配置的组件用
     */
    //updateXXX: function () {},
    /**
     * 销毁组件
     */
    destroy: function () {
      console.log("请实现 destroy 方法");
    },
  }
);
