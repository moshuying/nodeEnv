# js2run
---
一个js解释器
## 打包为单文件
```sh
npm run build
```
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
