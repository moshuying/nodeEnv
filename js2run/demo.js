/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:33:18
 * @LastEditTime :2019-11-08 19:52:30
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :Js2Run传入代码串即可运行
 */
const Js2Run = require('./src')
try {
  global.Js2Run = Js2Run
} catch (e) {}

try {
  window.Js2Run = Js2Run
} catch (e) {}

const func = (el)=>{console.log(el)}
let codeStr = `func(99)`
// eval(codeStr)
new Js2Run(codeStr,{func}).run()

