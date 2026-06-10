---
title: Discrete Probability - A Crash Course
description: Part 2 of 3-Part Mid-term Preparation Material
createTime: 2026-04-14
updateTime: 2026-04-14

tag:
    - Discrete Mathematics
---
## 0x00. Notation and Nomenclature
**Partial Application** of a function refers to fixing one input of a multi-arity function. For example, given this function:
$$
f(x, y) = x + y
$$
A partial application $f(\cdot, 3)$ is the function $\lambda x. x + 3$. The dot in the function just meant fill the new parameter here.

::Mcq
---
options:
    - "1. $\lambda x. x + 5$"
    - "2. $\lambda x. x \cdot 5$"
    - "3. $\lambda x. x - 5$"
    - "4. $\lambda x. x \div 5$"
correct: 2
---

#prompt
Given the function $f(x, y) = x \cdot y$, what is the partial application $f(\cdot, 5)$?

#explanation
Partial application fixes the second argument to $5$, resulting in the function $\lambda x. x \cdot 5$.
::

## 1x00. Formalization of Probability Theory
### 1x01. Classical Probability

In the 16<sup>th</sup> century the Italian mathematician Cardano, a heavy gambler, attempted to use mathematis to describe the outcome of games. He hit upon the following definition:

::TheoremBox{id="Classical Probability"}
Let $A$ be one of the events that could happen during an experiment. Then the **probability** $P(A)$ is calculated as
$$
P(A) := \frac{\text{Number of ways leading to }A}{\text{Number of ways an experiment can proceed}}
$$
::

::ExampleBox
Given a coin. After tossing and catching, it is guaranteed that it is equally likely to obtain heads or tails. Calculate the classical probability that we get *heads*.
$$
P(A) := \frac{ |\{\text{Tosses Heads}\}| }{ |\{\text{Tosses Heads}, \text{Tosses Tails}\}| } = \frac{1}{2} = 0.5
$$
::

Cardano's work although published, received little attention, and 100 years later, in the middle of the 17th century, the two French mathematicians Fermat and Pascal rediscovered his principles, also by considering games. They discussed how to divide the jackpot if a game in progress is interrupted.


::QaBox{type=question}
Imagine that Fermat and Pascal are playing a simple game,whereby a coin is repeatedly tossed. Fermat wins as soon as the coin hasturned up heads six times, Pascal wins as soon as the coin has turned uptails six times.There are 24 gold pieces in the pot. Now the game is interrupted when thecoin has already turned up 5 tails and 4 heads. How to divide the pot?
::

The idea is that the pot should be divided proportional to the probability of each player winning. Fermat can only win if the coin turns up heads in each of the next two tosses. Pascal wins in any other case.

::QaBox{type=answer}
We can enumerate all possible outcomes of the remaining (at most 2) tosses:

| Toss 1 | Toss 2 | Winner |
|--------|--------|--------|
| Heads | Heads | **Fermat** (reaches 6 heads) |
| Heads | Tails | **Pascal** (reaches 6 tails) |
| Tails | — | **Pascal** (reaches 6 tails immediately) |

Since each toss is fair, we treat the "Tails / —" branch as two equally likely sub-outcomes (Tails, Heads) and (Tails, Tails) that both go to Pascal. This gives us four equally likely outcomes over two tosses:

| Outcome | Winner |
|---------|--------|
| Heads, Heads | **Fermat** |
| Heads, Tails | **Pascal** |
| Tails, Heads | **Pascal** |
| Tails, Tails | **Pascal** |

Only **1 out of 4** outcomes results in Fermat winning, so:

$$
P(\text{Fermat wins}) = \frac{1}{4}, \qquad P(\text{Pascal wins}) = \frac{3}{4}
$$

The pot of 24 gold pieces is therefore divided proportionally:

$$
\begin{align*}
\text{Fermat receives} \quad &\frac{1}{4} \times 24 = 6 \text{ gold pieces} \\
\text{Pascal receives} \quad &\frac{3}{4} \times 24 = 18 \text{ gold pieces}
\end{align*}
$$
::

