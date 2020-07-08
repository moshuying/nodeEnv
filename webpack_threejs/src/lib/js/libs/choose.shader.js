import * as THREE from "three";

class ChooseShader {
  constructor() {
    this.ShaderArray = [
      new THREE.RawShaderMaterial({
        uniforms: window.uniforms2,
        vertexShader: `
        attribute vec4 a_Position;
        varying vec2 uv;
        void main() {
            gl_Position = vec4(vec2(a_Position), 0.0, 1.0);
            uv = vec2(0.5, 0.5) * (vec2(a_Position) + vec2(1.0, 1.0));
        }
    `,
        fragmentShader: `
        uniform float ratio;
        precision mediump float;
        varying vec2 uv;    
        void main() {
            float r = uv.x;
            float g = uv.y;
            float b = abs(sin(ratio));
            gl_FragColor = vec4(r,g,b,1.);
        }
    `,
        side: THREE.DoubleSide,
      }),
    ];
  }
  /**
   *
   * @param {*} material sclect from this.ShaderArray or other Material
   * @param {object} options
   * @param {number} options.width plan
   * @param {number} options.height
   */
  toPlan(material, options) {
    let { width, height } = options || {};
    width = width || 20;
    height = height || 20;
    let Plan = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(width, height),
      material
    );
    Plan.rotation.x = -Math.PI / 2;
    return Plan;
  }
  makePlan(scene){
    let floorBoard = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 0.8,
        map:new THREE.TextureLoader().load(window.BaseUrl+'src/lib/textures/grasslight-big.jpg')
      })
    );
    floorBoard.rotation.x = -Math.PI / 2;
    floorBoard.position.x = -4500
    scene.add(floorBoard)
    // for(let i = 0;i<10;i++){
    //   for(let j = 0;j<10;j++){
    //     let cube = new THREE.BoxBufferGeometry(50,50,50)
    //     let mesh = new THREE.Mesh(cube,new THREE.RawShaderMaterial({
    //       uniforms: window.uniforms2,
    //       vertexShader: `
    //       attribute vec4 a_Position;
    //       varying vec2 uv;
    //       void main() {
    //           gl_Position = vec4(vec2(a_Position), 0.0, 1.0);
    //           uv = vec2(0.5, 0.5) * (vec2(a_Position) + vec2(1.0, 1.0));
    //       }
    //   `,
    //       fragmentShader: `
    //       uniform float ratio;
    //       precision mediump float;
    //       varying vec2 uv;    
    //       void main() {
    //           float r = uv.x;
    //           float g = uv.y;
    //           float b = abs(sin(ratio));
    //           gl_FragColor = vec4(r,g,b,1.);
    //       }
    //   `,
    //       side: THREE.DoubleSide,
    //     }))
    //     mesh.position.x = i*100-4950
    //     mesh.position.y= 26
    //     mesh.position.z=j*100-450
    //     mesh.updateMatrix();
    //     mesh.layers.enable(1);
    //     scene.add(mesh)
    //   }
    // }
  }
  moveCamera(camera){
    camera.position.set(-4500,800,0)
    camera.lookAt(new THREE.Vector3(-4500,0,200))
  }

}
export default ChooseShader;
