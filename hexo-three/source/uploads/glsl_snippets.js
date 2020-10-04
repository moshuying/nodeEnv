// 分形图
const anotherGlsl = `
// FROM: https://www.shadertoy.com/view/4sdXDl
//spikey
#define SHAPE length(z.yz)
//normal
//#define SHAPE length(z.xyz)
//bizarro
//#define SHAPE length(z.yz-z.xx)
//etc...
#define HIGH_QUAL
#ifdef HIGH_QUAL
#define MARCH_STEPS 199
#else
#define MARCH_STEPS 99
#endif
float k=7.0+3.0*sin(iGlobalTime*0.15);
vec3 mcol=vec3(0.0);
void AbsBox(inout vec4 z){//abs box by kali 
 z.xyz=abs(z.xyz+1.0)-1.0; 
 z*=1.5/clamp(dot(z.xyz,z.xyz),0.25,1.0);
}
void Bulb(inout vec4 z, in vec4 c){//mandelBulb by twinbee
 float r = length(z.xyz);
 float zo = asin(z.z / r) * k + iGlobalTime*0.15;
 float zi = atan(z.y, z.x) * 7.0;
 z=pow(r, k-1.0)*vec4(r*vec3(cos(zo)*vec2(cos(zi),sin(zi)),sin(zo)),z.w*k)+c; 
}
float DE(vec3 p){
  vec4 c = vec4(p,1.0),z = c;
  Bulb(z,c);
  float r0=(length(z.xyz)-1.15)/z.w;
  z.xyz-=1.0;
  for(int i=0;i<7;i++)AbsBox(z);
  float r=SHAPE;
  mcol.rgb=vec3(1.0,0.5,0.2)+abs(sin(0.2*r+100.0*z.yxz/z.w));
  return 0.5 * max((r-1.0) / z.w,-r0);
}

vec3 sky(vec3 rd, vec3 L){//modified bananaft's & public_int_i's code
  float d=0.4*dot(rd,L)+0.6;
  //return vec3(d);
  rd.y+=sin(sqrt(clamp(-rd.y,0.0,0.9))*90.0)*0.45*max(-0.1,rd.y);
  rd=abs(rd);
  float y=max(0.,L.y),sun=max(1.-(1.+10.*y+rd.y)*length(rd-L),0.)
    +.3*pow(1.-rd.y,12.)*(1.6-y);
  return d*mix(vec3(0.3984,0.5117,0.7305),vec3(0.7031,0.4687,0.1055),sun)
    *((.5+pow(y,.4))*(1.5-abs(L.y))+pow(sun,5.2)*y*(5.+15.0*y));
}
float rnd;
void randomize(in vec2 p){rnd=fract(float(iFrame)+sin(dot(p,vec2(13.3145,117.7391)))*42317.7654321);}

float ShadAO(in vec3 ro, in vec3 rd){
 float t=0.0,s=1.0,d,mn=0.01;
 for(int i=0;i<12;i++){
  d=max(DE(ro+rd*t)*1.5,mn);
  s=min(s,d/t+t*0.5);
  t+=d;
 }
 return s;
}
vec3 scene(vec3 ro, vec3 rd){
  vec3 L=normalize(vec3(0.4,0.025,0.5));
  vec3 bcol=sky(rd,L);
  vec4 col=vec4(0.0);//color accumulator
  float t=DE(ro)*rnd,d,od=1.0,px=1.0/iResolution.x;
  for(int i=0;i<MARCH_STEPS;i++){
    d=DE(ro);
    if(d<px*t){
      float dif=clamp(1.0-d/od,0.2,1.0);
      vec3 scol=mcol*dif*(1.3-0.3*t);
#ifdef HIGH_QUAL
      	vec2 s=vec2(DE(ro+d*4.0*L),DE(ro+d*16.0*L));
        scol*=clamp(0.5*s.x/d+(s.y/d)/8.0,0.0,1.0);
#endif
      float alpha=(1.0-col.w)*clamp(1.0-d/(px*t),0.0,1.0);
      col+=vec4(clamp(scol,0.0,1.0),1.0)*alpha;
      if(col.w>0.9)break;
    }
    t+=d;ro+=rd*d;od=d;
    if(t>6.0)break;
  }
  col.rgb+=bcol*(1.0-clamp(col.w,0.0,1.0));
  return col.rgb;
}
mat3 lookat(vec3 fw){
 fw=normalize(fw);vec3 rt=normalize(cross(fw,vec3(0.0,1.0,0.0)));return mat3(rt,cross(rt,fw),fw);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
   randomize(fragCoord);
   float tim=iGlobalTime*0.3,r=2.0+cos(tim*0.7);
   vec2 uv=(fragCoord-0.5*iResolution.xy)/iResolution.x;
   vec3 ro=vec3(sin(tim)*r,sin(tim*0.4),cos(tim)*r);
   vec3 rd=lookat(-ro)*normalize(vec3(uv,1.0));
   //rd+=2.0*cross(qrt.xyz,cross(qrt.xyz,rd)+qrt.w*rd);
   fragColor=vec4(scene(ro,rd)*2.0,1.0);
}
`;
// 跳动的心
const beatingHeart = 
`
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (2.0*fragCoord-iResolution.xy)/min(iResolution.y,iResolution.x);
    // background color
    vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));
    // animate
    float tt = mod(iTime,1.5)/1.5;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
    // shape
#if 0
    p *= 0.8;
    p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));
    float r = length(p);
	float d = 0.5;
#else
	p.y -= 0.25;
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
#endif
	// color
	float s = 0.75 + 0.75*p.x;
	s *= 1.0-0.4*r;
	s = 0.3 + 0.7*s;
	s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
	vec3 hcol = vec3(1.0,0.5*r,0.3)*s;
    vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );
    fragColor = vec4(col,1.0);
}
`;
const glsl_snippets = async (userShader,userUniforms) => {

  const vs = `
attribute vec4 position;
void main()	{
  gl_Position = position;
}
`;
  userShader = userShader ||beatingHeart;

  // FROM shadertoy.com
  const shadertoyBoilerplate = `
// #extension GL_OES_standard_derivatives : enable
//#extension GL_EXT_shader_texture_lod : enable
#ifdef GL_ES
precision highp float;
#endif
uniform vec3      iResolution;
uniform float     iGlobalTime;
uniform float     iChannelTime[4];
uniform vec4      iMouse;
uniform vec4      iDate;
uniform float     iSampleRate;
uniform vec3      iChannelResolution[4];
uniform int       iFrame;
uniform float     iTimeDelta;
uniform float     iFrameRate;
struct Channel
{
    vec3  resolution;
    float time;
};
uniform Channel iChannel[4];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
void mainImage( out vec4 c,  in vec2 f );

float iTime = iGlobalTime;

${userShader}

void main( void ){
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  mainImage( color, gl_FragCoord.xy );
  color.w = 1.0;
  gl_FragColor = color;
}
`;

  // const $ = document.querySelector.bind(document);
  const THREE = await import("https://cdn.bootcdn.net/ajax/libs/three.js/r120/three.module.js");

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 2));

  let uniforms = {
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v3", value: new THREE.Vector3() },
  };

  if(userUniforms){
    const anotherUniforms = await userUniforms(THREE)
    uniforms = {...uniforms, ...anotherUniforms};
    console.log(uniforms);
  }

  const material = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: shadertoyBoilerplate,
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  function resize(force) {
    var canvas = renderer.domElement;
    var dpr = 1; //window.devicePixelRatio;  // make 1 or less if too slow
    var width = canvas.clientWidth * dpr;
    var height = canvas.clientHeight * dpr;
    if (force || width != canvas.width || height != canvas.height) {
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.x = renderer.domElement.width;
      uniforms.iResolution.value.y = renderer.domElement.height;
    }
  }
  let pause = false;
  window.addEventListener('click', function(e){
    pause = !pause;
  },false)

  let clock = new THREE.Clock();
  clock.start()

  function render() {
    if(!pause) {
      resize();
      uniforms.iGlobalTime.value +=  0.01;
      renderer.render(scene, camera);
      if(clock && clock.getElapsedTime()>0.4){
        render = ()=>{}
      }else{
        clock = null
      }
    }
    requestAnimationFrame(render);
  }
  resize(true);
  render();
}

export {
  glsl_snippets,
  anotherGlsl
}