::Mcq
---
options:
    - "1. $\\dfrac{1}{4}$"
    - "2. $\\dfrac{3}{8}$"
    - "3. $\\dfrac{1}{2}$"
    - "4. $\\dfrac{5}{8}$"
correct: 2
---

#prompt
A fair coin is tossed 4 times. What is the probability of obtaining exactly 2 heads?

#explanation
There are $2^4 = 16$ equally likely outcomes. The number of outcomes with exactly 2 heads is $\binom{4}{2} = 6$. Therefore, the probability is $\frac{6}{16} = \frac{3}{8}$.
::

### 1x02. Sample Spaces and Sample Points
The techniques of counting permutations, combinations and sorting into classes are very useful for evaluating probabilities by the classical definition. First, however, we need to translate physical situations into a mathematical context.

The formalization of "possible outcomes" and "events leading to $A$" is called **sample space** and **sample points**.

::DefBox{id="Sample"}
A **sample space** for an experiment is a set $S$  such that each physical outcome of the experiment corresponds to exactly one element of $S$. Those elements are called **sample points**.
::

::NoteBox
Not every element of a sample space must correspond to an actual physical outcome of an event. For example, to model a dice roll, I can definitely choose $S = \mathbb{N}$, even though only $1, 2, 3, 4, 5, 6 \in S$ are sensible events.
::

Samples are merely a single outcome of an experiment. To describe an aggregation or collection of outcomes, we need events.

::DefBox{id="Event"}
Any subset $A$ of a sample space $S$ is called an **event**. Two event are called **mutually exclusive** if they are disjoint.
::

Therefore we can update our definition of probability:

::DefBox{id="Classical Probability"}
Given sample space $S$ corresponding to all the outcomes of a specific experiment, the probability of an event $A$ is
$$
P(A) = \frac{|A|}{|S|}
$$
::

::ExampleBox
Consider rolling a four-sided die 10 times. A natural sample space is $S = \mathbb{N}^{10}$, where each sample point is a 10-tuple recording the result of each roll in order. For instance,

$$
(1, 2, 3, 2, 3, 3, 1, 1, 4, 4) \in \mathbb{N}^{10}
$$

corresponds to first rolling a 1, then a 2, next a 3, followed by a 2, a 3, a 3, two 1s and two 4s.

An event might correspond to "rolling at least two fours", which is the subset $A \subset S$ of all 10-tuples with at least two entries equal to 4. For example,

$$
(1, 2, 3, 2, 3, 3, 1, 1, 4, 4) \in A \qquad \text{but} \qquad (1, 2, 3, 2, 3, 3, 1, 1, 3, 4) \notin A.
$$
::
::Mcq
---
options:
    - "1. $\\{1, 2, 3, 4, 5, 6\\}$"
    - "2. $\\{0, 1\\}$"
    - "3. $\\{heads, tails\\}$"
    - "4. All of the above"
correct: 1
---

#prompt
Which of the following is a valid sample space for rolling a fair six-sided die?

#explanation
A sample space must contain all possible outcomes of the experiment. For a fair six-sided die, the possible outcomes are the numbers 1 through 6. Option 1 is the correct sample space. Option 2 represents a binary outcome, not a die roll. Option 3 represents a coin flip. Option 4 is incorrect because not all options are valid sample spaces for a die roll.
::

Now that events are formalized using naïve set theory, we can apply counting arguments to it.

::QaBox{type=question}
We roll a four-sided dice 10 times. What is the probability of obtaining 5 ones, 3 twos, 1 three and 1 four?
::

The key is counting the cardinality of the such event. 

::SpoilerBox
Notice that $5 + 3 + 1 + 1 = 10$. Therefore the each sample point corresponds to a different order in which those rolls appear -- a **permutation** of $s = \{5(1), 3(2), 1(3), 1(4)\}$. The rest is much easier:
$$
|A| = \frac{10!}{5! \times 3! \times 1! \times 1!} = 5040
$$
And plug in the formula for classical probability:
$$
P(A) = \frac{|A|}{|S|} = \frac{5040}{4^10} \approx 0.48%
$$
::


