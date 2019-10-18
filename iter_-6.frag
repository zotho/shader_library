// Author:
// Title:

#ifdef GL_ES
// precision mediump float;
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float grayScale(vec3 color)
{
  // По стандарту, используемому для HDTV. Цветовое пространство sRGB
  // https://en.wikipedia.org/wiki/Grayscale
  return dot(vec3(0.2126, 0.7152, 0.0722), color);
}

// https://github.com/szimek/webgl-hdr/blob/master/shaders/fs/tmo/Durand02.fx
vec3 adjustExposure(vec3 color, float fExposure, float fGamma)
{
  float Y = grayScale(color);
  color /= Y;
  float logY = log(Y);
  float logBase = 0.001;
  float logDetail = logY - logBase;

  float compressionFactor = 0.3;

  float outLogY = logBase * compressionFactor + logDetail;
  float outY = exp(outLogY);
//  return vec3(pow(outY * fExposure, 1.0 / fGamma));
  color.rgb *= outY * fExposure;

  return vec3(pow(color.rgb, vec3(1.0 / fGamma)));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    // vec2 mt = u_mouse/u_resolution;
    // mt.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    if (st.y > 0.9) 
        color = vec3(st.x);
    else
    	color = vec3(st.x,st.y,abs(sin(u_time*0.776)));
    	// color = vec3(sqrt(pow((st.x-mt.x),2.0) + pow((st.x-mt.x), 2.0)));    	
    	color = vec3(u_mouse, 0.0);
    float key = grayScale(color);
    float maskPoint = 0.640;
    float maskRange = 0.328;
    float mask = smoothstep(maskPoint-maskRange/2.0, maskPoint+maskRange/2.0, key);
    color = mix(adjustExposure(color, 2.396, 1.256), color, mask);
    int safe = 0;
    if (min(color.r, min(color.g ,color.b))>0.99 && bool(safe)){
        // gl_FragColor = vec4(1.,0.,0.,1.);        
        gl_FragColor = vec4(-1.,-1.,-1.,0.) + vec4(color,1.);
        return;
    }
    gl_FragColor = vec4(u_mouse/10.,1.0,1.0);
}