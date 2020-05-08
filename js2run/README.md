# js2run
---
一个js解释器
[parse使用acorn](https://github.com/acornjs/acorn/tree/master/acorn)
[打包使用parcel](https://github.com/parcel-bundler/parcel)
示例文件在demo.js和index.html
支持在浏览器和node环境中使用
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
