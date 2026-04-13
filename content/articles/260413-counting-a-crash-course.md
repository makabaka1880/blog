---
title: Counting - A Crash Course
description: Midterm Review
createTime: 2026-04-13
updateTime: 2026-04-13
---

We had a tough half-semester in Discrete Mathematics. Here's a compilation of everything we learned — sets, maps, cardinality, and the surprisingly deep rabbit holes that come with them. Grab a coffee, and let's get through this together.

> OK That introduction is written by claude but you get the idea. The <strike>end</strike> midterms is near, and I hope this guide at least help you in one way or another. I included problems midways to help you with reviewing.

## 0x00. Notation and Nomenclature

**Class** is just a fancy word for collection of objects. The reason we didn't use sets is because sets are strictly formalized objects that has too many nuances that it is pretty annoying to simply use them as a collection of object.

**Families** are often used to describe a collection of collections because a class of class or a set of set sounds pretty wierd and semantically accurate in most of our cases. They are often in cursive font.

**A family indexed by xxx** is just a function. For example, the grade cohort is just a family of homerooms indexed by their room number, which could also be expressed as a bijection between the space of room numbers and homerooms. The reason we don't use function here is because they emphasize structure and interpretation and preserve identity, not just mapping.

**Identity map** is a function $\lambda x. x$ that maps everything to itself. Over the real numbers, its the linear function $f(x) = x$.


I'll be defining functions with various syntaxes through the text.

| Syntax | Example ($\mathbb{R} \to \mathbb{R}^+_0$) |
| - | - |
| Standard |  $f(x) = x^2$ |
| Lambda Calculus | $f := \lambda x : \mathbb{R}. x^2$
| Mapsto | $f := x \mapsto x^2$ |

## 1x00. Basics to Counting
### 1x01. Maps

Counting often refer to ways to transform things. The standard way to transform things in math is using **functions** or maps. There are certain classes of maps that posseses nice qualities that we would like to investigate and build on.

::DefBox{id="Injection"}
A map $f : A \to B$ is said to be **injective** if
$$ 
\forall a, b \in A, f(a) = f(b) \implies a = b
$$
The map $f$ is said to be an **injection**. The notation $f : A \hookrightarrow B$ is commonly used to indicate that $f$ is injective.
::
::DefBox{id="Surjection"}
A map $f : A \to B$ is said to be **surjective** if
$$
\forall b \in B, \exists a \in A, f(a) = b
$$
The map $f$ is said to be a **surjection**. The notation $f : A \twoheadrightarrow B$ is commonly used to indicate that $f$ is surjective.
::

For example, $\lambda x: \mathbb{R}. \sqrt{x}$ is injective, but not surjective. This is because there is no way that the arithmetic square root of a real number is negative, which means $\forall n \in (-\infty, 0), \nexists a \in \mathbb{R}, f(a) = n$.

::NoteBox
Injections are also known as **one-to-one** functions. You can think of injections of functions that has unique outputs, because you can relate the input with the output uniquely.

Surjections are also known as **onto** functions. You can think of surjections as maps that covers the entire range because for every point in the range you can find a preimage that maps to it.
::

::DefBox{id="Bijection"}
A map $f : A \to B$ is considered **bijective** if it is both <mark>injective</mark> and <mark>surjective</mark>. The notation $f : A \leftrightarrow B$ indicates that $f$ is a bijection.
::

For example, the identity map over reals $\lambda x: \mathbb{R}. x$ is bijective, because it is both *injective* (everything gets mapped to itself so images are unique) and *surjective* (every real number is mapped so every real number is mapped to.)

::Mcq
---
options:
    - "1. Surjective"
    - "2. Injective"
    - "3. Bijection"
    - "4. None"
correct: 4
---

#prompt

Select property of the following map:

$$
f : \mathbb{R} \to \mathbb{R} \\
f(x) = x^2
$$

#explanation
For any $x \in (-\infty, 0), f(x) = f(-x)$. Therefore $f$ is not injective.

There does not exist $n$, s.t. $f(n) < 0$. Therefore $f$ is not surjective either.
::

### 1x02. Cardinality and Counting
Let's move on to what counting actually refers to.

::DefBox{id="Counting"}
**Counting** refers to finding a bijection of an arbitrary set $M$ to a subset $S \subseteq \mathbb{N}$ of the natural numbers. Simply put, it is to construct a way to label numbers in a set with indices. This bijection is called an **enumeration** of $M$.

