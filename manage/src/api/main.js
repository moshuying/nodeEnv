/**
 * @Author :墨抒颖
 * @Date :2020-02-09 00:50:38
 * @LastEditTime :2020-02-09 03:00:52
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
import request from '@/utils/request'
export const get = async(url, params) => {
  return request({
    url,
    method: 'get',
    params
  })
}
export const put = async(url, data) => {
  return request({
    url,
    method: 'put',
    data
  })
}

export const del = async(url, data) => {
  return request({
    url,
    method: 'delete',
    data
  })
}

export const post = async(url, data) => {
  return request({
    url,
    method: 'post',
    data
  })
}
