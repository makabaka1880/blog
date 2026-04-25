---
title: Multiplication Squared
description: Well, no one says you can't, so how do you multiply multiplication and multiplication?
createTime: 2026-04-22
updateTime: 2026-04-22
---

But what is a pair formally? To investigate that, let's first denote the a pair of $A$ and $B$ as $A \times B$:
$$
A \quad \quad A \times B \quad \quad B
$$

What do we now know about $A \times B$ and its relation to $A$ and $B$? First of all, the product have ways of projecting onto it's components:

$$
\begin{CD}
    A @<\pi_A<< A \times B @>\pi_B>> B
\end{CD}
$$

These projections are known as the **eliminations** of the pair: the ways to destruct, or "use" a pair. We knew how to construct pairs now, but how exactly do we construct them? In other words, what is the **introduction** of a pair?

In lambda calculus, functions can only have one input. Therefore, we cannot draw an arrow that splits in the input to $A$ and $B$ and merges into $A \times B$. In type theory, currying is the way we construct such functions of higher arity, but in our diagram, we just want nice and flat morphisms.

A clever way to encode the introduction of a pair is to consider any other term; here we call it $C$. $C$ encodes the proof of $A$ and $B$: that is, there are ways to project from $C$ to $A$ and $B$ called $f$ and $g$:

$$
\begin{matrix}
    & & C & & \\
    & \small{f} \swarrow  & & \searrow \small{g} & \\
    A & \xleftarrow{\pi_A} & A \times B & \xrightarrow{\pi_B} & B
\end{matrix}
$$

::NoteBox
Fix some $C$ and consider its projections to $A$ and $B$:
$$
\begin{align*}
f : C \to A \\
g : C \to B
\end{align*}
$$
Note that any inhabitant of $C$ proves $A$ and $B$ immediately by an application on $f$ or $g$. That's what we meant by "$C$ encoding the proof of $A$ and $B$."
::


We want the pair to be something special, or else there's absolutely no meaning in introducing one. Here, we want $A \times B$ to be the best object that encodes a coupling of $A$ and $B$. Therefore, we define a pair to be constructable from any proof of existence of the proof of its components. 

In other words, because $C$ proves $A$ and $B$, the pair of $A$ and $B$ must be constructable from $C$. This is known as the **universal property**, and the morphism that constructs $A \times B$ from $C$ is known as the **mediating morphism**, denoted as $\langle f, g \rangle$.

$$
\langle f, g \rangle : \prod_{C : \ast} (C \to A) \to (C \to B) \to C \to A \times B
$$

Adding that to our diagram:

$$
\begin{matrix}
    & & C & & \\
    & \small{f} \swarrow  & \downarrow \langle f, g \rangle & \searrow \small{g} & \\
    A & \xleftarrow{\pi_A} & A \times B & \xrightarrow{\pi_B} & B
\end{matrix}
$$

After getting 

To write it out formally in type theory, those rules are

$$
\begin{align*}
\pi_A &: A \times B \to A \\
\pi_B &: A \times B \to B \\
A \times B &: \prod_{C : \ast} (A \to B \to C) \to C
\end{align*}
$$

Note that we encode the morphism from 
