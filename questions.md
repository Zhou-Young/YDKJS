# 思考

- let 的原理？ 他是怎么创造出块级作用域的？
- 无语了，，居然是用 try、catch

```javascript
{
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log(a);
  }
}

console.log(a);

{
  let a = 2;
  console.log(a); // 2
}

console.log(a); // ReferenceError
```

- 可以创建单独作用域的方法
  iife 为什么不用这个创造块级作用域呢？
  用函数包裹语义化不太行

- Traceur es6 转 es5 可以了解一下

- 在 vscode 跑的结果咋还不一样呢
- 后面那个为什么是全局呢？？？

```javascript
var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log(this.id);
  }
};

var id = "not awesome";

obj.cool(); // awesome

setTimeout(obj.cool, 100); // not awesome
```

匿名函数和命名函数的差别
