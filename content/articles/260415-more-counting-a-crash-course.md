---
title: More Counting - A Crash Course
description: Part 3 of 3-Part Mid-term Preparation Material
createTime: 2026-04-15
updateTime: 2026-04-15

tags:
    - Discrete Mathematics
---


## 0x00. Notation and Nomenclature
A **predicate** over a set $M$ is a map that maps everything in $M$ to either true ($\top$) or false ($\bot$). By the way, the set $\{\top, \bot\}$ is known as **Booleans** $\mathbb{B}$ (the same thing as `bool` in computer science). 

## 1x00. More Probability
### 1x01. Probabilistic Method
A very interesting way to prove the existence of a certain property for an object is to construct a probability over all such objects and prove that the probability of this property existing is not 0.

::TheoremBox{id="Probabilistic Method"}
If the probability that an element of a set $S$ does not have a specified property is less than 1, then there exists an element in $S$ that possesses that property.

::Folding{title="Proof"}
Formally, consider a predicate $\phi : S \to \mathbb{B}$ over $S$. If 
$$
P(\{x \in S \mid \neg\phi(x)\}) < 1
$$
then there exists an element $x \in S$ such that $\phi(x)$ is true. Equivalently, if $P(\{x \in S \mid \phi(x)\}) > 0$, then $\{x \in S \mid \phi(x)\} \neq \emptyset$.

We proceed by **Contradiction**. Suppose that no element in $S$ possesses the property $\phi$. This implies that for all $x \in S$, $\phi(x)$ is false, or equivalently, $\neg\phi(x)$ is true for all $x$.

In terms of sets, this means:
$$\{x \in S \mid \phi(x)\} = \emptyset \implies \{x \in S \mid \neg\phi(x)\} = S$$

By the **Axioms of Probability**, specifically the requirement that $P(S) = 1$, we have:
$$P(\{x \in S \mid \neg\phi(x)\}) = P(S) = 1$$

However, this directly contradicts our initial assumption that $P(\{x \in S \mid \neg\phi(x)\}) < 1$. Therefore, the set $\{x \in S \mid \phi(x)\}$ cannot be empty, and there must exist at least one $x \in S$ that satisfies $\phi(x)$.

:Qed

::
::

I bet the probability method will not be a focus because I just cannot find a trivial enough exercise to put here

## 2x00. Recurrences
The study of recurrences is a pretty important thing in computer science since most recursive algorithms could have their resource assumptions modeled by one. Systematic methods for solving them, however, do not exist. Luckily for a certain class of recurrences, what we can do is to create an asymptotic approximation of the recurrence and figure out its lower bound, upper bound, or both.

### 2x01. DnC and Master's Theorem

::DefBox{id="Divide-and-Conquer Recurrences"}
A recurrence is called an **Divide-and-Conquer Recurrence** when it is of the form
$$
T(n) = a T(n / b) + f(n)
$$
::

Under the context of algorithmic analysis, the term $a T (n / b)$ is sometimes known as the **recursive cost**, and $f$ the **local cost**. Let's look at an explicit example.

::WarningBox
I'm using Java here purely because many of you are taking APCSA and my pseudocode renderer went on strike.
::

::ExampleBox
Consider the below binary search:
```java
public int binarySearch(int[] arr, int low, int high, int target) {
    if (low > high) return -1;

    int mid = low + (high - low) / 2; // f(n) component: O(1)

    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] > target) {
        // Recurse on the left half
        return binarySearch(arr, low, mid - 1, target);
    } else {
        // Recurse on the right half
        return binarySearch(arr, mid + 1, high, target);
    }
}
```
The recursive cost is $T(n / 2)$, since each time our input space is cut in half. The local cost here is $\Theta(1)$, since we only have a branching statement.

$$
T(n) = T(n / 2) + \Theta(1)
$$
::

A general way to reason about this type of recurrence is to express it in an expanded form, where $k$ below corresponds to how many layers we are peeling off:

$$
\begin{align*}
T(n) =& a (a T(n / b^2) + f(n / b)) + f(n) \\
=& a (a (a T (n / b^3) + f(n / b^2)) + f(n / b)) + f(n) \\
&\vdots \\
=& a^k T(n / b^k) + \sum^{k - 1}_{i = 0} a^i f(n / b^i)
\end{align*}
$$

