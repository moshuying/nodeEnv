/* eslint-disable no-unused-vars */
/**
 * @Author :墨抒颖
 * @Date :2020-02-08 21:33:06
 * @LastEditTime :2020-02-09 22:02:29
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
const sql = require('../mysql');
const config = require('../../config');
/**
	每一个接口包含get,put,post,del
	get  返回对应表下的所有数据,如果有type则过滤一下
	put  用于更新数据,需传入所有字段,
	post  用于创建数据
	del  批量删除,传入id数组即可
{
	msg: '教师', // 返回的提示信息,前端用以区分不同接口
	name: 'teachers', // 表的名称
	path: 'teachers', // 请求路径
	// type:'type', // 类型,查询表下不同数据时使用
	primarykey: 'id', // 主键,修改时使用
	key: ['name', 'url', 'type', 'pre'] // 新增和修改
};
*/
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

let req = [];
AUTOTABLE.forEach(TABLE => {
	req.push({
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
	req.push({
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
	});
	req.push({
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
	req.push({
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
	});
});

module.exports={
	req,
	TABLE:AUTOTABLE
};
