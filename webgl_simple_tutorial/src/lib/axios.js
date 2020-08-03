/**
 * 
 * @param {String} method get post
 * @param {String} url 
 * @param {object} data 
 * @param {string} responseType 
 */
let axios = function (method, url,data,responseType) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.send(data)
    xhr.responseType = responseType || 'text'
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
  });
};
export default axios;
