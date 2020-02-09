/**
 * @Author :墨抒颖
 * @Date :2020-02-06 18:18:17
 * @LastEditTime :2020-02-09 22:33:03
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validPassword(str) {
  const valid_map = ['123456', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
