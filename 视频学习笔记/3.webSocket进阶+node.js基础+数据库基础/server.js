const http = require('http');

let server = http.createServer( function(req,res){
	//console.log('有人请求我')
	//requset   请求 —— 输入  请求信息——哪个页面，方法，时间，IP
	//response  响应 —— 输出
	console.log(`ip address: ${req.url} , ip method: ${req.method}`)
	if(req.url == '/aaa') {res.write('return content')}
	else if (req.url == '/index.html') {res.write('index')}
    else {res.write('404')}
	res.end()
});
server.listen(9999);
console.log('监听成功')