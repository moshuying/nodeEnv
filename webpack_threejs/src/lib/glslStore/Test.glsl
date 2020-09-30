
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

float rand(vec2 uv) {
    const highp float a = 12.9898;
    const highp float b = 78.233;
    const highp float c = 43758.5453;
    highp float dt = dot(uv, vec2(a, b));
    highp float sn = mod(dt, 3.1415);
    return fract(sin(sn) * c);
}

void draw_stars(inout vec4 color, vec2 uv) {
    float t = sin(u_time * 2.0 * rand(-uv)) * 0.5 + 0.5;
    // color += 0.99 * t;
    color += smoothstep(0.975, 1.0, rand(uv)) * t;
}

#define nsin(x) (sin(x) * 0.5 + 0.5)

void draw_auroras(inout vec4 color, vec2 uv) {
    const vec4 aurora_color_a = vec4(0.0, 1.2, 0.5, 1.0);
    const vec4 aurora_color_b = vec4(0.0, 0.4, 0.6, 1.0);
    
    float t = nsin(-u_time + uv.x * 100.0) * 0.075 + nsin(u_time + uv.x * distance(uv.x, 0.5) * 100.0) * 0.1 - 0.5;
    t = 1.0 - smoothstep(uv.y - 4.0, uv.y * 2.0, t);
    
    vec4 final_color = mix(aurora_color_a, aurora_color_b, clamp(1.0 - uv.y * t, 0.0, 1.0));
    final_color += final_color * final_color;
    color += final_color * t * (t + 0.5) * 0.75;
}

void main() {
    vec2 ps = vec2(1.0) / u_resolution.xy;
    vec2 uv = gl_FragCoord.xy * ps;
    // vec2 uv = gl_FragCoord.xy * ps;
    gl_FragColor = vec4(0.0);
    
    // draw_stars(gl_FragColor, uv);
    draw_auroras(gl_FragColor, uv);
}


#endif