Specifically, $S$ should be a **von Neumann ordinal**, which means that $S = \{0, 1, \ldots, n-1\}$ for some $n \in \mathbb{N}$ -- i.e., $S$ is itself the set of all natural numbers strictly less than $n$. This ensures the labeling is **canonical and well-ordered**, with no gaps.

A set is **countable** if it is possible to count the set.
::

Counting also allow us to formalize the size of a set into **cardinality**

::DefBox{id=Cardinality}
Consider a countable set $M$ with ordinal ${0, 1, 2, ... n - 1}$. Then the **cardinal** of $M$ is $n$.

The cardinality of a set is denoted as $|M|$ or $\mathrm{card}\ M$.
::

Let's look at a simple example. 


::ExampleBox
Let $M = \{\text{a}, \text{b}, \text{c}\}$. We count $M$ by constructing the bijection:

$$
f : M \leftrightarrow \{0, 1, 2\}, \quad f(\text{a}) = 0,\ f(\text{b}) = 1,\ f(\text{c}) = 2
$$


The set $\{0, 1, 2\}$ is the von Neumann ordinal $3$, so $|M| = 3$.
::

Notice that the bijection $f$ is not unique — we could equally well have mapped $\text{b} \mapsto 0$. Counting tells us the **size** of the set, but not a canonical ordering of its elements. The cardinality $|M|$ is the invariant that all such bijections agree on.


Let's do a much harder one.

::Qabox{type=question}
Construct the binary alphabet
$$
\Sigma := \{0, 1\}
$$
Count the set of bit strings $\Sigma^* = {\lambda, 0, 1, 00, 01, 010, ...}$.
::

Let's access the problem. It is immediately obvious that there should be a connection from bit strings to binary representation of numbers, but it might not be obvious how to implement this connection. 

The key insight is that binary numbers and bit strings are almost the same thing -- but binary numbers drop leading zeros, making 01 and 1 the same number, while strings treat them as distinct. We need a bijection that preserves leading zeros. 

> Try to construct one yourself. It is pretty elegant.

::SpoilerBox
The key is prepending a 1 to every bit string. 

$$
\lambda \mapsto \textcolor{green}{1} \\
0 \mapsto \textcolor{green}{1}0 \\
1 \mapsto \textcolor{green}{1}1 \\
00 \mapsto \textcolor{green}{1}00 \\
01 \mapsto \textcolor{green}{1}01 \\
...
$$

This immediately justifies the existences of leading zeros, as they are now an actual part of the number. The rest of the bijection is much easier to construct.
::

Note that in this case we cannot find a specific cardinal number because the ordinal just doesn't end. For any $n$ in the ordinal, the next lexicographically larger bitstring then the one corresponding to $n$ is mapped to $n + 1$. Set like $\Sigma^*$ is given a special cardinal called $\aleph_0$ (Aleph 0). Sets with cardinal $\aleph_0$

> Mathematicians even named an ordinal $\omega$ for sets with cardinal $\aleph_0$. Its just the set of natural numbers $\mathbb{N}$ but it carries a different semantic significance.

::Folding{title="Extension - The First Uncountable Ordinal"}
The set of all countable ordinals is uncountable. That might seem paradoxical at first, but its actually well justified.

We denote $\omega_1$ as the set of all countable ordinals.

The proof is by contradiction. Suppose $\omega_1$ were countable, so there exists a bijection:

$$
f : \mathbb{N} \leftrightarrow \omega_1
$$

But then $\omega_1$ would itself be a countable ordinal -- and since $\omega_1$ is the set of *all* countable ordinals, we'd have:

$$
\omega_1 \in \omega_1
$$

which violates the **axiom of foundation** (no set can contain itself). Contradiction. $\square$
::

::Mcq
---
options:
    - "1. $|\\mathbb{N}| < |\\mathbb{Z}|$"
    - "2. $|\\mathbb{N}| = |\\mathbb{Z}|$"
    - "3. $|\\mathbb{N}| > |\\mathbb{Z}|$"
    - "4. The cardinalities are not comparable"
correct: 2
---
#prompt
Which of the following is true about the cardinalities of $\mathbb{N}$ and $\mathbb{Z}$?

#explanation
Although $\mathbb{Z}$ contains negative numbers and thus *looks* larger, both sets are countably infinite with cardinal $\aleph_0$. The bijection $f : \mathbb{N} \leftrightarrow \mathbb{Z}$ can be constructed by interleaving:
$$
f(n) = \begin{cases} n/2 & \text{if } n \text{ is even} \\ -(n+1)/2 & \text{if } n \text{ is odd} \end{cases}
$$
mapping $0 \mapsto 0,\ 1 \mapsto -1,\ 2 \mapsto 1,\ 3 \mapsto -2,\ \ldots$, which is a valid bijection. Therefore $|\mathbb{N}| = |\mathbb{Z}| = \aleph_0$.
::

