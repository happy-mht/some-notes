const http = require('http');
const fs = require('fs')

let server = http.createServer((req,res) => {
	fs.readFile(`www${req.url}`, (err,data) => {
		if(err){
			res.writeHeader(404)
			fs.readFile('./http_errors/404.html', (err,data)=>{
               if(err) {
               	res.write('NOT Found');
               }else{
               	res.write(data);
               }
               res.end()
			});
		}else{
			res.writeHeader(404)
			res.write(data);
			res.end()
		}
		
	});
	
});
server.listen(9999);