---
title: Integrating for Mech C - A Crash Course
description: TODO
createTime: 2026-04-15
updateTime: 2026-04-15
---

C in AP Mechanics C stands for <strike>Chaos</strike> Calculus.

::QuoteBox{source="CollegeBoard"}
...You should have taken calculus or be taking calculus at the same time as this course...
::

There are four main integrals mentioned in the official guide:

1. Work $\Delta E = \int_S |\mathbf{\vec F} \cdot \mathrm{d}\vec s|$
2. Impulse $\Delta P = \int^T_0 F \mathrm{d} t$
3. Kinematics $\Delta x = \iint^T_0 a \mathrm{d} t = \int^T_0 v \mathrm{d} t$
4. Rotational Inertia $I = \iiint_V r^2 \mathrm{d} m$

Out of the two non-numeric integrals, work is often integrated over linear paths with good enough kinematic context to allow the integral to degrade into a normal numeric one. However, rotational inertia integrates over the entirety of the object: no shortcuts, you must do multivariable calculus. 

The problem is that multivariable integration is pretty hard. Its not like the sinlge-variable case where you were given a nice and (most of the time) continuous subset of $\mathbb{R}$ to integrate over; constraints in multivariable calculus are often set of equations over the variables that does not seperate cleanly into nested integrals. Luckily, there are known methods to simplify most of those integrals into things we already know from calculus BC.

This guide would be a very brief guide on methods of multivariables integration primarily through the means of coordinate transformations.

## 0x00. Notations and Nomenclature

## 1x00. Coordinate Transformations

> This is heavy mathematics. If you just want a pragmatic overview of how to utilize coordinate transformations for physics problems, just flip to the next section.

### 1x01. What are Coordinate Transformation
An n-dimensional coordinate transformation is a continuous endofunction over $\mathbb{R}^n$. Basically its just a way to map a coordinate $(x_1, x_2, ..., x_n)$ to another coordinate system $(y_1, y_2, ..., y_n)$. We've already seen many transformations like this.

::ExampleBox
To convert a point from cartesian coordinates $(x, y)$ to polar coordinates $(r, \theta)$, we use the map
$$
\begin{bmatrix}
x \\
y
\end{bmatrix}
\mapsto
\begin{bmatrix}
\sqrt{x^2 + y^2} \\
\text{atan2}(y, x)
\end{bmatrix}
$$
where $\text{atan2}(y, x)$ is defined as
$$
\text{atan2}(y, x) = \begin{cases} \arctan\left(\frac{y}{x}\right) & x > 0 \\ \arctan\left(\frac{y}{x}\right) + \pi & x < 0,\ y \geq 0 \\ \arctan\left(\frac{y}{x}\right) - \pi & x < 0,\ y < 0 \\ +\frac{\pi}{2} & x = 0,\ y > 0 \\ -\frac{\pi}{2} & x = 0,\ y < 0 \\ \text{undefined} & x = 0,\ y = 0 \end{cases}
$$
which extends $\arctan(y/x)$ to all four quadrants, with output range $(-\pi, \pi]$. Note that the map is undefined at the origin $(0, 0)$, which is an inherent singularity of polar coordinates.

And to convert it back again,
$$
\begin{bmatrix}
r \\
\theta
\end{bmatrix}
\mapsto
\begin{bmatrix}
r \cos {\theta} \\
r \sin {\theta} \\
\end{bmatrix}
$$
Proof of continuity is left as an exercise to the reader.

We can visualize this transformation as a warping of grid:

:Pic{src="pol-cart-trans-1.gif"}

::

Since most such transformations we use in physics is in class $C^\infty$ (which meant that it is differentiable at any degree), it will allow us to conduct some pretty interesting observations on the transformation. For example, we can analyze a local portion of warped space at a specific point.

### 1x02. Differential Analysis

::WarningBox
For our purposes, we will not delve deep into the handling of singularities and holes in the function.
::

In single-variable calculus, a function $f : \mathbb R \to \mathbb R$ takes one input and spits out another. Most analytical functions we are interested in are differentiable over vast amount of their domain. We can reason about a single input $x$, and nudge the input by a slight amount $\mathrm d x$, and see how much the function changes from $f(x)$ to $f(x + \mathrm d x)$, and this change is denoted as $\mathrm d f$. These are known as **differential**, and are considered infinitesimals. 

> Infinitesimals are quantities so small or so big that they could only be compared to other infinitesimals. This is the core of Leibnizian Calculus. This helps with intuitive reasoning, but note that modern mathematicians have found formalizing differntials as operators are much cleaner and rigorous.

We can pack a multivariable function into a single arity one by a process known as **Tupling**. This meant packing all the variables into a tuple or vector, and thus making it a single variable function. Transformations introduced above has already utilized this thought, so we can now reason about multivariable functions as single-variables ones.

Let's try defining what the differential for a vector map is. Differentials are essentially how a variable change, and a vector is essentially a way of coupling multiple variables. So a natural generalization is to make the differential operator $\mathrm d$ distribute over vector components.

::TheoremBox{id="Naturality of the Exterior Derivative"}
The differential of a vector is given by:
$$
\mathrm{d} 
\begin{bmatrix}
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}

=

\begin{bmatrix}
\mathrm d x_1 \\ \mathrm d x_2 \\ \vdots \\ \mathrm d x_n
\end{bmatrix}
$$
::

Let's see what happens when we apply this principle to a function.

> Vector functions could also be seen as a vector of functions, each corresponding to one component in the output.

::ExampleBox
Let's take the map from polar coordinates to cartesian coordinates. We can decompose the function into
$$
f(\langle r, \theta \rangle) = 
\begin{bmatrix}
f_1(\langle r, \theta \rangle) \\
f_2(\langle r, \theta \rangle)
\end{bmatrix}
=
\begin{bmatrix}
\lambda \langle r, \theta \rangle. r \cos \theta \\
\lambda \langle r, \theta \rangle. r \sin \theta \\
\end{bmatrix}
$$
::

$$
\mathrm d f = \mathrm 
$$