There is also this corollary that is left to the reader as an excercise to prove.

::Qabox{type=question}
If $f : M \leftrightarrow N$ is bijective, $|M| = |N|$.
::

### 1x03. Pigeonhole Principle

The pigeonhole is a simple but surprisingly important theorem that could help in many kinds of counting problems.

::TheoremBox{id="Pigeonhole Principle"}
Let $M$, $N$ be finite sets and $f: M \to N$ surjective. Then $f$ is injective iff $|M| = |N|$.

:::Folding{title="Proof"}

($\Rightarrow$) Assume $f$ is injective. Since $f$ is already surjective by hypothesis, $f$ is bijective. A bijection between finite sets preserves cardinality, hence $|M| = |N|$.

($\Leftarrow$) Assume $|M| = |N| = n$ for some $n \in \mathbb{N}$. Suppose, for contradiction, that $f$ is not injective. Then there exist distinct $x, y \in M$ with $f(x) = f(y)$. Because $f$ is surjective, every $b \in N$ has at least one preimage. Consider the preimage sizes: define $p(b) = |f^{-1}(\{b\})|$, the number of elements of $M$ mapping to $b$. Since $f$ is surjective, $p(b) \ge 1$ for all $b \in N$. Moreover, $\sum_{b \in N} p(b) = |M| = n$. If $f$ is not injective, then at least one $b_0 \in N$ has $p(b_0) \ge 2$. Then

$$
\sum_{b \in N} p(b) \ge 2 + \underbrace{1 + \cdots + 1}_{n-1 \text{ terms}} = n+1 > n,
$$

contradicting $\sum_{b \in N} p(b) = n$. Hence $f$ must be injective. $\square$
:::
::

At first glance this looks absolutely useless. However, the pigeonhole principle is actually a very deep principle theorem about the fundamental structure of finite set. Let's try using the theorem:

::McqMultiple
---
options:
    - "1. $f$ is surjective but not necessarily injective"
    - "2. $g$ is injective but not necessarily surjective"
    - "3. $f$ and $g$ are both bijections"
    - "4. $g \\circ f = \\mathrm{id}_M$ implies $f \\circ g = \\mathrm{id}_N$"
correct: 
    - 3
    - 4
---

#prompt
Let $\mathrm{id}_N : N \leftrightarrow N$ be the identity bijection map such that $\mathrm{id}_N(n) = n$ for all $n \in N$.

Let $f: M \to N$ and $g: N \to M$ be functions between finite sets with $|M| = |N| = n$. Suppose $g \circ f = \text{id}_M$. Which is true?

#explanation

$g \circ f = \mathrm{id}_M$ implies $f$ is injective (if $f(x) = f(y)$, then $x = g(f(x)) = g(f(y)) = y$) and $g$ is surjective (every $m \in M$ is hit by $g(f(m))$).

Since $|M| = |N|$, by the Pigeonhole Principle:
- $f$ injective $\implies$ $f$ bijective
- $g$ surjective $\implies$ $g$ bijective

Hence **3** holds. Since $g$ is bijective, $g^{-1}$ exists and equals $f$ (as $g \circ f = \mathrm{id}_M$ and $g$ is a bijection forces $f = g^{-1}$). Therefore $f \circ g = g^{-1} \circ g = \mathrm{id}_N$, so **4** holds.

Options 1 and 2 are false: $f$ *is* injective (shown above), and $g$ *is* surjective — but both are actually fully bijective, making the "not necessarily" clauses wrong.
::

::WarningBox
The pigeonhole principle only holds for **finite sets!**
::ExampleBox
Consider the map $f : \mathbb{N} \twoheadrightarrow \mathbb{N} := n \mapsto \lfloor n / 2 \rfloor$. This is clearly surjective — every $m \in \mathbb{N}$ is hit by $2m$ — yet it is **not** injective, since $f(2k) = f(2k+1) = k$.

In a finite set, a surjection $f : A \twoheadrightarrow A$ forces injectivity. Here it does not.
::
::

The original pigeonhole principle tells us surjections between equal-cardinality 
sets must be bijections. But what happens when $|M| > |N|$?

::CorollaryBox{id="Extended Pigeonhole Principle"}
Consider a surjective map $f : N \twoheadrightarrow M$. If $|M| > |N|$, $f$ cannot be injective.
:::Folding{title="Proof"}
If $f$ is injective then $f$ is bijective. Therefore, $|M| > |N|$. Contradiction. $\square$
:::
::

