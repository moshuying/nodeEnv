/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-11-08 19:24:28
 * @LastEditTime :2020-05-08 16:47:10
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Use :节点处理器，处理AST当中的节点
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

class MemberVal {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }

  set(value) {
    this.obj[this.prop] = value;
  }

  get() {
    return this.obj[this.prop];
  }
}

const NodeHandler = {
  Program(nodeEL) {
    for (const node of nodeEL.node.body) {
      nodeEL.traverse(node);
    }
  },
  VariableDeclaration(nodeEL) {
    const kind = nodeEL.node.kind;
    for (const declaration of nodeEL.node.declarations) {
      const { name } = declaration.id;
      const value = declaration.init
        ? nodeEL.traverse(declaration.init)
        : undefined;
      if (nodeEL.scope.type === "block" && kind === "var") {
        nodeEL.scope.parentScope.declare(name, value, kind);
      } else {
        nodeEL.scope.declare(name, value, kind);
      }
    }
  },
  Identifier(nodeEL) {
    if (nodeEL.node.name === "undefined") {
      return undefined;
    }
    return nodeEL.scope.get(nodeEL.node.name).value;
  },
  Literal(nodeEL) {
    return nodeEL.node.value;
  },

  ExpressionStatement(nodeEL) {
    return nodeEL.traverse(nodeEL.node.expression);
  },
  CallExpression(nodeEL) {
    const func = nodeEL.traverse(nodeEL.node.callee);
    const args = nodeEL.node.arguments.map(arg =>
      nodeEL.traverse(arg)
    );

    let value;
    if (nodeEL.node.callee.type === "MemberExpression") {
      value = nodeEL.traverse(nodeEL.node.callee.object);
    }
    return func.apply(value, args);
  },
  MemberExpression(nodeEL) {
    const obj = nodeEL.traverse(nodeEL.node.object);
    const name = nodeEL.node.property.name;
    return obj[name];
  },
  ObjectExpression(nodeEL) {
    const obj = {};
    for (const prop of nodeEL.node.properties) {
      let key;
      if (prop.key.type === "Literal") {
        key = `${prop.key.value}`;
      } else if (prop.key.type === "Identifier") {
        key = prop.key.name;
      } else {
        throw new Error(
          `[js2run]: [ObjectExpression] Unsupported property key type "${prop.key.type}"`
        );
      }
      obj[key] = nodeEL.traverse(prop.value);
    }
    return obj;
  },
  ArrayExpression(nodeEL) {
    return nodeEL.node.elements.map(ele => nodeEL.traverse(ele));
  },

  BlockStatement(nodeEL) {
    let scope = nodeEL.createScope("block");

    // 处理块级节点内的每一个节点
    for (const node of nodeEL.node.body) {
      if (node.type === "FunctionDeclaration") {
        nodeEL.traverse(node, { scope });
      } else if (node.type === "VariableDeclaration" && node.kind === "var") {
        for (const declaration of node.declarations) {
          if (declaration.init) {
            scope.declare(
              declaration.id.name,
              nodeEL.traverse(declaration.init, { scope }),
              node.kind
            );
          } else {
            scope.declare(declaration.id.name, undefined, node.kind);
          }
        }
      }
    }

    for (const node of nodeEL.node.body) {
      if (node.type === "FunctionDeclaration") {
        continue;
      }
      const signal = nodeEL.traverse(node, { scope });
      if (Signal.isSignal(signal)) {
        return signal;
      }
    }
  },
  FunctionDeclaration(nodeEL) {
    const fn = NodeHandler.FunctionExpression(nodeEL);
    nodeEL.scope.varDeclare(nodeEL.node.id.name, fn);
    return fn;
  },
  FunctionExpression(nodeEL) {
    const node = nodeEL.node;
    const fn = function() {
      const scope = nodeEL.createScope("function");
      scope.constDeclare("this", this);
      scope.constDeclare("arguments", arguments);

      node.params.forEach((param, index) => {
        const name = param.name;
        scope.varDeclare(name, arguments[index]);
      });

      const signal = nodeEL.traverse(node.body, { scope });
      if (Signal.isReturn(signal)) {
        return signal.value;
      }
    };

    Object.defineProperties(fn, {
      name: { value: node.id ? node.id.name : "" },
      length: { value: node.params.length }
    });

    return fn;
  },
  ThisExpression(nodeEL) {
    const value = nodeEL.scope.get("this");
    return value ? value.value : null;
  },
  NewExpression(nodeEL) {
    const func = nodeEL.traverse(nodeEL.node.callee);
    const args = nodeEL.node.arguments.map(arg =>
      nodeEL.traverse(arg)
    );
    return new (func.bind(null, ...args))();
  },

  UpdateExpression(nodeEL) {
    let { value } = nodeEL.scope.get(nodeEL.node.argument.name);
    if (nodeEL.node.operator === "++") {
      nodeEL.node.prefix ? ++value : value++;
    } else {
      nodeEL.node.prefix ? --value : value--;
    }
    nodeEL.scope.set(nodeEL.node.argument.name, value);
    return value;
  },
  AssignmentExpressionOperatortraverseMap: {
    "=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] = v)
        : (value.value = v),
    "+=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] += v)
        : (value.value += v),
    "-=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] -= v)
        : (value.value -= v),
    "*=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] *= v)
        : (value.value *= v),
    "/=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] /= v)
        : (value.value /= v),
    "%=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] %= v)
        : (value.value %= v),
    "**=": () => {
      throw new Error("[js2run]: es5 doen't supports operator \"**=");
    },
    "<<=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] <<= v)
        : (value.value <<= v),
    ">>=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] >>= v)
        : (value.value >>= v),
    ">>>=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] >>>= v)
        : (value.value >>>= v),
    "|=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] |= v)
        : (value.value |= v),
    "^=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] ^= v)
        : (value.value ^= v),
    "&=": (value, v) =>
      value instanceof MemberVal
        ? (value.obj[value.prop] &= v)
        : (value.value &= v)
  },
  AssignmentExpression(nodeEL) {
    const node = nodeEL.node;
    const value = getIdentifierOrMemberExpressionValue(node.left, nodeEL);
    return NodeHandler.AssignmentExpressionOperatortraverseMap[node.operator](
      value,
      nodeEL.traverse(node.right)
    );
  },
  UnaryExpressionOperatortraverseMap: {
    "-": nodeEL => -nodeEL.traverse(nodeEL.node.argument),
    "+": nodeEL => +nodeEL.traverse(nodeEL.node.argument),
    "!": nodeEL => !nodeEL.traverse(nodeEL.node.argument),
    "~": nodeEL => ~nodeEL.traverse(nodeEL.node.argument),
    typeof: nodeEL => {
      if (nodeEL.node.argument.type === "Identifier") {
        try {
          const value = nodeEL.scope.get(nodeEL.node.argument.name);
          return value ? typeof value.value : "undefined";
        } catch (err) {
          if (
            err.message === `${nodeEL.node.argument.name} is not defined`
          ) {
            return "undefined";
          } else {
            throw err;
          }
        }
      } else {
        return typeof nodeEL.traverse(nodeEL.node.argument);
      }
    },
    void: nodeEL =>
      void nodeEL.traverse(nodeEL.node.argument),
    delete: nodeEL => {
      const argument = nodeEL.node.argument;
      if (argument.type === "MemberExpression") {
        const obj = nodeEL.traverse(argument.object);
        const name = getPropertyName(argument, nodeEL);
        return delete obj[name];
      } else if (argument.type === "Identifier") {
        return false;
      } else if (argument.type === "Literal") {
        return true;
      }
    }
  },
  UnaryExpression(nodeEL) {
    return NodeHandler.UnaryExpressionOperatortraverseMap[
      nodeEL.node.operator
    ](nodeEL);
  },
  BinaryExpressionOperatortraverseMap: {
    "==": (a, b) => a == b,
    "!=": (a, b) => a != b,
    "===": (a, b) => a === b,
    "!==": (a, b) => a !== b,
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "<<": (a, b) => a << b,
    ">>": (a, b) => a >> b,
    ">>>": (a, b) => a >>> b,
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "**": (a, b) => {
      throw new Error('[js2run]: es5 doesn\'t supports operator "**"');
    },
    "|": (a, b) => a | b,
    "^": (a, b) => a ^ b,
    "&": (a, b) => a & b,
    in: (a, b) => a in b,
    instanceof: (a, b) => a instanceof b
  },
  BinaryExpression(nodeEL) {
    const a = nodeEL.traverse(nodeEL.node.left);
    const b = nodeEL.traverse(nodeEL.node.right);
    return NodeHandler.BinaryExpressionOperatortraverseMap[
      nodeEL.node.operator
    ](a, b);
  },
  LogicalExpressionOperatortraverseMap: {
    "||": (a, b) => a || b,
    "&&": (a, b) => a && b
  },
  LogicalExpression(nodeEL) {
    const a = nodeEL.traverse(nodeEL.node.left);
    if (a) {
      if (nodeEL.node.operator == "||") {
        return true;
      }
    } else if (nodeEL.node.operator == "&&") {
      return false;
    }

    const b = nodeEL.traverse(nodeEL.node.right);
    return NodeHandler.LogicalExpressionOperatortraverseMap[
      nodeEL.node.operator
    ](a, b);
  },

  ForStatement(nodeEL) {
    const node = nodeEL.node;
    let scope = nodeEL.scope;
    if (
      node.init &&
      node.init.type === "VariableDeclaration" &&
      node.init.kind !== "var"
    ) {
      scope = nodeEL.createScope("block");
    }

    for (
      node.init && nodeEL.traverse(node.init, { scope });
      node.test ? nodeEL.traverse(node.test, { scope }) : true;
      node.update && nodeEL.traverse(node.update, { scope })
    ) {
      const signal = nodeEL.traverse(node.body, { scope });

      if (Signal.isBreak(signal)) {
        break;
      } else if (Signal.isContinue(signal)) {
        continue;
      } else if (Signal.isReturn(signal)) {
        return signal;
      }
    }
  },
  ForInStatement(nodeEL) {
    const { left, right, body } = nodeEL.node;
    let scope = nodeEL.scope;

    let value;
    if (left.type === "VariableDeclaration") {
      const id = left.declarations[0].id;
      value = scope.declare(id.name, undefined, left.kind);
    } else if (left.type === "Identifier") {
      value = scope.get(left.name, true);
    } else {
      throw new Error(
        `[js2run]: [ForInStatement] Unsupported left type "${left.type}"`
      );
    }

    for (const key in nodeEL.traverse(right)) {
      value.value = key;
      const signal = nodeEL.traverse(body, { scope });

      if (Signal.isBreak(signal)) {
        break;
      } else if (Signal.isContinue(signal)) {
        continue;
      } else if (Signal.isReturn(signal)) {
        return signal;
      }
    }
  },
  WhileStatement(nodeEL) {
    while (nodeEL.traverse(nodeEL.node.test)) {
      const signal = nodeEL.traverse(nodeEL.node.body);

      if (Signal.isBreak(signal)) {
        break;
      } else if (Signal.isContinue(signal)) {
        continue;
      } else if (Signal.isReturn(signal)) {
        return signal;
      }
    }
  },
  DoWhileStatement(nodeEL) {
    do {
      const signal = nodeEL.traverse(nodeEL.node.body);

      if (Signal.isBreak(signal)) {
        break;
      } else if (Signal.isContinue(signal)) {
        continue;
      } else if (Signal.isReturn(signal)) {
        return signal;
      }
    } while (nodeEL.traverse(nodeEL.node.test));
  },

  ReturnStatement(nodeEL) {
    let value;
    if (nodeEL.node.argument) {
      value = nodeEL.traverse(nodeEL.node.argument);
    }
    return Signal.Return(value);
  },
  BreakStatement(nodeEL) {
    let label;
    if (nodeEL.node.label) {
      label = nodeEL.node.label.name;
    }
    return Signal.Break(label);
  },
  ContinueStatement(nodeEL) {
    let label;
    if (nodeEL.node.label) {
      label = nodeEL.node.label.name;
    }
    return Signal.Continue(label);
  },

  IfStatement(nodeEL) {
    if (nodeEL.traverse(nodeEL.node.test)) {
      return nodeEL.traverse(nodeEL.node.consequent);
    } else if (nodeEL.node.alternate) {
      return nodeEL.traverse(nodeEL.node.alternate);
    }
  },
  SwitchStatement(nodeEL) {
    const discriminant = nodeEL.traverse(nodeEL.node.discriminant);

    for (const theCase of nodeEL.node.cases) {
      if (
        !theCase.test ||
        discriminant === nodeEL.traverse(theCase.test)
      ) {
        const signal = nodeEL.traverse(theCase);

        if (Signal.isBreak(signal)) {
          break;
        } else if (Signal.isContinue(signal)) {
          continue;
        } else if (Signal.isReturn(signal)) {
          return signal;
        }
      }
    }
  },
  SwitchCase(nodeEL) {
    for (const node of nodeEL.node.consequent) {
      const signal = nodeEL.traverse(node);
      if (Signal.isSignal(signal)) {
        return signal;
      }
    }
  },
  ConditionalExpression(nodeEL) {
    return nodeEL.traverse(nodeEL.node.test)
      ? nodeEL.traverse(nodeEL.node.consequent)
      : nodeEL.traverse(nodeEL.node.alternate);
  },

  ThrowStatement(nodeEL) {
    throw nodeEL.traverse(nodeEL.node.argument);
  },
  TryStatement(nodeEL) {
    const { block, handler, finalizer } = nodeEL.node;
    try {
      return nodeEL.traverse(block);
    } catch (err) {
      if (handler) {
        const param = handler.param;
        const scope = nodeEL.createScope("block");
        scope.letDeclare(param.name, err);
        return nodeEL.traverse(handler, { scope });
      }
      throw err;
    } finally {
      if (finalizer) {
        return nodeEL.traverse(finalizer);
      }
    }
  },
  CatchClause(nodeEL) {
    return nodeEL.traverse(nodeEL.node.body);
  }
};

function getPropertyName(node, nodeEL) {
  if (node.computed) {
    return nodeEL.traverse(node.property);
  } else {
    return node.property.name;
  }
}

function getIdentifierOrMemberExpressionValue(node, nodeEL) {
  if (node.type === "Identifier") {
    return nodeEL.scope.get(node.name);
  } else if (node.type === "MemberExpression") {
    const obj = nodeEL.traverse(node.object);
    const name = getPropertyName(node, nodeEL);
    return new MemberVal(obj, name);
  } else {
    throw new Error(
      `[js2run]: Not support to get value of node type "${node.type}"`
    );
  }
}

module.exports = NodeHandler;
