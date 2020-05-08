/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:33:18
 * @LastEditTime :2020-05-08 16:52:20
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :Js2Run传入代码串即可运行
 */
const Js2Run = require('./src')

let codeStr = `
function func(el){
  console.log(el*el)
}
func(10)
`
new Js2Run(codeStr).run()

