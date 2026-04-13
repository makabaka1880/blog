---
title: Counting - A Crash Course
description: Midterm Review
createTime: 2026-04-13
updateTime: 2026-04-13
---

We had a tough half-semester in Discrete Mathematics. Here's a compilation of everything we learned — sets, maps, cardinality, and the surprisingly deep rabbit holes that come with them. Grab a coffee, and let's get through this together.

> OK That introduction is written by claude but you get the idea. The <strike>end</strike> midterms is near, and I hope this guide at least help you in one way or another.

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
\lambda \mapsto \textcolor{blue}{1} \\
0 \mapsto \textcolor{blue}{1}0 \\
1 \mapsto \textcolor{blue}{1}1 \\
00 \mapsto \textcolor{blue}{1}00 \\
01 \mapsto \textcolor{blue}{1}01 \\
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
Let $\mathrm{id}_N : N \leftrightarrow N$ be the identity map such that $\mathrm{id}_N(n) = n$ for all $n \in N$.

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

::Folding{title="Extension - Naïve Ramsey Search"}
Calculation of the ramsey number has been a notoriously hard problem in combinatorics. The only known way to calculate it is by brute-force search, which is pretty much impossible for large $a$ and $b$. For example, $R(4, 4)$ is the biggest Ramsey number in the form $R(a, a)$ that has been calculated, and it is already $18$. To understand why it is so hard, let's derive the brute force approach's asymptotic behaviour.

A complete graph of $n$ vertices has $n^2$ edges. Since each edge can be colored in 2 ways, there are $2^{n^2}$ possible 2-colorings of $K_n$. For each coloring, we need to check if there is a monochromatic clique of size $a$ for either color. There are $\binom{n}{a}$ subsets of vertices of size $a$. Therefore, the total time complexity of the brute-force approach is $O(\binom{n}{a} \times 2^{n^2}) = O(2^{n^2})$, which is astronomically large even for small values of $n$. 
::

::Mcq
---
options:
    - "1. 1"
    - "2. 3"
    - "3. 5"
    - "4. 7"
correct: 3
---

#prompt
Assume a party where everyone are either friends or enemies. What is the minimum number of people required to guarantee that there are either 3 mutual friends or 2 mutual enemies?

#explanation
This is asking for $R(3, 2)$, the smallest $n$ such that any 2-coloring of $K_n$ contains either a red clique of size 3 or a blue clique of size 2. Direct computation shows $R(3, 2) = 3$.

::Folding{title="Extension - Naïve Ramsey Search Implementation"}
```py
from itertools import combinations

def has_monochromatic_clique(edges, color, size):
    vertices = set()
    for u, v in edges:
        vertices.add(u)
        vertices.add(v)
    
    for subset in combinations(vertices, size):
        is_clique = True
        for u, v in combinations(subset, 2):
            edge = tuple(sorted([u, v]))
            if edges.get(edge) != color:
                is_clique = False
                break
        if is_clique:
            return True
    return False

def check_coloring(n, coloring):
    edges = {}
    for i in range(n):
        for j in range(i + 1, n):
            edge_idx = i * n + j
            edges[tuple(sorted([i, j]))] = coloring[edge_idx]
    
    has_red_3 = has_monochromatic_clique(edges, 0, 3)       # 0 = Red
    has_blue_2 = has_monochromatic_clique(edges, 1, 2)      # 1 = Blue
    
    return has_red_3 or has_blue_2

def R():
    for n in range(2, 10):
        num_edges = n * (n - 1) // 2
        found_counterexample = False
        
        for coloring_bits in range(2 ** num_edges):
            coloring = [(coloring_bits >> i) & 1 for i in range(num_edges)]
            if not check_coloring(n, coloring):
                found_counterexample = True
                break
        
        if not found_counterexample:
            return n
    
    return None

R(3, 2)
```
::
::
