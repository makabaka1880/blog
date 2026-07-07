---
title: APCSA - All about Types
description: AP Computer Science A Lecture 2 — Oxford brackets, signed integers, memory deep dive, type casting, and error classification
createTime: 2026-07-07
updateTime: 2026-07-07

tags:
    - APCSA
---

## 0x00. Oxford Brackets — A Shorthand for Types

Before we dive into type rules, we need a compact way to talk about types. Writing "a variable of type `int`" or "the set of all possible `double` values" every time gets verbose. So we borrow a notation from mathematics.

### 0x01. The `:` Annotation

When you see:

```ansi
[32mx[0m [90m:[0m [36mint[0m
```

Read it as: **"x is of type int"** or **"x has type int."** The colon `:` is a type annotation — it labels a variable with its type without writing a full Java declaration. It's a shorthand for communication, not something you type into a `.java` file.

```java
// In Java source code:
int a = 3;
double b = 5;

// In our discussion shorthand:
// a : int
// b : double
```

We can also annotate initialization inline with `:=`:

```ansi
[32ma[0m [90m:[0m [36mint[0m [90m:= [0m[33m3[0m        [90m// "a is an int, initialized to 3"[0m
[32mb[0m [90m:[0m [36mdouble[0m [90m:= [0m[33m5.0[0m   [90m// "b is a double, initialized to 5.0"[0m
```

::NoteBox
This is notation for **our discussion** — the `:` and `:=` annotations appear in comments and notes, not in actual Java code. They let us communicate types and values compactly while tracing through examples.
::

### 0x02. The `⟦ ⟧` Bracket

The double bracket `⟦ ⟧` (sometimes called the **Oxford bracket**) takes a type and gives you the **set of all values that belong to that type** — the mathematical intuition behind the type.

::DefBox{id="Oxford Bracket"}
For any type `T`, write `⟦T⟧` to mean "the set of all possible values of type `T`":

$$
\begin{aligned}
⟦\texttt{int}⟧ &= \{\ldots, -2, -1, 0, 1, 2, \ldots\} \quad &\text{(the integers)} \\[4pt]
⟦\texttt{double}⟧ &= \{\ldots, 0.0, 0.5, 1.0, 3.14159, \ldots\} \quad &\text{(the real numbers, approximately)} \\[4pt]
⟦\texttt{boolean}⟧ &= \{\texttt{true}, \texttt{false}\}
\end{aligned}
$$
::

This lets us reason about types using familiar set concepts. The relationship between `int` and `double` becomes simple:

$$
⟦\texttt{int}⟧ \subseteq ⟦\texttt{double}⟧
$$

Every integer is also a real number. The set of ints is a **subset** of the set of doubles. As we'll see, this subset relationship is the entire basis for type conversion rules.

::NoteBox
The Oxford bracket is a thinking tool — a way to visualize types as "containers" holding sets of values. `⟦int⟧` is a smaller container (all the integers); `⟦double⟧` is a larger container (all the real numbers). You can pour the small container into the large one without spilling. Pouring the large one into the small one — you'll lose stuff. That's the entire intuition for type casting, and we'll return to it throughout this lecture.
::

## 1x00. Signed & Unsigned Integers

Lecture 1 introduced binary as representing non-negative numbers. But `int` in Java stores both positive and negative values. How?

### 1x01. The Sign Bit

::DefBox{id="Sign Bit"}
In a **signed integer**, the **most significant bit** (the leftmost bit) is reserved to indicate the sign: $0$ for non-negative, $1$ for negative. The remaining bits encode the magnitude.
::

For a 32-bit `int`, this means only **31 bits** are available for the actual number — the 32nd bit is the sign flag. The range is therefore:

$$
-2^{31} \text{ to } 2^{31} - 1 \quad \approx \quad -2.147 \times 10^9 \text{ to } 2.147 \times 10^9
$$

::NoteBox
Why does the negative side get one extra value ($-2^{31}$ exists, but $+2^{31}$ does not)? Because **zero** takes up one slot on the non-negative side. There are $2^{32}$ possible bit patterns total — an even number. Zero claims the all-zeros pattern, leaving the positives and negatives to split the rest unevenly: $2^{31}$ negatives and $2^{31} - 1$ positives (plus zero). The computer places zero in the "non-negative" camp, so positive numbers get one fewer slot.
::

