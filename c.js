const linearColor = [
  ['#60B0FF', '#297AFC'],
  ['#FFD300', '#F29318'],
  ['#0DD491', '#07A872'],
  ['#FF98A9', '#FF98A9'],
  ['#D69FFF', '#AE6FDE'],
  ['#75F3FF', '#50D6E3'],
  ['#FF9191', '#FF9191'],
]

const c = linearColor.map(c => {
  return c.join('-')
})

console.log(c.join('&'))
