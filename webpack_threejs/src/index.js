import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
document.body.appendChild(new Stats().dom)
import {Start} from "./lib/js/libs/three.start"
class Web3DScene extends Object{
  constructor(){
    super()
    this.renderer = new Start().renderer()
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xe3e3e3)
    this.camera = new Start().camera()
    this.controls = new OrbitControls(this.camera,this.renderer.domElement)
    this.initScene()
    this.animation()
  }
  initScene(){
    this.scene.add(new THREE.AxesHelper(10))
    // this.scene.add(new THREE.AmbientLight(0xffffff))

    let light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    this.scene.add(light)
    this.scene.autoUpdate = true;
    
    
  }
  initControls(){
    this.controls.enableDamping=true
    this.controls.enableZoom = true
    this.controls.enableRotate = false
    this.controls.enablePan=true
  }
  animation(){
    const animation = ()=>{
      this.renderer.render(this.scene,this.camera)
      requestAnimationFrame(animation)
    }
    animation()
  }
}
new Web3DScene()