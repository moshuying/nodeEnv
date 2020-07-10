import {ShaderMaterial} from "three";
class ShaderBuilder {
  /**
   * 构建ShaderMaterial
   * @param {object} options 构建参数，同THREE.ShaderMaterial
   */
  constructor(options) {
    this.shader = new ShaderMaterial(options); 
    
    return this
  }
  /**
   * 传值
   * @param {object} uniforms 
   */
  setuniforms(uniforms) {
    this.shader.uniforms = uniforms
    return this
  }
  /**
   * 片元着色器
   * @param {string} code 
   */
  setfragmentShader(code){
    this.shader.fragmentShader = code;
    return this
  }
  /**
   * 返回 THREE.ShaderMaterial
   * @return {ShaderMaterial} THREE.ShaderMaterial
   */
  build(){
    return this.shader
  }
}
export {ShaderBuilder}