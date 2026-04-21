---
title: 2. Complement World - STG4
description: Guide for the Set Theory Game (STG4) on the Lean Game Server
createTime: 2026-04-21
updateTime: 2026-04-21
---

::NoteBox
For all proofs in this article, we assume the existence of $U$ as an universe of a certain sort.
```lean
variable {U : Type}
```
::

## 0x00. Proof by Contradiction
::QaBox{type=question}
Suppose $x \in A$ and $x \notin B$. Then $\neg A \subseteq B$.
$$
\left.\begin{align*}
\text{Objects}\quad
U &: \ast \\
x &: U \\
A, B &: \{U\} \\
\text{Assumptions}\quad
h_1 &: x \in A \\
h_2 &: x \notin B \\
\end{align*}\right\}
\vdash \neg A \subseteq B
$$

```lean
example (A B : Set U) (x : U) (h1 : x ∈ A) (h2 : x ∉ B) 
    : ¬A ⊆ B := sorry
```
::

As always let's expand all syntatic sugars.
$$
\left.\begin{align*}
\text{Objects}\quad
U &: \ast \\
x &: U \\
A, B &: \{U\} \\
\text{Assumptions}\quad
h_1 &: A\ x \\
h_2 &: B\ x \to \bot \\
\end{align*}\right\}
\vdash (\prod_{a : U} A\ a \to B\ a) \to \bot
$$

Notice that our goal is an implication of $A \subseteq B$ to falsity. This is the second-order logic encoding of negation, which semantically encodes the impossibility of the clause as an antecedent. Note that something interesting when we apply the `intro` tactic.

$$
\left.\begin{align*}
\text{Objects}\quad
U &: \ast \\
x &: U \\
A, B &: \{U\} \\
\text{Assumptions}\quad
h_1 &: A\ x \\
h_2 &: B\ x \to \bot \\
h_{AB} &: \prod_{a : U} A\ a \to B\ a \\
\end{align*}\right\}
\vdash \bot
$$

Let's take a moment to consider what a goal of $\bot$ meant. $\bot$ in type theory corresponds to falsity under the Curry-Howard isomorphism, so now our goal is basically to prove falsity. But how is that possible?

The key lays in the semantics of `intro` here. We *assumed* the antecedent of the goal, but no one guaranteed it to be true; in fact for our case, this implication was desugarized from a negation, meaning we actually want to prove the antecedent **wrong**! By applying `intro` here, we are basically asserting a false proposition true, and thus trying to prove it's falsity by the absurdity that leads behind, namely, we want to prove **false as a truth** to prove the antecedent impossible.

::NoteBox
If you have a background in classical logic, this should immediately strike you as the method of **Proof by Contradiction**. In fact, when using flag derivation, the notation is identical to the process of deriving in natural deduction:

::FlagDeriv{center=true}
#flag
$* : \square$

#pole
:::FlagDeriv

#flag
$A$         &emsp;&emsp; (Assumption)

#pole
$...$

$\bot$
:::

$\neg A$    &emsp;&emsp; ($\neg$-Introduction)
::
::

However the more idiomatic way to introduce the negation of the goal is by using the tactic `by_contra`. When your goal is a negation of form $\vdash \neg P$, `by_contra h` does the same thing as `intro h`: it provides a object $h : P$. However when your claim is not a negation, like $\vdash P$, `by_contra h` introduces a negation of the goal $h : \neg P$ and sets your goal to $\vdash \bot$.

::ExampleBox

Consider the proof below:

$$
\left.\begin{align*}
\text{Objects}\quad
A, B, C &: \text{Type} \\
f &: A \to B \\
g &: B \to C \\
x, y &: A \\
\text{Assumptions}\quad
h_{gf} &: \forall \{a_1, a_2 : A\}, g(f(a_1)) = g(f(a_2)) \to a_1 = a_2 \\
h_{feq} &: f(x) = f(y)
\end{align*}\right\}
\vdash x = y
$$

We assume the negation of our goal using `by_contra h`, moving the target into the context to hunt for a contradiction.

