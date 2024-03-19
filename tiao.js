option = {
    dataset: {
      source: [
        {
          score: 20,
          product: 'Matcha Latte'
        }
      ]
    },
    grid: { containLabel: true },
    xAxis: {
      max: 200,
      inverse: true,
      splitLine:{
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    color: ["white"],
    yAxis: {
      type: 'category',
      position: 'right',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
    },
  
    series: [
      {
        type: 'bar',
        encode: {
          x: 'score',
          y: 'product'
        },
        showBackground: true,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#FF3C35' // 0% 处的颜色
              },
              {
                offset: 0.25,
                color: '#FE8C55'
              },
              {
                offset: 0.35,
                color: '#FBDF69'
              },
              {
                offset: 0.5,
                color: '#5ECD81'
              },
              {
                offset: 1,
                color: '#3B9FF7' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          borderColor: "#FFF",
          borderWidth: 1
        },
        barWidth: 15,
        itemStyle:{
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: [10, 20],
          data: [
            {
              x: 180,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFFFFF' // 0% 处的颜色
                    },
                    {
                      offset: 0.3,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 0.3,
                      color: '#FE8C55'
                    },
                    {
                      offset: 0.7,
                      color: '#FE8C55'
                    },
                    {
                      offset: 0.7,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 1,
                      color: '#FFFFFF' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            {
              x: 220,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFFFFF' // 0% 处的颜色
                    },
                    {
                      offset: 0.3,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 0.3,
                      color: '#FBDF69'
                    },
                    {
                      offset: 0.7,
                      color: '#FBDF69'
                    },
                    {
                      offset: 0.7,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 1,
                      color: '#FFFFFF' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            {
              x: 260,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFFFFF' // 0% 处的颜色
                    },
                    {
                      offset: 0.3,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 0.3,
                      color: '#5ECD81'
                    },
                    {
                      offset: 0.7,
                      color: '#5ECD81'
                    },
                    {
                      offset: 0.7,
                      color: '#FFFFFF'
                    },
                    {
                      offset: 1,
                      color: '#FFFFFF' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }
          ]
        }
      }
    ]
  };
  