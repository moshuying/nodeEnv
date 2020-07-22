import * as THREE from "three";
import './lib/js/libs/global'
import Stats from "three/examples/jsm/libs/stats.module";
import Start from "./lib/js/libs/three.start"
import ChooseShader from "./lib/js/libs/choose.shader"
import Scan from './lib/effectStore/scan'
class Web3DScene {
  constructor(){
    Start.initGUI()
    this.stats = Start.StatsStart()
    this.renderer = Start.renderer()
    this.scene = Start.scene()
    this.camera = Start.camera()
    this.composer = Start.initFxaa(this.scene,this.renderer)
    Start.initSkyByMesh(this.scene,this.renderer)
    Start.initFloorBoard(this.scene,1000,100)
    window.onresize = (e)=>{Start.onWindowResize(this.camera,this.renderer)}
    this.controls = Start.controls(this.camera,this.renderer.domElement)

    new Scan(this.scene,this.camera,this.renderer)
    this.animation()
  }
  animation(){
      this.renderer.render(this.scene,this.camera)
      // this.composer.render()
      this.stats.update()
      window.requestAnimationFrame(Web3DScene.prototype.animation.bind(this))
  }
}
new Web3DScene()