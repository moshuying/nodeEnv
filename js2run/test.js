/**
 * @Author :墨抒颖
 * @Date :2020-05-08 10:20:47
 * @LastEditTime :2020-05-08 11:48:13
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */

 const parse = require('./src/paser')
 let code = 
 `function square(n) {
  return n * n;
}`
let code2 = 
`const squer=(n)=>n*n
`
 console.log(parse.parse(code2).program)