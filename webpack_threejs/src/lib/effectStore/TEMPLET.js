import * as THREE from 'three'
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
        this.init()
        this.initEvent()
    }
    init(){

    }
    initEvent(){
        // this.Event.resizeEvent
        // this.Event.clickEvent
    }
    render(){

    }
}