import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import {Sky} from "three/examples/jsm/objects/Sky";
import {ShaderPass} from  'three/examples/jsm/postprocessing/ShaderPass'
import {EffectComposer} from  'three/examples/jsm/postprocessing/EffectComposer'
import {FXAAShader} from  'three/examples/jsm/shaders/FXAAShader'
import dat from "three/examples/jsm/libs/dat.gui.module";

/**
 * @return {THREE.WebGLRenderer} 返回部分初始化的webGlrenderer对象
 */
function renderer() {
    let renderer = new THREE.WebGLRenderer({antialias:true})
    renderer.setSize(
        window.innerWidth * 1,
        window.innerHeight * 1
    );
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xffffff, 1); //默认填充颜色
    // renderer.shadowMap.enabled = true; //告诉渲染器需要阴影效果
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.5;
    // renderer.setPixelRatio(window.devicePixelRatio); //设置dip 避免hiDPI设备模糊
    // renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
    document.body.appendChild(renderer.domElement);
    // renderer.autoClear = false;
    // renderer.debug.checkShaderErrors = false;
    return renderer
}

/**
 * @return {THREE.PerspectiveCamera} 返回透视摄像机
 */
function camera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(10, 10, 10)
    return camera
}

/**
 *
 * @returns {THREE.Scene} 返回部分初始化的THREE场景
 */
function scene() {
    const scene = new THREE.Scene()
    scene.autoUpdate = true;

    scene.name = 'indexScene'
    scene.background = new THREE.Color(0xe3e3e3)
    scene.add(new THREE.AxesHelper(10))
    let ambientLight = new THREE.AmbientLight("#111111");
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight("#ffffff");
    // directionalLight.position.set(-40, 12, -130);

    directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
    directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
    directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = 50; //最右边
    directionalLight.shadow.camera.top = 50; //最上边
    directionalLight.shadow.camera.bottom = -50; //最下面

    //这两个值决定使用多少像素生成阴影 默认512
    directionalLight.shadow.mapSize.height = 8192;
    directionalLight.shadow.mapSize.width = 8192;
    //告诉平行光需要开启阴影投射
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    // let debug = new THREE.CameraHelper(directionalLight.shadow.camera);
    // debug.name = "debug";
    // scene.add(debug);
    let plan = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000),new THREE.MeshBasicMaterial({color:0xc3c3c3}))
    plan.name='plan'
    plan.rotation.x = -0.5 * Math.PI
    plan.position.y = -0
    plan.receiveShadow = true
    scene.add(plan)
    return scene;
}

/**
 * 初始化基本的controls
 * @param {THREE.PerspectiveCamera} camera
 * @param {HTMLCanvasElement} dom
 * @returns {OrbitControls}
 */
function controls(camera, dom) {
    const controls = new OrbitControls(camera, dom)

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );

    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;

    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;

    //是否可以缩放
    controls.enableZoom = true;

    //是否自动旋转
    controls.autoRotate = false;

    //设置相机距离原点的最近距离
    // controls.minDistance = 50;

    //设置相机距离原点的最远距离
    // controls.maxDistance = 200;

    //是否开启右键拖拽
    controls.enablePan = true;
    return controls
}

/**
 * 初始化性能插件
 * @param {HTMLElement} dom
 * @return {Stats}
 */
function StatsStart(dom) {
    dom = dom || document.body
    let stats = new Stats()
    dom.appendChild(stats.dom)
    return stats
}

/**
 *
 * @return {dat.GUI}
 */
function initGUI() {
    window.gui = new dat.GUI()
}

/**
 * 当窗口宽高变化时执行
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @example window.onresize = (e)=>{Start.onWindowResize(this.camera,this.renderer)}
 */
function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth * 1,
        window.innerHeight * 1
    );
    renderer.domElement.style = `width:${window.innerWidth}px;height:${window.innerHeight}px`;
}

/**
 * 大方盒子的天空盒，附带光源，缩放小了能看出来
 * @param {THREE.Scene} scene 场景
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @param {number} scalar 缩放数值
 */
function initSkyByMesh(scene, renderer, scalar) {
    let sky = new Sky();
    sky.scale.setScalar(scalar || 10000);
    scene.add(sky);

    let uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 2;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;

    let pmremGenerator = new THREE.PMREMGenerator(renderer);
    let theta = Math.PI * (0.49 - 0.5);
    let phi = 2 * Math.PI * (0.205 - 0.5);
    let sun = new THREE.Vector3()
    sun.x = Math.cos(phi)
    sun.y = Math.sin(phi) * Math.sin(theta)
    sun.z = Math.sin(phi) * Math.cos(theta)
    sky.material.uniforms["sunPosition"].value.copy(sun)
    scene.environment = pmremGenerator.fromScene(sky).texture

    let dirLight = new THREE.DirectionalLight(0xffffff,0.5)
    dirLight.position.set(-500,10,-2000)
    scene.add(dirLight)
}

/**
 * 地板割线
 * @param {THREE.Scene} scene
 */
function initFloorBoard(scene,size,divisions) {
    let grid = new THREE.GridHelper(size, divisions, 0xffffff, 0xffffff);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);
}

/**
 * 抗锯齿
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer 渲染器
 * @return {EffectComposer}
 */
function initFxaa(scene,renderer) {
  FXAAShader.uniforms.resolution.value.x = 1 / (window.innerWidth * window.devicePixelRatio)
  FXAAShader.uniforms.resolution.value.y = 1 / (window.innerHeight * window.devicePixelRatio)
  let fxaa = new ShaderPass(FXAAShader)
  let composer = new EffectComposer(renderer)
  composer.renderToScreen = true
  composer.addPass(fxaa)
  return composer
}
function logImage(base64){
    console.log("%c+",
  `background-image: url(${base64});
  background-size: contain;
  background-repeat: no-repeat;
  color: transparent;`);
}
window.console.logImage = logImage
export default {
    renderer,
    camera,
    scene,
    controls,
    initGUI,
    StatsStart,
    onWindowResize,
    initSkyByMesh,
    initFloorBoard,
    initFxaa
}