::Mcq
---
options:
    - "1. $\\dfrac{\\binom{4}{1} \\cdot \\binom{6}{2,2,2}}{4^6}$"
    - "2. $\\dfrac{\\binom{4}{1} \\cdot \\binom{6}{2,2,2}  \\cdot 3!}{4^6}$"
    - "3. $\\dfrac{\\binom{4}{1} \\cdot \\binom{5}{2,2,1}}{4^6}$"
    - "4. $\\dfrac{\\binom{6}{2,2,2}}{4^6}$"
correct: 1
---

#prompt
There are 4 distinct boxes, initially empty. A distributing system puts 6 balls randomly into the 4 boxes with equal probability. What is the probability that **exactly one** box is empty and **each of the remaining three boxes contains exactly 2 balls**?

#explanation
The sample space is all functions $f: \{1,\ldots,6\} \to \{1,2,3,4\}$, giving $|S| = 4^{6}$.

1. **Choose which box is empty**: $\binom{4}{1} = 4$ ways.
2. **Distribute 6 balls into the remaining 3 boxes, exactly 2 each**: this is a multinomial coefficient $\binom{6}{2,2,2} = \dfrac{6!}{2!\,2!\,2!}$, assigning 2 specific balls to each of the 3 specific boxes.

So:
$$
P = \frac{\binom{4}{1} \cdot \binom{6}{2,2,2}}{4^{6}}
$$

Option 2 is a trap — the extra $3!$ would make sense if the three boxes were *unlabelled* and needed to be assigned, but they are already distinct, so the multinomial coefficient handles the assignment directly.
::

### 1x02. Axiomatic Formalization of Probability

The thing with classical probability is that "equally possible" is not something quantifiable and formalizable. Saying events are equally possible is basically saying that they are equal in probability, which starts a circular definition.

In the beginning of the 20<sup>th</sup> century, the Russian mathematician Kolmogorov decided to base probability on a solid and formal mathematical foundation. Using measures and sets, he defined a formal system that completely sidesteps any pragmatic assumptions and thus mathematically rigorous.

::DefBox{id="Axiomatic Probability"}
Let $S$ be a sample space and $\mathcal{P}(S)$ the power set of $S$. Then a function $P : \mathcal{P}(S) \to \mathbb{R} := A \mapsto P(A)$ is called a **probability function** on $S$ if
1. $P \geq 0$ (Non-negativity)
2. $P(S) = 1$ (Normalization)
3. $\forall \{A_k\} \subseteq \mathcal{P}(A)$ such that every $A_k$ are mutually disjoint, (Countable additivity)
$$
P(\cup_{a \in \{A_k\}} a) = \sum_{a \in \{A_k\}} P(a)
$$
::

Note that Kolmogorov used a power set instead of the set of all combinations over $S$. Even though the two are virtually the same thing, common practice in formalization is to erase a system off pollution from any semantic meaning.

::NoteBox
Axiomatic formalizations are very hard to understand to an unprepared mind. I here give a common interpretation of each axiom to help you guys in understanding. But remember, Kolmogorov only provided a formal framework for analysis; there is no standarad interpreation.

Each sample in an sample space is considered as a certain outcome of an event. By forming a set over certain samples, we construct an event that is considered occuring if any of those samples occurs.

1. Probability of any event is always non-negative
2. The probability of something happening (i.e. the entire sample space) is 1.
3. For any countable collection of mutually exclusive events, the probability that any one of them occurs is the sum of their individual probabilities.

::ExampleBox
Let's analyze a coin toss $S = \{H, T\}$. The set of all events $\mathcal{P}(S)$ is $\{\emptyset, \{H\}, \{T\}, \{H, T\}\}$. Then we can bring over the same probability function from our previous examples but show that it conforms to the axioms.
| Event | $P$ |
| - | - |
| $\emptyset$ | $0$ |
| $\{H\}$ | $0.5$ |
| $\{T\}$ | $0.5$ |
| $\{H, T\}$ | $1$ |

Firstly, $P$ is bounded above $0$. Axiom 1 check.

