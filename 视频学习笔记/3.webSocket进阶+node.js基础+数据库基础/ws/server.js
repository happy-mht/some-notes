const http = require('http');
const io = require('socket.io');

//http 服务
const httpServer = http.createServer();
httpServer.listen(9999)

//ws 服务
const wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {
	sock.on('a',(n1,n2,n3,n4,n5) => {
		console.log(n1,n2,n3,n4,n5)
	})
});