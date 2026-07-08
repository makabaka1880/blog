---
title: APCSA - Boolean Algebra
description: AP Computer Science A Lecture 3 — Boolean values, truth tables, algebraic laws, De Morgan's theorems, and translating business rules into Java logical expressions
createTime: 2026-07-08
updateTime: 2026-07-08

tags:
    - APCSA
ligatures: false
---

## 0x00. Boolean Values & Core Operators

Every program makes decisions. "Is the user logged in?" "Did the sensor trigger?" "Has the timer expired?" All of these questions share a common answer format: **yes** or **no** — `true` or `false`. Java captures this binary decision space with the `boolean` type and three fundamental operators that combine, invert, and evaluate truth values.

### 0x01. The `boolean` Type

::DefBox{id="boolean Type"}
A **`boolean`** is a primitive type in Java that holds exactly two literal values: `true` and `false`. Formally:

$$
⟦\texttt{boolean}⟧ = \{\texttt{true}, \texttt{false}\}
$$

It is the result type of all comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) and the operand type of the three logical operators (`&&`, `||`, `!`).
::

```java
boolean isRaining = true;
boolean hasUmbrella = false;
boolean isLoggedIn;          // defaults to false if a field, compile error if local and uninitialized
```

::NoteBox
Internally, the JVM may represent `boolean` with 4 bytes (an `int`-sized slot) due to memory alignment — but this is an implementation detail, not something you'll encounter on the AP exam. What matters: the type has exactly two values, end of story.
::

### 0x02. Logical AND (`&&`)

::DefBox{id="Logical AND"}
The **AND** operator (`&&`) is a binary operator: it takes two `boolean` operands and evaluates to `true` **if and only if both operands are `true`**. If either operand is `false`, the result is `false`.
::

This is often summarized as **"falsify early"** — a single `false` poisons the entire conjunction:

| `a` | `b` | `a && b` |
|:---|:---|:---|
| `true` | `true` | `true` |
| `true` | `false` | `false` |
| `false` | `true` | `false` |
| `false` | `false` | `false` |

::ExampleBox
```java
boolean isEven = (n % 2 == 0);        // true if n is even
boolean isPrime = checkPrime(n);      // true if n is prime

// "n is both even AND prime" — only n = 2 satisfies this
boolean isEvenAndPrime = isEven && isPrime;
```

There are infinitely many even numbers and infinitely many primes — but their **intersection** is just `{2}`. The `&&` operator computes exactly this intersection: it returns `true` only for the overlap of both conditions.
::

::WarningBox
A common beginner mistake is confusing `&&` (logical AND) with `==` (equality check). These are fundamentally different:

```java
boolean a = true;
boolean b = false;

a && b    // false — logical AND: "are both true?"
a == b    // false — equality: "are they the same value?"
```

The first asks "are they both true?" The second asks "are they identical?" Don't mix them up.
::

### 0x03. Logical OR (`||`)

::DefBox{id="Logical OR"}
The **OR** operator (`||`) is a binary operator: it evaluates to `true` if **at least one** operand is `true`. It only returns `false` when **both** operands are `false`.
::

This is the mirror image of AND — **"satisfy early"**: a single `true` is enough:

| `a` | `b` | `a \|\| b` |
|:---|:---|:---|
| `true` | `true` | `true` |
| `true` | `false` | `true` |
| `false` | `true` | `true` |
| `false` | `false` | `false` |

::ExampleBox
```java
boolean hasKeycard = true;
boolean knowsPasscode = false;

// "can enter if has keycard OR knows passcode"
boolean canEnter = hasKeycard || knowsPasscode;   // true — keycard is enough
```

In everyday English, "or" sometimes means "one or the other, but not both" (exclusive or). Java's `||` is **inclusive**: `true || true` is `true`. The exclusive-or concept exists (the `^` operator) but is outside the AP subset.
::

### 0x04. Logical NOT (`!`)

::DefBox{id="Logical NOT"}
The **NOT** operator (`!`) is a unary prefix operator: it takes a single `boolean` operand and **inverts** it. `!true` becomes `false`; `!false` becomes `true`.
::

| `a` | `!a` |
|:---|:---|
| `true` | `false` |
| `false` | `true` |

```java
boolean isRaining = true;
boolean canGoOutside = !isRaining;    // false — it IS raining, so we can't go out

boolean isDoorClosed = false;
boolean isDoorOpen = !isDoorClosed;   // true
```

::NoteBox
NOT is the simplest of the three — its truth table has only two rows (one input, one output). But combined with AND and OR, it gives us the expressive power to describe any boolean condition. Together, `{&&, ||, !}` form a **functionally complete** set: any truth table, no matter how complex, can be expressed using only these three operators.
::

### 0x05. Truth Tables — The Universal Tool

Every logical operator can be fully described by a **truth table**: a systematic listing of all possible input combinations and the corresponding output. Truth tables are the "ground truth" of logic — when an algebraic simplification seems questionable, you can always fall back to enumerating the rows.

::DefBox{id="Truth Table"}
A **truth table** enumerates every combination of input values (each variable contributes a column with `true`/`false` in every possible permutation) and shows the resulting output of an expression. For $n$ variables, there are $2^n$ rows.
::

::ExampleBox
Truth table for `a && (b || !c)` — three variables, so $2^3 = 8$ rows:

| `a` | `b` | `c` | `!c` | `b \|\| !c` | `a && (b \|\| !c)` |
|:---|:---|:---|:---|:---|:---|
| `true` | `true` | `true` | `false` | `true` | `true` |
| `true` | `true` | `false` | `true` | `true` | `true` |
| `true` | `false` | `true` | `false` | `false` | `false` |
| `true` | `false` | `false` | `true` | `true` | `true` |
| `false` | `true` | `true` | `false` | `true` | `false` |
| `false` | `true` | `false` | `true` | `true` | `false` |
| `false` | `false` | `true` | `false` | `false` | `false` |
| `false` | `false` | `false` | `true` | `true` | `false` |

