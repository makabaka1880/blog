---
title: 0. A COC Interpretation of Classical Set Theory - STG4
description: A prelude to a guide for the Set Theory Game (STG4) on the Lean Game Server
createTime: 2026-04-20
updateTime: 2026-04-20
---

There is this very famous online game called the **Natural Number Game**, hosted on Heinrich Heine University's Lean Game Server.

::LinkCard
---
title: Lean Game Server
details: A repository of learning games for the proof assistant Lean (Lean 4) and its mathematical library mathlib
url: https://adam.math.hhu.de/#/
image: leangameserver.webp
---
::

About half a year ago I noticed a new game called the *Set Theory Game*. Curious as I am, I decided to check it out, and it was awesome. I'll recommend anyone into formal theorem proving to check it out to have a taste of what an academic language like Lean can do out in the fields.

::LinkCard
---
title: Set Theory Game
details: An introduction to mathematical proof.
url: https://adam.math.hhu.de/#/g/djvelleman/stg4
image: leangameserver.webp
---
::

Before delving into the game itself, I'd like to give a brief overview of how set theory is modeled in Lean and Mathlib as a whole to give you readers a sense of what is going on from a type-oriented point of view. This is crucial since a lot of textbooks model sets naïvely as terms of sort $\ast$, which are just types, as opposed to Mathlib's approach of using a predicate over a certain universe denoted by a type. 

> I'll be using sort instead of the type theoretical notion of universe in order to distinguish from the set theoretical term of universe, which means the universal set $U$.

In Mathlib, sets are type constructors.
```lean
def Set (α : Type u) : Type u := α -> Prop
```

$$
\alpha : \ast_u \triangleright \texttt{Set}(\alpha) := \alpha \to \ast_0 : \ast_u
$$

That's a mouthful of sorts. Let's break it down.

`Set` is a formal definition with a parameter $\alpha$ of sort $\ast_u$. When $\alpha$ is instantiated, the definition returns an Pi abstraction $\alpha \to \ast_0$, which is of sort $\ast_u$. What it tells you is that when you give `Set` a **universe** $\ast_u$ (which corresponds to the universal set $U$ in set theory, and here a specific sort) the set should be in, it gives you a function type.

But why a function type? Let's go back to set theory for the answer. Subsets as predicates has been taught in textbooks for decades, but actually by considering the universal set as a parent set of all sets, this definition extends to sets:

::DefBox{id=Set}
A **Set** over the universe $U$ is a predicate
$$
S : U \to \mathbb{B}
$$
That semantically indicates whether if an object of the universe is in the set $S$.
::

If this does not look familiar, no worries -- this convention is far more pervasive than it might first appear. In fact, the familiar membership notation $x \in S$ is nothing more than **syntactic sugar** for the predicate application $S(x)$! The set *is* the predicate; membership is merely function application in disguise.

Let's port this definition over to CoC. Beware that the universe we say in type theory is the entire **sort**, in contrast to in set theory where the universe is just a bigger set that encompasses our set.

::DefBox{id=Set}
Given a sort $*_u$ and a type $\alpha : \ast_u$. Then a **Set** over the universe $\alpha$ is an abstraction dependent on $\alpha$:
$$
(\ast_u : \square) \triangleright \texttt{Set} := \Pi_{\alpha : \ast_u} (\alpha \to *_0) \\
$$
Or with parameter lists:
$$
(\ast_u : \square, \alpha: \ast_u) \triangleright \texttt{Set}(\alpha) := \alpha \to *_0
$$
Where $*_0$ is the sort (type theoretical universe) of propositions.
::

> Note that we're defining the **type constructor** for a set here, not the set itself! $$\texttt{Set}$$ is just a way to parametrically polymorphisize over universes in our sorts. 
>
> It's sorta like how `ArrayList<...>` constructs a type instead of a term and you need to call the *data constructor*`new ArrayList<...>()` to actually get a container.

For an explicit example, let's look at the set of functions with mathematical fixed points:

::ExampleBox
Let's construct the set corresponding to the following set-builder notation:
$$
S := \{f \mid \exists x \in \mathbb{R}\ f, f(x) = x\ \text{where}\ f : \mathbb{R} \to \mathbb{R}\}
$$
Here's the complete derivation in $\lambda D_0$:
:::FlagDeriv
---
center: true
---

#flag
$\ast_1 : \square$

#pole
::::FlagDeriv

#flag
$u : \mathbb{N}, \alpha : \ast_u$

#pole
$\texttt{Set}(\alpha) := \alpha \to \ast_0$

::::

::::FlagDeriv

#flag
$1 : \mathbb{N}, \mathbb{R} : \ast_1, \mathbb{R} \to \mathbb{R} : \ast_1$

#pole
$$
\begin{align*}
&\text{HasFixedPoints} := \\
&\quad \lambda f : \mathbb{R} \to \mathbb{R}. \exists x : \mathbb{R}. f\ x = x \\
&\quad: \texttt{Set}(1, \mathbb{R} \to \mathbb{R})
\end{align*}
$$

::::
:::

Remember, $\texttt{Set}$ only provides the type and there's no standard way to implement a set: it's up to you to inhabit it. Lean does provide `SetOf` and various other helper methods to implement a set, but that's irrelevant to the fact that **type constructors does not mandatorily provide data constructors in CoC**.

> Well algebraic datatypes (ADTs) and inductive datatypes are defined by data constructors, but that's just a subset of what CoC could type.
::

I'll be delving into more advanced encoding along with the game. Stay tuned!