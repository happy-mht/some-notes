# js 定时器笔试题

1. 分析以下代码实际运行的结果：

```js
for (var i = 0; i < 5; i++) {
 setTimeout(function() {
  console.log(new Date, i);
 }, 1000);
}
console.log(new Date, i);
```

 JS 中同步和异步代码的区别、变量作用域、闭包等概念有正确的理解，就应该知道上面代码的输出结果：

```console
Tue Mar 06 2018 10: 10: 26 GMT + 0800(中国标准时间) 5
Tue Mar 06 2018 10: 10: 27 GMT + 0800(中国标准时间) 5
Tue Mar 06 2018 10: 10: 27 GMT + 0800(中国标准时间) 5
Tue Mar 06 2018 10: 10: 27 GMT + 0800(中国标准时间) 5
Tue Mar 06 2018 10: 10: 27 GMT + 0800(中国标准时间) 5
Tue Mar 06 2018 10: 10: 27 GMT + 0800(中国标准时间) 5
```

2. 如果想间隔1s输出一个数字，修改如下

```js
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date(), i)
    }, i * 1000) // 这里的将上面的1000改为i*1000
}
console.log(new Date(), i);
```

输出的结果如下

```console
Tue Mar 06 2018 12:20:28 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:20:28 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:20:29 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:20:30 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:20:31 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:20:32 GMT+0800 (中国标准时间) 5
```

3. 如果想输出不同的数字,则需要使用闭包,这里使用自执行函数,也可以使用 `let` 代替 `var` 声明 `i`

```js
for (var i = 0; i < 5; i++) {
    (j => {
        setTimeout(function() {
            console.log(new Date, j)
        }, j * 1000)
    })(i) 
}
console.log(new Date,i)
```

输入结果如下
```console
Tue Mar 06 2018 12:54:46 GMT+0800 (中国标准时间) 5
Tue Mar 06 2018 12:54:46 GMT+0800 (中国标准时间) 0
Tue Mar 06 2018 12:54:47 GMT+0800 (中国标准时间) 1
Tue Mar 06 2018 12:54:48 GMT+0800 (中国标准时间) 2
Tue Mar 06 2018 12:54:49 GMT+0800 (中国标准时间) 3
Tue Mar 06 2018 12:54:50 GMT+0800 (中国标准时间) 4
```

4. 使用`Generator`函数

Generator 函数是 ES6 提供的一种异步编程解决方案.

`for...of`循环可以自动遍历 `Generator` 函数时生成的`Iterator`对象，且此时不再需要调用`next`方法。

```js
function* foo() {
    for (let i = 0; i < 5; i++) {
        yield i;
    }
    return 6;
}
for (let j of foo()) {
    setTimeout(() => {
        console.log(new Date, j)
    }, j * 1000)
}
```
输出如下
```console
Tue Mar 06 2018 13:41:39 GMT+0800 (中国标准时间) 0
Tue Mar 06 2018 13:41:40 GMT+0800 (中国标准时间) 1
Tue Mar 06 2018 13:41:41 GMT+0800 (中国标准时间) 2
Tue Mar 06 2018 13:41:42 GMT+0800 (中国标准时间) 3
Tue Mar 06 2018 13:41:43 GMT+0800 (中国标准时间) 4
```

5. 使用ES7中的async函数

`async` 函数就是将 `Generator` 函数的星号`（*）`替换成`async`，将`yield`替换成`await`，仅此而已。

`async`函数返回一个 `Promise` 对象，可以使用`then`方法添加回调函数。当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```js
// 模拟其他语言中的 sleep，实际上可以是任何异步操作
const sleep = (timeountMS) => new Promise((resolve) => {
    setTimeout(resolve, timeountMS);
});

(async() => { // 声明即执行的 async 函数表达式
    for (var i = 0; i < 5; i++) {
        await sleep(1000);
        console.log(new Date, i);
    }
    await sleep(1000);
    console.log(new Date, i);
})();
```
输出如下

```console
Tue Mar 06 2018 13:52:22 GMT+0800 (中国标准时间) 0
Tue Mar 06 2018 13:52:23 GMT+0800 (中国标准时间) 1
Tue Mar 06 2018 13:52:24 GMT+0800 (中国标准时间) 2
Tue Mar 06 2018 13:52:25 GMT+0800 (中国标准时间) 3
Tue Mar 06 2018 13:52:26 GMT+0800 (中国标准时间) 4
Tue Mar 06 2018 13:52:27 GMT+0800 (中国标准时间) 5
```