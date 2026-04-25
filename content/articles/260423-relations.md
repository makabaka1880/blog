---
title: Relations
description: Chapter 7. Discrete Notes
createTime: 2026-04-23
updateTime: 2026-04-23
---

## 0x00. Matrix

::DefBox{id=Matrix}
A matrix with $n$ rows and $m$ columns is called a **$m \times n$ matrix** and is denoted as 
$$

A = \begin{pmatrix}
a_{1,1} & a_{1,2} & a_{1,3} & \dots  & a_{1,n} \\
a_{2,1} & a_{2,2} & a_{2,3} & \dots  & a_{2,n} \\
a_{3,1} & a_{3,2} & a_{3,3} & \dots  & a_{3,n} \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots  \\
a_{m,1} & a_{m,2} & a_{m,3} & \dots  & a_{m,n}
\end{pmatrix}

$$
::

Linear operations on matrices act elementwise.

$$
k \times \begin{pmatrix}
a_{1,1} & a_{1,2} & a_{1,3} & \dots  & a_{1,n} \\
a_{2,1} & a_{2,2} & a_{2,3} & \dots  & a_{2,n} \\
a_{3,1} & a_{3,2} & a_{3,3} & \dots  & a_{3,n} \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots  \\
a_{m,1} & a_{m,2} & a_{m,3} & \dots  & a_{m,n}
\end{pmatrix} = A = \begin{pmatrix}
k a_{1,1} & k a_{1,2} & k a_{1,3} & \dots  & k a_{1,n} \\
k a_{2,1} & k a_{2,2} & k a_{2,3} & \dots  & k a_{2,n} \\
k a_{3,1} & k a_{3,2} & k a_{3,3} & \dots  & k a_{3,n} \\
\vdots  & \vdots  & \vdots  & \ddots & \vdots  \\
k a_{m,1} & k a_{m,2} & k a_{m,3} & \dots  & k a_{m,n}
\end{pmatrix}
$$

There are multiple types of multiplications of matrices. The dot product of two matrices:

$$

C = \begin{pmatrix}
a_{1,1} & \dots & a_{1,n} \\
\vdots & \ddots & \vdots \\
a_{m,1} & \dots & a_{m,n}
\end{pmatrix}
\begin{pmatrix}
b_{1,1} & \dots & b_{1,p} \\
\vdots & \ddots & \vdots \\
b_{n,1} & \dots & b_{n,p}
\end{pmatrix} =
\begin{pmatrix}
c_{1,1} & \dots & c_{1,p} \\
\vdots & \ddots & \vdots \\
c_{m,1} & \dots & c_{m,p}
\end{pmatrix}

$$

Where

$$
c_{ij} = \sum^n_{r = 1} a_{i, r} b_{r, j} = a_{i, 1} b_{1, j} + a_{i, 2} b_{2, j} + a_{i, 3} b_{3, j}  ...
$$

::DefBox{id="Kronecker Symbol"}
The **Kronecker Matrix** is the matrix $(\delta_{ij})$ where each 
$$
\delta_{ij} = \begin{cases}
1\ \text{where } i = j \\
0\ \text{where } i \ne j \\
\end{cases}
$$
is called the **Kronecker Symbol**.
::

::DefBox{id="Transpose"}
The transpose of a matrix $A = (a_{ij})$ is $A^T = (a_{ji})$ (flipping the matrix along the diagonal).

Matrices that satisfy $A = A^T$ are known as **symmetric**. Those not are known as **antisymmetric**.
::

In discrete mathematics we are often interested in matrices encoding information other then numbers.

::DefBox{id="Zero-One Matrices"}
Matrices $A = (a_{ij})$ where all $a_{ij}$ is one or zero are known as **Zero-One Matrices**.
::

We define elementwise conjunction and disjunction as the **meet** and **join** of the matrix. For example, when $A = (a_{ij})$ and $B = (b_{ij})$:

$$
\begin{align*}
A \vee B &= (a_{ij} \vee b_{ij}) \quad &&\text{Join}\\
A \wedge B &= (a_{ij} \wedge b_{ij}) \quad &&\text{Meet}
\end{align*}
$$

The **Boolean Product** of two zero-one matrices is denoted as 

