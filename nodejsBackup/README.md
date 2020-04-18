# nodejs 定时提交和备份至百度云 (目前仅支持liunx)

nodejs自动备份
其实这个东西用shell脚本,python也能实现,用nodejs的主要目的就是能方便的放到后台中,把开发环境整合到一起而不是各种语言都来一份

注意使用前编辑config.templete.js配置相关信息
邮件发送需配置stmp,各大邮箱都包含此功能
百度云备份需要安装bypy并授权

> git clone https://github.com/moshuying/hidden.git && cd hidden && npm i && node index.js 
enjoy it

## 功能目标
+ [x] 自动备份数据库和项目目录
+ [x] 自动上传至百度云
+ [x] 完成后发送邮件
+ [ ] 邮件中表格展现各任务的运行时间