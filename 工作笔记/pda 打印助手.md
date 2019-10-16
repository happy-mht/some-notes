electron-edge 打印助手

![electron_edge_error2](E:\笔记\electron_edge_error2.png)
解决办法： `electron`使用`1.6.2`版本，`node` 使用`7.4.0`版本

![electron_edge_error](E:\笔记\electron_edge_error.png)
解决办法： https://stackoverflow.com/questions/41253450/error-the-specified-module-could-not-be-found/41272553

应该是电脑缺少`.dll`文件 ，使用 (Dependency Walker)! http://www.dependencywalker.com/ 查找缺少的`dll`文件

**注意：**不要把`dll`文件放到`C:\Windows\System32`文件夹下面，这里放的是系统文件夹，任何程序都能访问到，可能会出现无法解决的错误。我第一次就把dll放到了这里，结果使用`npm`是就报了下面的错误。

`npm install XXX`报错

![npm证书问题](E:\笔记\npm证书问题.png)

https://stackoverflow.com/questions/29141153/nodejs-npm-err-code-self-signed-cert-in-chain

使用 `npm set strict-ssl false`

上面这个配置虽然能解决npm报的证书错误，但是我在运行`weex`项目时，项目能启动，但是由于用到了Vue自带的跨域代理功能，任何请求都发不出去。报如下错误

![proxy_err1](E:\笔记\proxy_err1.jpg)

研究了半天，没有在网上找到一样的错误，`error_in_cret_not-after_field` 有关找个错误的解决办法我是没有找到，我猜到了可能是由于我乱加dll文件的原因。

尝试执行 `rm -rf node_moudles` `npm i` 报如下错误

![npm_error](E:\笔记\npm_error.JPG)

上面的错误可以不管，以前运行项目时也存在，但不影响程序执行。主要是下面标红的错误

`"... node install.js" post install error,...`这个错误倒是能在网上找到类似的，但是并不能解决我的问题。

最后，还是重装系统了，亲测发现，在system32目录下加了`api-ms-win-crt-filesystem-l1-1-0.dll`，（具体是不是这个文件我记不清楚了），执行npm就会报证书错误，

### npm 与 cnpm的区别

说到`npm`与`cnpm`的区别，可能大家都知道，但大家容易忽视的一点，是`cnpm`装的各种`node_module`，这种方式下所有的包都是扁平化的安装。一下子`node_modules`展开后有非常多的文件。导致了在打包的过程中非常慢。但是如果改用`npm`来安装`node_modules`的话，所有的包都是树状结构的，层级变深。

由于这个不同，对一些项目比较大的应用，很容易出现打包过程慢且node内存溢出的问题（这也是在解决electron打包过程中困扰我比较久的问题，最后想到了npm与cnpm的这点不同，解决了node打包内存溢出的问题，从打包一次一小时优化到打包一次一分钟，极大的提高了效率）。

### 渲染方式改造

####  ejs渲染
`mainWindow.webContents` 代表主进程`ipcMain`,  ipcRenderer代表子进程 `ipc`
`ipcMain` 和 `ipc`的通信过程

1. socket 监听打印事件，`if(unlock) ipc.send('download-lastest-template')` 
    `ipcMain.on('download-lastest-template')`  // 下载模板
    `mainWindow.webContents.session.on('will-download')//`  监听模板下载完成事件
    `ejs.renderFile()` 生成html---> `PhantomJS page.render()` 生成图片
2. `mainWindow.webContents.send('render-complete')` // `ipcMain` 发送渲染完成事件
    `ipc.on('render-complete')` --> `printer.print()` // `node-native-printer` 打印图片
3. `ipc.send('print-complete')` 
    `ipcMain.on('print-complete')` --> 删除html文件
4. `mainWindow.webContents.send('unlock')` 
    `ipc.on("unlock")` --> 返回到第一步，继续循环执行1--》2--》3--》4
#### vue-render-server 渲染
1. socket 监听打印事件，`if(unlock) ipc.send('download-lastest-template')` 
	`ipcMain.on('download-lastest-template')`  // 下载模板，以后这步可以省略
	`mainWindow.webContents.session.on('will-download')//`  监听模板下载完成事件
	`renderer.renderToString()` `vue-server-renderer`生成html---> `PhantomJS page.render()` 生成pdf  -->  `printer.print()` // `node-native-printer` 打印**PDF**， 用图片不方便控制模板的大小
2. `mainWindow.webContents.send('print-complete')` 
	`ipc.on('print-complete')` ---> 向客户端返回打印失败或成功消息， 同时返回步骤1，继续循环执行 1 --》2


