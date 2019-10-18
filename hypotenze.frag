// Author:
// Title:

#ifdef GL_ES
// precision mediump float;
precision highp float;
#endif

#define pi 3.1415926535897932384626433832795

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

float sec(float x){
    return 1. /cos(x);
}

vec2 hyp(float t) {
    t = clamp(t, -pi / 2., pi / 2.);
    vec2 m = vec2(.1);
    vec2 c = vec2(.1, .5);
    return vec2(sec(t), tan(t)) * m + c;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 mt = u_mouse/u_resolution;
    mt.x *= u_resolution.x/u_resolution.y;
    
    float min_d = 1000.;
    const int n_iter = int(ceil(10. * 10.));
    float curr_d;
    for (int i = 0; i < n_iter; ++i) {
        if (i > int((sin(u_time) + 1.) / 2. * float(n_iter))) {
            break;
        }
        float t = float(i) / float(n_iter) * pi - pi / 2.;
    	curr_d = distance(st, hyp(t));
        min_d = min(curr_d, min_d);
    }
    float d = clamp(1. + distance(st, f(st.x)) * -1.6, 0., 1.);

    gl_FragColor = vec4(1. + -5.224 * min_d);
}