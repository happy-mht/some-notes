`webpack` 全局安装，要使用绝对路径，能找到那个文件就行

```js
const process=require('process'); // 进程信息
function cwd(filename){
  return pathlib.resolve(process.cwd(), filename); //process.cwd()当前路径
}
```

`webpack`是`node`写的，提示用户可以用`try catch`语句，`console.log`错误信息

```js
try{
  config=require(cwd('my-webpack.config'));
}catch(e){
  console.log('找不到my-webpack.config.js');
}
```

`webpack`的编译能力： 将js文件中的`require` 和 `import`引入的文件合并成一个文件

自己定义一个`module` 然后输出
```js
const module={};
module.exports={};
```

Webpack揭秘——走向高阶前端的必经之路 https://juejin.im/post/5badd0c5e51d450e4437f07a

《webpack运行机制》、《编写自定义webpack loader》和《编写自定义webpack plugin》https://github.com/jerryOnlyZRJ/webpack-loader