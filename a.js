const data = [
  ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
  ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
  ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
  ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
  ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1],
]

// 将data转化为key-value类型数组
const keys = data[0]
const values = data.slice(1)

console.log(keys)
console.log(values)


values.map((value)=>{
    return value.map((v,idx)=>{
        const obj = new Object()
        obj[keys[idx]] = v
    })
})
