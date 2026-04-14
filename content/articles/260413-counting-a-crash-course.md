---
title: Counting - A Crash Course
description: Part 1 of 3-Part Mid-term Preparation Material
createTime: 2026-04-13
updateTime: 2026-04-13
---

::WarningBox
This is **NOT** official material provided by SSBS. There could be errors or inaccuracies in tran
::

We had a tough half-semester in Discrete Mathematics. Here's a compilation of everything we learned — sets, maps, cardinality, and the surprisingly deep rabbit holes that come with them. Grab a coffee, and let's get through this together.

> OK That introduction is written by claude but you get the idea. The <strike>end</strike> midterms is near, and I hope this guide at least help you in one way or another. I included problems midways to help you with reviewing.

## 0x00. Notation and Nomenclature

**Class** is just a fancy word for collection of objects. The reason we didn't use sets is because sets are strictly formalized objects that has too many nuances that it is pretty annoying to simply use them as a collection of object.

**Families** are often used to describe a collection of collections because a class of class or a set of set sounds pretty wierd and semantically accurate in most of our cases. They are often in cursive font.

**A family indexed by xxx** is just a function. For example, the grade cohort is just a family of homerooms indexed by their room number, which could also be expressed as a bijection between the space of room numbers and homerooms. The reason we don't use function here is because they emphasize structure and interpretation and preserve identity, not just mapping.

**Identity map** is a function $\lambda x. x$ that maps everything to itself. Over the real numbers, it's the linear function $f(x) = x$.


I'll be defining functions with various syntaxes through the text.

| Syntax | Example ($\mathbb{R} \to \mathbb{R}^+_0$) |
| - | - |
| Standard |  $f(x) = x^2$ |
| Lambda Calculus | $f := \lambda x : \mathbb{R}. x^2$
| Mapsto | $f := x \mapsto x^2$ |

**OBOE (Off-By-One Errors) / Fencepost Error** is a counting mistake where one confuses the number of objects with the number of gaps between them. For a line of length $n$, there are $n$ intervals but $n + 1$ endpoints. Formally, while the distance between two points $a$ and $b$ is $b - a$, the number of discrete integers in the inclusive set $[a, b]$ is $(b - a) + 1$. This error typically occurs in programming and logic when failing to properly account for boundary conditions in loops or array indexing. The **Fencepost Principle** is the principle that relates the number of gaps with the number of endpoints.

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
Consider a countable set $M$ with ordinal $\{0, 1, 2, ... n - 1\}$. Then the **cardinal** of $M$ is $n$.

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
Count the set of bit strings $\Sigma^* = {\lambda, 0, 1, 00, 01, 10, ...}$.
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

which violates the **axiom of foundation** (no set can contain itself). Contradiction. <Qed />
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

contradicting $\sum_{b \in N} p(b) = n$. Hence $f$ must be injective. <Qed />
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
If $f$ is injective then $f$ is bijective. Therefore, $|M| > |N|$. Contradiction. <Qed />
:::
::

::CorollaryBox{id="Generalized Pigeonhole Principle"}
Let $M$, $N$ be finite sets and $f: M \to N$ with $|M| = m$ and $|N| = n$. Then there exists $b \in \text{im}(f)$ such that $|f^{-1}(\{b\})| \ge \lceil m/|\text{im}(f)| \rceil$.

:::Folding{title="Proof"}
Let $k = |\text{im}(f)|$. Suppose for contradiction that $|f^{-1}(\{b\})| < \lceil m/k \rceil$ for all $b \in \text{im}(f)$, i.e. $|f^{-1}(\{b\})| \le \lceil m/k \rceil - 1$ for all $b \in \text{im}(f)$. Then
$$
m = \sum_{b \in \text{im}(f)} |f^{-1}(\{b\})| \le k \cdot (\lceil m/k \rceil - 1) < k \cdot \frac{m}{k} = m,
$$
a contradiction. <Qed />
:::

