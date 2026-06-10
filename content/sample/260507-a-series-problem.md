---
title: A Series Problem
description: Gemini, give me an AP Calculus BC problem....
createTime: 2026-05-07
updateTime: 2026-05-07
---


One day a classmate of mine came up to me and gave me this problem:
:Pic{src="Screenshot 2026-05-07 at 17.16.32.webp" alt="So this is the original problem."}

Its a pretty simple series problem. However we were a bit bored and decided to tackle a more interesting version:

::QaBox
Given continuous function $f \in C^\infty$ that satisfies the following conditions:
$$
\begin{align*}
f(0) &= 0 \\
f'(0) &= 1 \\
\forall x \in \mathbb{R}, f''(x) + x f'(x) &= 0
\end{align*}
$$
Find the Maclaurin series expansion of $f(x)$.
::

> Well to be fair that is **not** something that you'll ever see on a AP Calculus BC exam, but nevertheless it is a fun problem to solve.

The first thing I did was to try figuring out some sort of pattern of the derivatives. Because we are trying to figure out the maclaurin expansion of $f$, we only actually need $f^{(n)}(0)$. Let's plug in $x = 0$ into the third property:

$$
f''(0) + 0 \times f'(0) = 0
$$

It's now trivial that $f''(0) = 0$. It seems like we're stuck because we don't have any information about the higher order derivatives. But we can actually find a recursive relation for the derivatives by differentiating the third property any arbitrary number of times. Let's differentiate the third property once:

$$
f^{(3)}(x) + f^{(1)}(x) + x f^{(2)}(x) = 0
$$

Twice:

$$
f^{(4)}(x) + 2 f^{(2)}(x) + x f^{(3)}(x) = 0
$$

We are starting to see a pattern: the term is consisted of three derivatives of $f$, and the order of the derivatives are $n + 2$, $n$, and $n + 1$ respectively. So we can write the recursive relation as:

$$
\forall n, x: f^{(n + 2)}(x) + n f^{(n)}(x) + x f^{(n + 1)}(x) = 0
$$

::Folding{title=Proof}
Base cases could be obtained from the prompt. 

**Inductive case**. Consider the formula
$$
f^{(n+2)}(x) + nf^{(n)}(x) + x f^{(n+1)}(x) = 0
$$

Taking the derivative of both side with respect to x:

$$
f^{(n + 3)}(x) + n f^{(n + 1)}(x) + x f^{(n + 2)}(x) + f^{(n + 1)}(x) = 0
$$

Reorganizing terms gives

$$
f^{((n + 1) + 2)}(x) + (n + 1) f^{(n + 1)}(x) + x f^{((n + 1) + 1)}(x) = 0
$$

:Qed
::

By plugging $x = 0$ into the equation we have:

$$
f^{(n + 2)}(0) + n f^{(n)}(0) = 0
$$

And this is a now a recurrence problem!

Looking closely at the recurrence a problem arises: the terms actually jump. That is, odd-numbered and even-numbered terms are independent of each other; for example, changing $f^{(1)}(0)$ will not effect the value of $f^{(6)}(0)$. A simple trick is to split the recurrence into two parts:

$$
f^{(n)}(0) =
\begin{cases}
a_{n/2} & n \equiv 0 \pmod 2 \\
b_{\lfloor n/2 \rfloor} & n \equiv 1 \pmod 2 \\
\end{cases}
$$

We've already solved the first few terms of our recurrence manually:

| Order ($n$) | Expression | Value |
| :--- | :--- | :--- |
| **0** | $f(0)$ | $0$ |
| **1** | $f'(0)$ | $1$ |
| **2** | $f''(0) = -0 \cdot f'(0)$ | $0$ |
| **3** | $f^{(3)}(0) = -1 \cdot f'(0)$ | $-1$ |

So we can write out the two recurrences as

$$
\begin{align*}
a_{n + 1} &= - 2 n a_n && a_0 = 0 \\
b_{n + 1} &= - (2n + 1) b_n && b_0 = 1 &&& b_1 = -1\\
\end{align*}
$$

Those are both pretty simple recurrences to solve.

$$
a_n = 0 \quad b_n = (-1)^n (2n - 1)!!
$$

Where $!!$ denotes double factorial:

$$
\begin{align*}
n!! &= (n - 2)!! \times n \\
-1!! &= 0!! = 1!! = 1
\end{align*}
$$

::NoteBox
Note that we have $b_1 = -1$. If this initial condition was not provided, our recurrence would have solved to $b_n = (-1)^n (2n + 1)!!$. Though small, this mistake actually tormented me for quite a bit.
::

There is this very annoying problem with $f^{(n)}(0)$ that only parts of its terms is actually contributing to the overall maclaurin series.

The solution? Recall another case we had this type of cyclic and disappearing derivative: $\sin$. What we did back then is define a counting over the set of numbers with a certain parity by with $n = 2k + 1$. In our case, only the odd-indexed terms are significant too, so we want a series of form:

$$
f_0(x) = \sum^\infty_{i = 0} \frac{f^{(2i + 1)}}{(2i + 1)!} x^{2i + 1}
$$

Plugging in everything we've got:

$$
\begin{align*}
f_0(x) &= \sum^\infty_{i = 0} \frac{f^{(2i + 1)}}{(2i + 1)!} x^{2i + 1} \\
&= \sum^\infty_{i=0} \frac{b_{\lfloor \frac{2i + 1}{2}\rfloor}}{(2i + 1)!} x^{2i + 1} \\ 
&= \sum^\infty_{i=0} \frac{b_i}{(2i + 1)!} x^{2i + 1} \\ 
&= \boxed{\sum^\infty_{i=0} \frac{(-1)^i (2i - 1)!!}{(2i + 1)!} x^{2i + 1}}
\end{align*}
$$

::NoteBox
In case anyone is wondering, this is actually the maclaurin series for the following non-elemantary function:
$$
f(x) = \int^x_0 e^{-t^2 / 2} \mathrm dt
$$
One of my classmates pointed out that there is a much neater solution to the whole problem: the differential equation provided in the prompt is actually a very simple ODE solvable using trivial integration.

:::Folding{title="Alternative Solution"}
Let $v = f'(x)$. Then
$$
v' + vx = 0
$$
This is a seperable ODE.
$$
\begin{align*}
\frac{\mathrm d}{\mathrm dx} v &= - v x \\
\int \mathrm dv &= - \int v x\ \mathrm dx \\
\int \frac{\mathrm dv}{v} &= \int - x\ \mathrm dx \\
\ln |v| &= -\frac{x^2}{2} + C \\
v &= C_1 e^{- \frac{x^2}{2}} \\
\end{align*}
$$

By plugging in the initial conditions we obtain the constant:

$$
v(0) = f'(0) = C_1 e^{- 0^2 / 2} = 1 \implies C_1 = 1
$$

This $v$ looks a lot like the gaussian integral and, yep to save your time, I'm going to tell you that this is not elementarily integratable.

$$
f(x) = \int^x_0 e^{- t^2 / 2} \mathrm dt
$$
:::
::