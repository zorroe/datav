var Event = require("bcore/event");
var $ = require("jquery");
var _ = require("lodash");
var Echarts = require("echarts");
//var Chart = require('XXX');

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

      this.chart.on("click", "series", (params) => {
        this.emit("clickSeries", {
          year: params.name,
        });
      });
    },
    /**
     * 绘制
     * @param data
     * @param options 不一定有
     * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
     */
    render: function (data, config) {
      data = this.data(data);
      console.log("data==", data);
      var cfg = this.mergeConfig(config);
      console.log(cfg);
      const rgbColor = [
        "#0080FF",
        "#FFD300",
        "#F28018",
        "#2BA471",
        "#FB647D",
        "#029CD4",
        "#AE6FDE",
        "#E5E539",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
        "#50D6E3",
      ];
      const linearColor = [
        ["#60B0FF", "#297AFC"],
        ["#FFD300", "#F29318"],
        ["#0DD491", "#07A872"],
        ["#FF98A9", "#FF98A9"],
        ["#D69FFF", "#AE6FDE"],
        ["#75F3FF", "#50D6E3"],
        ["#FF9191", "#FF9191"],
      ];
      var color = [];
      if (!cfg.barOption.linear) {
        color = rgbColor;
      } else {
        color = linearColor.map((c) => {
          return {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: c[0],
              },
              {
                offset: 1,
                color: c[1],
              },
            ],
            global: false,
          };
        });
      }
      // transform data
      const xAxisData = Array.from(new Set(data.map((item) => item[cfg.x])));
      const yAxisNames = Array.from(
        new Set(data.map((item) => item[cfg.colorField]))
      );
      const series = [];
      yAxisNames.forEach((name, idx) => {
        const s = {
          data: [],
        };
        xAxisData.forEach((x) => {
          const item = data.find((d) => {
            return d[cfg.x] === x && d[cfg.colorField] === name;
          });
          const pushed = {
            value: item ? item[cfg.y] : 0,
          };
          if (cfg.barOption.isRadius && idx === yAxisNames.length - 1) {
            pushed["itemStyle"] = {
              borderRadius: [
                cfg.barOption.radiusSize,
                cfg.barOption.radiusSize,
                0,
                0,
              ],
            };
          }
          s.data.push(pushed);
        });
        s["name"] = name;
        s["type"] = "bar";
        if (!cfg.barOption.isStack) {
          s["stack"] = name;
        } else {
          s["stack"] = "a";
        }
        s["barWidth"] = cfg.barOption.width;
        series.push(s);
      });
      console.log(xAxisData, yAxisNames, series);

      const tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        confine: true,
      };

      if (cfg.tooltip.formatter) {
        tooltip["formatter"] = cfg.tooltip.formatter;
      }

      //更新图表
      const options = {
        color,
        tooltip: {
          ...tooltip,
          backgroundColor: cfg.tooltip.bgColor,
          padding: cfg.tooltip.padding,
          textStyle: {
            color: cfg.tooltip.textColor,
            fontSize: cfg.tooltip.textSize,
          },
        },
        legend: {
          show: cfg.legend.legendIsShow,
          left: cfg.legend.legendLeft,
          top: cfg.legend.legendTop,
          orient: cfg.legend.legendOrient,
          textStyle: {
            color: cfg.legend.textColor,
            fontSize: cfg.legend.textSize,
          },
          itemWidth: cfg.legend.itemWidth,
          itemHeight: cfg.legend.itemHeight,
        },
        grid: {
          left: cfg.grid.left,
          right: cfg.grid.right,
          bottom: cfg.grid.bottom,
          top: cfg.grid.top,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisLine: {
              show: cfg.xAxis.lineShow,
              lineStyle: {
                color: cfg.xAxis.lineColor,
                width: cfg.xAxis.lineWidth,
              },
            },
            boundaryGap: true,
            axisTick: {
              show: cfg.xAxis.tickShow,
              alignWithLabel: true,
            },
            name: cfg.xAxis.name,
            nameLocation: cfg.xAxis.nameLocation,
            nameGap: cfg.xAxis.nameGap,
            nameTextStyle: {
              color: cfg.xAxis.lineColor,
              fontSize: cfg.xAxis.nameSize,
            },
            axisLabel: {
              width: cfg.xAxis.labelWidth,
              overflow: cfg.xAxis.labelTextOverflow,
              ellipsis: cfg.xAxis.labelEllipsis,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: cfg.yAxis.lineShow,
              lineStyle: {
                color: cfg.yAxis.lineColor,
                width: cfg.yAxis.lineWidth,
              },
            },
            axisTick: {
              show: cfg.yAxis.tickShow,
            },
            splitLine: {
              show: cfg.yAxis.splitLineShow,
              lineStyle: {
                width: cfg.yAxis.splitLineWidth,
                color: cfg.yAxis.splitLineColor,
                type: cfg.yAxis.splitLineType,
              },
            },
            name: cfg.yAxis.name,
            nameLocation: cfg.yAxis.nameLocation,
            nameGap: cfg.yAxis.nameGap,
            nameTextStyle: {
              color: cfg.yAxis.lineColor,
              fontSize: cfg.yAxis.nameSize,
            },
          },
        ],
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
