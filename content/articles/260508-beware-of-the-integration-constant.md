---
title: Beware of the Integration Constant
description: Brainteasers that could ruin your AP.
createTime: 2026-05-08
updateTime: 2026-05-08
---

::QaBox
$$
I = \int \frac{x + 1}{x(x + 3)} \mathrm dx
$$
::

This is a fairly straightforward integration. Let $A$, $B$ be constants such that $\frac{A}{x} + \frac{B}{x+3} = \frac{x}{x (x + 3)}$. Therefore $A = \frac 13$ and $B = \frac 23$. Thus
$$
\begin{align*}
I &= \int \frac{\mathrm dx}{3x}  + \int \frac{2}{3x + 9} \mathrm dx \\
&\xRightarrow{u = 3x} \frac 13 \int \frac{1}{u} \mathrm du + \frac 23 \int \frac{1}{u + 9} \mathrm du \\
&= \frac 13 \ln |u| + \frac 23 \ln |u + 9| + C \\
&= \frac 13 \ln |3x| + \frac 23 \ln |3x + 9| + C
\end{align*}
$$
where $C$ is the integration constant. This seems consistent. However:

:Pic{src="Screenshot 2026-05-08 at 19.08.37.webp" alt="Where's our option?"}

Let's integrate again, but this time utilizing the linearity of integrals to extract the coefficients out first:

$$
\begin{align}
I &= \int \frac{\mathrm dx}{3x} + \int \frac{2}{3x + 9} \mathrm dx \\
&= \frac 13 \int \frac{1}{x} \mathrm dx + \frac 23 \int \frac{1}{x + 3} \mathrm dx \\
&= \frac 13 \ln |x| + \frac 23 \ln |x + 3| + C
\end{align}
$$

This time we do get a correct result. And the reason behind the two different integrals is simple: the two integration constants are **not** the same. The factor $3$ could actually be extracted out as a trailing constant term, which is absorbed by the integration constant.

$$
\begin{align*}
I = \frac 13 \ln |3x| + \frac 23 \ln |3x + 9| + C_1 &= \frac 13 \ln |x| + \frac 23 \ln |x + 3| + C_2 \\
\frac 13 (\ln 3 + \ln |x|) + \frac 23 (\ln 3 + \ln |x + 3|) + C_1 &= \frac 13 \ln |x| + \frac 23 \ln |x + 3| + C_2 \\
\frac 13 \ln 3 + \frac 13 \ln |x| + \frac 23 \ln 3 + \frac 23 \ln |x + 3| + C_1 &= \frac 13 \ln |x| + \frac 23 \ln |x + 3| + C_2 \\
\left( \frac 13 + \frac 23 \right) \ln 3 + C_1 &= C_2 \\
\boxed{\ln 3} + C_1 &= C_2
\end{align*}
$$

To be honest, the derivation is not mathematically intricate or anything. In fact, this is pre-calculus level algebra. The true idea I'd like to convey through this example is that many of us do not understand the integration constant as much as we think we do; most of the time, integration was a pure algebraic transformation; adding a constant term was more of a notational or procedural thing rather than an intuitive or living part of the math. However, the constant of integration is not just about considering the initial condition: it is an ensurance of correctness for all of our algebraic manipulations we use to do symbolic integration. 

Our methods of integration already assumed that indefinte integrals be only a proxy for any function whose derivative is the integrated function, thus the name **antiderivative**: no one fixes an actual value. By the second fundamental theorem of calculus, value of integrals are only meaningful when definite, that is, provided upper and lower bounds. Furthermore, the constant terms can only cancel each other out if the two indefinite integrals used to calculate the definite integral are integrated via the same algorithm.

For our example above, we cannot substitue the upper limit into $\frac{1}{3} \ln |x| + \frac 23 \ln|x + 3| + C_2$ and the lower limit into $\frac{1}{3} \ln |3x| + \frac 23 \ln |3x + 9| + C_1$ and hope that $C_1$ and $C_2$ cancel each other out.

::NoteBox
Note that according to the relation we derived earlier, we can actually use the two different antiderivatives to calculate a definite integral:
$$
\begin{align*}
I &= \int^a_b \frac{x + 1}{x(x + 3)} \\
& =\left.\frac{1}{3} \ln |3x| + \frac 23 \ln|3x + 9| + C_1 \right|_{x = a}  \\
&- \left.\frac{1}{3} \ln |x| + \frac 23 \ln|x + 3| + C_2 \right|_{x = b} \\
&= \left( \frac{1}{3} \ln |3a| + \frac{2}{3} \ln |3a + 9| + C_1 \right) - \left( \frac{1}{3} \ln |b| + \frac{2}{3} \ln |b + 3| + C_2 \right) \\
&= \left( \frac{1}{3} (\ln 3 + \ln |a|) + \frac{2}{3} (\ln 3 + \ln |a + 3|) + C_1 \right) - \left( \frac{1}{3} \ln |b| + \frac{2}{3} \ln |b + 3| + C_2 \right) \\
&= \left( \frac{1}{3} \ln |a| + \frac{2}{3} \ln |a + 3| + \ln 3 + C_1 \right) - \left( \frac{1}{3} \ln |b| + \frac{2}{3} \ln |b + 3| + C_2 \right) \\
&\text{Substituting } \ln 3 + C_1 = C_2: \\
&= \left( \frac{1}{3} \ln |a| + \frac{2}{3} \ln |a + 3| + C_2 \right) - \left( \frac{1}{3} \ln |b| + \frac{2}{3} \ln |b + 3| + C_2 \right) \\
&= \left. \frac{1}{3} \ln |x| + \frac{2}{3} \ln |x + 3| + C_2 \right|_b^a
\end{align*}
$$
Proof that this also equates to $\left. \frac 13 \ln |3x| + \frac 23 \ln |3x + 9| + C_1 \right|^a_b$ is trivial and left as an excercise to the reader.
    ::

Let's look at another practical example.
