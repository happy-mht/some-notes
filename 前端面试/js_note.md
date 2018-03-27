## node 入门知识 
https://segmentfault.com/a/1190000012066000
- Node.js采用了CommonJS规范,通过require来引入一个js文件
- exports 是module.exports的一个引用，意思就是指向同一块内存地址，node中真正生效的是module.exports,修改exports本质上也是修改module.exports的值。
- package.json 是一个文件，里面可以定义很多键值对，其中有几个字段非常重要，dependencies表示上线运行时依赖的包，devDependencies表示开发时依赖的包，scripts可以定义自己的脚本，main表示所有的包你都会通过这个文件引入

## javascript 奇怪事件薄

https://juejin.im/post/5a91615f6fb9a0634d27c770

'+' 运算符
调用 ToPrimitive(),除了Object类型返回该对象的默认值(调用对象的内部方法 [[DefaultVlaue]] 见8.12.8)，其余都返回输入的参数。先调用valueOf() '+' 运算符只能作用于原始值

```javascript
1 + '1' = '11';
1 - '1' = 0;
'2' + '2' -'2' = 2;
[] + [] = ''; // [].valueOf() = []; [].toString() = '';
[] - [] = 0;
{} + {} = '[object Object][object Object]'; //({}).toString()= [object Object];({}).valueOf()={}; 注意后面的那个O大写 FF和Edge浏览器输出 NAN (它们会认为以花括号开头({)的，是一个区块语句的开头，而不是一个对象字面量，所以会认为略过第一个{}，把整个语句认为是个+{}的语句) Chrome devtools 在执行代码的时候隐式的给表达式添加了括号()，实际上执行的代码是({} + {})。
//({})+{}  --> 所有浏览器都输出'[object Object][object Object]'
{} + [] = 0; //涉及到了JavaScript的语法解析规则。在这段代码中，解析器遇到{}后将其解析为了一个空的代码块，而又将"+[]"解析为对于空数组的一元操作“+”，也就是将数组强制转换为数字，而空数组转换为数字的话就是0，那么最后结果自然就是0了。
[] + {} = '[object Object]' 
{1,2,3} + [1,2] == NAN //相当于执行 +[1,2]; [1,2]的原始值为'1,2',toNumber(1,2) = NAN
{1,2,3} + [1] = 1;//相当于执行 +[1]; [1]的原始值为'1',toNumber(1) = 1
[] + {} === {} + [] // --> true 左边和右边都是'[object Object]'
{} + [] === [] + {} // --> true 同上 在FF和IE11下为false
[+false] + [+false] + [+false] = '000';
[+false] + [+false] + [+false] - [+false] = 0;
parseInt('infinity') == 0 / 0; // --> false NaN != NaN
1<2<3 // --> true < 3 --> 0 < 3 --> true
3>2>1 // --> true > 1 --> 0 > 1 --> false 
isNaN(false) // -->false
//运算符优先级 [] > 一元操作符+ > ++ > +
[[][[]]+[]][+[]][++[+[]][+[]]] = 'n' // --> ['undefined'][0][++[0][0]] -- > ['undefined'][0][1] --> 'n' ++[0][0] = 1 --> ++ a(a=0) -->1 自增和自减运算符只能用于操作变量，不能直接用于操作数值或常量！例如 5++ 、 8-- 等写法都是错误滴！
[1,2]+[3,4] = '1,23,4'
'33' == true//false 不同基本类型的比较会进行toNumber() 引用类型会进行toPrimivite()
```
1. `[1,2]+[3,4]='1,23,4'` 
原理：

`a + b`运算操作中, a和b用“+”连接, 使得a和b都要先进行隐式强制类型转换, 再做“加”运算。
- 当“+”符号两端存在一个或两个不是数字类型的值时，需要把“+”符号两端都先进行“取原始值”操作（ToPrimitive）。
- a 和 b 都是数组类型，要进行取原始值操作的话，解析器会对数组先调用valueOf()方法，如果有该方法并且返回值是原始类型的话就是这个返回值；否则继续调用toString()方法，如果返回的是原始值，则利用这个返回值进行“加”运算；否则会抛出异常
- 那么对于这个例子来说，[1,2]和[3,4]最终会调用toString()方法，分别返回字符串"1,2"和"3,4",再进行“加”运算后，结果就是"1,23,4"

**简单来说，如果 + 的其中一个操作数是字符串（或者通过 ToPrimitive 操作可以得到字符串）则执行字符串拼接，否则执行数字加法**

2. 将一个变量强制转换为字符串的几种方法
- 使用String() ——String(123)
- 直接调用toString()方法 —— `var a = 123;a.toString();`
- 使用JSON.stringify()方法 —— `JSON.stringify()`
- 利用字符串拼接—— `123+""`

其中第一种最为稳妥。
第二种的缺点是，如果对象修改了自身的toString()方法的话，会影响到最终结果
第三种的缺点是，缺点还是很多的……，如果传入的参数本身就是字符串的话，返回的结果是带双引号的，如下面：
JSON.stringify("123");    //""123""
如果传入的是Object还要确保没有递归引用，否则会抛出异常，如下面

