---
title: APCSA - An Introduction
description: AP Computer Science A Lecture 1 — from hardware to Java syntax
createTime: 2026-07-06
updateTime: 2026-07-06

tags:
    - APCSA
---

::LinkCard
---
url: "https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-and-exam-description.pdf"
title: "AP® Computer Science A — Course and Exam Description"
details: "The official College Board syllabus. Includes the full course framework, exam weighting, and all tested topics. Worth a skim to know what you're signing up for."
image: "CB.webp"
---
::

## 0x00. Course Overview

AP Computer Science A (APCSA / APCSC) is a College Board course that tests **programming ability**, not rote memorization. Unlike APCSP (AP Computer Science Principles), which leans conceptual, APCSA requires you to actually write and read Java code.

The exam has two sections:

- **Multiple Choice**: code tracing, logical reasoning, and basic concepts.
- **Free Response Questions (FRQ)**: write or complete code based on a specification. FRQs are graded by human readers — **readability matters**.

::NoteBox
APCSA is about **programming mindset**, not memorizing syntax. The College Board provides a [Java Quick Reference](https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-java-quick-reference.pdf) during the exam — you don't need to memorize every API method name.
::

::McqMultiple
---
options:
    - 1. "It contains a multiple-choice section"
    - 2. "It contains a free-response section where you write code"
    - 3. "It tests memorization of Java API method signatures"
    - 4. "FRQs are scored by human readers who care about code readability"
correct: 
    - 1
    - 2
    - 4
---

#prompt
Which of the following are true about the APCSA exam? (Select all that apply.)

#explanation
APCSA has both multiple-choice and FRQ sections. FRQs are human-graded, so readability matters. Option 3 is false — the Java Quick Reference is provided during the exam, so you do NOT need to memorize API method signatures. The exam tests programming ability, not rote recall.
::

## 1x00. How Computers Work

### 1x01. The Input-Process-Output Model

A computer system can be distilled into three modules: **Input devices**, **Processor**, and **Output devices**.

::ExampleBox
Consider opening a game on your phone:

1. Tap the game icon on the screen → **Input**
2. The phone's CPU reads the app's code and data from memory, performs computation → **Process**
3. The screen displays the game → **Output**

Notice the touchscreen is special: it serves as both **input** (receiving taps) and **output** (displaying visuals). The entire flow forms a closed loop from physical interaction → digital computation → physical presentation.
::

More generally, every computer system consists of:

- **CPU (Central Processing Unit)**: the "brain" that executes computation. A CPU can only do extremely simple operations (add, compare, jump), but at billions of operations per second, these simple instructions compose into complex programs.
- **RAM (Random Access Memory)**: temporary storage for running programs and their data. Data is lost when power is cut — this is why unsaved work disappears if your computer suddenly shuts down. RAM is **temporary** storage; hard drives and SSDs are permanent storage. They are fundamentally different.
- **Peripheral Devices**: input devices (keyboard, mouse, touchscreen) and output devices (monitor, speakers).

> The AP exam touches on hardware concepts, but will not test circuit design or CPU internals.

::Mcq
---
options:
    - "1. CPU, RAM, and peripheral devices"
    - "2. CPU, GPU, and hard drive"
    - "3. Motherboard, power supply, and cooling fan"
    - "4. Operating system, compiler, and text editor"
correct: 1
---

#prompt
What are the three core components of a computer system?

#explanation
The three core components are the CPU (computation), RAM (temporary data storage), and peripheral devices (input/output). The GPU and hard drive fall within these categories; the motherboard and power supply are infrastructure; the OS and compiler are software, not hardware.
::

## 2x00. Binary & Data

### 2x01. Why Binary?

Computers store and process all data in **binary** — a number system with only two digits: $0$ and $1$.

Why binary? Because the fundamental hardware component — the transistor — is essentially a switch: **on (1)** or **off (0)**. Designing circuits with ten distinct states (for decimal) is physically difficult and unreliable. Two states (on/off) are clean, stable, and simple to engineer.

### 2x02. Place-Value System

Binary place-value works exactly like decimal — the base is just $2$ instead of $10$:

::DefBox{id="Decimal Expansion"}
In decimal, each digit's weight is a power of $10$:
$$
123_{10} = 1 \times 10^2 + 2 \times 10^1 + 3 \times 10^0
$$
::

::DefBox{id="Binary Expansion"}
In binary, each digit's weight is a power of $2$. Here is $123_{10}$ in binary:
$$
1111011_2 = 1 \times 2^6 + 1 \times 2^5 + 1 \times 2^4 + 1 \times 2^3 + 0 \times 2^2 + 1 \times 2^1 + 1 \times 2^0
$$

Verification:
$$
64 + 32 + 16 + 8 + 0 + 2 + 1 = 123
$$
::

::NoteBox
To convert decimal to binary, repeatedly divide by $2$, recording the remainder each time, until the quotient is $0$. Read the remainders **bottom to top**.

For $123$:

| Division | Quotient | Remainder |
|----------|----------|-----------|
| $123 \div 2$ | $61$ | $1$ |
| $61 \div 2$ | $30$ | $1$ |
| $30 \div 2$ | $15$ | $0$ |
| $15 \div 2$ | $7$ | $1$ |
| $7 \div 2$ | $3$ | $1$ |
| $3 \div 2$ | $1$ | $1$ |
| $1 \div 2$ | $0$ | $1$ |

Reading bottom to top: $1111011_2$.
::

::Mcq
---
options:
    - "1. $5_{10}$"
    - "2. $10_{10}$"
    - "3. $1010_{10}$"
    - "4. $16_{10}$"
correct: 2
---

#prompt
What is $1010_2$ in decimal?

#explanation
Expand by place-value: $1010_2 = 1 \times 2^3 + 0 \times 2^2 + 1 \times 2^1 + 0 \times 2^0 = 8 + 0 + 2 + 0 = 10_{10}$.

Binary place-values (right to left): 1, 2, 4, 8, 16, 32, 64, ... So $1010_2$ has a 1 in the 8s place and a 1 in the 2s place — add them: $8 + 2 = 10$.
::

## 2x03. Bits, Bytes, and Words

::DefBox{id="Bit"}
A **bit** (binary digit) is the smallest unit of data. It holds a single binary value: $0$ or $1$.
::

::DefBox{id="Byte"}
A **byte** is a group of $8$ bits. It is the **minimum addressable unit** of memory — whenever the CPU reads from or writes to RAM, it does so in units of at least one byte.

The name "byte" originated as a deliberate misspelling of "bite" to avoid confusion with "bit." It was coined by Werner Buchholz at IBM in 1956.
::

::DefBox{id="Word"}
A **word** is $2$ bytes ($16$ bits). This term appears less frequently in APCSA, but is a standard unit in computer architecture.
::

$$
1 \text{ bit} = \text{a single } 0 \text{ or } 1
\qquad
1 \text{ byte} = 8 \text{ bits}
\qquad
1 \text{ word} = 2 \text{ bytes} = 16 \text{ bits}
$$

::Mcq
---
options:
    - "1. $1$ bit"
    - "2. $4$ bits"
    - "3. $8$ bits"
    - "4. $16$ bits"
correct: 3
---

#prompt
How many bits are in one byte?

#explanation
One byte consists of exactly 8 bits. A byte is the minimum addressable unit of memory. A word is 2 bytes (16 bits).
::

## 3x00. Java Syntax

### 3x01. Imperative Languages

Java is an **imperative language**. This means a program is a sequence of **statements** (语句), each telling the computer to perform a specific operation. The computer executes these statements one by one, mutating the program's **state** — the values stored in variables.

This differs from **declarative languages**, which describe *what you want*, not *how to get there step by step*.

> Computers don't understand English or Chinese. A programming language like Java is the bridge: you write Java → the **compiler** translates it into binary instructions the machine can execute.

### 3x02. BNF Notation

Before discussing syntax, we need a precise way to describe syntax rules. **BNF (Backus-Naur Form)** is the standard tool in computer science for specifying programming language grammar.

::DefBox{id="BNF"}
BNF uses these conventions:

- `::=` means "is defined as"
- `<...>` encloses a **non-terminal** — a syntactic category that must be further expanded
- Unbracketed text is a **terminal** — a literal symbol that actually appears in code
- `|` means "or" (choice)
::