### 1x02. Unsigned Integers (Not on the AP Exam)

::DefBox{id="Unsigned Integer"}
An **unsigned integer** uses ALL bits for magnitude — there is no sign bit. For $n$ bits, the range is $0$ to $2^n - 1$.
::

::ExampleBox
For 4 bits:

| Bit Pattern | Signed (4-bit) | Unsigned (4-bit) |
|:---|:---|:---|
| `0000` | $0$ | $0$ |
| `0111` | $7$ (max positive) | $7$ |
| `1000` | $-8$ (most negative) | $8$ |
| `1111` | $-1$ | $15$ (max) |

The unsigned maximum is $2^4 - 1 = 15$ — every bit pattern is a non-negative number. The signed maximum is only $2^3 - 1 = 7$ because one bit is sacrificed for the sign.
::

::WarningBox
**AP exam scope**: Java does not have unsigned integer types (unlike C/C++). The exam only tests signed integers. The unsigned concept is discussed here because it illuminates *why* signed ranges are asymmetric — but you will NOT be tested on `unsigned` syntax or semantics.
::

### 1x03. The Off-by-One Trap

A recurring theme in computing: counting starts at $0$, not $1$. For $n$ bits:

- Number of distinct patterns: $2^n$
- Maximum unsigned value: $2^n - 1$ (because $0$ uses one of those patterns)

This $-1$ adjustment — the **off-by-one error** — is one of the most common mistakes in programming. It's the same logic as the "fence-post problem": 10 fence panels need 11 fence posts. The number of *values* is one more than the number of *gaps between them*.

::Mcq
---
options:
    - "1. $0$ to $2^{32} - 1$"
    - "2. $-2^{31}$ to $2^{31} - 1$"
    - "3. $-2^{32}$ to $2^{32} - 1$"
    - "4. $-2^{31}$ to $2^{31}$"
correct: 2
---

#prompt
What is the range of a 32-bit **signed** integer?

#explanation
A 32-bit signed integer uses 1 bit for the sign and 31 bits for magnitude. The range is $-2^{31}$ to $2^{31} - 1$. Option 1 is the unsigned range. Option 3 uses the wrong exponent. Option 4 misses the $-1$ adjustment — zero claims one of the $2^{31}$ non-negative slots, so the positive max is $2^{31} - 1$, not $2^{31}$.
::

::Mcq
---
options:
    - "1. $15$"
    - "2. $16$"
    - "3. $7$"
    - "4. $8$"
correct: 1
---

#prompt
What is the maximum value representable by a 4-bit **unsigned** integer?

#explanation
With 4 bits and no sign bit, all $2^4 = 16$ patterns represent non-negative numbers: $0$ through $15$. The maximum is $2^4 - 1 = 15$. A signed 4-bit integer would max out at $2^3 - 1 = 7$ (option 3).
::

## 2x00. Memory: Stack & Heap Revisited

Lecture 1 introduced the stack and heap as two storage regions. Now we go deeper — understanding *why* the split exists and *how* each region behaves when variables come and go.

### 2x01. The Stack: Fixed-Size, Compile-Time Allocation

::DefBox{id="Stack Memory (Expanded)"}
The stack stores data whose **size and lifetime are known at compile time**. Primitive types (`int`, `double`, `boolean`) and **references** (addresses pointing to heap objects) live here.

Key properties:
- **LIFO** (Last In, First Out) — like a stack of trays in a cafeteria: you can only take from the top
- Each method call creates a **stack frame**; when the method returns, the frame is popped and all its local variables disappear
- Allocation is trivial: the compiler calculates the exact byte offset for every variable before the program ever runs
::

::ExampleBox
```java
int a = 3;       // 4 bytes allocated on the stack, value set to 3
a = 10;          // same 4 bytes — the value changes, the location does NOT
int b = a + 5;   // new 4 bytes allocated, value set to 15
```

The variable `a` occupies a fixed slot on the stack. Whether `a` holds `3` or `10` or `1000000`, the slot size never changes — `int` is always 4 bytes. This is the defining property of stack storage: **the location is fixed; only the contents change.**

Think of the stack like a pencil box: each pencil occupies exactly one slot, always the same size. You can swap pencils in and out, but you can't suddenly decide a pencil slot should hold a textbook.
::

