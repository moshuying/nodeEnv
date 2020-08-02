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
      this.threeBox.scene.add(new THREE.Mesh(
        new THREE.BoxBufferGeometry(100,100,100),
        new THREE.MeshBasicMaterial({ color:0x00ff00})
      ))
    }
    initEvent(){
        this.Event.resizeEvent.push(()=>{}) 
        this.Event.clickEvent.push(()=>{}) 
    }
   
    render(){
        
    }
}
export default Physics