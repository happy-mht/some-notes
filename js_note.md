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

1.首先编译器对代码进行分析拆解，从左至右遇见 `var a`, 则编译器会询问作用域是否已经存在叫 `a` 的变量了, 如果不存在, 则招呼作用域声明一个新的变量 `a`, 若已经存在，则忽略 `var` 继续向下编译，这时`a = 2` 被编译成可执行的代码供引擎使用。

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

## 项目做过哪些性能优化？

1. 减少 HTTP 请求数
2. 浏览器缓存数据
3. 减少 DNS 查询
4. 避免重定向
5. 图片懒加载
6. 减少 DOM 操作
7. 使用外部的 JavaScript和 css
8. 压缩JavaScript、css、字体和图片
9. 使用 iconfont
10. 避免 `src=""`
11. 把脚本放在页面底部

## Vue router 跳转和 location.href 有什么区别？

- router 是 hash 改变
- location.href 是页面跳转，刷新页面

## Vue 双向绑定实现原理？ 如何实现
```html
    <div id="app">
        <input type="text" id="txt">
        <p id="show-txt"></p>
    </div>
    <script>
        var obj = {}
        Object.defineProperty(obj, 'msg', {
            get: function () {
                return obj
            },
            set: function (newValue) {
                document.getElementById('txt').value = newValue
                document.getElementById('show-txt').innerHTML = newValue
            }
        })
        document.addEventListener('keyup', function (e) {
            obj.msg = e.target.value
        })
    </script>
```
