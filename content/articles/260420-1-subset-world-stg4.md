---
title: 1. Subset World - STG4
description: Guide for the Set Theory Game (STG4) on the Lean Game Server
createTime: 2026-04-20
updateTime: 2026-04-20
---

Let's walk into the first level in the game.

> I'll be using the syntatic sugar $\{\cdot\}$ for sets. For example, $\{A\}$ is equivalent to $\texttt{Set}\ A$.

## 0x00. The `exact` tactic

Tactics are just syntatic sugars to make life easier for mathematicians. They simplify term constructions into imperative flow, allowing theorists to build on top of terms one by one or reduce the goal to a type that could be trivially implemented. For example, let's look at the first level to understand what tactics are.

::QaBox{type=question}

Let x be an object in the universe $U$, and let $A$ be a set whose elements come from $U$. Suppose that $x \in A$. Then $x \in A$.

:::FlagDeriv{center=true}

#flag
$U : \ast, x : U, A : \{U\}$
#pole
::::FlagDeriv

#flag
$h : x \in A$
#pole
$??? : x \in A$
::::

:::
```lean
example (U : Type) (x : U) (A : Set U) (h : x ∈ A) 
    : x ∈ A := sorry
```

::

The answer is trivially $h$. 

```lean
example (U : Type) (x : U) (A : Set U) (h : x ∈ A) 
    : x ∈ A := h
```

However, we'll be using tactics since we're learning them. When we're using tactics, we wont be thinking nesting assumptions and extracting abstractions to build up a term, we think about reducing the goal. If you open this problem up in VSCode or just the HHU Game Server, you see something like this:

$$
\left.\begin{align*}
\text{Objects} \quad U & : \ast \\
x & : U \\
A & : \{U\} \\
\text{Assumptions} \quad h & : x \in A \quad \\
\end{align*} \right\}
\vdash x \in A
$$

On the left side we have our **premises**. Those are the objects and assumptions that we're working on, and we're interested in making the RHS, the **goal** as trivial to implement using the premises as possible by reducing it using constructions, axioms, and the objects on the left, or constructing more premises using tactics and introductions.

The first lean tactic we're introducing is called the `exact` tactic. If you see any objects available on the left that matches your goal, we can use `exact` to **close** the goal:

```lean
exact h;
```

$$
\left.\begin{align*}
\text{Objects} \quad U & : \ast \\
x & : U \\
A & : \{U\} \\
\text{Assumptions} \quad h & : \boxed{x \in A} \quad \\
\end{align*} \right\}
\vdash \boxed{x \in A} \quad \checkmark
$$

And we solved the problem!

```lean
example (U : Type) (x : U) (A : Set U) (h : x ∈ A) 
    : x ∈ A := by   /- Goal: x in A -/
        exact h;    /- Goals accomplished! -/
```

::QaBox{type=answer}
```lean
exact h
```
::Pic
---
src: "Screenshot 2026-04-20 at 21.28.35.webp"
alt: What it looks like on the HHU Server
---
::
::

## 0x01. A Subset Hypothesis
::QaBox
Suppose $A$ and $B$ are sets, $A \subseteq B$, and $x \in A$. Then $x \in B$.
$$
\left.\begin{align*}
\text{Objects}\quad U & : \ast \\
x & : U \\
A, B & : \{U\} \\
\text{Assumptions}\quad h_1 & : A \subseteq B \\
h_2 & : x \in A
\end{align*}\right\}
\vdash x \in B
$$
``` lean
example (U : Type) (x : U) (A : Set U) 
    (h1 : A ⊆ B) (h2 : x ∈ A)
        : x ∈ B := sorry
```
::HintBox
Only `exact` is needed! Basic lambda calculus\~
::
::

The first thing we need to do is identify what the subset relation is. Let's open our discrete textbook to the Logic chapter and read:

::DefBox{id="Subset"}
Consider sets $A$ and $B$ under the same universe $U$. Then $A$ is a **subset** of $B$, or $A \subseteq B$, if and only if

$$
\forall x \in U, x \in A \implies x \in B
$$
::

By second order logic encoding this is very trivially two nested abstractions. Consider the universe $U : \ast$ and two sets $A$ and $B$ over $U$. Then

$$
A \subseteq B := \prod_{x : U} (A\ x \to B\ x)
$$

> This is a proposition! You need to prove it.

Let's try constructing a proof from it. It's actually pretty trivial.

::SpoilerBox
:::FlagDeriv{center=true}

