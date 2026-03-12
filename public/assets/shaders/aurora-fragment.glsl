precision highp float;
uniform float u_time;
varying vec2 v_uv;

void main() {
  // Create aurora-like colors using sin and cos functions
  float t = u_time * 0.5;
  
  // Base aurora colors: shifting between greens, blues, and purples
  float r = sin(t + v_uv.x * 3.0) * 0.3 + 0.3;
  float g = cos(t * 1.2 + v_uv.y * 2.0) * 0.4 + 0.4;
  float b = sin(t * 0.8 + (v_uv.x + v_uv.y) * 1.5) * 0.5 + 0.2;
  
  // Add some wave-like patterns
  float wave = sin(v_uv.x * 10.0 + t * 2.0) * 0.1 + 
               cos(v_uv.y * 8.0 + t * 1.5) * 0.1;
  
  // Combine colors with wave pattern
  vec3 color = vec3(r + wave, g + wave * 0.5, b + wave);
  
  // Add some glow effect
  float glow = sin(v_uv.y * 5.0 + t) * 0.2 + 0.8;
  color *= glow;
  
  gl_FragColor = vec4(color, 1.0);
}