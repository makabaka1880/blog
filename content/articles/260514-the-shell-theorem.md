---
title: The Shell Theorem
description: CollegeBoard finally decided to lash out at the Mech C students.
createTime: 2026-05-14
updateTime: 2026-05-14
---

::QaBox{type=question}
*(AP Mechanics C, 2026 Shanghai)* An object of mass $m_2$ is dropped into a spherical planet of mass $M$ and radius $R$, where $m_2 \ll M$. The magnitude of net gravitational force can be modeled as $F = - b y$, where $y$ is the distance of the object from the centroid of the planet. The object has velocity $v_c$ when $y = 0$, and $y = 0$ when $t = 0$. Derive an expression for $v(t)$, and derive an expression for $b$.
::

This is the first FRQ question of Shanghai's 26 AP Mech C exam. On first sight this is pretty trivial (and in fact it is), the ball is doing simple harmonic motion and some easy calculus gives $v = v_c \cos \left(\sqrt{\frac b m} t\right)$

::Folding{title="Derivation"}
Listing the differential equation:
$$
\begin{align*}
F &= m a \\
- b y &= m \ddot{y} \\
\end{align*}
$$
Guessing solution $y = A \sin (\omega t + \phi)$. Expanding $\ddot{y} = - A \omega^2 \sin(\omega t + \phi)$ gives
$$
\omega^2 = \frac bm \implies \omega = \sqrt \frac bm
$$
Therefore
$$
y = A \sin \sqrt{\frac bm} t + \phi
$$
Solving for initial conditions $\dot y(0) = v_c$ and $y(0) = 0$ gives us $A = v_c \sqrt{\frac mb}$ and $\phi = 0$. Therefore $\dot y = v_c \cos \sqrt{\frac bm} t$.
::
And $b$ can be obtained by setting $y = R$ and solving the equation $-b y = G$. 
::Folding{title="Derivation"}
$$
\begin{align*}
- b R &= - \frac{G M m}{R^2} \\
b &= - \frac{G M m}{R^3}
\end{align*}
$$
::

However, what if we tried to manually solve for $F$ instead of plugging in the model the exam gave us?

Let's start by Newton's law of universal gravity and turning it into the form of an integral.

$$
\begin{align*}
\mathbf G &= - \frac{G M m (\mathbf p_a - \mathbf p_b)}{\|\mathbf p_a - \mathbf p_b\|^3} \\
\mathrm d \mathbf G &= - \frac{G m (\mathbf p_a - \mathbf p_b)}{\|\mathbf p_a - \mathbf p_b\|^3} \mathrm d M \\
\iiint_\Omega \mathrm d \mathbf G &= - G m \iiint_\Omega \frac{\mathbf p_a - \mathbf p_b}{\|\mathbf p_a - \mathbf p_b\|^3} \mathrm d M \\
\end{align*}
$$

We integrate over each $p_a$ in $\Omega$ and fix $p_b = y \hat k$. For simplicity, let's just call each point $p = \langle p_x, p_y, p_z \rangle$.
$$
\begin{align*}
\mathbf G &= - G m \iiint_\Omega \frac{p_x \hat i + p_y \hat j + p_z \hat k - y \hat k}{\|\mathbf p - y \hat k\|^3} \mathrm d M \\
&= - G m \left(\iiint_\Omega \frac{p_x \hat i}{\|\mathbf p - y \hat k\|^3} \mathrm d M + \iiint_\Omega \frac{p_y \hat j}{\|\mathbf p - y \hat k\|^3} \mathrm d M + \iiint_\Omega \frac{p_z \hat k - y \hat k}{\|\mathbf p - y \hat k\|^3} \mathrm d M\right)\\
\end{align*}
$$
By the spherical symmetry of the planet $\Omega$, the first two integrations evaluates to $0$. Thus
$$
\begin{align*}
\mathbf G &= - G m \hat k \iiint_\Omega \frac{p_z - y}{\|\mathbf p - y \hat k \|^3} \mathrm d M \\
\|\mathbf G \| &= - G m \iint_\Omega\frac{p_z - y}{\|\mathbf p - y \hat k \|^3} \mathrm d M
\end{align*}
$$

We've simplified the original integral to a much cleaner expression. Because we're integrating for a sphere, its natural to switch over to spherical coordinates. 

Note that because we have the magnitude of $y \hat k$, $\mathbf p$ and the angle between them, we can use the cosine law to find the edge opposing them.