Secondly, the probability of tossing a head or tails is $1$. Axiom 2 check.

Thirdly a direct enumeration easily proves that any such combination of events satisfies Axiom 3. Check.

Therefore, our $P$ is a valid probability over $S$.
::
::
::Mcq
---
options:
    - "1. Axiom 1 (Non-negativity)"
    - "2. Axiom 2 (Normalization)"
    - "3. Axiom 3 (Countable additivity)"
    - "4. None of the above"
correct: 2
---

#prompt
Which of Kolmogorov's axioms ensures that the probability of the entire sample space is equal to 1?

#explanation
Axiom 2 states that $P(S) = 1$, where $S$ is the sample space. This is the normalization axiom.
::

A commonly used corollary is the probability that nothing happens is $0$.

::CorollaryBox{id="Impossibility of Vacant Samples"}
Given sample space $S$ and a probability over it $P$. Then
$$
P(\emptyset) = 0
$$
::Folding{title="Proof"}
Take any event $A$. From axiom 3,
$$
\begin{align*}
P(A \cup \emptyset) &= P(A) + P(\emptyset) \\
P(A) &= P(A) + P(\emptyset) \\
P(\emptyset) &= 0
\end{align*}
$$
:Qed
::
::

Other corollaries include the probability of complement:
::CorollaryBox{id="Complement Probability"}
Given sample space $S$ and a probability over it $P$. Then for any event $A \subseteq S$,
$$
P(\overline A) = 1 - P(A)
$$

::Folding{title="Proof"}
Because $A$ and $\overline A$ are disjoint,
$$
\begin{align*}
P(A \cup \overline A) &= P(A) + P(\overline A) \\
P(S) &= P(A) + P(\overline A) \\
P(\overline A) &= 1 - P(A)
\end{align*}
$$

:Qed 
::
::

From these, one can derive the inclusion-exclusion principle:

::TheoremBox{id="Inclusion-Exclusion under Kolmogorov Probability"}
Given sample space $S$ and a probability over it $P$. Then for any two events $A, B \subseteq S$,
$$
P(A \cup B) = P(A) + P(B) - P(A \cap B)
$$
:::Folding{title="Proof"}
Decompose $A \cup B$ into three pairwise disjoint parts:
$$
A \cup B = (A \setminus B) \cup (A \cap B) \cup (B \setminus A)
$$
By axiom 3:
$$
P(A \cup B) = P(A \setminus B) + P(A \cap B) + P(B \setminus A)
$$
Now note that $A \setminus B$ and $A \cap B$ are also disjoint with union $A$, so again by axiom 3:
$$
P(A) = P(A \setminus B) + P(A \cap B) \implies P(A \setminus B) = P(A) - P(A \cap B)
$$

and symmetrically $P(B \setminus A) = P(B) - P(A \cap B)$.
Substituting back:
$$
\begin{align*}
P(A \cup B) &= P(A) - P(A \cap B) + P(A \cap B) + P(B) - P(A \cap B) \\
            &= P(A) + P(B) - P(A \cap B)
\end{align*}
$$
:Qed
:::
::

Notice that the inclusion-exclusion implies *Boole's Inequality*:
$$
P(A \cup B) \leq P(A) + P(B)
$$

Another important property is the monotonicity of probability with inclusion order:

::CorollaryBox{id="Monotonicity of Probability"}
Given sample space $S$ and a probability over it $P$. Then for any two events $A, B \subseteq S$ with $A \subseteq B$,
$$
P(A) \leq P(B)
$$
:::Folding{title="Proof"}
Since $A \subseteq B$, we can decompose $B$ into two disjoint parts:
$$
B = A \cup (B \setminus A)
$$
By axiom 3:
$$
P(B) = P(A) + P(B \setminus A)
$$
By axiom 1, $P(B \setminus A) \geq 0$, so:
$$
P(B) \geq P(A)
$$
:Qed
:::
::

A general way of using Kolmogorov's work is more like a check then a construction. We use Cardano's interpretation of probability to construct a pragmatically justified probability function, and check them against Kolmogorov's axioms to see if it actually works.