$$
\left.\begin{align*}
\text{Objects}\quad
A, B, C, f, g, x, y &: \dots \\
\text{Assumptions}\quad
h_{gf} &: \forall \{a_1, a_2\}, g(f(a_1)) = g(f(a_2)) \to a_1 = a_2 \\
h_{feq} &: f(x) = f(y) \\
h &: x \neq y
\end{align*}\right\}
\vdash \bot
$$

By applying $g$ to $h_{feq}$ and using $h_{gf}$, we arrive at an equality that directly contradicts $h$, and by applying them we can close our goal using `exact`.

$$
\left.\begin{align*}
\text{Objects}\quad
A, B, C, f, g, x, y &: \dots \\
\text{Assumptions}\quad
h_{gf} &: \forall \{a_1, a_2\}, g(f(a_1)) = g(f(a_2)) \to a_1 = a_2 \\
h_{feq} &: f(x) = f(y) \\
h &: x \neq y \\
h_\text{derived} &: x = y \\
h\ h_\text{derived} &: \boxed \bot
\end{align*}\right\}
\vdash \boxed \bot \quad \checkmark
$$
:Qed
::

After getting the semantics right, its much more easy to derive the rest of the proof. First we apply $h_1$ to $h_{AB}$ to provide a proof $h_B : x \in B$:

$$
\left.\begin{align*}
\text{Objects}\quad
U &: \ast \\
x &: U \\
A, B &: \{U\} \\
\text{Assumptions}\quad
h_1 &: A\ x \\
h_2 &: B\ x \to \bot \\
h_{AB} &: \prod_{a : U} A\ a \to B\ a \\
h_B &: B\ x
\end{align*}\right\}
\vdash \bot
$$

And by applying $h_B$ to $h_2$, we produce a term of type $\bot$ which could be used to close the goal by `exact`. Note that $h_2$ can be sugarized into $\neg B\ x$ which is the negation of $h_B$, so the process of applying $h_B$ to $h_2$ is also known as the **contradiction**.

::QaBox{type=answer}
```lean
example (A B : Set U) (x : U) (h1 : x ∈ A) (h2 : x ∉ B) 
    : ¬A ⊆ B := by
        by_contra hAB
        have hB : x ∈ B := hAB h1
        exact h2 hB
```
:Qed
::

## 0x01. Definition of Complement
::QaBox
Prove the following theorem.
:::TheoremBox{id="Definition of Complement"}
Let $x$ be an object in the universe $U$, and let $A$ be a set whose elements come from $U$. Then $x \in A^\complement \iff x \notin A$
:::
```lean
theorem mem_compl_iff (A : Set U) (x : U) : x ∈ Aᶜ ↔ x ∉ A
    := by sorry
```
::

If you dig deep under to how complement is defined:
$$
A : U \to \ast \vdash A^\complement : \neg(U \to \ast)
$$

And it is identical to the negation of the set. Therefore, we are proving a trivial tautology of form $A \iff A$. But how do we prove it?

In Lean, $\iff$ is an equivalence relation. 

> I wont go into the details, but it was proven through some sort of language feature similar to Haskell's typeclass.

For equivalence relations, Lean has a whole arsenal of tactics. For our purposes, it provides a tactic named `rfl` to prove reflexivity, which are propositions of form $A \equiv A$, where $\equiv$ is any equivalence relation defined over the type of $A$.

::QaBox{type=answer}
```lean
theorem mem_compl_iff (A : Set U) (x : U) : x ∈ Aᶜ ↔ x ∉ A
    := by rfl
```
:Qed
::

## 0x02.  Complement Subsets from Subsets
::QaBox
Prove the following theorem.
:::TheoremBox{id="Definition of Complement"}
Suppose $A \subseteq B$. Then $B^\complement \subseteq A^\complement$
:::
```lean
theorem compl_subset_compl_of_subset {A B : Set U} (h1 : A ⊆ B) 
    : Bᶜ ⊆ Aᶜ := by sorry
```
::

For this question we could just literally expand everything by assuming all of the antecedents. To apply `intro` in a row for various terms, just juxtapose each of the identifiers one by one after each other.

::ExampleBox
Consider the following goal
$$
\vdash h_1 \to h_2 \to h_3 \to h_4
$$
Expanding it using `intro`s could be simplified to
```lean
intro h1 h2 h3;
sorry;  /- prove h4 -/
```
Which corresponds to
::FlagDeriv{center=true}

