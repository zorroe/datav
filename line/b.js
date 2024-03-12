const data = [
  {
    fsn: 2021,
    wjyydm: "1",
    wjyy: "学业问题",
    sl: 35,
  },
  {
    fsn: 2021,
    wjyydm: "12",
    wjyy: "精神障碍",
    sl: 28,
  },
  {
    fsn: 2021,
    wjyydm: "4",
    wjyy: "家庭关系",
    sl: 20,
  },
  {
    fsn: 2021,
    wjyydm: "3",
    wjyy: "恋爱关系",
    sl: 11,
  },
  {
    fsn: 2021,
    wjyydm: "9",
    wjyy: "早年创伤",
    sl: 11,
  },
  {
    fsn: 2021,
    wjyydm: "5",
    wjyy: "同伴关系",
    sl: 10,
  },
  {
    fsn: 2021,
    wjyydm: "2",
    wjyy: "就业问题",
    sl: 7,
  },
  {
    fsn: 2021,
    wjyydm: "10",
    wjyy: "急性应激",
    sl: 6,
  },
  {
    fsn: 2021,
    wjyydm: "6",
    wjyy: "师生关系",
    sl: 5,
  },
  {
    fsn: 2021,
    wjyydm: "7",
    wjyy: "适应问题",
    sl: 2,
  },
  {
    fsn: 2021,
    wjyydm: "8",
    wjyy: "经济压力",
    sl: 1,
  },
  {
    fsn: 2021,
    wjyydm: "11",
    wjyy: "身体疾患",
    sl: 1,
  },
  {
    fsn: 2022,
    wjyydm: "1",
    wjyy: "学业问题",
    sl: 33,
  },
  {
    fsn: 2022,
    wjyydm: "12",
    wjyy: "精神障碍",
    sl: 33,
  },
  {
    fsn: 2022,
    wjyydm: "10",
    wjyy: "急性应激",
    sl: 31,
  },
  {
    fsn: 2022,
    wjyydm: "4",
    wjyy: "家庭关系",
    sl: 28,
  },
  {
    fsn: 2022,
    wjyydm: "9",
    wjyy: "早年创伤",
    sl: 20,
  },
  {
    fsn: 2022,
    wjyydm: "3",
    wjyy: "恋爱关系",
    sl: 13,
  },
  {
    fsn: 2022,
    wjyydm: "5",
    wjyy: "同伴关系",
    sl: 11,
  },
  {
    fsn: 2022,
    wjyydm: "2",
    wjyy: "就业问题",
    sl: 9,
  },
  {
    fsn: 2022,
    wjyydm: "7",
    wjyy: "适应问题",
    sl: 7,
  },
  {
    fsn: 2022,
    wjyydm: "6",
    wjyy: "师生关系",
    sl: 3,
  },
  {
    fsn: 2022,
    wjyydm: "11",
    wjyy: "身体疾患",
    sl: 3,
  },
  {
    fsn: 2022,
    wjyydm: "8",
    wjyy: "经济压力",
    sl: 2,
  },
  {
    fsn: 2023,
    wjyydm: "1",
    wjyy: "学业问题",
    sl: 32,
  },
  {
    fsn: 2023,
    wjyydm: "12",
    wjyy: "精神障碍",
    sl: 31,
  },
  {
    fsn: 2023,
    wjyydm: "4",
    wjyy: "家庭关系",
    sl: 21,
  },
  {
    fsn: 2023,
    wjyydm: "9",
    wjyy: "早年创伤",
    sl: 12,
  },
  {
    fsn: 2023,
    wjyydm: "3",
    wjyy: "恋爱关系",
    sl: 10,
  },
  {
    fsn: 2023,
    wjyydm: "10",
    wjyy: "急性应激",
    sl: 9,
  },
  {
    fsn: 2023,
    wjyydm: "5",
    wjyy: "同伴关系",
    sl: 9,
  },
  {
    fsn: 2023,
    wjyydm: "7",
    wjyy: "适应问题",
    sl: 6,
  },
  {
    fsn: 2023,
    wjyydm: "6",
    wjyy: "师生关系",
    sl: 5,
  },
  {
    fsn: 2023,
    wjyydm: "2",
    wjyy: "就业问题",
    sl: 4,
  },
  {
    fsn: 2023,
    wjyydm: "8",
    wjyy: "经济压力",
    sl: 3,
  },
  {
    fsn: 2023,
    wjyydm: "11",
    wjyy: "身体疾患",
    sl: 2,
  },
];

// 第一步，根据 wjyy 将数据归类，并计算 wjyydm 的和
const groupedData = data.reduce((acc, cur) => {
  if (!acc[cur.wjyy]) {
    acc[cur.wjyy] = { sum: 0, items: [] };
  }
  acc[cur.wjyy].sum += parseInt(cur.sl, 10); // 累加 wjyydm
  acc[cur.wjyy].items.push(cur); // 将当前项添加到对应的数组中
  return acc;
}, {});

// 第二步，根据 wjyydm 总和对 groupedData 进行排序
const sortedGroups = Object.entries(groupedData).sort((a, b) => {
  return b[1].sum - a[1].sum; // 降序排序
});

// 第三步，将排序后的组数据转换回原始数组结构
const sortedData = sortedGroups.reduce((acc, cur) => {
  return acc.concat(cur[1].items); // 将所有分组的项添加到结果数组中
}, []);

console.log(sortedData);
