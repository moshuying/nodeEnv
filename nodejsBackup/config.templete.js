/**
 * @Author :墨抒颖
 * @Date :2020-04-18 11:14:48
 * @LastEditTime :2020-04-18 18:33:37
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
module.exports = {
  database: {
    u: '', // database user name
    p: '' // database user password
  },
  workspace: '/www/workspace/', // need backup workspace
  ignoreWorkspace: ['node_modules', '.git'], // ignore in workSpace
  uplaodPath: 'aliyun_first', // bypy upload path
  serveName: 'msy Aliyun', // mail title
  sendMailUser: '', // mail from user
  sendMailPass: '', // stmp mail token
  SilentImp: false // Silent implementation
}
