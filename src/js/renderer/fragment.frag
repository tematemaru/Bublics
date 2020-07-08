precision highp float;
varying vec3 vPosition;
varying float vDeep;

uniform sampler2D dot;
uniform float time;
uniform vec2 resolution;
uniform vec3 uMouse;
uniform vec2 intersection;
uniform vec3 translation;

float hue2rgb(float f1, float f2, float hue) {
  if (hue < 0.0)
    hue += 1.0;
  else if (hue > 1.0)
    hue -= 1.0;
  float res;
  if ((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
    res = f2;
  else if ((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
    res = f1;
  return res;
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;
  if (hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;
    if (hsl.z < 0.5) {
      f2 = hsl.z * (1.0 + hsl.y);
    } else {
      f2 = hsl.z + hsl.y - hsl.y * hsl.z;
    }          
    float f1 = 2.0 * hsl.z - f2;
    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
  }   
  return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
  return hsl2rgb(vec3(h, s, l));
}

void main() {
vec2 st = vPosition.xy / vec2(550.);

  float pct = 0.0;
  vec2 toCenter = vec2(0.);
  pct = length(toCenter - st);
  vec4 texture = texture2D(dot, gl_PointCoord);
  vec3 color = vec3(hsl2rgb(mod(pow(pct - 0.2, 1.4) + 0.13, 1.), 1., 0.5));
  gl_FragColor = vec4(color, 1. - pct - 0.1) * texture;
}
