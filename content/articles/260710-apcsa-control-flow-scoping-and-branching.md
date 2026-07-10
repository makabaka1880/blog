---
title: APCSA - Control Flow, Scoping and Branching
description: AP Computer Science A Lecture 4 — if/else branching, variable scope and shadowing, compound assignment, string concatenation, while/for loops, and edge cases
createTime: 2026-07-10
updateTime: 2026-07-10

tags:
    - APCSA
ligatures: false
---

## 0x00. From Commands to Sequencing

A computer, at its core, only understands one thing: **commands**. A command is the smallest unit of work — increment a number, print a value, store a result. The computer knows how to execute a command, but it does not natively know how to execute *multiple* commands in order. That ability — running one thing after another — is something we must construct.

### 0x01. Commands and Statements

::DefBox{id="Command"}
A **command** (`<cmd>`) is an atomic instruction — something the machine can do. `x = 5` is a command. `System.out.println("hi")` is a command. A command alone is not yet a complete sentence in Java.
::

::DefBox{id="Statement"}
A **statement** (`<stmt>`) is a command terminated by a semicolon. In BNF:

```enbf
<stmt> ::= <cmd> ";"
```

The semicolon is what tells the computer: *this command is complete — move to the next one.*
::

::NoteBox
**BNF refresher — two new notations.** You already know `::=`, `"..."`, `<...>`, and `*` from previous lectures. Here are two more:

| Notation | Meaning | Example |
|:---|:---|:---|
| `?` | Optional — zero or one occurrence | `("else" <stmt>)?` — the else clause may or may not be there |
| `(...)` | Grouping — treat what's inside as one unit | `("else" <stmt>)?` — the `?` applies to the whole group, not just `<stmt>` |
::

```java
x = 5;                          // a statement: command + semicolon
System.out.println("hello");    // another statement
int a = 3;                      // a declaration is also a command, so this is a statement too
```

Without the semicolon, the computer doesn't know where one instruction ends and the next begins. The `;` is punctuation — like a period in English. It closes the sentence.

### 0x02. Printing to the Screen

Before we go further, we need a way to see what our program is doing. Java gives us two commands for writing text to the terminal:

::DefBox{id="println and print"}
- **`System.out.println(...)`** — prints the value inside the parentheses, then moves the cursor to a **new line**. Whatever comes next will appear on the line below.
- **`System.out.print(...)`** — prints the value inside the parentheses, and the cursor **stays on the same line**. Whatever comes next will appear immediately after.

Both accept strings, numbers, booleans — any value you give them gets converted to text and displayed.
::

::ExampleBox
```java
System.out.println("Hello");
System.out.println("World");
// Output:
// Hello
// World

System.out.print("Hello");
System.out.print("World");
// Output:
// HelloWorld

System.out.print("A");
System.out.print("B");
System.out.println("C");
// Output:
// ABC
```

The third case is the one AP exam questions love: `print("A")` puts `A` on the line but doesn't move the cursor. `print("B")` puts `B` right after it — still no newline. `println("C")` puts `C` and **then** sends a newline, so the output `ABC` finally appears as a complete line.
::

::NoteBox
**Fun fact: why `println` sometimes matters for timing.** Your terminal is line-buffered — it waits until it sees a newline character (`\n`) before actually drawing text on screen. If your program sends a bunch of `print()` calls without ever calling `println()`, the output sits in a buffer, invisible. Only when a `\n` finally arrives (from `println()` or an explicit `\n` in the string) does the terminal render everything.

This is **not** in the AP scope. Modern terminals and IDEs often flush automatically, and most programs run too fast for you to notice. But it explains why every textbook example ends with `println` — and why `print()` without a trailing newline can appear to "not work" in some environments.
::

::ExampleBox
**AP-style tracing.** What does this print?

```java
System.out.print("Score: ");
System.out.print(95);
System.out.println(" pts");
System.out.print("Grade: ");
System.out.println("A");
```

Step through it:
1. `print("Score: ")` → outputs `Score: `, cursor stays
2. `print(95)` → outputs `95` right after, cursor stays → `Score: 95`
3. `println(" pts")` → outputs ` pts` and sends newline → line complete: `Score: 95 pts`
4. `print("Grade: ")` → outputs `Grade: ` on a new line, cursor stays
5. `println("A")` → outputs `A` and newline → line complete: `Grade: A`

Final output:
```
Score: 95 pts
Grade: A
```
::

::Mcq
---
options:
    - "1. `HelloWorld`"
    - "2. `Hello` then `World` on the next line"
    - "3. `Hello` then nothing (World is never printed)"
    - "4. `WorldHello`"
correct: 1
---

#prompt
```java
System.out.print("Hello");
System.out.print("World");
```
What is the output?

#explanation
`print()` does not add a newline. Both `"Hello"` and `"World"` are printed on the **same line**, resulting in `HelloWorld`. Option 2 would be correct if both were `println()`.
::

::Mcq
---
options:
    - "1. `ABC` on one line, then `DEF` on the next"
    - "2. `A B C` on one line, then `DEF` on the next"
    - "3. `A`, `B`, `C`, `D`, `E`, `F` each on separate lines"
    - "4. `ABCDEF` all on one line"
correct: 1
---

#prompt
```java
System.out.print("A");
System.out.print("B");
System.out.println("C");
System.out.print("D");
System.out.print("E");
System.out.println("F");
```
What is the output?

#explanation
`print("A")` + `print("B")` + `println("C")` produces `ABC` on one line (the newline comes from the `println`). Then `print("D")` + `print("E")` + `println("F")` produces `DEF` on the next line. Final output: two lines, `ABC` and `DEF`. The `print()` calls don't add spaces — the letters are adjacent.
::