Build the table column by column, inside-out. Compute intermediate terms first, then combine them into the final column.
::

::Mcq
---
options:
    - "1. `true`"
    - "2. `false`"
    - "3. It depends on the value of `a`"
    - "4. It causes a compile-time error"
correct: 2
---

#prompt
Given `boolean a = true; boolean b = false;`, what is the value of `a && b`?

#explanation
AND (`&&`) returns `true` only when **both** operands are `true`. Here `b` is `false`, so the result is `false` — "falsify early." One false operand is enough to make the whole conjunction false.
::

::Mcq
---
options:
    - "1. `true`"
    - "2. `false`"
    - "3. `true` if `a` is `true`, `false` if `a` is `false`"
    - "4. It causes a compile-time error"
correct: 1
---

#prompt
Given `boolean a = false; boolean b = true;`, what is the value of `a || b`?

#explanation
OR (`||`) returns `true` when **at least one** operand is `true`. Here `b` is `true`, so the result is `true` — "satisfy early." `a` being `false` doesn't matter; one true is all it takes.
::

## 1x00. Algebraic Laws & Properties

Computing truth tables works — but it scales exponentially ($2^n$ rows for $n$ variables). At 5 variables you're filling 32 rows. At 10 variables you'd need 1,024. This is where **algebraic laws** come in: they let us simplify boolean expressions mechanically, reducing complex conditions to equivalent but more readable forms without ever touching a truth table.

::NoteBox
Why do these laws matter for APCSA? Two reasons:

1. **FRQ scenario**: You're given a messy conditional (`if ((a && !b) || (!a && b))`) and need to determine whether a proposed simplification is equivalent. The laws give you a systematic way to check.
2. **Code quality**: Simplified conditions are easier to read, debug, and maintain. `!(!a && !b)` is correct but opaque; `a || b` says the same thing in three tokens.
::

### 1x01. Idempotent Law

::DefBox{id="Idempotent Law"}
Repeating an operand with the same operator yields the original operand. Formally:

$$
a \land a \equiv a \qquad\qquad a \lor a \equiv a
$$

In Java:
```java
a && a   // ≡ a
a || a   // ≡ a
```
::

::ExampleBox
Plug in concrete values to verify:

```java
// a = true
true && true   // → true   (same as a)
true || true   // → true   (same as a)

// a = false
false && false // → false  (same as a)
false || false // → false  (same as a)
```

Both cases confirm the law. And this generalizes: `a && a && a && ... && a` is still just `a`, no matter how many times you repeat it. Same for `||`.
::

The intuition: AND asks "are all of these true?" If you're asking about the same variable multiple times, you're just asking about it once. OR asks "is any of these true?" — same redundancy.

### 1x02. Double Negation Law

::DefBox{id="Double Negation Law"}
Two successive negations cancel out, returning the original value:

$$
\lnot (\lnot a) \equiv a
$$

In Java:
```java
!!a   // ≡ a
```
::

::ExampleBox
```java
boolean isRaining = true;
boolean result = !!isRaining;   // true
// !isRaining = false
// !false = true → back to original

boolean isClosed = false;
boolean isOpen = !isClosed;          // true
boolean isNotOpen = !!isClosed;      // false — same as original isClosed
```
::

::WarningBox
The double negation law holds in **classical logic** (which is what Java uses). In some other logical frameworks — notably intuitionistic logic — $\lnot\lnot a$ does **not** necessarily imply $a$. But for the AP exam and all Java programming: `!!a` equals `a`, always.
::

### 1x03. Commutative & Associative Laws

::DefBox{id="Commutativity"}
The **order** of operands does not affect the result for AND and OR:

$$
a \land b \equiv b \land a \qquad\qquad a \lor b \equiv b \lor a
$$

In Java: `a && b == b && a` and `a || b == b || a`
::

::DefBox{id="Associativity"}
The **grouping** of parentheses does not affect the result for chained AND or OR operations:

$$
a \land (b \land c) \equiv (a \land b) \land c \qquad\qquad a \lor (b \lor c) \equiv (a \lor b) \lor c
$$

In Java: `a && (b && c) == (a && b) && c` and `a || (b || c) == (a || b) || c`
::

::ExampleBox
Think of this with a real-world analogy. To go to the park, you need three things: **sunny weather**, **free time**, and **enough energy**.

```java
boolean canGoPark = isSunny && hasFreeTime && hasEnergy;
```

It doesn't matter which pair you group first — `(sunny && free) && energy` gives the same result as `sunny && (free && energy)`. All three must be true regardless of grouping. Same logic applies to OR: if any one of several backup plans works, the order you check them in doesn't change the final answer.
::

::NoteBox
Commutativity and associativity together mean that for a chain of all-ANDs or all-ORs, you can **reorder and regroup freely**. This is the foundation for simplifying complex expressions — it's the same freedom you have with `+` and `×` in ordinary arithmetic.
::

### 1x04. Distributive Law

::DefBox{id="Distributive Law (Boolean)"}
AND distributes over OR, and OR distributes over AND — analogous to how multiplication distributes over addition:

$$
\begin{aligned}
a \land (b \lor c) &\equiv (a \land b) \lor (a \land c) \\[4pt]
a \lor (b \land c) &\equiv (a \lor b) \land (a \lor c)
\end{aligned}
$$

In Java:
```java
a && (b || c) == (a && b) || (a && c)
a || (b && c) == (a || b) && (a || c)
```
::

::ExampleBox
The first form — AND over OR — mirrors ordinary arithmetic: $a(b + c) = ab + ac$. But the second form — OR over AND — has **no arithmetic equivalent**: $a + (b \times c) \neq (a + b) \times (a + c)$ in ordinary numbers. This is a distinctly boolean property.

