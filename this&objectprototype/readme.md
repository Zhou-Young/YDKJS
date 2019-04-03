# 问题

你的使用模式越复杂，你就会越清晰地看到：将执行环境作为一个明确参数传递，通常比传递 this 执行环境要乱。当我们探索对象和原型时，你将会看到一组可以自动引用恰当执行环境对象的函数是多么有用？？

## call apply bind

**call** ：`fun.call(thisArg, arg1, arg2, ...)`

返回值：使用调用者提供的 this 值和参数调用该函数的返回值。若该方法没有返回值，则返回 undefined。

**apply** ：`func.apply(thisArg, [argsArray])`

返回值：调用有指定 this 值和参数的函数的结果。

```javascript
function foo(x, y) {
  console.log(this.a, x, y);
}
var obj = {
  a: 2
};
foo.call(obj, 1, 2); // 2 1 2
foo.apply(obj, [1, 2]); // 2 1 2
```

**bind** ：`function.bind(thisArg[, arg1[, arg2[, ...]]])`

返回值：一个原函数的拷贝，并拥有指定的 this 值和初始参数。
原理上就是把 apply 封装到了函数里面

```javascript
// 简单的 `bind` 帮助函数
Function.prototype.bind = function(obj) {
  const fn = this; //foo有个属性是bind  调用foo.bind()时，this是指向foo的
  return function() {
    return fn.apply(obj, arguments);
  };
};

function foo(x, y) {
  console.log(this.a, x, y);
}
var obj = {
  a: 2
};
fn = foo.bind(obj, 1, 2); // 2 1 2
fn();
```

### 区别与联系：

call 和 apply 都可以绑定 this，且返回绑定 this 后的函数结果，但是他们传递的参数格式不同（call 传入单个参数，apply 传入数组）

bind 相当于对 apply 进行了进一步的封装，在作为对象的属性，返回值是一个原函数的拷贝函数，需要进一步调用

### 拓展：

#### 类数组转数组

```javascript
//用call绑定slice的this
Array.prototype.slice.call({ 0: "a", 1: "b", length: 2 });
//或者
function list() {
  return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]  因为argument会把参数转换成类数组，所以可以这样写

//用bind简化??该过程
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);

function list() {
  return slice(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]
```

#### 数组展开/柯里化 （传入空 this）

如果你传递 null 或 undefined 作为 call、apply 或 bind 的 this 绑定参数，那么这些值会被忽略掉，取而代之的是 默认绑定 规则将适用于这个调用。

一个很常见的做法是，使用 apply(..) 来将一个数组散开，从而作为函数调用的参数。相似地，bind(..) 可以柯里化参数（预设值），也可能非常有用。

```javascript
function foo(a, b) {
  console.log("a:" + a + ", b:" + b);
}

ø = Object.create(null);

// 将数组散开作为参数
foo.apply(ø, [2, 3]); // a:2, b:3

// 用 `bind(..)` 进行柯里化
var bar = foo.bind(null, 2);
bar(3); // a:2, b:3
```

## API 调用的“环境”

确实，许多库中的函数，和许多在 JavaScript 语言以及宿主环境中的内建函数，都提供一个可选参数，通常称为“环境（context）”，这种设计作为一种替代方案来确保你的回调函数使用特定的 this 而不必非得使用 bind(..)。

举例来说：

```javascript
function foo(el) {
  console.log(el, this.id);
}

var obj = {
  id: "awesome"
};

// 使用 `obj` 作为 `this` 来调用 `foo(..)`
[1, 2, 3].forEach(foo, obj); // 1 awesome  2 awesome  3 awesome
```

从内部来说，几乎可以确定这种类型的函数是通过 call(..) 或 apply(..) 来使用 明确绑定 以节省你的麻烦。

<font color="red">所以很多数组方法后面都有个参数是 userthis</font>。

## 判定 this 规则

现在，我们可以按照优先顺序来总结一下从函数调用的调用点来判定 this 的规则了。按照这个顺序来问问题，然后在第一个规则适用的地方停下。

- 函数是通过 new 被调用的吗（new 绑定）？如果是，this 就是新构建的对象。

  `var bar = new foo()`

- 函数是通过 call 或 apply 被调用（明确绑定），甚至是隐藏在 bind 硬绑定 之中吗？如果是，this 就是那个被明确指定的对象。

  `var bar = foo.call( obj2 )`

- 函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（隐含绑定）？如果是，this 就是那个环境对象。

  `var bar = obj1.foo()`

- 否则，使用默认的 this（默认绑定）。如果在 strict mode 下，就是 undefined，否则是 global 对象。

  `var bar = foo()`

以上，就是理解对于普通的函数调用来说的 this 绑定规则 所需的全部。是的……几乎是全部。

注意**隐含丢失**的情况

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

obj.foo(); // 2

//---------------------------

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

var bar = obj.foo; // 函数引用！

var a = "oops, global"; // `a` 也是一个全局对象的属性

bar(); // "oops, global"
```

## 复习

为执行中的函数判定 this 绑定需要找到这个函数的直接调用点。找到之后，四种规则将会以这种优先顺序施用于调用点：

通过 new 调用？使用新构建的对象。

通过 call 或 apply（或 bind）调用？使用指定的对象。

通过持有调用的环境对象调用？使用那个环境对象。

默认：strict mode 下是 undefined，否则就是全局对象。

小心偶然或不经意的 默认绑定 规则调用。如果你想“安全”地忽略 this 绑定，一个像 ø = Object.create(null) 这样的“DMZ”对象是一个很好的占位值，以保护 global 对象不受意外的副作用影响。

与这四种绑定规则不同，ES6 的箭头方法使用词法作用域来决定 this 绑定，这意味着它们采用封闭他们的函数调用作为 this 绑定（无论它是什么）。它们实质上是 ES6 之前的 self = this 代码的语法替代品。