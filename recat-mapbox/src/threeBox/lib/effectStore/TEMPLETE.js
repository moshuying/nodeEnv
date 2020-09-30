import * as THREE from 'three'

const {Scene,PerspectiveCamera,WebGLRenderer} = THREE
/**
 * 物理效果
 */
class Physics{
    /**
     *
     * @param threeBox
     * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
     */
    constructor(threeBox){
        this.name = 'Physics'
        this.threeBox = threeBox
        this.mountArray = ['addSelect','resetSelect']
        this.Event = {
          resizeEvent:[],
          clickEvent:[]
      }
        this.init()
    }
    init(){

    }
    initEvent(){
        this.Event.resizeEvent.push(()=>{}) 
        this.Event.clickEvent.push(()=>{}) 
    }
   
    render(){
        
    }
}
export default Physics