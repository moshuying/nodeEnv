/**
 * @Author :墨抒颖
 * @Date :2020-02-06 18:34:34
 * @LastEditTime :2020-03-20 09:18:25
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
const fs = require('fs');
const { resolve } = require('path');
const colorLog = require('../colorLog');
const tinify = require('tinify');
tinify.key=global.config.tinifykey;
const fileDir = resolve('./')+global.config.path.fileDir;
if (!fs.existsSync(fileDir)) {
	try {
		fs.mkdirSync(fileDir);
	} catch (e) {
		console.error(e);
	}
}
let req = [
	{
		path: '/upload',
		type: 'post',
		fn: async ctx => {
			const { path, name, type } = ctx.request.files.file;
			// type包含了文件类型
			if (type.includes('image')) {
				if (!~name || !~path) {
					ctx.body = { code: 403, msg: '获取文件名或路径出错' };
				} else {
					// rename
					let day = new Date();
					const fileName = 
						ctx.query.path
						+(ctx.query.name?('_'+ctx.query.name):'')
						+'_'+day.getFullYear()
						+'-' +(day.getMonth()+1)+'-' +day.getDate()+'_' +day.getTime()
						+'.'+type.substr(6);
					let createName = fileDir+'/'+fileName;
					// Read file stream ,And save to upload
					fs.createReadStream(path).pipe(fs.createWriteStream(createName));
					// quality file
					tinify.fromFile(createName).toFile(createName);
					colorLog.green('[file]: upload success');
					ctx.body = { ...global.config.success, url:global.config.source+'/assets/upload/'+ fileName };
				}
			} else {
				ctx.body = { code: 406, msg: '文件类型错误' };
			}
		}
	}
];
module.exports = req;
