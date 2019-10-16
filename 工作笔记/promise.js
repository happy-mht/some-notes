// 1. Promise(fn) 构造函数
// 2. 初始化状态、值和异步函数，执行fn
// 3. then方法保存后续的异步函数,then方法是在fn执行后立即执行的
// 4. resolve reject 执行成功和失败的异步函

function Promise(fn) {
    this.status = 'PENDING'
    this.value = null
    this.deffered = []
    fn(this.resolve.bind(this), this.reject.bind(this))
}

Promise.prototype = {
    constructor: Promise,
    then: function (onfulfilled, onrejected) {
        var obj = {
            onfulfilled: onfulfilled,
            onrejected: onrejected
        }
        if(this.status == 'PENDING') this.deffered.push(obj)

        obj.promise = new this.constructor(function () {})
        
        return obj.promise
    },
    resolve: function (data) {
        this.status = 'FULFILLED'
        this.value = data
        this.done()
    },
    reject: function (err) {
        this.status = 'REJECTED'
        this.value = err
        this.done()
    },
    done: function () {
        this.deffered.forEach(task => this.handler(task));
    },
    handler:function (task) {
        var status = this.status,
            data = this.value,
            p;
        if(status == "FULFILLED"){
            p = task.onfulfilled(data)
        }else {
            p = task.onrejected(data)
        }
        if(p && p.constructor == Promise) p.deffered = task.promise.deffered;
    }

}