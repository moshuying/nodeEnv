/**
 * @Author :墨抒颖
 * @Date :2020-02-05 16:05:15
 * @LastEditTime :2020-02-09 03:05:53
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
const path = require('path');//引入原生path模块
const log4js = require('koa-log4');//引入koa-log4
log4js.configure({
	appenders: {
		//访问日志
		access: {
			type: 'dateFile',
			pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
			alwaysIncludePattern: true, //文件名始终以日期区分
			encoding:'utf-8',
			filename: path.join('logs/', 'access.log') //生成文件路径和文件名
		},
		//系统日志
		application: {
			type: 'dateFile',
			pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
			alwaysIncludePattern: true, //文件名始终以日期区分
			encoding:'utf-8',
			filename: path.join('logs/', 'application.log') //生成文件路径和文件名
		},
		out: {
			type: 'console'
		}
	},
	categories: {
		default: { appenders: [ 'out' ], level: 'info' },
		access: { appenders: [ 'access' ], level: 'info' },
		application: { appenders: [ 'application' ], level: 'WARN'}
	}
});

module.exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
module.exports.logger = log4js.getLogger('application');  //记录所有应用级别的日志