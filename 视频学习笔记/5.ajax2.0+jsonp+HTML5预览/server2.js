const http = require('http')

let allowHosts = ['baidu.com','taobao.com','tmall.com','goole.com'];

let server = http.createServer((req,res)=>{
	//验证是否是在家人请求 Ajax1.0无法做到
	console.log(req.headers)
	if(allowHosts.indexOf(res.headers['origin'])!=-1){
		res.setHeader('Access-Control-Allow-Origin','*')
	}

	res.write('data')
    res.end()
});

server.listen(8000)