Let's verify the second form with values:

```java
// a = true, b = false, c = true
a || (b && c)            // true || (false && true) = true || false = true
(a || b) && (a || c)     // (true || false) && (true || true) = true && true = true
// Both sides agree. ✓
```
::

### 1x05. De Morgan's Laws

::DefBox{id="De Morgan's Laws"}
De Morgan's laws describe how negation distributes over AND and OR — by **flipping the operator** inside:

$$
\begin{aligned}
\lnot (a \land b) &\equiv (\lnot a) \lor (\lnot b) \\[4pt]
\lnot (a \lor b) &\equiv (\lnot a) \land (\lnot b)
\end{aligned}
$$

In Java:
```java
!(a && b) == !a || !b
!(a || b) == !a && !b
```
::

These are perhaps the most frequently used logical identities — and the most frequently misapplied. The rule: **push the `!` inside, flip `&&` to `||` (or vice versa), and negate each term.**

::ExampleBox
**The English intuition:**

> "It is NOT the case that (it is sunny AND warm)"\
> ≡ "It is NOT sunny OR it is NOT warm."

If I tell you "it's not both sunny and warm," at least one of those must be false — either it's not sunny, or it's not warm (or both). That's De Morgan's first law in plain English.

> "It is NOT the case that (I have a pen OR a pencil)"\
> ≡ "I do NOT have a pen AND I do NOT have a pencil."

This is the English phrase **"neither... nor..."** — it directly encodes De Morgan's second law. "I have neither a pen nor a pencil" means "I don't have a pen, and I don't have a pencil."
::

::WarningBox
The single most common mistake: forgetting to flip the operator.

```java
// WRONG:
!(a && b) == !a && !b     // ← operator stayed as && — this is INCORRECT

// CORRECT:
!(a && b) == !a || !b     // ← && flipped to ||
```

If you forget the flip, you're claiming that "not both" means "neither" — which is a much stronger statement. "Not both sunny and warm" (could be sunny-but-cold) is different from "neither sunny nor warm" (must be not-sunny AND not-warm).
::

::Mcq
---
options:
    - "1. `!a && !b`"
    - "2. `!a || !b`"
    - "3. `a && b`"
    - "4. `a || b`"
correct: 2
---

#prompt
According to De Morgan's Law, `!(a && b)` is equivalent to which expression?

#explanation
De Morgan's first law: `!(a && b) ≡ !a || !b`. Push the `!` inside, flip `&&` to `||`, and negate each operand. Option 1 keeps the `&&` — that's the classic mistake. Options 3 and 4 drop the negations entirely.
::

### 1x06. Law of Excluded Middle (Tautology)

::DefBox{id="Law of Excluded Middle"}
A proposition OR its negation is **always `true`** — it is a **tautology** (重言式):

$$
a \lor \lnot a \equiv \top \qquad (\text{always } \texttt{true})
$$

In Java: `a || !a` always evaluates to `true`, regardless of the value of `a`.
::

::ExampleBox
```java
boolean isRaining = ...;   // could be true or false
boolean tautology = isRaining || !isRaining;   // ALWAYS true

// If isRaining is true:  true || false = true
// If isRaining is false: false || true  = true
// No other values exist — boolean only has two.
```

The name "excluded middle" comes from the idea that there is no third option — nothing between true and false. A thing either is or isn't; `a` is either true or false. There's no middle ground to "exclude."
::

### 1x07. Law of Contradiction (Absurdity)

::DefBox{id="Law of Contradiction"}
A proposition AND its negation is **always `false`** — it is an **absurdity** (矛盾式):

$$
a \land \lnot a \equiv \bot \qquad (\text{always } \texttt{false})
$$

In Java: `a && !a` always evaluates to `false`, regardless of `a`.
::

```java
boolean canEnter = isDoorOpen && !isDoorOpen;   // ALWAYS false — nonsense condition
```

::NoteBox
The Law of Excluded Middle and the Law of Contradiction are duals — mirror images of each other:

| Law | Expression | Always |
|:---|:---|:---|
| Excluded Middle | `a \|\| !a` | `true` (tautology) |
| Contradiction | `a && !a` | `false` (absurdity) |

If you encounter `a && !a` in your code, it's either a bug or dead code — it can never execute in any scenario.
::

::McqMultiple
---
options:
    - 1. "`a && a` simplifies to `a`"
    - 2. "`a && !a` simplifies to `false`"
    - 3. "`!!a` simplifies to `!a`"
    - 4. "`a || !a` simplifies to `true`"
correct:
    - 1
    - 2
    - 4
---

#prompt
Which of the following simplifications are CORRECT? (Select all that apply.)

#explanation
Option 1: Idempotent Law — correct. Option 2: Law of Contradiction — correct. Option 3: False — `!!a ≡ a`, not `!a`. Double negation cancels, it doesn't leave a single negation. Option 4: Law of Excluded Middle — correct.
::

## 2x00. Semantics & Arithmetic Analogies

Boolean expressions can feel abstract. This section gives you two frameworks for making them concrete: understanding *why* Java's logic works the way it does (truth-functional semantics), and a mechanical shortcut for simplifying expressions using arithmetic you already know.

### 2x01. Truth-Functional Semantics

There are (at least) two ways to think about what a logical statement *means*:

::DefBox{id="BHK Semantics"}
The **Brouwer-Heyting-Kolmogorov (BHK)** interpretation defines truth through **constructive proof**: $a \land b$ is true if you can produce a proof of $a$ and a proof of $b$. $a \lor b$ is true if you can produce a proof of at least one. $\lnot a$ is true if you can show that assuming $a$ leads to a contradiction. This framework is elegant and rigorous — but it requires tracking *proofs*, not just values.
::

