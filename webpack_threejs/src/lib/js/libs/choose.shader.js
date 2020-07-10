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
    this.renderer = new THREE.WebGL1Renderer()
    this.ShaderArray = [];
    this.uniforms = {
      time:{value:1.0}
    }
    this.initData()
    this.moveCamera()
    // this.animation()
    return this
  }

  makePlan(scene, camera) {
    let floorBoard = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
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
    floorBoard.position.x = -4500;
    scene.add(floorBoard);
    for (let i = 0; i < 10; i++) {// x
      for (let j = 0; j < 10; j++) { // y
        let cube = new THREE.BoxBufferGeometry(50, 50, 50);
        let mesh = new THREE.Mesh(
          cube,
          this.ShaderArray[
            j > this.ShaderArray.length - 1 ? this.ShaderArray.length - 1 : j
          ]
        );
        mesh.position.x = i * 100 - 4950;
        mesh.position.y = 26;
        mesh.position.z = j * 100 - 450;
        mesh.updateMatrix();
        mesh.layers.enable(1);
        scene.add(mesh);
      }
    }
    return this
  }
  moveCamera() {
    this.camera.position.set(-4800, -200, 600);
    // this.camera.up.set(400, 100, 0)
    // this.camera.lookAt({x:-4500, y:800, z:0});
    return this
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
      `).setuniforms(window.uniforms2).build(),
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
