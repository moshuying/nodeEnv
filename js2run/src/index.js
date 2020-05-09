/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2020-05-09 13:10:24
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @this: js2run类
 * @Use :传入字符串形式的es5代码，可选的新增全局变量,运行`.run()`方法即可输出运行结果
 * eg: new js2run('console.log("Hello World!")').run()
 */

const Js2Run = require("./interpreter");

try {
  global.Js2Run = Js2Run
} catch (e) {}

try {
  window.Js2Run = Js2Run
} catch (e) {}

module.exports = Js2Run;
