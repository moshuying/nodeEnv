/**
 * @Author :墨抒颖
 * @Date :2020-02-08 14:33:06
 * @LastEditTime :2020-02-09 22:26:06
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description : 生成各类接口的模板
 */
const sql = require('../mysql');
const config = require('../../config');
const TABLE = {
	msg: '样例', // 返回的提示信息,前端用以区分不同接口
	name: 'templet', // 表的名称
	path: '/templet', // 请求路径
	// type:'type', // 类型,查询表下不同数据时使用
	primarykey: 'id', // 主键,修改时使用
	key: ['templet', 'templet'] // 新增和修改
};
const req = [
	{
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
	},
	{
		path: TABLE.path,
		type: 'put',
		fn: async ctx => {
			let str = 'UPDATE `' + TABLE.name + '` SET ';
			let arr = [];
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
	},
	{
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
	},
	{
		path: TABLE.path,
		type: 'del',
		fn: async ctx => {
			let { id } = ctx.request.body;
			id.forEach(async el => {
				let res = await sql.query(
					'DELETE FROM `' + TABLE.name + '` WHERE (`id`=?)',
					[el]
				);
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
	}
];
// module.exports={
// 	req, router信息,补充请求时不必设定TABLE,按照项目所需书写接口信息即可
// 	TABLE // 输出TABLE对象用于自动生成sql
// };