For example, a simple definition of digits and numbers:

```
<digit>  ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<number> ::= <digit> | <digit> <number>
```

This reads: a digit is one of `0` through `9`; a number is either a single digit, or a digit followed by another number (a recursive definition).

### 3x03. Binding (Assignment)

The most fundamental statement in Java is **variable binding**, also called an **assignment statement** or **variable declaration**.

In BNF:

```
<binding> ::= <type> <identifier> "=" <value> ";"
```

A binding statement consists of a type, an identifier (the variable name), an equals sign, a value, and a semicolon.

::ExampleBox
```java
int a = 0;
int b = 10;
```

- `int` is the **type**: tells the compiler this variable stores integers
- `a`, `b` are **identifiers**: the names of the variables
- `=` is the **assignment operator**: binds the value on the right to the name on the left
- `0`, `10` are **literals** (字面量): constant values written directly in source code
- `;` is the **statement terminator**: every statement must end with a semicolon
::

**Variable naming rules**, in BNF:

```
<identifier> ::= <letter> | <identifier> <letter> | <identifier> <digit>
<letter>    ::= "a" | "b" | ... | "z" | "A" | "B" | ... | "Z" | "_" | "$"
<digit>     ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

::WarningBox
1. The **first character** of a variable name must be a letter (`a`–`z`, `A`–`Z`), underscore (`_`), or dollar sign (`$`). It **cannot start with a digit**.
2. Variable names **cannot be Java reserved keywords** (`class`, `public`, `int`, `static`, etc.). Using one causes a compiler error.
3. By convention, Java uses **camelCase**: first word lowercase, subsequent words capitalized. Use `totalCost`, `userName` — not `Totol_cost` or `user2`.
::

::McqMultiple
---
options:
    - 1. "playerScore"
    - 2. "2ndPlace"
    - 3. "_counter"
    - 4. "public"
correct: 
    - 1
    - 3
---

#prompt
Which of the following are valid Java identifiers? (Select all that apply.)

#explanation
playerScore is valid — it uses camelCase. _counter is valid — an underscore is a legal first character. 2ndPlace is invalid — identifiers cannot start with a digit. public is invalid — it is a Java reserved keyword.
::

### 3x04. Reassignment

Once declared, a variable's value can be changed **without repeating the type**:

```
<reassignment> ::= <identifier> "=" <value> ";"
```

::ExampleBox
```java
int a = 0;    // binding: declares a, initializes to 0
a = 10;       // reassignment: changes a's value to 10
a = a + 1;    // reassignment: evaluates a + 1 (= 11), stores result back in a
```

The statement `a = a + 1` makes no sense in mathematics (a number cannot equal itself plus one). But in programming, `=` is **not** mathematical equality — it is the **assignment operator**: "evaluate the expression on the right, then store the result in the variable on the left."

In Java (and most languages), mathematical equality uses `==`.
::

::WarningBox
In Java, **`=` always means assignment**, never equality checking. This is the single most common operator confusion for beginners. Equality checking uses `==` (for primitive types) or `.equals()` (for objects).
::

::Mcq
---
options:
    - "1. 0"
    - "2. 5"
    - "3. 8"
    - "4. 10"
correct: 3
---

#prompt
What is the value of a after the following code executes?
```java
int a = 5;
a = a + 3;
```

#explanation
Line 1 binds a to 5. Line 2 evaluates the expression a + 3 which is 5 + 3 = 8, then assigns the result back to a. So a becomes 8. The old value 5 is overwritten — a variable only remembers its most recent assignment.
::

::Mcq
---
options:
    - "1. int class = 5;"
    - "2. int myVar = 10;"
    - "3. int _count = 0;"
    - "4. int totalCost = 100;"
correct: 1
---

#prompt
Which of the following variable declarations will cause a compilation error?

#explanation
int class = 5; fails because class is a reserved Java keyword. Keywords cannot be used as identifiers. All other options use valid names. Option 2 uses camelCase, option 3 starts with an underscore (permitted), and option 4 uses valid camelCase.
::

## 4x00. Primitive Types

Java types fall into two categories: **primitive types** and **reference types**. This section covers the primitives.

### 4x01. `int` — Integer

::DefBox{id="int"}
`int` represents an integer. In Java it occupies **32 bits (4 bytes)**.
::

Its range is roughly $-2^{31}$ to $2^{31} - 1$ (about $\pm 2.147 \times 10^9$). The exact range is rarely tested, but you should be aware that overflow is possible.

::NoteBox
Historically, `int` size varied between 32-bit and 64-bit systems. On all modern Java platforms, `int` is uniformly 32 bits. Don't worry about historical differences for the exam.
::

### 4x02. `double` — Double-Precision Floating Point

::DefBox{id="double"}
`double` represents a double-precision floating-point number. It occupies **64 bits (8 bytes)**.
::

`double` is for numbers with fractional parts. By contrast, `float` (single-precision) is only 32 bits and less precise. For APCSA, **prefer `double`**.

```java
double price = 50.0;
double ratio = 123.45;

