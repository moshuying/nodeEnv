
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec2 u_resolution;
uniform float u_time;

#if defined(VERTEX)

// attribute vec4 a_position; // myfolder/myfile.obj
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;

void main(void) {
	v_position = u_projectionMatrix * u_modelViewMatrix * a_position;
	v_normal = u_normalMatrix * a_normal;
	v_texcoord = a_texcoord;
	v_color = a_color;
	gl_Position = v_position;
}

#else // fragment shader

uniform vec2 u_mouse;
uniform vec2 u_pos;
// uniform sampler2D u_texture; // https://cdn.jsdelivr.net/gh/actarian/plausible-brdf-shader/textures/mars/4096x2048/diffuse.jpg?repeat=true
// uniform vec2 u_textureResolution;

const vec3 red = vec3(10., 2.5, 0.);
const vec3 green = vec3(0., 10., 2.5);
const vec3 blue = vec3(2.5, 0., 10.);
void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float off = (u_resolution.x/u_resolution.y - 1.0)/2.;
  vec2 pos = vec2(0.5, 0.5)-vec2(st.x-off, st.y);
  float r = length(pos)*2.0;
  float a = atan(pos.y,pos.x) ; // 需要 旋转的话加入
  float f = 0.5*sin(12.*a)*cos(30.*a) + 0.25*tan(3.*a - 1.5);
  float func = 1.-smoothstep(f-1.,f+1.,r);
  color = mix(vec3(0.), red, func);
  float mixAmt = pow(distance(vec2(0.5), st), .707);
  color = mix(color, vec3(1.), mixAmt);
  color = mix(vec3(.1, 0., .2), color, smoothstep(0., 1.4142, 1.-length(pos)*2.));
  gl_FragColor = vec4(color, 1.0);
}


#endif


