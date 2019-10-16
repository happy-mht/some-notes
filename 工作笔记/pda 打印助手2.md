mainWindow.webContents 代表主进程`ipcMain`,  ipcRenderer代表子进程 `ipc`
`ipcMain` 和 `ipc`的通信过程
1. socket 监听打印事件，`if(unlock) ipc.send('download-lastest-template')` 
	`ipcMain.on('download-lastest-template')`  // 下载模板，以后这不可以省略
	`mainWindow.webContents.session.on('will-download')//`  监听模板下载完成事件
	`renderer.renderToString()` `vue-server-renderer`生成html---> `PhantomJS page.render()` 生成图片  -->  `printer.print()` // `node-native-printer` 打印图片
2. `mainWindow.webContents.send('print-complete')` 
	`ipc.on('print-complete')` ---> 向客户端返回打印失败或成功消息， 同时返回1，继续循环执行1-》2
	
	