#flag
$\ast : \square$
#pole
:::FlagDeriv

#flag
$A_1 : h_1$
#pole
::::FlagDeriv

#flag
$A_2 : h_2$
#pole
:::::FlagDeriv

#flag
$A_3 : h_3$
#pole
$\texttt{sorry} : h_4$
:::::

$\lambda A_3 : h_3. \texttt{sorry} : h_3 \to h_4$

::::

$\lambda A_2 : h_2. \lambda A_3 : h_3. \texttt{sorry} : h_2 \to h_3 \to h_4$

:::

$\lambda A_1 : h_1. \lambda A_2 : h_2. \lambda A_3 : h_3. \texttt{sorry} : \boxed{h_1 \to h_2 \to h_3 \to h_4}$
:Qed

::

::

And the rest is just simple lambda calculus. I won't even bother to `have` an intermediate assumption here.

::QaBox{type=answer}
```lean
theorem compl_subset_compl_of_subset {A B : Set U} (h1 : A ⊆ B) 
    : Bᶜ ⊆ Aᶜ := by
        intro h hnb ha
        exact hnb (h1 ha)
```
:Qed
::

## 0x03. Complement of a Complement
::QaBox
Prove the following theorem

:::TheoremBox{id="Complement of a Complement"}
Suppose $A$ is a set. Then $(A^\complement)^\complement = A$.

:::
```lean
theorem compl_compl (A : Set U) 
    : Aᶜᶜ = A := by sorry
```
::

Bad news: we have no idea how to prove theorems about equality.

Good news: STG4 provides us with this built-in theorem about set equality:

::TheoremBox{id="Antisymmetry of Subset Relation"}
```lean
theorem Subset.antisymm {α} {a b} (h₁ : a ⊆ b) (h₂ : b ⊆ a) 
    : a = b := by sorry
```
Where $a$ and $b$ are implicitly sets over some universe.
:::Folding{title="Proof"}
Sorry I dont know how to prove this in Lean. I can derive it using flags:

::FlagDeriv{center=true}

#flag
$h_1 : a \subseteq b$

#pole
:::FlagDeriv

#flag

$h_2 : b \subseteq a$

#pole
::::FlagDeriv

#flag
$x : \alpha$

#pole
:::::FlagDeriv

#flag
$h_a : x \in a$
#pole
$x \in b$ (via $h_1$)
:::::

:::::FlagDeriv

#flag
$h_b : x \in b$
#pole
$x \in a$ (via $h_2$)
:::::

$x \in a \leftrightarrow x \in b$ ($\leftrightarrow$-I)
::::

$\forall x, (x \in a \leftrightarrow x \in b)$ ($\forall$-I)

$a = b$ (Extensionality) 

:Qed

:::
::

:::
::

But in order to *use* theorem, we first need to know what theorems fundamentally *are*. In lean, theorems are functions semantically tagged as theorems.

> OK anyways they are the same as functions. But you just know that they're sth different. The compiler doesn't though.

From a intuitionistic logic point of view, functions proves implications. Theorems imply things based on given conditions. In our case, the `Subset.antisymm` theorem says that $a \subseteq b$ and $b \subseteq a$ implies $a = b$. If you have a proof of $a$ and $b$ being subsets of each other, applying them to the theorem provides you with proof that $a = b$.

Here we introduce a new tactic to utilize assumptions in the form of implications: `apply`. If you have an assumption of the form $h : P \to Q$ and the goal is $\vdash Q$, `apply h` reduces the goal to $P$ because it suffices to use modus ponens to prove $Q$ by applying the proof of $P$ to $h$. It might be hard to wrap your mind around `apply`, because it deduces that the goal *backwards* in an implication. Once you get the hang of it, `apply` might be one of the most used tactics in formal theorem proving.

**Chained implications** add an important wrinkle. If $h : A \to B \to C$ (which desugars to $A \to (B \to C)$), and your goal is $\vdash C$, then `apply h` generates *two* subgoals: $\vdash A$ and $\vdash B$. This is because `apply` unpacks the implication chain from left to right—it needs you to prove both $A$ and $B$ before it can discharge $C$. You essentially "peel off" one antecedent at a time, building up the chain of arguments needed to reach the conclusion. We'll talk about how to deal with multiple subgoals later.

