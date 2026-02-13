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
src: IMG_5245.webp
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
::Quesbox
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
e2-e4
::

### Chess Display with Line
::ChessDisplay
---
fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
line: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7"
title: "Ruy Lopez - Classic Opening"
coords: true
linear: false
---
e2->e4
(Pe2)
::

## More Interactive Components
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