Because we only want an asymptotic approximation, we may as well assume the recurrence has its base case at $n = 1$ to be $T(n) = 1$.

::Folding{title="Proof of Why"}
> Remind me later
::

Now that we have a definite case of $T$, we could try calling it in our expression. Let $n / b^k = 1$, and $n = b^k$.

$$
T(n) = n^{log_b a} + \sum^{\log_b n - 1}_{i = 0} a^i f(n / b^i)
$$

Let's assume f(n) to be polynomial for a second. This means that there exists a $c$ such that

$$
f(n) = \Theta(n^c)
$$

And thus the sum on the right becomes geometric under asymptotic approximation:

$$
\begin{align*}
T(n) &= n^{log_b a} + \sum^{\log_b n - 1}_{i = 0} a^i f(n / b^i) \\
&= n^{log_b a} + \sum^{\log_b n - 1}_{i = 0} a^i \Theta(n^c / b^{ci}) \\
&= n^{log_b a} + \Theta(\sum^{\log_b n - 1}_{i = 0} n^c \times a^i / b^{ci}) \\
&= n^{log_b a} + n^c \Theta(\sum^{\log_b n - 1}_{i = 0} a^i / b^{ci}) \\
\end{align*}
$$

Let:
$$
r = \frac{a}{b^c}
$$

So:

$$
T(n) = n^{\log_b a} + n^c \cdot \Theta \left(\sum_{i=0}^{\log_b n - 1} r^i \right)
$$

Now it's basic calculus to compare the order of magnitude of the two terms. When $a / b^c$ < 1, the sum term is bounded (when approaching infinity, it converges to a bound) so it's asymptotically equivalent to $\Theta(1)$. So the recurrence reduces to

$$
T(n) = n^{\log_b a} + \Theta(n^c)
$$

Since $a < b^c \Rightarrow \log_b a < c$, $n^c$ dominates:

$$
\boxed{T(n) = \Theta(n^c)}
$$


When $r = 1$,  the sum becomes:

$$
\sum_{i=0}^{\log_b n - 1} r^i = \sum_{i=0}^{\log_b n - 1} 1 = \Theta(\log n)
$$

So the recurrence reduces to:

$$
\begin{align*}
T(n)
&= n^{\log_b a} + n^c \cdot \Theta(\log n) \\
&= n^c + \Theta(n^c \log n)
\end{align*}
$$

Since $a = b^c \Rightarrow \log_b a = c$, both terms have the same polynomial order, but the logarithmic factor dominates:

The case where $r > 1$ is given as below:

$$
\begin{align*}
T(n)
&= n^{\log_b a} + n^c \cdot \Theta\left(\sum_{i=0}^{\log_b n - 1} r^i \right) \\
&= n^{\log_b a} + n^c \cdot \Theta\left(r^{\log_b n}\right) \\
&= n^{\log_b a} + n^c \cdot \Theta\left(\left(\frac{a}{b^c}\right)^{\log_b n}\right) \\
&= n^{\log_b a} + n^c \cdot \Theta\left(n^{\log_b (a/b^c)}\right) \\
&= n^{\log_b a} + \Theta\left(n^{c + \log_b (a/b^c)}\right) \\
&= n^{\log_b a} + \Theta\left(n^{\log_b a}\right) \\
&= \Theta\left(n^{\log_b a}\right)
\end{align*}
$$

And thus by analyzing all cases, we come to a result known as the **Master's Theorem**:

::TheoremBox{id="Master's Theorem"}
Given recurrence
$$
T(n) = a T(n / b) + f(n)
$$

**Master's theorem** states that when $f$ is asymptotically equivalent to a polynomial of order $c$, the asymptotic behavior of $T$ could be modeled as

$$
\boxed{
T(n) =
\begin{cases}
\Theta(n^c) & a < b^c \\
\Theta(n^c \log n) & a = b^c \\
\Theta(n^{\log_b a}) & a > b^c
\end{cases}
}
$$
::

::ExampleBox
Consider the recurrence describing the time complexity of merge sort:
$$
T(n) = 2T(n / 2) + n
$$
| Parameter | Value |
| - | - |
| $a$ | $2$ |
| $b$ | $2$ |
| $f$ | $\Theta(n^1), c = 1$ |