:::Corollary{title="Surjective Case"}
If $f$ is surjective, then $\text{im}(f) = N$, so $k = n$, and the bound becomes: there exists $b \in N$ such that $|f^{-1}(\{b\})| \ge \lceil m/n \rceil$.
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

Since $|M| > |\{0, ..., n - 1\}|$, by the pigeonhole principle, there will be at least one element of $f$'s range that has two preimages (composed of $t_1$ 1's and $t_2$ 1's). Denote them as 
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
Because $(a - b) n$ has a factor $n$, it is a multiple of $n$. <Qed />
::

::Folding{title="Bonus"}
::Qabox{type="question"}
If there are $n$ ($n \geq 3$) people who has each dated each other, prove that not every one is straight.
::

::SpoilerBox
Construct the map $f$ from people to gender. By the pigeonhole principle ($n \geq 3 > 2$) there must be at least two people of the same gender. Since they dated each other, neither one of them is straight. <Qed />
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

Consider a set $|\{x_n\}| = N$. Take the first element $x_1$, and the set can be denoted as 

$$
\{x_1\} \cup M' = \{x_n\}
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
&= \frac{n!}{k! (n - k)!}
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
It' s March, and students are preparing for AP exams according to the curriculums they chose. Everyone's exams are issued at the same time, so those who chose APCSA as AP1 take the exam the same time as those who chose APCSA as AP2. How many different exam schedules could one chose (remember there are 10 curriculums provided)?

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

### 2x04. Repetition

Up to now we have assumed completely unique elements in our discussion. But what if the collection can contain multiple equivalent objects?

There is an abstraction in mathematics known as **multisets**.

::DefBox{id="Multiset"}
A **multiset** $M = (S, \chi)$ is a set $M$ equipped with a projection mapping $\chi : S \to \mathbb{N}$ each element to a natural number called its **multiplicity**. This projection mapping $\chi$ is known as the **multiplicity function**.
::

Since multiset is based on a base set, we wish to derive some notion of cardinality for them.

Understood. To match your preferred format exactly, we treat the multiset $M$ as the set of all "indexed" occurrences.

::LemmaBox{id="Cardinality of Multisets"}
Given multiset $M = (S, \chi)$, if $S$ is countable, then $M$ is countable. Furthermore, the cardinality of $M$ is
$$
|M| = \sum_{x \in S} \chi(x)
$$
::Folding{title="Proof"}
Define the set of all instances $M = \{ (x, i) : x \in S, 1 \le i \le \chi(x) \}$. We use the indicator function $\mathbb{1}_M(x, i)$ to sum over the product space $S \times \mathbb{N}$:

$$
\begin{align*}
|M| &= \sum_{x \in S} \sum_{i \in \mathbb{N}} \mathbb{1}_M(x, i) \\
&= \sum_{x \in S} \chi(x)
\end{align*}
$$

Since $M \subseteq S \times \mathbb{N}$ and the Cartesian product of two countable sets is countable, $M$ is **countable**.
::
::

::ExampleBox
To represent a collection with one $A$, two $B$'s and three $C$'s, we construct a base set $S = \{A, B, C\}$ and the multiplicity projections
| $x \in S$ | $\chi(x)$ |
| - | - |
| $A$ | $1$ |
| $B$ | $2$ |
| $C$ | $3$ |

In shorthand, we often write out the base set and juxtapose each elements' multiplicity in front of the element.
$$
(S, \chi) = \{1A, 2B, 3C\}
$$
::

To discuss counting problems with multisets as subjects, a common method is to treat the multiset $(S, \chi)$ initially as a regular set with cardinality $\sum_{x \in S} \chi(x)$. After completing the counting problem with this regular set, we divide $P^{\chi(n)}_{\chi(n)} = \chi(n)!$ to account for the fact that permutation inside each collection of $\chi(n)$ identical elements don't matter.

