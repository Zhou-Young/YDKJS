var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
  console.log(i);
}
a[6]();

// foo(); // TypeError
// bar(); // ReferenceError

// var foo = function bar() {
//   console.log(a); // undefined

//   var a = 2;
// };

// function coolModule() {
//   var something = "cool";
//   var another = [1, 2, 3];
//   function doSomething() {
//     console.log(something);
//   }
//   function doAnother() {
//     console.log(another.join("!"));
//   }
//   return {
//     doSomething: doSomething,
//     doAnother: doAnother
//   };
// }
// var foo = coolModule();
// foo.doSomething();
// foo.doAnother();

// var obj = {
//   id: "awesome",
//   cool: function coolFn() {
//     console.log(this.id);
//   }
// };

// var id = "not awesome";

// obj.cool(); // awesome

// setTimeout(obj.cool, 100); // not awesome
