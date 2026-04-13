---
title: Declarative Programming is actually Imperative
description: TODO
createTime: 2026-02-18
updateTime: 2026-02-18
---

## 0x01. Induction

If you majored in mathematics you've probably heard of Russel's Paradox:
::DefBox
**Russel's Paradox** States that the set of all sets that does not contain themselves cannot be constructed, thus proving inconsistency of naïve set theory (NST).
::FlagDeriv{center=true}
#flag 
$S := \{x : x \notin x\}$
#pole
    ::FlagDeriv
    #flag
    $S \notin S$

    #pole
    $S \in S $ by Comprehension Intro

    $\bot$ Contradiction
    ::
    $(S \notin S) \to \bot$

    $S \in S$ By Double Negattion

    $S \notin S$ by Comprehension Elim

    $\bot$ Contradiction 👈

    ::
::

From that point on, mathematicians realized we couldn't just build things declaratively as we pleased — there are constructions that *simply cannot exist*. A much more rigorous set of rules was needed to govern what we can and cannot build.

> Most people know that Ernst Zermelo and Abraham Fraenkel built ZFC, the biggest headache for students learning axiomatic mathematics. What fewer people know is that Russell himself created an alternative foundational system called **Type Theory** to replace NST.

As type theory evolve, mathematicians 