::ExampleBox
Let's say we want to find all unique permutations of the word `BANANA`. We can model the character pool using the multiset $(S, \chi) = \{1B, 2N, 3A\}$, and first treat it as a normal set and compute the count of all its permutations
$$
|(S, \chi)|! = 6! = 720
$$
Next, we account for all extra counting from the permutations of identical characters. We do this by dividing our previous answer by $\chi(B)!$, $\chi(N)!$ and $\chi(A)!$. If you have noticed sth, familiar, that's right: this is just the multinomial coefficient.
$$
\begin{align*}
\binom{|(S, \chi)|}{\chi(B), \chi(N), \chi(A)}
=& \frac{6!}{\chi(B)! \times \chi(N)! \times \chi(A)! }\\
=& \frac{6!}{3! \times 2! \times 1!} = \boxed {60}
\end{align*}
$$
::

Therefore we came to a general conclusion:

::LemmaBox{id="Permutations of a Multiset"}
Given multiset $(S, \chi)$ where $|S| = n$, the cardinality of permutations unique up to equality is
$$
\binom{n}{\chi(x_1), \chi(x_2), ..., \chi(x_n)} = \frac{n!}{\prod^n_{i = 1}(\chi(x_i)!)}
$$
::
::Mcq
---
options:
    - "1. $\\frac{7!}{3! \\times 2! \\times 1! \\times 1!} = 420$"
    - "2. $\\frac{7!}{3! + 2! + 1! + 1!} = 560$"
    - "3. $\\frac{7!}{3! \\times 2!} = 420$"
    - "4. $7! = 5,040$"
correct: 1
---
#prompt
Calculate the number of unique permutations of the multiset representing the letters in the word `SUCCESS`. 

$$
(S, \chi) = \{3S, 2C, 1U, 1E\}
$$

#explanation
To find the unique permutations, we identify the total number of elements $n = 7$ and the multiplicities of each unique element:
- $\chi(S) = 3$
- $\chi(C) = 2$
- $\chi(U) = 1$
- $\chi(E) = 1$

Using the **Permutations of a Multiset** lemma:
$$
\begin{align*}
\frac{n!}{\prod \chi(x_i)!} &= \frac{7!}{3! \times 2! \times 1! \times 1!} \\
&= \frac{5040}{6 \times 2 \times 1 \times 1} = \frac{5040}{12} = \boxed{420}
\end{align*}
$$

3 is algebraicly correct but methodologically incorrect.
::

There are also problems on counting the partitioning of indistinguishable elements. A general way to solve them is not to consider how to select objects for each class, rather to consider the possible position of "cuts" that seperate elements into classes. This is a general method known as **stars and bars**.

::Qabox
Find the number of solutions to the equation
$$
x_1 + x_2 + x_3 = 20
$$
Where $x_1, x_2, x_3 \geq 1$ are positive integers.
::

The key here is to imagine the problem like cutting up a long object of length 20 and count the possibilities of configuration of cuts. For example, the solution

$$
4 + 5 + 11 = 20
$$

Correspond to this:

```
* * * * | * * * * * | * * * * * * * * * * *
```

Therefore, the problem changes to chosing $2$ cuts in $19$ places. Thus, there are $\binom{19}{2}$ possible solution sets.

This way of solving partitions can be further generalized to method known as **stars and bars**. 

::LemmaBox{id="Stars And Bars / Partition of Indistinguishable Elements"}
If you want to distribute $n$ *stars* into $k$ containers where each container must contain at least one star, you can just lay all the stars in a line in try count the ways to insert $k - 1$ *bars*. Because there are $n - 1$ gaps, this number came out to be
$$
\binom{n - 1}{k - 1}
$$
::

::ExampleBox
Find the cardinality of the solution set of the inequality
$$
x_1 + x_2 + x_3 + x_4 \leq 20
$$
Where $x_1, x_2, x_3, x_4 \geq 1$

Can you find a way to convert this into a regular linear equation?

:::SpoilerBox
The key is to add a **slack variable** $s$:
$$
x_1 + x_2 + x_3 + x_4 + s = 21
$$

