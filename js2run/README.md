# js2run
---
一个js解释器(把代码转化成AST的工具叫做编译器,能够把AST翻译成目标语言并运行的工具叫做解释器),能够运行字符串形式的动态代码,绕过一些平台的限制,解释器已经较为完善的解决了变量类型定义,作用域处理,标准库注入,关键字/标识符/字符节点/表达式/函数节点/函数表达式/循环/new/this/if等一系列代码,可以正常使用,效果接近eval
## demo
```js
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
```
## 打包为单文件
```sh
npm run build
```
