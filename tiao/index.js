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

    gradientFun: function (colorList) {
      return {
        type: "linear",
        x: 0,
        y: 1,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: colorList[0], // 0% 处的颜色
          },
          {
            offset: 1,
            color: colorList[1], // 100% 处的颜色
          },
        ],
      };
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
      console.log(data);
      var cfg = this.mergeConfig(config);

      const top1Color = cfg.top1Color.split("-");
      const otherColor = cfg.otherColor.split("-");

      const colorMap = [top1Color, otherColor].map((c) => {
        return this.gradientFun(c);
      });

      // console.log("colorMap:", colorMap);

      const legend = {
        show: false,
      };

      const tooltip = {
        show: false,
      };

      const grid = {
        left: cfg.grid.left,
        right: cfg.grid.right,
        top: cfg.grid.top,
        bottom: cfg.grid.bottom,
      };

      const dataset = {
        dimensions: [cfg.yAxisIndexName, cfg.xAxisIndexName],
        source: data,
      };

      const xAxis = {
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      };

      const yAxis = {
        type: "category",
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        inverse: true,
      };

      const textColor = cfg.textColor.split("-");
      const series = [
        {
          type: "bar",
          barWidth: cfg.barWidth,
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: (params) => {
              if (params.data[cfg.sortName] == 1) {
                return colorMap[0];
              } else {
                return colorMap[1];
              }
            },
          },
          showBackground: true,
          backgroundStyle: {
            color: "rgba(56, 156, 255, 0.10)",
          },
          labelLayout: {
            x: 0,
            width: cfg.labelLayoutWidth,
          },
          label: {
            show: true,
            position: "top",
            offset: [0, cfg.labelYOffset],
            formatter: (params) => {
              const data = params.data;
              if (data[cfg.sortName] === 1) {
                return `{top1Sort|${cfg.labelSortPrefix}${
                  data[cfg.sortName]
                }}{top1Name|${data[cfg.yAxisIndexName]}}{top1Num|${
                  data[cfg.numStrName]
                }}`;
              } else {
                return `{notop1Sort|${cfg.labelSortPrefix}${
                  data[cfg.sortName]
                }} {notop1Name|${data[cfg.yAxisIndexName]}} {notop1Num|${
                  data[cfg.numStrName]
                }}`;
              }
            },
            rich: {
              top1Sort: {
                color: cfg.textColorWithBar ? top1Color[0] : textColor[0],
                width: cfg.labelSortWidth,
                fontSize: cfg.sortFontSize,
                fontWeight: cfg.sortFontWeight,
              },
              top1Name: {
                color: cfg.textColorWithBar ? top1Color[0] : textColor[1],
                width: cfg.labelNameWidth,
                fontSize: cfg.nameFontSize,
                fontWeight: cfg.nameFontWeight,
              },
              top1Num: {
                color: cfg.textColorWithBar ? top1Color[0] : textColor[2],
                width: cfg.labelNumWidth,
                fontSize: cfg.numFontSize,
                fontWeight: cfg.numFontWeight,
                align: "right",
                padding: [0, cfg.grid.right, 0, 0],
              },
              notop1Sort: {
                color: cfg.textColorWithBar ? otherColor[0] : textColor[0],
                width: cfg.labelSortWidth,
                fontSize: cfg.sortFontSize,
                fontWeight: cfg.sortFontWeight,
              },
              notop1Name: {
                color: cfg.textColorWithBar ? otherColor[0] : textColor[1],
                width: cfg.labelNameWidth,
                fontSize: cfg.nameFontSize,
                fontWeight: cfg.nameFontWeight,
              },
              notop1Num: {
                color: cfg.textColorWithBar ? otherColor[0] : textColor[2],
                width: cfg.labelNumWidth,
                fontSize: cfg.numFontSize,
                fontWeight: cfg.numFontWeight,
                align: "right",
                padding: [0, cfg.grid.right, 0, 0],
              },
            },
          },
        },
      ];

      const dataZoom = [
        {
          type: "slider",
          show: cfg.zoomShow,
          orient: "vertical",
          top: 10,
          bottom: 20,
          width: 10,
          zoomLock: true,
          yAxisIndex: 0,
          handleIcon: "path://M4 24a20 20 0 1 0 40 0a20 20 0 1 0 -40 0z",
          borderColor: "#DDDDDD",
          fillerColor: "rgba(0, 128, 255, 1)",
          borderRadius: 6,
          maxValueSpan: cfg.valueSpan - 1,
          minValueSpan: cfg.valueSpan - 1,
          moveHandleSize: 0,
          showDataShadow: false,
          backgroundColor: "#DDDDDD",
          brushSelect: false,
          startValue: 0, // 数据窗口范围的起始数值index
          endValue: cfg.valueSpan, // 数据窗口范围的结束数值index
          textStyle: {
            color: cfg.zoomTextColor,
          },
        },
      ];

      const options = {
        legend,
        tooltip,
        grid,
        dataset,
        xAxis,
        yAxis,
        series,
        dataZoom,
      };
      console.log(options);
      this.chart.clear();
      this.chart.setOption(options);
      //如果有需要的话,更新样式
      this.updateStyle();

      const startPlay = () => {
        this.interval = setInterval(() => {
          if (
            options.dataZoom[0].endValue ==
            options.dataset.source.length - 1
          ) {
            options.dataZoom[0].endValue = cfg.valueSpan;
            options.dataZoom[0].startValue = 0;
          } else {
            options.dataZoom[0].endValue = options.dataZoom[0].endValue + 1;
            options.dataZoom[0].startValue = options.dataZoom[0].startValue + 1;
          }
          this.chart.setOption({ dataZoom: options.dataZoom });
        }, cfg.autoPlayInterval);
      };

      const stopPlay = () => {
        clearInterval(this.interval);
      };

      if (cfg.autoPlay) {
        startPlay();
        this.chart.on("mouseover", () => {
          stopPlay();
        });
        this.chart.on("mouseout", () => {
          clearInterval(this.interval);
          startPlay();
        });
      } else {
        this.chart.off("mouseover");
        this.chart.off("mouseout");
      }
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