In our case, the theorem `Subset.antisymm` provides an implication, whose consequent is the equality of two sets. Lean's elaborater is smart enough to recognize $(A^\complement)^\complement$ and $A$ as two seperate sets to match into $a = b$. We can write


```lean
apply Subset.antisymm
```
To reduce our goal into goals:
$$
\begin{align*}
\text{Case }& h_1: \\
&\text{Objects} \quad A : \{U\} 
\vdash (A^\complement)^\complement \subseteq A
\end{align*}
$$
$$
\begin{align*}
\text{Case }& h_2: \\
&\text{Objects} \quad A : \{U\} 
\vdash A \subseteq (A^\complement)^\complement
\end{align*}
$$

Don't panic! Proving multiple subgoals is just like proving for a single one. When you write tactics in the normal linear fashion, Lean applies each tactic to the first remaining goal. If a tactic succeeds, it closes that goal and moves to the next one; if it fails on the first goal, the entire proof fails. For our purpose, the goals are simple enough to solve sequentially in this straightforward manner, even though we will explore more advanced goal-selection patterns later.

Let's prove $h_1$. By employing `intro` twice we have a witness of the universe as an element of $(A^\complement)^\complement$.

$$
\left.\begin{align*}
\text{Objects} \quad
A &: \{U\} \\ 
x &: U \\
\text{Assumptions} \quad
h_x &: (A^\complement)^\complement\ x
\end{align*} \right\}
\vdash A\ x
$$

At this point we are pretty much stuck; but remember our previous definition of the complement:
$$
x \in A^\complement \iff x \notin A
$$
It would have been nice to substitute the logical equivalence in. You asked for it, Lean actually have a tactic for it: `rewrite` (or `rw` for short)! `rewrite` could have been the most used tactic in formal proving because its just so versetile in syntatic rewriting using all sorts of proofs.

::NoteBox
Perhaps a deeper or more philosophical reason why `rw` was so useful is because it bridges the gap between metamathematics and mathematics. In other words, it is the easiest way to alternate the written or syntatic form of a clause given data like proofs. This ability that allows the manipulation of the "meta-representation" of the system using the internal logic of the system itself is what brings it so much power.

What makes `rw` particularly elegant is that it guarantees the type transformation: if you rewrite a subterm in a hypothesis using a proof of equivalence, the type of that hypothesis changes correspondingly. For instance, given $h : A$ and a proof $p : P \iff Q$, then `rw [p] at h` transforms $h$ to have type $A[P := Q]$. Yet `rw` abstracts away the machinery entirely -- it hides how the proof of this substitution was obtained behind layers upon layers of recursive and inductive pruning down the abstract syntax tree (AST). You invoke the tactic, and Lean handles the syntactic surgery without exposing the intricate bookkeeping of term reconstruction that makes it work.
::

By default, `rw` acts on the goal. Given $h : P \iff Q$, and the goal $\vdash \Phi$ where $\Phi$ is some formula containing $P$, you can use `rw [h]` to change the goal to $\vdash \Phi[P := Q]$. This direction is known as the **modus ponens direction** (`mp`). To substitute the other way, `rw [←h]` alters the goal to $\vdash \Phi[Q := P]$. This is known as the **reversed modus ponens direction** (`mpr`). You can use `rw [...] at a` to carry out the rewrite in the object `a`.

Let's try using this in our proof. Applying `rw [mem_compl_iff] at hx` once transforms the goal:

$$
\left.\begin{align*}
\text{Objects} \quad
A &: \{U\} \\ 
x &: U \\
\text{Assumptions} \quad
h_x &: \neg(A^\complement\ x)
\end{align*} \right\}
\vdash A\ x
$$

Applying again:

$$
\left.\begin{align*}
\text{Objects} \quad
A &: \{U\} \\ 
x &: U \\
\text{Assumptions} \quad
h_x &: \neg\neg(A\ x)
\end{align*} \right\}
\vdash A\ x
$$

