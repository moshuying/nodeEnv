import * as THREE from "three";
import Start from "./lib/js/libs/three.start"
import ChooseShader from "./lib/js/libs/choose.shader"
class Web3DScene {
  constructor(){
    Start.StatsStart()
    this.renderer = Start.renderer()
    this.scene = Start.scene()
    this.camera = Start.camera()
    this.controls = Start.controls(this.camera,this.renderer.domElement)
    Start.initSkyByMesh(this.scene,this.renderer)
    new ChooseShader(this.scene,this.camera)
    this.animation()
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