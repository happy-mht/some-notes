const http = require('http');
const url = require('url');

let server = http.createServer((req,res)=>{
	let {pathname,query} = url.parse(req.url,true);
	let {a,b,cb} = query;

	res.write(`${cb}(${a+b})`);
	res.end()
});

server.listen(8000)