::NoteBox
We manually repeated rewriting. This is inergonomic, so Lean provides the `repeat` tactic. It just executes whatever tactic you put after it until the tactic fails. So the above could be compressed into one line
```lean
repeat rw [mem_compl_iff] at hx;
```
::

Now we've arrived on a double negation on $x \in A$. However, type theory corresponds to intuitionistic logic, which is constructive. We do not accept DNE. How can we proceed with this proof?

Well we cheat. Yes, we define double negation elimination as an **axiom**. Remember, this is only possible because nothing in type theory forbids DNE, but neither can anything prove it. By defining this axiom, we didn't break type theory:  we just open up a more permissive flavor of Lean.

```lean
axiom DoubleNegationElim { a } : a ↔ ¬¬a
```

Since classical mathematics is so useful and DNE is basically, well, *true* in some sense, the Mathlib ecosystem has already defined various APIs to use the DNE axiom. In the STG4 case, it is already baked into a tactic named `push_neg`.

The `push_neg` tactic, like `rw`, is a rewriting tactic. It pushes negation inside other logical connectives using De Morgens and various other tautologic double implications to simplify a negation clause into something more manageable. For example, $\neg (A \vee B)$ become $\neg A \wedge \neg B$ after `push_neg`. Like any other rewriting tactic, you can specify where to rewrite using `at`. In our case, `push_neg` pushes negations inside another negation by cancelling them out: DNE in disguise.

We apply `push_neg at hx` and we close the goal by `exact`.

$$
\left.\begin{align*}
\text{Objects} \quad
A &: \{U\} \\ 
x &: U \\
\text{Assumptions} \quad
h_x &: \boxed{A\ x}
\end{align*} \right\}
\vdash \boxed{A\ x}
$$

Subgoal proved ✅  Let's proceed onto the next subgoal $h_2$.

$$
\begin{align*}
\text{Case }& h_2: \\
&\text{Objects} \quad A : \{U\} 
\vdash A \subseteq (A^\complement)^\complement
\end{align*}
$$

This one is much more easy. Just expand everything with `intro x hAx hnAx`:
$$
\left.\begin{align*}
\text{Objects} \quad 
A &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{Ax} &: A\ x \\
h_{nAx} &: \neg(A\ x) \\
\end{align*}\right\}
\vdash \bot
$$
And contradiction arises from $h_{Ax}$ and $h_{nAx}$.
$$
\left.\begin{align*}
\text{Objects} \quad 
A &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{Ax} &: A\ x \\
h_{nAx} &: \neg(A\ x) \\
h_{nAx}\ h_{Ax} &: \boxed{\bot} \\
\end{align*}\right\}
\vdash \boxed{\bot} \quad \checkmark
$$
Another subgoal closed. In fact, when all subgoals are closed, the problem is solved!

::QaBox{type=answer}
```lean
theorem compl_compl (A : Set U) 
    : Aᶜᶜ = A := by
        apply Subset.antisymm
        intro x hx
        /-
            repeat tactic is not available in this game, 
            so we manually repeat 
        -/
        rw [mem_compl_iff] at hx
        rw [mem_compl_iff] at hx
        push_neg at hx
        exact hx

        intro x hAx hnAx
        exact hnAx hAx
```
:Qed
::

## 0x04. Complement Subsets Equivalence

::QaBox
Suppose $A$ and $B$ are sets. Then $A \subseteq B$ if and only if $B^\complement \subseteq A^\complement$.
```lean4
example (A B : Set U) : A ⊆ B ↔ Bᶜ ⊆ Aᶜ := by sorry
```
::

In this problem, STG4 provides another theorem: `Iff.intro`.

::TheoremBox{id="Double Implication Introduction"}
Assume propositions $P$ and $Q$. When given proof of $P \implies Q$ and $Q \implies P$, **Double Implication** can be introduced: $P \iff Q$.
```lean
theorem Iff.intro {a b} (mp : a → b) (mpr : b → a) 
    : a ↔ b := sorry
```
::Folding{title="Proof"}
Well, I mean, after all that's how double implication is defined
```lean
theorem Iff.intro {a b} (mp : a → b) (mpr : b → a) 
    : a ↔ b := ⟨mp, mpr⟩
```
:Qed
::
::
Try doing this one yourself. Remember, when seeing a construct in the goal, try applying the construction's introduction rule. Here, try `apply Iff.intro` for the first tactic and see what it brings.