::DefBox{id="Truth-Functional Semantics"}
Under **truth-functional semantics**, the truth value of a compound expression is determined **solely by the truth values of its components**. There is no notion of "proof" — only input bits and output bits. The operators are pure functions from $\{\texttt{true}, \texttt{false}\}^n$ to $\{\texttt{true}, \texttt{false}\}$.
::

**Java uses truth-functional semantics.** When you write `a && b`, the JVM doesn't ask "can you prove `a` and prove `b`?" — it just looks at the two boolean values in memory and runs them through the AND truth table. This design choice prioritizes simplicity and predictability: the result depends on exactly two things (the values of `a` and `b`), nothing else.

::NoteBox
Truth-functional semantics is the "just the facts" approach. It's what makes truth tables work: you only need the input values to determine the output. The BHK interpretation is philosophically deeper but computationally heavier — and the AP exam doesn't ask about it.
::

### 2x02. The Arithmetic Analogy — AND as ×, OR as +

Here is the single most practical trick for simplifying boolean expressions: **map them onto arithmetic you already understand.**

::DefBox{id="Arithmetic Mapping"}
Treat `true` as $1$ and `false` as $0$. Then:

| Boolean Operator | Arithmetic Equivalent |
|:---|:---|
| `a && b` | $a \times b$ |
| `a \|\| b` | $a + b$ (with a caveat: $1+1=2$, but we treat any non-zero as true) |
| `!a` | $1 - a$ |
::

::ExampleBox
Let's verify with the truth tables:

**AND as multiplication:**
```java
true  && true   → 1 × 1 = 1 → true   ✓
true  && false  → 1 × 0 = 0 → false  ✓
false && true   → 0 × 1 = 0 → false  ✓
false && false  → 0 × 0 = 0 → false  ✓
```

**OR as addition:**
```java
true  || true   → 1 + 1 = 2 → non-zero → true   ✓
true  || false  → 1 + 0 = 1 → non-zero → true   ✓
false || true   → 0 + 1 = 1 → non-zero → true   ✓
false || false  → 0 + 0 = 0 → zero     → false  ✓
```

**NOT as $1 - a$:**
```java
!true   → 1 - 1 = 0 → false  ✓
!false  → 1 - 0 = 1 → true   ✓
```
::

This mapping isn't just a coincidence — it's a deep structural correspondence. Once you map `&&` to `×` and `||` to `+`, all the algebraic laws from Section 1 become familiar arithmetic:

::ExampleBox
**The Law of Contradiction in arithmetic:**
$$
a \land \lnot a \quad\rightarrow\quad a \times (1 - a) = a - a^2
$$
Since $a$ is either $0$ or $1$, $a^2 = a$, so $a - a^2 = a - a = 0$. Always zero. Always `false`. ✓

**De Morgan's first law in arithmetic:**
$$
\lnot(a \land b) \quad\rightarrow\quad 1 - (a \times b)
$$
$$
(\lnot a) \lor (\lnot b) \quad\rightarrow\quad (1 - a) + (1 - b) = 2 - a - b
$$
These don't look equal in ordinary arithmetic... but in boolean arithmetic (where $a, b \in \{0, 1\}$), both sides match. Try all four combinations — they agree every time.
::

::WarningBox
The arithmetic analogy is a **thinking tool**, not how Java actually runs. The JVM doesn't multiply integers to compute `&&`. But for *you*, mapping to arithmetic gives you a familiar algebra for simplifying expressions — one you've been practicing since primary school.
::

### 2x03. Disjunctive Normal Form (DNF)

::DefBox{id="Disjunctive Normal Form"}
A boolean expression is in **Disjunctive Normal Form** (DNF, 析取范式) if it is an OR (`||`) of one or more clauses, where each clause is an AND (`&&`) of **literals** (a literal is a variable or its negation).

Formally, a DNF expression has the shape:
$$
\bigvee_{i} \bigwedge_{j} l_{ij}
$$
Where each $l_{ij}$ is either $x$ or $\lnot x$ for some variable $x$.
::

Think of DNF as **"sum of products"** — just like a polynomial in standard form. Using the arithmetic mapping:

$$
\underbrace{a \land b}_{\text{product}} \;\lor\; \underbrace{(\lnot a) \land c}_{\text{product}} \;\lor\; \underbrace{(\lnot b) \land (\lnot c)}_{\text{product}}
\quad\rightarrow\quad
ab + (1-a)c + (1-b)(1-c)
$$

::ExampleBox
**Is it in DNF?**

| Expression | DNF? | Why |
|:---|:---|:---|
| `a \|\| (b && c) \|\| !d` | ✓ | OR of AND-clauses |
| `(a \|\| b) && c` | ✗ | AND outside, OR inside — wrong order |
| `!(a && b) \|\| c` | ✗ | Negation wrapping an AND — not expanded |
| `!a \|\| !b \|\| c` | ✓ | After De Morgan: `!(a && b)` → `!a \|\| !b`, now OR of literals |

The rule: DNF = OR at the top level, ANDs underneath, negations only on individual variables.
::

::NoteBox
**Every boolean expression can be converted to DNF.** This is a theorem — DNF is a **normal form**, meaning it's a canonical, unambiguous way to write any truth function. The conversion process uses exactly the laws from Section 1:

1. Use **De Morgan's laws** to push all `!` inward until they only sit on individual variables
2. Use the **distributive law** to expand `&&` over `||` (like expanding a polynomial)
3. Use the **absorption laws** to eliminate redundant terms (like `a \|\| (a && b) \equiv a`)

The result is always a "sum of products" — clean, standardized, and easy to compare against other expressions.
::

::ExampleBox
**Converting to DNF step by step:**

```java
// Starting expression:
!(a && !b) || (c && (a || d))
```

