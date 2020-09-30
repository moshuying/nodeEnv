import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
const { Scene, PerspectiveCamera, WebGLRenderer } = THREE;
/**
 * 物理效果
 */
class Physics {
  /**
   *
   * @param threeBox
   * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
   */
  constructor(threeBox) {
    this.name = "Physics";
    this.threeBox = threeBox;
    this.mountArray = ["addSelect", "resetSelect"];
    this.Event = {
      resizeEvent: [],
      clickEvent: [],
    };
    this.mouse = { x: 0, y: 0 };
    this.enableSelection = false;
    this.init();
    this.initEvent();
  }
  init() {
    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(100, 100, 100),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.controls = new TrackballControls(
      this.threeBox.camera,
      this.threeBox.renderer.domElement
    );
    // controls.noRotate = true;
    this.controls.noPan = true;
    // 视角最小距离
    this.controls.minDistance = 1000;
    // 视角最远距离
    this.controls.maxDistance = 5000;

    box.position.x = box.position.y = -200;
    this.threeBox.scene.add(box);
    this.transform = new TransformControls(
      this.threeBox.camera,
      this.threeBox.renderer.domElement
    );
    this.threeBox.scene.add(this.transform);
    this.dragControl = new DragControls(
      box,
      this.threeBox.camera,
      this.threeBox.renderer.domElement
    );
    // 开始拖拽
    this.dragControl.addEventListener("dragstart", function (event) {
      this.controls.enabled = false;
    });
    // 拖拽结束
    this.dragControl.addEventListener("dragend", function (event) {
      
      this.controls.enabled = true;
    });
    let material = new THREE.MeshLambertMaterial({
      color: 0xffffff * Math.random(),
      transparent: box.material.transparent ? false : true,
      opacity: 0.8,
    });
    box.material = material;
    this.addSelect(box);
  }
  initEvent() {
    this.Event.resizeEvent.push(() => {});
    this.Event.clickEvent.push((e, lastMesh) => {
      // lastMesh && this.addSelect(lastMesh)
    });
  }
  addSelect(box) {
    this.transform.attach(box);
  }
  render() {}
}
export default Physics;
