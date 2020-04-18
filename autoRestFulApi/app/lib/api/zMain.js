/* eslint-disable no-unused-vars */
/**
 * @Author :墨抒颖
 * @Date :2020-02-08 21:33:06
 * @LastEditTime :2020-02-09 11:55:45
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */

const sql = require('../mysql');
const config = require('../../config');
const fs = require('fs');
const path = require('path');
const {logger } = require('../../logger');
const colorLog = require('../colorLog');
const AUTOTABLE = [
	{
		msg: '留言',
		name: 'contant_us',
		path: '/contant_us',
		primarykey: 'id',
		key: ['name','phone', 'message']
	},
	{
		msg: '新闻',
		name: 'news',
		path: '/news',
		primarykey: 'id',
		key: ['abstract','time','tag','url','newsHeader','newsTime','newsText','newsTag']
	},
	{
		msg: '院校',
		name: 'school',
		path: '/school',
		primarykey: 'id',
		key: ['name','abstract','superiority','apply','markTOEFL','markIELTS','material','expenses','subsidize','url','from','fullName','enName']
	},
	{
		msg: '教师',
		name: 'teachers',
		path: '/teachers',
		primarykey: 'id',
		key: ['name', 'url', 'type', 'pre']
	},
	{
		msg: '课程',
		name: 'courses',
		path: '/courses',
		type: 'type',
		primarykey: 'id',
		key: ['type', 'plan', 'name', 'preview', 'info']
	},
	{
		msg: '轮播图',
		name: 'swiper',
		path: '/swiper',
		type: 'type',
		primarykey: 'id',
		key: ['url', 'sequence', 'type']
	},
	{
		msg: '案例',
		name: 'cases',
		path: '/cases',
		primarykey: 'id',
		key: ['name', 'url', 'score', 'learn', 'profession', 'school', 'info']
	}
];

let autoREQ = [];
AUTOTABLE.forEach(TABLE => {
	autoREQ.push({
		path: TABLE.path,
		type: 'get',
		fn: async ctx => {
			let str =
        'SELECT * FROM `' +
        TABLE.name +
        '`' +
        (TABLE.type ? ' WHERE (`type` =?)' : '');
			let arr = TABLE.type ? [ctx.query[TABLE.type]] : [];
			ctx.body = { ...config.success, data: await sql.query(str, arr) };
		}
	});
	autoREQ.push({
		path: TABLE.path,
		type: 'put',
		fn: async ctx => {
			let str,arr=['',[]]; 
			// has url mosut be has file
			if(TABLE.key.includes('url')){

				// get old image path
				str = 'SELECT * FROM `' +TABLE.name +'`' +' WHERE (`id` =?)';
				arr = [];
				arr.push(ctx.request.body[TABLE.primarykey]);
				let src = await sql.query(str,arr);

				// nerver change do not remove
				if(src[0].url!==ctx.request.body.url){

					// remove old image
					try {
						fs.unlinkSync(path.join(__dirname,'../../',src[0].url.replace(config.source,'')));
						colorLog.green('[file]: unlink success');
					} catch (error) {
						logger.error('[file]: unlink fail\n',error);
					}
				}else{
					colorLog.yellow('[file]: url never chage');
				}	
			}
			// update new info
			str = 'UPDATE `' + TABLE.name + '` SET ';
			arr = [];
			for (let i = 0; i < TABLE.key.length; i++) {
				let el = TABLE.key[i];
				str += '`' + el + (i === TABLE.key.length - 1 ? '`=?' : '`=?,'); // sql语句的最后一个元素不能带","
				arr.push(ctx.request.body[el]);
			}
			str += ' WHERE (`id`=?)';
			arr.push(ctx.request.body[TABLE.primarykey]);
			let res = await sql.query(str, arr);
			if (res.affectedRows === 1) {
				ctx.body = { ...config.success };
			} else {
				ctx.body = {
					code: 400,
					msg: `更新${ctx.request.type ? ctx.request.type : ''}${
						TABLE.msg
					}时发现错误`,
					error: res
				};
			}
		}
	});
	autoREQ.push({
		path: TABLE.path,
		type: 'post',
		fn: async ctx => {
			let str = 'INSERT INTO `' + TABLE.name + '` SET ';
			let arr = [];
			for (let i = 0; i < TABLE.key.length; i++) {
				let el = TABLE.key[i];
				str += '`' + el + (i === TABLE.key.length - 1 ? '`=?' : '`=?,'); // sql语句的最后一个元素不能带","
				arr.push(ctx.request.body[el]);
			}
			let res = await sql.query(str, arr);
			if (res.affectedRows === 1) {
				ctx.body = { ...config.success };
			} else {
				ctx.body = {
					code: 400,
					msg: `创建${ctx.request.type ? ctx.request.type : ''}${
						TABLE.msg
					}时发现错误`,
					error: res
				};
			}
		}
	});
	autoREQ.push({
		path: TABLE.path,
		type: 'del',
		fn: async ctx => {
			let { id } = ctx.request.body;
			id.forEach(async el => {
				// remove file
				let src = await sql.query('SELECT * FROM `' +TABLE.name +'`' +' WHERE (`id` =?)',[id]);
				if(src[0].url){
					try {
						fs.unlinkSync(path.join(__dirname,'../../',src[0].url.replace(config.source,'')));
						colorLog.green('[file]: unlink success');
					} catch (error) {
						logger.error('[file]: unlink fail\n',error);
					}
				}else{
					colorLog.yellow(`[file]: no url in ${TABLE.name} item`);
				}
				// delete info from dataBase
				let res = await sql.query('DELETE FROM `' + TABLE.name + '` WHERE (`id`=?)',[el]);
				if (!res.message) {
					ctx.body = {
						code: 400,
						msg: `删除${ctx.request.type ? ctx.request.type : ''}${
							TABLE.msg
						}${el}时发现错误`,
						error: res
					};
				}
			});
			ctx.body = { ...config.success };
		}
	});
});

module.exports = autoREQ;
if(process.argv[2]=='buildSql'){
	autoCreateSQL();
}
// 执行下面这个函数就可以获得一个自动建表的脚本,不过数据类型太死板,还可以再调调
function autoCreateSQL() {
	let str = '';
	AUTOTABLE.forEach(el => {
		str += `DROP TABLE IF EXISTS \`${el.name}\`;\nCREATE TABLE \`teachers\` (\n  \`id\` int(11) NOT NULL AUTO_INCREMENT,`;
		el.key.forEach(item => {
			str += `  \`${item}\` text,\n`;
		});
		str +=
      '  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'CURRENT_TIMESTAMP\',\n  PRIMARY KEY (`id`)\n)ENGINE=InnoDB DEFAULT CHARSET=utf8;\n';
	});
	const fs = require('fs');
	fs.writeFileSync('./autoCreateSQL.sql', str);
	colorLog.green('[file]: createSql success . file in  autoCreateSQL.sql');
}
