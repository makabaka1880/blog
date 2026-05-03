---
title: 4. Union World - STG4
description: TODO
createTime: 2026-04-22
updateTime: 2026-04-22
tags:
    - "STG4"
    - "Lean Prover 4"
---

::DefBox{id=Union}
If $A$ and $B$ are sets, then the union of $A$ and $B$, denoted $A \cup B$, is the set of elements that the either sets have. In other words, for an object to be an element of $A \cap B$, it must be an element of either $A$ and $B$.
$$
A, B : \{U\} \triangleright A \cap B := \lambda x : U. x \in A \vee x \in B : \{U\}
$$
```lean
def intersection { U } (A B : Set U ) : Set U :=
    fun x => x ∈ A ∨ x ∈ B
```
The set theory game provides the definition in a double implication:
:::TheoremBox{id="Definition of Union via Membership"}
```lean
theorem mem_union_iff {α} (x : α) (a b : Set α) 
    : x ∈ a ∩ b ↔ x ∈ a ∨ x ∈ b 
        := by rfl
```
:::
::

## 0x00. Or

::QaBox
Suppose $x \in A$, and $B$ is any set. Then $x \in A \vee x \in B$.
```lean
example (x : U) (A B : Set U) (h : x ∈ A) : x ∈ A ∨ x ∈ B := by
```
::

To better understand what a logical disjunction (**Or**) is, we temporarily welcome back logical conjunction. As we know, a proof term of a conjunction is the pair of the proof terms of the conjuncts, but what exactly is a pair?