::ExampleBox
Modeling a two rolls of a four-faced dice. If we are considering the order, then the sample space can be modeled as $\{1, 2, 3, 4\}^2$ and probability
$$
P(A) = \frac{|A|}{4 \times 4} = \frac{|A|}{16}
$$

Axiom 1 and 2 are easy to check against. 

Now select any disjoint $A$ and $B$. 
$$
\begin{align*}
P(A \cup B) &= \frac{|A \cup B|}{16} \\
&= \frac{|A| + |B|}{16} \\
&= \frac{|A|}{16} + \frac{|B|}{16} = P(A) + P(B)
\end{align*}
$$
Axiom 3 is now satisfied. Therefore, $P$ is a valid probability.
::

::Mcq
---
options:
    - "1. Correct"
    - "2. Wrong — Axiom 1 unsatisfied"
    - "3. Wrong — Axiom 2 unsatisfied"
    - "4. Wrong — Axiom 3 unsatisfied"
correct: 3
---

#prompt
Consider the sample space $S = \{1, 2, 3, 4, 5, 6\}$ modeling a single roll of a six-sided die, with the proposed probability function:
$$
P(A) = \frac{|A|}{5}
$$
Is $P$ a valid Kolmogorov probability function?

#explanation
Axiom 1 is satisfied — $|A| \geq 0$ always, so $P(A) \geq 0$. ✓

Axiom 3 is satisfied — for disjoint $A, B$:
$$
P(A \cup B) = \frac{|A \cup B|}{5} = \frac{|A| + |B|}{5} = P(A) + P(B) \checkmark
$$

But **Axiom 2 fails** — the entire sample space $S$ has $|S| = 6$, so:
$$
P(S) = \frac{6}{5} \neq 1
$$

The mistake is easy to miss at a glance since $5$ looks plausible for a die — but the correct denominator must be $|S| = 6$, not $5$. Always sanity-check $P(S) = 1$ first!
::

### 1x03. Conditional Probability

Some of you might already begin to notice a the connection between Kolmogorov probability and logical constructions:

| Probability | Logic |
| - | - |
| $A \cap B$ | $A \wedge B$ |
| $A \cup B$ | $A \vee B$ |
| $\overline A$ | $\neg A$ |
| $S$ | $\top$ |
| $\emptyset$ | $\bot$ |
| ??? | $A \implies B$ |

However, implication and causation hasn't been covered in Kolmogorov's framework. It was only until the Bayesian Revolution in the 18th century that we began to treat these probabilities not just as frequencies of dice rolls, but as degrees of belief. Based on this school of thought, **Bayesian Analysis** was born.

The core though revolves around something known as **conditional probability**.

::DefBox{id="Conditional Probability"}
Given events $A$ and $B$ over the same sample space, the **conditional probability** of $A$ given $B$, denoted as $P(A | B)$, is the probability that event $A$ occurs on the occurance of event $B$.
::

::WarningBox
Here, $A | B$ is purely a syntatic sugar for denoting the probability of $A$ given $B$. It is **NOT** a new event.
::

A great way to conceptualize conditional probability is that it simply doesn't care about what happens when the condition isn't met. We can view this as a transformation that collapses the entire sample space down into the subset $B$.

"A common way to do this is by taking the probability of both $A$ and $B$ occurring ($A \cap B$) and dividing it by the probability of $B$ to normalize the result to the new sample space."

::LemmaBox{id="Bayesian Conditional Probability"}
Given two events $A$ and $B$ over the same sample space, the **conditional probability** that $A$ happens given $B$ is
$$
P(A | B) = \frac{P(A \cap B)}{P(B)}
$$
Partial application $P(\cdot | B)$ is a Kolmogorov probability function if $P(B) \neq 0$
::Folding{title="Proof"}
Fix an event $B$ over sample space $S$. Then for any event $A$:

$$
P(A | B) = \frac{P(A \cap B)}{P(B)}
$$
Because $P$ is a Kolmogorov probability over $S$, then the fraction should always be non-negative.

Now plug in $S$:

