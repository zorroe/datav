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
    dimensions: ['name', 'num'],
    source: [
      {
        sort: 1,
        name: '精密光谱科学与技术国家重点实验室',
        num: 182.9
      },
      {
        sort: 2,
        name: '生命科学学院办公室',
        num: 79.85
      },
      {
        sort: 3,
        name: '电子科学系',
        num: 67.34
      },
      {
        sort: 4,
        name: '化学与分子工程学院',
        num: 57.79
      },
      {
        sort: 5,
        name: '生命医学系',
        num: 48.07
      },
      {
        sort: 6,
        name: '生命科学学院',
        num: 47.64
      },
      {
        sort: 7,
        name: '上海市绿色化学与化工过程绿色化重点实验室',
        num: 42.08
      },
      {
        sort: 8,
        name: '物理学系',
        num: 32.97
      },
      {
        sort: 9,
        name: '化学系',
        num: 31.53
      },
      {
        sort: 10,
        name: '生态与环境科学学院',
        num: 28.39
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
      return option.dataset.source.sort((a, b) => b.num - a.num)[0].num;
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
          if (params.data.sort === 1) {
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
          if (data.sort === 1) {
            return `{top1|TOP${data.sort}}{yellowName|${data.name}}{yellowNum|${data.num}}`;
          } else {
            return `{notop1|TOP${data.sort}}{blueName|${data.name}}{blueNum|${data.num}}`;
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
