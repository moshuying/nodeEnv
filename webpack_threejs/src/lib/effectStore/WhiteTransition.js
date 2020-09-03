import * as THREE from "three";
const { Scene, PerspectiveCamera, WebGLRenderer } = THREE;

export default class VolumeLight {
  /**
   * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
   */
  constructor(threeBox) {
    this.name = "VolumeLight";
    this.threeBox = threeBox;
    this.Event = {};
    this.mountArray = [];
    this.init();
    this.initEvent();
  }
  init() {
    this.plan = new THREE.Mesh(
      new THREE.BoxBufferGeometry(10,10,10),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time: { value: 1.0 },
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        void main(){
          vec2 uv = vUv;
          vec3 color=vec3(0.);
          float speed=time/2.;

          float cx = 0.;
          float result = 0.;
          if(uv.y<0.5){
            cx=uv.x*2.-mod(abs(speed),1.)*2.;
          }else{
            cx=-uv.x*2.-mod(abs(speed),1.)*2.;
          }
          result=mod(cx,2.);
          gl_FragColor=vec4(result+color,result);
        }`,
        transparent: true,
        // blending:THREE.NormalBlending,
        // depthTest:false,
        // depthWrite: false,
        wireframe:true
      })
    );
    this.plan.name = "VolumeLight"
    this.plan.position.y = 15
    this.threeBox.scene.add(this.plan);
  }
  initEvent() {
    // this.Event.resizeEvent
    // this.Event.clickEvent
  }
  render() {
    this.plan.material.uniforms.time.value += 0.01
  }
}
