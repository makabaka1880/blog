---
title: Plotting Complex Polynomials
description: Domain Coloring | How we draw complex functions
createTime: 2026-02-20
updateTime: 2026-02-20
---

I've just came across this wonderful domain coloring shader on youtube.

:Pic{src="screenshot1.webp" alt="Just absolutely beautiful."}

and I'm thinking about writing one myself.

## 0x00. From Complex to Canvas

Before we even start writing the shader, we need to have an intuition of what even is domain coloring. 

In primary school we've all learned about something known as a <mark>function graph</mark>. There, we employ the *definition of a function as a set of pairs*:

::DefBox{id="Function"}
A **function** $f : A \to B$ is formally defined as a set of ordered pairs $$f \subseteq A \times B$$ such that for every $a \in A$, there exists a **unique** $b \in B$ with $(a, b) \in f$.
We write $f(a) = b$ as shorthand for $(a, b) \in f$.
::

For real functions $f : \mathbb{R} \to \mathbb{R}$, the **graph** of $f$ is exactly this set — a subset of $\mathbb{R}^2$ — which is why we can draw it on a 2D plane. For example, let's consider the square:

::Pic{src="Artboard.png"}

Domain coloring is the name for a family of shading methods:

::DefBox{id="Domain Coloring"}
**Domain Coloring** is a visualization technique that maps complex function values to colors, allowing us to see the behavior of complex functions in two dimensions. Each point in the complex plane is colored according to the value of the function at that point, typically using hue to represent argument (phase) and brightness or saturation to represent magnitude.[^1]
:Pic{src="diagram1.webp"}
::

[^1]: "Domain Coloring of Complex Functions". www.mi.fu-berlin.de/en/math/groups/ag-geom/teaching/20_SoSe/visualisierung_abv/DomainColoring_Ue.pdf. Accessed 19 Feb. 2026.

Because polynomial functions are total functions mapping from $\mathbb C$ to $\mathbb C$, the entirety of the UV space can be used to denote a section of the function's domain properties. Because there's no complex type in GLSL, we will use a `vec2` for imaginary numbers. Even more conveniently, we can directly utilize vector addition, subtraction, scalar multiplication, and Euclidean norms on `vec2`, leveraging GPU optimizations.

Other utilities are defined as below:

```glsl
// Constants
vec2 C_ORIGIN = vec2(0., 0.);
vec2 c_re(float a) {
    return vec2(a, 0.);
}
vec2 c_im(float a) {
    return vec2(0., a);
}

vec2 c_conj(vec2 z) {
    return vec2(z.x, -z.y);
}

vec2 c_mul(vec2 z, vec2 w) {
    return vec2(z.x * w.x - z.y * w.y, z.x * w.y + z.y * w.x);
}

// Much more optimized than c_mul(z, z)
vec2 c_sq(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

vec2 c_sin(vec2 z) {
    return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y)); 
}

vec2 c_cos(vec2 z) {
    return vec2(cos(z.x) * cosh(z.y), sin(z.x) * sinh(z.y)); 
}

vec2 c_sqrt(vec2 z) {
    float m = length(z);
    return vec2(sqrt(0.5 * (m + z.x)), (sign(z.y) * 2. - 1.) * sqrt(0.5 * (m - z.x)));
}
```

Now we have this nice DSL to write any elementary expression!

Let's take, for example, $\lambda z : \mathbb C. (x^2 - 1)(x - 2 - i)^2$. We can use
```glsl
vec2 f(vec2 z) {
    return c_mul(c_sq(z) - c_re(1.), c_sq(z - c_re(2.) - c_im(1.)))
}
```

## 0x01. The Shader
Let's look back at our pipeline. The first step we have is to map UV space to $\mathbb C$. 
Because the UV space is $[0, 1]^2 \subseteq \mathbb R^2$, directly plotting it only shows a little portion of the first quadrant. Let's define some scaling constants:

```glsl
precision mediump float;

uniform vec2 u_origin;
uniform vec2 u_scale;

varying vec2 v_uv;
```

And we now transform the uv space by first translating it so that `u_origin` coincides with $(0, 0)$, than scaling up by `u_scale`.

