import * as THREE from "three";
import './lib/js/libs/global'
import Stats from "three/examples/jsm/libs/stats.module";
import Start from "./lib/js/libs/three.start"
import ChooseShader from "./lib/js/libs/choose.shader"
class Web3DScene {
  constructor(){
    Start.initGUI()
    this.stats = Start.StatsStart()
    this.renderer = Start.renderer()
    this.scene = Start.scene()
    this.camera = Start.camera()
    Start.initSkyByMesh(this.scene,this.renderer)

    window.onresize = Start.onWindowResize(this.camera,this.renderer)
    this.controls = Start.controls(this.camera,this.renderer.domElement)
    new ChooseShader(this.scene,this.camera)
    this.animation()
  }
  animation(){
    const animation = ()=>{
      this.renderer.render(this.scene,this.camera)
      this.stats.update()
      requestAnimationFrame(animation)
    }
    animation()
  }
}
new Web3DScene()