# CSS 加载会造成阻塞吗？

1. css加载不会阻塞DOM树的解析

2. css加载会阻塞DOM树的渲染

3. css加载会阻塞后面js语句的执行

因此，为了避免让用户看到长时间的白屏时间，我们应该尽可能的提高css加载速度，比如可以使用以下几种方法:

1. 使用CDN(因为CDN会根据你的网络状况，替你挑选最近的一个具有缓存内容的节点为你提供资源，因此可以减少加载时间)
2. 对css进行压缩(可以用很多打包工具，比如webpack,gulp等，也可以通过开启gzip压缩)
3. 合理的使用缓存(设置cache-control,expires,以及E-tag都是不错的，不过要注意一个问题，就是文件更新后，你要避免缓存而带来的影响。其中一个解决防范是在文件名字后面加一个版本号)
4. 减少http请求数，将多个css文件合并，或者是干脆直接写成内联样式(内联样式的一个缺点就是不能缓存)

## 用纯CSS创建一个三角形的原理是什么？
把上、左、右三条边隐藏掉（颜色设为 transparent）
```
.demo {
	width: 0;
	height: 0;
	border-width: 20px;
	border-style: solid;
	border-color: transparent transparent red transparent;
}
```
品字布局
```html
<style>
div{ 
	width:100px; 
	height:100px; 
	background:red; 
	font-size:40px; 
	line-height:100px; 
	color:#fff; 
	text-align:center;
}  
.div1{
	margin-left: 50px;
}
.div2{ 
	background:green; 
	float:left; 
	position:relative; 
}  
.div3{ 
	background:blue; 
	float:left; 
	position:relative; 
}
</style>
<body>
<div class="div1">1</div>  
<div class="div2">2</div>  
<div class="div3">3</div>  
</body>
```

## `white-space`、`word-wrap`和`word-break`的简单整理

`white-space` 属性定义了如何处理文本中的空白；具体到细节，主要决定决定了如何处理元素内文本中空白符、换行符、是否允许过长行折行;

![word-space](D:/word-space.png)

## `word-wrap:break-word` 与 `word-break:break-all` 的区别

共同点: 是都能把长单词强行断句

不同点: 

    word-wrap:break-word 是用来决定允不允许单词内断句的，如果不允许的话长单词就会溢出。最重要的一点是它还是会首先尝试挪到下一行，看看下一行的宽度够不够，不够的话就进行单词内的断句。

	而`word-break:break-all`则不会把长单词放在一个新行里，当这一行放不下的时候就直接强制断句了。