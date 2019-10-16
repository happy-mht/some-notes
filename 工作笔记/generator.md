## generator 的使用

```js
function *foo(x) {
  let y = 2 * (yield (x + 1))
  let z = yield (y / 3)
  return (x + y + z)
}
let it = foo(5)
console.log(it.next())   // => {value: 6, done: false}
console.log(it.next(12)) // => {value: 8, done: false}
console.log(it.next(13)) // => {value: 42, done: true}
```
注意点：
1. `generator` 函数第一次执行返回一个迭代器
2. 第一次执行`next`函数时传递的参数会被忽略，停留在`yield(x+1)`处，返回 `5 + 1 = 6`
3. 第二次执行`next`传递的参数等于上一次`yield`的返回值，如果不传参数，则永远返回为`undefined`。 `let z = yield (y / 3) => z = 12 * 2 / 3 = 8`。如果此时执行的是next()，则 y = 2 * undefined = NAN, z = NAN