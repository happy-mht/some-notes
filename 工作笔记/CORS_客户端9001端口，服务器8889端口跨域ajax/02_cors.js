// Access-Control-Allow-Origin: 'http://xxx.com'  //允许哪个域在跨域的时候访问,*代表所有
// // 告诉浏览器,跨域时允许有cookie,同时客户端也要设置withCredentials:true + Origin不能是*
// Access-Control-Allow-Credentials: true  
// Access-Control-Allow-Methods: 'GET,POST,PUT,DELETE';   // 默认允许get/post
// Access-Control-Request-Headers:'xxx';   // 允许你自己加的头来通信

// 提供数据的返回
// 1: 编写基本服务器框架
const http = require('http');   
let server = http.createServer();
// 核心对象url来获取query
const url = require('url');
server.on('request',(req,res)=>{
    console.log(req.headers);
  if (req.url.startsWith('/cors')) {

    // 服务器说,我爱的就是你 ,只爱一个人
    res.setHeader('Access-Control-Allow-Origin','http://localhost:9001');
    res.setHeader("Access-Control-Allow-Credentials",true);
    // 所有服务器
    // res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,DELETE,OPTIONS');
    //  运行自定义的头
    res.setHeader('Access-Control-Allow-Headers','my-token,content-type');
    res.setHeader('set-cookie','xxx=1');
    res.end('xxxx');
  }
});
// 3: 端口是8888
server.listen(8889,()=>{
 console.log('服务器启动在8889端口'); 
})