### 2x02. The Heap: Dynamic, Runtime Allocation

Not everything fits in a fixed-size box. A `String` could be 0 characters or 10,000 characters. The stack cannot pre-allocate for "unknown length."

::DefBox{id="Heap Memory (Expanded)"}
The heap stores data whose **size is not known until runtime** — strings, arrays, and all objects.

Key properties:
- **No ordering constraint** — allocation and deallocation happen in any order, not LIFO
- The JVM's **garbage collector (GC)** automatically reclaims heap memory that is no longer reachable from any variable
- Allocation is slower than stack allocation: the JVM must search for a free block of sufficient size amid potentially fragmented space
::

::ExampleBox
Imagine a writer drafting a manuscript. Each new chapter adds pages — the total length is unknowable in advance. The writer doesn't pre-allocate exactly 200 pages; they grab more paper as needed. New pages go wherever there's blank space. That's the heap.

Contrast with a library card catalog: each card is exactly 3×5 inches, always. You know the size before you write anything. Cards go in order; you remove from the top. That's the stack.
::

The central insight:

| Property | Stack | Heap |
|:---|:---|:---|
| Size known at compile time? | Yes | No |
| Allocation order | LIFO (strict) | Any order |
| Deallocation | Automatic (frame pop) | Garbage collector |
| Speed | Very fast | Slower (search for free block) |
| What lives here | Primitives, references | Objects, arrays, strings |

### 2x03. String Immutability

::DefBox{id="Immutable String"}
A `String` object in Java is **immutable**: once created, its character content cannot be changed. Any operation that appears to "modify" a string actually creates a **new** `String` object on the heap, leaving the original untouched.
::

```java
String s = "hello";
s = s + " world";   // Does NOT modify "hello" — creates a NEW String "hello world"
// The original "hello" object is now unreachable and will be garbage-collected
```

::WarningBox
A `String` variable lives on the **stack** — but it stores only a **reference** (a memory address). The actual character data lives on the **heap**. When you "reassign" a string, you're changing the address stored in the stack variable, not modifying the heap object. The old heap object becomes garbage.
::

This is why repeatedly building strings with `+` in a loop is inefficient: each `+` creates a new heap object, and the old ones pile up as garbage. (The `StringBuilder` class exists specifically to solve this — not tested on the AP exam, but good to know.)

::McqMultiple
---
options:
    - 1. "Primitive types are stored on the stack because their sizes are known at compile time"
    - 2. "The heap follows LIFO ordering for allocation and deallocation"
    - 3. "String objects are immutable — operations that seem to modify them actually create new objects"
    - 4. "The garbage collector frees heap memory automatically when objects become unreachable"
correct:
    - 1
    - 3
    - 4
---

#prompt
Which of the following statements about memory are TRUE? (Select all that apply.)

#explanation
Options 1, 3, and 4 are true. Option 2 is false — the **stack** follows LIFO, not the heap. The heap allocates and deallocates in any order, managed by the garbage collector. Java has no manual `delete` keyword; the GC handles deallocation automatically.
::

## 3x00. Type Casting & Coercion

Variables have types. But what happens when you mix them — assigning an `int` to a `double`, or vice versa?

### 3x01. The Core Principle

Recall our Oxford bracket intuition:

$$
⟦\texttt{int}⟧ \subseteq ⟦\texttt{double}⟧
$$

Every integer is a valid real number. This subset relationship drives everything:

::DefBox{id="Type Compatibility Rule"}
A value of type $A$ can be assigned to a variable of type $B$ **without extra syntax** if and only if $⟦A⟧ \subseteq ⟦B⟧$ — every value of $A$ is also a valid value of $B$.
::

```java
int a = 3;
double b = 5;

b = a;   // OK: ⟦int⟧ ⊂ ⟦double⟧ — no information lost
a = b;   // ERROR: ⟦double⟧ ⊄ ⟦int⟧ — 3.5 is not an int
```

::NoteBox
This is the "big container / small container" rule visualized through Oxford brackets. You can pour a small cup (int) into a big bucket (double) without spilling. But pouring a bucket into a cup — you'll lose water, and Java refuses to do it silently.
::

### 3x02. Implicit Conversion (Widening)

