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

      const uniqueX = Array.from(new Set(data.map((item) => item[cfg.xField])));
      const uniqueY = Array.from(new Set(data.map((item) => item[cfg.yField])));

      let new_data = new Array(uniqueX.length)
        .fill(0)
        .map(() => new Array(uniqueY.length).fill(0));

      data.forEach((item) => {
        let xIndex = uniqueX.indexOf(item[cfg.xField]);
        let nIndex = uniqueY.indexOf(item[cfg.yField]);
        new_data[xIndex][nIndex] = item[cfg.valueField];
      });

      const pairs = cfg.color.split("=").map((d) => d.split("-"));

      const colors = pairs.map((p) => {
        return {
          type: "linear",
          x: 0,
          y: 1,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: p[0], // 0% 处的颜色
            },
            {
              offset: 1,
              color: p[1], // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        };
      });

      const tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          const val0 = params[0].value;
          const val1 = params[1].value;
          const circle = `<span style="display:inline-block;margin-right:5px;width:10px;height:10px;left:5px;background-color:`;
          const data0 = `${circle}${pairs[0][1]}"></span> ${params[0].seriesName}&nbsp;&nbsp; <span style='font-weight: 600'>${val0}</span>`;
          const data1 = `${circle}${pairs[1][0]}"></span> ${params[1].seriesName}&nbsp;&nbsp; <span style='font-weight: 600'>${val1}</span>`;
          return `${params[0].axisValueLabel}<br/>${data0}<br/>${data1}`;
        },
      };

      const axisPointer = {
        link: [{ yAxisName: "all" }],
      };

      const legend = {
        show: cfg.legend.isShow,
        left: cfg.legend.left,
        top: cfg.legend.top,
        itemGap: cfg.legend.itemGap,
        itemWidth: cfg.legend.itemWidth,
        itemHeight: cfg.legend.itemHeight,
        textStyle: {
          color: cfg.legend.textColor,
          fontSize: cfg.legend.fontSize,
        },
      };

      const grid = [
        {
          top: cfg.grid.top,
          bottom: cfg.grid.bottom,
          left: cfg.grid.side,
          width: cfg.grid.width,
        },
        {
          top: cfg.grid.top,
          bottom: cfg.grid.bottom,
          right: cfg.grid.side,
          width: cfg.grid.width,
        },
      ];

      const xAxis = [
        {
          type: "value",
          boundaryGap: cfg.xAxis.boundaryGap,
          inverse: true,
          position: "right",
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: cfg.xAxis.labelColor,
            fontSize: cfg.xAxis.labelSize,
          },
          splitNumber: cfg.xAxis.splitNumber,
          splitLine: {
            lineStyle: {
              type: cfg.xAxis.splitLineType.split("-"),
              color: cfg.xAxis.splitLineColor,
            },
          },
        },
        {
          type: "value",
          gridIndex: 1,
          boundaryGap: cfg.xAxis.boundaryGap,
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: cfg.xAxis.labelColor,
            fontSize: cfg.xAxis.labelSize,
            interval: cfg.xAxis.labelInterval,
          },
          splitNumber: cfg.xAxis.splitNumber,
          splitLine: {
            lineStyle: {
              type: cfg.xAxis.splitLineType.split("-"),
              color: cfg.xAxis.splitLineColor,
            },
          },
        },
      ];
      if (cfg.xAxis.min0) {
        xAxis[0].min = cfg.xAxis.min0;
      }
      if (cfg.xAxis.max0) {
        xAxis[0].max = cfg.xAxis.max0;
      }
      if (cfg.xAxis.min1) {
        xAxis[1].min = cfg.xAxis.min1;
      }
      if (cfg.xAxis.max1) {
        xAxis[1].max = cfg.xAxis.max1;
      }

      const shadowColor = cfg.yAxis.shadowColor.split("=");

      const yAxis = [
        {
          inverse: cfg.yAxis.inverse,
          type: "category",
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: cfg.yAxis.axisLineColor,
            },
          },
          axisPointer: {
            shadowStyle: {
              color: shadowColor[0],
            },
          },
          data: uniqueY,
        },
        {
          type: "category",
          gridIndex: 1,
          inverse: cfg.yAxis.inverse,
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: cfg.yAxis.axisLabelSize,
            width: cfg.yAxis.axisLabelWidth,
            color: cfg.yAxis.axisLabelColor,
            align: "center",
            margin: cfg.yAxis.axisLabelMargin,
            interval: cfg.yAxis.interval,
          },
          axisLine: {
            lineStyle: {
              color: cfg.yAxis.axisLineColor,
            },
          },
          axisPointer: {
            shadowStyle: {
              color: shadowColor[1],
            },
          },
          data: uniqueY,
        },
      ];

      const series = [
        {
          name: uniqueX[0],
          type: "bar",
          itemStyle: {
            color: colors[0],
            borderRadius: [
              cfg.series.borderRadius,
              0,
              0,
              cfg.series.borderRadius,
            ],
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
          barWidth: cfg.series.barWidth,
          data: new_data[0],
        },
        {
          name: uniqueX[1],
          type: "bar",
          itemStyle: {
            color: colors[1],
            borderRadius: [
              0,
              cfg.series.borderRadius,
              cfg.series.borderRadius,
              0,
            ],
          },
          barWidth: cfg.series.barWidth,
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: new_data[1],
        },
      ];

      const options = {
        colors,
        tooltip,
        axisPointer,
        legend,
        grid,
        xAxis,
        yAxis,
        series,
      };
      console.log(new_data);
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