where $s \geq 0$ represents the "unused" amount. This transforms the inequality into an equality. Now we need to distribute $21$ units among $5$ variables (the four $x_i$ and the slack variable $s$), where each $x_i \geq 1$ and $s \geq 0$.

To handle the constraint $x_i \geq 1$, we substitute $y_i = x_i - 1 \geq 0$ for $i = 1, 2, 3, 4$:
$$
(y_1 + 1) + (y_2 + 1) + (y_3 + 1) + (y_4 + 1) + s = 21
$$
$$
y_1 + y_2 + y_3 + y_4 + s = 17
$$

Now we distribute $17$ indistinguishable units among $5$ containers with no restrictions. Using **stars and bars**, the number of solutions is:

$$
\binom{17 + 5 - 1}{5 - 1} = \binom{21}{4} = 5985
$$

:::
::

::Mcq
---
options:
    - "1. $499^{19}$"
    - "2. $\\frac{500!}{20!}$"
    - "3. $\\frac{500!}{20! \\times 480!}$"
    - "4. $\\frac{499!}{19! \\times 480!}$"
correct: 1
---

#prompt
Sam is moving. He have 500 books and 20 boxes. How many ways can he pack his books into boxes?

#explanation
This is a trick question: there is no such constraint that **each box must contain a book**! Therefore the choices of each bar is independent of each other, so we dont need combinations anymore.

There are 20 boxes, meaning $20 - 1 = 19$ bars. Each bar can go to $500 - 1 = 499$ spaces. Therefore the answer is $499^{19}$.
::

### 2x05. Lexicographic Ordering
We know that there exists $P^3_3 = 3$ unique permutations of $\{1, 2, 3\}$, but they are currently just a mathematical set without any practical usage. In practice, a **total order** is often defined over the family of permutations of a set. Here we introduce the most commonly used **Lexicographic Ordering**.

> A total order over $M$ is just a function that can compare any two elements of $M$. For our purposes we often analyze subset of reals, so there already exists one for us.

In order to do lexicographic ordering, a total order must first be defined over the set itself. For example, $\{1, 2, 3\}$ have $<$, which is defined for every two elements of it, thus a total order. 

To order two permutations $\pi_1$ and $\pi_2$ of set $M$ lexicographically, we repeat the following starting from $i = 0$:

1. Find the element $x$ such that $\pi_1(x) = i$
2. Find the element $y$ such that $\pi_2(y) = i$
3. Compare $x$ and $y$. If they are equal, increment $i$ and repeat again. If not, this order encodes the lexigraphical order of $\pi_1$ and $\pi_2$.

::ExampleBox
To make sense of how it works, let's order $\{1, 2, 3\}$'s permutations $\pi_1 = (3, 2, 1)$ and $\pi_2 = (3, 1, 2)$.

1. At first $i = 0$. Because $\pi_1(3) = 0$ and $\pi_2(3) = 0$, we move on.
2. Now $i = 1$. Because $\pi_1(2) = 1$ and $\pi_2(1) = 1$, $2 > 1$, so $\boxed{\pi_1 > \pi_2}$.
::

You may recognize that this is very similar to the direct comparision of those permutations represented as a decimal expansion:

$$
321_{10} > 312_{10}
$$

This is actually provable!

::LemmaBox{id="Positional Encoding of Lexicographical Ordering"}
Consider a set $M$. Let the *base* $b$ be a number greater then the maximum value of $M$. Define the evaluation function $f$ as
$$
f(\pi) = \sum^{|M|}_{i = 1} b^{|M| - i} \cdot \pi(x_i)
$$
Then the lexicographical ordering of $\pi_1$ and $\pi_2$ is identical to the numerical ordering of $f(\pi_1)$ and $f(\pi_2)$. That is,
$$
f(\pi_1) > f(\pi_2) \iff \pi_1 > \pi_2
$$

> Remind me to attach a proof later

