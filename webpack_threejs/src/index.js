import * as THREE from "three";
import {Shine} from "./lib/effectStore/Shine"
import Start from "./lib/js/three.start"
import Scan from './lib/effectStore/Scan'
import Test from './lib/effectStore/Test'

class Web3DScene {
    constructor() {
        Start.initGUI()
        this.stats = Start.StatsStart(document.body)

        this.renderer = Start.renderer()
        this.renderer.name = 'Web3DSceneRenderer'
        this.BaseGroup = new THREE.Group()
        this.BaseGroup.name = 'Web3DSceneBaseGroup'
        this.scene = Start.scene(this.BaseGroup)
        this.scene.name = 'Web3DSceneScene'
        this.camera = Start.camera()
        this.camera.name = 'Web3DSceneCamera'

        Start.initSkyByMesh(this.scene, this.renderer, 10000,this.BaseGroup)
        Start.initFloorBoard(this.scene, 1000, 100,this.BaseGroup)
        Start.controls(this.camera, this.renderer.domElement)

        this.registerAll = []
        this.resizeEvent = []
        this.clickEvent = []

        this.register(new Scan(this))
        this.register(new Test(this))

        this.disRegisterAll()
        this.register(new Shine(this))

        this.resizeEvent.push(()=>{Start.onWindowResize(this.camera, this.renderer)})
        window.onresize = () => {this.resizeEvent.forEach(el=>el())}
        document.getElementsByTagName('body')[0].addEventListener('click',(e)=>{
            this.clickEvent.forEach(el=>el(e))
        })

        window.lib = {scene: this.scene, camera: this.camera, renderer: this.renderer, THREE,Web3DScene:this}
        this.animation()
    }

    animation() {
        this.stats.update()
        this.renderer.render(this.scene, this.camera)
        for (const key in this.registerAll) {
            if (this.registerAll.hasOwnProperty(key)) {
                this.registerAll[key].render()
            }
        }
        window.requestAnimationFrame(Web3DScene.prototype.animation.bind(this))
    }

    /**
     * 注册业务对象同时注册业务对象内的方法到three
     * @param {*}sub
     */
    register(sub) {
        this.registerAll[sub.name] = sub
        if (sub.mountArray) {
            this.registerArray(sub.mountArray, sub)
        }
        // 事件注册
        if(sub.Event){
            for(const eventName in sub.Event){
                if(sub.Event.hasOwnProperty(eventName)){
                    this[eventName].push(sub.Event[eventName])
                }
            }
        }

    }

    /**
     * 注册函数到three
     * @param {string[]} arr 要注册到three的函数名称数组
     * @param {object} sub 该函数对应的this作用域
     */
    registerArray(arr, sub) {
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i]
            this[el] = (...args) => {
                sub[el].apply(sub, args)
            }
        }
    }

    /**
     * 取消注册以彻底关闭渲染并从内存中清除
     * @param {string} name
     */
    disRegister(name) {
        if (this.registerAll[name].mountArray) {
            for (let i = 0; i < this.registerAll[name].mountArray.length; i++) {
                this[this.registerAll[name].mountArray[i]] = null
                delete this.registerAll[name].mountArray[i]
            }
        }
        this.registerAll[name].dispose && this.registerAll[name].dispose()
        this.disposer(this.registerAll[name])
        this.registerAll[name] = null
        delete this.registerAll[name]
    }

    /**
     * 取消全部注册
     */
    disRegisterAll() {
        for (const key in this.registerAll) {
            if (this.registerAll.hasOwnProperty(key)) {
                this.disRegister(key)
            }
        }
    }

    /**
     * 遍历清除
     * @param {Object} sub
     */
    disposer(sub){
        const recursion = (obj) =>{
            for(const key in obj){
                if(obj.hasOwnProperty(key) && Boolean(obj[key])){
                    if(!(obj[key].name && obj[key].name.includes('Web3DScene'))){
                        if(obj[key].isGroup){
                            obj[key].children.forEach(child =>{
                                child.geometry && child.geometry.dispose()
                                child.material && child.material.dispose()
                                obj[key].remove(child)
                            })
                        }

                        if(obj[key] instanceof THREE.Object3D) {
                            obj[key].geometry && obj[key].geometry.dispose()
                            obj[key].material && obj[key].material.dispose && obj[key].material.dispose()
                            this.scene.remove(obj[key])
                        }

                        obj[key] = null
                    }else{

                    }
                }
            }
        }
        recursion(sub)
    }
}

window.Web3DScene = new Web3DScene()