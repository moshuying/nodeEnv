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

const func = (el)=>{console.log(el)}
let codeStr = `func(99)`

new Js2Run(codeStr,{func}).run()
```
