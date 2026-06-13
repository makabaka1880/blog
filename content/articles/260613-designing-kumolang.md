---
title: Designing KumoLang
description: Making correct cheesecakes.
createTime: 2026-06-13
updateTime: 2026-06-13
---

::LinkCard
---
title: KumoLang
details: Making Correct Cheesecakes.
url: https://kumo-lang.makabaka1880.xyz
---
::

::QuoteBox{source="Kumo"}
:Pic{src="Screenshot 2026-06-13 at 13.51.19.webp"}
::


T'was the end of semester, and needless to say, a time for mischeif. As a tribute to our dear CSA teacher Mr. Kumo and our favourite bakery KumoKumo, we present to the world **KumoLang - The First Formal Verification Language For Cake Culinary**.

> **Disclaimer**
> 
> First of all this is an academic parody. We are not affliated with KumoKumo and *Kumo* was not, is not, and will not be associated any individual or organization identified by "Kumo".
>
> Aside from the language itself, everything (the paper, interpreter, website and WASM bindings) is written by Claude Code under human supervision. 
> 
> KumoLang *is* actually usable and frankly a pretty novel approach to culinary (well maybe because formal culinary is pretty stupid afterall).

## 0x00. Brainstorming

I initially thought of a stack-based language. You can push ingredients on the stack and combine them using operations.

$$
\begin{align}
p & ::= && s; p \; \\
& \mid && \texttt{skip} \\
s & ::= && \text{push}(v) \\
& \mid && \text{pop} \\
& \mid && \text{squish}(v, n) \\
\end{align}
$$

The semantic domain of $v$ is the tree where each node is an atom. For simplicity lets just assume `String`.

You can $\text{push}$ elements onto the stack:
$$
\frac{}{\langle \text{push}(v); P \;,\; \sigma \rangle \to \langle P\;,\; v \cdot \sigma\rangle} (\text{Push})
$$

$\text{pop}$ elements off the stack,

$$
\frac{\sigma = v \cdot \sigma'}{\langle \text{pop}; P \;,\; \sigma \rangle \to \langle P\;,\; \sigma' \rangle} (\text{Pop}) \\
$$

and combine top $n$ elements by popping them from the stack, forming a new tree with the root node $v$ with the $n$ nodes as the child, and pushing that tree back.

$$
\frac{\sigma = v_1 \cdot v_2 \cdots v_n \cdot \sigma'}{ \langle \text{squish}(v, n); P \;,\; \sigma \rangle \to \langle P \;,\; \sigma \rangle} (\text{Squish})
$$


::NoteBox
Some naunces on the notation. Since this language is basically an effect system, termination will not be modeled as a evaluation to a certain value. Therefore I'll use $\nrightarrow$ on evaluation of the termination command `skip`.
\frac{}{\langle \texttt{skip} \;,\; \sigma \rangle \nrightarrow}(\text{Statis}) \\
::