### 0x03. Sequencing — Making One Out of Many

If the computer only knows single commands, how do we make it run an entire procedure — dozens, hundreds, thousands of commands? We need a construct that takes many statements and presents them to the computer as **one**.

::DefBox{id="Sequencing"}
**Sequencing** (also called a **block** or **compound statement**) is the concatenation of statements wrapped in curly braces `{ }`. In BNF:

```enbf
<block> ::= "{" (<stmt>)* "}"
```

A block is itself a `<stmt>` — it can appear anywhere a single statement is expected. From the computer's perspective, everything inside `{ }` is one unit to execute in order.
::

::ExampleBox
```java
// Two separate statements:
System.out.println("A");
System.out.println("B");

// The same two statements, sequenced into one block:
{
    System.out.println("A");
    System.out.println("B");
}
```

Both versions do the same thing: print `A`, then print `B`. But the second version is a *single* statement from the outside — any construct that expects "a statement" can accept this entire block as one.
::

::NoteBox
**Top-level sequencing doesn't need `{ }`.** Inside a method body, the sequence of statements is already implicit — the semicolons alone chain them together. You only need explicit `{ }` when you're *inside* another construct (like an `if` or a loop) and need to package multiple statements into one slot.

```java
void main() {
    // These three statements are sequenced at the top level — no outer { } needed
    int x = 5;
    x = x + 1;
    System.out.println(x);
}
```

The method body `{ }` itself provides the outermost block. The sequencing inside it is implicit.
::

This idea — that `{ ... }` takes many statements and makes them one — is the foundation for **everything** that follows. It is what makes `if`, `while`, and `for` simple: each of them expects exactly one statement after their condition, and `{ }` lets you supply as many as you need.

### 0x04. The `if` Statement — One Syntax, No Exceptions

Because a block `{ ... }` is itself a statement, the `if` syntax needs only **one** rule:

::DefBox{id="if Statement"}
```enbf
<if> ::= "if" "(" <expr:bool> ")" <stmt> ("else" <stmt>)?
```

An `if` takes a boolean expression, followed by **exactly one** statement. The optional `else` clause also takes exactly one statement. Since a block is a statement, you can supply `{ ... }` — or a single command — in either position.
::

```java
// Both are valid under the same BNF rule:
if (condition)
    x = 1;                          // single statement — no braces needed

if (condition) {
    x = 1;                          // block = single statement — braces package two commands
    y = 2;
}
```

There is no separate "if with braces" syntax. There is no special case. The braces belong to **sequencing**, not to `if`. The `if` simply consumes one statement, and that statement can be a block containing a dozen more.

::WarningBox
Omitting braces for a single-line body is legal but dangerous. The indentation lies:

```java
if (condition)
    doFirstThing();
    doSecondThing();    // BUG: this is NOT inside the if — it always runs
```

The `if` consumes only `doFirstThing();` as its statement. `doSecondThing();` is a separate statement that executes unconditionally. **Always use braces** — even for single-line bodies. Two characters prevent hours of debugging.
::

::ExampleBox
**Scenario: Collatz (Hailstone) conjecture.** Start with any positive integer. If it's even, divide by 2. If it's odd, multiply by 3 and add 1. The conjecture claims every starting number eventually reaches 1.

First, the **modulo operator** `%` detects parity:

```java
int n = 7;
n % 2    // 1 — odd (remainder 1)
int m = 6;
m % 2    // 0 — even (no remainder)
```

Now we branch:

```java
if (n % 2 == 0) {
    n = n / 2;          // even path — one statement inside a block
} else {
    n = n * 3 + 1;      // odd path — one statement inside a block
}
```

The `if` sees: boolean expression `n % 2 == 0`, then one statement `{ n = n / 2; }`, then `else`, then one statement `{ n = n * 3 + 1; }`. The BNF is satisfied. The braces aren't strictly necessary here (each branch has one command), but they make the structure clear and protect against future edits.
::

### 0x05. `else if` Chains

The `else` clause takes a statement. That statement can be... another `if`. This nesting gives us `else if`:

```java
if (score >= 90) {
    grade = "A";
} else {
    if (score >= 80) {          // nested if — but we can flatten the style
        grade = "B";
    } else {
        if (score >= 70) {
            grade = "C";
        } else {
            grade = "F";
        }
    }
}
```

Because the inner `if` is the *only* statement in its `else` block, we can drop the braces and place it directly after `else` — producing the idiomatic `else if`:

```java
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}
```

The program tests conditions top to bottom and enters the **first** block whose condition is `true`. Once a block executes, all remaining `else if` and `else` branches are skipped. A score of 85 matches the second condition — it never reaches the third, even though `85 >= 70` is also technically true.

::WarningBox
The condition inside `if (...)` **must** be a `boolean` expression. Java does not treat numbers as truth values:

```java
int x = 5;
if (x) {         // COMPILE ERROR — x is int, not boolean
    // ...
}

if (x != 0) {    // Correct — comparison produces a boolean
    // ...
}
```

Unlike C, Python, or JavaScript, Java enforces this strictly. There is no implicit conversion from `int` to `boolean`.
::

### 0x06. Comments

::DefBox{id="Comment"}
A **comment** is text that the compiler ignores entirely. It exists for human readers only.

```java
// This is a single-line comment. Everything after // on this line is ignored.

int x = 5;   // comments can follow code on the same line

/*
 * This is a multi-line comment.
 * Everything between /* and *​/ is ignored,
 * even across multiple lines.
 */
```
::

::NoteBox
Comments serve two roles in APCSA:

1. **Explaining your code** — especially in FRQs, where graders need to understand your intent
2. **Preconditions / postconditions** — documenting what must be true before and after a method call, often written in multi-line comment blocks above the method signature
::

::Mcq
---
options:
    - "1. The code after `//` on the same line is ignored by the compiler"
    - "2. A `//` at the start of a line comments out the entire line"
    - "3. Multi-line comments start with `/*` and end with `*/`"
    - "4. Comments affect the program's runtime behavior"
correct: 4
---

#prompt
Which of the following statements about comments is FALSE?

#explanation
Option 4 is false: comments are entirely removed by the compiler and have **zero** effect on runtime behavior. Options 1–3 are all true statements about Java comment syntax. Comments are for humans; the JVM never sees them.
::

## 1x00. Scoping — `{ }` Does Two Things

We've established that `{ }` packages statements into one unit for sequencing. But `{ }` has a second, equally important job: it creates a **scope** — a region where variables live and die.

### 1x01. One Brace, Two Purposes

Every `{ }` you write simultaneously does two things:

| Job | What it means |
|:---|:---|
| **Sequencing** | Concatenates statements — makes many into one |
| **Scoping** | Creates a boundary for variable lifetime |

When execution enters a `{`, a new scope begins. Variables declared inside that scope are visible from their declaration point to the matching `}`. When execution passes the `}`, those variables are **destroyed**.

::DefBox{id="Scope Rules"}
1. **Inner sees outer**: code inside `{ }` can access all variables declared in enclosing scopes
2. **Outer cannot see inner**: code outside `{ }` cannot access variables declared inside
3. **Destruction at `}`**: when a scope ends, every variable declared inside it ceases to exist
::

::ExampleBox
```java
int a = 1;                          // outermost scope (the method body)

{
    int b = 2;                      // new scope — new variable
    System.out.println(a + b);      // prints 3 — a is visible (rule 1), b is visible
}

System.out.println(a);              // prints 1 — a is still alive
System.out.println(b);              // COMPILE ERROR — b was destroyed at the inner }
```

When the inner `}` is reached, `b` ceases to exist. As far as the compiler is concerned, `b` was never declared in the outer scope. This is not a runtime behavior — the compiler catches it before the program ever runs.
::

### 1x02. The Stack Pointer Model

How does the computer actually manage this? It uses a simple mechanism: a **stack**.

::DefBox{id="Stack (Introductory)"}
A **stack** is like a pile of papers on a desk. You can only add papers to the top of the pile, and you can only remove papers from the top. The last thing you put on is the first thing you take off.

In Java, the stack holds variable declarations. When the compiler encounters a variable declaration, it records it on the stack. When the program needs the value of a variable, it scans the stack **from top to bottom** — the first match wins.
::

Crucially, the compiler doesn't push and pop one variable at a time for scoping. Instead, it uses a **stack pointer** — a bookmark that remembers where the current scope began.

::DefBox{id="Stack Pointer Model"}
When execution **enters** a `{`:
- The compiler **marks** the current position of the stack pointer — like sticking a bookmark at the top of the pile.

When execution **exits** the `}`:
- The compiler **resets** the stack pointer to the mark. Everything above the mark — every variable declared inside that scope — is discarded in one motion.

When the compiler **looks up** a variable:
- Scan from the top of the stack downward. The first declaration matching the name wins.
::

::ExampleBox
Trace this code step by step:

```java
int x = 5;                          // (1)

if (x > 0) {                        // (2) enter scope → mark stack pointer
    String x = "hello";             // (3)
    System.out.println(x);          // (4)
}                                   // (5) exit scope → reset pointer to mark

System.out.println(x);              // (6)
```

Let's walk through it visually. We'll draw the stack as it evolves:

**(1) Declare `x`**
:Pic{src="Slice-1.webp" alt="int x = 5;"}

**(2) Enter `if` block — mark the pointer.** The compiler places a bookmark at the current top. Instead of explicitly marking the critical cell, I'll instead color the section of the stack declared during this scope. This also lets us visualize shadowing: when an inner binding hides an outer one, the outer (hidden) entry is drawn in a **lighter gray** — it's still on the stack, but the top-down lookup skips right past it.

:Pic{src="Slice-2.webp" alt="if (x > 0) ..."}

**(3) `String x = "hello";`** — new declaration above the mark. The outer `int x` is now shadowed — shown in lighter gray because it's hidden by the inner `String x`.
:Pic{src="Slice-3.webp" alt='String x = "hello"'}

**(4) `System.out.println(x);`** — look up `x`. Scan top-down: first hit is `String x = "hello"`. Print `"hello"`.
:Pic{src="Slice-4.webp" alt="Evaluating x"}

**(5) Exit scope — `}`.** Reset the pointer to the mark. Everything above the mark is discarded:
:Pic{src="Slice-5.webp" alt="Exit scope."}

**(6) `System.out.println(x);`** — look up `x`. Only one entry: `int x = 5`. Print `5`.
:Pic{src="Slice-6.webp" alt="Evaluating x"}
::

::NoteBox
This stack pointer model is not just a metaphor — it reflects how the JVM actually manages local variables at runtime. When a method is called, the JVM allocates a **stack frame** with space for all local variables. When a block is entered, the frame grows upward. When the block exits, the frame shrinks back. This is why local variables are fast and automatically cleaned up — the JVM just moves a pointer.
::

The top-down lookup rule has a direct consequence: if an inner scope declares a variable with the **same name** as an outer variable, the inner declaration is found first. It **shadows** the outer one.

::DefBox{id="Variable Shadowing"}
**Shadowing** occurs when an inner scope declares a variable with the same name as a variable in an outer scope. The inner variable hides the outer one — all references to that name inside the inner scope resolve to the inner variable.