A special case of this is when $b = 10$ and $M$ only contains numbers below ten. This is the case where we discussed about permutations as decimal expansions. Another use case of this lemma is in digital circuits called **Magnitude Comparators** like 74HC85 IC. A lexicographical comparison of binary bitstrings are used for quick numerical comparison between integers.
::

A common problem we're given is generating the next lexicographically greater permutation of a permutation.

> Remind me to include a proof of correctness
1.  **Identify the Pivot**: Scan $\pi$ from right to left to find the first index $j$ such that $\pi(j) < \pi(j+1)$. This index $j$ is the rightmost position that can be increased to create a larger permutation.
2.  **Find the Successor**: Scan from the right end again to find the first index $k$ where $\pi(k) > \pi(j)$. This $\pi(k)$ is the smallest value to the right of $j$ that is still larger than the pivot.
3.  **Swap and Minimize**: Swap $\pi(j)$ and $\pi(k)$. Then, reverse the entire sequence to the right of index $j$. Since that tail was previously in descending order, reversing it makes it ascending, ensuring $\pi'$ is the *immediate* successor.

::Folding{title="Extension - Implementation in Haskell"}
```haskell
nextPermutation :: Ord a => [a] -> Maybe [a]
nextPermutation xs = 
    let revXs = reverse xs
        (suffix, rest) = span (uncurry (>=)) (zip revXs (drop 1 revXs))
    in case rest of
        [] -> Nothing
        ((curr, pivot) : iterations) ->
            let 
                restNodes = map snd iterations
                (smaller, (target:bigger)) = break (> pivot) (map fst suffix)
                newSuffix = smaller ++ [pivot] ++ bigger
            in Just $ reverse restNodes ++ [target] ++ newSuffix
```
::

::ExampleBox
Let's find the next permutation of $\pi = (2, 3, 4, 1, 6, 5)$.

1.  **Find the Pivot**: Looking from the right, $5 < 6$ (no), $6 > 1$ (yes!). Our pivot index $j$ is at value **1**.
2.  **Find the Successor**: Looking from the right for something larger than 1, we find **5**. Our successor index $k$ is at value **5**.
3.  **Swap**: Exchange 1 and 5 to get $(2, 3, 4, 5, 6, 1)$.
4.  **Reverse**: Reverse the tail after the swap position. The tail $(6, 1)$ becomes $(1, 6)$.
5.  **Result**: The next permutation is $\boxed{(2, 3, 4, 5, 1, 6)}$.
::



To find the next permutation $\pi'$ in lexicographical order after a given permutation $\pi$, we perform the following procedure:

1.  **Identify the Pivot**: Scan $\pi$ from right to left to find the first index $j$ such that $\pi(j) < \pi(j+1)$. If no such $j$ exists, the permutation is the largest possible.
2.  **Find the Successor**: Scan from the right end of the sequence toward the pivot to find the first index $k$ where $\pi(k) > \pi(j)$.
3.  **Swap**: Exchange the values at positions $j$ and $k$.
4.  **Reverse the Suffix**: Reverse all elements to the right of index $j$ (from $j+1$ to $n$). This transforms the tail from its maximum possible value (descending) to its minimum possible value (ascending).


::Mcq
---
options:
    - "1. $(4, 3, 2, 1, 5, 6)$"
    - "2. $(4, 3, 5, 1, 2, 6)$"
    - "3. $(4, 3, 5, 6, 2, 1)$"
    - "4. $(4, 3, 5, 1, 6, 2)$"
correct: 2
---

#prompt
Given the permutation $\pi = (4, 3, 2, 6, 5, 1)$, what is the immediate lexicographical successor $\pi'$?

#explanation
Following the algorithm:
1. **Pivot**: Scanning from the right, the first $a_j < a_{j+1}$ is **2** (since $2 < 6$).
2. **Successor**: The smallest value to the right of 2 that is larger than 2 is **5**.
3. **Swap**: Exchange 2 and 5 to get $(4, 3, 5, 6, 2, 1)$.
4. **Reverse**: Reverse the suffix after the pivot position. The suffix $(6, 2, 1)$ becomes $(1, 2, 6)$.
The final result is $\boxed{(4, 3, 5, 1, 2, 6)}$.
::