We can't have injectivity at all -- but we can say *how badly* it fails.

::CorollaryBox{id="Extended Pigeonhole Principle"}
Let $M$, $N$ be finite sets and $f: M \twoheadrightarrow N$ surjective with $|M| = m$ and 
$|N| = n$. Then there exists $b \in N$ such that $|f^{-1}(\{b\})| \ge \lceil m/n \rceil$.
:::Folding{title="Proof"}
Suppose for contradiction that $|f^{-1}(\{b\})| < \lceil m/n \rceil$ for all 
$b \in N$, i.e. $p(b) \le \lceil m/n \rceil - 1$ for all $b \in N$. Then
$$
\sum_{b \in N} p(b) \le n \cdot (\lceil m/n \rceil - 1) < n \cdot \frac{m}{n} = m,
$$
contradicting $\sum_{b \in N} p(b) = |M| = m$. $\square$
:::
::

The special case $|M| = |N| + 1$ is sometimes called the **Drawer Principle** (嗯对抽屉原理) -- guaranteeing some drawer holds at least 2 items. This is the version most people intuitively know: 13 socks into 12 drawers, some drawer has $\ge 2$.

::Mcq
---
options:
    - "1. $3$"
    - "2. $4$"
    - "3. $5$"
    - "4. $6$"
correct: 2
---
#prompt
$25$ objects are distributed into $7$ drawers. What is the minimum value of $k$ such that **at least one drawer is guaranteed** to contain $k$ or more objects?
#explanation
By the extended pigeonhole principle, distributing $m$ objects into $n$ drawers guarantees at least one drawer contains at least:
$$
\left\lceil \frac{m}{n} \right\rceil = \left\lceil \frac{25}{7} \right\rceil = \left\lceil 3.57\ldots \right\rceil = 4
$$
To see why $3$ is not sufficient: the maximum configuration with $3$ objects in each box is $3 \times 7 = 21$ objects — so $3$ per drawers is not possible. But no matter how you distribute, at least one drawer must have $\geq 4$ objects.
::

Let's see another textbook example of the Pigeonhole principle.

::Qabox
Let $n \in \mathbb{Z}^+$. Proof that there exists a multiple of $n$ such that its decimal expansions only contain $1$ and $0$.
::

We went over this in class but I here provide an more explicit proof completing the ommited steps.

::SpoilerBox
This is very hard to construct, but the key is the set 
$$
M = \{1, 11, ..., \underbrace{11...11}_{n + 1\text{ times}}\}
$$
And the map 
$$
f : M \twoheadrightarrow \{0, ..., n - 1\} := x \mapsto x\ \mathrm{mod}\ n
$$

Since $|M| > |\{0, ..., n - 1\}|$, $f$ is surjective. And by the pigeonhole principle, there will be at least one element of $f$'s range that has two preimages (composed of $t_1$ 1's and $t_2$ 1's). Denote them as 
$$
k_1 = a n + z = \sum^{t_1}_{i = 0} 10^i\\
k_2 = b n + z = \sum^{t_2}_{i = 0} 10^i
$$
Assuming $k_1 > k_2$.
And a simple number theoretical argument yields
$$
\begin{align*}
k_1 - k_2 &= \sum^{t_1}_{i = 0} 10^i - \sum^{t_2}_{i = 0} 10^i \\
&= \sum^{t_1}_{i = t_2 + 1} 10^i \\
a n + z - b n - z &= \sum^{t_1}_{i = t_2 + 1} 10^i  \\
(a - b) n &= \underbrace{11..11}_{t_1 - t_2} \overbrace{00.00}^{t_2}
\end{align*}
$$
Because $(a - b) n$ has a factor $n$, it is a multiple of $n$. $\square$
::

::Folding{title="Bonus"}
::Qabox{type="question"}
If there are $n$ ($n \geq 3$) people who has each dated each other, prove that not every one is straight.
::

::SpoilerBox
Construct the map $f$ from people to gender. By the pigeonhole principle ($n \geq 3 > 2$) there must be at least two people of the same gender. Since they dated each other, neither one of them is straight. $\square$
::
::

### 1x04. Ramsey theory
Ramsey theory is the theory around how patterns emerge from structures. Actually the core is all about a special function called the family of **Ramsey Number**.

Consider a party of $n$ friends. Now we want to find the minimal $n$ to guarantee one of the following:

1. There are $a$ people who are mutual friends (friends with each others)
2. There are $b$ people who are not friends with each other

The Ramsey number $R(a, b)$ is this $\min n$.

