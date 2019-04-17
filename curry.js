function curry(fn, ...args) {
  const length = fn.length; //函数参数个数
  let lists = args || [];
  let listLen;
  return function(..._args) {
    lists = [...lists, ..._args];
    listLen = lists.length;
    if (listLen < length) {
      const that = lists;
      lists = [];
      return curry(fn, ...that);
    } else if (listLen === length) {
      const that = lists;
      lists = [];
      return fn.apply(this, that);
    }
  };
}

var add = (a, b, c, d) => a + b + c;
add(1, 2, 3); // 6

var curryAdd = curry(add);
// 以下输出结果都相同
curryAdd(1, 2, 3); // 6
curryAdd(1, 2)(3); // 6
curryAdd(1)(2)(3); // 6
curryAdd(1)(2, 3); // 6
