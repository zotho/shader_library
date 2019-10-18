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

//2D Vector field visualizer by nmz (twitter: @stormoid)
#define time iTime

const float arrow_density = 1.664;
const float arrow_length = 0.466;

//---------------Field to visualize defined here-----------------
vec2 field(in vec2 p)
{
    return vec2(sin(p.x+sin(p.y)+u_time), sin(p.x+cos(p.y)));
}

vec3 fieldGrav(vec2 p) {
    vec3 s = vec3(0.);
    float r = 3.448+sin(u_time/10.);
    float phi = -3.976+u_time/20.;
    float mk = 1.376;
    const int n_iter = 5;
    for (int i = 0; i < n_iter; i++) {
        float fi = float(i) / float(n_iter) * 2. * pi;
        vec2 pos = vec2(r*cos(fi+phi), r*sin(fi+phi));
        float d = distance(pos, p);
        float m = mk * sin(fi + pi / 10.);
        vec2 a = m * (pos - p) / pow(d, 3.);
        s += vec3(a, sign(m) * length(a));
    }
    return s;
}
//---------------------------------------------------------------

float segm(in vec2 p, in vec2 a, in vec2 b) //from iq
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
	return length(pa - ba*h)*30.;
}

float fieldviz(in vec2 p, vec2 t)
{
    vec2 ip = floor(p*arrow_density)/arrow_density + .5/arrow_density;   
    float m = pow(length(t),0.5)*(arrow_length/arrow_density);
    vec2 b = normalize(t)*m;
    float rz = segm(p, ip, ip+b);
    vec2 prp = (vec2(-b.y,b.x));
    rz = min(rz,segm(p, ip+b, ip+b*0.65+prp*0.3));
    return clamp(min(rz,segm(p, ip+b, ip+b*0.65-prp*0.3)),0.,1.);
}

float equipotentialLines(float fld)
{
    float a = 0.;
    for (int i = 0; i < 10; i++) {
        float f = float(i) - 5.;
    	a = max(a, 1. - clamp(abs(fld - f) * 10., 0., 1.));
    }
    return a;
}

void main()
{
	vec2 p = gl_FragCoord.xy / u_resolution.xy-0.5;
	p.x *= u_resolution.x/u_resolution.y;
    p *= 10.;

    vec3 fld = fieldGrav(p);
    // vec3 col = vec3(fld.x,0.,fld.y)*0.7;
    vec3 col = vec3(0.);
    float fviz = fieldviz(p, fld.xy);
    col = max(col, 1.-fviz*vec3(1.));
    col = max(col , equipotentialLines(fld.z));
    col.b = max(fld.z, col.b);
    col.r = max(-fld.z, col.r);
	gl_FragColor = vec4(col,1.0);
}