::DefBox{id="Ramsey Numbers"}
Let $K_n$ be a complete graph over $n$ vertices. We define a **2-coloring** of $K_n$ to be a boolean function mapping to {`Red`, `Blue`} over $K_n$'s edge set.

The **Ramsey Number** $R(a, b)$ is the smallest integer $n$ such that for all possible 2-colorings of $K_n$ there exists one of the following:

1. A subgraph with $a$ vertices of $K_n$ s.t. every edge is colored with `Red`
2. A subgraph with $b$ vertices of $K_n$ s.t. every edge is colored with `Blue`
::

> This type of complete subgraphs where all the edges are colored the same is called a **monochromatic clique**, or in our context, clique for short. So the Ramsey number $R(a, b)$ is the smallest $n$ such that any 2-coloring of $K_n$ contains either a red clique of size $a$ or a blue clique of size $b$.

> An important and apparent property of $R$ is that it is monotonic with respect to $a$ and $b$.

Ramsey theory could be used to prove things that are pretty interesting.

::Folding{title="Extension - A Naïve Ramsey Search Algorithm"}
Calculation of the ramsey number has been a notoriously hard problem in combinatorics. The only known way to calculate it is by brute-force search, which is pretty much impossible for large $a$ and $b$. For example, $R(4, 4)$ is the biggest Ramsey number in the form $R(a, a)$ that has been calculated, and it is already $18$. To understand why it is so hard, let's derive the brute force approach's asymptotic behaviour.

A complete graph of $n$ vertices has $n^2$ edges. Since each edge can be colored in 2 ways, there are $2^{n^2}$ possible 2-colorings of $K_n$. For each coloring, we need to check if there is a monochromatic clique of size $a$ for either color. There are $\binom{n}{a}$ subsets of vertices of size $a$. Therefore, the total time complexity of the brute-force approach is $O(\binom{n}{a} \times 2^{n^2}) = O(2^{n^2})$, which is astronomically large even for small values of $n$. 

Here's a simple implementation

```haskell
import Data.List (subsequences)

isClique :: [(Int, Int)] -> [Int] -> Bool
isClique edges nodes = 
    all (`elem` edges) [(u, v) | u <- nodes, v <- nodes, u < v]

isIndependent :: [(Int, Int)] -> [Int] -> Bool
isIndependent edges nodes = 
    not (any (`elem` edges) [(u, v) | u <- nodes, v <- nodes, u < v])

hasProperty :: Int -> Int -> Int -> Bool
hasProperty n r s = all containsStructure allPossibleEdges
    where
        nodes = [1..n]
        completeEdges = [(u, v) | u <- nodes, v <- nodes, u < v]
        allPossibleEdges = subsequences completeEdges
        subsetsR = [sub | sub <- subsequences nodes, length sub == r]
        subsetsS = [sub | sub <- subsequences nodes, length sub == s]
        
        containsStructure edges = 
            any (isClique edges) subsetsR || any (isIndependent edges) subsetsS

R :: Int -> Int -> Int
R r s = head [n | n <- [1..], hasProperty n r s]
```
::

::Mcq
---
options:
    - "1. 1"
    - "2. 3"
    - "3. 5"
    - "4. 7"
correct: 2
---

#prompt
Assume a party where everyone are either friends or enemies. What is the minimum number of people required to guarantee that there are either 3 mutual friends or 2 mutual enemies?

#explanation
::
This is asking for $R(3, 2)$, the smallest $n$ such that any 2-coloring of $K_n$ contains either a red clique of size 3 or a blue clique of size 2. Direct computation shows $R(3, 2) = 3$.

::NoteBox
Using the naïve algorithm given above would take millions of years only to calculate $R(3, 5)$. Statistician Erdös had famously stated that 

::QuoteBox{source="Paul Erdös"}
Suppose aliens invade the earth and threaten to obliterate it in a year's time unless human beings can find the Ramsey number $R(5,5)$. We could marshal the world's best minds and fastest computers, and within a year we could probably find the value.

But if the aliens demanded the Ramsey number $R(6,6)$, we would have no choice but to strike first.
::

Here's a lookup table for common $R$ numbers.

| a\b | 3 | 4 | 5 | 6 | 7 |
|-----|---|---|---|---|---|
| 3 | 6 | 9 | 14 | 18 | 23 |
| 4 | 9 | 18 | 25 | 35 - 41 | 49 - 61 |
| 5 | 14 | 25 | 43 - 48 | 58 - 87 | 80 - 143 |
::

## 2x00. Combinatorics

Combinatorics is a branch of mathematics built on top of counting. It is the study of how to count and enumerate combinatorial objects, such as permutations, combinations, partitions, and so on.

