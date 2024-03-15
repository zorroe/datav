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
      data = this.data(data);
      var cfg = this.mergeConfig(config);
      const colors = cfg.color.split("=");
      const color = colors.map((c) => {
        const pairs = c.split("-");
        return {
          type: "linear",
          x: 0,
          y: 1,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: pairs[0], // 0% 处的颜色
            },
            {
              offset: 1,
              color: pairs[1], // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        };
      });

      const dimensions = cfg.dimensions.split("-");

      const dataset = {
        source: data,
        dimensions: dimensions,
      };

      const legend = {
        show: cfg.legend.isShow,
        top: cfg.legend.top,
        left: cfg.legend.left,
        itemWidth: cfg.legend.itemWidth,
        itemHeight: cfg.legend.itemHeight,
        itemGap: cfg.legend.itemGap,
        textStyle: {
          color: cfg.legend.textColor,
          fontSize: cfg.legend.textSize,
        },
      };

      const tooltip = {
        show: cfg.tooltip.isShow,
        trigger: "axis",
        confine: cfg.tooltip.confine,

        valueFormatter: (value) => {
          const newV = value < 0 ? 0 - value : value;
          const v = Number(newV).toFixed(cfg.tooltip.fixed);
          nums = v.split(".");
          nums[0] = nums[0].replace(
            new RegExp("(\\d)(?=(\\d{3})+$)", "ig"),
            "$1,"
          );
          if (cfg.tooltip.fixed == 0) {
            return nums[0] + cfg.tooltip.suffix;
          }
          return nums.join(".") + cfg.tooltip.suffix;
        },
      };

      const grid = {
        left: cfg.grid.left,
        right: cfg.grid.right,
        top: cfg.grid.top,
        bottom: cfg.grid.bottom,
        containLabel: cfg.grid.containLabel,
      };

      const xAxis = {
        type: "value",
        inverse: cfg.xAxis.inverse,
        axisLabel: {
          formatter: (value) => {
            console.log(value);
            return value < 0 ? 0 - value : value;
          },
          color: cfg.xAxis.labelColor,
          fontSize: cfg.xAxis.labelSize,
        },
        splitLine: {
          lineStyle: {
            color: cfg.xAxis.splitLineColor,
            type: cfg.xAxis.splitLineType.split("-"),
          },
        },
      };

      if (cfg.xAxis.min !== 0) {
        xAxis.min = cfg.xAxis.min;
      }
      if (cfg.xAxis.max !== 0) {
        xAxis.max = cfg.xAxis.max;
      }

      const yAxis = {
        type: "category",
        axisPointer: {
          show: true,
          type: "shadow",
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: cfg.yAxis.labelColor,
          fontSize: cfg.yAxis.labelFontSize,
          fontWeight: cfg.yAxis.labelFontWeight,
        },
        axisLine: {
          lineStyle: {
            color: cfg.yAxis.lineColor,
          },
        },
        axisTick: {
          show: false,
        },
      };

      const series = [
        {
          type: "bar",
          stack: "total",
          itemStyle: {
            borderRadius: cfg.xAxis.inverse
              ? [cfg.series.barRadius, 0, 0, cfg.series.barRadius]
              : [0, cfg.series.barRadius, cfg.series.barRadius, 0],
          },
          barWidth: cfg.series.barWidth,
        },
        {
          type: "bar",
          stack: "total",
          itemStyle: {
            borderRadius: cfg.xAxis.inverse
              ? [0, cfg.series.barRadius, cfg.series.barRadius, 0]
              : [cfg.series.barRadius, 0, 0, cfg.series.barRadius],
          },
          barWidth: cfg.series.barWidth,
        },
      ];

      const shadowColor = cfg.shadowColor.split("-");
      const axisPointer = {
        shadowStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: shadowColor[0], // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: shadowColor[0], // 100% 处的颜色
              },
              {
                offset: 0.5,
                color: shadowColor[1], // 100% 处的颜色
              },
              {
                offset: 1,
                color: shadowColor[1], // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      };

      const options = {
        color,
        legend,
        tooltip,
        grid,
        dataset,
        xAxis,
        yAxis,
        series,
        axisPointer,
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
