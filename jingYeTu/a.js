const pairs = [
  ["#60B0FF", "#297AFC"],
  ["#F29318", "#FFD300"],
];

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

option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter(params) {
      const val0 = params[0].value;
      const val1 = params[1].value;
      const circle = `<span style="display:inline-block;margin-right:5px;width:10px;height:10px;left:5px;border-radius: 10px;background-color:`;
      const data0 = `${circle}${pairs[0][0]}"></span> ${params[0].seriesName}&nbsp;&nbsp; ${val0}`;
      const data1 = `${circle}${pairs[1][0]}"></span> ${params[1].seriesName}&nbsp;&nbsp; ${val1}`;
      console.log(circle);
      return `${params[0].axisValueLabel}<br/>${data0}<br/>${data1}`;
    },
  },

  axisPointer: {
    link: [{ yAxisName: "all" }],
  },
  legend: {
    itemGap: 100,
  },
  grid: [
    {
      top: 40,
      bottoom: 30,
      left: 10,
      width: "43%",
    },
    {
      top: 40,
      bottoom: 30,
      right: 10,
      width: "43%",
    },
  ],
  xAxis: [
    {
      type: "value",
      boundaryGap: false,
      inverse: true,
      position: "right",
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      splitLine: {
        lineStyle: {
          type: [5, 5],
          color: "rgba(58, 58, 58, 0.3)",
        },
      },
    },
    {
      type: "value",
      gridIndex: 1,
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      splitLine: {
        lineStyle: {
          type: [5, 5],
          color: "rgba(58, 58, 58, 0.3)",
        },
      },
    },
  ],
  yAxis: [
    {
      inverse: true,
      type: "category",
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
      axisPointer: {
        shadowStyle: {
          color: "rgba(56, 156, 255, 0.1)",
        },
      },
      data: ["A区", "B区111", "C区2", "D区11"],
    },
    {
      type: "category",
      gridIndex: 1,
      inverse: true,
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        width: 100,
        color: "#666",
        align: "center",
        margin: 50,
      },
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
      axisPointer: {
        shadowStyle: {
          color: "rgba(255, 211, 0, 0.1)",
        },
      },
      data: ["A区", "B区111", "C区2", "D区11"],
    },
  ],
  series: [
    {
      name: "收入",
      type: "bar",
      itemStyle: {
        color: colors[0],
        borderRadius: [8, 0, 0, 8],
      },
      xAxisIndex: 0,
      yAxisIndex: 0,
      barWidth: 12,
      data: [12, 4, 35, 17],
    },
    {
      name: "支出",
      type: "bar",
      itemStyle: {
        color: colors[1],
        borderRadius: [0, 8, 8, 0],
      },
      barWidth: 12,
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [6, 21, 15, 18],
    },
  ],
};
