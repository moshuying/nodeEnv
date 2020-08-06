  import * as THREE from "three";

const { Scene, PerspectiveCamera, WebGLRenderer } = THREE;
/**
 * 还原点光源问题并修复
 */
class FixBug {
  /**
   * @param threeBox
   * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
   */
  constructor(threeBox) {
    this.name = "FixBug";
    this.threeBox = threeBox;
    this.mountArray = ["addSelect", "resetSelect"];
    this.Event = {
      resizeEvent: [],
      clickEvent: [],
    };
    this.init();
  }
  init() {
    let pointLight = new THREE.SpotLight(0xffffff)
    pointLight.castShadow = true;
    pointLight.angle = 0.5
    pointLight.penumbra = 0.5
    pointLight.decay = 1
    pointLight.distance = 20000
    pointLight.intensity  = 2
    pointLight.castShadow = true;
    
    pointLight.position.z = 1000
    pointLight.position.y = 800
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 200;

    this.threeBox.scene.add(pointLight);

    let SpotLightHelper = new THREE.SpotLightHelper(pointLight)
    let shadowCameraHelper = new THREE.CameraHelper( pointLight.shadow.camera );
    this.threeBox.scene.add(shadowCameraHelper)
    this.threeBox.scene.add(SpotLightHelper)

    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000,2000),
      new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } )
    )
    mesh.receiveShadow = true;

    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(100,100,10),
      new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } )
    )
    box.position.z = 60
    box.castShadow = true;
    this.threeBox.scene.add(box)
    this.threeBox.scene.add(mesh)
  }
  initEvent() {
    this.Event.resizeEvent.push(() => {});
    this.Event.clickEvent.push(() => {});
  }

  render() {}
}
export default FixBug;
