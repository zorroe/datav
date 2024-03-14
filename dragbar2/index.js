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
      this.chart.off("mouseover");
      this.chart.off("mouseout");
      data = this.data(data);

      var cfg = this.mergeConfig(config);

      const uniqueX = [...new Set(data.map((item) => item[cfg.labelName]))];
      const uniqueY = [...new Set(data.map((item) => item[cfg.catName]))];

      const template = uniqueY.reduce((acc, cate) => {
        acc[cate] = uniqueX.reduce((labelAcc, label) => {
          labelAcc[label] = 0; // 初始化每个yqjg的sl值为0
          return labelAcc;
        }, {});
        return acc;
      }, {});

      data.forEach((item) => {
        template[item[cfg.catName]][item[cfg.labelName]] =
          item[cfg.valName] ?? 0;
      });

      // 结果转换为所需格式
      const barsData = Object.entries(template).map(([catName, yqjgObj]) => ({
        catName,
        values: Object.values(yqjgObj),
      }));

      // console.log(barsData);
      // console.log(uniqueX, uniqueY);

      const colorMap = cfg.color.split("&");
      const linearColor = colorMap.map((c) => {
        return c.split("-");
      });

      const color = linearColor.map((c) => {
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

      const legend = {
        show: cfg.legend.isShow,
        top: cfg.legend.top,
        left: cfg.legend.left,
        itemWidth: cfg.legend.itemWidth,
        itemHeight: cfg.legend.itemHeight,
        icon: cfg.legend.icon,
        textStyle: {
          color: cfg.legend.textColor,
          fontSize: cfg.legend.textSize,
        },
        itemGap: cfg.legend.itemGap,
      };

      const tooltip = {
        show: cfg.tooltip.isShow,
        trigger: "axis",
        confine: cfg.tooltip.confine,
        backgroundColor: cfg.tooltip.bgColor,
        padding: cfg.tooltip.padding,
        textStyle: {
          color: cfg.tooltip.textColor,
          fontSize: cfg.tooltip.textSize,
        },
        valueFormatter: (value) => {
          const v = Number(value).toFixed(cfg.tooltip.fixed);
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
        order: cfg.tooltip.order ? "seriesAsc" : "seriesDesc",
      };

      const grid = {
        left: cfg.grid.left,
        right: cfg.grid.right,
        top: cfg.grid.top,
        bottom: cfg.grid.bottom,
      };

      const xAxis = {
        type: "category",
        data: uniqueX,
        axisPointer: {
          type: "shadow",
        },
        axisLabel: {
          width: cfg.xAxis.labelWidth,
          rotate: cfg.xAxis.labelRotate,
          margin: cfg.xAxis.labelMargin,
          interval: cfg.xAxis.labelInterval,
          overflow: cfg.xAxis.labelOverflow,
          color: cfg.xAxis.labelColor,
          fontSize: cfg.xAxis.labelFontSize,
        },
        axisLine: {
          lineStyle: {
            color: cfg.xAxis.lineColor,
          },
        },
        axisTick: {
          show: cfg.xAxis.tickShow,
          alignWithLabel: true,
        },
        inverse: cfg.xAxis.inverse,
      };

      const yAxis = {
        type: "value",
        name: cfg.yAxis.axisName,
        nameLocation: cfg.yAxis.nameLocation,
        nameGap: cfg.yAxis.nameGap,
        nameTextStyle: {
          color: cfg.yAxis.nameColor,
          fontSize: cfg.yAxis.nameFontSize,
        },
        minInterval: 1,
        splitNumber: cfg.yAxis.splitNumber,
        axisLabel: {
          show: cfg.yAxis.labelShow,
          margin: cfg.yAxis.labelMargin,
          color: cfg.yAxis.labelColor,
          fontSize: cfg.yAxis.labelFontSize,
          formatter: cfg.yAxis.labelFormatter,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: cfg.yAxis.splitLineColor,
          },
        },
      };

      const axisPointer = {
        shadowStyle: {
          color: cfg.axisPointer.shadowColor,
        },
      };

      if (cfg.yAxis.max) {
        yAxis.max = cfg.yAxis.max;
      }

      const stacks = cfg.series.stack.split("-");
      const series = [
        ...barsData.map((d, idx) => {
          return {
            name: d["catName"],
            type: "bar",
            data: d.values,
            stack: stacks[idx],
            barWidth: cfg.barWidth,
            itemStyle: {
              borderRadius: [0, 0, 0, 0],
            },
            barGap: cfg.series.barGap,
          };
        }),
      ];

      const stackInfo = {};
      for (let i = 0; i < series[0].data.length; ++i) {
        for (let j = 0; j < series.length; ++j) {
          const stackName = series[j].stack;
          if (!stackName) {
            continue;
          }
          if (!stackInfo[stackName]) {
            stackInfo[stackName] = {
              stackStart: [],
              stackEnd: [],
            };
          }
          const info = stackInfo[stackName];
          const data = series[j].data[i];
          if (data && data !== "-") {
            if (info.stackStart[i] == null) {
              info.stackStart[i] = j;
            }
            info.stackEnd[i] = j;
          }
        }
      }

      for (let i = 0; i < series.length; ++i) {
        const data = series[i].data;
        const info = stackInfo[series[i].stack];
        for (let j = 0; j < series[i].data.length; ++j) {
          // const isStart = info.stackStart[j] === i;
          const isEnd = info.stackEnd[j] === i;
          const topBorder = isEnd ? cfg.barRadius : 0;
          const bottomBorder = 0;
          data[j] = {
            value: data[j],
            itemStyle: {
              borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder],
            },
          };
        }
      }

      const dataZoom = [
        {
          type: "slider",
          show: cfg.zoom.zoomShow && !cfg.autoPlay,
          orient: "horizontal",
          left: cfg.zoom.left,
          bottom: cfg.zoom.bottom,
          right: cfg.zoom.right,
          height: 10,
          zoomLock: true,
          handleIcon: "path://M4 24a20 20 0 1 0 40 0a20 20 0 1 0 -40 0z",
          borderColor: "#DDDDDD",
          fillerColor: "rgba(0, 128, 255, 1)",
          borderRadius: 6,
          maxValueSpan: cfg.zoom.valueSpan - 1,
          minValueSpan: cfg.zoom.valueSpan - 1,
          moveHandleSize: 0,
          showDataShadow: false,
          backgroundColor: "#DDDDDD",
          brushSelect: false,
          startValue: cfg.zoom.startValue, // 数据窗口范围的起始数值index
          endValue: cfg.zoom.startValue + cfg.zoom.valueSpan, // 数据窗口范围的结束数值index
        },
      ];

      const options = {
        color,
        axisPointer,
        legend,
        tooltip,
        grid,
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

      const playCarousel = () => {
        if (options.dataZoom[0].endValue == uniqueX.length - 1) {
          options.dataZoom[0].endValue = cfg.zoom.valueSpan;
          options.dataZoom[0].startValue = 0;
        } else {
          options.dataZoom[0].endValue = options.dataZoom[0].endValue + 1;
          options.dataZoom[0].startValue = options.dataZoom[0].startValue + 1;
        }
        this.chart.setOption(options);
      };

      if (cfg.autoPlay) {
        clearInterval(this.interval);
        this.interval = setInterval(playCarousel, cfg.autoPlayInterval);
        this.chart.on("mouseover", () => {
          clearInterval(this.interval);
        });
        this.chart.on("mouseout", () => {
          this.interval = setInterval(playCarousel, cfg.autoPlayInterval);
        });
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
