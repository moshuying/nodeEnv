import * as THREE from 'three'

/**
 * 扫描效果
 */
export default class Scan {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.PerspectiveCamera} camera
     * @param {THREE.WebGLRenderer} renderer
     * @param {object} config
     */
    constructor(scene, camera, renderer) {
        this.name = 'Scan'
        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        this.depthScene = new THREE.Scene()
        this.depthScene.autoUpdate = true;
        this.depthScene.name = 'depthScene'

        this.depthCamera = new THREE.OrthographicCamera(
            window.innerWidth / -50,
            window.innerWidth / 50,
            window.innerHeight / 50,
            window.innerHeight / -50,
            0,
            40)
        this.depthCamera.position.set(0, 20, 0);
        this.depthCamera.lookAt(0, 0, 0);

        this.group = new THREE.Group()
        this.group.name = 'scanGroup'

        this.depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
        this.depthMaterial = new THREE.ShaderMaterial({
            vertexShader: `varying float vDepth;void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );vDepth = (gl_Position.z/gl_Position.w)*.5+.5;}`,
            fragmentShader: `varying float vDepth;void main() {gl_FragColor = vec4(vDepth,vDepth,vDepth,1);}`
        })
        this.init(10)
    }

    init(num) {
        let num2 = null
        for (let i = 0; i < num; i++) {
            num2 = Math.random() * 10
            let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, num2, 1), this.depthMaterial)
            box.position.set(i * 2 + 0.5, num2 / 2, num2/2+1)
            box.castShadow = true
            this.group.add(box)
        }
        this.depthScene.add(this.group.clone(true))
        this.scene.add(this.group)

        this.circleGeo = new THREE.RingBufferGeometry(1.5, 1.6, 1000, 1000, 0)
        this.circleMat = new THREE.ShaderMaterial({
            uniforms: {
                uDepthProjMatrixInverse: {
                    value: this.depthCamera.projectionMatrixInverse
                },
                uDepthMatrixWorldInverse: {
                    value: this.depthCamera.matrixWorldInverse
                },
                uDepthProjMatrix: {
                    value: this.depthCamera.projectionMatrix
                },
                uDepthMatrixWorld: {
                    value: this.depthCamera.matrixWorld
                },
                uDepthMap: {
                    value: this.depthTarget.texture
                }
            },
            vertexShader: [
                'uniform mat4 uDepthProjMatrixInverse;',
                'uniform mat4 uDepthMatrixWorldInverse;',
                'uniform mat4 uDepthProjMatrix;',
                'uniform mat4 uDepthMatrixWorld;',
                'uniform sampler2D uDepthMap;',
                'void main() {',
                'vec4 depthPos = uDepthProjMatrix * uDepthMatrixWorldInverse * modelMatrix * vec4( position, 1.0 );',
                'vec2 depthScreenPos;',
                'depthScreenPos.x = (depthPos.x/depthPos.w)*.5+.5;',
                'depthScreenPos.y = (depthPos.y/depthPos.w)*.5+.5;',
                'float circleDepth = (depthPos.z/depthPos.w)*.5+.5;',
                'float depth = texture2D(uDepthMap,depthScreenPos).x;',
                'if(depth>=circleDepth || depth == 0.0){',
                '    depth = circleDepth;',
                '}',
                'vec4 newPos = uDepthMatrixWorld*uDepthProjMatrixInverse*vec4(depthPos.x,depthPos.y,((depth-.5)/.5)*depthPos.w,depthPos.w);',
                'gl_Position = projectionMatrix * viewMatrix * vec4( newPos );',
                '}',
            ].join("\n"),
            fragmentShader: [
                'void main() {',
                '    gl_FragColor = vec4(0,0,1,1);',
                '}',
            ].join("\n")
        })
        this.circle = new THREE.Mesh(this.circleGeo,this.circleMat)
        this.circle.name = 'circle'
        this.circle.rotation.x = -Math.PI / 2;
        this.circle.position.y = 0.1
        this.circle.scaleNum=1
        this.scene.add(this.circle)

        this.renderer.setRenderTarget(this.depthTarget)
        this.renderer.render(this.depthScene,this.depthCamera)
        this.renderer.setRenderTarget(null)
    }

    render() {
        if(this.circle.scale.x>=20){
            this.circle.scale.set(1,1,1)
            this.circle.scaleNum = 1
        }else{
            this.circle.scale.set(this.circle.scaleNum+=0.005,this.circle.scaleNum+=0.005,this.circle.scaleNum+=0.005)
        }
    }
}