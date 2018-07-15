# 箭头函数的 this 指向

注意 JavaScript 没有块级作用域，只有函数才会形成一块独立的作用域

箭头函数 this 取决于该函数定义时所在的作用域的 this 指向

```js
var handler = {
  id: "123456",

  init: function() {
    console.log(this);
    document.addEventListener(
      "click",
      event => this.doSomething(event.type),
      false
    );
  },

  doSomething: function(type) {
    console.log("Handling " + type + " for " + this.id);
  }
};
/*
var c = handler.init;
c(); // 此时init中的this指向window，click函数里面的this也指向window
*/

handler.init();
//此时init中的this指向handler，click函数里面的this也指向handler
```
