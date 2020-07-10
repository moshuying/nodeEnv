import * as THREE from "three";
class Start{
  constructor(){
    return this
  }
  /**
   * @return {THREE.WebGLRenderer} 返回webGlrenderer对象
   */
  renderer(){
    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(
      window.innerWidth * 1,
      window.innerHeight * 1
    );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xffea00, 0.5); //默认填充颜色
    renderer.shadowMap.enabled = true; //告诉渲染器需要阴影效果
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.setPixelRatio(window.devicePixelRatio); //设置dip 避免hiDPI设备模糊
    renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.debug.checkShaderErrors = false;
    return renderer
  }
  /**
   * @return {THREE.PerspectiveCamera} 返回透视摄像机
   */
  camera(){
    let camera = new THREE.PerspectiveCamera(75,window.innerWidth/ window.innerHeight,0.1,10000)
    camera.position.set(10,10,10)
    return camera
  }
}
export {Start}