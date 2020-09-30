import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2.js";
const { Scene, PerspectiveCamera, WebGLRenderer } = THREE;

export default class Road {
  /**
   * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
   */
  constructor(threeBox) {
    this.name = "Road";
    this.threeBox = threeBox;
    this.Event = {};
    this.mountArray = [];
    this.init();
    this.initEvent();
  }
  init() {
    var x = 0,
      y = 0;

    var heartShape = new THREE.Shape();

    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    var geometry = new THREE.ShapeGeometry(heartShape);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var mesh = new THREE.Mesh(geometry, material);
    let mesh = new Water(geometry, {
      color: 0xffffff,
      scale: 4,
      flowDirection: new THREE.Vector2(1, 1),
      textureWidth: 1024,
      textureHeight: 1024,
    });
    this.threeBox.scene.add(mesh);
  }
  initEvent() {
    // this.Event.resizeEvent
    // this.Event.clickEvent
  }
  render() {}
}