This falls directly out of the stack pointer model: the inner declaration sits above the outer one, so it's found first during top-down lookup. In the visual stack diagrams, the outer (hidden) binding is drawn in a lighter gray — it's still there, but the lookup will never reach it while the inner binding sits on top.
::

In the example we just traced, steps (3)–(5) are exactly shadowing in action: `String x = "hello"` shadows `int x = 5` inside the `if` block. Look at Slice-3 again — notice the lighter gray `x : int = 5` sitting below the darker `x : String = "hello"`. The top-down scan hits the darker entry first, so `"hello"` is what `println` sees.

::ExampleBox
Another simple case:

```java
int a = 10;
{
    int a = 20;                     // shadows the outer a
    System.out.println(a);          // prints 20 — inner a is found first
}
System.out.println(a);              // prints 10 — inner a was discarded at }
```

After the inner `}`, the shadow is removed. `a` resolves to `10` again — the outer variable was never touched.
::

::WarningBox
**The Barendregt Convention** (not tested on the AP exam, but essential for writing clear code): **never reuse variable names in nested scopes.** Shadowing is legal but confusing. It creates variables that appear to be the same but aren't — a classic source of subtle bugs. In FRQs, a grader who has to track which `x` you mean in which scope might miss your logic. Use distinct names.
::

## 2x00. Shorthand & Compound Operators

Writing `a = a + 2` is explicit but verbose. Java provides shorthand operators that express the same computation more concisely — and, in the case of `++` and `--`, with subtly different semantics that are frequent exam targets.

### 2x01. Compound Assignment

::DefBox{id="Compound Assignment"}
A **compound assignment operator** combines an arithmetic operation with assignment. For any binary operator `op`:

```java
a op= expression;    // equivalent to: a = a op (expression)
```

| Shorthand | Equivalent |
|:---|:---|
| `a += 2` | `a = a + 2` |
| `a -= 3` | `a = a - 3` |
| `a *= 5` | `a = a * 5` |
| `a /= 2` | `a = a / 2` |
| `a %= 3` | `a = a % 3` |
::

::ExampleBox
```java
int x = 10;
x += 5;     // x = 15
x -= 3;     // x = 12
x *= 2;     // x = 24
x /= 4;     // x = 6
x %= 4;     // x = 2
```
::

The same pattern extends to boolean operators, though these are rarely used in practice:

```java
boolean flag = true;
flag &= false;      // flag = flag & false  → false
flag |= true;       // flag = flag | true   → true
```

::NoteBox
The general formula: **`x op= y`** means **`x = x op y`**. Commit this to memory — it covers every compound assignment operator you'll encounter.
::

### 2x02. Increment & Decrement

Adding or subtracting 1 is so common that Java provides dedicated operators for it:

::DefBox{id="Increment / Decrement Operators"}
- **`a++`** — postfix increment: `a` is increased by 1; the expression evaluates to the **old** value
- **`++a`** — prefix increment: `a` is increased by 1; the expression evaluates to the **new** value
- **`a--`** — postfix decrement: `a` is decreased by 1; evaluates to the old value
- **`--a`** — prefix decrement: `a` is decreased by 1; evaluates to the new value
::

::ExampleBox
```java
int a = 5;
int b = a++;    // b = 5 (old value of a), then a becomes 6

int c = 5;
int d = ++c;    // c becomes 6 first, then d = 6 (new value of c)
```

After both blocks:
| Variable | Value | Why |
|:---|:---|:---|
| `a` | `6` | Incremented by `a++` |
| `b` | `5` | Postfix: captured the old value before increment |
| `c` | `6` | Incremented by `++c` |
| `d` | `6` | Prefix: captured the new value after increment |
::

::WarningBox
**`int a++` is not valid syntax.** `a++` is an expression (and also a statement), not a declaration. You cannot combine a type declaration with `++`. The variable must already be declared:

```java
int a;      // declaration
a++;        // valid — a is already declared

int b++;    // COMPILE ERROR — can't declare and increment simultaneously
```
::

### 2x03. Prefix vs. Postfix in Loops — Tracing Traps

The distinction between `++a` and `a++` matters most inside expressions — especially loop conditions and print statements. The AP exam loves to test whether you can trace the exact values at each step.

::ExampleBox
**Postfix (`a++`) in a while loop:**

```java
int a = 0;
while (a < 5) {
    System.out.println(a++);
}
// Output: 0, 1, 2, 3, 4
```

Trace: at each iteration, `a++` prints the **current** value of `a`, then increments. The loop stops when `a` reaches `5` (at which point `5 < 5` is false).

**Prefix (`++a`) in the same loop:**

```java
int a = 0;
while (a < 5) {
    System.out.println(++a);
}
// Output: 1, 2, 3, 4, 5
```

Trace: at each iteration, `++a` increments `a` **first**, then prints. When `a` is `4`, `++a` makes it `5`, prints `5`, then `5 < 5` fails. The output starts at `1` and ends at `5`.
::

::Mcq
---
options:
    - "1. `0, 1, 2, 3, 4`"
    - "2. `1, 2, 3, 4, 5`"
    - "3. `0, 1, 2, 3, 4, 5`"
    - "4. `1, 2, 3, 4`"
correct: 1
---

#prompt
```java
int i = 0;
while (i < 5) {
    System.out.print(i++ + " ");
}
```
What is the output?

#explanation
The output is `0 1 2 3 4`. Postfix `i++` prints the **old** value of `i` before incrementing. Iteration 1: prints 0, i→1. Iteration 2: prints 1, i→2. ... Iteration 5: prints 4, i→5. Then `5 < 5` is `false`, loop exits. Five iterations, outputs 0–4.
::

