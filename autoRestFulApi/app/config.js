/**
 * @Author :墨抒颖
 * @Date :2020-02-06 19:02:07
 * @LastEditTime :2020-02-09 20:36:19
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
	source:'http://moshuying.top:'+8000, // 上传文件后返回的图片url
	database:{
		USERNAME:'root',
		PASSWORD:'',
		DATABASE:'',
		PORT: '',
		HOST: 'moshuying.top'
	}
};
module.exports=config;