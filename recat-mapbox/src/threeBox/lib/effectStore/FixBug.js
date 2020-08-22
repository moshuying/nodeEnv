import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

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
    this.initGui();
  }
  init() {
    let pointLight = new THREE.SpotLight(0xffffff);
    pointLight.castShadow = true;
    pointLight.angle = 0.5;
    pointLight.penumbra = 0.5;
    pointLight.decay = 1;
    pointLight.distance = 1500;
    pointLight.intensity = 2;
    pointLight.castShadow = true;
    pointLight.position.z = 1000;
    pointLight.position.y = 800;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 200;
    pointLight.name = "pointLight";
    let SpotLightHelper = new THREE.SpotLightHelper(pointLight);
    SpotLightHelper.name = "SpotLightHelper";
    let shadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    shadowCameraHelper.name = "shadowCameraHelper";
    // this.threeBox.scene.add(shadowCameraHelper);
    // this.threeBox.scene.add(SpotLightHelper);
    // this.threeBox.scene.add(pointLight);

    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
    );
    mesh.receiveShadow = true;

    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(100, 100, 100),
      new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })
    );
    box.position.z = 60;
    box.castShadow = true;
    this.threeBox.scene.add(box);
    this.threeBox.scene.add(mesh);
    // White directional light at half intensity shining from the top.
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.threeBox.scene.add(directionalLight);
  }
  initGui() {
    let gui = new GUI();

    function lightadd() {
      let pointLight = new THREE.SpotLight(0xffffff);
      pointLight.castShadow = true;
      pointLight.angle = 0.5;
      pointLight.penumbra = 0.5;
      pointLight.decay = 1;
      pointLight.distance = 20000;
      pointLight.intensity = 2;
      pointLight.castShadow = true;

      pointLight.position.z = 1000;
      pointLight.position.y = 800;
      pointLight.shadow.mapSize.width = 1024;
      pointLight.shadow.mapSize.height = 1024;
      pointLight.shadow.camera.near = 10;
      pointLight.shadow.camera.far = 200;
      pointLight.name = "pointLight";
      let SpotLightHelper = new THREE.SpotLightHelper(pointLight);
      SpotLightHelper.name = "SpotLightHelper";
      let shadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
      shadowCameraHelper.name = "shadowCameraHelper";
      this.threeBox.scene.add(shadowCameraHelper);
      this.threeBox.scene.add(SpotLightHelper);
      this.threeBox.scene.add(pointLight);
    }
    function lightremove() {
      this.threeBox.scene.remove(
        this.threeBox.scene.getObjectByName("shadowCameraHelper")
      );
      this.threeBox.scene.remove(
        this.threeBox.scene.getObjectByName("SpotLightHelper")
      );
      this.threeBox.scene.remove(
        this.threeBox.scene.getObjectByName("pointLight")
      );
    }
  }
  initEvent() {
    this.Event.resizeEvent.push(() => {});
    this.Event.clickEvent.push(() => {});
  }

  render() {}
}
export default FixBug;
