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


...[]
```javascript
// 将数组散开作为参数
foo.apply( null, [2, 3] ); // a:2, b:3

// 用 `bind(..)` 进行柯里化
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```