## 3x00. Strings & Escape Sequences

Branching and looping control *when* code runs, but to make programs interactive we need to produce text output — and to make that output readable, we need to control its formatting. This section covers string creation, concatenation, and the escape sequences that embed special characters.

### 3x01. String Creation & Concatenation

::DefBox{id="String Literal"}
A **string** in Java is a sequence of characters enclosed in double quotes `"..."`. Strings are objects (reference type), not primitives — but Java gives them special syntax for convenience.
::

```java
String greeting = "Hello";
String name = "World";
```

::DefBox{id="String Concatenation"}
The `+` operator, when at least one operand is a `String`, performs **concatenation** — joining the two values into a single string. The non-String operand is automatically converted to its string representation.
::

::ExampleBox
```java
String s = "Hello" + " " + "World";     // "Hello World"
String t = "The answer is " + 42;        // "The answer is 42"
String u = "Value: " + (3 + 4);          // "Value: 7" — parentheses force arithmetic first
String v = "Value: " + 3 + 4;            // "Value: 34" — left-to-right: "Value: 3" + 4 → "Value: 34"
```

**Critical rule**: when `+` has mixed types, Java evaluates **left to right**. `"Value: " + 3 + 4` means `("Value: " + 3) + 4` — string concatenation all the way. But `"Value: " + (3 + 4)` forces `3 + 4 = 7` first, then concatenates. Parentheses control the order.
::

::NoteBox
Any type can be concatenated with a string — Java calls `.toString()` (or equivalent) on the non-string operand automatically. This is a form of implicit type promotion specific to string context:

```java
int x = 10;
boolean flag = true;
String result = "x is " + x + " and flag is " + flag;
// "x is 10 and flag is true"
```

But you cannot **assign** a non-string directly to a `String` variable — that requires a proper conversion, not just concatenation:

```java
String s = 42;       // COMPILE ERROR — int cannot be assigned to String
String s = "" + 42;  // OK — concatenation produces a String
```
::

### 3x02. Escape Sequences

Some characters can't be typed directly in a string literal — a newline, a tab, or a quotation mark (which would end the string). **Escape sequences** solve this:

::DefBox{id="Escape Sequence"}
An **escape sequence** is a backslash `\` followed by a character, representing a special character that cannot be written directly:

| Sequence | Meaning |
|:---|:---|
| `\n` | Newline (line feed) |
| `\t` | Tab |
| `\"` | Double quotation mark |
| `\'` | Single quotation mark |
| `\\` | Backslash itself |
::

::ExampleBox
```java
System.out.println("Hello\nWorld");
// Output:
// Hello
// World

System.out.println("She said \"Hi!\"");
// Output: She said "Hi!"

System.out.println("Path: C:\\Users\\makabaka");
// Output: Path: C:\Users\makabaka
```
::

::NoteBox
A forward slash `/` needs no escaping — it's just a regular character. Only the backslash `\` is special because it *starts* an escape sequence. To include a literal backslash, you must escape the escape character: `\\`.
::

## 4x00. Loops — Repeating Code

A conditional lets code run *or not*. A loop lets code run *again and again*, stopping only when a condition flips. This is the mechanism that makes programs capable of processing arbitrary amounts of data — without loops, you'd need to write a separate statement for every element of every array.

### 4x01. The `while` Loop

::DefBox{id="while Loop"}
A **`while` loop** repeatedly executes a statement as long as a boolean condition remains `true`. In BNF:

```enbf
<while> ::= "while" "(" <expr:bool> ")" <stmt>
```

Like `if`, it takes exactly **one** statement after the condition. `{ }` lets you supply as many as you need. The condition is checked **before** each iteration — if it's `false` on the first check, the body never executes.
::

::ExampleBox
Printing integers from 0 to 9:

```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;                    // advance toward the termination condition
}
// Output: 0 through 9 (one per line)
```

Three essential components of any `while` loop:
1. **Initialization**: `int i = 0` — set up before the loop
2. **Condition**: `i < 10` — checked before every iteration
3. **Advancement**: `i++` — move toward making the condition false

Forget any one of these and the loop either never runs or never stops.
::

::WarningBox
**Infinite loops.** If the condition never becomes `false`, the loop runs forever:

```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    // Missing i++ — the condition i < 10 is always true!
}
```

The program will print `0` endlessly (or until you kill it). Every `while` loop must have a path to termination — some statement inside the body that eventually makes the condition false.
::

### 4x02. The `for` Loop

The `while` loop's three components (init, condition, advance) are spread across three lines. This works, but the separation invites mistakes — moving or deleting one line breaks the loop. The `for` loop consolidates all three into a single line.

::DefBox{id="for Loop"}
A **`for` loop** packages initialization, condition, and advancement into a compact header. In BNF:

```enbf
<for> ::= "for" "(" <stmt> <expr:bool> ";" <cmd> ")" <stmt>
```

Like `if` and `while`, the body is exactly one `<stmt>` — `{ }` provides sequencing when you need multiple statements in the body.
::

::ExampleBox
The same 0-to-9 loop as a `for`:

```java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
// Output: 0 through 9
```

Tracing the first three iterations:

| Step | `i` | `i < 10`? | Action |
|:---|:---|:---|:---|
| Init | `0` | — | — |
| Check | `0` | `true` | Enter body |
| Body | `0` | — | Print `0` |
| Advance | `1` | — | `i++` |
| Check | `1` | `true` | Enter body |
| Body | `1` | — | Print `1` |
| Advance | `2` | — | `i++` |
| Check | `2` | `true` | Enter body |
| Body | `2` | — | Print `2` |
| Advance | `3` | — | `i++` |