### 2x06. Generating Combinations

Encoding the combination for a set is much simpler. Because we've assumed our set countable, each number has been given a natural nuber as label and thus, we can positionally encode the inclusion function $\in$ using a bitstring.

::ExampleBox
Consider the set $M = \{1, 2, 3\}$ and the counting function $x \mapsto x - 1$. Because $2 \mapsto 1$ and $1 \mapsto 0$, the bitstring encoding has bits 1 and 2 highlighted. So it should be `011`.

A simpler approach is to list all elements of $M$ on your scratch paper, ordered by their corresponding count.

$$
1\ 2\ 3
$$

Now, cross out all the elements not in the combination and underline those in it:

$$
\cancel{1}\ \underline{2}\ \underline{3}
$$

And write a $0$ under all those crossed out and $1$ under all underlined:

$$
\cancel{1}\ \underline{2}\ \underline{3} \\
0\ 1\ 1
$$
::

> This makes counting combinations (which is basically the powerset) much easier, too. Because any combination is basically just a bitstring, simply treat the bitstring as the binary expansion of a number. This is a bijection between the natural numbers with subsets.

However we may wish to obtain the next **lexicographically greater $r$-combination**. Note that since combinations are not ordered internally (i.e. $\{2, 3\}$ is the same is $\{3, 2\}$, they are just syntatically different but structurally equivalent), we are considering the ordering of combinations as *sequences by numeric order*. For example, the 2-combination `011` is represented as $(2, 3)$.

The algorithm for this is a bit more complex than the permutation case, but follows the same spirit -- find the rightmost element with room to grow, increment it, then reset everything to its right to the smallest valid values.

To find the next $r$-combination $\{a_1 < a_2 < \cdots < a_r\}$ of $\{1, 2, \ldots, n\}$:

1. **Find the Pivot**: Scan from right to left to find the largest index $i$ such that $a_i \neq n - r + i$. This is the rightmost element that hasn't yet been "maxed out" — it still has room to increase without pushing the remaining elements out of bounds.
2. **Increment**: Replace $a_i$ with $a_i + 1$.
3. **Reset the Suffix**: For all $j = i+1, \ldots, r$, replace $a_j$ with $a_i + j - i + 1$. This packs the tail as tightly as possible immediately after the new $a_i$, giving the lexicographically smallest valid completion.

If no such $i$ exists (i.e. $a_k = n - r + k$ for all $k$), then $\{n-r+1, \ldots, n\}$ is already the largest $r$-combination and we are done.

> Remind me to include a proof of correctness

::ExampleBox
Let's find the next 4-combination of $\{1,2,3,4,5,6\}$ after $\{1, 2, 5, 6\}$.

The maximum values are $n - r + k = 3, 4, 5, 6$ for $k = 1, 2, 3, 4$.

1. **Find the Pivot**: Comparing right to left — $a_4 = 6 = 6$ (maxed), $a_3 = 5 = 5$ (maxed), $a_2 = 2 \neq 4$ (not maxed!). So $i = 2$.
2. **Increment**: $a_2 = 2 \to 3$.
3. **Reset**: $a_3 = 3 + 1 = 4$, $\quad a_4 = 3 + 2 = 5$.

The result is $\boxed{\{1, 3, 4, 5\}}$.
::

::Folding{title="Extension - Implementation in Haskell"}
```haskell
nextCombination :: Int -> [Int] -> Maybe [Int]
nextCombination n xs =
    let r    = length xs
        indexed = zip xs [1..]
        pivot = last . takeWhile (\(a, k) -> a /= n - r + k) $ indexed
    in case pivot of
        (ai, i) ->
            let prefix = take (i - 1) xs
                newAi  = ai + 1
                suffix = map (newAi +) [1 .. r - i]
            in Just $ prefix ++ [newAi] ++ suffix
```