#flag
$A, B : \{U\}, h_1 : A \subseteq B, h_2 : x \in A$
#pole
::::FlagDeriv

#flag
$x : U$
#pole
$h_1\ x : A\ x \to B\ x$

$h_1\ x\ h_2 : \boxed{B\ x}$

::::

:::
Which is could be sugarized to $x \in B$.
::

In Mathlib, the formal definition of $\subseteq$ is

```lean
def Set.Subset {α : Type u} (s₁ s₂ : Set α) :=
    ∀ {a}, a ∈ s₁ -> a ∈ s₂
```

You might have noticed that the type parameter $\alpha$ is enclosed in curly brackets. This is an ergonomic syntatic sugar that makes this parameter **implicit**, or rather that its not required for you to provide for instantiation. Another form of implicit argument is the $u$ you see in the `Type u` expression. We had never introduce $u$ before, yet the compiler just knew what it is.

> It's idiomatic to intentionally left out introduction for the level index in universe polymorphism. (Universe here refers to sorts)

Likewise, in lean you do not have to explicitly provide the witness $x$ to prove it's belonging in $B$. Therefore, the expression reduces an direct application of $h_2$ on $h_1$, which in lean is a simple juxtaposition.

::QaBox{type="answer"}
``` lean
example (U : Type) (x : U) (A : Set U) 
    (h1 : A ⊆ B) (h2 : x ∈ A)
        : x ∈ B := by   /- Goal : x ∈ B -/
            exact h1 h2 /- Goals Accomplished! -/
```
:::WarningBox
I don't know why but you cannot explicitly provide implicit arguments to a term in HHU's server. If you try this with a standard mathlib setup, `exact h1 x h2` works, whereas on the server, it does not.
:Pic{src="Screenshot 2026-04-20 at 23.08.11.webp" alt="Wierd"}

:::
::

## 2x00. The `have` tactic
::QaBox
Suppose $A \subseteq B$, $B \subseteq C$, and $x \in A$. Then $x \in C$.
$$
\left.\begin{align*}
\text{Objects}\quad U & : \ast \\
x & : U \\
A, B, C & : \{U\} \\
\text{Assumptions}\quad h_1 & : A \subseteq B \\
h_2 & : B \subseteq C \\
h_3 & : x \in A
\end{align*}\right\}
\vdash x \in C
$$
``` lean
example (U : Type) (x : U) (A : Set U) 
    (h1 : A ⊆ B) (h2 : B ⊆ C) (h3 : x ∈ A) 
        : x ∈ C := sorry
```
::

Using the experience from last level, this level seems pretty easy. Just prove $x \in B$ using $h_1\ h_3$ and prove $x \in C$ using that intermediate conclusion and $h_2$.
```lean
exact h2 (h1 h3)
```
For those sort proofs, a terse style is totally ok. However, constructing large and not readable terms is not considered idiomatic in tactic mode. In tactic mode, we gradually solve the goal; we gradually populate our premise and object pool. Therefore, we introduce our next tool: the `have` tactic.

The `have` tactic introduces another object built from existing objects and assumptions. The syntax looks like a binding:

```lean
have h4 : x ∈ B := h1 h3
```

::NoteBox
Even though not considered idiomatic, it's totally fine to omit the type signature here thanks to the Lean elaborator's strong type inference abilities:
```lean
have h4 := h1 h3
```
::

And from here, $h_4$ appears in our object pool just like any other object!

$$
\left.\begin{align*}
\text{Objects}\quad U & : \ast \\
x & : U \\
A, B, C & : \{U\} \\
\text{Assumptions}\quad h_1 & : A \subseteq B \\
h_2 & : B \subseteq C \\
h_3 & : x \in A \\
h_4 & : \boxed{x \in B}
\end{align*}\right\}
\vdash x \in C
$$

And we just apply $h_4$ to $h_2$ for the final result and use $exact$ for closing the goal.

::QaBox{type=answer}
``` lean
example (U : Type) (x : U) (A : Set U) 
    (h1 : A ⊆ B) (h2 : B ⊆ C) (h3 : x ∈ A) 
        : x ∈ C := by
            have h4 : x ∈ B := h1 h3
            exact h2 h4
```
:Pic{src="Screenshot 2026-04-21 at 06.44.49.webp" alt="Screenshot on the HHU Server"}
::