::Folding{title="Solution - Too long for a Spoiler Box"}
We start by `apply Iff.intro` to break the implication into modus ponens and the reversed direction.

$$
\begin{align*}
\text{Case }& h_1: \\
&\text{Objects} \quad A, B : \{U\} 
\vdash A \subseteq B \to B^\complement \subseteq A^\complement
\end{align*}
$$
$$
\begin{align*}
\text{Case }& h_2: \\
&\text{Objects} \quad A, B : \{U\} 
\vdash B^\complement \subseteq A^\complement \to A \subseteq B
\end{align*}
$$

Let's start with the first goal $h_1$. We see multiple implications, so its natural to start with `intro hAB x hnBx`:

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{AB} &: A \subseteq B \\
h_{nBx} &: (B^\complement\ x) \\
\end{align*}\right\}
\vdash A^\complement\ x
$$

By rewriting the definition of complements we can introduce again

```lean
rw [mem_compl_iff]; by_contra hAx
```

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{AB} &: A \subseteq B \\
h_{nBx} &: (B^\complement\ x) \\
h_{Ax} &: A\ x \\
\end{align*}\right\}
\vdash \bot
$$

Now its a clear modus ponens reduction line. Apply $h_{Ax}$ to $h_{AB}$ to obtain $h_{Bx} : B\ x$, and after `rw [mem_compl_iff] at hnBx` contradiction arises from `hnBx` and `hBx`.

```lean
have hBx : x ∈ B := hAB hAx
rw [mem_compl_iff] at hnBx
exact hnBx hBx
```

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{AB} &: A \subseteq B \\
h_{nBx} &: \neg(B\ x) \\
h_{Bx} &: B\ x \\
h_{Ax} &: A\ x \\
h_{nBx}\ h_{Bx} &: \boxed \bot \\
\end{align*}\right\}
\vdash \boxed \bot \quad \checkmark
$$

Subgoal $h_1$ closed ✅ Moving on to $h_2$. 

Obviously we first apply `intro hcBcA x hAx` to expand as much as we can:

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{B^\complement A^\complement} &: B^\complement \subseteq A^\complement \\
h_{A x} &: A\ x \\
\end{align*}\right\}
\vdash B\ x
$$

The key here is to identify the fact that we can only move on if we have a way to extract consequent $x \in A^\complement$ in some way, so we must obtain a proof of $x \in B^\complement$. We therefore proceed using proof by contradiction using `by_contra hnBx`:

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{B^\complement A^\complement} &: B^\complement \subseteq A^\complement \\
h_{A x} &: A\ x \\
h_{nBx} &: \neg(B\ x)
\end{align*}\right\}
\vdash \bot
$$

The rest is simple. We obtain $h_{nAx} : x \in A^\complement$ by applying $h_{nBx}$ to $h_{B^\complement A^\complement}$ and contradiction arises.

> Note that lean is smart enough to interpret $x \in A^\complement$ as $(x \in A) \to \bot$, so `rw` is not needed here.

$$
\left.\begin{align*}
\text{Objects} \quad 
A, B &: \{U\}  \\
x &: U \\
\text{Assumptions} \quad
h_{B^\complement A^\complement} &: B^\complement \subseteq A^\complement \\
h_{A x} &: A\ x \\
h_{n A x} &: \neg(A\ x) \\
h_{nBx} &: \neg(B\ x) \\
h_{n A x} h_{A x} &: \boxed \bot
\end{align*}\right\}
\vdash \boxed \bot \quad \checkmark
$$

Putting it all together:
:::QaBox{type=answer}
```lean
example (A B : Set U) : A ⊆ B ↔ Bᶜ ⊆ Aᶜ := by 
    apply Iff.intro

    intro hAB x hnBx
    rw [mem_compl_iff]
    by_contra hAx
    have hBx : x ∈ B := hAB hAx
    rw [mem_compl_iff] at hnBx
    exact hnBx hBx

    intro hcBcA x hAx
    by_contra hnBx
    have hnAx : x ∈ Aᶜ := hcBcA hnBx
    exact hnAx hAx
```
:Qed
:::

::