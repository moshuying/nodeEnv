import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
const {Scene,PerspectiveCamera,WebGLRenderer} = THREE

export default class Road{
    /**
     * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
     */
    constructor(threeBox){
        this.name = 'Road'
        this.threeBox = threeBox
        this.Event = {}
        this.mountArray = []
        this.TextureLoader = new THREE.TextureLoader()
        this.loader = new FBXLoader()
        this.init()
        this.initEvent()
    }
    init(){
        this.loader.load('http://localhost:4571/src/lib/models/road/luwang_0.fbx',(obj)=>{
            console.log(obj)
            this.threeBox.scene.add(obj)
        })
    }
    initEvent(){
        // this.Event.resizeEvent
        // this.Event.clickEvent
    }
    render(){

    }
}