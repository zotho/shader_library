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
    float min = 0.188;
    float max = .7;
    return clamp(mix(vec2(0.220,0.850), vec2(0.870,0.290), t), min, max);
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
    const int iter = 100;
    float curr_d;
    for (int i = 0; i < iter; ++i) {
    	curr_d = distance(st, f(float(i) / float(iter)));
        min_d = min(curr_d, min_d);
    }
    float d = clamp(1. + distance(st, f(st.x)) * -2.6, 0., 1.);

    gl_FragColor = vec4(1. + -2.6 * min_d);
}