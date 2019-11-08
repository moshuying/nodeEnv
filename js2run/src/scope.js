/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2019-11-08 19:26:45
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @this:管理作用域
 * @Use :每次对节点的处理，都要考虑其作用域的问题。Scope实例会定义该作用域为函数作用域（function）或者块级作用域（block）。
 * 每次新建Scope实例，都会为当前节点创建一个全新的“作用域变量空间”（declaration），任何在此作用域内定义的变量都会存放在这个空间当中
 * 此外，新建Scope实例也会保存其父级作用域。
 */

const standardMap = require("./standard");
const { SimpleVal } = require("./value");

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

module.exports = Scope;
