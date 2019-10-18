// Author:
// Title:

#ifdef GL_ES
// precision mediump float;
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 f(float t) {
    return clamp(mix(vec2(1.+sin(u_time),cos(u_time)), vec2(cos(u_time)/2.,1.-sin(u_time)), t), 0., 1.);
}

float sq(float x){
    return pow(x, 2.);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 mt = u_mouse/u_resolution;
    mt.x *= u_resolution.x/u_resolution.y;
    
    float min_d = 1000.;
    const int iter = 10;
    for (int i = 0; i < iter; ++i) {
    	float d = clamp(1. + distance(st, f(float(i) / float(iter))) * -1., 0., 1.);
    	min_d = min(d, min_d);
    }

    gl_FragColor = vec4(min_d);
}