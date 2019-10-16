###  多页面`html-webpack-plugin`优化

作为webpack中的第一大插件`html-webpack-plugin`，这个插件会根据你的模板代码，通过不同的模板引擎构建出对应的html,ejs甚至ftl文件，在标准的`SPA`中，该插件性能不会性能瓶颈，但是如果你使用的是多页面，该插件的构建速度绝对是地狱级别的。

比如，我只是简单修改了一个`vue`文件的一个文案，在阶段居然花费了16s，这大大减慢了开发效率，感受不到`HMR`的优势。他会对每一个入口文件都执行一遍emit中所有代码逻辑。因此，我们需要考虑，如何只在自己修改到的入口，执行emit下面的流程就好了

`html-webpack-plugin-for-multihtml`帮助我们完成了判断和缓存的功能

修改`webpack.dev.conf.js`配置代码代码
```js
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml'); // 替换原来的`html-webpack-plugin`
//...
plugins:[
  new HtmlWebpackPlugin({
          template: filePath,
          filename: `${filename}.html`,
          chunks: ['manifest', 'vendor', filename],
          inject: true,
          multihtmlCache: true  // 增加该配置，
  })
]
```


```js
//html-webpack-plugin的配置选项
function HtmlWebpackPlugin (options) {
  // Default options
  this.options = _.extend({
    template: path.join(__dirname, 'default_index.ejs'),
    filename: 'index.html',
    hash: false,
    inject: true,
    compile: true,
    favicon: false,
    minify: false,
    cache: true,
    showErrors: true,
    chunks: 'all',
    excludeChunks: [],
    title: 'Webpack App',
    xhtml: false
     // resolve multi html recompile slow，这行是html-webpack-plugin-for-multihtml插进加的配置参数。在 html-webpack-plugin插进中没有
    multihtmlCache: false
  }, options);
}
```
在原型中扩展的apply方法添加判断
```js
HtmlWebpackPlugin.prototype.apply = function (compiler) {
  var self = this;
  var isCompilationCached = false;
  var compilationPromise;
  // cache childCompilation
  var childCompilation = null;
  // when done, set true;
  // when childCompilation's fileDependencies had changed, set false
  var isValidChildCompilation = false;
  //...
}
```
新增`invalid` 和 `done`钩子函数
```js
compiler.plugin('invalid', function (fileName) {
    if (childCompilation &&
      childCompilation.fileDependencies.indexOf(fileName) !== -1) {
      isValidChildCompilation = false;
    }
});
compiler.plugin('done', function (stats) {
    var compilation = stats.compilation;

    if (childCompilation) {
      // webpack watch
      childCompilation.fileDependencies.forEach(function (fileName) {
        if (compilation.fileDependencies.indexOf(fileName) === -1) {
          compilation.fileDependencies.push(fileName);
        }
      });
    }
    isValidChildCompilation = true;
});
```
在make和emit钩子函数中判断新增判断
```js
compiler.plugin('make', function (compilation, callback) {
    if (self.options.multihtmlCache && isValidChildCompilation) {
      return callback();
    }
    //....
}
compiler.plugin('emit', function (compilation, callback) {
    if (self.options.multihtmlCache && isValidChildCompilation) {
      return callback();
    }
    //...
}
```

该插件通过在`webpack` `done`钩子函数中设置相关变量，来保证原`html-webpack-plugin`插件中emit仅触发一次全部流程。来达到提速的效果。升级以后，修改文案，`HMR`的速度从原来的秒级改为毫秒级。

参考文档：

[webpack多页面构建优化不完全指北](https://yq.aliyun.com/articles/607994)

其它优化插进 `HappyPack` ，`Dllplugin`