::DefBox{id="Implicit Conversion"}
When a "smaller" type (in the subset sense) is assigned to a "larger" type, Java automatically converts it. This is called **widening** or **type promotion**. No special syntax is needed.
::

```java
int x = 5;
double y = x;        // y = 5.0 — int automatically promoted to double

double result = 3;   // 3 → 3.0 automatically
```

In mixed-type expressions, the "smaller" operand is promoted to match the "larger" one:

```java
int a = 3;
double b = 2.5;
double c = a + b;    // a is promoted to 3.0, then 3.0 + 2.5 = 5.5
// The expression a + b has type double
```

::WarningBox
**Critical rule**: when an `int` and a `double` participate in the same operation, the result is **always** `double`. The compiler does this regardless of the actual numeric values — it reasons about **types**, not **values**. Even if `3 + 2.0` mathematically equals `5` (an integer), the expression's type is still `double`.
::

### 3x03. Explicit Coercion (Narrowing)

When you need to go the other direction — `double` → `int` — you must explicitly tell the compiler: "I know this loses information, do it anyway."

::DefBox{id="Explicit Coercion (Cast)"}
A **cast** (强制类型转换) is an operator that converts a value from one type to another. In BNF:

```enbf
<coercion> ::= "(" <type> ")" <term>
```

The syntax is the target type in parentheses, placed immediately before the value to convert.
::

```java
double pi = 3.14159;
int approx = (int) pi;    // approx = 3 — the fractional part is TRUNCATED (not rounded!)
```

::WarningBox
Casting `double` to `int` **truncates** (截断) — it chops off the decimal part. `(int) 3.9` is `3`, **not** `4`. This is not rounding; it's simply discarding everything after the decimal point.
::

::ExampleBox
Working through a few cases:

```java
// b : double
b = (int) (2.5 + 3);
// 2.5 + 3 → int 3 promoted to 3.0, then 3.0 + 2.5 = 5.5 (double)
// (int) 5.5 → 5 (truncation)
// 5 assigned to b → 5.0 (int auto-widened to double for the assignment)
// Result: b = 5.0
```

```java
// a : int
a = (double) (a * 2);
// a * 2 → int * int → int
// (double) (int result) → widens to double
// double value cannot be assigned to int a → COMPILE ERROR
```
::

::ExampleBox
Tracing through a more complex example with changing values:

```java
// a : int := 1; b : double := 2.5
a = (int) (a + b);
// a + b = 1 + 2.5 = 3.5 (type: double — int promoted to match double)
// (int) 3.5 = 3 (truncation)
// a = 3 ✓

b = (int) (a - b);
// a is now 3, b is still 2.5
// a - b = 3 - 2.5 = 0.5 (type: double)
// (int) 0.5 = 0 (truncation)
// b = 0.0 (int 0 auto-widened to double for the assignment)
// Result: a = 3, b = 0.0
```
::

### 3x04. The Compiler Only Looks at Types

This is the single most important insight for the exam:

::DefBox{id="Static Type Checking"}
When deciding whether an assignment is legal, the Java compiler looks **only at the declared types** — never at the actual runtime values. Even if the value happens to be "integer-like," a `double` → `int` assignment always requires a cast.
::

```java
double x = 5.0;
int y = x;            // ERROR — even though 5.0 is "really" 5, the compiler sees double → int

int a = 3;
double b = 2.0;
int c = a + b;        // ERROR — a + b is double (int + double → double), can't assign to int
```

The compiler is a "rule-follower," not a "math-checker." It applies type rules mechanically. It will **not** run your program in its head to see that `5.0` could safely become `5`. It sees `double → int`, and that's a narrowing conversion — rejected unless you cast.

::Mcq
---
options:
    - "1. `int x = 5; double y = x;`"
    - "2. `double x = 3.14; int y = (int) x;`"
    - "3. `int x = 10; int y = x + 0.5;`"
    - "4. `double x = 5.0; int y = (int) (x + 3);`"
correct: 3
---

#prompt
Which of the following will cause a **compile-time error**?

#explanation
Option 3 fails because `x + 0.5` involves an `int` and a `double` literal — the expression type is `double`, which cannot be assigned to `int y` without a cast. Option 1 is fine (widening int → double). Option 2 uses an explicit cast. Option 4 casts the expression result before assignment.
::

