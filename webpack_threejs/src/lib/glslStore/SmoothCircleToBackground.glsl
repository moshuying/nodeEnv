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

const float width = 1.0 / 6.5;
const float pi = 3.14159265;
const float radius = width / 1.95;

float shape(vec2 p, float phaseOffset) {
    float s = clamp(cos(3.9 + phaseOffset), 0.0, 1.0);

    if (s == 0.0) {
     	return 1.0;
    }

    float z = sqrt(p.x * p.x + p.y * p.y * (s * s)) - radius;
    return smoothstep(0.0, sqrt(s - 0.0001) / 100.0, -z);
}

void main(){
    vec2 uv = v_texcoord;
    // vec2 p = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 p = (2.0* gl_FragCoord.xy- u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 q = p / 2.0;
    q.x = mod(q.x + width / 2.0, width * 2.0);
    
    float z;
    if (q.x < width) {
    	q.x -= width / 2.0;
    	z = shape(q, 0.0);
    } else {
        q.x -= 3.0 * width / 2.0;
    	z = 1.0 - shape(q, pi);
    }

    vec3 col1 = vec3(0.5, 0.8, 0.2);
    vec3 col2 = vec3(0.2, 0.5, 0.8);
    vec3 col = mix(col1, col2, z);

    col *= (1.5 - 0.1 * dot(p, p));

    gl_FragColor = vec4(col, 1.0);
}

#endif