**Step 1** — Push `!` inward with De Morgan:
```java
(!a || !!b) || (c && (a || d))
(!a || b) || (c && (a || d))        // double negation cancels
```

**Step 2** — Distribute `c` into `(a || d)`:
```java
(!a || b) || (c && a) || (c && d)
```

**Step 3** — Already in DNF: OR of three AND-clauses. Done. ✓
```java
!a || b || (a && c) || (c && d)
```
::

::Mcq
---
options:
    - "1. `a && (b \|\| c)`"
    - "2. `(a && b) \|\| (a && c) \|\| !d`"
    - "3. `!(a \|\| b) && c`"
    - "4. `(a \|\| b) && (c \|\| d)`"
correct: 2
---

#prompt
Which of the following is in Disjunctive Normal Form (DNF)?

#explanation
Option 2 is in DNF: OR at the top level, ANDs inside, negations only on individual variables (`!d` is a negated literal, which is allowed). Option 1 has AND outside, OR inside — the structure is inverted. Option 3 has a negation wrapping an OR (`!(a || b)`) — negations must be pushed down to individual variables. Option 4 has AND at the top level with ORs underneath — "product of sums" rather than "sum of products." DNF requires OR-of-ANDs, not AND-of-ORs.
::

## 3x00. Comparison Operators & Real-World Translation

Boolean values don't appear from nowhere. They're produced by **comparison operators** that evaluate numeric relationships, and by translating real-world business rules into logical code. This section bridges the gap between "math class logic" and "production Java code."

### 3x01. Relational Operators

::DefBox{id="Relational Operators"}
**Relational operators** compare two numeric values and produce a `boolean` result:

| Operator | Meaning | Example | Result |
|:---|:---|:---|:---|
| `>` | Greater than | `5 > 3` | `true` |
| `<` | Less than | `5 < 3` | `false` |
| `>=` | Greater than or equal to | `5 >= 5` | `true` |
| `<=` | Less than or equal to | `3 <= 5` | `true` |
::

::NoteBox
**Memory trick for `>=` and `<=`:** Read them left to right. "Greater than or equal to" → `>=`. Always put the comparison sign **before** the equals sign — `>=` not `=>` (the latter means something completely different in some languages and is a syntax error in Java).
::

### 3x02. Equality Operators

::DefBox{id="Equality Operators"}
Java distinguishes **assignment** from **equality checking**:

| Operator | Meaning | Example |
|:---|:---|:---|
| `=` | **Assignment** — stores a value into a variable | `int x = 5;` |
| `==` | **Equality** — tests whether two values are the same | `x == 5` → `true` |
| `!=` | **Inequality** — tests whether two values are different | `x != 3` → `true` |
::

::WarningBox
This is the most common beginner bug in Java:

```java
int x = 5;
if (x = 3) {        // COMPILE ERROR — = is assignment, not comparison
    // ...
}

if (x == 3) {       // Correct — == tests equality
    // ...
}
```

The single `=` **assigns**; it doesn't ask a question. The double `==` **asks "are these equal?"** If you write `if (x = 3)`, the compiler will complain because `x = 3` is an `int` expression (the assigned value), not a `boolean` — and `if` requires a `boolean` condition.

The `!=` operator reuses the `!` you already know: `a != b` means `!(a == b)`. "Not equal" = "it is not the case that they are equal."
::

::ExampleBox
```java
int age = 18;
boolean canVote = (age >= 18);           // true — relational operator
boolean isMinor = (age < 18);            // false
boolean isExactlyEighteen = (age == 18); // true — equality operator
boolean isNotTwentyOne = (age != 21);    // true — inequality operator
```
::

::WarningBox
You cannot compare booleans with `<` or `>` — boolean values are not ordered:

```java
true < false    // COMPILE ERROR — booleans cannot be compared for magnitude
```

Booleans can only be checked for equality (`==`, `!=`) or combined with logical operators (`&&`, `||`, `!`). There is no concept of "true is greater than false."
::

### 3x03. Translating "Any Of" → OR

In specification documents, requirements are often phrased in natural language. Two patterns dominate: **"any of"** and **"all of."** Each maps directly to a logical operator.

::DefBox{id="Any Of → OR"}
When a specification says **"any of the following conditions"**, it means: **if at least one condition is `true`, the whole thing is `true`.** This maps to chained **OR (`||`)**.
::

::ExampleBox
**Scenario**: A security alarm triggers if **any of** the following occurs:

1. The emergency button is pressed (`emergencyPressed`)
2. A window sensor breaks while the system is armed (`windowBroken && systemArmed`)

```java
boolean alarmTriggered = emergencyPressed || (windowBroken && systemArmed);
```

If the button is pressed, the alarm goes off — we don't even need to check the windows. If the button isn't pressed but a window breaks while armed, the alarm still triggers. The `||` captures "either is sufficient."
::

### 3x04. Translating "All Of" → AND

::DefBox{id="All Of → AND"}
When a specification says **"all of the following conditions"**, it means: **every single condition must be `true`.** This maps to chained **AND (`&&`)**.
::

::ExampleBox
**Scenario**: A customer qualifies for free shipping if **all of** the following are met:

1. The customer is a member (`isMember`)
2. The cart total is at least $150 (`cartTotal >= 150`)
3. The customer has a valid voucher (`hasValidVoucher`)

```java
boolean qualifiesFreeShipping = isMember && (cartTotal >= 150) && hasValidVoucher;
```

Miss any one condition — say, the cart is only $140 — and the whole expression becomes `false`. Every `&&` is a gate that must be passed.
::

### 3x05. Putting It Together — Mixed Conditions

Real business logic often mixes "any of" and "all of":

::ExampleBox
**Scenario**: A customer gets priority shipping if they meet **all of** the following:

