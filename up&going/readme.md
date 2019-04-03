# up & going

## 变量

- 动态类型：变量可以持有任意 类型 的值而没有任何 类型 强制约束

- var 只是声明一个变量，并没有规定变量的类型，所以我们可以随意转换它的类型

- console.log 会将数字隐式转换为字符后输出

- “falsy”的值，因为在强制转换为 boolean 时，它们将变为 false —— 这些值包括 0 和""。任何不再这个 falsy 列表中的值都自动是“truthy

在 JavaScript 中“**falsy**”的明确列表如下：

- "" （空字符串）
- 0, -0, NaN （非法的 number）
- null, undefined
- false

为了将这许多细节归纳为一个简单的包装，并帮助你在各种情况下**判断是否使用 == 或 ===**，这是我的简单规则：

- 如果一个比较的两个值之一可能是 true 或 false 值，避免 == 而使用 ===。
- 如果一个比较的两个值之一可能是这些具体的值（0，""，或[] —— 空数组），避免==而使用 ===。
- 在 所有 其他情况下，你使用 == 是安全的。它不仅安全，而且在许多情况下它可以简化你的代码并改善可读性。

如果你在比较两个非基本类型值，比如 object（包括 function 和 array），那么你应当特别小心== 和 ===的比较规则。因为这些值实际上是通过引用持有的， == 和 === 比较都将简单地检查这个引用是否相同，而不是它们底层的值。

例如，array 默认情况下会通过使用逗号（,）连接所有值来被强制转换为 string。你可能认为两个内容相同的 array 将是==相等的，但它们不是：

```javascript
var a = [1, 2, 3];
var b = [1, 2, 3];
var c = "1,2,3";

a == c; // true
b == c; // true
a == b; // false
```

> 如果<比较的两个值都是 string，就像 b < c，那么这个比较将会以字典顺序（也就是像字典中字母的排列顺序）进行。但如果两个值之一不是 string，就像 a < b，那么两个值就将被强制转换成 number，并进行一般的数字比较。

```javascript
var a = 42;
var b = "foo";

a < b; // false
a > b; // false
a == b; // false
```

等一下，这三个比较怎么可能都是 false？因为在<和>的比较中，值 b 被强制转换为了“非法的数字值”，而且语言规范说 NaN 既不大于其他值，也不小于其他值

## 立即被调用的函数表达式（IIFE）

因为 IIFE 只是一个函数，而函数可以创建变量 作用域，以这样的风格使用一个 IIFE 经常被用于定义变量，而这些变量将不会影响围绕在 IIFE 外面的代码：

```javascript
var a = 42;

(function IIFE(){
var a = 10;
console.log( a ); // 10
})();

console.log( a ); // 42
IIFE 还可以有返回值：

var x = (function IIFE(){
return 42;
})();

x; // 42
```

值 42 从被执行的命名为 IIFE 的函数中 return，然后被赋值给 x。

## 闭包

> 是这样一种方法：即使函数已经完成了运行，它依然可以“记住”并持续访问函数的作用域。

## new 操作符执行了什么操作？

new 共经历了四个过程。

```javascript
var fn = function() {};
var fnObj = new fn();
```

1. 创建了一个空对象

```javascript
var obj = new object();
```

2. 设置原型链

```javascript
obj._proto_ = fn.prototype;
```

3. 让 fn 的 this 指向 obj，并执行 fn 的函数体

```javascript
var result = fn.call(obj);
```

4. 判断 fn 的返回值类型，如果是值类型，返回 obj。如果是引用类型，就返回这个引用类型的对象。

```javascript
if (typeof result == "object") {
  fnObj = result;
} else {
  fnObj = obj;
}
```

- 一个全新的对象会凭空创建（就是被构建）
- 这个新构建的对象会被接入原形链（[[Prototype]]-linked）
- 这个新构建的对象被设置为函数调用的 this 绑定
- 除非函数返回一个它自己的其他 对象，否则这个被 new 调用的函数将 自动 返回这个新构建的对象

## 填补（Polyfilling）转译（transpiling）
