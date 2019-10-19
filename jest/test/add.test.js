const add = require('../src/add')
// const add =(a,b)=> a+b

describe("加法函数测试",()=>{
    test("1+1等于2",()=>{
        expect(add(1,1)).toBe(2)
    })
})