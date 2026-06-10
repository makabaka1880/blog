---
title: 2026 Gaokao Mathematics Problem 19
description: TODO
createTime: 2026-06-09
updateTime: 2026-06-09
---

::QaBox{id="Q"}
Given function $f : \mathbb R \to \mathbb R$ such that $f(x) = 2^x$ when $x < 0$. Define $D(x_0) = \{d \in \mathbb R \,\mid\, f(x_0 + d) > f(x_0)\}$ for any $x_0 \in \mathbb R$.
1. If $f(x) = 1 - x \, (x \ge 0)$, find $D(-1)$.
2. If $f$ is odd and for any $x_1, x_2 \in \mathbb R$ s.t. $x_1 x_2 \ne 0$, $f(x_1) \le f(x_2)$, then $D(x_2) \subseteq D(x_1)$.
3. If $f$ satisfies
    1. $f(x_1) \le f(x_2) \implies D(x_2) \subseteq D(x_1)$
    2. When $0 < x < 1$, $f(x) < f(0)$

    Prove $f(0) \ge 1$ and $f(x)$ increases monotonically over $(0, +\infty)$.
::

Let's solve the first one. This is pretty easy. Just substitute $f$ in:

::QaBox{type="a"}
$$
\begin{aligned}
D =&\,\{d \in \mathbb R\,\mid\, f(d - 1) > f(-1)\} = \{d \in \mathbb R\,\mid\, f(d - 1) > 1/2\} \\
=&\,\{d \in (-\infty, 1] \,\mid\, 2^{d - 1} > 1/2\} \cup \{d \in (1, +\infty) \,\mid\, 2 - d > 1/2\} \\
=&\,(0,1] \cup \left(1, \frac{3}{2}\right) = \left(0, \frac32\right)
\end{aligned}
$$
::

The second one requires some definition expansion. 
$$
D(x_2) \subseteq D(x_1) \iff  \forall d \in \mathbb R, f(x_2 + d) > f(x_2) \implies f(x_1 + d) > f(x_1)
$$
Fix $d \in \mathbb R$ and assume $f(x_2 + d) > f(x_2)$. We now just need to prove $f(x_1 + d) > f(x_1)$. Also since $f(x) = -f(-x)$, then $f(x) = -2^{-x}\, (x > 0)$. Also note that $f$ is monotonic over $(-\infty, 0)$ and $(0, +\infty)$, respectively.

::QaBox{type="a"}
**Case 1**. When $x_1$ and $x_2$ has the same sign, then $x_1 \ge x_2$. When they are both negative, the problem become proving $2^{x_2 + d} > 2^{x_2} \implies 2^{x_1 + d} > 2^{x_1}$. Because $f$ is monotonically increasing over this specific range of $x_1$ and $x_2$, then $d > 0$. By the monotonicity of $f$, RHS of the implication automatically holds. A similar argument goes for $x_1 \ge x_2 > 0$. 

**Case 2**. When $x_1$ and $x_2$ does not have the same sign. Then $x_1 > 0 > x_2$. The problem is now proving $2^{x_2 + d} > 2^{x_2} \implies -2^{-x_1 - d} > -2^{-x_1}$. By monotonicity $d > 0$. Therefore $2^{-x_1 - d} < 2^{-x_1}$ and the inequality flips when signs are reverse on both side. 
:Qed
::

The third problem is slightly harder. We notice that when $f(0) < 1$, $D(0)$ will contain a subset of $(-\infty, 0)$, whereas $D(a)$ for any $a < 0$ wont.

::QaBox{type="a"}
Assume $f(0) < 1$. Consider some $a < 0$. By the monotonicity of $f$ over $(-\infty, 0)$, there does not exist any $d < 0$ such that $f(a + d) > f(a)$. Therefore $\nexists d < 0, d \in D(a)$. However because $\lim_{a \to 0^-} f(a) = 1$, for any $\delta$, there will always exist some $\epsilon < 0$ such that $f(\epsilon) > 1 - \delta$. Take $\delta = 1 - f(0)$. Then $\epsilon \in D(0)$. This is a direct contradiction. :Qed
::


The last proof of monotonicity requires proving a lemma that $\forall x > 0, f(x) < 0$.

**Proof**. Assume $\exists x_0, 0 \ge f(x_0) < f(0)$. Then $\forall x < 0, D(x_0) \subseteq D(x)$. But because $f(x_0) < f(0)$, then $-x_0 \in D(x_0)$. By the monotonicity of $f(x)$ when $x < 0$, $\forall x < 0, \nexists d < 0, d \in D(x)$. But because $\forall x < 0, \forall d \in D(x_0) \implies d \in D(x)$, this is a direct contradiction since $-x_0 < 0$. :Qed

Now we can prove the monotonicity of $f$.

::QaBox{type="a"}
Assume there $\exists 0 < x_1 < x_2, f(x_1) > f(x_2)$. Then $x_2 - x_1 \notin D(x_1)$. Because $\forall x < 0, f(x_1) < 0 < f(x)$. Therefore $\forall x < 0, D(x) \subseteq D(x_1)$. Fix an arbitrary $\epsilon > 0$. It is evident that $x_1 - x_2 - \epsilon < 0$, so $\forall d \in D(x_1 - x_2 - \epsilon), d \in D(x_1)$. Because of $f$'s monotonicity, $f(-\epsilon) > f(x_1 - x_2 - \epsilon)$ so $x_2 - x_1 \in D(x_1 - x_2 - \epsilon)$. This is a direct contradiction. :Qed
::