---
title: 2026 Gaokao Mathematics Problem 19
description: A taste of real analysis
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
Fix $d \in \mathbb R$ and assume $f(x_2 + d) > f(x_2)$. We now just need to prove $f(x_1 + d) > f(x_1)$. Because $f$ is odd, we can reconstruct the analytical form of $f$:

$$
f(x) = 
\begin{cases}
2^x & x < 0 \\
0 & x = 0 \\
-2^{-x} & x > 0
\end{cases}
$$

We just discuss every possible case of the sign of $x_1$ and $x_2$.

::QaBox{type=a}
**Case 1**. When $x_1 \le x_2 < 0$, $f$ could be expanded to the $x < 0$ case because any $x \ge 0$ will be less then the lower bound of $f(x_1)$ and $f(x_2)$. Therefore the problem simplifies to proving $2^{x_2 + d} > 2^{x_2} \implies 2^{x_1 + d} > 2^{x_1}$. By the monotonicity of $f$, $d > 0$. Therefore the consequent must hold because of $f$'s monotonicity.

**Case 2**. When $x_1 > 0 > x_2$. $f$ on the premise could be expanded to $x < 0$ for the same reason in case 1, thus it is evident that $d > 0$. Similarly because the $x > 0$ case for $f$ is also monotonic, the consequent holds.

**Case 3**. When $0 < x_1 \le x_2$. The premise could hold for two cases of $d$: when $d \le -x_2$ or $d > 0$, and to prove the consequent, either $d \le -x_1$ or $d > 0$. Because $x_1 \le x_2$, then $d \le -x_2$  must imply $d \le -x_1$. When $d > 0$, the consequent also holds.

:Qed
::

The third problem is slightly harder. We notice that when $f(0) < 1$, $D(0)$ will contain a subset of $(-\infty, 0)$, whereas $D(a)$ for any $a < 0$ wont.

::QaBox{type="a"}
Assume $f(0) < 1$. Because of $f$'s monotonicity, $\forall a < 0, \nexists d < 0, d \in D(a)$. 

**Case 1**. $f(0) > 0$. Because $\lim_{a \to -\infty} f(a) = 0$, for any $\delta > 0$, there exists some $X$ that $f(X) < \delta$. Take $\delta = f(0)$. Fix some $X$. Because $f(X) < f(0), D(0) \subseteq D(X)$.  Because $\lim_{a \to 0^-} f(a) = 1$, there must exist some $\epsilon < 0$ s.t. $f(\epsilon) > f(0)$. Therefore $\epsilon \in D(0)$. Because $D(0) \subseteq D(X)$, $\epsilon \in D(X)$ too. This is a direct contradiction with $\nexists d < 0, d \in D(X)$.

**Case 2**. $f(0) \le 0$. Then $\forall x_0 < 0, f(x_0) > f(0)$. Fix some $x_0$, then $D(x_0) \subseteq D(0)$. Because $\forall 0 < x < 1, f(x) < f(0)$, then $\forall 0 < \epsilon < 1, \epsilon \notin D(0)$. Now fix such $0 < \epsilon < \min(1, -x_0)$. By the monoticity of $f$, $f(x_0) < f(x_0 + \epsilon)$, so $\epsilon \in D(x_0)$. Because $D(x_0) \subseteq D(0)$, $\epsilon \in D(0)$ too. This is a direct contradiction with $\nexists 0 < \epsilon < 1, \epsilon \in D(0)$.

:Qed
::


The last proof of monotonicity requires proving a lemma that $\forall x > 0, f(x) < 0$.

**Proof**. Assume $\exists x_0, 0 \le f(x_0) < f(0)$. Then $\forall x < 0, D(x_0) \subseteq D(x)$. But because $f(x_0) < f(0)$, then $-x_0 \in D(x_0)$. By the monotonicity of $f(x)$ when $x < 0$, $\forall x < 0, \nexists d < 0, d \in D(x)$. But because $\forall x < 0, \forall d \in D(x_0) \implies d \in D(x)$, this is a direct contradiction since $-x_0 < 0$. :Qed

Now we can prove the monotonicity of $f$.

::QaBox{type="a"}
Assume there $\exists 0 < x_1 < x_2, f(x_1) > f(x_2)$. Then $x_2 - x_1 \notin D(x_1)$. Because $\forall x < 0, f(x_1) < 0 < f(x)$. Therefore $\forall x < 0, D(x) \subseteq D(x_1)$. Fix an arbitrary $\epsilon > 0$. It is evident that $x_1 - x_2 - \epsilon < 0$, so $\forall d \in D(x_1 - x_2 - \epsilon), d \in D(x_1)$. Because of $f$'s monotonicity, $f(-\epsilon) > f(x_1 - x_2 - \epsilon)$ so $x_2 - x_1 \in D(x_1 - x_2 - \epsilon)$. This is a direct contradiction. :Qed
::