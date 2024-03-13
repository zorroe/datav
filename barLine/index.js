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

      const colors = cfg.color.split("=").map((c) => c.split("-"));

      const color = colors.map((c) => {
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

      // 预处理柱形图的样式
      cfg.series.forEach((s) => {
        if (s.type === "bar") {
          if (cfg.barOption.barMaxWidth) {
            s.barMaxWidth = cfg.barOption.barMaxWidth;
          }
          if (cfg.barOption.barMinWidth) {
            s.barMinWidth = cfg.barOption.barMinWidth;
          }
          if (cfg.barOption.borderRadius) {
            s.itemStyle = {};
            s.itemStyle.borderRadius = cfg.barOption.borderRadius
              .split(",")
              .map((n) => {
                return Number(n);
              });
          }
        }
        if (s.type === "line") {
          s.symbol = cfg.lineOption.symbol;
          s.symbolSize = cfg.lineOption.symbolSize;
        }
      });

      const options = {
        color,
        legend: {
          show: cfg.legend.show,
          left: cfg.legend.left,
          top: cfg.legend.top,
          itemGap: cfg.legend.itemGap,
          icon: cfg.legend.icon,
          itemWidth: cfg.legend.itemWidth,
          itemHeight: cfg.legend.itemHeight,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: cfg.tooltip.bgColor,
          padding: cfg.tooltip.padding,
          textStyle: {
            color: cfg.tooltip.textColor,
            fontSize: cfg.tooltip.textSize,
          },
          confine: cfg.tooltip.confine,
          order: cfg.tooltip.order ? "seriesAsc" : "seriesDesc",
          valueFormatter: (value) => {
            if (cfg.tooltip.valueFixed > -1) {
              return value.toFixed(cfg.tooltip.valueFixed);
            }
            return value;
          },
        },
        axisPointer: {
          shadowStyle: {
            color: cfg.axisPointer.shadowColor,
          },
        },
        grid: {
          top: cfg.grid.top,
          bottom: cfg.grid.bottom,
          left: cfg.grid.left,
          right: cfg.grid.right,
          containLabel: cfg.grid.containLabel,
        },
        dataset: {
          dimensions: cfg.dataset.dimensions.split(","),
          source: data,
        },
        xAxis: {
          type: "category",
          name: cfg.xAxis.name,
          nameLocation: cfg.xAxis.nameLocation,
          nameGap: cfg.xAxis.nameGap,
          nameTextStyle: {
            color: cfg.xAxis.nameColor,
            fontSize: cfg.xAxis.nameSize,
          },
          triggerEvent: true,
          axisLine: {
            show: cfg.xAxis.lineShow,
            lineStyle: {
              color: cfg.xAxis.lineColor,
              width: cfg.xAxis.lineWidth,
            },
          },
          axisTick: {
            show: cfg.xAxis.tickShow,
            alignWithLabel: cfg.xAxis.alignWithLabel,
          },
          axisLabel: {
            show: cfg.xAxis.labelShow,
            color: cfg.xAxis.labelColor,
          },
        },
        yAxis: cfg.yAxis,
        series: cfg.series,
        dataZoom: cfg.dataZoom,
      };

      this.chart.clear();
      console.log(options);
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