The loop exits when `i` reaches `10` and `10 < 10` is `false`. The body executes for `i = 0, 1, 2, ..., 9` — exactly 10 iterations.
::

The `for` loop is not a fundamentally new construct — it is **syntactic sugar** for a `while` loop with the three components rearranged.

::DefBox{id="Desugaring for → while"}
A `for` loop desugars directly into a `while` loop:

```enbf
for (A; B; C) D;
```

is equivalent to:

```enbf
A;
while (B) {
    D;
    C;
}
```

The initialization (`A`) runs once before the loop. The condition (`B`) is checked before each iteration. The body (`D`) and the advancement (`C`) run together inside the loop — with the advancement always running after the body, regardless of what happens in `D`.
::

::ExampleBox
Applying the desugaring to our 0-to-9 loop:

```java
// Before (for):
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// After (desugared to while):
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}
```

Both print `0` through `9`. The desugaring makes the execution order explicit: init → check → body → advance → check → body → advance → ...

This also explains edge cases. What if the condition is false on the first check?

```java
for (int i = 0; i > 10; i++) {   // i > 10 is false immediately
    System.out.println(i);
}

// Desugars to:
int i = 0;
while (i > 10) {                  // condition is false — body never runs
    System.out.println(i);
    i++;
}
```

Zero iterations. The initialization still runs (`i` is declared and set to `0`), but the condition fails before the body ever executes.
::

::DefBox{id="for Loop Memory Aid"}
Use the **"start, end, step"** mnemonic:

```
for (start; end; step) { body }
```

- **start**: where the counter begins (`int i = 0`)
- **end**: condition for continuing (`i < 10` — stop when this is false)
- **step**: how the counter changes each iteration (`i++` — increment by 1)
::

::ExampleBox
**Triangular iteration** — the inner loop depends on the outer loop's counter:

```java
for (int i = 1; i <= 4; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();       // newline after each row
}
// Output:
// *
// **
// ***
// ****
```

When `i = 1`, the inner loop runs once (prints `*`). When `i = 2`, inner runs twice (prints `**`). The inner loop's bound (`j <= i`) is tied to the outer counter — this is the defining pattern of triangular iteration.
::

### 4x03. Off-by-One Errors

::DefBox{id="Off-by-One Error"}
An **off-by-one error** occurs when a loop runs one too many or one too few times — the count is wrong by exactly 1. This is the **fence-post problem**: 10 fence panels need 11 fence posts. The number of *iterations* is one more than the number of *gaps* between start and end.
::

::ExampleBox
**How many integers from 0 to 9?**

Answer: 10 numbers (0, 1, 2, ..., 9). Not 9. The formula is `(last - first) + 1` when both endpoints are inclusive.

```java
// Prints 0 through 9 — 10 iterations
for (int i = 0; i < 10; i++) { ... }

// How many numbers? (9 - 0) + 1 = 10. ✓
```

**A common trap**: nested loops with off-by-one boundaries:

```java
int count = 0;
for (int i = 0; i < 10; i++) {        // 10 iterations
    for (int j = 0; j < 10; j++) {    // 10 iterations each
        count++;
    }
}
// count = 10 × 10 = 100, not 81 or 99
```

Each outer iteration spawns 10 inner iterations. Total: $10 \times 10 = 100$. If you miscount the outer (thinking 9 iterations) or the inner (thinking 9), you'll be off — and the compiler won't warn you.
::

::Mcq
---
options:
    - "1. `9`"
    - "2. `10`"
    - "3. `11`"
    - "4. `0`"
correct: 2
---

#prompt
```java
int count = 0;
for (int i = 0; i <= 9; i++) {
    count++;
}
```
What is the final value of `count`?

#explanation
The loop runs for `i = 0, 1, 2, ..., 9` — that's 10 iterations. `count` is incremented once per iteration, so the final value is `10`. The condition `i <= 9` means "continue while i is less than or equal to 9," so `i = 9` is the last value that enters the body. When `i` becomes `10`, `10 <= 9` is `false` and the loop exits.
::

### 4x04. Edge Cases

::DefBox{id="Edge Case"}
An **edge case** (边界情况) is an input at the extreme boundary of the problem domain — zero, empty strings, the first or last element, the minimum or maximum value. Edge cases often expose bugs that normal inputs don't, because the code's assumptions break down at the boundaries.
::

::ExampleBox
Consider this loop:

```java
for (int i = 0; i > 10; i++) {
    System.out.println(i);
}
```

The condition `i > 10` is `false` on the very first check (`0 > 10`). The body **never executes** — zero iterations. This is not a compile error and not a runtime crash, but it's almost certainly a logical error (the programmer probably meant `i < 10`).

Another classic edge case: the Collatz conjecture code from Section 0x01 has a subtle bug. For odd numbers, `n = n * 3 + 1` always produces an even number — so in a loop, the "odd" branch is followed by the "even" branch in the very next iteration. If the code assumes each number goes through exactly one transformation per cycle, it's wrong. The specification must account for this — every edge case, no matter how unlikely, deserves a test.
::

::NoteBox
**Testing edge cases is mandatory for FRQs.** The graders will test your code with:
- Zero and negative numbers (where applicable)
- Empty strings and arrays
- Single-element arrays
- Maximum and minimum `int` values
- Boundary-crossing conditions (e.g., `>=` vs `>` at the cutoff)

A program that works for "normal" inputs but fails on an edge case is an incorrect program. Always ask: *what happens when the input is zero? What happens when the array is empty?*
::

## 5x00. Tautologies & Logical Completeness

