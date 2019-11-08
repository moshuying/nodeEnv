/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2019-11-08 19:25:03
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :使用说明
 */

const { SimpleVal } = require('./value')

let windowObj = null
let globalObj = null

try {
  windowObj = window
} catch (e) {}

try {
  globalObj = global
} catch (e) {}

const standardMap = {
  // Function properties
  isFinite: new SimpleVal(isFinite),
  isNaN: new SimpleVal(isNaN),
  parseFloat: new SimpleVal(parseFloat),
  parseInt: new SimpleVal(parseInt),
  decodeURI: new SimpleVal(decodeURI),
  decodeURIComponent: new SimpleVal(decodeURIComponent),
  encodeURI: new SimpleVal(encodeURI),
  encodeURIComponent: new SimpleVal(encodeURIComponent),

  // Fundamental objects
  Object: new SimpleVal(Object),
  Function: new SimpleVal(Function),
  Boolean: new SimpleVal(Boolean),
  Symbol: new SimpleVal(Symbol),
  Error: new SimpleVal(Error),
  EvalError: new SimpleVal(EvalError),
  RangeError: new SimpleVal(RangeError),
  ReferenceError: new SimpleVal(ReferenceError),
  SyntaxError: new SimpleVal(SyntaxError),
  TypeError: new SimpleVal(TypeError),
  URIError: new SimpleVal(URIError),

  // Numbers and dates
  Number: new SimpleVal(Number),
  Math: new SimpleVal(Math),
  Date: new SimpleVal(Date),

  // Text processing
  String: new SimpleVal(String),
  RegExp: new SimpleVal(RegExp),

  // Indexed collections
  Array: new SimpleVal(Array),
  Int8Array: new SimpleVal(Int8Array),
  Uint8Array: new SimpleVal(Uint8Array),
  Uint8ClampedArray: new SimpleVal(Uint8ClampedArray),
  Int16Array: new SimpleVal(Int16Array),
  Uint16Array: new SimpleVal(Uint16Array),
  Int32Array: new SimpleVal(Int32Array),
  Uint32Array: new SimpleVal(Uint32Array),
  Float32Array: new SimpleVal(Float32Array),
  Float64Array: new SimpleVal(Float64Array),

  // Structured data
  ArrayBuffer: new SimpleVal(ArrayBuffer),
  DataView: new SimpleVal(DataView),
  JSON: new SimpleVal(JSON),
  
  // // Other
  window: new SimpleVal(windowObj),
  global: new SimpleVal(globalObj),
  console: new SimpleVal(console),
  setTimeout: new SimpleVal(setTimeout),
  clearTimeout: new SimpleVal(clearTimeout),
  setInterval: new SimpleVal(setInterval),
  clearInterval: new SimpleVal(clearInterval)
}

module.exports = standardMap
