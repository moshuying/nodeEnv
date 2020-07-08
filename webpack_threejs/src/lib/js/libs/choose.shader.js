import * as THREE from "three";

class ChooseShader {
  constructor() {
    this.ShaderArray = [
      new THREE.RawShaderMaterial({
        uniforms: window.uniforms2,
        vertexShader: [
          "precision mediump float;",
          "precision mediump int;",
          "uniform mat4 modelViewMatrix;",
          "uniform mat4 projectionMatrix;",
          "attribute vec3 position;",
          "varying vec3 vPosition;",
          "void main() {",
          "  vPosition = position;",
          "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
          "}",
        ].join("\n"),
        fragmentShader: [
          "precision mediump float;",
          "precision mediump int;",
          "uniform float ratio;",
          "varying vec3 vPosition;",
          "void main() {",
          "  vec3 center = vec3( 0.0,0.0,0.0 );",
          "  float dist=  distance(vPosition,center)/20.0;",
          "  dist = clamp(dist,0.0,1.0);",
          "  float color = 1.0-dist ;",
          "  gl_FragColor =  vec4( ratio*0.7, color*ratio*0.7,color*ratio*0.7,dist);",
          "}",
        ].join("\n"),
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
    for(let i = 0;i<10;i++){
      for(let j = 0;j<10;j++){
        let cube = new THREE.BoxBufferGeometry(50,50,50)
        let mesh = new THREE.Mesh(cube,this.ShaderArray[0])
        mesh.position.x = i*100-4950
        mesh.position.y= 26
        mesh.position.z=j*100-450
        mesh.updateMatrix();
        mesh.layers.enable(1);
        scene.add(mesh)
      }
    }
    // this.makeShaderBox(scene)
  }
  makeShaderBox(scene){
    // let position = []
    for(let i = 0;i<10;i++){
      for(let j = 0;j<10;j++){
        console.log(1)
        let position = new THREE.Vector3(i-3500,1,j+200)
        // position.push(new Vector3(i-3500,1,j+200))
        let cube = new THREE.BoxBufferGeometry(100,100,100)
        let mesh = new THREE.Mesh(cube,new THREE.MeshStandardMaterial({
          color:0xfffff,
          roughness: 0,
          map:new THREE.TextureLoader().load(BaseUrl+'src/lib/textures/crate.gif')
        }))
        mesh.position.set(position)
        mesh.updateMatrix();
        mesh.layers.enable(1);
        scene.add(mesh)
      }
    }
    // this.ShaderArray.forEach(el,ix=>{
    //   let cube = new THREE.BoxBufferGeometry(100,100,100)
    //   let mesh = new THREE.Mesh(cube,this.ShaderArray[0])
    //   scene.add()
    // })
  }
  moveCamera(camera){
    camera.position.set(-4500,800,0)
    camera.lookAt(new THREE.Vector3(-4500,0,200))
  }

}
export default ChooseShader;
