import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

let width = window.innerWidth;
let height = window.innerHeight;
const {Scene,PerspectiveCamera,WebGLRenderer} = THREE
class Shine{
    /**
     * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
     */
    constructor(threeBox){
        this.name = 'Shine'
        this.threeBox = threeBox
        this.mountArray = ['addSelect','resetSelect']
        this.Event = {}
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.init()
    }
    init(){
        this.composer = new EffectComposer(this.threeBox.renderer)
        this.composer.setSize( width, height );
        this.composer.addPass(new RenderPass(this.threeBox.scene,this.threeBox.camera))
        this.outlinePass = new OutlinePass(new THREE.Vector2(width, height),this.threeBox.scene,this.threeBox.camera)
        this.outlinePass.edgeStrength = 1
        this.outlinePass.visibleEdgeColor=new THREE.Color(1,1,0);
        this.outlinePass.hiddenEdgeColor=new THREE.Color(1,1,0);
        this.outlinePass.edgeGlow = 1
        this.outlinePass.edgeThickness = 1
        // this.outlinePass.pulsePeriod = 4 // 闪烁周期
        this.composer.addPass(this.outlinePass)
        this.effectFXAA = new ShaderPass(FXAAShader)
        this.pixelRatio = this.threeBox.renderer.getPixelRatio()
        this.effectFXAA.uniforms[ 'resolution' ].value.x = 1 / (width * this.pixelRatio)
        this.effectFXAA.uniforms[ 'resolution' ].value.y = 1 / (height * this.pixelRatio)
        this.composer.addPass(this.effectFXAA)
        
        this.initEvent()
    }
    initEvent(){
        this.Event.resizeEvent = ()=>{
            this.composer.setSize( width, height );
            this.effectFXAA.uniforms[ 'resolution' ].value.x = 1 / (width * this.pixelRatio)
            this.effectFXAA.uniforms[ 'resolution' ].value.y = 1 / (height * this.pixelRatio)
        }
        this.Event.clickEvent = (e)=>{
            this.rayCaster(e,this.threeBox.camera,this.threeBox.scene)
        }
    }
    rayCaster(event,camera,scene){
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, camera );
        let intersects = this.raycaster.intersectObjects( scene.children );

        if(intersects.length){
            const lastMesh = intersects[ intersects.length -1 ].object
            this.addSelect(lastMesh)
        }else{
            this.resetSelect()
        }
    }
    addSelect(objs){
        this.outlinePass.selectedObjects = [].concat(objs)
    }
    resetSelect(){
        this.outlinePass.selectedObjects = []
    }
    render(){
        this.composer.render()
    }
}
export {Shine}