::Mcq
---
options:
    - "1. `int a = 5; double b = a;` — `b` becomes `5.0`"
    - "2. `double x = 3.9; int y = (int) x;` — `y` becomes `3`"
    - "3. `int p = 4; int q = p + 3.0;` — `q` becomes `7`"
    - "4. `double m = 2.5; int n = (int) (m + 1.5);` — `n` becomes `4`"
correct: 3
---

#prompt
Which statement is FALSE?

#explanation
Option 3 is false on two levels. First, `p + 3.0` is a `double` expression (int + double → double), so assigning to `int q` without a cast causes a compile error — the code doesn't even run. Second, even if it did compile, the result would be `7.0` (double), not `7` (int). Option 1: int → double widening, b = 5.0. Option 2: truncation, (int)3.9 = 3. Option 4: (int)(2.5 + 1.5) = (int)(4.0) = 4.
::

## 4x00. Expression Evaluation

### 4x01. Lvalue vs. Rvalue

Every piece of data in an assignment plays one of two roles:

::DefBox{id="Lvalue"}
An **lvalue** (left-value) is something that can appear on the **left** side of `=`. It names a **location** in memory — a slot that can hold a value. Variables (`a`, `count`, `totalCost`) are lvalues.
::

::DefBox{id="Rvalue"}
An **rvalue** (right-value) is something that can only appear on the **right** side of `=`. It **produces** a value but does not name a storage location. Literals (`5`, `3.14`), expression results (`a + b`), and cast results (`(int) x`) are all rvalues.
::

```java
int a = 5;       // a is an lvalue; 5 is an rvalue
a = a + 1;       // a (left) is an lvalue; a + 1 (right) is an rvalue
5 = a;           // ERROR — 5 is NOT an lvalue; you cannot assign TO a literal
```

An expression's sole purpose is to produce a value — it is an rvalue. A cast result `(int) x` is an rvalue too: it gives you a value; you cannot assign *into* a cast.

### 4x02. Reduction: Inside-Out Evaluation

::DefBox{id="Reduction (归约)"}
**Reduction** is the process of evaluating a compound expression by working from the **innermost** sub-expression outward — like peeling an onion. Each step replaces a sub-expression with its computed value until only a single value remains.
::

::ExampleBox
```java
// a : int := 1; b : double := 2.5; c : double := 3.0
double result = (a + b) * c;
```

Step-by-step reduction:
1. Innermost: `a + b` → `1 + 2.5` → `3.5` (int promoted to double, result is double)
2. Next: `3.5 * c` → `3.5 * 3.0` → `10.5` (double × double → double)
3. Assignment: `result = 10.5` ✓
::

The key discipline: **compute the value first, then check the type for assignment**. Don't try to reason about types and values simultaneously — separate the two concerns.

### 4x03. Operator Precedence in Casting

The cast operator `(type)` has very high precedence — higher than arithmetic operators but lower than parentheses:

```java
(int) 2.5 + 3.7    // ( (int) 2.5 ) + 3.7  →  2 + 3.7  →  5.5 (double)
(int) (2.5 + 3.7)  // (int) (6.2)  →  6 (int)
```

::WarningBox
Always use parentheses to make the cast target unambiguous: `(int) (a + b)` casts the **result** of `a + b`. Without parentheses, `(int) a + b` casts only `a`, then adds `b` — which may not be what you intended.
::

::Mcq
---
options:
    - "1. `(int) 3.8` evaluates to `3`"
    - "2. `(double) 5` evaluates to `5.0`"
    - "3. `(int) (2.5 + 3.5)` evaluates to `6`"
    - "4. `(int) 2.5 + 3.5` evaluates to `5`"
correct: 4
---

#prompt
Which of the following is FALSE?

#explanation
Option 4 is false: `(int) 2.5 + 3.5` — the cast binds to `2.5` first, giving `2`. Then `2 + 3.5 = 5.5` (int + double → double). So the result is `5.5`, not `5`. With parentheses — `(int) (2.5 + 3.5)` — the result would be `6`. All other options are correct: (int) truncates, (double) widens, and (int)(6.0) = 6.
::

## 5x00. Error Classification

Not all program failures are the same. APCSA distinguishes three categories, detected at different stages:

### 5x01. Compile-Time Errors

