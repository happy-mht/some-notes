笔记下面2段代码，`MsgModule`是安卓native扩展的方法，用户消息推送

```js
MsgModule.getAllMsg(data => {
    this.lists = JSON.parse(data)
    let arr = [];
    for(let i = 0; i< this.lists.length; i++){
        if(this.lists[i].message_status == 0) arr.push(this.lists[i])
    }
    this.$emit('changeMsgLen', arr.length)
})
```

```js
MsgModule.getAllMsg(data => {
    this.lists = JSON.parse(data)
    let arr = this.lists.filter(item => item.message_status == 0);
    this.$emit('changeMsgLen', arr.length) // 这里不会执行，难道是filter内部函数返回了，整个函数就已经返回了吗？，奇怪得很！！！
})
```

