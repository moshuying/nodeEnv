# koa后台 自动生成api 早点下班 🍜🍜🍜

一个koa后台可以自动生成各种接口的api🍕,部分遵循restful风格,已配置logger,静态资源上传接口

> 使用前请先将config.templete.js 换成config.js并修改文件配置信息

### 功能

```sh
npm run serve # 运行服务
npm run buildSql # 根据输入的接口信息生成sql文件,自动配置sql
npm run test # 简单测试
```

功能目标🥇🥈🥉

+ [x] 自动生成api
+ [x] 自动生成sql创建数据库表
+ [x] 彩色控制台输出
+ [x] 压缩上传的图片(暂时使用tinify)
+ [x] api测试
+ [ ] 自动备份(已实现核心功能)
+ [ ] api文档

### 项目结构🎚
```
index.js  执行入口
  app 
    assets  静态文件存储目录
      lib
        api   接口文件存储目录
          upload.js  静态资源上传接口
          zMain.js  自动api
        mysql.js  mysql链接类
        colorLog.js 彩色日志
      config.templete.js  项目配置文件,按提示配置即可
      index.js		项目入口文件
      logger.js		日志管理
      request.js	自动扫描api目录
  logs 项目日志
  test api测试文件
```

### 使用方法🎆🎇🧨

自动api入口文件位于/app/lib/api/zMain.js按照以下样例输入即可

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
	key: ['name', 'url', 'type', 'pre'] // 新增和修改 url必须指向文件路径
};
```
对应的请求方法
- get 获取信息,有type筛选时在uri里面携带参数type即可
  参考样例 `https://***.***.***/query?type=examples`
- put 更新信息,在请求体内按照key携带对应的参数,在primarykey中携带更新时的主键,对于更新时包含文件(url)的,会在更新后移除旧的文件
  参考样例 `{\"name\":\"examples\",\"url\":"examples",\"id\":1234}`
- post 新增信息,按照key中的信息依次新增,不必包含主键
  参考样例 `{\"name\":\"examples\",\"url\":"examples",\"id\":0000}`
- delete 删除信息,需在body中携带删除的主键id,字段必须是id,对于包含文件url字段的的,会在删除数据库信息前删除文件
  参考样例 `{\"id\":[0000,1234]}`

>需要补充接口时在/app/lib/api下新建文件并参照upload.js中的格式创建即可,注意文件exports需要输出req对象

读取文件无误后控制台会依次输出各个接口信息,并显示`server is runing in Linux at 8000 . The environment is serve`

![image](https://github.com/moshuying/nodeEnv/tree/master/autoRestFulApi/success.png)

### 实现原理👓👓👓

在Koa的api路由中,只需要有请求路径,请求方法和处理函数即可.那么用`router[请求方法 ] (请求路径,处理函数)`就可以生成大量的重复功能的api

对于一个数据库表的增删改查这样简单的请求,只需要配置表基本信息即可,在文件`zMain.js`中的AUTOTABLE数组包含了示例数据,修改成您需要的信息即可,随后自动生成