::DefBox{id="Compile-Time Error"}
A **compile-time error** (编译时错误) is caught by the compiler **before the program ever runs**. The compiler refuses to produce an executable until the error is fixed.

Common causes:
- **Syntax errors**: missing semicolons, unmatched braces, misspelled keywords
- **Type errors**: assigning `double` to `int` without a cast, using a variable before declaring it
- **Reference errors**: using a nonexistent variable name, calling a method with wrong argument types
::

```java
int x = "hello";     // COMPILE ERROR: String cannot be assigned to int
int y = z;           // COMPILE ERROR: z has not been declared
double a = 5.0;
int b = a;           // COMPILE ERROR: double → int without explicit cast
```

Compile-time errors are the *easiest* to fix — the compiler tells you exactly where the problem is. You cannot even run the program until they're resolved.

### 5x02. Runtime Errors

::DefBox{id="Runtime Error"}
A **runtime error** (运行时错误) occurs **during program execution**. The code compiled successfully, but something goes wrong while it runs.

Common causes:
- **Division by zero**: `int x = 5 / 0;` — compiles fine, crashes at runtime with `ArithmeticException`
- **Null pointer access**: calling a method on a `null` reference
- **Array index out of bounds**: accessing `arr[10]` when the array has only 5 elements
::

```java
int a = 5;
int b = 0;
int c = a / b;   // COMPILES, but throws ArithmeticException at runtime
```

::NoteBox
Interestingly, `5 / 0` for integers throws an exception, but `5.0 / 0.0` for doubles produces `Infinity` — not a runtime error. When the types differ, the behavior differs. The AP exam may test this distinction.
::

### 5x03. Logical Errors

::DefBox{id="Logical Error"}
A **logical error** (逻辑错误) is the most insidious: the program compiles and runs without crashing, but produces **incorrect results**. The code is syntactically valid and executes to completion — it just does the wrong thing.

Common causes:
- **Incorrect formula**: using `a + b / 2` instead of `(a + b) / 2` to compute an average
- **Off-by-one**: looping one too many or too few times
- **Integer division surprise**: `5 / 2` equals `2`, not `2.5` — the fractional part is silently discarded
::

::ExampleBox
```java
// Intent: compute the average of two test scores
int score1 = 5;
int score2 = 2;
double average = (score1 + score2) / 2;   // average = 3.0, not 3.5 — LOGICAL ERROR

// Why? (score1 + score2) is int 7. 7 / 2 is integer division → 3.
// Then 3 → 3.0 assigned to double. The fractional part was lost BEFORE the assignment.

// Fix: promote one operand to double
double correctAvg = (score1 + score2) / 2.0;   // 7 / 2.0 = 3.5 ✓
```
::

::WarningBox
The compiler will **not** catch logical errors. The runtime will **not** throw an exception. The only way to find them is through **testing** — running the program with known inputs and verifying the outputs. This is why FRQs are graded on correctness: human readers check whether your logic actually solves the problem, not just whether the code compiles.
::

### 5x04. Error Summary

| Error Type | When Detected | By Whom | Example |
|:---|:---|:---|:---|
| Compile-time | Before execution | Compiler | Missing `;`, type mismatch |
| Runtime | During execution | JVM (throws exception) | Division by zero, null access |
| Logical | After execution | Programmer (testing) | Wrong formula, off-by-one |

::Mcq
---
options:
    - "1. Compile-time error"
    - "2. Runtime error"
    - "3. Logical error"
    - "4. No error — the code runs correctly"
correct: 1
---

#prompt
What type of error does the following code produce?
```java
int x = 5.5;
```

#explanation
This is a compile-time error. The compiler detects that `5.5` (a double literal) cannot be assigned to `int x` without an explicit cast. The program will not even compile, let alone run. This is a type mismatch caught at compile time.
::

::Mcq
---
options:
    - "1. Compile-time error"
    - "2. Runtime error"
    - "3. Logical error"
    - "4. No error"
correct: 3
---

#prompt
What type of error does the following code produce?
```java
int sum = 5 + 8;
double average = sum / 2;
// Programmer expected average to be 6.5
```

#explanation
This is a logical error. The code compiles and runs without any exceptions. However, `sum / 2` performs integer division — `13 / 2 = 6` (the fractional part `.5` is silently discarded). Then `6` is auto-widened to `6.0` for the `double` assignment. The programmer expected `6.5`. The fix: `sum / 2.0` to force floating-point division. Logical errors are the hardest to detect because nothing "breaks" — the output is simply wrong.
::

