/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2019-11-08 19:28:53
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @this: js2run类
 * @Use :传入字符串形式的es5代码，可选的新增全局变量,运行`.run()`方法即可输出运行结果
 * eg: new js2run('console.log("Hello World!")').run()
 */

const { Parser } = require("acorn");
const NodeIterator = require("./iterator");
const Scope = require("./scope");

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

module.exports = js2run;
