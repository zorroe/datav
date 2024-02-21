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
      data = this.data(data);

      var cfg = this.mergeConfig(config);

      /* 转换data */
      const transformedData = data.reduce((acc, d) => {
        // 查找当前加工的name是否已经存在于累加器acc中
        const existingObj = acc.find(
          (obj) => obj.labelName === d[cfg.labelName]
        );
        if (existingObj) {
          // 如果存在，直接在该对象上添加新的键值对
          existingObj[d[cfg.catName]] = d[cfg.valName];
        } else {
          // 如果不存在，创建一个新的对象，其中包括name和以cate为键、sl为值的键值对
          const newObj = {
            labelName: d[cfg.labelName],
            [d[cfg.catName]]: d[cfg.valName],
          };
          acc.push(newObj);
        }
        return acc;
      }, []);

      console.log(transformedData);

      const uniqueX = [...new Set(data.map((item) => item[cfg.catName]))];

      const legend = {
        show: cfg.legend.isShow,
        top: cfg.legend.top,
        left: cfg.legend.left,
        itemWidth: cfg.legend.itemWidth,
        itemHeight: cfg.legend.itemHeight,
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
          return (
            Number(value ? value : 0).toFixed(cfg.tooltip.fixed) +
            cfg.tooltip.suffix
          );
        },
      };

      const grid = {
        left: cfg.grid.left,
        right: cfg.grid.right,
        top: cfg.grid.top,
        bottom: cfg.grid.bottom,
      };

      const dataset = {
        dimensions: ["labelName", ...uniqueX],
        source: transformedData,
      };

      const xAxis = {
        splitLine: {
          show: false,
        },
      };

      const yAxis = {
        type: "category",
        axisPointer: {
          show: true,
          type: "shadow",
        },
        axisLabel: {
          show: true,
          color: "#000",
          interval: 0
        },
        inverse: cfg.yAxis.inverse,
      };

      const series = uniqueX.map((x, idx) => {
        return {
          type: "bar",
          stack: "a",
          barWidth: 10,
          itemStyle: {
            borderRadius:
              idx < uniqueX.length - 1
                ? [0, 0, 0, 0]
                : [0, cfg.series.itemRadius, cfg.series.itemRadius, 0],
          },
          label: {
            show: true,
          },
        };
      });

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

      const playCarousel = () => {
        if (options.dataZoom[0].endValue == options.dataset.source.length - 1) {
          options.dataZoom[0].endValue = cfg.valueSpan;
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
      } else {
        clearInterval(this.interval);
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
