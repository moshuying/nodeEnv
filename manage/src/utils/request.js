/**
 * @Author :墨抒颖
 * @Date :2020-02-06 18:18:17
 * @LastEditTime :2020-02-09 03:01:01
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */

import Axios from 'axios'
import { Message } from 'element-ui'
if (process.env.VUE_APP_BASE_URL) {
  Axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
}
// create an axios instance
const service = Axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
service.interceptors.request.use(
  config => {
    // if (config.method === 'get') {
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //   config.headers['Access-Control-Allow-Origin'] = '*'
    //   config.headers['Cache-Control'] = 'no-cache'
    // }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  })

service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log(JSON.stringify(res))
    if (res.code === 200) {
      return res
    } else {
      Message({
        message: res.message,
        type: 'warning',
        duration: 5 * 1000
      })
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
