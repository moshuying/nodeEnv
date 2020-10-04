# hexo + three.js

在hexo中嵌入three.js运行shader或者three.js的场景

clone代码后查看运行时效果

> 主题文件可以切到主题目录下输入以下命令下载主题，也可以自行安装主题或到我的小站查看效果[https://moshuying.top](https://moshuying.top)

```sh
git clone https://github.com/hexojs/hexo-theme-landscape.git ./
```


最近想在hexo中嵌入一些shader，折腾了一些时间后终于完善，实际上用这种方法不仅可以在hexo中嵌入shader,也可以嵌入babylonjs,pxixjs,Layabox,Egret,Cocos2等，先看效果，原理什么的其实很简单。

> 由于一些shader特别消耗显卡性能，在`glsl_snippets.js`中判定如果第一帧渲染时间超过**0.4秒**就不再渲染了。

**也可以点击shader暂停渲染**

# 嵌入shader

shader来源[shaderToy](https://www.shadertoy.com/view/wsccWj)
完全支持shadertoy的代码，参考自大神的代码[stackoverflow](https://stackoverflow.com/questions/36983769/export-from-shadertoy-to-three-js)，在这位大神的代码里获取到完全兼容shaderToy的思路。并将其改成更适用在hexo中。

示例代码

```html
<!-- 至少需要一个div来放置iframe，这样可以方便的将代码移入文章底部 -->
<div id="three"></div>
<script type="module" id="threeMain">
if (!(self.frameElement && self.frameElement.tagName == "IFRAME")) {
  import("http://localhost:4000/uploads/createTHREE.js").then((result) => result.initHexoThreeModule(document.getElementById("three"),document.getElementById("threeMain")));
} else {
  // 这里的代码会被直接执行，window指向iframe内的window（其实就是把代码整个移动到了iframe内）
  import('http://localhost:4000/uploads/glsl_snippets.js').then(async res=>res.glsl_snippets(res.anotherGlsl))
}
</script>
```
# 显示效果

![](./source/uploads/shader.png)

# 嵌入threejs3D场景
![](./source/uploads/threejs3d.png)

**一般情况下不建议在一个页面放多个效果**如有必要，可以通过交互时渲染，在视图内渲染等方法优化，避免页面卡死

建议clone下这个仓库并运行起来，这两个效果都是可以交互的，也可以直接访问我的小站查看效果[https://moshuying.top](https://moshuying.top)

# 实现原理

原因就是hexo对md文件中的script会渲染到页面上，但是不会显示出来，这就有充足的操作空间了。

这里使用iframe的主要原因就是防止来回切换页面导致的webgl上下文问题。不然也不至于这么麻烦。

```js
// 创建iframe并返回iframe内的window对象
function createIframe(divNode) {
  return new Promise((resolve) => {
    let iframe = document.createElement("iframe");
    // ...
    iframe.style =
      "position: absolute; width: 100%; height: 100%; left: 0; top: 0;border:none;";
    iframe.onload = () => resolve(iframe.contentWindow);
    divNode.style = "position: relative; width: 100%; height: 0; padding-bottom: 75%;";
    divNode.appendChild(iframe);
  });
}
```

创建完iframe后可以为iframe中加载对象了，之前使用的是经典前端的script src加载方式，考虑到可能会被用到，这里保留了函数方便后续修改。
实际使用中利用module中的`import()`函数直接引入在线文件即可

```js
function cdnLoadTHREE(divNode) {
  return createIframe(divNode).then((iframe_window) => {
    // 创建完iframe才有了iframe内的iframe_window对象
    let link = document.createElement('link')
    link.href = createCss() // 这里对一些样式做了简单修改。
    link.rel = 'stylesheet'
    link.type = 'text/css'
    iframe_window.document.head.appendChild(link);
    return new Promise((resolve)=>resolve(iframe_window));
  });
}
```

最后将整个script标签复制到iframe内，代码会在复制完后立即执行，由于代码已经在iframe内了，所以window也指向了iframe中，这一步才使得可以方便的使用module保证了向前兼容的同时，也能对老式的代码向下兼容。不至于出现一些奇奇怪怪的问题。

```js
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
```

加载iframe到hexo中的完整代码

在iframe中加载three的完整代码