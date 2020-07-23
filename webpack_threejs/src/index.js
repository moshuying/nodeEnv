// import './lib/js/libs/global'
import Start from "./lib/js/libs/three.start"
import Scan from './lib/effectStore/scan'
class Web3DScene {
  constructor(){
    Start.initGUI()
    this.stats = Start.StatsStart()
    this.renderer = Start.renderer()
    this.scene = Start.scene()
    this.camera = Start.camera()
    this.registerAll = []
    Start.initSkyByMesh(this.scene,this.renderer)
    Start.initFloorBoard(this.scene,1000,100)
    this.controls = Start.controls(this.camera,this.renderer.domElement)

    this.register(new Scan(this.scene,this.camera,this.renderer,{}))
    window.onresize = (e)=>{Start.onWindowResize(this.camera,this.renderer)}
    this.animation()
  }
  animation(){
      for(const key in this.registerAll){
          this.registerAll[key].render()
      }
      this.stats.update()
      // this.renderer.render(this.scene,this.camera)
      window.requestAnimationFrame(Web3DScene.prototype.animation.bind(this))
  }
    /**
     * 注册业务对象同时注册业务对象内的方法到three
     * @param {*}sub
     */
    register(sub){
        this.registerAll[sub.name] = sub
        if(sub.mountArray){
            this.registerArray(sub.mountArray,sub)
        }
    }

    /**
     * 注册函数到three
     * @param {string[]} arr 要注册到three的函数名称数组
     * @param {object} sub 该函数对应的this作用域
     */
    registerArray(arr,sub){
        for(let i =0;i<arr.length;i++){
            const el = arr[i]
            this[el]=(...args)=>{sub[el].apply(sub,args)}
        }
    }

    /**
     * 取消注册以彻底关闭渲染并从内存中清除
     * @param {string} name
     */
    disRegister(name){
        let sub = this.registerAll[name]
        if(sub.mountArray){
            for(let i =0;i<sub.mountArray.length;i++){
                const el = sub.mountArray[i]
                this[el]=null
            }
        }
        sub.dispose && sub.dispose()
        sub = null
    }
}
window.Web3DScene = new Web3DScene()