var top1GradualColor = ['#F29318', '#FFD300'];
var notop1GradualColor = ['#297AFC', '#60B0FF'];

const gradientFun = (colorList) => {
  return {
    type: 'linear',
    x: 0,
    y: 1,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: colorList[0] // 0% 处的颜色
      },
      {
        offset: 1,
        color: colorList[1] // 100% 处的颜色
      }
    ]
  };
};

option = {
  legend: { show: false },
  tooltip: { show: false },
  grid: {
    left: 0,
    right: 0,
    width: 480
  },
  dataset: {
    dimensions: ['bmmc', 'zj'],
    source: [
      {
        rk: 1,
        bmmc: '精密光谱科学与技术国家重点实验室',
        zj: 182.9
      },
      {
        rk: 2,
        bmmc: '生命科学学院办公室',
        zj: 79.85
      },
      {
        rk: 3,
        bmmc: '电子科学系',
        zj: 67.34
      },
      {
        rk: 4,
        bmmc: '化学与分子工程学院',
        zj: 57.79
      },
      {
        rk: 5,
        bmmc: '生命医学系',
        zj: 48.07
      },
      {
        rk: 6,
        bmmc: '生命科学学院',
        zj: 47.64
      },
      {
        rk: 7,
        bmmc: '上海市绿色化学与化工过程绿色化重点实验室',
        zj: 42.08
      },
      {
        rk: 8,
        bmmc: '物理学系',
        zj: 32.97
      },
      {
        rk: 9,
        bmmc: '化学系',
        zj: 31.53
      },
      {
        rk: 10,
        bmmc: '生态与环境科学学院',
        zj: 28.39
      }
    ]
  },
  xAxis: {
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    },
    max: () => {
      return option.dataset.source.sort((a, b) => b.zj - a.zj)[0].zj;
    }
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    inverse: true
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        borderRadius: [0, 8, 8, 0],
        color: (params) => {
          if (params.data.rk === 1) {
            return gradientFun(top1GradualColor);
          } else {
            return gradientFun(notop1GradualColor);
          }
        }
      },
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(56, 156, 255, 0.10)'
      },

      labelLayout: {
        x: 1,
        width: 400
      },
      label: {
        show: true,
        position: 'inside',
        offset: [0, -28],
        formatter: (params) => {
          const data = params.data;
          if (data.rk === 1) {
            return `{top1|TOP${data.rk}}{yellowName|${data.bmmc}}{yellowNum|${data.zj}}`;
          } else {
            return `{notop1|TOP${data.rk}}{blueName|${data.bmmc}}{blueNum|${data.zj}}`;
          }
        },
        rich: {
          top1: {
            color: '#F28018',
            borderColor: '#F28018',
            borderWidth: 0.5,
            borderType: 'solid',
            borderRadius: 2,
            width: 40,
            padding:[4,0,1,4],
            backgroundColor: 'rgba(242, 128, 24, 0.10)'
          },
          notop1: {
            color: '#0080FF',
            borderColor: '#0080FF',
            borderWidth: 0.5,
            borderType: 'solid',
            borderRadius: 2,
            padding:[4,0,1,4],
            width: 40,
            backgroundColor: 'rgba(0, 128, 255, 0.10)'
          },
          yellowName: {
            color: '#F28018',
            padding: [0, 0, 0, 8],
            width: 400
          },
          blueName: {
            color: '#0080FF',
            padding: [0, 0, 0, 8],
            width: 400
          },
          yellowNum: {
            color: '#F28018',
            width: 60
          },
          blueNum: {
            color: '#0080FF',
            width: 60
          }
        }
      }
    }
  ],
  dataZoom: [
    {
      // 第一个 dataZoom 组件
      type: 'inside',
      zoomLock: true,
      orient: 'vertical',
      yAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
      startValue: 0, // 数据窗口范围的起始数值index
      endValue: 5 // 数据窗口范围的结束数值index
    }
  ]
};

setInterval(function () {
  if (option.dataZoom[0].endValue == option.dataset.source.length - 1) {
    option.dataZoom[0].endValue = 5;
    option.dataZoom[0].startValue = 0;
  } else {
    option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
    option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
  }
  myChart.setOption(option);
}, 300000);
