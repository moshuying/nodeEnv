/**
 * @Author :墨抒颖
 * @Date :2020-05-08 11:49:45
 * @LastEditTime :2020-05-08 12:03:17
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
const nodeHandler = require('./esV')
// const Parser = require('./parser')
const Parser = require('./acronParser')

class js2run {
  constructor(code = "", extraDeclaration = {}) {
    this.code = code;
    this.extraDeclaration = extraDeclaration;
    this.ast = Parser.parse(code);
    this.nodeIterator = null;
    this.init();
  }

  init() {
    const globalScope = new Scope("function");
    Object.keys(this.extraDeclaration).forEach(key => {
      globalScope.addDeclaration(key, this.extraDeclaration[key]);
    });
    this.nodeIterator = new NodeIterator(null, globalScope);
  }

  run() {
    return this.nodeIterator.traverse(this.ast);
  }
}
class NodeIterator {
  constructor (node, scope) {
    this.node = node
    this.scope = scope
    this.nodeHandler = nodeHandler
  }

  traverse (node, options = {}) {
    const scope = options.scope || this.scope
    const nodeIterator = new NodeIterator(node, scope)
    const _eval = this.nodeHandler[node.type]
    if (!_eval) {
      throw new Error(`[js2run]: Unknown node type "${node.type}".`)
    }
    return _eval(nodeIterator)
  }

  createScope (blockType = 'block') {
    return new Scope(blockType, this.scope)
  }
}
/**
 * 创建一个普通变量值
 *
 * @class
 * @param any value 值
 * @param string kind 变量定义符（var, let, const）
 * @method set 设置值
 * @method get 获取值
 */
class SimpleVal {
  constructor(value, kind = "") {
    this.value = value;
    this.kind = kind;
  }

  set(value) {
    // 禁止重新对const类型变量赋值
    if (this.kind === "const") {
      throw new TypeError("Assignment to constant variable");
    } else {
      this.value = value;
    }
  }

  get() {
    return this.value;
  }
}

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
class Scope {
  constructor(type, parentScope) {
    this.type = type;
    this.parentScope = parentScope;
    this.globalDeclaration = standardMap;
    this.declaration = Object.create(null); // 每次都新建一个全新的作用域
  }

  addDeclaration(name, value) {
    this.globalDeclaration[name] = new SimpleVal(value);
  }

  get(name) {
    if (this.declaration[name]) {
      return this.declaration[name];
    } else if (this.parentScope) {
      return this.parentScope.get(name);
    } else if (this.globalDeclaration[name]) {
      return this.globalDeclaration[name];
    }
    throw new ReferenceError(`${name} is not defined`);
  }

  set(name, value) {
    if (this.declaration[name]) {
      this.declaration[name].set(value);
    } else if (this.parentScope) {
      this.parentScope.set(name, value);
    } else if (this.globalDeclaration[name]) {
      return this.globalDeclaration.set(name, value);
    } else {
      throw new ReferenceError(`${name} is not defined`);
    }
  }

  declare(name, value, kind = "var") {
    if (kind === "var") {
      return this.varDeclare(name, value);
    } else if (kind === "let") {
      return this.letDeclare(name, value);
    } else if (kind === "const") {
      return this.constDeclare(name, value);
    } else {
      throw new Error(`js2run: Invalid Variable Declaration Kind of "${kind}"`);
    }
  }

  varDeclare(name, value) {
    let scope = this;
    // 若当前作用域存在非函数类型的父级作用域时，就把变量定义到父级作用域
    while (scope.parentScope && scope.type !== "function") {
      scope = scope.parentScope;
    }
    scope.declaration[name] = new SimpleVal(value, "var");
    return scope.declaration[name];
  }

  letDeclare(name, value) {
    // 不允许重复定义
    if (this.declaration[name]) {
      throw new SyntaxError(`Identifier ${name} has already been declared`);
    }
    this.declaration[name] = new SimpleVal(value, "let");
    return this.declaration[name];
  }

  constDeclare(name, value) {
    // 不允许重复定义
    if (this.declaration[name]) {
      throw new SyntaxError(`Identifier ${name} has already been declared`);
    }
    this.declaration[name] = new SimpleVal(value, "const");
    return this.declaration[name];
  }
}
module.exports = js2run;