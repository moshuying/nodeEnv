import * as THREE from 'three'

const {Scene,PerspectiveCamera,WebGLRenderer} = THREE
/**
 * shader 示例
 */
class Shader{
    /**
     *
     * @param threeBox
     * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
     */
    constructor(threeBox){
        this.name = 'Shader'
        this.threeBox = threeBox
        this.mountArray = ['addSelect','resetSelect']
        this.Event = {
          resizeEvent:[],
          clickEvent:[]
      }
        this.init()
    }
    init(){
      let boxgeo = new THREE.BoxBufferGeometry(100, 100, 100)
      let boxMat = new THREE.ShaderMaterial({
        // vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: `
  void main() {
    vec2 st = gl_FragCoord.xy/gl_FragCoord.x;
    gl_FragColor = vec4(st.x,st.y,0.0,1.0);
  }
  
  `
      })
      let box = new  THREE.Mesh(boxgeo,boxMat)
      this.threeBox.scene.add(box )
    }
    initEvent(){
        this.Event.resizeEvent.push(()=>{}) 
        this.Event.clickEvent.push(()=>{}) 
    }
   
    render(){
        
    }
}
export default Shader