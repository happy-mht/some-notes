const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req,res)=>{
   let {pathname,query} = url.parse(req.url,true); // 解构赋值
   let body = '',s=''
   if(req.method.toLowerCase()=='post'){
      req.on('/add',(chunk)=>{
         body += chunk
         console.log(chunk)
      })
      req.on('end',()=>{
       var s = url.parse(body)
       console.log(s)
      })
      res.write(s)
   }
   
   if(pathname == '/add'){
      //console.log(postQuery)
      //let num = query.a + query.b;
      //res.write(postQuery)
      res.end()
   }else{
       fs.readFile(`./${pathname}`, (err,data)=>{
         if(err){
            res.onreadystatechangewriteHead(404);
            console.log(err)
            res.write('Not Found');
            res.end()
         }else{
            res.write(data);
            res.end()
         }
      });
   }
  
});
server.listen(8000)