import * as THREE from 'three'
export default class Scan {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.PerspectiveCamera} camera
     * @param {THREE.WebGLRenderer} renderer
     */
    constructor(scene,camera,renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.depthScene = new THREE.Scene()
        this.init()
    }
    init(){
        this.depthCamera = new THREE.OrthographicCamera( window.innerWidth / - 100, window.innerWidth / 100, window.innerHeight / 100, window.innerHeight / - 100, 0, 40 )
        this.depthCamera.lookAt(0,0,0)
        this.depthCamera.position.set(0,20,0)
        this.camera.position.set(0,20,0)
        let hemisphereLight = new THREE.HemisphereLight( 0xfceafc, 0x000000, .8 );
        this.scene.add(hemisphereLight)
    }
}