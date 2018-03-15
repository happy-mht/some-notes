# Tasks, microtasks, queues and schedules
为什么要了解Event loop?

    理解Event loop，对于浏览器（或者nodejs）处理事件的过程会有更透彻的理解，使用promise,nextTick, setImmediate, setTimeout 等会更清晰. 本文主要是基于浏览器端来理解的。

事件循环队列类似于一个游乐园游戏：玩过了一个游戏之后，你需要重新到队尾排队才能再玩一次。而任务队列类似于玩过玩过了游戏之后，插队接着继续玩。

**任务队列**：是挂在事件循环队列的每个 tick 之后的一个队列。在事件循环的每个 tick 中，可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中，而会在当前tick的任务队列末尾添加一个项目（一个任务）。

**Promise的异步特性是基于任务的**

一旦有事件需要运行，事件循环就会进行，知道队列清空。事件循环的每一轮称为一个 tick。用户交互、IO和定时器会向事件队列中加入事件。

参考自：
- [Tasks, microtasks, queues and schedules](https://link.jianshu.com/?t=https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly&utm_medium=email)
- [What the heck is the event loop anyway?](https://link.jianshu.com/?t=http://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html)
- [Concurrency model and Event Loop](https://link.jianshu.com/?t=https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Macrotasks and Microtasks](https://link.jianshu.com/?t=https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

## 并发模型(Concurrency model)

首先我们知道，js是单线程的，要么执行脚本要么进行浏览器渲染。
执行脚本时，通常是这样子的：
![runtime.png](https://upload-images.jianshu.io/upload_images/696631-6e13210f0ca22162.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/294)

举个例子(直接从[mdn](https://link.jianshu.com/?t=https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)搬过来：
```js
function f(b){ 
  var a = 12;
  return a+b+35;
}

function g(x){ 
  var m = 4; 
  return f(m*x);
}

g(21);
```
1. 当执行 g(21)的时候，创建了第一个frame，包含g(x)和它的局部变量，压入栈(stack)；
2. 当执行到f(m*x)的时候，创建了第二个frame，包含f(x)和它的局部变量，压入栈；
3. 等到f(x)执行完毕，第二个frame出栈；
4. 等到g(x)执行完毕，第一个frame出栈；

## “线程” 与 Event loop

每个“线程”有自己的event loop，比如说每个web worker都维护了自己的event loop，可以分开来工作，彼此通过postMessage通信。如下图：
![webworker.png](https://upload-images.jianshu.io/upload_images/696631-d746eb90627715d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)
**主线程和web worker的event loop的区别在于，主线程每次task完成后会进行视图更新，但是worker和dom无关，就没有这一步了.**

## Task
如上图，task就是在message queue里的message了（我是这么理解的），一次event loop里面可能会有多个task，task有自己的task source，比如说setTimeout来自于timer task source，又或者和用户交互相关的来自user interaction task source。
浏览器是可以选择先执行哪个task source 的。规范如下：

>For example, a user agent could have one [task queue](https://link.jianshu.com/?t=https://html.spec.whatwg.org/multipage/webappapis.html#task-queue) for mouse and key events (the [user interaction task source](https://link.jianshu.com/?t=https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source)), and another for everything else. The user agent could then give keyboard and mouse events preference over other tasks three quarters of the time, keeping the interface responsive but not starving other task queues, and never processing events from any one [task source](https://link.jianshu.com/?t=https://html.spec.whatwg.org/multipage/webappapis.html#task-source) out of order.
有点晕吧，至少我们弄清楚，在js运行过程中，起码有两个东西:
- task 队列
- 栈

最简单的就是每次 event loop 查看 task 队列，找到最老的 task，压入栈，执行之。等到 task 执行完了，就进行一次视图渲染。周而复始，直到所有 task 队列都执行完毕。

等等，这样的话，那 setTimeout 又是怎么做到的？还有 promise，要是都是顺序执行的话，这些是怎么做到异步的？

## Microtask 和 Macrotask

实际上我看到有些文章提到Macrotask，但也有些文章直接把Macrotask当成task，可以区分一下。

接着上文说的，promise是怎么做到异步的呢？
promise并不是task，它属于Microtask，什么是Microtask呢?

>Microtasks are usually scheduled for things that should happen straight after the currently executing script, such as reacting to a batch of actions, or to make something async without taking the penalty of a whole new task.

感觉可以叫它微任务~ 跟在task末尾执行，像个小跟班。

实际上来说，Microtask并非每次都在task末尾才执行，如果一个函数执行完毕后，栈暂时空掉了，那么Microtask也会执行（晕了对不对，后面上代码详述~）

那么什么是Macrotask呢？setTimeout就是Macrotask，还有setImmediate。
对比着Microtask来，他们的区别就在于执行的时机，Macrotask在一次task执行完了，然后浏览器进行渲染，然后才执行Macrotask。

就叫宏任务吧~

所以它俩的区别就在于Microtask会影响IO回调，要是不断增加Microtask的话，就一直无法渲染视图了，看上去就会卡顿。但是Macrotask就没有这种危险。

按我的理解，可以把Macrotask直接当成task来看。

总结下，现在在js运行中，起码有三个东西：

- task队列
- Microtask队列
- 栈

## 用代码来感受

先来简单的：
```js
console.log('script start');

  setTimeout(function() { 
    console.log('setTimeout');
  }, 0);

  Promise.resolve().then(function() {   
    console.log('promise1');
  }).then(function() { 
    console.log('promise2');
  });
  
  console.log('script end');
```

结果应当如下：
```console
script start
script end
promise1
promise2
setTimeout
```

## 为什么不一样

如果你用的不是chrome浏览器的话，表现很可能就会不一样，甚至可能一段代码两次执行结果都不一样（比如说在ios 8的safri）
对的，因为这是规范== 浏览器会有差异。前途是光明的，而道路则是曲折的~

## 继续感受代码

```<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <link rel="stylesheet" href="">
</head>
<body>
  <div class="outer">
      <div class="inner"></div>
  </div>
  <script>
    var outer = document.querySelector('.outer');
    var inner = document.querySelector('.inner');

    // Let's listen for attribute changes on the
    // outer element
    new MutationObserver(function() { 
      console.log('mutate');
    }).observe(outer, { 
      attributes: true
    });

    // Here's a click listener…
    function onClick() { 
      console.log('click'); 

      setTimeout(function() { 
        console.log('timeout'); 
      }, 0); 

      Promise.resolve().then(function() { 
        console.log('promise'); 
      }); 

      outer.setAttribute('data-random', Math.random());
    }

    // …which we'll attach to both elements
    inner.addEventListener('click', onClick);
    outer.addEventListener('click', onClick);
  </script>
</body>
</html>
```

出来结果应该是:

```console
click
promise
mutate
click
promise
mutate
timeout
timeout
```

## why
参考[event loop的处理模型](https://link.jianshu.com/?t=https://html.spec.whatwg.org/multipage/webappapis.html#processing-model-9)，整个处理如下:

1. 将脚本压入tasks，运行脚本，压入stacks。执行完毕清空；
2. 用户点击，触发点击，将 onClick压入task，执行onClick，即压入stacks;
3. 打印click
4. 将 setTimeout 压入 task；
5. 将 Promise 压入 Microtask；
6. 设置 outer 属性，将 MutationObserver 压入 Microtask；
7. 一次 onClick 执行完毕，stacks 清空了，这时候虽然后面还有冒泡触发，但是会先执行 Microtask（真是见缝插针），Microtasks 顺序执行，打印 promise 和 mutate；
8. 事件冒泡，执行outer的onClick，执行过程差不多。等到冒泡执行完毕，情况如下：
```js
tasks: [setTimeout, setTimeout]
stacks: [ ]
Microtasks:[ ]
```
9. 执行浏览器渲染
10. 执行tasks，依次打印出setTimeout  setTimeout，搞定。


## 进阶版

前面我们使用交互来触发click 事件，如果我们在刚刚代码后面加 `inner.click()`，整个过程就变化了，不妨思考。

出来结果应该是:

```console
click
click
promise
mutate
promise
timeout
timeout
```

>If the [stack of script settings objects](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects) is now empty, [perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)
— [HTML: Cleaning up after a callback step](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback) 3

从上面的例子中可以看出，微任务在侦听器回调之间运行，但 `.click()` 会导致事件同步分派，因此调用 `.click()` 的脚本仍处于回调之间的堆栈中。 上述规则确保微任务不会中断正在执行的 JavaScript。这意味着我们不会在侦听器回调之间处理微任务队列，它们会在两个侦听器之后处理。

## 总结

- Tasks 按顺序执行，浏览器会在 task 之间执行渲染
- microtasks 按顺序执行，执行时间：
    - after every callback, as long as no other JavaScript is mid-execution
    - at the end of each task