1. The order is placed before 2 PM (`orderHour < 14`)
2. The customer qualifies for **any of**:
   - Premium member (`isPremium`)
   - Order total exceeds $200 (`orderTotal > 200`)

```java
boolean getsPriorityShipping = (orderHour < 14) && (isPremium || orderTotal > 200);
```

Read it in English: "Order before 2 PM **AND** (premium member **OR** total over 200)." The parenthesization is critical — without it:

```java
// WRONG:
boolean getsPriorityShipping = orderHour < 14 && isPremium || orderTotal > 200;
// This means: (orderHour < 14 && isPremium) || orderTotal > 200
// A $300 order at 10 PM would qualify — not what the spec says!
```

**Always parenthesize mixed `&&`/`||` conditions.** The compiler has precedence rules (`&&` binds tighter than `||`), but relying on them makes your code fragile and hard to read. Explicit parentheses are free — use them.
::

### 3x06. More Worked Examples

Each example below builds the expression **branch by branch**, then combines them. Follow the same process on your own: write each bullet point as its own mini-expression first, then connect them with `&&` (for "all of") or `||` (for "any of").

::ExampleBox
**Scenario**: A student passes the course if they meet **all of** the following:

1. Homework average is at least 60
2. Exam average is at least 65
3. Attendance rate is at least 75%

**Step 1 — Write each branch independently:**

| Branch | English | Java |
|:---|:---|:---|
| ① | Homework average ≥ 60 | `hwAvg >= 60` |
| ② | Exam average ≥ 65 | `examAvg >= 65` |
| ③ | Attendance rate ≥ 75% | `attendanceRate >= 0.75` |

**Step 2 — Identify the connective.** The spec says "**all of** the following" → `&&`.

**Step 3 — Join the branches:**

```java
boolean passesCourse = (hwAvg >= 60) && (examAvg >= 65) && (attendanceRate >= 0.75);
//                      ①                 ②                   ③
```

Step 3 is mechanical once Steps 1 and 2 are done: you're just placing `&&` between the branches you already wrote. The parentheses around each branch are optional here (comparisons bind tighter than `&&`), but they make the expression easier to scan — each pair of parentheses visually groups one bullet point.
::

::ExampleBox
**Scenario**: An account is locked if **any of** the following is true:

1. There have been 5 or more failed login attempts
2. An administrator has manually flagged the account
3. The account has been inactive for over 365 days

**Step 1 — Write each branch independently:**

| Branch | English | Java |
|:---|:---|:---|
| ① | Failed attempts ≥ 5 | `failedAttempts >= 5` |
| ② | Admin flagged | `adminFlagged` |
| ③ | Inactive > 365 days | `daysInactive > 365` |

Notice branch ②: `adminFlagged` is already a `boolean` variable. You don't write `adminFlagged == true` — the variable itself *is* the condition. (Writing `== true` is redundant: `adminFlagged == true` is equivalent to just `adminFlagged`.)

**Step 2 — Identify the connective.** "**Any of** the following" → `||`.

**Step 3 — Join the branches:**

```java
boolean isLocked = (failedAttempts >= 5) || adminFlagged || (daysInactive > 365);
//                      ①                    ②                 ③
```

Any one branch being `true` makes `isLocked` true. If none are true, `isLocked` is `false` — the account stays unlocked.
::

::ExampleBox
**Scenario**: A ride-share applies surge pricing when **all of** the following are true:

1. It is currently peak hours (captured by `isPeakHour`)
2. **Any of** these demand conditions hold:
   - Bad weather (`isBadWeather`)
   - More than 50 riders waiting (`waitingRiders > 50`)
   - A major event is nearby (`hasNearbyEvent`)

**Step 1 — Write each branch independently.** These are nested: the second bullet is itself a mini-spec.

*Outer layer (the "all of"):*

| Branch | English | Java |
|:---|:---|:---|
| ① | It is peak hours | `isPeakHour` |
| ② | (demand condition — to be built) | `???` |

*Inner layer — branch ②'s sub-conditions (the "any of"):*

| Sub-branch | English | Java |
|:---|:---|:---|
| ⓐ | Bad weather | `isBadWeather` |
| ⓑ | Waiting riders > 50 | `waitingRiders > 50` |
| ⓒ | Nearby event | `hasNearbyEvent` |

**Step 2 — Identify the connectives.** Outer: "all of" → `&&`. Inner: "any of" → `||`.

**Step 3 — Build inside-out.** First, join the inner sub-branches:

```java
// Branch ② — demand condition (any of ⓐ, ⓑ, ⓒ):
isBadWeather || (waitingRiders > 50) || hasNearbyEvent
//  ⓐ               ⓑ                       ⓒ
```

Now plug branch ② into the outer expression alongside branch ①:

```java
boolean surgePricing = isPeakHour && (isBadWeather || (waitingRiders > 50) || hasNearbyEvent);
//                       ①             ② — the inner group, wrapped in parentheses
```

The parentheses around the inner group are **not optional**. Without them:

```java
// WRONG:
isPeakHour && isBadWeather || waitingRiders > 50 || hasNearbyEvent
// Evaluates as: (isPeakHour && isBadWeather) || (waitingRiders > 50) || hasNearbyEvent
```

This means "surge pricing applies during peak hours with bad weather, OR any time there are 50+ riders, OR any time there's a nearby event" — which lets surge pricing fire at 3 AM just because of an event. The parentheses enforce that peak hours is a non-negotiable prerequisite for *all three* demand conditions.
::

::ExampleBox
**Scenario**: A user can reset their password if they meet **all of** the following:

1. They know the email address on file (`knowsEmail`)
2. They pass **any of** these verification methods:
   - They have the recovery phone (`hasPhone`)
   - They have the backup email (`hasBackupEmail`)
   - They answered the security question (`answeredSecurityQuestion`)

**Step 1 — Write each branch independently.**

