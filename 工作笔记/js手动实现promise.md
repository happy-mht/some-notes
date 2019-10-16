Promise平时在工作中也常用，但是对其实现原理一直没有深入研究，在网上看了一些资料后，决定自己实现一个Promise。至于ES7中的async和await只是Promise的语法糖。详细分析看图和代码注释。

执行Promise的过程如下图所示：

![1536019510573](C:\Users\leqee\AppData\Local\Temp\1536019510573.png)

实现代码：

```js
var PENDING = 'PENDING'
var FULFILLED = 'FULFILLED'
var REJECTED = 'REJECTED'
var i = 1

// 1. 构造函数Promise
function Promise(fn) {
    this.id = i++;

    // 2. 构造函数内初始状态Pending和value

    this.status = PENDING; // 初始化状态
    this.value = null;// 初始化值
    this.deffered = []; // 下一个执行的Promise是谁，子Promise

    // 3. 构造函数内调用函数（apply参数是数组，call参数是一个一个的，调用函数改变this的指向）
    // resolve和reject的this都是当前的Promise对象。 使用bind方法不会立即执行函数，而是返回一个新的函数！！！
    fn.call(this, this.resolve.bind(this), this.reject.bind(this) );
}

// 4. 结束回调函数，执行then Promise.prototype.then是函数
// 5.then函数内需要保存起结果或者失败的函数
Promise.prototype = {
    constructor: Promise,
    resolve: function (data) {
        this.status = FULFILLED;
        this.value = data;
        //执行后续行为
        this.done()
    },
    reject: function (err) {
        this.status = REJECTED;
        this.value = err;
        //执行后续行为
        this.done()
    },
    done: function () {
        // 让这些this.deffered(子Promise执行)
        this.deffered.forEach(task => this.handler(task));
    },
    handler: function (task) {
        // 判断当前的执行的状态是咋样，调用对应的函数
        var status = this.status;
        var value = this.value;
        var p ;
        switch (status) {
            case FULFILLED:
                p = task.onfulfilled(value)
                break;
            case REJECTED:
                p = task.onrejected(value)
                break;
        }

        // 如果 p 是一个Promise的话，我们需要让他继续执行
        // 把后续（task.promise)的deffer交给这个p
        if(p && p.constructor === Promise){
            // 是下一个promise
            // 把下一个作为then链接的deffer移交p的deffered
            p.deffered = task.promise.deffered;
        }
    },
    then: function (onfulfilled, onrejected) {
        // 保存该函数
        var obj = {
            onfulfilled: onfulfilled,
            onrejected: onrejected
        }

        // 新来一个Promise 对象，让其存储这些
        // 并且能根据不同的Promise去then
        obj.promise = new this.constructor(function () {});

        console.log(this);  // 1
        console.log(obj.promise); // 2

        //保存接下来的子Promise
        //建立一个与下一个Promise之间的关系
        if(this.status == PENDING) this.deffered.push(obj)

        // 保证不报错，未来不能return自己，需要换人
        return obj.promise;
    }
}
```

**==难点：==**

1. `then`方法需要返回一个新的子Promise， 并且前后的Promise需要建立联系，才能决定他们的执行顺序。这里用id标识每个promise。

   在控制台中输出结果如下：

   ![1536019913948](C:\Users\leqee\AppData\Local\Temp\1536019913948.png)

2. `handler`函数在执行`then`方法保存的函数参数时，如果返回了一个Promise对象, 把后续（task.promise)的deffer交给这个p