```javascript
var a = {},b = {};
a.param = b;
b.param = a;
JSON.string(a);
//Uncaught TypeError: Converting circular structure to JSON
```

3. 有哪些值强制转换成布尔类型时结果为false？

- undefined
- 0
- ""
- null
- NaN
- false

4. 什么样的处理可以使得下面的代码输出为true？

```javascript
var s;
/**
*一些处理
**/
console.log(s == 5 && s== 6) // 输出true
```
注意：每次类型转换都会调用变量的valueOf()方法，除了日期类型变量

```javascript
var s;
var i=5;
s = {
    valueOf:()=>i++
}
console.log(s == 5 && s== 6) 
```

5. 将一个变量强制转换为数字类型时，都进行了哪些操作？

将变量强制转换为数字遵循的是ToNumber操作。
对于基本类型的话：

- true → 1
- false → 0
- undefined → NaN
- null → 0
- 对于字符串，遵循常量的相关规则语法，如果转化失败就返回NaN
- 对于对象来说：
    会先进行去原始值操作ToPrimitive，即先检查该值是否有valueOf()方法，如果有并且返回的基本类型值，就使用该值进行转强制类型转换。如果不是就使用toString()的返回值进行强制类型转换。如果valueOf()和toString()均不返回基本类型值，会产生TypeError错误。

## this 指向问题

```javascript
obj = {
    name: 'a',
    getName : function () {
        console.log(this.name);
    }
}

var fn = obj.getName
obj.getName() // a
var fn2 = obj.getName() // a
fn() // "" 注意window对象是有name属性的，默认是""
fn2() // simple-demo.html:31 Uncaught TypeError: fn2 is not a function
```

## var let const

为什么 var 可以重复声明？

在JS代码运行过程中：引擎负责整个代码的编译以及运行，编译器则负责词法分析、语法分析、代码生成等工作而作用域则如我们熟知的一样，负责维护所有的标识符（变量）。

当我们执行 `var a = 0` 时，我们可以简单的理解为新变量分配一块儿内存，命名为a，并赋值为2，但在运行的时候编译器与引擎还会进行两项额外的操作：判断变量是否已经声明：

1. 首先编译器对代码进行分析拆解，从左至右遇见 `var a`, 则编译器会询问作用域是否已经存在叫 `a` 的变量了, 如果不存在, 则招呼作用域声明一个新的变量 `a`, 若已经存在，则忽略 `var` 继续向下编译，这时`a = 2` 被编译成可执行的代码供引擎使用。

2. 引擎遇见 `a=2` 时同样会询问在当前的作用域下是否有变量a, 若存在, 则将 a 赋值为 2 (**由于第一步编译器忽略了重复声明的var，且作用域中已经有a，所以重复声明会发生值得覆盖, 并不会报错**)。若不存在，则顺着作用域链向上查找，若最终找到了变量 `a` 则将其赋值2，若没有找到，则招呼作用域声明一个变量 `a` 并赋值为2。

## CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？

- CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被”循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

- ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。
- import/export 最终都是编译为 require/exports 来执行的。

- CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports ）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

- export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

## 怎么判断两个对象相等？

1. 遍历对象
2. 转换为字符串：使用 JSON.stringify(obj1) == JSON.stringify(obj2)

## Vue router 跳转和 location.href 有什么区别？

- router 是 hash 改变
- location.href 是页面跳转，刷新页面

## Vue 组件 data 为什么必须是函数。

当多个组件共享一个data时， 改变data 会影响所有组件！**解决js中对象引用传递带来的问题.**

## 作用域（词法作用域）

    一个作用域内的代码可以访问这个作用域内以及任何包围在它之外的作用域中的变量

## 另一种方式实现 Vue 的响应式原理

Vue 的响应式原理是使用 Object.defineProperty 追踪依赖，当属性被访问或改变时通知变化。

有两个不足之处：

不能检测到增加或删除的属性。
数组方面的变动，如根据索引改变元素，以及直接改变数组长度时的变化，不能被检测到。
原因差不多，无非就是没有被 getter/setter 。

第一个比较容易理解，为什么数组长度不能被 getter/setter ？

在知乎上找了一个答案：如果你知道数组的长度，理论上是可以预先给所有的索引设置 getter/setter 的。但是一来很多场景下你不知道数组的长度，二来，如果是很大的数组，预先加 getter/setter 性能负担较大。

现在有一个替代的方案 Proxy，但这东西兼容性不好，迟早要上的。

Proxy，在目标对象之前架设一层拦截。具体，可以参考 http://es6.ruanyifeng.com/#docs/reference

## 箭头函数没有自己的this，导致内部的this就是外层代码块的this。

```js
function foo() {
    setTimeout(() => {
        console.log(this.id)
    }, 0)
}
foo.call({
        id: 1
    }) // 1

function bar() {
    setTimeout(function() {
        console.log(this.id)
    }, 0);
}
bar.call({
        id: 2
    }) // undefined
```

## 什么情况下会碰到跨域问题？有哪些解决方法？

