const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const io = require('socket.io');
const reg = require('./libs/reg.js')

//数据库
let db = mysql.createPool({host:'localhost',user: 'mht',password:'123456',database:'20180621'});

let httpServer = http.createServer((req,res)=>{
	fs.readFile(`www${req.url}`, (err,data) => {
		if(err){
			console.log(err)
			res.writeHeader(404);
			res.write('Not Found');
		}else{
			res.write(data)
		}
		res.end()
	});
});
httpServer.listen(9999);
let aSock=[];
let wsServer = io.listen(httpServer);
wsServer.on('connection',sock => {
	aSock.push(sock)
	let cur_usr = '';
	let cur_usrId = 0;
	sock.on('reg',(user,pass)=>{
		//1. 校验数据
		if(!reg.username.test(user)){
			sock.emit('reg_ret',1,'用户名不合法')
		}else if(!reg.password.test(pass)){
			sock.emit('reg_ret',1,'密码不合法')
		}else{
			//2. 用户名是否存在
			db.query(`select ID from usr_table where username='${user}'`, (err,data)=>{
				if(err){
					console.log(err)
					sock.emit('reg_ret',1,'数据库出错')
				}else if(data.length >0){
					sock.emit('reg_ret',1,'用户名已经存在')
				}else {
					//3. 插入数据
					db.query(`insert into usr_table (username,password,online) values ('${user}','${pass}',0)`,err=>{
						if(err){
							console.log(err)
							sock.emit('reg_ret',1,'数据库出错')
						}else{
							sock.emit('reg_ret',0,'注册成功')
						}
					})
				}
			})
		}
		
	});
	sock.on('login',(user,pass)=>{
		if(!reg.username.test(user)){
			sock.emit('login_ret',1,'用户名不合法')
		}else if(!reg.password.test(pass)){
			sock.emit('login_ret',1,'密码不合法')
		}else{
			db.query(`select ID,password from usr_table where username='${user}'`, (err,data)=>{
				if(err){
					console.log(err)
					sock.emit('login_ret',1,'数据库出错')
				}else if(data.length == 0){
					sock.emit('login_ret',1,'此用户不存在')
				}else if(data[0].password != pass){
					console.log(data,pass)
					sock.emit('login_ret',1,'用户名或密码错误')
				}else {
					//3. 修改状态
					db.query(`update usr_table set online=1 where ID=${data[0].ID}`,err=>{
						if(err){
							console.log(err)
							sock.emit('login_ret',1,'数据库出错')
						}else{
							cur_usr = user;
							cur_usrId = data[0].ID;
							sock.emit('login_ret',0,'登录成功')
						}
					})
				}
			})
		}
	});

    // 发言
    sock.on('msg',txt=>{
		if(!txt){
			sock.emit('msg_ret',1,'消息文本不能为空')
		}else{
			console.log(aSock.length)
			aSock.forEach(item=>{
				if(item==sock) return;
				item.emit('msg',cur_usr,txt);
			})
			sock.emit('msg_ret', 0, '发送成功')
		}
	})

	// 离线
	sock.on('disconnect',()=>{
		db.query(`update usr_table set online=0 where ID=${cur_usrId}`,err=>{
	        if(err){
				console.log(err);
			}
			cur_usrId = 0;
			cur_usr='';
			aSock = aSock.filter(i=>i!=sock);
		})
	})
})