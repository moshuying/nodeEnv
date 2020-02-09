/**
 * @Author :墨抒颖
 * @Date :2020-02-07 18:01:59
 * @LastEditTime :2020-02-09 21:16:43
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :数据库连接类
 */
let mysql = require('mysql');
let config = require('../config');
let pool  = mysql.createPool({
	host     : config.database.HOST,
	user     : config.database.USERNAME,
	password : config.database.PASSWORD,
	database : config.database.DATABASE
});

const query = function( sql, values ) {
	return new Promise(( resolve, reject ) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject( err );
			} else {
				connection.query(sql, values, ( err, rows) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( rows );
					}
					connection.release();
				});
			}
		});
	});
};
module.exports = {
	query,
};