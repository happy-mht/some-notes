# 从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！

## 大纲

- 对知识体系进行一次预评级
- 为什么说知识体系如此重要？
- 梳理主干流程
- 从浏览器接收url到开启网络请求线程
  - 多进程的浏览器
  - 多线程的浏览器内核
  - 解析URL
  - 网络请求都是单独的线程
  - 更多


- 开启网络线程到发出一个完整的http请求
  - DNS查询得到IP
  - tcp/ip请求
  - 五层因特网协议栈

- 从服务器接收到请求到对应后台接收到请求
  - 负载均衡
  - 后台的处理

- 后台和前台的http交互
  - http报文结构
  - cookie以及优化
  - gzip压缩
  - 长连接与短连接
  - http 2.0
  - https

- 单独拎出来的缓存问题，http的缓存
  - 强缓存与弱缓存
  - 缓存头部简述
  - 头部的区别

- 解析页面流程
  - 流程简述
  - HTML解析，构建DOM
  - 生成CSS规则
  - 构建渲染树
  - 渲染
  - 简单层与复合层
  - Chrome中的调试
  - 资源外链的下载
  - loaded和domcontentloaded

- CSS的可视化格式模型
  - 包含块（Containing Block）
  - 控制框（Controlling Box）
  - BFC（Block Formatting Context）
  - IFC（Inline Formatting Context）
  - 其它

- JS引擎解析过程
  - JS的解释阶段
  - JS的预处理阶段
  - JS的执行阶段
  - 回收机制

## 梳理主干流程

回到这道题上，如何回答呢？先梳理一个骨架

知识体系中，最重要的是骨架，脉络。有了骨架后，才方便填充细节。所以，先梳理下主干流程：

    1. 从浏览器接收url到开启网络请求线程（这一部分可以展开浏览器的机制以及进程与线程之间的关系）

    2. 开启网络线程到发出一个完整的http请求（这一部分涉及到dns查询，tcp/ip请求，五层因特网协议栈等知识）

    3. 从服务器接收到请求到对应后台接收到请求（这一部分可能涉及到负载均衡，安全拦截以及后台内部的处理等等）

    4. 后台和前台的http交互（这一部分包括http头部、响应码、报文结构、cookie等知识，可以提下静态资源的cookie优化，以及编码解码，如gzip压缩等）

    5. 单独拎出来的缓存问题，http的缓存（这部分包括http缓存头部，etag，catch-control等）

    6. 浏览器接收到http数据包后的解析流程（解析html-词法分析然后解析成dom树、解析css生成css规则树、合并成render树，然后layout、painting渲染、复合图层的合成、GPU绘制、外链资源的处理、loaded和domcontentloaded等）

    7. CSS的可视化格式模型（元素的渲染规则，如包含块，控制框，BFC，IFC等概念）

    8. JS引擎解析过程（JS的解释阶段，预处理阶段，执行阶段生成执行上下文，VO，作用域链、回收机制等等）

    9. 其它（可以拓展不同的知识模块，如跨域，web安全，hybrid模式等等内容）

### 1. 从浏览器接收url到开启网络请求线程

#### [浏览器的进程和线程](https://github.com/mht1993/some-notes/blob/master/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%9B%E7%A8%8B%E4%B8%8E%E7%BA%BF%E7%A8%8B.md)

### 解析URL

### [js event loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)