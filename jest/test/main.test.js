/* eslint-disable no-undef */
const objfind = require("../src/main");
const demo1 = require("../src/testFile").demo1;
const demo2 = require("../src/testFile").demo2;
const demo3 = require("../src/testFile").demo3;
const demo4 = require("../src/testFile").demo4;
const demo5 = require("../src/testFile").demo5;
describe("value反查key测试", () => {
  test("直接传入值和查询字符 obj:{name: 'wang',age: 20,} query:20", () => {
    expect(objfind({ name: "wang", age: 20 }, 20)).toStrictEqual(["age"]);
  });
});
describe("value反查key测试", () => {
  test("直接传入值和查询字符 obj:{name: 'wang',age: 40,},20 query:20 ", () => {
    expect(objfind({ name: "wang", age: 40 }, 20)).toStrictEqual([]);
  });
});
describe("value反查key测试", () => {
  test("直接传入值和查询字符 obj:{name: 'wang',age: 20,address: {city: 'beiji',\
country: 'china',},} query:'i'", () => {
    expect(
      objfind(
        { name: "wang", age: 20, address: { city: "beiji", country: "china" } },
        "i"
      )
    ).toStrictEqual(["address.city", "address.country"]);
  });
});
describe("value反查key测试", () => {
  test("多级嵌套对象查询 query: zhang", () => {
    expect(objfind(demo1, "zhang")).toStrictEqual([
      "next.next.next.next.next.next.next.next.next.next.next.next.\
next.next.next.next.next.next.next.next.next.next.next.next.next.name",
      "next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next2.next.name"
    ]);
  });
});
describe("value反查key测试", () => {
  test("对象中包含数组时查询 query: zhang", () => {
    expect(objfind(demo2, "zhang")).toStrictEqual([
      "item1.other.friends[0]",
      "item2.name",
      "item3.other.friends[2]"
    ]);
  });
});
describe("value反查key测试", () => {
  test("正则查询对象中value的数字 query: /[1-9]\\d*/g", () => {
    expect(objfind(demo2, /[1-9]\d*/g)).toStrictEqual([
      "item1.age",
      "item2.age",
      "item3.age"
    ]);
  });
});
describe("value反查key测试", () => {
  test("数字查询对象中value的数字 query: 20", () => {
    expect(objfind(demo3, 20)).toStrictEqual([
      "item1.age",
      "item3.other.friends[1]"
    ]);
  });
});
describe("value反查key测试", () => {
  test("bilibili真实业务代码片段 正则查询所有链接 query:(https?:\\/\\/)([0-9a-z.]+)\
(:[0-9]+)?([/0-9a-z.]+)?(\\?[0-9a-z&=]+)?(#[0-9-a-z]+)? ", () => {
    expect(
      objfind(
        demo4,
        /(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/g
      )
    ).toStrictEqual(["result.list.0.cover", "result.list.0.url"]);
  });
});
describe("value反查key测试", () => {
  test("传入对象类型为数组查询类型为整数 query: 10", () => {
    expect(objfind(demo5, 10)).toStrictEqual([
      "[0]",
      "[2].find.19",
      "[2].find.sp[0]"
    ]);
  });
});

describe("value反查key测试", () => {
  test("传入对象类型为数组查询类型为字符串 query: ss", () => {
    expect(objfind(demo5, "ss")).toStrictEqual(["[2].find.sp[1]"]);
  });
});
describe("value反查key测试", () => {
  test("传入对象类型为数组查询类型为function query: (el,str)=>{ return parseInt(el)>1 } ", () => {
    expect(
      objfind(demo2, el => {
        return parseInt(el) > 1;
      })
    ).toStrictEqual(["item1.age", "item2.age", "item3.age"]);
  });
});
describe("value反查key测试", () => {
  test("其他类型参数 obj:1243 query: 2", () => {
    expect(objfind(1243, "2")).toBe(1);
  });
});
describe("value反查key测试", () => {
  test("其他类型参数 obj:1243sdaf query: daf", () => {
    expect(objfind("1243sdaf", "daf")).toBe(5);
  });
});