Note that `takeWhile` here walks left to right and we take the `last` valid element -- that's our rightmost non-maxed index. If the `takeWhile` yields an empty list, the input was already the final combination, and you'd want to return `Nothing`.
::

Notice the structural parallel with `nextPermutation`: both algorithms are really just *find rightmost non-maxed position, bump it, greedily minimize the suffix*. The combination case is actually simpler because the suffix reset is just consecutive integers rather than a reversal — there's only one ascending arrangement of the tightly-packed tail.

::Mcq
---
options:
    - "1. $\\{2, 4, 6, 7\\}$"
    - "2. $\\{2, 5, 6, 7\\}$"
    - "3. $\\{3, 4, 5, 6\\}$"
    - "4. $\\{2, 4, 7, 8\\}$"
correct: 1
---

#prompt
Given the 4-combination $\{2, 4, 5, 8\}$ of $\{1, 2, \ldots, 8\}$, what is the immediate lexicographical successor?

#explanation
The maximum values are $n - r + k = 5, 6, 7, 8$ for $k = 1, 2, 3, 4$.

1. **Find the Pivot**: Comparing right to left — $a_4 = 8 = 8$ (maxed), $a_3 = 5 = 7$? No, $5 \neq 7$ (not maxed!). So $i = 3$.
2. **Increment**: $a_3 = 5 \to 6$.
3. **Reset**: $a_4 = 6 + 1 = 7$.

The result is $\boxed{\{2, 4, 6, 7\}}$.
::

## 3x00. Short Quiz

::Folding{title="Mapping and Counting"}
::Mcq
---
options:
    - "1. Injection"
    - "2. Surjection"
    - "3. Bijection"
    - "4. None"
correct: 1
---

#prompt
Consider the function $f: \mathbb{Z} \to \mathbb{Z}$ defined by $f(x) = 2x$. Which of the following properties does $f$ satisfy?

#explanation
The function $f(x) = 2x$ maps every integer to an even integer. It is injective because if $2x = 2y$, then $x = y$. However, it is not surjective because odd integers are not in the image (there is no integer $x$ such that $2x = 1$). Therefore, $f$ is injective but not surjective, so it is an injection.
::

::Mcq
---
options:
    - "1. $|\\mathbb{N}| > |\\mathbb{Q}|$"
    - "2. $|\\mathbb{R}| = |\\mathbb{Q}|$"
    - "3. $|\\mathbb{N}| = |\\mathbb{R}|$"
    - "4. $|\\mathbb{R}| > |\\mathbb{Q}|$"
correct: 4
---

#prompt
Which of the following statements about cardinalities is true?

#explanation
The set of natural numbers $\mathbb{N}$ and rational numbers $\mathbb{Q}$ are both countably infinite ($\aleph_0$), so $|\mathbb{N}| = |\mathbb{Q}|$, not greater. The real numbers $\mathbb{R}$ are uncountably infinite, and its cardinality is strictly greater than that of $\mathbb{Q}$. Therefore, $|\mathbb{R}| > |\mathbb{Q}|$ is the only true statement among the options.
::

::Mcq
---
options:
    - "1. 3"
    - "2. 4"
    - "3. 5"
    - "4. 6"
correct: 3
---

#prompt
If 13 socks are placed in 3 drawers, what is the minimum number of socks that must be in at least one drawer?

#explanation
By the pigeonhole principle, distributing $m$ items into $n$ drawers guarantees at least one drawer contains at least $\lceil m/n \rceil$ items. Here $m = 13$, $n = 3$, so $\lceil 13/3 \rceil = \lceil 4.33\ldots \rceil = 5$.
::

::Mcq
---
options:
    - "1. 2"
    - "2. 3"
    - "3. 4"
    - "4. 5"
correct: 2
---

#prompt
What is the Ramsey number $R(2,3)$?

