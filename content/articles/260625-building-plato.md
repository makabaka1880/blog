---
title: Building Plato
description: Gamifying Formal Logic
createTime: 2026-06-25
updateTime: 2026-06-25
---

::LinkCard
---
title: Plato
details: Gamified Formal Logic.
url: https://plato.makabaka1880.xyz
---
::

::QuoteBox{source="Fred Brooks, The Mythical Man-Month"}
The programmer, like the poet, works only slightly removed from pure thought-stuff. He builds his castles in the air, from air, creating by exertion of the imagination.
::

So I was cleaning up my mac last few days when I found a project named `logische` in a directory I haven't touched for a whole year. It turned out to be a proof checker written in rust for natural deduction that I developed when learning classical logic.

::Pic
---
src: "Screenshot 2026-06-25 at 23.11.38.webp"
alt: "Proving the identity implication"
---
::

Coinciding with this rediscovery, [SuperBrain Incubator](https://www.superbrain-ai.com) invited me to participate in an teenager initiative program focused on the incoporation of AI in software development. I figured it was the ideal chance to polish this long-dormant lib and make something fun out of it.

But wrapping a hardcore Rust logic engine into a smooth, gamified web app with 45 levels, state persistence, and beautiful math rendering by myself would have taken weeks. I needed a high-powered assistant to execute the UI while I focused on the core engineering. So, I spun up a fresh pnpm monorepo, paired up with Claude, and we got to work.

## 0x00. What is Plato

First of all what **is** Plato? Simply put, it's a gamified natural deduction proof assistant.  

If that sounds like a bunch of intimidating math jargon, think of it as a puzzle game where the rules are pure logic. Unlike heavy-duty, industrial proof assistants like Lean or Coq -- where you stare at a massive text file and question your life choices -- Plato gives you an interactive, s-expression based REPL right in your browser.

::Pic
---
src: "Screenshot 2026-06-25 at 23.28.53.webp"
alt: "Home Screen"
---
::

You start a level with a set of premises (the facts you know), a target goal, and an initial context. To win, you type standard logic commands like `(->-elim 1 2)` or `(and-intro 3 4)` to apply rules of inference, step by step, until your goal is completely resolved. 

::Pic
---
src: "Screenshot 2026-06-25 at 23.34.50.webp"
alt: "Yes! You have autosuggestions"
---
::

## 0x01. Why Claude

Frankly this isn't my first time working with Claude Code. In fact, the memory editor in [sewing-box/Lite80](https://sewing-box.makabaka1880.xyz/#/lang/lite80) is almost completely written by Claude, but I have never let a coding agent write a project on its own completely. For the initial commit of this project, I literally dragged the original crate source into a new monorepo, `pnpm create vue@latest`, set up a few compilation options, and released claude to generate wasm bindings and write the webpage on its own.

I was initially among the group of conservative developers. To me, letting AI write a project and claiming it as your own is just nonsense -- it does not even qualify as plagiarism. To me, programming is like writing stories; every function, every interface, every unit test is a deliberate brushstroke in a larger piece of art. AI-generated artifacts shouldn't be considered art, regardless of how aesthetically pleasing the final product looks. You simply cannot argue that prompting an AI to spin up a project constitutes real software engineering.

Actually, to this day, I still do not believe one can rightfully claim ownership over a project that is purely AI-generated. But my stance on *using* AI did change. Back in the old days, people did copy utility methods and patches from Stack Overflow, and no one seemed to have any problem with it. LLMs are just tools: it is up to the developer to write the project.

Let's be real: AI is fundamentally a probabilistic guessing machine. Dont expect Claude Code to be able to fix any problem in your project.

I hit a prime example of this while building Plato. Because I wanted to keep the architecture lightweight, we completely ditched `vue-router`. Instead, `App.vue` manages navigation using a custom `ref<Page>` ADT, wrapped neatly inside a Vue `<Transition>` component for slick page animations. Everything was smooth sailing until, during a routine page build, the problem page vanished into thin air. I dumped everything into Claude Code, expecting a quick fix, and went to take a quick shower. I returned to find that Claude had not disappointed: it successfully managed to blast past a brand-new milestone of 50k tokens in under five minutes, achieving absolutely nothing in the process.

Slightly amused and thoroughly out of patience, I scanned the browser console and took a look at the file myself. The culprit? Claude added a modal inside `<Transition>` in parallel with my pages, which results in multiple root elements in one `<Transition>`. I wrapped everything in a `<div>` and the issue was fixed in less then 5 seconds.

Vibe coding isn't about treating an AI like a magical black box that takes over your entire job. If you just let an agent run wild without understanding what it's doing, you're going to end up with 50k tokens of highly confident nonsense. The machine can generate code at a massive scale, but it doesn't actually understand the design or the logic of what you are trying to build.

Using an LLM today is just a massive upgrade to copying utility functions from Stack Overflow. Claude didn't magically engineer Plato on its own; it acted as a high-speed typist for the frontend boilerplate. I still had to set up the architecture, handle the actual data flow, and step in the second the machine lost its way.

At the end of the day, pure AI-generated code still isn't real software engineering. But when you already know how to build the project and use the AI strictly as a tool to speed up the tedious parts, it becomes an incredibly efficient workflow. You keep your hands firmly on the steering wheel, and let the machine do the boring work.

> I also suggest doing UX design on your own. Claude doesn't really understand what is graphical interaction and could easily lead to disastrious responsives and experiences.