$$
P(S | B) = \frac{P(B \cap S)}{P(B)} = \frac{P(B)}{P(B)}.
$$
Because $P(B) \neq 0$, this reduces to $1$. Now for any disjoint family of events $\mathcal{A} = \{A_k\}$ indexed by $k$:
$$
\begin{align*}
P(\bigcup \mathcal{A} | B) &= \frac{P(\bigcup \mathcal{A} \cap B)}{P(B)} \\
&= \frac{P(\bigcup_{A \in \mathcal{A}} (A \cap B))}{P(B)} \\
&= \frac{P\left(\bigcup_{A \in \mathcal{A}} (A \cap B)\right)}{P(B)} \\
\end{align*}
$$

Since $\{A_k\}$ are disjoint, the sets $\{(A_k \cap B)\}$ are also pairwise disjoint. By the **Countable Additivity** axiom of the original probability measure $P$, we have:

$$
\begin{align*}
\frac{P\left(\bigcup_{A \in \mathcal{A}} (A \cap B)\right)}{P(B)} &= \frac{\sum_{A \in \mathcal{A}} P(A \cap B)}{P(B)} \\
&= \sum_{A \in \mathcal{A}} \frac{P(A \cap B)}{P(B)} \\
&= \sum_{A \in \mathcal{A}} P(A \mid B)
\end{align*}
$$
:Qed
::
::

::ExampleBox
Imagine you are looking at your morning commute. The sample space S contains all possible mornings.

- **Event A** You are late for work.
- **Event B** It is raining.

In Kolmogorov's "global" view, $P(A)$ is the probability you are late across all possible weather conditions.

However, when we calculate $P(A | B)$, we throw away every sunny, cloudy, or snowy day in our data. We "zoom in" until the boundaries of our universe are the boundaries of $B$. If you are late on 10 days out of 100 total days, but 8 of those late arrivals happened on the 20 days it rained, then:
$$
P(A | B) = \frac{8}{20} = 40%
$$
::

Sometimes, conditionals does not effect the calculation of the probability of a specific event.

::DefBox{id="Independent Events"}
Two events $A$ and $B$ are consider **independent** if $P(A \cap B) = P(A) \times P(B)$.
Corollaries include that 
$$
\begin{align*}
P(A | B) &= P(A) && \text{if } P(B) \neq 0 \\
P(B | A) &= P(B) && \text{if } P(A) \neq 0
\end{align*}
$$
::

Let's look at another example:

::ExampleBox
Consider a hashing function mapping $n$ values into $m$ slots. When $m > n$, its appaperent from pigeonhole that collisions happens. The question is, what is the probability that no collision happens for $k$ hashes?

Let's model the problem using probabilities. Because hashing is deterministic, the probability distribution each time a hashing is conducted is independent of each other. 

Let the collision events be a family $\mathcal{C}$ indexed by $i$. For a case where $i$ slots are already occupied, its apparent from classical probabilities that
$$
P(C_i) = \frac{m - i}{m}
$$
And because $\mathcal{C}$ is a family of mutually independent events, we could just multiply them together to get the probability that all of them occurs
$$
P(\bigcap \mathcal{C}) = \prod^{n - 1}_{i = 0} \frac{m - i}{m} = \frac{m!}{(m - n)! \times m^n}
$$
The probability that one collision happens at least once is given by $1 - P(\bigcap \mathcal C)$. A famous asymptotic argument proved that this probability is more then 50% when $n \ge 1.177 \sqrt{m}$


::NoteBox
This is actually isomorphic to the birthday problem.

Let $m = 365$ (representing the slots/days in a year) and let's calculate the probability for a group of $n = 23$ people.

Using the product formula derived above:
$$P(\text{No Collision}) = \prod_{i=0}^{22} \frac{365 - i}{365} = \frac{365}{365} \cdot \frac{364}{365} \cdot \dots \cdot \frac{343}{365}$$

When we compute this, we find:
$$P(\text{No Collision}) \approx 0.4927$$

Consequently, the probability that **at least one** collision occurs is:
$$P(\text{At least one collision}) = 1 - 0.4927 = 0.5073$$

