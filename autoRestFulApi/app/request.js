/**
 * @Author :墨抒颖
 * @Date :2020-02-05 15:29:56
 * @LastEditTime :2020-03-20 09:15:21
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
const fs = require('fs');
const colorLog = require('../app/lib/colorLog');
let apipath =__filename.substr(0,__filename.length-11) + '/lib/api/';
let req = [];

fs.readdirSync(apipath).forEach((el)=>{
	let api = require(apipath+el);
	for(const key in api){
		// eslint-disable-next-line no-prototype-builtins
		if(api[key].hasOwnProperty('path')&&api[key].hasOwnProperty('type')&&api[key].hasOwnProperty('fn')){
			req.push(api[key]);
		}else{
			colorLog.red('[API ERROR]:'+JSON.stringify(api));
		}
	}
});

module.exports=req;
