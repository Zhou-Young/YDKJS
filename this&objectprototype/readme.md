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

## 对象

### 万物不一定都是对象

简单基本类型 （string、number、boolean、null、和 undefined）自身 不是 object

更简单的字面形式几乎是所有人的首选。仅仅在你需要使用额外的选项时使用构建形式

### 属性描述符

- **可写性（writable）**：是否可以改变属性值
- **可配置性（configurable）**：属性是否可配置
  - configurable:false  会组织delete删除属性（delete只删除自身属性，不找原型链）
- **可枚举性（enumerable）**：是否能在for..in中循环
- **不可变性（immutability）**：属性或对象不可变，浅不可变

**对象常量**：writable:false 与 configurable:false

**防止扩展（Prevent Extensions）**：防止一个对象被添加新的属性，但另一方面保留其他既存的对象属性，可以调用 Object.preventExtensions(..)：

**封印（seal）**：Object.seal(..) 相当于在当前的对象上调用 Object.preventExtensions(..)，同时也将它所有的既存属性标记为 configurable:false

**冻结（freeze）**：Object.freeze(..) 相当于在当前的对象上调用 Object.seal(..)，同时也将它所有的“数据访问”属性设置为 writable:false，所以它们的值不可改变。

**[\[GET]]**：检查对象是否含有某个属性（会沿原型链寻找

**[\[PUT]]**：如果属性存在，[\[Put]] 算法将会大致检查：

- 这个属性是访问器描述符吗（见下一节"Getters 与 Setters"）？如果是，而且是 setter，就调用 setter。
- 这个属性是 writable 为 false 数据描述符吗？如果是，在非 strict mode 下无声地失败，或者在 strict mode 下抛出 TypeError。
- 否则，像平常一样设置既存属性的值。
- 
如果属性在当前的对象中还不存在，[\[Put]] 操作会变得更微妙和复杂。

**get/set**:

```javascript
var myObject = {
  // 为 `a` 定义 getter
  get a() {
  return this._a_;
  },

  // 为 `a` 定义 setter
  set a(val) {
    this._a_ = val * 2;
  }
};

myObject.a = 2;

myObject.a; // 4
```

**存在性（existence）**:

```javascript
var myObject = {
	a: 2
};

("a" in myObject);				// true
("b" in myObject);				// false

myObject.hasOwnProperty( "a" );	// true
myObject.hasOwnProperty( "b" );	// false
```

in 操作符会检查**属性**是否存在于对象 中，或者是否存在于 [\[Prototype]] 链对象遍历的更高层中（详见第五章）。相比之下，hasOwnProperty(..) 仅仅 检查 myObject 是否拥有属性，但 不会 查询 [\[Prototype]] 链

**迭代（iteration）**：

for...in迭代属性 for...of迭代值

```javascript
var myObject = {
  a: 2,
  b: 3
};

Object.defineProperty(myObject, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value: function () {
    var o = this;
    var idx = 0;
    var ks = Object.keys(o);
    return {
      next: function () {
        return {
          value: o[ks[idx++]],
          done: (idx > ks.length)
        };
      }
    };
  }
});

// 手动迭代 `myObject`
var it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }

// 用 `for..of` 迭代 `myObject`
for (var v of myObject) {
  console.log(v);
}
// 2
// 3
```

foreach()会迭代所有值，不可跳出循环
every() 和 some() 会跳出

迭代对象属性的顺序不确定

但 @@iterator 本身 不是迭代器对象， 而是一个返回迭代器对象的 **方法**

## 类