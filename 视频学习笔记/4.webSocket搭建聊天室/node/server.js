const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const io = require('socket.io');
const url = require('url');
const reg = require('./libs/reg.js')

//数据库
let db = mysql.createPool({host:'localhost',user: 'mht',password:'123456',database:'20180621'});
// 服务器
let httpServer = http.createServer((req,res) => {
	console.log(url.parse(req.url,true))
	let {pathname,query} = url.parse(req.url,true); // 解构赋值
	if(pathname == '/reg'){
		//reg
		let {user, password} = query;

		//1. 校验数据
		if(!reg.username.test(user)){
			res.write(JSON.stringify({code: 1, msg:'用户名不符合规范'}));
			res.end()
		}else if(!reg.password.test(password)){
			res.write(JSON.stringify({code: 1, msg:'密码不符合规范'}));
			res.end()
		}else{
			//2. 检验用户名是否重复
			db.query(`select ID from usr_table where username='${user}'`,(err,data)=>{
				if(err){
					console.log(err)
					res.write(JSON.stringify({code: 1, msg:'数据库有错'}));
					res.end();
				}else if(data.length >0){
					res.write(JSON.stringify({code: 1, msg:'此用户名已存在'}));
					res.end();
				}else {
					db.query(`INSERT INTO usr_table (username,password,online) VALUES('${user}','${password}',0)`, (err,data)=>{
						if(err){
							console.log(err)
							res.write(JSON.stringify({code: 1, msg:err}));
							res.end();
						}else{
							res.write(JSON.stringify({code: 0, msg:'register success'}));
							res.end();
						}
					})
				}
			})
		}
	}else if(pathname=='/login'){
		//login
		let {user,password} = query;

		// 校验数据
		if(!reg.username.test(user)){
			res.write(JSON.stringify({code: 1, msg:'用户名不符合规范'}));
			res.end()
		}else if(!reg.password.test(password)){
			res.write(JSON.stringify({code: 1, msg:'密码不符合规范'}));
			res.end()
		}else{
		    db.query(`select ID,password from usr_table where username='${user}'`, (err,data) => {
		    	if(err){
		    		console.log(err)
		    		res.write(JSON.stringify({code: 1, msg:'数据库错误'}));
		    		res.end();
		    	}else if(data.length === 0){
		    		res.write(JSON.stringify({code: 1, msg:'此用户不存在'}));
		    		res.end();
		    	}else if(data[0].password != password){
                    res.write(JSON.stringify({code: 1, msg:'用户名或密码有错误'}));
                    res.end();
		    	}else {
		    		// 设置状态
		    		db.query(`update usr_table set online=1 where ID='${data[0].ID}'`, (err,data)=>{
		    			if(err){
		    				console.log(err)
		    				res.write(JSON.stringify({code:1,msg:'数据库出错'}))
		    				res.end();
		    			}else{
		    				res.write(JSON.stringify({code:0,msg:'登录成功'}))
		    				res.end();
		    			}
		    		})
		    	}
		    })
	    }

	}else{
		fs.readFile(`www${pathname}`, (err,data) => {
			if(err){
				res.writeHeader(404)
				res.write('Not Found')
			}else{
				res.write(data)
			}
			res.end()
		});
	}
});

httpServer.listen(9999)

