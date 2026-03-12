---
title: Test All Components
description: Comprehensive test for all prose components
createTime: 2026-02-11
updateTime: 2026-02-11
---

This is a test article to verify all prose components work correctly.

# Heading 1
This is a paragraph to test basic text rendering.

## Heading 2
Testing the h2 component with some **bold text** and *italic text*.

### Heading 3
This is h3 level. Let's test some combinations: **bold and italic** together.

#### Heading 4
This is h4 level. The font weights should be slightly lighter than h3.

##### Heading 5
This is h5 level. Getting lighter.

###### Heading 6
This is h6 level. The lightest heading.

## Text Formatting Tests

Here's some **bold text** using the ProseStrong component.

Here's some *italic text* using the ProseEm component.

You can also combine them like this: **bold** and *italic* in the same paragraph.

## Blockquote Test

> This is a blockquote to test the ProseBlockquote component.
> It should have proper styling and indentation.
>
> This is a second paragraph in the blockquote.

## Code Block Test

```js
function testFunction() {
    console.log("This is a code block");
    return true;
}
```

## Image Test

Test image rendering (placeholder):

::Pic
---
alt: Test Image
src: Screenshot 2026-02-12 at 10.19.32.png
---
::

::Pic
---
alt: Vertical Image
src: DSC02913.webp
---
::

## Lists Test

### Unordered List
- Item 1
- Item 2
    - Nested item 2.1
    - Nested item 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item


## Interactive Components Test

### Music Player
::MusicPlayer
---
mode: "server"
server: "netease"
id: 1395957507
---
::

### Tip Box
::Tip
This is a tip box component to test custom content rendering.
::

### Question Box
::Qabox
This is a question box component for FAQ-style content.
::

### Definition Box
::Defbox
---
term: "Test Term"
---
This is a definition box component. It has a term and its definition.
::

## Mixed Content Test

This paragraph tests **bold** text, *italic* text, and regular text all together. We can also add `inline code` to test that styling.

> **Bold text in blockquote**
> *Italic text in blockquote*
>
> Regular text in blockquote

## Long Content Test

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

**Important note**: This is a longer paragraph to test wrapping and spacing.

## Conclusion

This concludes the comprehensive test of all prose components. If everything looks correct, all components are working as expected!

## Chess Components Test

### Simple Chessboard
::Chessboard
---
fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
coords: true
---
e2->e4
::

## More Interactive Components
### WebGL Renderer
::ShaderInteractive
---
dim: [512, 512]
uniforms: {
    "u_time": {tag: 'float', value: .5}
}
---
precision mediump float;
varying vec2 v_uv;

uniform float u_time;
uniform sampler2D u_noise;

float curve(float x) {
    return sin(x * 10.0 + u_time) * 5. ; // to be implemented
}

void main() {
    float wave = curve(v_uv.x); // Get the curve value
    vec2 distorted_uv = v_uv + vec2(wave * 0.1, 0.0);

    vec3 color = vec3(distorted_uv.x, distorted_uv.y, sin(u_time));
    gl_FragColor = vec4(color, 1.0);
}
::

```glsl
precision mediump float;
varying vec2 v_uv;

uniform float u_time;
uniform sampler2D u_noise;

float curve(float x) {
    return sin(x * 10.0 + u_time) * 5. ;
}

void main() {
    float wave = curve(v_uv.x);
    vec2 distorted_uv = v_uv + vec2(wave * 0.1, 0.0);

    vec3 color = vec3(distorted_uv.x, distorted_uv.y, sin(u_time));
    gl_FragColor = vec4(color, 1.0);
}
```

### Parallax Window

Scrolling Parallax with an angle of $-\frac{\pi}{4}$ and sensitivity of 0.04:
::ParallaxWindowScrolltrack
---
src: "/assets/index/poolcore.webp"
sensitivity: 0.04
angle: -0.785
---
::

Mouse-track Parallax with sensitivity $\langle 0.01, 0.03 \rangle$ and $h_0 = 0.8$
::ParallaxWindowMousetrack
---
src: "/assets/index/a7ef2bdaba15aa117a047b797a3ddde6.jpg"
sensitivity-y: 0.01
sensitivity-x: 0.03
view-height: 0.8
---
::
::ParallaxWindowMousetrack
---
src: "/assets/260211-test-all-components/IMG_3809.png"
sensitivity-y: 0.01
sensitivity-x: 0.03
view-height: 0.8
---
::


### Chat Component
::Chat
{:2026-02-14 05:01:35}

{.Dev}

Hello! How can I help you?

{Makabaka1880}

What are parallax effects?

{.Dev}

They create depth by moving backgrounds slower than foregrounds.

{Makabaka1880}

Cool! Can we use WebGL?

{.Dev}

Yes! Depth maps and shaders work great for real-time performance.

::

### Folding Component
::Folding
---
title: "Click to Expand This Section"
---
This content is hidden by default and expands when you click the header. Useful for organizing long content or hiding spoilers.
::

### Blur Component
::Blur
This content is blurred until hovered over. Useful for hiding sensitive information or spoilers.
::

### Emoji Clock
:EmojiClock

---
**End of Test Article**
