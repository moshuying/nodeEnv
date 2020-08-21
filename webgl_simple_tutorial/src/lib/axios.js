/**
 *
 * @param {String} method get post
 * @param {String} url
 * @param {object} data
 * @param {string} responseType
 */
function Axios(method, url,data,responseType) {
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
export default Axios;

/**
 * 请求核心
 * @param {{method:string,url:string,data:object,config:{responseType:string}}}userConfig
 */
function axiosCore(userConfig){
  const defualtConfig = {
    method:'get',
    url:'/',
    data:null,
    timeout:5000,
    config:{
      responseType:'text',
      heder:{}
    }
  }
  let {method,url,data,timeout,config} =  {...defualtConfig,userConfig}
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    if(data){
      //构造表单数据
      let formData = new FormData();
      for(const key in data){
        if(data.hasOwnProperty(key)){
          formData.append(key, data[key]);
        }
      }
      data = formData
    }
    if(method === 'get' && data){
      let str = '?'
      for(const key in data){
        if(data.hasOwnProperty(key)){
          str+=`${key}=${data[key]}&`
        }
      }
      data = str
    }

    if(config.heder){
      for(const key in config.heder){
        if(config.heder.hasOwnProperty(key)){
          xhr.setRequestHeader(key,config.heder[key])
        }
      }
    }
    xhr.timeout = timeout
    xhr.responseType = config.responseType
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
    try{
      xhr.send(data)
    }catch (e) {
      console.error('[axios core Error] xhr.send Error'+ e)
    }
  });
}
export {axiosCore}