*Outer layer:*

| Branch | English | Java |
|:---|:---|:---|
| ① | Knows the email | `knowsEmail` |
| ② | Passes verification (to be built) | `???` |

*Inner layer — branch ②'s sub-conditions:*

| Sub-branch | English | Java |
|:---|:---|:---|
| ⓐ | Has recovery phone | `hasPhone` |
| ⓑ | Has backup email | `hasBackupEmail` |
| ⓒ | Answered security question | `answeredSecurityQuestion` |

**Step 2 — Connectives.** Outer: "all of" → `&&`. Inner: "any of" → `||`.

**Step 3 — Build inside-out.**

```java
// Branch ② — passes verification (any of ⓐ, ⓑ, ⓒ):
hasPhone || hasBackupEmail || answeredSecurityQuestion
//  ⓐ          ⓑ                  ⓒ

// Combine with branch ①:
boolean canResetPassword = knowsEmail && (hasPhone || hasBackupEmail || answeredSecurityQuestion);
//                           ①             ② — wrapped in parentheses
```

This is the same "all of (any of ...)" template as the surge pricing example. Once you recognize the pattern, the construction process is identical — only the variable names change. The inner group always gets parentheses; the outer `&&` connects the mandatory condition to the flexible group.
::

::ExampleBox
**Scenario**: An online order qualifies for a discount under **any of** these conditions:

1. The customer has a membership **and** the cart total is at least $100
2. There is an active seasonal sale
3. The customer has a promo code **and** hasn't already used it this month

**Step 1 — Write each branch independently.**

| Branch | English | Java |
|:---|:---|:---|
| ① | Has membership AND cart ≥ $100 | `isMember && (cartTotal >= 100)` |
| ② | Active seasonal sale | `isSeasonalSale` |
| ③ | Has promo code AND NOT used this month | `hasPromoCode && !usedPromoThisMonth` |

This time, two of the branches (① and ③) are themselves `&&` expressions — each bullet point had its own internal "and." We write each branch as a self-contained expression first, without worrying about how they'll connect.

Notice branch ③: "hasn't already used it" → `!usedPromoThisMonth`. The `!` flips the boolean — `usedPromoThisMonth` being `false` means they *haven't* used it, which is what we want.

**Step 2 — Identify the connective.** The outermost spec says "**any of** these conditions" → `||`.

**Step 3 — Join the branches:**

```java
boolean qualifiesForDiscount = (isMember && (cartTotal >= 100))   // ①
                               || isSeasonalSale                 // ②
                               || (hasPromoCode && !usedPromoThisMonth);  // ③
```

Each branch stands independently — satisfy ①, OR ②, OR ③, and you get the discount. Branches ① and ③ each require two things simultaneously (that's their internal `&&`), but the outer `||` only needs one branch to succeed.

The formatting — one branch per line, each starting with `||` — isn't required by the compiler, but it mirrors the bullet-point structure of the original specification. When reading this code six months later, you can see the three alternatives at a glance.
::

::Mcq
---
options:
    - "1. `hasTicket && age >= 18`"
    - "2. `hasTicket || age >= 18`"
    - "3. `hasTicket && (age >= 18)`"
    - "4. `hasTicket || (age < 18)`"
correct: 2
---

#prompt
A concert venue's policy: "Entry is allowed if the person has a ticket **or** is at least 18 years old." Which boolean expression correctly implements this rule? (`hasTicket : boolean`, `age : int`)

#explanation
"Any of" maps to OR. The person can enter if they have a ticket OR they are 18+. Option 2 correctly captures this. Options 1 and 3 use AND — those would require *both* conditions, which is stricter than the policy. Option 4 uses `||` but with the inverted age condition.
::

::Mcq
---
options:
    - "1. `a || b` — an OR expression"
    - "2. `a && b` — an AND expression"
    - "3. `!a || b` — NOT-OR expression"
    - "4. `a == b` — an equality check"
correct: 2
---

#prompt
A specification says: "The transaction is approved if **all of the following** are true: the account has sufficient funds, and the PIN is correct." Which logical structure does this require?

#explanation
"All of" maps to AND (`&&`). Every condition must be `true` simultaneously. Option 1 (OR) would approve the transaction if *either* funds are sufficient *or* the PIN is correct — unsafe! Option 3 adds an unnecessary negation. Option 4 checks if the two booleans are equal (both true or both false), which allows approving when both are false — also incorrect.
::

---
::NoteBox
**Cognitive Anchor**

- The `boolean` type holds exactly two values: `true` and `false`. All comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) produce `boolean` results. The three logical operators — `&&` (AND), `||` (OR), `!` (NOT) — combine and invert boolean values.
- **AND (`&&`)**: "Falsify early" — returns `true` only when **both** operands are `true`. A single `false` makes the whole thing `false`. Think intersection: the overlap of two conditions.
- **OR (`||`)**: "Satisfy early" — returns `true` when **at least one** operand is `true`. Only returns `false` when both are `false`. Think union: either condition being met is enough.
- **NOT (`!`)**: Unary inversion — `!true` → `false`, `!false` → `true`. Simple alone, powerful in combination.
- **Truth tables** enumerate every input combination. For $n$ variables, there are $2^n$ rows. They are the "ground truth" fallback — when in doubt, build the table.
- **Idempotent Law**: `a && a ≡ a` and `a || a ≡ a`. Repeating doesn't change the result.
- **Double Negation**: `!!a ≡ a`. Two NOTs cancel. This holds in classical logic (Java); intuitionistic logics differ, but that's outside AP scope.
- **Commutativity & Associativity**: AND and OR chains can be reordered and regrouped freely — just like `+` and `×` in ordinary arithmetic.
- **Distributive Law**: `a && (b || c) ≡ (a && b) || (a && c)` (AND over OR — matches arithmetic). `a || (b && c) ≡ (a || b) && (a || c)` (OR over AND — **no arithmetic equivalent**, uniquely boolean).
- **De Morgan's Laws**: `!(a && b) ≡ !a || !b` and `!(a || b) ≡ !a && !b`. Push `!` inward, **flip the operator**, negate each term. In English: "not (A and B)" = "not A or not B"; "neither A nor B" = "not A and not B."
- **Law of Excluded Middle** (Tautology): `a || !a` is **always `true`**. A thing either is or isn't — no third option.
- **Law of Contradiction** (Absurdity): `a && !a` is **always `false`**. Something cannot both be and not be simultaneously.
- **Truth-Functional Semantics**: Java's logic engine — the result of an expression depends *only* on the truth values of its components. No "proofs," just input bits → output bit. This is why truth tables work.
- **Arithmetic Mapping**: Treat `true` as $1$, `false` as $0$. Then `&&` → multiplication, `||` → addition, `!` → $1 - a$. This turns boolean simplification into familiar algebra.
- **Disjunctive Normal Form (DNF)**: An OR of AND-clauses — "sum of products." Every boolean expression can be reduced to DNF using De Morgan + distributivity + absorption. DNF provides a canonical form for comparison.
- **Relational operators** (`>`, `<`, `>=`, `<=`) compare numbers and produce booleans. **Equality operators**: `==` tests equality, `!=` tests inequality. Never confuse `=` (assignment) with `==` (comparison).
- **"Any of" → OR (`||`)**: At least one condition must be true. **"All of" → AND (`&&`)**: Every condition must be true. Always parenthesize mixed `&&`/`||` expressions — explicit grouping prevents bugs.
- Booleans **cannot** be compared with `<` or `>` — they are not ordered. They can only be checked with `==`/`!=` or combined with `&&`/`||`/`!`.

