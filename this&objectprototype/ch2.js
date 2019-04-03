// // function baz() {
// //   // 调用栈是: `baz`
// //   // 我们的调用点是 global scope（全局作用域）

// //   console.log("baz");
// //   bar(); // <-- `bar` 的调用点
// // }

// // function bar() {
// //   // 调用栈是: `baz` -> `bar`
// //   // 我们的调用点位于 `baz`

// //   console.log("bar");
// //   foo(); // <-- `foo` 的 call-site
// // }

// // function foo() {
// //   // 调用栈是: `baz` -> `bar` -> `foo`
// //   // 我们的调用点位于 `bar`

// //   console.log("foo");
// // }

// // baz(); // <-- `baz` 的调用点
// // console.log("hello");

// if (!Function.prototype.softBind) {
//   Function.prototype.softBind = function(obj) {
//     var fn = this,
//       curried = [].slice.call(arguments, 1),
//       bound = function bound() {
//         return fn.apply(
//           !this ||
//             (typeof window !== "undefined" && this === window) ||
//             (typeof global !== "undefined" && this === global)
//             ? obj
//             : this,
//           curried.concat.apply(curried, arguments)
//         );
//       };
//     bound.prototype = Object.create(fn.prototype);
//     return bound;
//   };
// }

// function foo() {
//   console.log("name: " + this.name);
// }

// var obj = { name: "obj" },
//   obj2 = { name: "obj2" },
//   obj3 = { name: "obj3" };

// var fooOBJ = foo.softBind(obj);

// fooOBJ(); // name: obj

// obj2.foo = foo.softBind(obj);
// obj2.foo(); // name: obj2   <---- 看!!!

// fooOBJ.call(obj3); // name: obj3   <---- 看!

// setTimeout(obj2.foo, 10); // name: obj   <---- 退回到软绑定

// function foo() {
//   // 返回一个箭头函数
//   return a => {
//     // 这里的 `this` 是词法上从 `foo()` 采用的
//     console.log(this.a);
//   };
// }

// var obj1 = {
//   a: 2
// };

// var obj2 = {
//   a: 3
// };

// var bar = foo.call(obj1);
// bar.call(obj2); // 2, 不是3!

// function foo() {
//   console.log(this.a);
// }

// var obj = {
//   a: 2
// };

// foo.bind(obj); // 2
// var a = "oops, global"; // `a` 也是一个全局对象的属性

// setTimeout(foo, 100); // "oops, global"

function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

Function.prototype.yBind = function(obj) {
  const fn = this;
  return function() {
    return fn.apply(obj, arguments);
  };
};

// 简单的 `bind` 帮助函数
function bind(fn, obj) {
  // return function() {
  return fn.apply(obj, arguments);
  // };
}

var obj = {
  a: 2
};

var bar = foo.yBind(obj);

var b = bar(3); // 2 3
console.log(b); // 5