The previous lecture introduced boolean algebra as a system for simplifying expressions. This section connects that theory to control flow: how do you *prove* that your `if-else` chains are complete (cover every case) and exclusive (no two branches overlap)?

### 5x01. Tautologies Revisited

::DefBox{id="Tautology (Review)"}
A **tautology** (重言式) is a boolean expression that evaluates to `true` for **every possible assignment** of its variables. The canonical example is $a \lor \lnot a$ — "a or not a" — which is always `true` regardless of what `a` is.
::

This isn't just a theoretical curiosity. Tautologies prove that your conditional logic is **exhaustive** — that you haven't forgotten a case.

::ExampleBox
**Verifying if-else completeness.** Suppose you write:

```java
if (a || !b) {
    // branch 1
} else {
    // branch 2
}
```

Is it possible for **neither** branch to execute? No — `(a || !b) || !(a || !b)` is a tautology (by the Law of Excluded Middle). The condition is either true or false; there is no third option. The `if-else` structure is automatically exhaustive.

Now consider two separate `if` statements without `else`:

```java
if (a) { ... }
if (!a) { ... }
```

These are also exhaustive — `a || !a` is a tautology. Exactly one will execute. If you instead wrote:

```java
if (a) { ... }
if (b) { ... }
```

This is **not** exhaustive: when both `a` and `b` are `false`, neither block runs. Whether that's a bug depends on the specification.
::

### 5x02. The Substitution Theorem

::DefBox{id="Substitution Theorem"}
If two boolean expressions $P$ and $Q$ are logically equivalent (have the same truth table), then $Q$ can be **substituted** for $P$ in any context without changing the program's behavior. Conversely, if an expression is a tautology, you can replace it with `true` — simplifying the code.
::

::ExampleBox
**Simplifying a complex condition with substitution.**

Suppose you encounter this in a code review:

```java
if ((a && b) || (a && !b) || (!a && b) || (!a && !b)) {
    // always executes
}
```

You could build a 4-row truth table... or you could recognize the pattern. Factor:

$$
\begin{aligned}
& (a \land b) \lor (a \land \lnot b) \lor (\lnot a \land b) \lor (\lnot a \land \lnot b) \\
= &\ a \land (b \lor \lnot b) \lor \lnot a \land (b \lor \lnot b) \\
= &\ a \land \top \lor \lnot a \land \top \\
= &\ a \lor \lnot a \\
= &\ \top
\end{aligned}
$$

The entire condition simplifies to `true` — the `if` body always executes. The `if` itself is dead weight; the code inside should just run unconditionally.

**Practical takeaway**: when you see a long condition, check whether a tautology or contradiction is hiding inside it. Applying the laws from Lecture 3 can collapse pages of nested `if-else` into a single clear branch.
::

::NoteBox
The substitution theorem is the theoretical justification for **all** boolean simplification. When you apply De Morgan's law to rewrite `!(!a && !b)` as `a || b`, you're replacing an expression with an equivalent one — and the substitution theorem guarantees the program's behavior is unchanged. This is how we prove that refactoring a condition is safe.
::

---
::NoteBox
**Cognitive Anchor**

- **Command vs. Statement**: A command (`<cmd>`) is an atomic instruction. A statement (`<stmt>`) is a command followed by `;`. The semicolon closes the sentence — it tells the computer "this command is complete."
- **Sequencing** (`{ }`): Concatenates statements into a single unit. A block `{ ... }` is itself a `<stmt>`, so it can appear anywhere a statement is expected. This is the mechanism that makes `if`, `while`, and `for` simple — each takes exactly one statement after its condition.
- **`if` BNF**: `"if" "(" <expr:bool> ")" <stmt> ("else" <stmt>)?` — one unified rule. The `if` always consumes one statement. `{ }` lets you supply many. No special cases, no "if with braces" syntax.
- **`else if`**: `else` takes a statement, which can be another `if`. `else if` is just nested `if` flattened — not a separate keyword.
- **Condition must be `boolean`**: Java rejects `int` conditions. `if (x)` is a compile error — write `if (x != 0)`.
- **Comments**: `//` for single line, `/* */` for multi-line. Ignored by the compiler entirely.
- **`{ }` does two things**: sequencing (packages statements into one) AND scoping (creates a variable lifetime boundary). These are not separate language features — they are two consequences of the same brace.
- **Scope rules**: Inner sees outer. Outer cannot see inner. Variables are destroyed at `}`.
- **Stack pointer model**: Entering `{` marks the current stack position like a bookmark. Exiting `}` resets the pointer to the mark — everything above is discarded in one motion. Variable lookup scans top-down; the first match wins.
- **Variable shadowing**: Inner declaration with same name hides outer declaration — the inner one is found first during top-down lookup. Falls directly out of the stack pointer model. Avoid it (Barendregt Convention).
- **Compound assignment**: `a op= b` means `a = a op b`. Covers `+=`, `-=`, `*=`, `/=`, `%=`.
- **Increment / decrement**: `a++` (postfix: use old value, then increment) vs `++a` (prefix: increment, then use new value). Same for `--`. `int a++` is a syntax error.
- **String concatenation**: `+` with a `String` operand converts the other operand and joins. Left-to-right evaluation: `"x" + 3 + 4` → `"x34"`, but `"x" + (3 + 4)` → `"x7"`.
- **Escape sequences**: `\n` (newline), `\t` (tab), `\"` (quote), `\\` (backslash).
- **`while` loop**: `while (condition) { body }`. Checks condition before each iteration. Three parts: init, condition, advance. Missing advance → infinite loop.
- **`for` loop**: `for (init; condition; advance) { body }`. Runs init once, then: check → body → advance → check → ... Mnemonic: "start, end, step."
- **Off-by-one error**: Miscounting iterations by 1. From `0` to `9` inclusive = 10 numbers. Formula: `(last - first) + 1`. The fence-post problem is universal.
- **Edge cases**: Inputs at boundaries (zero, empty, max/min). Code that works for typical inputs may fail at the edges. Always test: what happens with zero? With an empty string?
- **Tautology** ($a \lor \lnot a$): always `true`. Proves that `if-else` chains are exhaustive. A condition that simplifies to a tautology is dead code.
- **Substitution theorem**: Logically equivalent expressions can be swapped without changing behavior. Justifies all boolean simplification applied to conditions.

