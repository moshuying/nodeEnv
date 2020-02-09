/**
 * @Author :墨抒颖
 * @Date :2020-02-06 18:34:34
 * @LastEditTime :2020-02-09 20:45:43
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :上传文件的样例
 */
const fs = require('fs');
const { resolve } = require('path');
const CONFIG = require('../../config');
const fileDir = `${resolve('./')}\\app\\assets\\upload`;
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
					// 重命名
					let day = new Date();
					const fileName =
            String(day.getFullYear()) +
            '-' +
            String(day.getDate()) +
            '-' +
            String(day.getDay()) +
            'M' +
            String(day.getTime()) +
            '.' +
            String(type.substr(6));
					// 读取文件流后写入到upload文件夹
					fs.createReadStream(path).pipe(
						fs.createWriteStream(`${fileDir}/${fileName}`)
					);
					// http://127.0.0.1:10001/assets/upload/2020-6-4M9780.png
					ctx.body = { ...CONFIG.success, url:CONFIG.source+'/assets/upload/'+ fileName };
				}
			} else {
				ctx.body = { code: 406, msg: '文件类型错误' };
			}
		}
	}
];
module.exports = req;
