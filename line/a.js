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

console.log(data.length);
const d2021 = data.filter((d) => d.fsn === 2021);
const d2022 = data.filter((d) => d.fsn === 2022);
const d2023 = data.filter((d) => d.fsn === 2023);

console.log(d2021.length);
console.log(d2022.length);
console.log(d2023.length);