$$
A \odot B = (\bigvee^n_{r = 1} (a_{ir} \wedge b_{rj}))
$$

This is equivalent to the dot product, swapping disjunction for sums and conjunctions for products. Multiple boolean products of $A$ with itself is denoted with

$$
A^{[n]} = A \odot A \odot \dots \odot A
$$

::ExampleBox
Let 
$$
B = \begin{pmatrix}
0 & 0 & 1 \\
1 & 0 & 0\\
1 & 1 & 0
\end{pmatrix}
$$
Then
$$
B^{[2]} = \begin{pmatrix}
1 & 1 & 0 \\
0 & ..
\end{pmatrix}
$$
::


## 1x00. Relations
A relation is the generalization of predicate on set of pairs. That it, it takes two values and gives you a boolean value.

::DefBox{id=Relation}
Given sets $M$ and $N$. A **Relation** $R$ over sets $M$ and $N$ is a function
$$
R : M \times N \to \mathbb{B}
$$
It could also be interpreted as a subset of $M \times N$.
::

When $M = N$, we say that a relation $R \subseteq M \times N$ is a **relation over $M$**. For this special case:

- If $\forall a \in M, (a, a) \in R$, then we say $R$ is reflexive.
- If $\forall a, b \in M, (a, b) \implies R \to (b, a) \in R$, we say $R$ is symmetric.
- If $\forall a, b, c \in M, (a, b) \in R \land (b, c) \in R \implies (a, b) \in R$, we say $R$ is transitive.
- If $\forall a, b \in M, (a, b) \in R \land (b, a) \in R \implies a = b$, then we say $R$ is antisymmetric.

Relations are often expressed using infix operators. For example, the subset relation over all sets is normally interpreted as a predicate (a function that gives true or false given two sets) rather then a set of pair of sets.

::ExampleBox
The relation $\subseteq$ over the set of all sets is reflexive, because $A \subseteq A$ for any set $A$. It is transitive, because for any sets that satisfies $A \subseteq B$ and $B \subseteq C$, the fact $A \subseteq C$ is implied. 

It is not symmetric, though. It is antisymmetric because $A \subseteq B$ and $B \subseteq A$ implies $A = B$. In fact that's how set equivalence defined.
::

Predicates are functions. As like all functions, we can compose relations. Let $R_1 \subseteq M \times N$ and $R_2 \subseteq N \times P$. Then the composition is

$$
R_2 \circ R_1 = \{(m, p) \mid \exists n \in N, (m, n) \in R_1 \land (n, p) \in R_2\}
$$

Let $R : S^2$ be a relation on $S$. 

$$
\begin{align*}
R^1 &:= R \\
R^{n + 1} &:= R^{n} \circ R
\end{align*}
$$

::ExampleBox
Consider $R(a, b) \subseteq \mathbb N^2 := a > b$. Then 
$$
\begin{align*}
R^2 &= \{(a, c) \mid \exists b \in N, (a, b) \in R \land (b, c) \in R\} \\
&= \{(a, c) \mid \exists b \in N, a > b \land b > c \} \\
&= \{(a, c) \mid a > c + 1\}
\end{align*}
$$
::

::TheoremBox
Let $R$ be a relation on a set $M$. Then $R$ is transitive iff $R^n \subseteq R$.

::Folding{title="Proof"}

**(MP $\Rightarrow$)** We proceed by induction on $n$. The base case $n = 1$ is trivial.

**(MPR $\Leftarrow$)**
:Qed
::
::

## 2x00. Represetation of Relations

### 2x01. Matrices
Consider a relation $R \subseteq M \times N$, where

$$
\begin{align*}
M &:= \{m_1, m_2, \dots\} \\
N &:= \{n_1, n_2, \dots\}
\end{align*}
$$

Then $R$ can be represented as a matrix $(a_{ij})$ where

$$
a_{ij} = \begin{cases}
1 & \quad (m_i, n_j) \in R \\
0 & \quad \text{otherwise}
\end{cases}
$$

Trivially, 

$$
\begin{align*}
R_1 \cup R_1 &= R_1 \vee R_2 \\
R_1 \cap R_1 &= R_1 \wedge R_2 \\
\end{align*}
$$

::Folding{title=Proof}
:Qed
::

### 2x02. Digraphs
