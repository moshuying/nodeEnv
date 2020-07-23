import * as THREE from 'three'
const {Scene,PerspectiveCamera,WebGLRenderer} = THREE
/**
 * 扫描效果
 */
export default class Scan {
    /**
     *
     * @param {Scene} scene
     * @param {PerspectiveCamera} camera
     * @param {WebGLRenderer} renderer
     * @param {object} config
     */
    constructor(scene,camera,renderer) {
        this.name = 'Scan'
        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        this.depthScene = new THREE.Scene()
        this.depthScene.name = 'depthScene'
        this.depthScene.add(new THREE.AxesHelper(10))
        this.depthCamera = new THREE.OrthographicCamera( window.innerWidth / - 100, window.innerWidth / 100, window.innerHeight / 100, window.innerHeight / - 100, 0, 40 )
        this.depthCamera.position.set(0,20,0);
        this.depthCamera.lookAt(0,0,0);
        this.depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)

        this.depthMaterial = new THREE.ShaderMaterial({
            vertexShader: `
            varying float vDepth;
            varying vec4 test;
        
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                float depth = (gl_Position.z/gl_Position.w)*.5+.5;
                vec2 depthScreenPos;
                depthScreenPos.x = (gl_Position.x/gl_Position.w)*.5+.5;
                depthScreenPos.y = (gl_Position.y/gl_Position.w)*.5+.5;
                vDepth = depth;
                test = vec4(depthScreenPos.x,depthScreenPos.y,0,1);
            }
            `,
            fragmentShader:`
            varying float vDepth;
            uniform int uType;
            varying vec4 test;
        
            void main() {
                gl_FragColor = vec4(vDepth,vDepth,vDepth,1);
            }
            `
        })
        this.init(10)
    }
    init(num){
        this.geoGroup = new THREE.Group()
        this.geoGroup = 'scanGroup'
        let num2 = null
        for(let i = 0;i<num;i++){
            num2 = Math.random()*10
            let box = new THREE.Mesh(new THREE.BoxBufferGeometry( 1, num2, 1),this.depthMaterial)
            box.position.set(i*2+0.5,num2/2,0)
            box.castShadow = true
            this.depthScene.add(box)
            this.scene.add(box)
        }
        // this.scene.add(this.geoGroup)
    }
    render() {
        this.render.render(this.depthScene,this.depthCamera)
        // this.renderer.render(this.scene,this.depthCamera)
        // this.scene.getObjectByName('plan').material.map = this.depthTarget.texture
    }
}