// 1. Promise 构造函数
var id = 1 ;
function Promise(fn) {
    this.id = id++;
    // 2. 初始化状态和值
    this.status = 'PENDING';
    this.value = null;
    this.deffered = [];

    // 3. 执行callback, 返回一个有then方法的对象
    fn(this.resolve.bind(this), this.reject.bind(this))
}

Promise.prototype = {
  constructor: Promise,

  // 4. 执行then中保存的函数（成功或失败）
  then: function (onfulfilled, onreject) {
      var obj = {
        onfulfilled: onfulfilled,
        onreject: onreject
      }

      if(this.status == 'PENDING') this.deffered.push(obj)
      obj.promise = new this.constructor(function () {})
      console.log(this)
      console.log(obj.promise)
      return obj.promise;
  },
  resolve: function (data) {
      this.value = data;
      this.status = 'FULFILLED';
      this.done();
  },
  reject: function (err) {
      this.status = 'REJECTED';
      this.value = err;
      this.done()
  },
  // 执行下一个promise
  done: function () {
      this.deffered.forEach(task => this.handler(task));
  },
  handler: function (task) {
      var status = this.status;
      var value = this.value;
      var p ;
      switch (status) {
          case 'FULFILLED':
              p = task.onfulfilled(value)
              break;
          case 'REJECTED':
              p = task.onreject(value)
              break;
      }

      if(p && p.constructor == Promise) p.deffered = task.promise.deffered
  }
};
