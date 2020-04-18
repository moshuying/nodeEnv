process.argv[2] = 'test';
require('./api/app.test.js');
// const fs = require('fs');
// (function redFile(path){
// 	fs.readdirSync(path).forEach(el=>{
// 		if(fs.statSync(path+'/'+el).isDirectory()){
// 			redFile(path+'/'+el);
// 		}else{
// 			console.log(path+'/'+el);
// 			require(path+'/'+el);
// 			return;
// 		}
// 	});
// }(__dirname+'/api'));