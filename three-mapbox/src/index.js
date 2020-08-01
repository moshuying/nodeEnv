import * as THREE from "three";
import {createMap,mapboxgl} from "./lib/mapbox"
import lngLatXYConvert from "./lib/lnglatXYconvert"
import cameraSync from "./lib/cameraSync"
import {Shine} from "./lib/effectStore/Shine"
import Start from "./lib/three.start"
import Scan from './lib/effectStore/Scan'

// let center = [104.0634830535829,30.65978568199722];/*成都中心点*/
// let center = [114.74333177142478, 23.53188466630951];/*河阳中心点*/
// let center = [106.5428630,29.445652];/*巴南中心点*/
let center = [106.58140789775808,29.542006974191196] /* 巴南svg中心点 */
class Web3DScene {
    constructor() {
        Start.initGUI()
        this.stats = Start.StatsStart(document.body)
        this.map = createMap(center)

        this.renderer = Start.renderer()
        this.renderer.name = 'Web3DSceneRenderer'
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.BaseGroup = new THREE.Group()
        this.BaseGroup.name = 'Web3DSceneBaseGroup'

        this.scene = Start.scene()
        this.scene.name = 'Web3DSceneScene'

        this.camera = Start.camera()
        this.camera.name = 'Web3DSceneCamera'
        Start.addLights(this.scene,this.BaseGroup)

        this.registerAll = []
        this.resizeEvent = []
        this.clickEvent = []

        this.register(new Scan(this))

        this.disRegisterAll()
        this.register(new Shine(this))
        this.initData()
        this.animation()
    }
    initData(){
        this.clickEvent.push(e=>{
            let pos = lngLatXYConvert.getLngLat(lngLatXYConvert.getXY(e.lngLat.toArray(),center),center)
            console.log(`cur:${JSON.stringify(e.lngLat.toArray())},\ncenter:${JSON.stringify(e.target.getCenter().toArray())},\nbearing:${e.target.getBearing()},\npitch:${e.target.getPitch()},\nzoom:${e.target.getZoom()}`);
            console.log('经纬度',pos,'世界坐标',lngLatXYConvert.getXY(e.lngLat.toArray(),center))
        })
        this.resizeEvent.push(()=>{Start.onWindowResize(this.camera, this.renderer)})
        window.onresize = () => {this.resizeEvent.forEach(el=>el())}

        this.map.on('click',(e)=> {
            console.log(e)
            this.clickEvent.forEach(el=>el(e))
        })
        window.lib = {scene: this.scene, camera: this.camera, renderer: this.renderer, THREE,Web3DScene:this}
    }
    animation() {
        const transform = {
            translate:mapboxgl.MercatorCoordinate.fromLngLat(center,0),
            rotate:[0,0,0],
            scale:lngLatXYConvert._projectedUnitsPerMeter(center[1]) / lngLatXYConvert.XBLLC_WORLD_SIZE
        }
        let rotateX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1,0,0),0)
        let rotateY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,1,0),0)
        let rotateZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,0,1),0)
        let m4m = new THREE.Matrix4()
        let m4l = new THREE.Matrix4()
        let fill = [
            1,0,0,0,0,
            1,0,0,0,0,
            1,0,0,0,0,
            1,0,0,0,0,
        ]
        const render = (gl,matrix)=>{
            let m = m4m.fromArray(matrix)
            let l = m4l.makeTranslation(transform.translate.x, transform.translate.y, transform.translate.z,)
                .scale(new THREE.Vector3(transform.scale,-transform.scale,transform.scale))
                .multiply(rotateX)
                .multiply(rotateY)
                .multiply(rotateZ)

            let pm = m.multiply(l);

            cameraSync.sync(this.camera, this.map, pm);
            this.renderer.render(this.scene, this.camera)
            for (const key in this.registerAll) {
                if (this.registerAll.hasOwnProperty(key)) {
                    this.registerAll[key].render()
                }
            }
            this.map.triggerRepaint()
            m4m.elements = fill
            this.stats.update()
        }
        this.map.on('load', ()=>{
            this.map.addLayer({
                id:'three',
                type:'custom',
                renderingMode:'3d',
                render:render
            })
        })
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
window.onload = function(){
    window.Web3DScene = new Web3DScene()
}