## 6x00. The Complete Assignment Rule

We can now state the full rule for assignment in Java, synthesizing everything from this lecture:

::DefBox{id="Assignment Validation Rule"}
For an assignment statement `<variable> = <expression>;`:

1. **Evaluate** the expression on the right — use reduction (inside-out), compute the resulting value and its type
2. **Check compatibility**: can the expression's type be assigned to the variable's type?
   - If $⟦\text{expr type}⟧ \subseteq ⟦\text{var type}⟧$ (e.g., `int` → `double`): **implicit widening** — OK, no cast needed
   - If $⟦\text{expr type}⟧ \not\subseteq ⟦\text{var type}⟧$ (e.g., `double` → `int`): **compile error** — unless an explicit cast is provided
   - If the types are **identical**: always OK (trivial case)
3. **Perform the assignment**: store the (possibly converted) value into the variable's memory location
::

::ExampleBox
```java
double a = 5;
// Step 1: 5 is int (⟦int⟧). Step 2: ⟦int⟧ ⊂ ⟦double⟧ → OK (widening). Step 3: a = 5.0.

int b = (int) 3.8;
// Step 1: (int) 3.8 = 3 (int, ⟦int⟧). Step 2: ⟦int⟧ = ⟦int⟧ → OK. Step 3: b = 3.

int c = 5.0;
// Step 1: 5.0 is double (⟦double⟧). Step 2: ⟦double⟧ ⊄ ⟦int⟧ → COMPILE ERROR.
// Never reaches step 3.
```
::

---
::NoteBox
**Cognitive Anchor**

- The **Oxford bracket** `⟦T⟧` means "the set of all values of type `T`." The colon `x : T` means "x has type T." Both are discussion shorthands — they help us reason about types without writing full Java declarations. The key relationship: $⟦\texttt{int}⟧ \subseteq ⟦\texttt{double}⟧$ — every integer is a valid real number.
- A **signed integer** reserves the leftmost bit for the sign ($0$ = non-negative, $1$ = negative). For 32 bits: 31 bits for magnitude → range $-2^{31}$ to $2^{31}-1$. The negative side gets one extra value because zero sits in the non-negative camp.
- An **unsigned integer** uses all bits for magnitude (range $0$ to $2^n-1$). Java does not have unsigned integers — context only, not on the AP exam.
- The **off-by-one** pattern ($2^n - 1$, not $2^n$) is a universal programming pitfall. Counting starts at $0$, so maximum = count $- 1$.
- **Stack memory**: compile-time-known sizes, LIFO ordering, fast allocation. Holds primitives and references. **Heap memory**: runtime-determined sizes, any-order allocation, managed by the garbage collector. Holds objects, arrays, strings.
- `String` is a **reference type**: the variable (on the stack) stores an **address**; the character data (on the heap) is the actual object. Strings are **immutable** — "modification" creates a new object; the old one becomes garbage.
- **Implicit conversion** (widening): `int` → `double` happens automatically because $⟦\texttt{int}⟧ \subseteq ⟦\texttt{double}⟧$. No information is lost.
- **Explicit coercion** (narrowing): `double` → `int` requires a cast `(int)`. The fractional part is **truncated** (not rounded). BNF: `<coercion> ::= "(" <type> ")" <term>`.
- **The compiler checks types, not values.** Even if `5.0` is "integer-like," `int x = 5.0;` is a compile error — the compiler sees `double` → `int` and rejects it mechanically.
- In mixed-type expressions (`int + double`), the result is **always the wider type** (`double`). This is determined at compile time, not by the actual numeric values.
- **Lvalue**: names a location (can be on the left of `=`). **Rvalue**: produces a value (can only be on the right of `=`). A cast result `(int) x` is always an rvalue.
- **Reduction**: evaluate compound expressions **inside-out** — innermost sub-expression first, then work outward. Separate value computation from type checking.
- **Compile-time errors**: caught before execution (syntax, type mismatches). **Runtime errors**: crash during execution (division by zero, null pointer). **Logical errors**: program runs but gives wrong results — the hardest to find; requires testing.

