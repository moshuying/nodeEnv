"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sayHello(person) {
    return 'Hello, ' + person;
}
let user = 'Tom';
console.log(sayHello(user));
let decLiteral = 6;
let hexLiteral = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral = 0b1010;
// ES6 中的八进制表示法
let octalLiteral = 0o744;
let notANumber = NaN;
let infinityNumber = Infinity;
let myName = 'Tom';
let myAge = 25;
// 模板字符串
let sentence = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
exports.default = {};