This confirms the "1.177 rule": for $m = 365$, our threshold is $n \approx 1.177 \sqrt{365} \approx 22.49$. With just 23 people, it is more likely than not that two share a birthday. In the context of your software engineering stack, this is why a 64-bit hash (where $m = 2^{64}$) starts seeing significant collision risks once you hit $n \approx 2^{32}$ entries, not $2^{64}$.
::
::
::Mcq
---
options:
    - "1. $0.2$"
    - "2. $0.4$"
    - "3. $0.5$"
    - "4. $0.8$"
correct: 2
---

#prompt
If $P(A) = 0.4$, $P(B) = 0.5$, and $P(A \cap B) = 0.2$, what is $P(A \mid B)$?

#explanation
Conditional probability is defined as $P(A \mid B) = \frac{P(A \cap B)}{P(B)} = \frac{0.2}{0.5} = 0.4$.
::

### 1x04. Tree Diagrams and Bayesian Analysis
> I'll skip tree diagrams for now since Im too lazy to sketch them up.

### 1x05. Monte Carlo Algorithms
Most of the algorithms we have encountered in discrete mathematics so far are *deterministic*. This meant that for a given set of input, the algorithm is guaranteed to return the same output. 

> A stronger definition requires that the algorithm to execute a fixed sequences of steps

There is a class of algorithms known as **probabilistic** algorithms that is dependent on a random variables. Among them the most famous is perhaps the **Monte-Carlo** simulation.

::DefBox{id="Monte Carlo Algorithms"}
Formally, a **Monte Carlo (MC) method** is any algorithm that uses statistical sampling to obtain a numerical approximation of a deterministic value.
::

Lets look at an example. 

::QaBox{type=question}
You are on a game show. In front of you are three door, behind one of the doors is a grand prize. After you choose the door you want to open, the host opens another door that is guaranteed to have no prize behind it. Prove that switching to the other door the host didn't open maximizes your probability of winning the prize.
::

For those in APCSA, try to implement the algorithm in Java 8.

::SpoilerBox
```java
public class MontyHall {
    static final int EPOCH_CNT = 100000;
    public static void main(String args[]) {
        int switch_cnt = 0;
        for (int i = 0; i < EPOCH_CNT; i++) {
            // Fix door selection to first one.

            int prize = (int) (Math.random() * 3);
            if (prize != 0) switch_cnt++;

        }
        System.out.println("Switch: " + switch_cnt + ", Didn't: " + (EPOCH_CNT - switch_cnt));
        System.out.println("Win rate: " + ((double) switch_cnt / EPOCH_CNT));
    }
}
```
A typical run outputs something like
```
Switch: 66594, Didn't: 33406
Win rate: 0.66594
```
::

Another famous monte carlo algorithm is known as **Miller's Test**. A naïve primarity test would require $O(2^n)$ time to solve the problem, which is far too long for practical applications.

In 1976, Gary L. Miller discovered a primarity test. Miller's version of the test is deterministic, but its correctness relies on the unproven extended Riemann hypothesis. Michael O. Rabin modified it to obtain an unconditional probabilistic algorithm in 1980, which is the **Miller-Rabin Test**, or Miller's Test for short, we have today.

::DefBox{id="Miller-Rabin Test"}
Let $n \in \mathbb{N}$ such that there exists $s \in \mathbb{N}$ and an odd integer $t$ such that $n - 1 = 2^s t$. Then $n$ is said to pass the **Miller-Rabin Test** to **Base** $b$ if either
$$b^t \equiv 1 \pmod{n} \quad \text{or} \quad b^{2^j t} \equiv -1 \pmod{n}$$
for some $j$ with $0 \le j \le s - 1$. 

- If $n$ is prime and $1 < b < n$, then $n$ passes Miller's Test to Base $b$.
- If $n$ is composite, then there are fewer than $n/4$ Bases $b$ with $1 < b < n$ such that $n$ passes Miller's Test to Base $b$.

A **Monte Carlo Algorithm** to determine whether $n$ is composite will perform Miller's Test for $k$ randomly selected Bases $b$.
::