/**
 * @Author :墨抒颖
 * @Date :2020-02-09 22:02:17
 * @LastEditTime :2020-02-09 22:20:27
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :自动生成sql脚本
 */

// 执行下面这个函数就可以获得一个自动建表的脚本,不过数据类型太死板,生成后打开文件详细调整即可
(function autoCreateSQL() {
	const fs = require('fs');
	let apipath = __dirname+'\\app\\lib\\api\\';
  
	let [AUTOSQL,str] = [[],''];
	fs.readdirSync(apipath).forEach((el)=>{
		let apiInfo = require(apipath+el).TABLE;
		// array类型来自zMain文件,
		if(Array.isArray(apiInfo)){
			apiInfo.forEach(item=>{
				AUTOSQL.push(item);
			});
		}else{
			apiInfo && AUTOSQL.push(apiInfo);
		}
	});

	AUTOSQL.forEach(el => {
		console.log(AUTOSQL);
		str += `DROP TABLE IF EXISTS \`${el.name}\`;\nCREATE TABLE \`teachers\` (\n  \`id\` int(11) NOT NULL AUTO_INCREMENT,`;
		el.key.forEach(item => {
			str += `  \`${item}\` text,\n`;
		});
		str +=
      '  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'CURRENT_TIMESTAMP\',\n  PRIMARY KEY (`id`)\n)ENGINE=InnoDB DEFAULT CHARSET=utf8;\n\n';
	});
	fs.writeFileSync('./AUTOSQL.sql', str);
})();