const mysql = require('mysql');

//连接池--共享,默认10个
let db = mysql.createPool({host:'localhost',user: 'mht',password:'123456',database:'20180621'});

// 单一连接
// let db = mysql.createConnection({host:'localhost',user: 'root',password:'',database:'20180621'});

db.query('select * from usr_table',(err,data)=>{
	if(err){
		console.log(err);

	}else{
		console.log(JSON.stringify(data))
	}
})