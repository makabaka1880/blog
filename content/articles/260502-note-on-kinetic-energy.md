---
title: Notes on Kinetic Energy
description: Slight note before the AP exam
createTime: 2026-05-02
updateTime: 2026-05-02
---

We've all learned about the formula for the kinetic energy of a rolling rigid body:
$$
E = \frac{1}{2}mv^2 + \frac{1}{2}I\omega^2
$$
Where $v$ is the translational velocity of the axis of rotation. However this formula only applies to rigid bodies when the axis of rotation coincides with the center of mass or the first term is zero.

In general, the kinetic energy of a rolling rigid body is given by:
$$
\begin{align*}
E &= \frac{1}{2} \int_V \mathrm{d}m\ v^2 \\
&= \frac{1}{2} \int_V \mathrm{d}m\ |\mathbf{v_T} + \mathbf{v_R}|^2 \\
\end{align*}
$$

:Pic{src="Screenshot 2026-05-03 at 16.17.21.webp" alt="Velocity decomposition of a rolling rigid body"}

Here, we take the reference frame to be the center of mass of the rigid body. For simplicity let's consider the translational dynamics of the axis of rotation. Here, $\mathbf{v_R}$ is the linear velocity of the point on the rigid body due to rotation, and $\mathbf{v_T}$ is the translational velocity of the axis of rotation. We can expand the square term as follows:

$$
\begin{align*}
E &= \frac{1}{2} \int_V \mathrm{d}m (|\mathbf{v_T}|^2 + |\mathbf{v_R}|^2 + 2\mathbf{v_T} \cdot \mathbf{v_R}) \\
&= \underbrace{\frac{1}{2} \int_V \mathrm{d}m\ |\mathbf{v_T}|^2}_{J_1} + \underbrace{\frac{1}{2} \int_V \mathrm{d}m\ |\mathbf{v_R}|^2}_{J_2} + \underbrace{\int_V \mathrm{d}m\ \mathbf{v_T} \cdot \mathbf{v_R}}_{J_3} \\
\end{align*}
$$

Let's take a look at each of those terms.

$$
J_1 = \frac{1}{2} \int_V \mathrm{d}m\ |\mathbf{v_T}|^2 = \frac{1}{2}mv^2
$$

Because $\mathrm{d}m$ and $\mathbf{v_T}$ are all constants, we can pull them out of the integral. This becomes the familiar term.

$$
J_2 = \frac{1}{2} \int_V \mathrm{d}m\ |\mathbf{v_R}|^2 = \frac{1}{2} \int_V \mathbf{r}^2 \omega^2 \mathrm{d}m = \frac{1}{2} \omega^2 \int_V \mathbf{r}^2 \mathrm{d}m = \frac{1}{2}I\omega^2
$$

The second term is also familiar. We can pull $\omega^2$ out of the integral because it is a constant. The remaining integral is the definition of the moment of inertia.

What remains is this weird cross term that couples translational and rotational motion. Let's take a closer look.  

 In 2D, $\mathbf{v}_R = \omega R_{90} \mathbf{r}$ because $\mathbf{v}_R \perp \mathbf{r}$. Then  

$$
J_3 = \int \mathbf{v}_T \cdot (\omega R_{90}\mathbf{r}) \, dm = \omega \int \mathbf{v}_T \cdot (R_{90}\mathbf{r}) \, dm.
$$

Using $\mathbf{v}_T \cdot (R_{90}\mathbf{r}) = (R_{90}^T \mathbf{v}_T) \cdot \mathbf{r}$ and $R_{90}^T = R_{-90}$,
$$
J_3 = \omega \int (R_{-90}\mathbf{v}_T) \cdot \mathbf{r} \, dm = \omega (R_{-90}\mathbf{v}_T) \cdot \int \mathbf{r} \, dm.
$$
Since we chose the reference point as the center of mass, $\int \mathbf{r} \, dm = 0$. Hence $J_3 = 0$, and the cross term vanishes.