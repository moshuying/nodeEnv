/**
 *
 * @param {object|Array} obj 传入需要查询的对象,数组 尽管js不建议用for in遍历数组
 * @param {String|Number|RegExp|function} query 传入查询的字符,数字,正则,方法
 */
const valueFind2 = (obj, query) => {
  const [rearr, path] = [[], []];
  let count = 0;
  let fn = () => {};
  // 检测传入的query的类型 Number会被转化为String,reg则转化为reg.test方法,function则继承function
  typeof query === "function"
    ? (fn = query)
    : typeof query === "object"
    ? (fn = (element, query) => query.test(element + ""))
    : (fn = (element, string) => ("" + element).indexOf("" + string) >= 0);
  // 递归查询传递对象|数字
  const findvalue = (object, query) => {
    const obj = object;
    for (const key in obj) {
      // 这也是没办法的事情...
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        try {
          const el = obj[key];
          if (typeof el === "object") {
            // 判断即将写入的路径是否在path的栈底
            path[0] === undefined
              ? // 在栈底且当传入的对象是一个数字
                Array.isArray(object)
                ? path.push("[" + key + "]")
                : path.push("" + key)
              : path.push("." + key);
            findvalue(el, query);
            // 从递归出来后弹出栈顶路径
            path.pop();
          } else if (fn(el, query)) {
            Array.isArray(obj)
              ? // 当前类型为数组时,返回数组的下标
                (rearr[count] = path.join("") + "[" + key + "]")
              : // 当前类型为string || number 时,返回对象路径
                (rearr[count] =
                  path.join("") + (path.length > 0 ? "." : "") + key);
            // 每寻找到一个符合条件的
            ++count;
          }
        } catch (error) {
          throw new Error("传入类型有误"+error)
        }
      }
    }
    return;
  };
  if((typeof obj ==="number")||(typeof obj === "string")){
    // 说实话直接传数字或者字符然后再写正则和callback还要用这个函数就真的太蠢了
    return (""+obj).indexOf(query)
  }else{
    findvalue(obj, query);
    return rearr;
  }
};
module.exports = valueFind2;
