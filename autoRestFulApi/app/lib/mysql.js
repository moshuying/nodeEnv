/**
 * @Author :墨抒颖
 * @Date :2020-02-07 18:01:59
 * @LastEditTime :2020-02-09 03:05:42
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
let mysql = require('mysql');
const config = require('../config');
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