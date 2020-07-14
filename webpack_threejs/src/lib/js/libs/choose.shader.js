import * as THREE from "three";
import {ShaderBuilder} from './ShaderBuilder'
class ChooseShader {
  /**
   * 
   * @param {THREE.Scene} scene 
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(scene, camera) {
    this.scene=scene
    this.camera=camera
    this.renderer = new THREE.WebGLRenderer()
    this.ShaderArray = [];
    this.uniforms = {
      time:{value:1.0}
    }
    this.initData()
    this.makePlan()
    this.addMesh()
    this.moveCamera(200)
    this.initGUI()
    return this
  }

  /**
   *
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera}camera
   */
  makePlan(scene, camera) {
    scene = scene||this.scene
    camera =camera || this.camera
    let floorBoard = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 0.8,
        map: new THREE.TextureLoader().load(
          window.BaseUrl + "src/lib/textures/grasslight-big.jpg"
        ),
      })
    );
    floorBoard.rotation.x = -Math.PI / 2;
    floorBoard.position.x = -51;
    floorBoard.position.z = -51;
    scene.add(floorBoard);
  }
  /**
   *
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera}camera
   */
  addMesh(scene,camera){
    scene = scene||this.scene
    camera =camera || this.camera
    for (let i = 0; i < 10; i++) {// x
      for (let j = 0; j < 10; j++) { // y
        let cube = new THREE.BoxBufferGeometry(5, 5, 5);
        let mesh = new THREE.Mesh(
            cube,
            this.ShaderArray[
                j > this.ShaderArray.length - 1 ? this.ShaderArray.length - 1 : j
                ]
        );
        mesh.position.x = i * 10 - 95;
        mesh.position.y = 3;
        mesh.position.z = j * 10 - 95;
        mesh.updateMatrix();
        mesh.layers.enable(1);
        scene.add(mesh);
      }
    }
  }

  /**
   * 毫秒时间后移动摄像机
   * @param {number} mstime
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {number} options.z
   */
  moveCamera(mstime,options) {
    let {x,y,z} = options||{x:-50,y:40,z:-50}
    const sleep = async (time) =>{
      await (new Promise((resolve, reject) => {
        setTimeout(()=>{resolve(1)},time)
      }))
      this.camera.position.set(x, y, z);
      // this.camera.up.set(-50, 0, -50)
      this.camera.lookAt(x, 0, z);
    }
    sleep(mstime)
  }

  /**
   * 初始化相机控制gui
   */
  initGUI(){
    let gui = window.gui
    let gcamera = gui.addFolder('camera')
    let guiMenu = {cameraPosition:'choseShader'}
    const self = this
    gcamera.add(guiMenu,'cameraPosition',['choseShader','default']).onChange(e=>{
      switch (e) {
        case 'choseShader':self.moveCamera(0,{x:-50,y:40,z:-50});break
        case 'default':self.moveCamera(0, {x:10,y:0,z:10});break
      }
    })
    gcamera.open()
  }
  animation(){

  }
  initData(){
    this.ShaderArray = [
      new ShaderBuilder().setfragmentShader(`
      #ifdef GL_ES
      precision lowp float;
      #endif
      uniform float u_time;
      vec4 red(){
          return vec4(0.650,1.000,0.454,1.000);
      }
      void main() {
        gl_FragColor = red();
      }`).build(),
      new ShaderBuilder().setfragmentShader(`
      #ifdef GL_ES
      precision mediump float;
      #endif
      uniform float ratio;
      void main() {
        gl_FragColor = vec4(abs(sin(ratio*2.0)),0.775,0.211,1.0);
      }
      `).setuniforms(window.uniforms).build(),
      new ShaderBuilder().setfragmentShader(`
      #ifdef GL_ES
      precision mediump float;
      #endif
      void main() {
        vec2 st = gl_FragCoord.xy/gl_FragCoord.x;
        gl_FragColor = vec4(st.x,st.y,0.0,1.0);
      }`).build(),
      new ShaderBuilder().setfragmentShader(`
      #ifdef GL_ES
      precision mediump float;
      #endif
      void main() {
        vec2 st = gl_FragCoord.xy/vec2(300.,300.);
        gl_FragColor = vec4(st.x,st.y,0.776,1.0);
      }
      `).build(),
    ]
  }
}
export default ChooseShader;
