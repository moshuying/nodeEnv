/**
 * @Author :墨抒颖
 * @Date :2019-12-21 19:41:38
 * @LastEditTime :2020-02-09 21:15:54
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :主文件
 */

const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();  /*引入是实例化路由** 推荐*/
const config = require('./config');

// 打印接收到的任何请求
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// 静态文件
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
		maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
	}
}));
// 解析请求数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser()); // 必须位于koaBody之后,否则无法响应某些请求

// 日志部分
const { accessLogger,logger } = require('./logger');
global.logger = logger;
app.use(accessLogger());
app.on('error', err => {console.log(err);logger.error(err); });

// 返回头中加入响应时间
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

// 引入API请求文件
const restfulapi = require('./request');
restfulapi.forEach(el=>{
	console.log(el);
	router[el.type](el.path,el.fn);
});

/*
* router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
* 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
* 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
*/
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.sport);
console.log('server is running at '+config.sport);