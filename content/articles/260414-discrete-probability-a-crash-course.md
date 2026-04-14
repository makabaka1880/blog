---
title: Discrete Probability - A Crash Course
description: Part 2 of a 3 Part Mid
createTime: 2026-04-14
updateTime: 2026-04-14
---

## 1x00. Formalization of Probability Theory
### 1x01. Classical Probability

In the 16<sup>th</sup> century the Italian mathematician Cardano, a heavy gambler, attempted to use mathematis to describe the outcome of games. He hit upon the following definition:

::TheoremBox{id="Classical Probability"}
Let $A$ be one of the events that could happen during an experiment. Then the probability $P(A)$ is calculated as
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


::Qabox{type=question}
Imagine that Fermat and Pascal are playing a simple game,whereby a coin is repeatedly tossed. Fermat wins as soon as the coin hasturned up heads six times, Pascal wins as soon as the coin has turned uptails six times.There are 24 gold pieces in the pot. Now the game is interrupted when thecoin has already turned up 5 tails and 4 heads. How to divide the pot?
::

The idea is that the pot should be divided proportional to the probability of each player winning. Fermat can only win if the coin turns up heads in each of the next two tosses. Pascal wins in any other case.

::Qabox{type=answer}
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

Now that events are formalized using naïve set theory, we can apply counting arguments to it.

::Qabox{type=question}
We roll a four-sided dice 10 times. What is the probability of obtaining 5 ones, 3 twos, 1 three and 1 four?
::

The key is counting the cardinality of the such event. 

::SpoilerBox
Notice that $5 + 3 + 1 + 1 = 10$.
::