```
vec2 z = (v_uv - u_origin) * u_scale;
```

:Pic{src="diagram2.webp" alt="Reprojection"}

Now we try a simple shader: we use the $\text{Arg}(z)$ (angle) as the luminance. We'll reposition so the origin is in the middle, so we chose `u_origin = vec2(.5, .5)`{lang="glsl"}. There's no need for rescaling here as we're only cared about the angle.

```glsl
precision mediump float;
uniform vec2 u_origin;
uniform vec2 u_scale;
varying vec2 v_uv;

float paint(vec2 z) {
    return 1. / log(length(z));
}

void main() {
    vec2 z = (v_uv - u_origin) * u_scale;
    float n = paint(z);
    gl_FragShader = vec4(n, n, n, 1);
}
```
::ShaderInteractive
---
uniforms: {
    "u_origin": { tag: "vec2", x: .5, y: .5 },
    "u_scale": { tag: "vec2", x: 1, y: 1}
}
---
precision mediump float;
uniform vec2 u_origin;
uniform vec2 u_scale;
varying vec2 v_uv;

float paint(vec2 z) {
    return atan(z.y, z.x) / 6.283185;
}
void main() {
    vec2 z = (v_uv - u_origin) * u_scale;
    float n = paint(z);
    gl_FragColor = vec4(n, n, n, 1);
}
::

Now that we've done the UV mapping, the arithemetics engine, lets start writing the shader. Lets assume our function is of some form
```glsl
vec2 f(vec2 z);
```

Then we obtain the colors we need via elementary geometry. I grabbed this HSL to RGB function from shadertoys[^2]
```glsl
vec3 hsl2rgb(in vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
   vec2 z = (v_uv - u_origin) * u_scale;
   vec2 out = f(z); // The image of the map
   float lum = length(out); // OpenGL API
   float hue = atan(out.y, out.x); // Angle
   vec3 color = hsl2rgb(vec3(hue / 6.28, lum / 2. + .5, lum * 2. / 3. + .2 ));
   gl_FragColor = vec4(color.x, color.y, color.z, 1);
}
```
[^2]: anastadunbar. "HSL to RGB to HSL". *ShaderToy*, 18 Sep. 2015, https://www.shadertoy.com/view/XljGzV. Accessed 18 Sep. 2015.

::ShaderInteractive
---
uniforms: {
    "u_origin": { tag: "vec2", x: .5, y: .5 },
    "u_scale": { tag: "vec2", x: 15, y: 15}
}
---
precision mediump float;
uniform vec2 u_origin;
uniform vec2 u_scale;
varying vec2 v_uv;

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}
vec2 c_re(float a) {
    return vec2(a, 0.);
}
vec2 c_im(float a) {
    return vec2(0., a);
}

float sinh_gl1(float x) {
    float ex = exp(x);
    float emx = exp(-x);
    return 0.5 * (ex - emx);
}

float cosh_gl1(float x) {
    float ex = exp(x);
    float emx = exp(-x);
    return 0.5 * (ex + emx);
}

vec2 c_sin(vec2 z) {
    return vec2(
        sin(z.x) * cosh_gl1(z.y),
        cos(z.x) * sinh_gl1(z.y)
    );
}

vec2 c_conj(vec2 z) {
    return vec2(z.x, -z.y);
}

vec2 c_mul(vec2 z, vec2 w) {
    return vec2(z.x * w.x - z.y * w.y, z.x * w.y + z.y * w.x);
}
vec2 c_sq(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}
vec2 f(vec2 z) {
    return c_sin(z);
    // return c_mul(c_sq(z) - c_re(1.), c_sq(z - c_re(2.) - c_im(1.)));
}
void main() {
   vec2 z = (v_uv - u_origin) * u_scale;
   vec2 img = f(z); 
   float norm = length(img);
   float lum = 1. / (1. + norm);
   float hue = atan(img.y, img.x); 
   vec3 color = hsl2rgb(vec3(hue / 6.28, 1, .5));
   gl_FragColor = vec4(color.x, color.y, color.z, 1);
}
::

Its working!