Applying master's theorem gives us $r = a / b^c$, so 
$$
\boxed{T(n) = \Theta(n \log n)}
$$
::

There are cases where recurrences that are not exactly in the form of divide and conquer can be converted to one:

::ExampleBox
From last quiz:
$$
T(n) = 2T(\sqrt n) + \log n
$$
::

::SpoilerBox
We can do a substitution $m := \log n$:

$$
T(m) = 2T(m / 2) + m
$$
And this becomes a standard divide-and-conquer that resolves to $T = \Theta(m \log m)$. Substituting back yields

$$
\boxed{T(n) = \Theta(\log n \log{\log n})}
$$
::

### 1x02. Generating Functions

A way of encoding sequences is called **Generating Functions**.

::DefBox{id="Generating Functions"}
Given a sequence $(a_n)$ over real numbers, its **generating function** is the polynomial
$$
\sum^{\infty}_{n = 0} a_n x^n = a_0 + a_1 x + a_2 x^2 + ..
$$
When the radius of convergence $\varrho > 0$.
::

Because recurrences are basically just infinite sequences, generating functions also apply to them.

::ExampleBox
Consider the natural exponential function $\lambda x. e^x$. By performing a MacLaurin transformation and solving for the general form of generating functions:

$$
\begin{align*}
e^x &= \sum^{\infty}_{n = 0} a_n x^n  \\
\sum^\infty_{n = 0}x^n\frac{1}{n!} &= \sum^{\infty}_{n = 0} a_n x^n  \\
\forall n, \frac{1}{n!} &= a_n
\end{align*}
$$

So the exponential function encodes the sequence 
$$
\boxed{a_n = \frac{1}{n!}}
$$
::


::Mcq
---
options:
    - "1. $a_n = n$"
    - "2. $a_n = 1$"
    - "3. $a_n = n!$"
    - "4. $a_n = (-1)^n$"
correct: 2
---

#prompt
What is the sequence $\{a_n\}$ encoded by the ordinary generating function $A(x) = \frac{1}{1-x}$ for $|x| < 1$?

#explanation
The function $\frac{1}{1-x}$ is the sum of a geometric series $\sum_{n=0}^{\infty} x^n$. Since the coefficient of each $x^n$ term is 1, the sequence being encoded is the constant sequence $a_n = 1$.
::

Let's look at a specific case. By expanding the binomial using the binomial theorem, we get
$$
(x + 1)^n = \sum^n_{k = 0} \binom{n}{k} x^k
$$

So actually a binomial $(x + 1)^n$ encodes the sequence $a_k = \binom{n}{k}$. This is extremely important, as it provides an alternative way to solve combinatorial problems.

## 2x00. More Counting
The inclusion-exclusion property of probability can be generalized to any set:

::LemmaBox{id="Inclusion-Exclusion"}
If set $A$ and $B$ are countable, then the cardinality of $A \cup B$ is 
$$
|A \cup B| = |A| + |B| - |A \cap B|
$$
::

This can be trivially understood using a Venn diagram.

::Pic
---
src: incl-excl-1.webp
alt: Visualization of Inclusion-Exclusion
---
::

::Mcq
---
options:
    - A. $270$
    - B. $350$ 
    - C. $190$
    - D. Not deducatable
correct: 3
---
#prompt
There are $150$ students who took AP Mechanics C and $120$ students who took AP Electromagnetics C, and $80$ students that took both. Assuming only those two physics courses were available, how many students took calculus-based physics courses?

#explanation
Let $A$ be the set of all students who took Mech C and $B$ the set of all students who took EM C. Then 
$$
|A| = 150 \\
|B| = 120 \\
|A \cap B| = 80
$$
And by using inclusion-exclusion we get $|A| + |B| - |A \cap B| = 150 + 120 - 80 = 190$.
::

For multiple sets, just chain the rule over and over again. In fact, there is a certain pattern to it:
$$
\begin{align*}
|A \cup B \cup C| &= |A \cup B| + |C| - |(A \cup B) \cap C| \\
&= |A \cup B| + |C| - |A \cap C \cup B \cap C| \\ 
&= (|A| + |B| - |A \cap B|) + |C| - (|A \cap B| + |A \cap B| - |A \cup B \cup B|) \\
&= (|A| + |B| + |C|) - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|
\end{align*}
$$