### 2x01. Permutations

Permutation one of the most fundamental combinatorial objects. It is a way to count the number of ways to arrange a set of objects in a specific order.

::DefBox{id="Permutation"}
Let $\{x_1, .., x_n\}$ be a set of $n$ distinguishable elements ($x_k \neq x_j$ for $k \neq j$). Then an injective map
$$
\pi : \{x_1, .., x_n\} \hookrightarrow \{1, 2, ..., n\}
$$
is called a **permutation** of $\{x_1, .., x_n\}$.

By the pigeonhole principle, a permutation is actually a bijection, so we can also write $\pi : \{x_1, .., x_n\} \leftrightarrow \{1, 2, ..., n\}$.
::

Intuitively, it is just a way to label each element of the set with a unique index from $1$ to $n$.

The number of permutations of a set of $n$ elements can be derived quite beautifully. Let's denote the number of permutations for $M$ the shorthand $|\{\pi(M)\}|$. We will later justify this notation.

Consider a set $|{x_n}| = N$. Take the first element $x_1$, and the set can be denoted as 

$$
x_1 \cup M' = \{x_n\}
$$

It is trivial that there is $N$ ways to label $x_1$. By simple counting, there is $N \times |M'|$ ways to label $x_1$ and $M'$ together. By expanding this expression, a pattern emerges:

$$
\begin{align*}
|\{\pi(M)\}| &= N \times |M'| \\
    &= N \times (N - 1) \times |M''| \\
    &= N \times (N - 1) \times (N - 2) \times |M'''| \\
    &\vdots \\
    &= N \times (N - 1) \times (N - 2) \times \cdots \times 1 \\
\end{align*}
$$

This is exactly the recursive definition of the factorial function, so we have $|\{\pi(M)\}| = N!$.

::LemmaBox{id="Permutation Counting"}
The number of permutations of a set with distinguishable elements of cardinality $N$ is $N!$
::

We often denote $\pi$ as a non-square matrix like this:

$$
\pi = \begin{pmatrix}
x_1 & x_2 & \cdots & x_n \\
\pi(x_1) & \pi(x_2) & \cdots & \pi(x_n)
\end{pmatrix}
$$

And sometimes even more simply as a **tuple** (an generalization of ordered pairs)
$$
\pi = (\pi(x_1), \pi(x_2), ..., \pi(x_n ))
$$

::ExampleBox
Consider the set of $3$ objects, $\{1, 2, 3\}$. The permutations of this set are:
$$
\begin{pmatrix}
1 & 2 & 3 \\
1 & 2 & 3
\end{pmatrix} \quad
\begin{pmatrix}
1 & 2 & 3 \\
1 & 3 & 2
\end{pmatrix} \quad
\begin{pmatrix}
1 & 2 & 3 \\
2 & 1 & 3
\end{pmatrix}
$$
$$
\begin{pmatrix}
1 & 2 & 3 \\
2 & 3 & 1
\end{pmatrix} \quad
\begin{pmatrix}
1 & 2 & 3 \\
3 & 1 & 2
\end{pmatrix} \quad
\begin{pmatrix}
1 & 2 & 3 \\
3 & 2 & 1
\end{pmatrix}
$$
In a more concise fashion:
$$
\begin{align*}
\{\pi\} &= \{(1, 2, 3), (1, 3, 2), (2, 1, 3), \\
    &(2, 3, 1), (3, 1, 2), (3, 2, 1)\}
\end{align*}
::

Sometimes we wish to select a certain number of elements from a set and permute them. This is called a **$r$-permutation**.

::DefBox{id="R-Permutation"}
Let $M$ be a set of $N$ distinguishable elements. An **$r$-permutation** of $M$ is an injective map
$$
\pi : \{x_1, .., x_r\} \hookrightarrow S
$$
where $r \le N$, $S \subseteq M$ and $|S| = r$.

Similarly, such permutatino is also a bijection.
::

We similar inductive derivation could be made to count the number of $r$-permutations.

::HintBox
A common way to express a product from $N$ to $M$ in combinatorics is
$$
\begin{align*}
\prod^M_{i = N} i &= M \times (M - 1) \times \cdots \times N \\
&= \frac{M \times (M - 1) \times \cdots \times 1}{(N - 1) \times (N - 2) \times \cdots \times 1} = \frac{M!}{(N - 1)!}
\end{align*}
$$
::

::SpoilerBox
We start with the same inductive pattern matching on the set $M$ as before, but this time we stop at $r$ instead of $N$:
$$
\begin{align*}
&|\{\pi(M)\}|  \\
=\ & N \times |M'| &&r - 1 \text{ left}\\
    =&\ N \times (N - 1) \times |M''| &&r - 2 \text{ left}\\
    =&\ N \times (N - 1) \times (N - 2) \times |M'''| &&r - 3 \text{ left}\\
    &\vdots &&\vdots \\
    =&\ N \times (N - 1) \times (N - 2) \times \cdots \times (N - r + 1) &&1 \text{ left}\\
    =&\ N \times (N - 1) \times (N - 2) \times \cdots \times (N - r + 1) \times 1 \\
    =&\ \frac{N!}{(N - r)!}
