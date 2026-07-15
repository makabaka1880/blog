---
title: APCSA - Recursion
description: AP Computer Science A Lecture 6 — recursion, base cases, recursive cases, Fibonacci numbers, staircase and grid-path problems, mutual recursion, and translating recurrence relations into Java code
createTime: 2026-07-14
updateTime: 2026-07-14

tags:
    - APCSA
ligatures: false
---

## 0x00. Self-Reference — When a Function Calls Itself

### 0x01. The Loop You Already Know

By now you've written loops. You know how to repeat a block of code with `while` and `for`:

```java
// Sum 1 to n with a while-loop
int sum = 0;
int i = 1;
while (i <= n) {
    sum = sum + i;
    i = i + 1;
}
```

A loop works by **maintaining state** — a counter `i` and an accumulator `sum` — and mutating them until a condition flips. You, the programmer, manage that state explicitly. You set up the counter. You increment it. You check the boundary. Every iteration is a small, manual step toward the answer.

This works. But it's not the only way to repeat computation.

There's another approach — one that doesn't track counters or mutate accumulators. Instead, it breaks the problem into **a smaller version of itself**, solves that, and combines the results. This is **recursion**.

### 0x02. A Function That Mentions Itself

::DefBox{id="Recursion"}
**Recursion** is a technique where a function calls itself — directly or indirectly — to solve a problem by reducing it to a smaller instance of the same problem.

A recursive function must contain exactly two parts:

1. **Base Case(s)** — the stopping condition. When the problem is small enough to solve directly, you return a concrete answer. No further recursive calls.
2. **Recursive Case(s)** — the reduction step. You express the answer for size $n$ in terms of the answer for smaller sizes, and call the function again.
::

The idea is ancient. Mathematicians have defined sequences this way for centuries: "the next term is the sum of the previous two." "The factorial of $n$ is $n$ times the factorial of $n-1$." Defining something in terms of itself isn't circular — as long as you also define where it bottoms out.

::ExampleBox
**Factorial — the simplest non-trivial recursion.** The factorial of $n$, written $n!$, is:

$$
n! = n \times (n-1) \times (n-2) \times \cdots \times 2 \times 1
$$

In words: multiply every integer from $n$ down to $1$. But look closely — after pulling out the first factor $n$, what's left is... $(n-1)!$. So we can write it recursively:

$$
n! = \begin{cases}
1 & \text{if } n = 0 \text{ or } n = 1 \quad \text{(base case)} \\
n \times (n-1)! & \text{otherwise} \quad \text{(recursive case)}
\end{cases}
$$

The base case stops the recursion. Why is $0! = 1$? Because the **empty product** — multiplying nothing at all — is defined as the multiplicative identity, $1$. Just like an empty sum is $0$, an empty product is $1$. Without this base, the recursive definition would never terminate.
::

::NoteBox
**Why $0! = 1$ — a deeper look.** The gamma function $\Gamma(n)$ generalizes factorial to real and complex numbers, and $\Gamma(n) = (n-1)!$ for positive integers. Setting $n = 1$ gives $\Gamma(1) = 0! = 1$. But you don't need the gamma function to justify this. The combinatorial definition is simpler: $n!$ counts the number of ways to arrange $n$ distinct items. There is exactly one way to arrange zero items: do nothing. That one way corresponds to $0! = 1$.

This is the same reasoning that makes $a^0 = 1$ for any $a \neq 0$. An empty product is always the identity.
::

### 0x03. Where Recursion Comes From — Induction on Data

::WarningBox
**This section is optional.** In 0x03, we'll take a short detour into type theory — the branch of theoretical computer science where recursion was first formalised. If you've ever wondered *why* recursion works the way it does, or what it has to do with the product types we built last lecture, this section answers those questions.

