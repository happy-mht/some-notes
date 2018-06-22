const fs = require('fs');

fs.readFile('1.txt', (err,data) => {
	if(err){
		console.log('read failure')
	}
	else{
		console.log(data.toString())
	}
	
});

fs.writeFile('2.txt', 'some words',err => {
	if(err){
		console.error('error');
	}else{
		console.info('write success');
	}
});