Next lecture will cover control flow — conditionals, loops, and the logical operators that power them.

::

## Glossary

New terms introduced or deepened in this lecture. For terms from Lecture 1 (bit, byte, stack, heap, literal, expression, statement, etc.), see the previous article's glossary.

| Term | Everyday / Literal Meaning | What It Means in CS |
|:---|:---|:---|
| **Cast** (强制类型转换) | To shape metal in a mold; actors in a play | An operator `(type)` that explicitly converts a value from one type to another. `(int) 3.14` truncates to `3`. Required when narrowing (e.g., `double` → `int`). |
| **Coercion** (类型强制) | Forcing someone to do something | The act of converting a value from one type to another — either implicitly (automatic widening) or explicitly (manual cast). |
| **Compile-Time** (编译时) | — | The phase when source code is translated into bytecode. Errors detected here (syntax, type mismatches) prevent the program from running at all. |
| **Garbage Collector** (垃圾回收器) | A truck that collects trash | A JVM component that automatically finds and frees heap objects no longer reachable from any variable. Java has no manual `delete` — the GC handles deallocation. |
| **Immutability** (不可变性) | Something that cannot change | Once created, the object's internal state is fixed forever. Java `String` is immutable: `s + "x"` creates a new object rather than modifying `s`. |
| **Logical Error** (逻辑错误) | A mistake in reasoning | A bug where code compiles and runs without crashing but produces wrong results. Undetectable by compiler or JVM — found only through testing. |
| **Lvalue** (左值) | — | An expression that names a **memory location** — can appear on the left side of `=`. Variables are lvalues; literals and cast results are not. |
| **Narrowing** (窄化转换) | Making something narrower | Converting a "larger" type to a "smaller" type (e.g., `double` → `int`). May lose information; requires an explicit cast. Opposite of **widening**. |
| **Off-by-One** (差一错误) | — | A logic error where a count or index is wrong by exactly 1 — e.g., looping `n+1` times instead of `n`, or forgetting that counting starts at 0. Named after the fence-post problem. |
| **Oxford Bracket** (牛津括号) | — | The notation `⟦T⟧` meaning "the set of all values of type `T`." A thinking tool for reasoning about types as sets. `⟦int⟧ ⊂ ⟦double⟧` captures why int→double is safe but double→int is not. |
| **Reduction** (归约) | Making something smaller or simpler | The process of evaluating a compound expression by replacing sub-expressions with their computed values, working from the inside out, until a single value remains. |
| **Runtime** (运行时) | The duration when something operates | The phase when a compiled program actually executes. Runtime errors (division by zero, null access) crash the program mid-execution. |
| **Rvalue** (右值) | — | An expression that **produces** a value but does not name a location — can only appear on the right side of `=`. Literals, expression results, and cast results are rvalues. |
| **Sign Bit** (符号位) | — | The leftmost bit in a signed integer representation. `0` = non-negative; `1` = negative. Occupies 1 bit, leaving $n-1$ bits for magnitude. |
| **Signed Integer** (有符号整数) | — | An integer that uses one bit for the sign, allowing representation of both positive and negative numbers. Java's `int` is signed. Range for $n$ bits: $-2^{n-1}$ to $2^{n-1}-1$. |
| **Truncation** (截断) | Cutting something short | The act of discarding the fractional part of a floating-point number when casting to an integer. `(int) 3.9 = 3` — the `.9` is chopped off, NOT rounded. |
| **Type Annotation** (类型标注) | — | The colon notation `x : T` meaning "x has type T." A discussion shorthand used in comments and notes to label variable types without writing full Java declarations. |
| **Unsigned Integer** (无符号整数) | — | An integer that uses all bits for magnitude (no sign bit). Range for $n$ bits: $0$ to $2^n-1$. Java does not have unsigned integer types. |
| **Widening** (拓宽转换) | Making something wider | Converting a "smaller" type to a "larger" type (e.g., `int` → `double`). Always safe — no information is lost. Java performs widening automatically (implicit conversion). |

::LinkCard
---
url: "http://online-java.com"
title: "Online Java — Browser-Based Java REPL"
details: "Experiment with type casting, mixed-type expressions, and error scenarios from this lecture. Try assigning a double to an int without a cast — watch the compiler complain. Then add the cast and observe truncation in action."
---
::