It has nothing to do with the APCSA curriculum. If you'd rather stay focused on what's tested, skip ahead to [0x04](#_0x04-recursion-vs-loops-whats-the-difference). The rest of the notes — Fibonacci, staircase problems, grid paths, mutual recursion — are completely accessible without it.
::

Before we compare recursion to loops, let's step back and ask a deeper question: **where does the idea of recursion even come from?**

In the last lecture, we discussed the essentials of **constructing new types**. We learned that a product bundles $A$ and $B$ together, and that you construct it by providing an $a$ and a $b$. We learned that constructors are the *only* way to create values of a type.

Now we turn to a new question: once you've constructed a type, **how do you define a function that uses it?**

This question has a remarkably clean answer — one that works for *every* type you can construct. It's called **induction**.

#### What Is Induction?

Imagine someone hands you a value of some type. You don't know which constructor was used to build it. But you **do** know all the possible constructors — because the type was defined by listing them.

Induction is the principle that, to define a function on a data type, you handle each constructor separately:

::DefBox{id="Induction — The Core Idea"}
**Induction** is the mechanism of defining a function on a data type by providing **one case for each way the data can be constructed.**

You hand the inductor your case functions. The inductor then gives you back a single, complete function — one that examines how any given value was built and automatically routes it to the right case.

There's no trick. The principle is purely about **covering all the possibilities**: every value of the type was built by some constructor, so if you've handled every constructor, you've handled every value.
::

::ExampleBox
**An informal analogy — the office clerk.** Imagine you work at a government office. Citizens submit forms, and there are only three kinds: **tax returns**, **permit applications**, and **complaints**.

To define a "process" function for any form, you give the office clerk three sets of instructions:

1. If the form is a tax return → send it to the tax department.
2. If the form is a permit application → send it to the planning department.
3. If the form is a complaint → send it to customer service.

The clerk (the **inductor**) sits at the front desk. Every time a form arrives, the clerk looks at it, figures out which kind it is, and routes it to the department you specified. You never have to write "first check what kind of form this is, then..." — the clerk does that for you. You just provide the three cases.

That's induction: **you say what to do for each constructor. The inductor handles the routing.**
::

This might sound abstract. Let's make it concrete by starting with the simplest type we already know — the pair — where no recursion is needed at all.

#### Induction on Pairs — A Function Without Recursion

Recall from Lecture 5: a pair (product) of $A$ and $B$ has exactly one constructor — `construct`. It takes two arguments: an $a : A$ and a $b : B$, and returns the pair $(a, b) : A \times B$.

Now suppose you want to define a function $f : A \times B \to C$ — a function that takes a pair and returns a $C$. What information do you need to provide?

```java
// Remember, here's a canonical definition of a pair:
// Here, A and B are all types.
// Maybe it's `int`, or `bool`, or `double`.
// Doesn't matter.
public class Pair {
    public A a;
    public B b;
}
```
**One case, matching the one constructor.** The constructor takes $a$ and $b$:

```java
Pair p = new Pair(/* some a */, /* some b */)
```

 so your case must also mention $a$ and $b$. You provide a function of shape:

```java
C conj(A a, B b) { ... }
```

Read as: "given an $a$ and a $b$, here's what the result should be." This is your case function — it describes what the final function should do, expressed in terms of the constructor's arguments.

Now you hand `conj` to the inductor. What does the inductor do? It wraps your case function into the final function $f : A \times B \to C$. When someone calls $f$ on a pair $(a, b)$, the inductor unpacks the pair and feeds $a$ and $b$ to your `conj`. That's all — one layer of unwrapping, and we're done.

::WarningBox
**A word of caution — where these ideas live.** The inductor, induction, and recursion are concepts from **theoretical computer science** — specifically type theory, where researchers build very small yet extremely expressive formal systems. In those systems, *everything* is defined by induction: natural numbers, lists, trees, even equality and the logic itself.

Some of these concepts are genuinely difficult to implement in a programming language while keeping things ergonomic — that is, not making life harder for the programmer. So many of them never made it into Java, or appear in a simplified form.

For example, in full type theory, the inductor is a **dependent** function. Its type is:

> Given an inductive datatype $T$ with constructors $c_1, c_2, \ldots$, the inductor of $T$ has the form:
>
> $$
> \text{ind}_T : \prod_{C : T \to \mathcal{U}} \left(\text{case for } c_1\right) \to \cdots \to \left(\text{case for } c_n\right) \to \prod_{t : T} C(t)
> $$

In plain English: the result type $C$ can **depend on the input value**. You're not just computing a fixed output type — the type itself can vary based on *which* $t : T$ you're looking at. This lets you prove theorems about your program as you write it. It's extremely powerful.

It's also, frankly, a lot. People who write programs directly in this style are either mathematicians or operating at a level of abstraction most working programmers never touch.

Java and most mainstream languages strip away the dependent type machinery entirely. What remains is the **non-dependent** inductor — the flavour where the output type is fixed and doesn't depend on the input. This is what Java calls **recursion**. You still provide one case per constructor. The base case still stops the chain. The step case still receives the recursive result. But the type system doesn't track any of it — you just write `if` and `return`, and the JVM manages the call stack.

So when you see `factorial(n)` calling `factorial(n - 1)`, you're watching the non-dependent inductor at work. The core intuition — one case per constructor, with self-reference where the data is recursive — survived the journey from type theory to Java intact. The dependent types stayed behind.
::

::ExampleBox
**Induction on pairs in Java.** Java doesn't give you an explicit inductor, so you write the unpacking yourself — but the structure is the same:

```java
public class Pair {
    public int a;
    public int b;
}
// The case function: given a and b, return a*b
// conj : int -> int -> int
int conj(int a, int b) {
    return a * b;
}

// The final function on pairs — the inductor wraps conj for you
// pairProduct acts as an inductor.
int pairProduct(Pair p) {
    return conj(p.a, p.b);   // unpack the pair, feed to conj
}
```
The pair constructor's arguments ($a$, $b$) are from the component types $A$ and $B$ — they don't mention $A \times B$ at all. The inductor doesn't need to loop or recur; it just unwraps one layer and applies your case function.
::

::NoteBox
**Induction is not about self-reference — it's about covering all possibilities.** Pair induction is a common teaching example used to refute the belief that induction only applies to recursive types like natural numbers or lists. Induction is the general mechanism. How much information the inductor needs to pass to each case function depends entirely on what the constructor expects. If the constructor's arguments don't refer back to the type being defined, no recursion happens. That's fine. The inductor still does its job — routing input to the right case.
::

#### Induction on Natural Numbers — Now Self-Reference Appears

Now let's apply the same idea to a different type. How do you construct a natural number $\mathbb{N}$?

1. **Zero** — the constructor $0 : \mathbb{N}$. Takes **no** arguments. This is like the $0$-product from last lecture: you construct it from nothing.
2. **Successor** — the constructor $\texttt{succ} : \mathbb{N} \to \mathbb{N}$. Takes **one** argument — and that argument is itself a natural number.

The second constructor changes everything. Look at its type: $\texttt{succ} : \mathbb{N} \to \mathbb{N}$. The input is of type $\mathbb{N}$ — the very type we're defining. Every positive integer is built by stacking successors on top of $0$: $3 = \texttt{succ}(\texttt{succ}(\texttt{succ}(0)))$.

Any type where at least one constructor's argument refers back to the type itself is called a **recursive** (or **inductive**) data type. The natural numbers are the simplest example.

::DefBox{id="Recursive / Inductive Data Type"}
A **recursive data type** (or **inductive type**) is a type where at least one constructor takes an argument of the type itself. The natural numbers are the simplest example:

- **Base constructor**: $0$ — a natural number (no arguments)
- **Step constructor**: $\texttt{succ}(n)$ — given a natural number $n$, produce a new natural number

Every natural number is built by finitely many applications of these two rules.
::

Now let's apply the same induction principle: one case function per constructor.

- **Case for $0$**: the constructor takes no arguments, so this case is just a constant value: $f(0) = \text{?}$
- **Case for $\texttt{succ}(n)$**: the constructor takes one argument of type $\mathbb{N}$. So your case function receives that argument $n$. But the inductor also gives you something extra: **the result of $f$ on $n$** — because it has already recursively computed it. Your case function for $\texttt{succ}$ therefore receives **two** pieces of information: $n$ itself, and $f(n)$.

::DefBox{id="Inductor / Recursor"}
An **inductor** is the mechanism that takes your case functions and produces the final function. For natural numbers, you hand it:

1. **Base case**: what should $f(0)$ be? (A constant — the $0$ constructor takes no arguments.)
2. **Step case**: given $n$ (the constructor's argument) and $f(n)$ (the result already computed for $n$), what should $f(\texttt{succ}(n))$ be?

The inductor then handles the rest. When you call the resulting function on, say, $3$:

- Sees $\texttt{succ}(2)$ → needs $f(2)$ → calls itself on $2$
- Sees $\texttt{succ}(1)$ → needs $f(1)$ → calls itself on $1$
- Sees $\texttt{succ}(0)$ → needs $f(0)$ → calls itself on $0$
- Sees $0$ → applies the base case, returns $1$

Then it plugs $f(0) = 1$ back up the chain: $f(1) = 1 \times 1 = 1$, $f(2) = 2 \times 1 = 2$, $f(3) = 3 \times 2 = 6$.

::ExampleBox
**An informal analogy — the chain of whispers.** Imagine a line of people, each assigned a number. You stand at position $N$ and everyone follows the same two rules:

1. **If your position is $0$:** shout "$1!$" (the base case). You're done.
2. **Otherwise:** whisper your position minus one to the next person in line. Wait. Listen to what they shout back. Then shout: "my position × what they shouted."

Now suppose you're at position $3$:

- You whisper $2$ to the person on your left.
- They whisper $1$ to the person on their left.
- That person whispers $0$ to the next person.
- The person at $0$ shouts "$1!$"
- The person at $1$ hears "$1$", shouts "$1 \times 1 = 1$"
- The person at $2$ hears "$1$", shouts "$2 \times 1 = 2$"
- You hear "$2$", shout "$3 \times 2 = 6$"

That chain of whispers **is** the inductor. Each person runs the same two rules, passes a smaller number down the line, waits for the answer, and combines it. The person at $0$ provides the base that stops the chain. The inductor isn't a single clerk behind a desk — it's the entire line of people, each doing the same small job, until the whisper reaches $0$ and the answers start rolling back.

This is why it was given a separate name: the **recursor**. The clerk for pairs just opened one envelope. The inductor for natural numbers has to run the chain down and back up — it **recurs**.
::

This is where the names come from. Originally, this whole mechanism was called **induction** — defining a function by cases on how the input is constructed. But the particular, convenient flavour of inductor where the result type doesn't depend on the input value (the **non-dependent** inductor) stands out for how it works: it repeatedly expands the step case, plugs the result back into itself, and unwinds. This self-plugging behaviour is **recurrence** — hence the name **recursor**. The style of defining data using itself became a **recursive definition**, and computing such definitions became **recursion**.
::

::NoteBox
**Pair induction vs. natural number induction — what's the difference?** Both use the exact same principle: one case function per constructor. The difference is purely in what the constructors look like:

| | Pair $(A \times B)$ | Natural Numbers ($\mathbb{N}$) |
|:---|:---|:---|
| **Constructors** | One: $\texttt{construct}(a, b)$ | Two: $0$, $\texttt{succ}(n)$ |
| **Constructor arguments** | $a : A$, $b : B$ — unrelated types | $n : \mathbb{N}$ — **the same type** |
| **Case function shape** | $\texttt{conj} : A \to B \to C$ | $f(0) : C$ and $\texttt{step} : \mathbb{N} \to C \to C$ |
| **Inductor behaviour** | Unwrap once, apply `conj`, done | Repeatedly expand `step` until hitting $0$, then unwind |
| **Is it recursive?** | No — no self-reference in constructors | Yes — $\texttt{succ}$ refers to $\mathbb{N}$ itself |

The inductor always does the same job: route each input to the right case function. Recursion happens when the constructors refer to the type itself, forcing the inductor to loop. Induction is the general principle. Recursion is what induction looks like when the data is self-referential.
::

### 0x04. Recursion vs. Loops — What's the Difference?

Both loops and recursion repeat computation. The difference is **how they organize the repetition**:

| | Loop (`while` / `for`) | Recursion |
|:---|:---|:---|
| **Mechanism** | Jump back to an earlier line | Call the same function again |
| **State** | Mutable variables (`i`, `sum`) | Fresh parameters on each call |
| **Termination** | Condition becomes `false` | Base case is reached |
| **Mental model** | "Do this, then do that, then check if we're done" | "The answer for $n$ is built from the answer for $n-1$" |

::NoteBox
Early computers, constrained by primitive instruction sets, favoured the loop style — you saved registers, jumped to addresses, and manually managed every bit of state. Modern languages have richer expressive power, and recursion often reads more naturally because it matches the **mathematical definition** directly.

Neither style is universally better. Some problems (tree traversal, divide-and-conquer) are painful to write iteratively and elegant recursively. Others (simple array scanning) are clearer with a loop. The AP exam expects you to **read and trace both**, and to **write simple recursive functions** from a given recurrence relation.
::

::Mcq
---
options:
    - "1. A base case that stops the recursion"
    - "2. A recursive case that reduces the problem size"
    - "3. A loop counter that tracks the current iteration"
    - "4. A guarantee that each recursive call moves closer to a base case"
correct: 3
---
#prompt
Which of the following is **NOT** a necessary component of a recursive function?

#explanation
Option 3 describes a feature of loops, not recursion. Recursive functions don't need (and typically don't have) a loop counter — the call stack itself tracks progress through the problem. Options 1, 2, and 4 are all essential: every recursive function must have at least one base case, at least one recursive case, and each recursive call must bring the parameters strictly closer to a base case.
::

## 1x00. Fibonacci Numbers — The Canonical Example

### 1x01. The Sequence That Defines Itself

The Fibonacci sequence is the classic introduction to recursion. Its definition **is** a recurrence:

::DefBox{id="Fibonacci Sequence"}
The Fibonacci numbers $F_n$ are defined by:

$$
F_n = \begin{cases}
1 & \text{if } n = 1 \\
1 & \text{if } n = 2 \\
F_{n-1} + F_{n-2} & \text{if } n > 2
\end{cases}
$$

The first few terms: $1, 1, 2, 3, 5, 8, 13, 21, 34, 55, \ldots$
::

Look at the third line: $F_n = F_{n-1} + F_{n-2}$. The definition of $F_n$ **mentions itself** — twice. To know $F_5$, you need $F_4$ and $F_3$. To know $F_4$, you need $F_3$ and $F_2$. And so on, unwinding until you hit the base cases $F_1 = 1$ and $F_2 = 1$.

This is recursion in its purest form. The mathematical definition is already recursive. To write the code, you translate the definition almost verbatim.

### 1x02. From Recurrence to Java

::ExampleBox
**Translating the Fibonacci recurrence into Java.** The code mirrors the mathematical definition line by line:

```java
int fib(int n) {
    if (n == 1) {
        return 1;           // base case 1
    }
    if (n == 2) {
        return 1;           // base case 2
    }
    return fib(n - 1) + fib(n - 2);   // recursive case
}
```

Trace `fib(4)`:

```
fib(4)
  = fib(3) + fib(2)
  = (fib(2) + fib(1)) + 1
  = (1 + 1) + 1
  = 3
```

Each call waits for its sub-calls to return, then combines their results. The call stack grows until it hits a base case, then collapses as each level returns.
::

::WarningBox
**Base cases must come first.** If you write the recursive case before the base cases, the function will call itself forever — it never gets a chance to check whether it should stop:

```java
// WRONG — infinite recursion
int fib(int n) {
    return fib(n - 1) + fib(n - 2);   // runs first, ALWAYS
    // The base cases below are unreachable dead code
    if (n == 1) return 1;
    if (n == 2) return 1;
}
```

Java executes statements top-to-bottom. If the recursive call comes first, it triggers before any base-case check. The function calls itself with $n-1$, which calls itself with $n-2$, forever — until the call stack overflows and the program crashes with a `StackOverflowError`.

**Always place base cases before recursive cases.**
::

### 1x03. Why Two Base Cases?

The recurrence $F_n = F_{n-1} + F_{n-2}$ reaches back **two** steps. If you only had one base case — say, $F_1 = 1$ — what happens when computing $F_2$?

$$
F_2 = F_1 + F_0
$$

$F_1 = 1$ (base case, good). But $F_0$ — there's no base case for it. The function would call `fib(0)`, then `fib(-1)`, then `fib(-2)`... spiraling into negative infinity.

::DefBox{id="Base Case Count Rule"}
The number of base cases equals the number of **prior terms** the recurrence depends on. For $F_n = F_{n-1} + F_{n-2}$, that's two prior terms, so you need two base cases. For $n! = n \times (n-1)!$, that's one prior term, so one base case suffices.
::

::Mcq
---
options:
    - "1. 1 base case"
    - "2. 2 base cases"
    - "3. 3 base cases"
    - "4. 0 base cases — the recurrence defines everything"
correct: 2
---
#prompt
The recurrence $a_n = a_{n-1} + a_{n-3}$ depends on two prior terms ($n-1$ and $n-3$). How many base cases are needed?

#explanation
The recurrence depends on $a_{n-1}$ and $a_{n-3}$. To compute $a_3$, you need $a_2$ (from $n-1$) and $a_0$ (from $n-3$). To compute $a_2$, you need $a_1$ and $a_{-1}$. The smallest index that must be provided directly is $a_1$ (since $a_0$ can't be reached from smaller terms), so you need base cases for $a_1$, $a_2$, and $a_3$ — that's 3 base cases. Wait, let's count more carefully. The recurrence reaches back to $n-3$, so the three smallest starting values ($a_1, a_2, a_3$) each need a base case. Answer: 3 base cases.
::

### 1x04. Simplifying the Base Cases

Notice that both $F_1 = 1$ and $F_2 = 1$ return the same value. We can merge them:

```java
int fib(int n) {
    if (n <= 2) {
        return 1;           // covers both n == 1 and n == 2
    }
    return fib(n - 1) + fib(n - 2);
}
```

This is cleaner and, importantly, handles the edge case $n \leq 0$ — instead of falling through to the recursive case and recursing forever, `fib(0)` and `fib(-5)` now hit the base case and return `1`. Whether that's the *correct* answer for $n \leq 0$ is debatable (Fibonacci is only defined for positive integers), but at least the function **terminates**.

::NoteBox
**Defensive base cases.** A common pattern: instead of writing separate `if (n == 1)` and `if (n == 2)` branches, write `if (n <= 2)`. The `<=` catches all small values — including zero and negatives — preventing infinite recursion from unexpected inputs. Even if the mathematical definition only cares about $n \geq 1$, your code runs on a real machine where callers can pass anything.
::

## 2x00. The Staircase Problem — Same Math, Different Story

### 2x01. Climbing Stairs

Here's a problem that looks completely different from Fibonacci:

::DefBox{id="Staircase Problem"}
You are climbing a staircase with $n$ steps. Each move, you can take either **1 step** or **2 steps**. How many distinct ways can you reach the top?

For $n = 1$: only one way — take 1 step. Answer: $1$.
For $n = 2$: two ways — (1+1) or (2). Answer: $2$.
For $n = 3$: three ways — (1+1+1), (1+2), or (2+1). Answer: $3$.
For $n = 4$: five ways — (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2). Answer: $5$.
::

The answers — $1, 2, 3, 5$ — look suspiciously like Fibonacci numbers. Let's find out why.

### 2x02. Think Backwards

Instead of enumerating all paths from the bottom, think about the **last move** you make. You're standing at the top (step $n$). How did you get there?

::ExampleBox
**Last-move analysis.** Your last move was either:
- A **1-step** move from step $n-1$, or
- A **2-step** move from step $n-2$

There are no other options — you can only take 1 or 2 steps at a time.

If there are $f(n-1)$ ways to reach step $n-1$, and $f(n-2)$ ways to reach step $n-2$, then:

$$
f(n) = f(n-1) + f(n-2)
$$

This is **exactly** the Fibonacci recurrence. The base cases differ slightly ($f(1) = 1$, $f(2) = 2$ instead of $F_2 = 1$), but the recurrence structure is identical.
::

::NoteBox
When you reach the same recurrence from a completely different problem, you've discovered something deep: **the Fibonacci recurrence models any situation where you can reach state $n$ from states $n-1$ and $n-2$.** The staircase problem, rabbit breeding, the tiling of a $2 \times n$ board with $2 \times 1$ dominoes — they all yield $f(n) = f(n-1) + f(n-2)$. The problem changes. The structure doesn't.
::

### 2x03. Translation to Java

The code is nearly identical to Fibonacci — only the base cases change:

```java
int countWays(int n) {
    if (n == 1) {
        return 1;           // one way to climb 1 step
    }
    if (n == 2) {
        return 2;           // two ways to climb 2 steps: (1+1) or (2)
    }
    return countWays(n - 1) + countWays(n - 2);
}
```

::Mcq
---
options:
    - "1. `countWays(1)` returns 1"
    - "2. `countWays(2)` returns 2"
    - "3. `countWays(3)` returns 4"
    - "4. The recurrence is $f(n) = f(n-1) + f(n-2)$"
correct: 3
---
#prompt
For the staircase problem where you can take 1 or 2 steps at a time, which statement is **false**?

#explanation
Option 3 is false. `countWays(3)` = `countWays(2) + countWays(1)` = $2 + 1 = 3$, not 4. The three paths are (1+1+1), (1+2), and (2+1). Options 1, 2, and 4 are all correct.
::

## 3x00. Grid Paths — Two-Dimensional Recursion

### 3x01. From a Line to a Grid

The staircase problem moves in one dimension: you're at position $i$ on a line, moving right toward $n$. What if we add a second dimension?

::DefBox{id="Grid Path Problem"}
You start at the top-left corner of an $n \times m$ grid and want to reach the bottom-right corner. At each step, you can move either **right** or **down**. How many distinct paths are there?
::

For a $2 \times 2$ grid: the paths are (right, down), (down, right) — 2 paths.
For a $3 \times 2$ grid: 3 paths.
For a $2 \times 3$ grid: also 3 paths (symmetry).

The problem is now two-dimensional — you need two coordinates $(a, b)$ to describe where you are. But the recursive logic is the same: think about the **last step**.

### 3x02. The Two-Dimensional Recurrence

::ExampleBox
**Last-step analysis on a grid.** You're standing at cell $(a, b)$ (row $a$, column $b$). How did you get there? Your last move was either:
- **Down** — from the cell directly above: $(a-1, b)$, or
- **Right** — from the cell directly left: $(a, b-1)$

Let $P(a, b)$ be the number of paths from $(1, 1)$ to $(a, b)$. Then:

$$
P(a, b) = P(a-1, b) + P(a, b-1)
$$

**Base cases:**
- $P(1, 1) = 1$ — you're already at the destination (the empty path)
- $P(1, b) = 1$ for any $b$ — first row: you can only move right (no down from above)
- $P(a, 1) = 1$ for any $a$ — first column: you can only move down (no right from left)
::

::NoteBox
The base cases for the first row and first column are forced: there's only one way to traverse an edge — keep moving in the only allowed direction. This is the 2D analog of the staircase's $f(1) = 1$ base case, but now we need a whole row's and column's worth of base values.
::

### 3x03. Java Translation

```java
int gridPaths(int a, int b) {
    // Base cases: first row or first column
    if (a == 1 || b == 1) {
        return 1;
    }
    // Recursive case: come from above OR from the left
    return gridPaths(a - 1, b) + gridPaths(a, b - 1);
}
```

Trace `gridPaths(2, 3)`:

```
gridPaths(2, 3)
  = gridPaths(1, 3) + gridPaths(2, 2)
  = 1 + (gridPaths(1, 2) + gridPaths(2, 1))
  = 1 + (1 + 1)
  = 3
```

::SpoilerBox
**The closed form.** $P(a, b) = \binom{a+b-2}{a-1} = \frac{(a+b-2)!}{(a-1)!(b-1)!}$. This is the binomial coefficient — you must make exactly $(a-1)$ down moves and $(b-1)$ right moves, in any order, for a total of $(a+b-2)$ moves. The number of ways to choose the positions of the down moves (or the right moves) is the binomial coefficient.

The recursive function and the combinatorial formula compute the same number. The recursion directly mirrors the problem structure; the closed form requires recognizing the connection to binomial coefficients.
::

::Mcq
---
options:
    - "1. `gridPaths(1, 5)` returns 1"
    - "2. `gridPaths(3, 1)` returns 1"
    - "3. `gridPaths(2, 2)` returns 2"
    - "4. `gridPaths(2, 3)` returns 4"
correct: 4
---
#prompt
For the grid path problem (right and down moves only), which statement is **false**?

#explanation
Option 4 is false. `gridPaths(2, 3)` = `gridPaths(1, 3) + gridPaths(2, 2)` = $1 + (1 + 1) = 3$, not 4. The three paths from (1,1) to (2,3) are: right-right-down, right-down-right, down-right-right. Options 1, 2, and 3 are correct.
::

## 4x00. Mutual Recursion — When Functions Call Each Other

### 4x01. Recursion Isn't Always Solo

So far, every recursive function called **itself**. But recursion also includes the case where two (or more) functions call **each other**.

::DefBox{id="Mutual Recursion"}
**Mutual recursion** (or **indirect recursion**) occurs when two or more functions are defined in terms of each other. Function $F$ calls $G$, and $G$ calls $F$ — forming a cycle of mutual dependence.

Like direct recursion, mutual recursion must still guarantee termination: the cycle must eventually reach a base case.
::

### 4x02. A Mathematical Example — Set Equality

In set theory, equality of sets is defined mutually with the "element of" relation:

::ExampleBox
**Mutual definition of set equality.** Two sets $A$ and $B$ are equal if and only if:
- Every element of $A$ is in $B$, **and**
- Every element of $B$ is in $A$

And $x$ is an element of $A$ if... well, that depends on how $A$ is constructed. But notice: to check $A = B$, we need to check $x \in B$ for each $x \in A$. And to check $x \in B$, we might need to check equality again if $B$ contains nested sets. The definitions of $\in$ and $=$ are **mutually recursive**: membership depends on equality, and equality depends on membership.
::

### 4x03. Mutual Recursion in Java

::ExampleBox
**A toy example — two functions $F$ and $G$.** Suppose we define two integer functions:

$$
F(n) = \begin{cases}
1 & \text{if } n \leq 0 \\
G(n-2) & \text{otherwise}
\end{cases}
\qquad
G(n) = \begin{cases}
0 & \text{if } n \leq 0 \\
F(n-1) & \text{otherwise}
\end{cases}
$$

In Java:

```java
int F(int n) {
    if (n <= 0) {
        return 1;           // base case for F
    }
    return G(n - 2);        // F calls G
}

int G(int n) {
    if (n <= 0) {
        return 0;           // base case for G
    }
    return F(n - 1);        // G calls F
}
```

Trace `F(4)`:

```
F(4)
  = G(2)           // 4 > 0, so F calls G(2)
  = F(1)           // 2 > 0, so G calls F(1)
  = G(-1)          // 1 > 0, so F calls G(-1)
  = 0              // -1 ≤ 0, base case of G → return 0
```

The functions alternate: $F \to G \to F \to G \to \text{base}$. Together they unwind the problem until one of them hits its base case.
::

::NoteBox
**Why does this terminate?** Each call reduces the parameter: $F(n) \to G(n-2)$, then $G(n-2) \to F(n-3)$. The sum of the reductions per cycle ($-2$ then $-1$) is $-3$, so every two calls shrinks the problem by 3. Eventually $n$ drops to $\leq 0$, triggering a base case. As long as the **combined** effect of the mutual calls strictly decreases the parameter, termination is guaranteed.

This is the same principle as direct recursion — each step must move closer to a base case — but now "each step" might span across two different functions. The guarantee is that the **cycle as a whole** progresses.
::

::Mcq
---
options:
    - "1. One function calls the other, and the other calls the first back"
    - "2. Both functions must have their own base cases for termination"
    - "3. The combined effect of mutual calls must move parameters closer to a base case"
    - "4. Mutual recursion requires at least three functions"
correct: 4
---
#prompt
Which statement about mutual recursion is **false**?

#explanation
Option 4 is false — mutual recursion only requires **two** (or more) functions. Having two is the minimal case, and it's the most common. Options 1, 2, and 3 are all true characteristics of mutual recursion.
::

## 5x00. The Mechanics of Recursion — What the Computer Actually Does

### 5x01. The Call Stack

When you call a function, Java pushes a **stack frame** onto the call stack. The frame stores:
- The function's parameters
- Its local variables
- The return address — where to resume after the function returns

When the function returns, its frame is popped, and execution resumes at the return address with the return value in hand.

::ExampleBox
**Visualizing the call stack for `fib(4)`:**

```
Time ──────────────────────────────────────────────►

fib(4) called
│  n=4, waiting for fib(3)+fib(2)
│
├─ fib(3) called
│  │  n=3, waiting for fib(2)+fib(1)
│  │
│  ├─ fib(2) called
│  │  │  n=2 → returns 1
│  │  └─ return 1
│  │
│  ├─ fib(1) called
│  │  │  n=1 → returns 1
│  │  └─ return 1
│  │
│  └─ fib(3) = 1+1 = 2 → returns 2
│
├─ fib(2) called
│  │  n=2 → returns 1
│  └─ return 1
│
└─ fib(4) = 2+1 = 3 → returns 3
```

Each recursive call adds a new frame. The stack grows until a base case is hit, then each frame returns and is popped. The maximum stack depth for `fib(4)` is 3 (frames for `fib(4)`, `fib(3)`, and `fib(2)` at the deepest point).
::

### 5x02. The Golden Rule — Always Make Progress

::DefBox{id="The Convergence Rule"}
Every recursive call must bring the parameters **strictly closer** to a base case. If the parameter doesn't shrink — or worse, grows — the recursion will never terminate.
::

::WarningBox
**The classic mistake:** calling with the same or larger parameter.

```java
// INFINITE RECURSION — n never changes
int broken(int n) {
    if (n <= 0) return 1;
    return broken(n);        // same n! never makes progress
}

// INFINITE RECURSION — n grows
int alsoBroken(int n) {
    if (n <= 0) return 1;
    return broken(n + 1);    // n increases! moves AWAY from base case
}
```

Both functions compile and run — and both crash with a `StackOverflowError`. The compiler doesn't check whether your recursion converges. It's entirely your responsibility.
::

::Mcq
---
options:
    - "1. `void f(int n) { if (n <= 0) return; f(n - 1); }`"
    - "2. `int f(int n) { if (n <= 0) return 0; return 1 + f(n - 1); }`"
    - "3. `int f(int n) { if (n <= 0) return 0; return 1 + f(n); }`"
    - "4. `int f(int n) { if (n >= 100) return n; return f(n + 1); }`"
correct: 3
---
#prompt
Which of the following recursive functions will cause **infinite recursion** (assuming it is called with a positive integer)?

#explanation
Option 3 calls `f(n)` — the same value of `n` — so the parameter never shrinks. The base case `n <= 0` is never approached, and the function recurses forever. Options 1, 2, and 4 all strictly decrease the distance to their respective base cases ($n-1$ for 1 and 2; waiting for $n$ to reach 100 in option 4), so they terminate for any input.
::

### 5x03. Recursion and Efficiency — A Preview

Fibonacci is a beautiful example for teaching recursion. It's also a **terrible** example for using recursion in practice. Computing `fib(50)` with the naive recursive approach makes roughly $F_{50} \approx 2 \times 10^{10}$ function calls — that's 20 billion calls.

Why so many? Because the same subproblems are recomputed over and over:

```
fib(5) calls fib(4) and fib(3)
fib(4) calls fib(3) and fib(2)
fib(3) calls fib(2) and fib(1)
...
```

`fib(3)` is computed twice. `fib(2)` is computed three times. `fib(1)` is computed five times. The redundancy explodes — this is **exponential** time complexity, $O(2^n)$.

::NoteBox
This isn't a flaw in recursion itself — it's a flaw in the *naive translation* of the recurrence. Techniques like **memoization** (storing computed results in a table) and **dynamic programming** (building the answer bottom-up) reduce Fibonacci to $O(n)$ time. Those are topics for a later lecture. For now, the key insight: a mathematically elegant recurrence doesn't guarantee an efficient algorithm. But understanding the recurrence is the first step toward optimizing it.
::

---

::NoteBox
**Cognitive Anchor**

- **Recursion** = a function that calls itself (directly or via mutual recursion) to solve a smaller instance of the same problem.
- **Two essential parts**: Base Case (stopping condition — solve directly) and Recursive Case (reduction — express $f(n)$ in terms of $f(\text{smaller})$).
- **The convergence rule**: Every recursive call must bring parameters strictly closer to a base case. If $n$ stays the same or grows, you get infinite recursion and a `StackOverflowError`.
- **Base cases always go first** in the code. Java executes top-to-bottom. If the recursive call precedes the base-case check, the function never stops.
- **Number of base cases** = number of prior terms the recurrence depends on. $F_n = F_{n-1} + F_{n-2}$ needs two base cases. $n! = n \times (n-1)!$ needs one.
- **The staircase problem**: $f(n) = f(n-1) + f(n-2)$ — identical recurrence to Fibonacci, different base cases. The structure is what matters, not the story.
- **The grid path problem**: $P(a,b) = P(a-1,b) + P(a,b-1)$ — 2D recursion. Each dimension contributes a term to the recurrence.
- **Mutual recursion**: Two functions call each other. Termination is guaranteed if the combined cycle reduces the parameter. Each function must have its own base case(s).
- **The call stack**: Each recursive call pushes a frame (parameters, locals, return address). Base cases pop frames and return values. Too deep a stack → `StackOverflowError`.
- **Efficiency warning**: Naive recursive Fibonacci does $O(2^n)$ work due to redundant recomputation. Memoization and dynamic programming fix this — but first you must understand the recursion.
- **Induction** (the general principle behind recursion): to define a function on any data type, provide one case for each constructor. The **inductor** handles the routing — it examines how a value was built and dispatches to the correct case. Induction works on **all** types, not just recursive ones. For a pair, the one constructor takes $a$ and $b$, so you provide $\texttt{conj}(a, b)$ and the inductor unwraps one layer — done, no recursion. For natural numbers, the $\texttt{succ}$ constructor's argument is itself a $\mathbb{N}$, so the inductor must recursively compute $f(n)$ before it can give you $f(\texttt{succ}(n))$ — that self-plugging behaviour is **recurrence**, which gave the **recursor** its name.
- **Java strips away the dependent type machinery** and keeps the non-dependent inductor: you write `if` and `return` by hand, and the JVM manages the call stack. The core intuition — one case per constructor, self-reference where the data is recursive — is all that remains. Seeing `factorial(n)` call `factorial(n - 1)` is watching the recursor at work.
::

## Glossary

| Term | Everyday / Literal Meaning | Meaning in CS |
|:---|:---|:---|
| **Recursion** / 递归 | To recur — to happen again. | A function that calls itself, directly or indirectly, to solve a smaller instance of the same problem. |
| **Base Case** / 基础情况 | The bottom, the foundation. | The stopping condition — a small enough input that can be solved directly without further recursive calls. |
| **Recursive Case** / 递归情况 | The step that recurs. | The reduction step that expresses the answer for size $n$ in terms of smaller sizes. |
| **Call Stack** / 调用栈 | A stack of papers, each with a task to resume. | The data structure that tracks active function calls — each frame stores parameters, local variables, and the return address. |
| **StackOverflowError** / 栈溢出错误 | The stack of papers grew too tall and toppled. | An error thrown when the call stack exceeds its maximum size, typically from infinite (or extremely deep) recursion. |
| **Mutual Recursion** / 相互递归 | Two things taking turns, each deferring to the other. | Two or more functions defined in terms of each other, forming a cycle of calls. |
| **Recurrence Relation** / 递推关系 | A rule that says "the next term is built from earlier ones." | An equation that defines a sequence recursively — each term is expressed as a function of preceding terms. |
| **Fibonacci Sequence** / 斐波那契数列 | Named after Leonardo Fibonacci (c. 1202), who described rabbit population growth. | The sequence $1, 1, 2, 3, 5, 8, 13, \ldots$ defined by $F_n = F_{n-1} + F_{n-2}$ with $F_1 = F_2 = 1$. |
| **Staircase Problem** / 楼梯问题 | How many ways to climb stairs taking 1 or 2 steps at a time. | A combinatorial problem whose solution follows the Fibonacci recurrence: $f(n) = f(n-1) + f(n-2)$. |
| **Grid Path Problem** / 网格路径问题 | Counting routes through city blocks, moving only right or down. | A 2D recursive problem: $P(a,b) = P(a-1,b) + P(a,b-1)$, with base cases along the first row and column. |
| **Memoization** / 记忆化 | Writing a memo to yourself so you don't redo work. | Storing the results of expensive function calls and returning the cached result when the same inputs occur again. |
| **Induction** / 归纳 | To lead in, to introduce — from Latin *inducere*. | The general mechanism of defining a function on a data type by providing one case per constructor. The inductor routes each value to the correct case based on how it was built. |
| **Inductor / Recursor** / 归纳器/递归器 | A device that induces, a machine that recurs. | The mechanism that takes your case functions and produces a complete function. The non-dependent version (where the output type doesn't vary with the input) is called the **recursor** because of its self-plugging, recurring behaviour. |
| **Recursive Data Type** / 递归数据类型 | A type that mentions itself in its own definition. | A type where at least one constructor takes an argument of the type itself — e.g., natural numbers ($\texttt{succ} : \mathbb{N} \to \mathbb{N}$), lists, trees. Forces the inductor to loop. |
| **Stack Frame** / 栈帧 | A single sheet on the stack of papers. | The block of memory pushed onto the call stack for one function invocation — holds parameters, locals, and the return address. |

::LinkCard
---
url: "https://www.online-java.com/"
title: "Online Java Compiler"
details: "Write, compile, and run Java code directly in the browser. Use this to experiment with the recursive functions from this lecture — try writing fib(), countWays(), and gridPaths() yourself."
image: "default-siteicon.webp"
---
::