Next lecture will cover control flow — how boolean conditions drive `if`, `else`, and loop structures.

::

## Glossary

New terms introduced in this lecture. For terms from Lectures 1–2 (bit, byte, stack, heap, Oxford bracket, type casting, lvalue, rvalue, etc.), see the previous articles' glossaries.

| Term | Everyday / Literal Meaning | What It Means in CS |
|:---|:---|:---|
| **Absurdity** (矛盾式) | Something ridiculous or impossible | A boolean expression that is **always `false`**, regardless of inputs. `a && !a` is the canonical example. Also called a **contradiction**. |
| **Associativity** (结合律) | Grouping things together | The property that `(a && b) && c ≡ a && (b && c)` — regrouping doesn't change the result. Holds for both `&&` and `||`. |
| **Boolean** (布尔值) | Named after George Boole | A primitive type with exactly two values: `true` and `false`. The bedrock of all conditional logic in Java. |
| **Commutativity** (交换律) | Being able to swap order | The property that `a && b ≡ b && a` — order doesn't matter. Holds for both `&&` and `||`. |
| **De Morgan's Laws** (德摩根定律) | Named after Augustus De Morgan | Two laws describing how negation distributes: `!(a && b) ≡ !a \|\| !b` and `!(a \|\| b) ≡ !a && !b`. Push `!` in, flip the operator. |
| **Disjunctive Normal Form** (析取范式) | — | A standardized representation: OR of AND-clauses, with negations only on individual variables. "Sum of products." Every boolean expression has a DNF equivalent. |
| **Distributive Law** (分配律) | Sharing something out | `a && (b \|\| c) ≡ (a && b) \|\| (a && c)` — analogous to $a(b + c) = ab + ac$. The OR-over-AND form has no arithmetic equivalent. |
| **Double Negation** (双重否定) | Saying "not not" | `!!a ≡ a` — two negations cancel. "It is not the case that it is not raining" = "It is raining." |
| **Idempotent Law** (幂等律) | — | `a && a ≡ a` and `a \|\| a ≡ a`. Repeating the same operand doesn't change anything. |
| **Law of Contradiction** (矛盾律) | Something self-contradictory | `a && !a` is always `false`. A proposition cannot be both true and false at the same time. |
| **Law of Excluded Middle** (排中律) | No middle ground | `a \|\| !a` is always `true`. Every proposition is either true or false — there is no third option. |
| **Literal** (文字) | A letter or symbol | In boolean algebra, a variable (`a`) or its negation (`!a`). The atomic building block of DNF clauses. |
| **Logical AND** (逻辑与) | — | Binary operator `&&`: returns `true` iff both operands are `true`. "Falsify early" — one `false` poisons the result. |
| **Logical NOT** (逻辑非) | — | Unary prefix operator `!`: inverts the operand. `!true` → `false`; `!false` → `true`. |
| **Logical OR** (逻辑或) | — | Binary operator `\|\|`: returns `true` if at least one operand is `true`. "Satisfy early" — one `true` is enough. |
| **Relational Operator** (关系运算符) | — | Operators (`>`, `<`, `>=`, `<=`) that compare two numeric values and produce a `boolean`. |
| **Tautology** (重言式) | Saying the same thing twice | A boolean expression that is **always `true`**, regardless of inputs. `a \|\| !a` is the canonical example. |
| **Truth-Functional Semantics** (真值函数语义) | — | The evaluation model where a compound expression's truth value depends *only* on the truth values of its components. Java uses this model. Contrasts with BHK (constructive proof) semantics. |
| **Truth Table** (真值表) | — | A table enumerating all input combinations and the resulting output. For $n$ boolean variables, there are $2^n$ rows. The definitive reference for verifying logical equivalence. |

::LinkCard
---
url: "http://online-java.com"
title: "Online Java — Browser-Based Java REPL"
details: "Experiment with boolean expressions, truth tables, and De Morgan's laws. Try simplifying a complex condition and verify with `==` that the simplified version produces identical results for all inputs."
---
::
