/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2019-11-08 19:25:24
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :判断、记录关键标记语句（return, break, continue）
 */

class Signal {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  static Return(value) {
    return new Signal("return", value);
  }

  static Break(label = null) {
    return new Signal("break", label);
  }

  static Continue(label) {
    return new Signal("continue", label);
  }

  static isReturn(signal) {
    return signal instanceof Signal && signal.type === "return";
  }

  static isContinue(signal) {
    return signal instanceof Signal && signal.type === "continue";
  }

  static isBreak(signal) {
    return signal instanceof Signal && signal.type === "break";
  }

  static isSignal(signal) {
    return signal instanceof Signal;
  }
}

module.exports = Signal;