跨域问题是这是浏览器为了安全实施的同源策略导致的，同源策略限制了来自不同源的document、脚本，同源的意思就是两个URL的域名、协议、端口要完全相同。

`script` 标签 `jsonp` 跨域、`nginx` 反向代理、`node.js`中间件代理跨域、后端在头部信息设置安全域名、后端在服务器上设置`cors`。

目前来讲没有不依靠服务器端来跨域请求资源的技术

1. `jsonp` 需要目标服务器配合一个 `callback` 函数。

2. `window.name+iframe` 需要目标服务器响应 `window.name`。

3. `window.location.hash+iframe` 同样需要目标服务器作处理。

4. html5的 `postMessage+ifrme` 这个也是需要目标服务器或者说是目标页面写一个`postMessage`，主要侧重于前端通讯。

5. `CORS` 跨域资源共享需要服务器设置`header`：`Access-Control-Allow-Origin`。`Access-Control-Allow-Methods` 首部字段用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。

6. `nginx`反向代理 这个方法一般很少有人提及，但是他可以不用目标服务器配合，不过需要你搭建一个中转`nginx`服务器，用于转发请求。

### `nginx` 反向代理

若想用 `test.local.com` 访问页面 `http://127.0.0.1:8082/`

首先需要在hosts文件中添加如下配置：`127.0.0.1 test.local.com`

然后再 `Nginx` 的 `http` 模块上添加一个 `server`

```conf
server {
    listen       3001;
    server_name  test.local.com;

    charset utf-8;

    # 访问本地前端SPA项目host
    location / {
        proxy_pass http://localhost:8082;
        proxy_connect_timeout 1;
        proxy_send_timeout 30;
        proxy_read_timeout 60;
    }

    # 访问服务器的host
    location /server/ {
        proxy_pass http://172.16.7.158:8080/;
    }
}
```

## package.json里面的dependencies 和devDependencies的差异!其实不严格的话,没有特别的差异;若是严格,遵循官方的理解;

`dependencies` : 存放线上或者业务能访问的核心代码模块,比如 `vue`,`vue-router`;

`devDependencies`: 处于开发模式下所依赖的开发模块,也许只是用来解析代码,转义代码,但是不产生额外的代码到生产环境, 比如什么`babel-core`这些

## 介绍Vue.js

Vue.js是JavaScript MVVM（Model-View-ViewModel）库，十分简洁，Vue核心只关注视图层。

Vue是以数据为驱动的，Vue自身将DOM和数据进行绑定，一旦创建绑定，DOM和数据将保持同步，每当数据发生变化，DOM会跟着变化。

Vue.js是一款MVVM框架，通过响应式在修改数据的时候更新视图。Vue.js的响应式原理依赖于`Object.defineProperty`，尤大大在Vue.js文档中就已经提到过，这也是Vue.js不支持IE8 以及更低版本浏览器的原因。Vue通过设定对象属性的 `setter/getter` 方法来监听数据的变化，通过g`etter`进行依赖收集，而每个`setter`方法就是一个观察者，在数据变更的时候通知订阅者更新视图。

Vue.js特点

- 简洁：页面由HTML模板+Json数据+Vue实例组成
- 数据驱动：自动计算属性和追踪依赖的模板表达式
- 组件化：用可复用、解耦的组件来构造页面
- 轻量：代码量小，不依赖其他库
- 快速：精确有效批量DOM更新
- 模板友好：可通过npm，bower等多种方式安装，很容易融入

Vue 实现的响应式原理：

![vue](./vue.png)

这张图比较清晰地展示了整个流程，首先通过一次渲染操作触发Data的getter（这里保证只有视图中需要被用到的data才会触发getter）进行依赖收集，这时候其实Watcher与data可以看成一种被绑定的状态（实际上是data的闭包中有一个Deps订阅着，在修改的时候会通知所有的Watcher观察者），在data发生变化的时候会触发它的setter，setter通知Watcher，Watcher进行回调通知组件重新渲染的函数，之后根据diff算法来决定是否发生视图的更新。

- `defineReactive` (在Observer 类中) 的作用是通过`Object.defineProperty`为数据定义上`getter\setter`方法，进行依赖收集后闭包中的`Deps`会存放`Watcher`对象。触发`setter`改变数据的时候会通知`Deps`订阅者通知所有的`Watcher`观察者对象进行试图的更新。

- 其实`Dep`就是一个发布者，可以订阅多个观察者，依赖收集之后Deps中会存在一个或多个`Watcher`对象，在数据变更的时候通知所有的`Watcher`。

- `Watcher`是一个观察者对象。依赖收集以后Watcher对象会被保存在Deps中，数据变动的时候会由于Deps通知Watcher实例，然后由Watcher实例回调cb进行实图的更新。

Vue在初始化组件数据时，在生命周期的beforeCreate与created钩子函数之间实现了对data、props、computed、methods、events以及watch的处理。

在Vue中不能像直接通过数组的下标或者设置length来修改数组，可以通过[Vue.set以及splice方法](https://cn.vuejs.org/v2/guide/list.html#%E6%9B%BF%E6%8D%A2%E6%95%B0%E7%BB%84)。