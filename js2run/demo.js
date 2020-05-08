/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:33:18
 * @LastEditTime :2020-05-08 12:08:09
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :Js2Run传入代码串即可运行
 */
// const Js2Run = require('./src')
const Js2Run = require('./src/interpreter')
try {
  global.Js2Run = Js2Run
} catch (e) {}

try {
  window.Js2Run = Js2Run
} catch (e) {}

// const func = (el)=>{console.log(el)}
global.temp =(el) =>el**el
let codeStr = `
function fibonacci(n) {
  if(n==0 || n == 1)
      return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
console.log(fibonacci(10))
`
// eval(codeStr)
new Js2Run(codeStr,global).run()

