option = {
  xAxis: {
    type: 'category'
  },
  yAxis: {},
  series: [
    {
      symbolSize: (value)=>value[1],
      data: [
        ["省级区域1", 89],
        ["省级区域2", 188],
        ["省级区域3", 72],
        ["省级区域4", 103],
        ["省级区域5", 165],
      ],
      type: 'scatter',
      itemStyle:{
        color: 'rgba(56, 156, 255, 0.20)',
        borderColor: '#389CFF',
        borderWidth: 1
      }
    }
  ]
};