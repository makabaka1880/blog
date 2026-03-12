<template>
  <div class="test-page">
    <h1>WebGL Canvas Component Test</h1>
    
    <h2>Basic Gradient</h2>
    <WebglCanvas :width="400" :height="400">
```glsl
precision mediump float;
varying vec2 v_uv;

void main() {
    gl_FragColor = vec4(v_uv.x, v_uv.y, 0.5, 1.0);
}
```
    </WebglCanvas>
    
    <h2>Animated Colors</h2>
    <WebglCanvas :width="400" :height="400">
```glsl
precision mediump float;
varying vec2 v_uv;

void main() {
    vec2 pos = v_uv * 4.0;
    float r = sin(pos.x) * 0.5 + 0.5;
    float g = cos(pos.y) * 0.5 + 0.5;
    float b = sin(pos.x + pos.y) * 0.5 + 0.5;
    gl_FragColor = vec4(r, g, b, 1.0);
}
```
    </WebglCanvas>
    
    <h2>Circle Pattern</h2>
    <WebglCanvas :width="400" :height="400">
```glsl
precision mediump float;
varying vec2 v_uv;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(v_uv, center);
    float circle = smoothstep(0.5, 0.4, dist);
    gl_FragColor = vec4(circle, circle * 0.5, 1.0 - circle, 1.0);
}
```
    </WebglCanvas>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2 {
  color: var(--color-heading);
}

h2 {
  margin-top: 2rem;
}
</style>