#explanation
The Ramsey number $R(2,3)$ is the smallest $n$ such that any 2-coloring of the edges of $K_n$ contains either a red clique of size 2 (two vertices connected by a red edge) or a blue clique of size 3 (a blue triangle). It is known that $R(2,3) = 3$.
::
::

::Folding{title="Combinatorics"}

::Mcq
---
options:
    - "1. 120"
    - "2. 720"
    - "3. 5040"
    - "4. 40320"
correct: 2
---

#prompt
How many permutations are there of the set $\{A,B,C,D,E,F\}$?

#explanation
The set has 6 distinct elements. The number of permutations of $n$ distinct objects is $n!$. Here $6! = 720$.
::

::Mcq
---
options:
    - "1. 10"
    - "2. 15"
    - "3. 20"
    - "4. 25"
correct: 3
---

#prompt
How many ways can you choose 3 distinct letters from the alphabet $\{A,B,C,D,E,F\}$?

#explanation
The number of ways to choose $k$ elements from a set of $n$ distinct elements is the binomial coefficient $\binom{n}{k}$. Here $n = 6$, $k = 3$, so $\binom{6}{3} = 20$.
::

::Mcq
---
options:
    - "1. 30"
    - "2. 60"
    - "3. 90"
    - "4. 120"
correct: 1
---

#prompt
How many distinct permutations can be formed from the letters of the word "AABBC"?

#explanation
The word "AABBC" has 5 letters with multiplicities: A=2, B=2, C=1. The number of distinct permutations is given by the multinomial coefficient $\frac{5!}{2! \cdot 2! \cdot 1!} = \frac{120}{2 \cdot 2} = 30$.
::

::Mcq
---
options:
    - "1. $\\binom{19}{3}$"
    - "2. $\\binom{20}{4}$"
    - "3. $\\binom{21}{4}$"
    - "4. $\\binom{22}{5}$"
correct: 3
---

#prompt
How many non-negative integer solutions does $x_1 + x_2 + x_3 + x_4 + x_5 = 17$ have?

#explanation
Using stars and bars, the number of non-negative integer solutions to $x_1 + \cdots + x_k = n$ is $\binom{n + k - 1}{k - 1}$. Here $n = 17$, $k = 5$, so $\binom{17 + 5 - 1}{5 - 1} = \binom{21}{4}$.
::

::Mcq
---
options:
    - "1. $(2,1,4,3)$"
    - "2. $(2,3,1,4)$"
    - "3. $(2,3,4,1)$"
    - "4. $(2,4,1,3)$"
correct: 2
---

#prompt
Given the permutation $(2,1,4,3)$, what is its immediate lexicographic successor?

#explanation
Following the next permutation algorithm: find the pivot (rightmost element smaller than its right neighbor). Here $1 < 4$, so pivot is 1. Find the successor (smallest element to the right larger than 1), which is 3. Swap pivot and successor to get $(2,3,4,1)$. Reverse the suffix after the pivot position (the suffix is $[4,1]$, reversed to $[1,4]$). The result is $(2,3,1,4)$.
::

::Mcq
---
options:
    - "1. $\\{1,3,4,5,6\\}$"
    - "2. $\\{1,3,4,5,7\\}$"
    - "3. $\\{1,3,4,6,7\\}$"
    - "4. $\\{1,3,5,6,7\\}$"
correct: 2
---

#prompt
Given the 5-combination $\{1,3,4,5,6\}$ of $\{1,2,3,4,5,6,7\}$, what is the immediate lexicographic successor?

#explanation
Following the next combination algorithm: find the rightmost element $a_i$ that is not at its maximum possible value $n - r + i$. Here $n = 7$, $r = 5$. Compute maximums: $[3,4,5,6,7]$. Compare with $[1,3,4,5,6]$ from right: $a_5 = 6$ vs $7$ (not maxed), so pivot $i = 5$. Increment $a_5$ to $7$. No suffix to reset. The result is $\{1,3,4,5,7\}$.
::