If you have noticed a pattern, you're right: we are indeed collecting all possible $n$-combinations of sets' intersections, adding them when $n$ is odd and subtracting when $n$ is even.

::TheoremBox{id="Inclusion-Exclusion"}
Given a family of countable sets $\mathcal{S}$, the cardinality of its disjunctive aggregation:

$$
\begin{align*}
|\bigcup \mathcal{S}| &= \sum_{0 \lt i \le |\mathcal S|}|\mathcal S_i| - \sum_{0 \lt i \lt j \le |\mathcal S|}|\mathcal S_i \cap \mathcal S_j| + \sum_{0 \lt i \lt j \lt k \le |\mathcal S|}|\mathcal S_i \cap \mathcal S_j \cap \mathcal S_k| - \dots \\
&= \sum_{\emptyset \neq J \subseteq \{1, \dots, |\mathcal{S}|\}} (-1)^{|J|-1} \left| \bigcap_{j \in J} \mathcal{S}_j \right|
\end{align*}
$$

> This generalization also applies to Kolmogorov's probability theory.

::Folding{title="Proof"}
We proceed by induction on $|\mathcal S|$.

**Base case:**
If $\mathcal{S} = \{A\}$, then

$$
\begin{align*}
\left|\bigcup \mathcal S\right| &= |A|.
\end{align*}
$$

**Inductive step:**
Assume the formula holds for any collection of $n-1$ sets. Let
$\mathcal S = \{A_1, A_2, \dots, A_n\}$ and define
$\mathcal S' = \{A_2, A_3, \dots, A_n\}$.

Then

$$
\begin{align*}
\left|\bigcup \mathcal S\right|
&= \left|A_1 \cup \bigcup \mathcal S'\right| \\
&= |A_1| + \left|\bigcup \mathcal S'\right| - \left|A_1 \cap \bigcup \mathcal S'\right|.
\end{align*}
$$

By the inductive hypothesis,

$$
\begin{align*}
\left|\bigcup \mathcal S'\right|
&= \sum_{i=2}^n |A_i|
- \sum_{2 \le i < j \le n} |A_i \cap A_j| \\
&\quad + \sum_{2 \le i < j < k \le n} |A_i \cap A_j \cap A_k|
- \cdots \\
&\quad + (-1)^{n} |A_2 \cap \cdots \cap A_n|.
\end{align*}
$$

Also,

$$
\begin{align*}
A_1 \cap \bigcup \mathcal S'
&= \bigcup_{i=2}^n (A_1 \cap A_i).
\end{align*}
$$

Applying the inductive hypothesis again,

$$
\begin{align*}
\left|A_1 \cap \bigcup \mathcal S'\right|
&= \sum_{i=2}^n |A_1 \cap A_i|
- \sum_{2 \le i < j \le n} |A_1 \cap A_i \cap A_j| \\
&\quad + \sum_{2 \le i < j < k \le n} |A_1 \cap A_i \cap A_j \cap A_k|
- \cdots \\
&\quad + (-1)^{n-1} |A_1 \cap A_2 \cap \cdots \cap A_n|.
\end{align*}
$$

Substitute both expansions:

$$
\begin{align*}
\left|\bigcup \mathcal S\right|
&= |A_1| + \left|\bigcup \mathcal S'\right| - \left|A_1 \cap \bigcup \mathcal S'\right| \\
&= |A_1|
+ \sum_{i=2}^n |A_i|
- \sum_{2 \le i < j \le n} |A_i \cap A_j| \\
&\quad + \sum_{2 \le i < j < k \le n} |A_i \cap A_j \cap A_k|
- \cdots \\
&\quad - \sum_{i=2}^n |A_1 \cap A_i|
+ \sum_{2 \le i < j \le n} |A_1 \cap A_i \cap A_j| \\
&\quad - \sum_{2 \le i < j < k \le n} |A_1 \cap A_i \cap A_j \cap A_k|
+ \cdots
\end{align*}
$$

Now group terms by intersection size:

$$
\begin{align*}
\left|\bigcup_{i=1}^n A_i\right|
&= \sum_{i=1}^n |A_i| \\
&\quad - \sum_{1 \le i < j \le n} |A_i \cap A_j| \\
&\quad + \sum_{1 \le i < j < k \le n} |A_i \cap A_j \cap A_k| \\
&\quad - \cdots \\
&\quad + (-1)^{n+1} |A_1 \cap \cdots \cap A_n|.
\end{align*}
$$

This completes the induction.
::

:Qed

::

The formalization looks very scary. Luckily, there is a much more human way to memorize the theorem: it just states that the cardinality of such a union is a big sum.

Consider for each $n$ where $0 < n \le |\mathcal{S}|$. For each $n$, we calculate all $n$-combinations of $\mathcal{S}$'s elements and compute each combination's intersection. Then we sum the cardinality of those intersections, and add them to the overall sum if $n$ is odd and subtract them from the sum when $n$ is even.

Let's take the 5-set case for example.

::ExampleBox
To find $|A \cup B \cup C \cup D \cup E|$ for countable sets $A, B, C, D, E$, we consider all $n$-combinations where $0 < n \le 5$. 

First, all $1$-combinations are just the sets themselves.

$$
|A \cup B \cup C \cup D \cup E| = |A| + |B| + |C| + |D| + |E| + ....
$$

Now, we compute the sum of cardinalities for each $2$-combinations and subtract them (because 2 is even):

$$
\begin{align*}
|A \cup B \cup C \cup D \cup E| &= |A| + |B| + |C| + |D| + |E|  \\
&- |A \cap B| - |A \cap C| ... - |B \cap C| - |B \cap D| - ....
\end{align*}
$$

Now adding the $3$-combinations since $3$ is odd:

$$
\begin{align*}
|A \cup B \cup C \cup D \cup E| &= |A| + |B| + |C| + |D| + |E| \\
&- |A \cap B| - |A \cap C| ... - |B \cap C| - |B \cap D| - ... \\
&+ |A \cap B \cap C| + |A \cap B \cap D| + ... \\
\end{align*}
$$

And the $4$-combinations:
$$
\begin{align*}
|A \cup B \cup C \cup D \cup E| &= |A| + |B| + |C| + |D| + |E|  \\
&- |A \cap B| - |A \cap C| ... - |B \cap C| - |B \cap D| - ... \\
&+ |A \cap B \cap C| + |A \cap B \cap D| + ... \\
&- |A \cap B \cap C \cap D| - |A \cap B \cap C \cap E| - ... \\
\end{align*}
$$

The $5$-combination is just the intersection across all the five sets:
$$
\begin{align*}
|A \cup B \cup C \cup D \cup E| &= |A| + |B| + |C| + |D| + |E|  \\
&- |A \cap B| - |A \cap C| ... - |B \cap C| - |B \cap D| - ... \\
&+ |A \cap B \cap C| + |A \cap B \cap D| + ... \\
&- |A \cap B \cap C \cap D| - |A \cap B \cap C \cap E| - ... \\
&+ |A \cap B \cap C \cap D \cap E|
\end{align*}
$$
::

Let's test the inclusion-exclusion principle with an example.

::Mcq
---
options:
    - A. 120
    - B. 130
    - C. 140
    - D. 150
correct: 2
---
#prompt
Suppose sets $A$, $B$, and $C$ have $|A| = 50$, $|B| = 60$, and $|C| = 70$. The pairwise intersections are $|A \cap B| = 20$, $|A \cap C| = 15$, and $|B \cap C| = 20$. The triple intersection is $|A \cap B \cap C| = 5$.

What is $|A \cup B \cup C|$?

#explanation
Apply the inclusion-exclusion principle for three sets:

$$
\begin{aligned}
|A \cup B \cup C| &= |A| + |B| + |C| \\
                  &\quad - |A \cap B| - |A \cap C| - |B \cap C| \\
                  &\quad + |A \cap B \cap C| \\
                  &= 50 + 60 + 70 - 20 - 15 - 20 + 5 \\
                  &= 180 - 55 + 5 \\
                  &= 130.
\end{aligned}
$$

Thus, the cardinality of the union is 130.
::