\end{align*}
$$
::

This enumeration is so commonly used it is given a dedicated function.

::DefBox{id="Permutation Enumeration Function"}
The **Permutation Enumeration Function** is the function $P^n_k$ denoting the cardinality of $k$-permutations on a set of cardinality $n$.
$$
P^n_k = \frac{n!}{(n - k)!}
$$
::

A simple example would be.

::ExampleBox
Consider the set of $3$ objects $\{1, 2, 3\}$. Then all the **2-permutations** are
$$
\begin{align*}
& (1, 2) && (2, 1) \\
& (1, 3) && (3, 1) \\
& (2, 3) && (3, 2)
\end{align*}
$$
::

Let's do some excercises:

::Mcq
---
options: 
    - "1. 90"
    - "2. 100"
    - "3. 3628800"
correct: 1
---
#prompt
SSBS provides 10 AP curriculums. Each student chooses one for AP1, and another for AP2. How many unique configurations can one choose?

#explanation
The action of choosing an AP1 and an AP2 out of 10 curriculums is equivalent to constructing the map $\phi : \{1, ..., 10\} \twoheadrightarrow \{1, 2\}$, which is a **2-permutation** of a set with cardinality $10$. We could just plug in the formula for this.
$$
P^{10}_2 = \frac{10!}{(10 - 2)!} = 10 \times 9 = 90
$$
::

### 2x02. Combinations

Since we've now considered cases where we select a subset of the original objects, we might wish to generalize this "selection" to be regardless of order. This type of selection is called an **$r$-combination**. Combinations are represented using **sets** rather then tuples because order does not matter anymore.

::DefBox{id="R-Combinations"}
Let $M$ be a set of $N$ distinguishable elements. An **$r$-combination** of $M$ is a subset $S \subseteq M$ such that the cardinality of $|S| = r$.
::

You can try to derive the formula for counting the number of $k$-combinations of a set with cardinality $n$, which is usually denoted $C^n_k$. The key is to recognize a $k$-permutation as each unique combination of being repeated by all their permutations.

::SpoilerBox
We are computing the cardinality of **$k$-combinations** of a set $M$ where $|M| = n$.

Consider the $k$-permutation of $M$. It is of cardinality $P^n_k$. Because the set of all $k$-permutations is comprised of unique combinations, permuted each $P^k_k$ times. Therefore,
$$
\begin{align*}
P^k_k \times C^n_k &= P^n_k \\
C^n_k &= \frac{P^n_k}{P^k_k} \\
&= \frac{n!}{k! (n - k!)}
\end{align*}
$$
Therefore,
$$
\boxed{
C^n_k = \frac{n!}{k! (n - k!)}
}
$$
::

In reality, combinations are used much more widely then permutations, so much that a notation was reserved for them:
$$
C^n_k = \binom{n}{k}
$$
The number of combinations is sometimes also known as the <mark>binomial coefficient</mark> because of its significance in number theory, abstract algebra, and statistics.

::Mcq
---
options:
    - "1. 100"
    - "2. 90"
    - "3. 45"
    - "4. 5"
correct: 3
---
#prompt
Its March, and students are preparing for AP exams according to the curriculums they chose. Everyone's exams are issued at the same time, so those who chose APCSA as AP1 take the exam the same time as those who chose APCSA as AP2. How many different exam schedules could one chose (remember there are 10 curriculums provided)?

#explanation
The problem basically degrades to counting the unique choices of subsets of cardinality 2 in the set of classes, which can be formalized as a **2-combination** over the set of classes, which is of cardinality 10. Therefore this number can be directly computed:

$$
\binom{10}{2} = \frac{10!}{2! \times 8!} = 45
$$
::

### 2x03. Partitions
In case you haven't noticed, $\binom{k}{n} = \binom{n - k}{k}$. Algebraicly this is trivial, but a better way to understand it is that the number of selection of combinations is the same as the number of selection of elements not in the combination. For example, the number of choices for chosing which AP classes to take is the same as the number of choices for chosing which AP classes *not* to take.

