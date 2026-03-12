---
title: Writing an Aurora Shader
description: A first try at creating aurora-like shader animations with WebGL
createTime: 2026-02-19
updateTime: 2026-02-19
---

So my friend is working on an experimental LLM proxy api they call the [AuroraLab](https://www.auroralab.dev)[^1]

[^1]: Really cool project! BTW Their ClaudeCode API is free for a limited time, certainly go check out.

::Pic
---
src: 'screenshot1.webp'
alt: 'Screenshot of Homepage'
---
::

and they didn't really like the background and asked me to design a more realistic shader.

## 0x00 The Curtain

> We're only using a fragment shader. Whenever I say "geometry" I'm referring to the intermediate representation of a certain volume or shape that is not participating in the vertex shader.

The easiest way to model the curtain is to take a smooth curve, deform it over time., give it thickness, and extrude it upwards to create a volume. Here I chosed the easiest $C^\infty$ curve I can think of - a **superposition of sine waves**.

$$
y(x, t) := \sum_{i} {a_i \sin (b_i t + c_i x + d_i) }
$$

<iframe src="https://www.desmos.com/calculator/sdl5wl9egy?embed" width="100%" style="border: 1px solid #ccc; aspect-ratio: 1.6;" frameborder=0></iframe>

We can easily turn this into a predicate to generate a strip:

$$
P(x, y, t) := f(x, t) \in [y - \epsilon, y + \epsilon]
$$


::ShaderInteractive
---
uniforms: {
    "u_epsilon": {tag: "float", value: .02},
    "u_time": {tag: "float", value: 0}
}
---
precision mediump float;
uniform float u_epsilon;
uniform float u_time;
varying vec2 v_uv;

float f(float x) {
    float y = 0.;
    y += -1. * sin(x + u_time + 1.);
    y += -.2 * sin(5. * x + 2. * u_time + .5);
    y += -1. * sin(2. * x + 5. * u_time);
    return y;
}

void main() {
    float mark = f(v_uv.x * 10.) / 10. + .5;
    if (v_uv.y < mark + u_epsilon && v_uv.y > mark - u_epsilon) {
        gl_FragColor = vec4(1, 1, 1, 1);
    } else {
        gl_FragColor = vec4(0, 0, 0, 1);
    }
}
::