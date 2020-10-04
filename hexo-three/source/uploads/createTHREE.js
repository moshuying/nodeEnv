/**
 * 向指定div内创建iframe标签,同时为hexo做了简单适配
 * @param {string} divId
 */
function createIframe(divNode) {
  return new Promise((resolve) => {
    let iframe = document.createElement("iframe");
    iframe.scrolling = "no";
    iframe.border = 0;
    iframe.frameborder = "no";
    iframe.framespacing = 0;
    iframe.allowfullscreen = true;
    iframe.style =
      "position: absolute; width: 100%; height: 100%; left: 0; top: 0;border:none;";
    iframe.onload = () => resolve(iframe.contentWindow);
    divNode.style = "position: relative; width: 100%; height: 0; padding-bottom: 75%;";
    divNode.appendChild(iframe);
  });
}

/**
 * 
 * @param {string} str 
 * @param {string} type 
 * @return {string} blob url
 */
function createBlob(str,type){
  let blob = new Blob([str],{type})
  return URL.createObjectURL(blob)
}

/**
 * 用于创建iframe框的默认样式，清除掉影响美观的属性
 * @return {string} 返回一个blob
 */
function createCss(){
  return createBlob(`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  canvas:focus {
    outline: none;
  }
  `,'text/css')
}

/**
 * 创建 iframe
 * @param {string} divId
 * @return {Promise}
 */
function cdnLoadTHREE(divNode) {
  return createIframe(divNode).then((iframe_window) => {
    // 创建完iframe才有了iframe内的iframe_window对象
    let link = document.createElement('link')
    link.href = createCss()
    link.rel = 'stylesheet'
    link.type = 'text/css'
    iframe_window.document.head.appendChild(link);
    return new Promise((resolve)=>resolve(iframe_window));
  });
}

/**
 * 
 * @param {HTMLelement} divNode 放置iframe的dom元素
 * @param {HTMLelement} scriptNode 放置
 * @example <div id="three"></div>
<script type="module" id="threeMain">
if (!(self.frameElement && self.frameElement.tagName == "IFRAME")) {
  import("./createTHREE.js").then((result) => result.initHexoThreeModule(document.getElementById("three"),document.getElementById("threeMain")));
} else {
  // 这里的代码会被直接执行，window指向iframe内的window（其实就是把代码整个移动到了iframe内）
  import('./glsl_snippets.js').then(async res=>res.glsl_snippets(res.anotherGlsl))
}
</script>
 */
function initHexoThreeModule(divNode,scriptNode) {
  let link = document.createElement("link");
  link.href = createCss();
  link.rel = "stylesheet";
  link.type = "text/css";
  document.head.appendChild(link);
  if(divNode && scriptNode){
    cdnLoadTHREE(divNode).then((iframe_window)=>{
      let script = document.createElement('script')
      script.src = createBlob(scriptNode.text,'application/javascript')
      iframe_window.document.head.appendChild(script)
    })
  }
}

export default initHexoThreeModule

export {
  initHexoThreeModule,
  createBlob,
  cdnLoadTHREE,
  createIframe,
  createCss
}