A more symmetric way to state $k$-combinations is to ask the number of ways one can split a set of cardinality $n$ into classes of size $k$ and $n - k$. This action of *splitting* is formally known as **partitioning**, and the such as partitioning is known as a **bipartition**.


::DefBox{id=Partition}
Consider a set $M$. A **$r$-partition** of $M$ is a disjoint family of nonempty classes $\mathcal{P}$ ($|\mathcal{P}| = r$) such that
$$
\bigcup_{C \in \mathcal{P}} C = M
$$
::

An immediate corollary is that the sum of sizes of each class in the partition equals the cardinality of $M$.

::CorollaryBox{id="Cardinality Coverage"}
Consider a set $M$. If $\mathcal{P}$ is a partition of $M$, then
$$
\sum_{C \in \mathcal{P}} |C| = |M|
$$
::Folding{title="Extension - Proof"}
We could define an **indicator function** for each class in the partition:
$$
\mathbb{1}_C(x) =
\begin{cases}
1 & x \in C \\
0 & x \notin C
\end{cases}
$$

Since $\mathcal{P}$ is a partition, each $x \in M$ lies in exactly one $C \in \mathcal{P}$.

$$
\begin{align*}
\sum_{C \in \mathcal{P}} |C|
&= \sum_{C \in \mathcal{P}} \sum_{x \in M} \mathbb{1}_C(x) \\
&= \sum_{x \in M} \sum_{C \in \mathcal{P}} \mathbb{1}_C(x) \\
&= \sum_{x \in M} 1 \\
&= |M|
\end{align*}
$$
::
::

Naturally, the question arises to how many **$n$-partitions** exists on a set. This is not derivable without further knowledge of more advanced counting, so we'll only discuss the cases where we know exactly the cardinality of each subclass, which we here denote as 
$$
|\{\mathcal{P}\}| = \binom{n}{n_1, n_2, ..., n_k}
$$

::SpoilerBox
Consider representing the partition as $C_1 \cup \mathcal{P}'$. Therefore, 
$$
\binom{n}{n_1, ..., n_k} = \binom{n}{n_1} \times \binom{n - n_1}{n_2, ..., n_k}
$$
Continue to expand gives
$$
\begin{align*}
\binom{n}{n_1, n_2, ..., n_k} 
&= \binom{n}{n_1} \times \binom{n - n_1}{n_2} \times \binom{n - n_1 - n_2}{n_3, ..., n_k} \\
&= \binom{n}{n_1} \times \binom{n - n_1}{n_2} \times \binom{n - n_1 - n_2}{n_3} \times \cdots \times \binom{n_k}{n_k} \\
&= \frac{n!}{n_1!(n-n_1)!} \times \frac{(n-n_1)!}{n_2!(n-n_1-n_2)!} \times \cdots \times \frac{n_k!}{n_k! \cdot 0!} \\
&= \frac{n!}{n_1! \cdot n_2! \cdot \ldots \cdot n_k!}
\end{align*}
$$
::

This is sometimes called the **multinomial coefficient**.

::McqMultiple
---
options:
    - "1. $\\binom{3000}{300, 1500, 1200}$"
    - "2. $\\binom{3000}{300} + \\binom{2700}{1200} + \\binom{1500}{1500}$"
    - "3. $\\frac{3000!}{300! \\cdot 1500! \\cdot 1200!}$"
    - "4. $3000 \\cdot 300 \\cdot 1200 \\cdot 1500$"
    - "5. $\\binom{3000}{300} \\cdot \\binom{3000}{1200} \\cdot \\binom{3000}{1500}$"
correct:
    - 1
    - 3
---

#prompt
3000 people participated in a marathon. The top 10% are considered elite, the next 40% (from 10% to 50%) are considered good, and the remaining 50% are the rest. In how many ways can we partition the 3000 participants into these three categories?

#explanation
We need to partition 3000 people into three disjoint groups:
- Elite: top 10% = $0.10 \times 3000 = 300$ people
- Good: next 40% = $0.40 \times 3000 = 1200$ people  
- Rest: remaining 50% = $0.50 \times 3000 = 1500$ people

This is a partition with specified class sizes, so we use the multinomial coefficient:

$$
\binom{3000}{300, 1200, 1500} = \frac{3000!}{300! \cdot 1200! \cdot 1500!}
$$

Note that $\binom{n}{n_1, n_2, n_3}$ and $\frac{n!}{n_1! \cdot n_2! \cdot n_3!}$ are equivalent notations for the multinomial coefficient, so both options 1 and 3 are correct.
::