# koa后台 自动生成api

一个koa后台可以自动生成各种接口的api,部分遵循restful风格,已配置logger,静态资源上传接口

### 项目结构
```
index.js  执行入口
		app 
				assets  静态文件存储目录
				lib
						api   接口文件存储目录
								upload.js  静态资源上传接口
								TEMPLET.js  模板文件,不输出接口仅作参考用
								zMain.js  自动api
						mysql.js  mysql链接类
				config.js  项目配置文件
				index.js		项目主文件
				logger.js		日志管理
				request.js	自动扫描api目录
				makeSql.js  自动生成sql脚本

```
### 自动生成api

自动api入口文件位于/app/lib/api/zMain.js按照样例输入即可

```js
/**
  * 每一个接口包含get,put,post,del
	* get  返回对应表下的所有数据,如果有type则过滤一下
	* put  用于更新数据,需传入所有字段,
	* post  用于创建数据
  * del  批量删除,传入id数组即可
*/
{
	msg: '教师', // 返回的提示信息,前端用以区分不同接口
	name: 'teachers', // 表的名称
	path: 'teachers', // 请求路径
	// type:'type', // 类型,查询表下不同数据时使用
	primarykey: 'id', // 主键,修改时使用
	key: ['name', 'url', 'type', 'pre'] // 新增和修改
};
```

需要补充接口时在/app/lib/api下新建文件并参照TEMPLET.js中的格式创建即可,注意文件exports需要输出req对象

读取文件无误后控制台会依次输出各个接口信息,并显示`server is running at 8000`

![image](https://github.com/moshuying/nodeEnv/tree/master/autoRestFulApi/success.png)

### 自动生成创建数据库的脚本

如果是先做的前端页面,那么您对需要的数据结构已经有了大致的了解,按照上面的格式书写了