// int literals are automatically promoted to double
double count = 50;    // 50 is an int literal, auto-promoted to 50.0
```

::NoteBox
When an `int` is assigned to a `double` variable, Java performs automatic **type promotion** — `int` is a subset of `double` (mathematically, $\mathbb{Z} \subset \mathbb{R}$), so no information is lost. The reverse (`double` → `int`) requires an **explicit cast**, because truncating the fractional part loses information. This will be covered in a later lecture.
::

### 4x03. `boolean` — Boolean Values

::DefBox{id="boolean"}
`boolean` has exactly two literal values: `true` and `false`. It occupies **4 bytes** — even though theoretically 1 bit would suffice.

The extra space is an idiom called **alignment**. Computers align data to fixed boundaries (multiples of 4 or 8 bytes) because it makes memory look "prettier" — addresses are predictable, the CPU can fetch data in regular strides, and reasoning about memory layout becomes much simpler. Think of it like arranging books on a shelf by fixed-width sections: you waste a little shelf space, but you can find anything instantly without measuring.
::

The type is named after the English mathematician **George Boole**, who developed Boolean algebra in the mid-19th century, laying the theoretical foundation for modern digital logic circuits.

```java
boolean isPassed = true;
boolean isFailed = false;
```

> `true` and `false` are keywords / literals. They cannot be redefined or modified.

### 4x04. Type Summary

| Type | Size | Use Case | Example |
|:---|:---|:---|:---|
| `int` | 32 bits (4 bytes) | Integers | `int a = 42;` |
| `double` | 64 bits (8 bytes) | Floating-point numbers | `double b = 3.14;` |
| `boolean` | 4 bytes | True / false values | `boolean c = true;` |

These sizes increase in multiples of 8 bits (1 byte) — a pattern driven by memory alignment. Primitive types have **fixed, compile-time-known sizes**, which directly determines where they reside in memory.

::McqMultiple
---
options:
    - 1. "int"
    - 2. "String"
    - 3. "double"
    - 4. "boolean"
correct: 
    - 1
    - 3
    - 4
---

#prompt
Which of the following are **primitive** types in Java? (Select all that apply.)

#explanation
int, double, and boolean are all primitive types. String is a **reference type** — notice its uppercase first letter, which is a visual cue. Reference types store an address pointing to heap memory, while primitives store their values directly on the stack.
::

::Mcq
---
options:
    - "1. int — 32 bits"
    - "2. double — 32 bits"
    - "3. boolean — 4 bytes"
    - "4. int — 4 bytes"
correct: 2
---

#prompt
Which statement about Java primitive types is FALSE?

#explanation
double occupies 64 bits (8 bytes), not 32 bits. float is the 32-bit floating-point type (less precise and less recommended). All other statements are correct: int is 32 bits (4 bytes), and boolean occupies 4 bytes.
::

## 5x00. Stack, Heap, and Reference Types

### 5x01. The Stack

**Stack memory** is where Java stores primitive-typed data (`int`, `double`, `boolean`).

::DefBox{id="Stack Memory"}
The stack follows **LIFO (Last In, First Out)**. Think of stacking homework assignments: the first one placed is at the bottom; the last one placed is on top. You can only take from the top.
::

Primitive types have sizes known at compile time (`int` is always 4 bytes), so their space can be pre-allocated on the stack. When execution leaves a scope (e.g., a method returns), that scope's **stack frame** is popped — including all its primitive variables.

### 5x02. The Heap

But not all data has a fixed size. A piece of text (String) could be 0 characters or millions of characters. The stack cannot handle "size-unknown" data.

The solution is **heap memory**:

::DefBox{id="Heap Memory"}
The heap is a region of memory that is **dynamically allocated** at runtime. When a variable's size is not known at compile time (strings, arrays, objects), its actual data lives on the heap. The heap does not follow LIFO — allocation and deallocation can happen in any order, managed by the JVM's **garbage collector**.
::

The heap's size depends on the system memory available to the JVM. Under normal circumstances it's effectively inexhaustible. Important distinction: the heap lives in **RAM** (temporary, vanishes when the program exits); the **hard drive / SSD** is for permanent file storage. RAM is temporary workspace only.

### 5x03. Reference Types: `String`

::DefBox{id="String"}
A **String** is an abstraction (抽象) of a list of characters. Because the length of the list — how many characters — is not known at compile time, the actual character data cannot be pre-allocated on the stack. Instead, `String` is a **reference type**: the variable stores a **memory address (reference)** pointing to the heap location where the character data actually lives.
::

Think of it like an apartment address: the variable is not the apartment (the data) — it's a slip of paper with an address written on it. Follow the address, you find the apartment. Copy the slip of paper, you've copied the address, not the apartment.

Notice `String` starts with an **uppercase letter** — this is the naming convention for object types, and a quick visual distinction from primitive types (`int`, `double` are all lowercase).

```java
String greeting = "Hello, World!";
// greeting lives on the stack; its value is an address
// that address points to the "Hello, World!" string object on the heap
```

::WarningBox
Java strings must use **straight double quotes `"..."`**. Curly / smart quotes (`"..."` or `"..."`) cause compiler errors.
::

::McqMultiple
---
options:
    - 1. "int — its data is stored directly on the stack"
    - 2. "double — its data is stored directly on the stack"
    - 3. "String — the actual character data is stored on the stack"
    - 4. "String — the variable (reference) is on the stack, but the object lives on the heap"
correct: 
    - 1
    - 2
    - 4
---

#prompt
Which of the following statements about memory are TRUE? (Select all that apply.)

#explanation
int and double are primitive types with fixed compile-time sizes — their data lives directly on the stack (options 1 and 2 are true). For String, the variable itself (the reference/address) is on the stack, but the actual character data lives on the heap because string length is not fixed at compile time. Option 3 is false — string data is NOT on the stack. Option 4 correctly describes the split: reference on stack, object on heap.
::

::Mcq
---
options:
    - "1. int — stored on the stack, fixed size"
    - "2. double — stored on the stack, fixed size"
    - "3. boolean — stored on the stack, fixed size"
    - "4. String — stored on the stack, fixed size"
correct: 4
---

#prompt
Which statement about memory allocation is FALSE?

#explanation
String is a reference type. Its actual character data is stored on the **heap**, not the stack, because string length is not known at compile time. The variable (the reference/address) lives on the stack, but the object lives on the heap. All primitive types (int, double, boolean) have compile-time-known fixed sizes and are stored directly on the stack.
::

## 6x00. Terminology Roundup

Three core terms were introduced in this lecture. They describe different roles syntactic elements play in source code:

::DefBox{id="Literal"}
A **literal** (字面量) is a constant value written directly in source code, requiring no computation or memory lookup.

- `0`, `10`, `50.0` are literals
- `true`, `false` are literals
- `"Hello"` is a string literal

A literal can only appear on the right side of an assignment — it is *what is being assigned*. You cannot "inspect" or "modify" a literal itself.
::

::DefBox{id="Statement"}
A **statement** (语句) is the basic unit of program execution. Each statement tells the computer to perform an operation. In Java, statements end with a semicolon `;`.

- `int a = 0;` is a statement (specifically, a binding statement)
- `a = 10;` is a statement (specifically, a reassignment statement)
::

::DefBox{id="Expression"}
An **expression** (表达式) is a fragment of code that can be **evaluated** to produce a value.

- `a + 1` is an expression (evaluates to `a` plus 1)
- `50.0` by itself is also an expression (evaluates to the literal itself)
- When `a + 1` appears on the right of `=`, it is evaluated first, then the result is assigned

In short: expressions **produce** values; statements **perform** actions. An assignment statement generally has the form `<variable> = <expression>;`.
::

| Term | Chinese | Role | Example |
|:---|:---|:---|:---|
| Literal | 字面量 | A constant value in source code | `42`, `3.14`, `true` |
| Statement | 语句 | Performs an operation | `int a = 0;` |
| Expression | 表达式 | Evaluates to a value | `a + 1`, `50.0` |

::Mcq
---
options:
    - 1. "int x = 5; is a binding statement, and 5 is a literal"
    - 2. "x + 3 is an expression that evaluates to a value"
    - 3. "int y = x + 3; is a statement that contains the expression x + 3"
    - 4. "The number 5 by itself, with no surrounding context, is a statement"
correct: 4
---

#prompt
Which of the following is FALSE?

#explanation
A bare number like 5 is a **literal** (or a trivial expression), not a statement. A statement requires syntactic context: int x = 5; is a binding statement. Writing just 5; alone — while technically an expression statement — is not a binding or reassignment statement and is meaningless in practice. Options 1–3 correctly classify literals, expressions, and statements.
::

---

::NoteBox
**Cognitive Anchor**

- Your computer is a machine that takes **input**, does **processing**, and produces **output**. The CPU computes, RAM temporarily stores data, and peripheral devices bridge the physical and digital worlds.
- All data reduces to **binary** ($0$s and $1$s). One bit is a single $0$ or $1$; one byte is $8$ bits and is the smallest chunk of memory the CPU can address directly.
- Java is an **imperative language**: you tell the computer *how* to do something through a sequence of **statements** (语句). Each statement ends with `;`.
- **BNF** is a notation for precisely describing syntax. Two statements were introduced: `<binding> ::= <type> <id> "=" <value> ";"` and `<reassignment> ::= <id> "=" <value> ";"`.
- `=` means **assignment**, not mathematical equality. Equality checking uses `==`.
- Three **primitive types** are on the exam: `int` (32 bits), `double` (64 bits), `boolean` (4 bytes — alignment padding, not because it needs the space).
- Primitive types are **fixed-size** → stored on the **stack** (LIFO). Reference types like `String` are **variable-size** → the actual data lives on the **heap** (dynamically allocated); the variable stores a reference/address.
- A **literal** (字面量) is a raw constant value. An **expression** (表达式) evaluates to a value. A **statement** (语句) performs an action.

Upcoming lectures will cover type casting, control flow (conditionals and loops), and object-oriented programming.

Experiment with the online editor below — try declaring variables of different types and observe the results.

::
## Glossary

A quick reference for terms whose CS meaning differs from everyday English — or which simply didn't exist before this lecture.

| Term | Everyday / Literal Meaning | What It Means in CS |
|:---|:---|:---|
| **Abstraction** (抽象) | A vague idea; something not concrete | Hiding the messy internal details behind a clean, simple interface. A `String` abstracts away the raw character array — you don't need to know how characters are laid out in memory, you just use it. |
| **Address** (地址) | Where a building is; a street number | A number that tells the CPU exactly where in memory something lives. Like a postal address, but for bytes in RAM. |
| **Allocation** (分配) | Setting aside money or resources for a purpose | Reserving a block of memory for a variable or object. "Static allocation" happens at compile time (stack); "dynamic allocation" happens while the program runs (heap). |
| **Assignment** (赋值) | A task given to someone | The act of storing a value into a variable: `a = 5` means "put 5 into `a`." Not to be confused with mathematical equality. |
| **Binding** (绑定) | Tying things together; an obligation | The act of associating a name (identifier) with a type and a value. `int a = 0;` creates a binding: the name `a` now refers to an `int` holding `0`. |
| **Bit** (比特 / 位) | A small piece; a tiny amount | Short for **bi**nary digi**t**. The smallest unit of data — a single $0$ or $1$. Eight bits make one byte. |
| **BNF** (巴科斯-诺尔范式) | — | A notation for precisely describing the grammar of a programming language. Uses `::=` for "is defined as", `<...>` for things that need to be expanded, and `\|` for "or". |
| **Byte** (字节) | — | A group of 8 bits. The smallest chunk of memory the CPU can directly address. Named as a deliberate misspelling of "bite." |
| **Compile** (编译) | To assemble from various sources | The process of translating human-written source code (Java) into machine-executable instructions (binary). Done by a **compiler**. |
| **Declarative** (声明式) | Making a formal statement | A style of programming where you describe *what* you want, not *how* to get it. SQL ("give me all rows where age > 18") is declarative; Java is not. |
| **Dynamic** (动态) | Energetic; constantly changing | In CS: something that happens at **runtime** — while the program is executing — rather than at compile time. Opposite of **static**. |
| **Expression** (表达式) | A phrase; conveying feeling | A piece of code that can be **evaluated** to produce a single value. `a + 1` is an expression; so is `50.0` by itself. |
| **Garbage Collector** (垃圾回收器) | — | A part of the JVM that automatically finds and frees heap memory that is no longer being used by any variable. You don't manually "delete" objects in Java. |
| **Heap** (堆内存) | A messy pile; a mound | A region of RAM where variable-size data (strings, objects, arrays) is stored. Allocated and freed in any order, managed by the garbage collector. |
| **Identifier** (标识符) | Something that identifies | The name of a variable. Must start with a letter or underscore, cannot be a reserved keyword. Examples: `totalCost`, `playerScore`. |
| **Imperative** (命令式) | Giving orders; bossy | A style of programming where you tell the computer *how* to do something through a sequence of statements. Java is an imperative language. |
| **JVM** (Java虚拟机) | — | A program that runs compiled Java bytecode. It provides the heap, the garbage collector, and abstracts away the underlying operating system. |
| **Keyword** (关键字) | An important word | A word reserved by the Java language that cannot be used as a variable name. Examples: `class`, `public`, `int`, `static`, `true`, `false`. |
| **LIFO** (后进先出) | — | The rule that governs the stack: the last item placed on top is the first one taken off. Like a stack of plates or homework assignments. |
| **Literal** (字面量) | Taking words at face value | A constant value written directly in source code. `42`, `3.14`, `true`, `"Hello"` are all literals. |
| **Lvalue / Rvalue** (左值 / 右值) | — | An **lvalue** is something that can appear on the **left** side of `=` (a variable — it names a location). An **rvalue** is something that can only appear on the **right** side (a literal or expression — it just produces a value). `a = 5`: `a` is an lvalue, `5` is an rvalue. |
| **Reference** (引用) | A mention; a source citation | A value that is a memory address pointing to an object on the heap. The variable stores the address, not the object itself. Passing a reference is like photocopying an apartment key. |
| **Static** (静态) | Unmoving; fixed | In CS: something that happens at **compile time** — before the program runs. A static variable belongs to the class, not to any instance. Opposite of **dynamic**. |
| **Syntax** (语法) | Grammar; sentence structure | The set of rules that define what is a valid program in a language. BNF is a way to describe syntax precisely. Syntax errors are like grammatical mistakes. |
| **Type** (类型) | A category; a kind | A classification of what kind of data a variable holds (`int`, `double`, `boolean`, `String`, …). Types determine what operations are allowed and how much memory is needed. |
| **Word** (字) | A unit of language | In computer architecture: 2 bytes (16 bits). Not frequently tested in APCSA, but a standard term. |
| **Wrapper** (包装类) | Something that covers or encloses | A class that "wraps" a primitive type into an object so it can be used where objects are required. `Integer` wraps `int`; `Double` wraps `double`. Not covered in this lecture, but you'll see them soon. |

::LinkCard
---
url: "http://online-java.com"
title: "Online Java — Browser-Based Java REPL"
details: "A zero-setup Java environment that runs in your browser. No installation, no IDE configuration. Just type code and run it. Perfect for experimenting with everything covered in this lecture."
---
::
