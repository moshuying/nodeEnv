/**
 * @Author :墨抒颖
 * @Date :2020-02-05 15:29:56
 * @LastEditTime :2020-02-09 22:00:00
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
const fs = require('fs');

let apipath = __dirname+'\\lib\\api\\';
let req = [];

fs.readdirSync(apipath).forEach((el)=>{
	let api = require(apipath+el).req;
	for(const key in api){
		// req.push(api[key]);
		// eslint-disable-next-line no-prototype-builtins
		if(api[key].hasOwnProperty('path')&&api[key].hasOwnProperty('type')&&api[key].hasOwnProperty('fn')){
			req.push(api[key]);
		}else{
			console.error('[API ERROR]:'+JSON.stringify(api));
		}
	}
});

module.exports=req;
