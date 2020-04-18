/**
 * @Author :墨抒颖
 * @Date :2020-02-06 19:02:07
 * @LastEditTime :2020-04-17 23:01:04
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
const config = {
	sport:8000,
	success:{ // 所有api处理成功时的返回信息
		code:200,
		msg:'处理成功'
	},
	source:'<your source url>'+8000, // 前面的字符串记得换成你 上传文件后返回的图片url
	database:{ // 数据库配置
		USERNAME:'',
		PASSWORD:'',
		DATABASE:'',
		PORT: '',
		HOST: ''
	},
	tinifykey:'' // 去这里申请 https://tinypng.com/developers/reference/nodejs
};
module.exports=config;