## 0x03. Implication
::QaBox{type=question}
Let x be an object from the universe $U$, and let $A$, $B$, and $C$ be sets such that $A \subseteq B$ and $x \in B \implies x \in C$. Then $x \in A \implies x \in C$
$$
\left.\begin{align*}
\text{Objects}\quad U & : \ast \\
x & : U \\
A, B, C & : \{U\} \\
\text{Assumptions}\quad h_1 & : A \subseteq B \\
h_2 & : x \in B \implies x \in C \\
\end{align*}\right\}
\vdash x \in A \implies x \in C
$$
```lean
example (U : Type) (x : U) (A B C : Set U)
    (h1 : A ⊆ B) (h2 : x ∈ B -> x ∈ C)
        : x ∈ A -> x ∈ C := sorry
```
::

We see an implication in our goal. To prove an implication in the lambda calculus corresponds to constructing an $\lambda$ abstraction with the corresponding type of the implication under the Curry-Howard isomorphism. In this case, we need a term of type

$$
A\ x \to C\ x
$$

It's totally fine to do this in term mode and construct a term like
```lean
example (U : Type) (x : U) (A B C : Set U)
    (h1 : A ⊆ B) (h2 : x ∈ B -> x ∈ C)
        : x ∈ A -> x ∈ C := 
            λ ha => h2 (h1 ha)
```

Or using point-free style
```lean
example (U : Type) (x : U) (A B C : Set U)
    (h1 : A ⊆ B) (h2 : x ∈ B -> x ∈ C)
        : x ∈ A -> x ∈ C := h2 ∘ h1
```
::WarningBox
Well point-free does not work. Can you see why?

:::SpoilerBox
`h1` has an implicit argument: the witness of $x \in A$. We can ommit this in the abstraction form because the elaborator can infer it explictly, but function composition does not care about whether if the first argument is implicit or not.
:::
::

But we're writing code as mathematicians, not haskellers. Mathematicians weight reabability over everything (Ramanujan, not talking about you). Remember what we said about reducing the goal instead of building the proof? We here introduces our first goal changing tactic: `intro`.

The `intro` tactic basically "assumes" the antecedent of the goal (the $A$ in $A \to B$). This works because we truely only need to consider if the antecedent holds, because if it doesn't the goal automatically proves itself by vacuous truth.

::Folding{title="Ex Falso"}
**Ex Falso Quodlibet** (the explosion theorem) says that falsity leads to anything. That is,
$$
\prod_{A : \ast} (\bot \to A)
$$
is a tautology. This can be easily proven via the definition of $\bot$.

:::FlagDeriv{center=true}

#flag
$\ast : \square$

#pole
::::FlagDeriv

#flag
$A : \ast$

#pole

:::::FlagDeriv

#flag
$\text{hn} : \prod_{\alpha : \ast} \alpha$

#pole
$\text{hn}\ A : A$

:::::

$\lambda \text{hn} : \bot.\ \text{hn}\ A : \bot \to A$


::::

$$
\begin{align*}
\Lambda A& : \ast. \lambda \text{hn} : \bot.\ \text{hn}\ A \\
&: \prod_{A : \ast} (\bot \to A)
\end{align*}
$$

:::
::


To see it in action, let's use it on this problem.

```lean
intro h3;
```

$$
\left.\begin{align*}
\text{Objects}\quad U & : \ast \\
x & : U \\
A, B, C & : \{U\} \\
\text{Assumptions}\quad h_1 & : A \subseteq B \\
h_2 & : x \in B \implies x \in C \\
h_3 & : x \in A \\
\end{align*}\right\}
x \in C
$$

::NoteBox
Another way to interpret `intro` is that it erects a flag in a normal flag-pole derivation, but it automatically applies the $\text{(abst)}$ rule to produce an abstraction that closes the goal. 
$$
\frac{
    \Gamma, a : A\vdash b : B
}{
    \Gamma \vdash \lambda a : A. b : A \to B
} \text{(abst)}
$$
::

Notice how the goal changed from an implication to only the original goal's consequent. From now on, we already know what to do. We first use `have` to produce a proof of $x \in B$ using $h_1\ h_3$, then apply it to $h_2$ and use `exact` to close the goal.

::QaBox{type=answer}
```lean
example (U : Type) (x : U) (A B C : Set U)
    (h1 : A ⊆ B) (h2 : x ∈ B -> x ∈ C)
        : x ∈ A -> x ∈ C := by
            intro h3
            have h4 : x ∈ B := h1 h3
            exact h2 h4
```
:Pic{src="Screenshot 2026-04-21 at 07.47.15.webp"}
::

## 0x04. Subset is Reflexive