Next lecture will cover arrays and `ArrayList` — the foundational data structures for storing collections of values.

::

## Glossary

New terms introduced in this lecture. For terms from Lectures 1–3 (bit, byte, stack, heap, Oxford bracket, type casting, boolean, De Morgan's laws, etc.), see the previous articles' glossaries.

| Term | Everyday / Literal Meaning | What It Means in CS |
|:---|:---|:---|
| **Block** (代码块) | A group of things together | A sequence of statements enclosed in `{ }`. Serves two purposes simultaneously: **sequencing** (packages many statements into one) and **scoping** (creates a variable lifetime boundary). A block is itself a `<stmt>`. |
| **Branching** (分支) | A road splitting into paths | The ability of a program to execute different code depending on a condition. `if`, `else if`, and `else` are branching constructs. |
| **Command** | An order given to someone | An atomic instruction — the smallest unit of work the computer can do. `x = 5` and `System.out.println("hi")` are commands. A command alone is not yet a complete Java sentence. |
| **Comment** (注释) | A remark or note | Text in source code that the compiler ignores. `//` for single-line, `/* */` for multi-line. Used to document intent, preconditions, and postconditions. |
| **Compound Assignment** (复合赋值) | Combining operations | Shorthand `op=` where `a op= b` means `a = a op b`. Includes `+=`, `-=`, `*=`, `/=`, `%=`. |
| **Edge Case** (边界情况) | The edge of something | An input at the extreme boundary of valid values — zero, empty, maximum, minimum. Edge cases frequently expose logic bugs that normal inputs don't. |
| **Escape Sequence** (转义序列) | Getting out of a situation | A backslash `\` followed by a character, representing a special character in a string. `\n` = newline, `\t` = tab, `\"` = quote, `\\` = backslash. |
| **`for` Loop** (for循环) | — | A loop that consolidates initialization, condition, and advancement into a compact header: `for (init; condition; advance) { body }`. Mnemonic: "start, end, step." |
| **`if` Statement** (if语句) | — | The fundamental branching construct. BNF: `"if" "(" <expr:bool> ")" <stmt> ("else" <stmt>)?`. Takes exactly one statement; `{ }` lets you supply many. One unified syntax — no separate "if with braces" rule. |
| **Increment / Decrement** (自增/自减) | Going up/down by one | `++` adds 1; `--` subtracts 1. Prefix (`++a`): increment first, then use. Postfix (`a++`): use first, then increment. |
| **Infinite Loop** (无限循环) | A loop that never ends | A loop whose condition never becomes `false`. Usually caused by a missing advancement step. |
| **Off-by-One Error** (差一错误) | Being wrong by exactly one | A logic error where a loop iterates one too many or one too few times. Named after the fence-post problem. |
| **Scope** (作用域) | The range something covers | The region of code (delimited by `{ }`) where a variable is visible and alive. Created by the same `{ }` that provides sequencing. Inner scopes inherit outer variables; outer scopes cannot see inner variables. |
| **Sequencing** (顺序组合) | Putting things in order | The act of concatenating statements inside `{ }` to form a single compound statement. This is how we get the computer to execute multiple commands in order — by packaging them into one unit. |
| **Shadowing** (变量遮蔽) | One thing hiding another | When an inner scope declares a variable with the same name as an outer variable, the inner declaration *hides* (shadows) the outer one. Falls directly out of the stack pointer model's top-down lookup rule. |
| **Stack** (栈) | A pile of things | A data structure where items are added and removed only from the top. In scoping, the stack holds variable declarations. Lookup scans top-down; the first match wins. Not to be confused with stack *memory*. |
| **Stack Pointer** (栈指针) | A bookmark or marker | A marker that remembers the stack position when a scope is entered. When the scope exits (`}`), the pointer resets to the mark — discarding all variables declared in that scope in one motion. |
| **Statement** (语句) | A complete sentence | A command followed by a semicolon. BNF: `<stmt> ::= <cmd> ";"`. The semicolon tells the computer "this command is complete — move to the next." |
| **String** (字符串) | A sequence of characters | In Java, an object type representing text. Created with `"..."`. Supports concatenation with `+`. |
| **Substitution Theorem** (替换定理) | Swapping one thing for another | If two boolean expressions are logically equivalent, one can replace the other in any context without changing program behavior. |
| **Tautology** (重言式) | Saying the same thing twice | A boolean expression that is `true` for **all** input values. $a \lor \lnot a$ is the canonical example. Used to verify that conditional logic is exhaustive. |
| **`while` Loop** (while循环) | — | A loop that repeats while a condition is `true`: `while (condition) { body }`. The condition is checked before each iteration. |

::LinkCard
---
url: "http://online-java.com"
title: "Online Java — Browser-Based Java REPL"
details: "Experiment with if-else chains, for/while loops, and scope. Try the Collatz conjecture example — implement the full loop and trace how the value changes at each step. Deliberately introduce an off-by-one error and observe the output."
---
::
