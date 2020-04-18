/**
 * @Author :墨抒颖
 * @Date :2019-12-21 19:41:38
 * @LastEditTime :2020-03-20 09:19:03
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
const colorLog = require('./lib/colorLog');
// 判断操作系统类型
const os = require('os');
global.config = require('./config');
if(os.type() === 'Linux'){
	for(const key in global.config.path){
		global.config.path[key]=global.config.path[key].replace(/\\/g,'/');
	}
}
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();  /*引入是实例化路由** 推荐*/
const static = require('koa-static');
app.use(static(__dirname));

const cors = require('koa2-cors'); //跨域处理
app.use(
	cors(async (ctx, next) => {
		ctx.set('Access-Control-Allow-Origin', '*');
		ctx.set(
			'Access-Control-Allow-Headers',
			'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
		);
		ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		await next();
	})
);

// Put,post等方式从body中取数据
const koaBody = require('koa-body');
app.use(koaBody({
	multipart: true,
	strict: false, // 设为false
	formidable: {
		maxFileSize: 20 * 1024 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
	}
}));

const bodyParser = require('koa-bodyparser');
app.use(bodyParser()); // 必须位于koaBody之后,否则无法响应某些请求

const { accessLogger,logger } = require('./logger');
global.logger = logger;
app.use(accessLogger());
app.on('error', err => {colorLog.redBG(err);logger.error(err); });

// 响应时间
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
	console.log(`[http request]: ${ctx.method} ${ctx.url} - ${ms} - ${(new Date()).toLocaleString()}`);
});

// 引入API请求文件
const restfulapi = require('./request');
restfulapi.forEach(el=>{router[el.type](el.path,el.fn);});

/*
* router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
* 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
* 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
*/
app.use(router.routes());
app.use(router.allowedMethods());

if(process.argv[2]==='serve') {
	app.listen(global.config.sport);
}
colorLog.blue('server is runing in '+os.type() +' at '+global.config.sport+' . The environment is '+process.argv[2]);
module.exports = {app,restfulapi};