$$
\|\mathbf p - y \hat k\|^2 = \|\mathbf p\|^2 + y^2 - 2 \|\mathbf p\| y \cos \phi = r^2 + y^2 - 2 r y \cos \phi
$$

Plugging this term back into spherical coordinates:
$$
\begin{align*}
    |\mathbf{G}| = Gm \int_0^R \int_0^{2\pi} \int_0^{\pi} \frac{r\cos\phi - y}{\left(r^2 + y^2 - 2ry\cos\phi\right)^{3/2}} \,\rho\, r^2 \sin\phi \, d\phi \, d\theta \, dr
\end{align*}
$$
And everything now on is mechanical integration. We first use the substitution $u = r^2 + y^2 - 2 r y \cos \phi$, so $\mathrm d u = 2 r y \sin \phi\ \mathrm d \phi$:
$$
\begin{align*}
    |\mathbf{G}| &= Gm\rho \int_0^R \int_0^{2\pi} \int_0^{\pi} \frac{r^3 - y^2 r}{4y^2}\, u^{-3/2} - \frac{r}{4y^2}\, u^{-1/2} \, du \, d\theta \, dr \\
    &= Gm\rho \int_0^R \int_0^{2\pi} \left[-\frac{r^3 - y^2 r}{2y^2}\, u^{-1/2} - \frac{r}{2y^2}\, u^{1/2} \right]_{\phi=0}^{\phi=\pi} d\theta \, dr
\end{align*}
$$

This is a gigantic integral so let's precompute $u$ at the bounds:

$$
\begin{align*}
u[\phi := 0] = r^2 + y^2 - 2 r y \cos 0 = (r - y)^2     \implies u[\phi := 0]^{-1/2} = |r - y| \\
u[\phi := \pi] = r^2 + y^2 - 2 r y \cos \pi = (r + y)^2     \implies u[\phi := \pi]^{-1/2} = |r + y|
\end{align*}
$$

Note that our function is piecewise, so we have to consider the cases $r < y$ and $r \geq y$ seperately. By Fubini, because our integral converges, we can swap the order of integration and let $\|\mathbf G \| = - G m \rho \int^{2\pi}_0 I_1 + I_2\ \mathrm d \theta$, where $I_1$ and $I_2$ are the integrals of the two cases respectively.

$$
    \begin{align*}
    I_1 &= \int_0^y \left[-\frac{r^3 - y^2 r}{2y^2}\, u^{-1/2} - \frac{r}{2y^2}\, u^{1/2}\right]_{\phi=0}^{\phi=\pi} dr \\
    &= \int_0^y \left[-\frac{r^3 - y^2 r}{2y^2(r+y)} - \frac{r(r+y)}{2y^2}
    \right] - \left[ -\frac{r^3 - y^2 r}{2y^2(y-r)} - \frac{r(y-r)}{2y^2} \right] dr \\
    &= \int_0^y \left[-\frac{r(r-y)}{2y^2} - \frac{r(r+y)}{2y^2}\right]- \left[\frac{r(r+y)}{2y^2} - \frac{r(y-r)}{2y^2}\right] dr \\
    &= \int_0^y \frac{-4r^2}{2y^2} \, dr
    = -\frac{2}{y^2} \int_0^y r^2 \, dr
    = \left[ -\frac{2r^3}{3y^2} \right]_0^y
    = -\frac{2y}{3} \\[6pt]
    I_2 &= \int_y^R \left[-\frac{r^3 - y^2 r}{2y^2}\, u^{-1/2} - \frac{r}{2y^2}\, u^{1/2}\right]_{\phi=0}^{\phi=\pi} dr \\
    &= \int_y^R \left[-\frac{r^3 - y^2 r}{2y^2(r+y)} - \frac{r(r+y)}{2y^2}
    \right]- \left[-\frac{r^3 - y^2 r}{2y^2(r-y)} - \frac{r(r-y)}{2y^2}\right] dr \\
    &= \int_y^R \left[-\frac{r(r-y)}{2y^2} - \frac{r(r+y)}{2y^2}\right]- \left[-\frac{r(r+y)}{2y^2} - \frac{r(r-y)}{2y^2}
    \right] dr \\
    &= \int_y^R 0 \, dr = 0
    \end{align*}
$$

Putting everything together, we have

$$
    |\mathbf{G}|
    = Gm\rho \int_0^{2\pi} (I_1 + I_2) \, d\theta
    = -2\pi Gm\rho \cdot \frac{2y}{3}
    = -\frac{4}{3}\pi G m \rho y
    = -\boxed{\frac{G M m}{R^3}} y
$$
