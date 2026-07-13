---
title: APCSA - Entities, Products, and Objects
description: AP Computer Science A Lecture 5 — classes, objects, methods, return paths, and the mathematical foundations of structured data
createTime: 2026-07-13
updateTime: 2026-07-13

tags:
    - APCSA
ligatures: false
---

## 0x00. Mathematical Foundations — What Is a "Bundle of Variables" Really?

### 0x01. Let's Step Back

Up to this point, every variable you've declared has held exactly **one** value:

```java
int age = 17;
double gpa = 3.8;
boolean isEnrolled = true;
```

This works when your data fits into a single slot. But real data rarely does.

Think about what you'd need to represent a point on a plane. That's **two** numbers — an $x$ and a $y$ — that belong together. Split them apart and you lose the fact that $(3, 4)$ is a location, not just two unrelated measurements.

A student record? Name, ID number, GPA — **three** pieces that travel as a unit. A bank account? Account number, balance, owner. These are **entities**: things made of multiple pieces of data that only make sense together.

Some programming languages give you a built-in way to bundle values. Python has `(x, y)`. Haskell has `(a, b)`. Java... doesn't. Not as a primitive feature. If you want a bundle in Java, you have to build it yourself.

But before we rush to Java syntax, let's ask something deeper: **what does it actually mean to bundle variables together?** Forget Java for a moment. What are we really trying to construct?

Let's think concretely. You declare two separate variables:

```java
double x;
double y;
```

You can read `x`. You can read `y`. You can assign to either. They exist independently — the only connection between them is that you happened to declare them on adjacent lines. That's not much of a connection.

Now imagine you want a single thing that "contains both." What must that thing be able to do?

Turns out, exactly two things. Think about what you'd actually want to do with a bundle:

1. **Get things out** — given the bundle, you need to extract the $x$ or the $y$
2. **Put things in** — given an $x$ value and a $y$ value, you need to assemble a bundle

That's it. Everything else — methods, encapsulation, inheritance — is built on top of these two operations. If your "bundle" can't do both, it's not really a bundle.

### 0x02. Getting Things Out — Extracting Components

Let's start with the first operation. Suppose someone hands you a bundle — call it $p$ — that contains an $x$ and a $y$. What's the first thing you'll want to do?

You'll want to look inside and pull something out:

```java
double a = /* somehow get x out of p */;
double b = /* somehow get y out of p */;
```

Think of it like a sealed envelope. Someone puts a name and an age inside and hands it to you. You can open the envelope and read just the name, ignoring the age. Or read just the age, ignoring the name. The envelope itself hasn't changed — you're just looking at it from a particular angle.

A cylinder gives us the same picture: viewed from the top, it projects to a circle; viewed from the side, it projects to a rectangle. Same cylinder, different facet. Same bundle, different component.

This operation — extract one piece, discard the rest — is so fundamental that mathematicians gave it a name:

::DefBox{id="Projection"}
A **projection** is a function that takes a bundle and extracts one component, discarding the rest.

For a bundle $P$ of $A$ and $B$, we have two projections:

$$
\pi_1 : P \to A \qquad \pi_2 : P \to B
$$

$\pi_1$ extracts the first component; $\pi_2$ extracts the second.

::Pic
---
alt: "The two projections $\pi_1$ and $\pi_2$ mapping from the bundle to its components"
src: projections-comm.webp
---
::
::ExampleBox
Concretely, suppose our bundle holds a coordinate pair — say $(3.0, 4.0)$. Then:

$$
\begin{aligned}
\pi_1(3.0, 4.0) &= 3.0 \quad &\text{(left projection — "give me the x")} \\
\pi_2(3.0, 4.0) &= 4.0 \quad &\text{(right projection — "give me the y")}
\end{aligned}
$$

The bundle $(3.0, 4.0)$ is one thing. $\pi_1$ looks at it and returns $3.0$ — it "forgets" the $4.0$. $\pi_2$ looks at it and returns $4.0$ — it "forgets" the $3.0$. Each projection reveals one dimension.

::
::

### 0x03. Putting Things Together — Construction

Projection gets things *out* of the bundle. But that's only half the story. You also need to *make* bundles in the first place.

Suppose you have two values and you want to package them up:

```java
double a = 3.0;
double b = 4.0;
// somehow make a bundle p from a and b
```

You need an operation that takes the pieces and assembles them. Let's call it `construct` for now.

And here's the crucial requirement: **projection must undo construction.** If you construct a bundle from `a` and `b`, then project out the first component, you'd better get `a` back. Project out the second, you'd better get `b` back. The round-trip must be lossless:

```java
// Construct from (a, b), then project → get (a, b) back
projectX(construct(a, b)) == a   // must be true
projectY(construct(a, b)) == b   // must be true
```

::NoteBox
This round-trip property isn't a coincidence — it's the **defining requirement** for a bundle to be a bundle. If constructing from $(a, b)$ and then projecting didn't give you $a$ and $b$ back, then your "bundle" isn't faithfully representing the data. Something got lost.

Think of it this way: if you put a name and an age into an envelope, seal it, then open it and read the name... you expect to see the same name you put in. If the envelope somehow scrambled the contents, it wouldn't be a very useful envelope.
::

::Mcq
---
options:
    - "1. Projection extracts one component from a bundle, discarding the rest"
    - "2. Construction assembles a bundle from individual components"
    - "3. Construction and projection are independent — you can have one without the other"
    - "4. If you construct from $(a, b)$ and then project, you must get $a$ and $b$ back"
correct: 3
---
#prompt
Which statement is **false** about the relationship between projection and construction?

#explanation
Option 3 is false — projection and construction are **not** independent. A bundle that only supports projection but not construction (or vice versa) is incomplete. They are two halves of the same idea: construction puts things in, projection takes them out. Options 1, 2, and 4 are all true statements about how these operations work.
::

### 0x04. A Puzzle — Defining "Combining" Without Talking About Combining

So far, everything we've drawn is a **single arrow** from one thing to another: $\pi_1 : P \to A$, $\pi_2 : P \to B$, a function $f : C \to A$. These are **unary** — one input, one output. Clean. Simple.

But `construct(a, b)` is **binary** — it takes *two* inputs ($a$ and $b$) and produces one output (the bundle). We can't draw "two arrows converging into one thing" in our world of single arrows between single objects. We have no notation for it.

So we need another way to say "this thing combines two pieces of data." Here's the puzzle: **how do you describe a thing made of $A$ and $B$ without saying how it's built?**

The answer is a shift in perspective. Instead of describing what the bundle *is*, describe how it *relates to everything else*. Specifically:

::DefBox{id="Universal Property — Intuition"}
Instead of defining the bundle by its constructor, define it by its relationship to **everything else**:

> If some object $C$ can produce an $A$ (via $f$) and a $B$ (via $g$), then $C$ can produce the whole bundle $P$ — and there's exactly one way to do it.

In other words: **anything that provides projections is ultimately a product.** You don't need to know how the product was built; you only need to know that it's *the thing* that everything else factors through.
::

::ExampleBox
**A sequence as a candidate.** Suppose we put our two components into a sequence — just an ordered list $[3.0, 4.0]$. This isn't a coordinate point — it's a sequence. But we can still get the first element (call it $\texttt{first}$) and the second element (call it $\texttt{second}$):

$$
\texttt{first}([3.0, 4.0]) = 3.0 \qquad \texttt{second}([3.0, 4.0]) = 4.0
$$

Since a sequence can produce an $A$-value and a $B$-value, the universal property says: there must be exactly one way to convert a sequence $[a, b]$ into our bundle. And indeed there is:

$$
\langle \texttt{first}, \texttt{second} \rangle ([a, b]) = \texttt{construct}(a, b)
$$

The projections recover the original values:

$$
\pi_1(\texttt{construct}(a, b)) = a = \texttt{first}([a, b])
$$
$$
\pi_2(\texttt{construct}(a, b)) = b = \texttt{second}([a, b])
$$

This conversion is **forced** — you have no choice. To make a bundle, you need an $A$ and a $B$; the sequence gives you exactly those two values; the only way to construct the bundle is to put them in. The universal property guarantees this is always the case, for *any* candidate that can produce the components — not just sequences.
::

::DefBox{id="Binary Product — The Full Definition"}
This pattern — projections + unique conversion from any candidate — is what mathematicians call a **binary product**. Formally:

An object $P$ with projections $\pi_1 : P \to A$ and $\pi_2 : P \to B$ is a **product** of $A$ and $B$ if, for **any** object $C$ with morphisms $f : C \to A$ and $g : C \to B$, there exists a **unique** morphism $\langle f, g \rangle : C \to P$ such that:

$$
\pi_1 \circ \langle f, g \rangle = f \qquad \pi_2 \circ \langle f, g \rangle = g
$$

In a diagram:

::Pic
---
alt: "The universal property — for any C with f and g, there exists a unique $\langle f,g \rangle$ making the diagram commute"
src: universal-product-comm.webp
---
::

The $\exists!$ means "there exists exactly one" — no ambiguity, no design decisions. The mediating morphism $\langle f, g \rangle$ is the unique conversion.
::

::NoteBox
This definition says **nothing** about ordered pairs, tuples, or Cartesian products. It says: "here are two ways to get data out (projections), and if you have any other way to get that data, there's exactly one way to turn it into this form." The ordered pair $(a,b)$ and the `construct` function are *consequences* of this definition, not the definition itself.

The study of these patterns — objects defined purely by their relationships to other objects — is called **category theory**. It asks: "what if we define things by how they connect, rather than by what's inside them?" The product is one of its simplest constructions: you can't draw a binary constructor, so you define the product by the universal mapping into it instead.
::

### 0x05. `&&` Is Also a Product — The Logic Connection

Remember Lecture 3 on boolean algebra? The logical AND operator `&&` is a product too — in the category where objects are *propositions* and morphisms are *implications* ($P \to Q$ means "P implies Q").

For the product of propositions $A$ and $B$, we need:
- **Projections**: ways to go from $A \land B$ to $A$ and to $B$. These are the inference rules "from $A \land B$, conclude $A$" and "from $A \land B$, conclude $B$." Trivially true.
- **Universal property**: if some proposition $C$ implies both $A$ and $B$ (i.e., $C \to A$ and $C \to B$), then $C$ implies $A \land B$ — and this implication is unique.

In plain English: if $C$ is strong enough to prove both $A$ and $B$ individually, then $C$ is also strong enough to prove $A \land B$. And there's only one way to combine those two proofs — you present them together.

```java
// C proves A:
boolean provesA(C c) { ... }   // C → A

// C proves B:
boolean provesB(C c) { ... }   // C → B

// Therefore C proves (A && B) — and this is the only way:
boolean provesAandB(C c) {     // the mediating morphism ⟨f, g⟩
    return provesA(c) && provesB(c);
}
```

The mediating morphism is literally `f(c) && g(c)`. The `&&` operator *is* the product construction. And just like with our bundle, the round-trip works: from $A \land B$ you can project out $A$ and $B$, and if you have both, you can reconstruct $A \land B$.

::ExampleBox
**Why this unification matters.** The coordinate point, the logical `&&`, and the mathematical Cartesian product $\mathbb{R} \times \mathbb{R}$ all satisfy the *exact same definition*. They differ in what's "inside" (coordinates, truth values, real numbers), but they are **identical in structure** — same projections, same universal construction.

This means any intuition you build about one of them transfers to all the others. When you understand how projection works for a coordinate, you understand how `&&` decomposes. When you understand the construction $\langle f, g \rangle$ for points, you understand how `&&` combines proofs. The pattern is the pattern.
::

### 0x06. n-Products and the 0-Product

The binary product generalizes to any number of components. A bundle with three components is a **3-ary product** — three projections, and any candidate that can produce all three can be uniquely converted into the bundle. More fields, same pattern.

Now an edge case that sounds like a trick question but isn't: **what is a product of zero things?**

It's a fair question. If a 2-product has two projections and a 3-product has three... a 0-product has **zero** projections. There's nothing to extract. It contains literally zero pieces of information.

How do you construct one? Since there are no components to fill in, the construction is trivial. For any candidate $C$, there's exactly one way to go from $C$ to the 0-product — a function that looks at $C$, does nothing, and produces... nothing.

::DefBox{id="0-Product = Unit Type = void"}
The 0-product is a type with exactly one value — the empty bundle. In Java, this is `void`. It carries **zero bits of information**:

- You can't project anything out of it (there are no fields)
- It can be constructed from anything (the construction just discards the input)

A `void` method like `System.out.println(...)` embodies this: it takes an input, does something (a side effect), and produces nothing. The return type is `void` precisely because there is **no information to return** — the 0-product.
::

This is why you can't assign the result of `println` to a variable — there's nothing to assign. And why every `void` method can be called from anywhere — the 0-product can be constructed from any type.

::NoteBox
None of this category theory is on the AP exam. But it answers *why* classes, `&&`, tuples, and `void` feel like they belong to the same family: they do. They're all products, just in different categories. The class is the product in the category of Java types and evaluatable expressions. `&&` is the product in the category of logical propositions. `void` is the product of nothing at all. Once you see the pattern, it's everywhere.
::

::Mcq
---
options:
    - "1. Projection extracts one component from a bundle"
    - "2. Construction assembles a bundle from individual components"
    - "3. The 0-product has a single, unnamed projection"
    - "4. For any candidate that can produce the components, there's exactly one way to convert it into the product"
correct: 3
---
#prompt
Which statement is **false** about the product structure?

#explanation
Option 3 is false — the 0-product has **no** projections at all. There's nothing to extract; it carries zero bits of information. Options 1, 2, and 4 are all true: projection extracts components, construction assembles them, and the universal property guarantees a unique conversion from any candidate.
::

## 1x00. The Record Type — Computer Scientists Built the Product

We've explored this idea from the mathematical side: a product is something you can **project** from and **construct** from its components. Two operations. A universal property. A pattern that shows up everywhere from coordinates to boolean logic.

Computer scientists looked at this exact pattern and asked: "how do we put it into a programming language?" The answer is the **record type** — what Java calls a **class**.

Every idea we just discovered maps directly to a Java feature. Projection? That's the dot operator. Construction? That's `new` plus field assignment. The universal property? That's why converting between related types is always forced — no design decisions, just fill in the fields.

::NoteBox
Different languages give it different names: `struct` in C, `record` in Pascal, `data class` in Python/Kotlin, `class` in Java. The names differ, but they're all implementing the same mathematical idea: a named product type with projections (field access) and construction (instantiation + field assignment).
::

### 1x01. The `class` Keyword and the Schema

A class declaration is like filling out a form that tells Java: "here is a new product type, and here are its components." Think of it as the **header row of a spreadsheet** — it defines the column names and types, but not the actual data rows.

::DefBox{id="Class Declaration BNF"}
```enbf
<class-decl> ::= "public"? "class" <name:TypeName> "{" (<field-decl>)* "}"
```

The `public` modifier (which we'll cover properly in a future lecture) makes the class visible to other files. The class name follows PascalCase. The body — inside `{ }` — contains zero or more field declarations.
::

The smallest possible class is an empty shell:

```java
public class Point {
    // empty — no fields yet
}
```

This compiles. It declares a new type `Point`. But it can't hold any data yet — it's a container with no compartments. Let's add the fields.

### 1x02. Fields — The Projections

Inside the class body, we declare fields exactly like we declare ordinary variables:

```java
public class Point {
    public double x;    // field declaration → this will be π₁
    public double y;    // field declaration → this will be π₂
}
```

Remember $\pi_1$ and $\pi_2$ from section 0x02? `p.x` is $\pi_1$ — it extracts the $x$ component from the product. `p.y` is $\pi_2$ — it extracts the $y$ component. Same idea, now with names instead of numbers.

::DefBox{id="Field Declaration BNF"}
```enbf
<field-decl> ::= "public"? <type> <name:varName> ";"
```

A field declaration inside a class looks identical to a variable declaration — but it lives inside the class body, not inside a method. This distinction matters: **fields belong to the object** and persist for the object's entire lifetime.

In the language of products: each field declaration defines a **projection**. `p.x` is $\pi_1$ — it extracts the `x` component from the product. `p.y` is $\pi_2$ — it extracts the `y` component.
::

::WarningBox
**Fields are declared, not assigned.** The class definition only establishes the **structure** — it says "every `Point` *has* an `x` and a `y`." It does not assign specific values. Think of the class as the empty form; the filled-in form is the object.

(Technically, Java allows field initializers like `public double x = 0.0;` — this sets a default value. But conceptually, the class is the blueprint, not the data. We'll return to constructors and proper initialization in a later lecture.)
::

### 1x03. Naming Conventions

Java has strong community conventions for names — not enforced by the compiler, but universally expected:

| Element | Convention | Example |
|:---|:---|:---|
| **Class name** | PascalCase (UpperCamelCase) | `Point`, `StudentRecord`, `BankAccount` |
| **Variable / Field name** | camelCase (lowerCamelCase) | `x`, `studentName`, `accountBalance` |
| **Method name** | camelCase | `computeDistance`, `getBalance` |

::NoteBox
These conventions are **not** enforced by the Java compiler. `class point` and `class POINT` both compile. But violating them makes your code unreadable to other Java programmers — and on the AP exam, you are expected to follow them. Every Java codebase you'll ever work in uses these conventions.
::

### 1x04. Braces and Indentation

Java uses curly braces `{ }` to delimit blocks — class bodies, method bodies, and control flow blocks all use them. The community has settled on a few brace styles:

**Style 1 — "Egyptian brackets" (the Java standard):**
```java
public class Point {
    public double x;
    public double y;
}
```

**Style 2 — "Allman style" (brace on its own line):**
```java
public class Point
{
    public double x;
    public double y;
}
```

**Style 3 — "GNU style" (indented braces, the evil one some C programmers use):**
```java
public class Point
    {
    public double x;
    public double y;
    }
```

This style indents the braces to the same level as the block body. It's the convention used in the GNU project and by some C programmers — but it is virtually **never** seen in Java. You'll mostly encounter it in legacy C codebases. Use it in Java and you'll get confused stares.

::NoteBox
The AP exam and virtually all professional Java codebases use **Style 1** (Egyptian brackets). Use one Tab for each level of indentation. The compiler doesn't care about alignment or brace placement — but humans do. Consistency within a file is what matters.
::

::McqMultiple
---
options:
    - "1. Class names use PascalCase, variables and methods use camelCase"
    - "2. Java enforces PascalCase for class names — `class mypoint` won't compile"
    - "3. Fields are declared inside the class body, similar to variable declarations"
    - "4. The AP exam expects a specific brace and indentation style"
correct: 
    - 1
    - 3
---
#prompt
Which of the following are true about Java class syntax and naming? (Select all that apply.)

#explanation
Option 1 is correct — PascalCase for classes, camelCase for variables/methods is the universal Java convention. Option 2 is false — Java does **not** enforce naming conventions; `class mypoint` compiles fine but is considered bad style. Option 3 is correct — field declarations look like variable declarations but live inside the class body. Option 4 is false — the AP exam expects any consistent style, not one specific style. However, Egyptian brackets (Style 1) are the de facto standard.
::

### 1x05. Creating Objects — The `new` Keyword

Declaring a class creates the blueprint. To actually get an object — a concrete instance with its own values — you use the `new` keyword:

::DefBox{id="Object Instantiation"}
```enbf
<instantiation-expr> ::= "new" <type:TypeName> "(" <args...> ")"
```

`new` allocates memory for a new object, initializes its fields, and returns a **reference** to that object. The reference is what you store in a variable.
::

```java
Point p = new Point();    // p now refers to a concrete Point object
```

After this line, `p` is a variable of type `Point`. It does not *contain* the object — it contains a **reference** (a pointer, an address) to where the object lives in memory. This distinction will become crucial when we discuss reference semantics, `null`, and aliasing — for now, you can think of `p` as "being" the Point.

### 1x06. The Dot Operator — Projection in Java

Once you have an object reference, you access its fields with the **dot operator** (`.`):

```java
Point p = new Point();
p.x = 3.0;      // inject into the x-component
p.y = 4.0;      // inject into the y-component
System.out.println(p.x);  // project out the x-component → 3.0
```

This is the moment where the abstract math becomes concrete. `p.x` is $\pi_1(p)$. `p.y` is $\pi_2(p)$. The dot is the projection operator — just with names instead of numbers.

::DefBox{id="Dot Operator = Named Projection"}
The dot operator `.` is the **named projection** for the product type defined by the class. For an object `obj` with a field `f`:

- **Read** (projection): `obj.f` evaluates to the current value stored in that field
- **Write** (injection): `obj.f = value` puts a value into that field

This is exactly the projection $\pi_i$ and construction that we defined mathematically. The only difference is that Java uses **names** (`x`, `y`) rather than **positions** (1st, 2nd). Named projections are more readable: `p.x` tells you what you're extracting; $\pi_1(p)$ requires you to remember what the first field was.
::

::ExampleBox
**IDCard.** Consider an identity card record:

```java
public class IDCard {
    public String name;
    public String idNumber;
    public String dateOfBirth;
}
```

Without classes, you'd need three separate variables per card — and keeping them associated is entirely up to you:

```java
// Three cards — nine variables, manually managed:
String name1 = "Alice";   String id1 = "A001";   String dob1 = "2005-03-14";
String name2 = "Bob";     String id2 = "B002";   String dob2 = "2006-07-22";
String name3 = "Carol";   String id3 = "C003";   String dob3 = "2005-11-09";
// Accidentally pair name1 with id2? Java won't stop you. The bug is silent.
```

With `IDCard`, the association is enforced by the type system:

```java
IDCard card1 = new IDCard();
card1.name = "Alice";
card1.idNumber = "A001";
card1.dateOfBirth = "2005-03-14";

IDCard card2 = new IDCard();
card2.name = "Bob";
card2.idNumber = "B002";
card2.dateOfBirth = "2006-07-22";
```

Three variables where there were nine. No way to mix up fields across cards. The structure is self-documenting.
::

::Mcq
---
options:
    - "1. `Point p;` — it declares a variable of type Point"
    - "2. `Point p = new Point();` — it allocates memory and returns a reference"
    - "3. `p.x = 5.0;` — it writes to the x-component of the product"
    - "4. `Point p = Point();` — the `new` keyword is optional in Java"
correct: 4
---
#prompt
Which of the following is **incorrect** about creating and using objects in Java?

#explanation
Option 4 is false — `new` is **mandatory** in Java for creating objects. `Point p = Point();` is a syntax error. The correct form is `Point p = new Point();`. The `new` keyword tells the JVM to allocate memory for a new object. Options 1–3 are all correct statements.
::

### 1x07. Access Modifiers — A First Look

You've seen `public` appear before field declarations and class declarations. We'll cover access modifiers in depth later, but for now:

::DefBox{id="public and private (Preview)"}
- **`public`**: The field/method/class is accessible from other files. For now, this is what we use.
- **`private`**: The field/method is only accessible within the same class. This is how we *encapsulate* data — we'll return to it.

For the current lecture, all fields are `public`. This is **not** good long-term practice (encapsulation is one of the pillars of OOP), but it lets us focus on the mechanics of classes and objects before layering on access control.
::

## 2x00. Methods — Giving Objects Behavior

### 2x01. Objects Are More Than Data Containers

So far, our classes are just **records** — passive bundles of data. You could achieve the same thing with carefully managed parallel arrays. But the real power of objects is that they can **do things**.

::ExampleBox
**The Bus analogy.** Consider a bus:

- **Attributes** (fields): fuel tank capacity, current fuel level, passenger capacity, current passenger count, license plate.
- **Behaviors** (methods): drive, refuel, open doors, board passengers.

A bus isn't just a collection of numbers — it's an entity that *acts*. If you modeled driving as "read the fuel level, subtract some amount, store the result back," you're treating the bus as passive data. That's fragile: every piece of code that drives the bus must remember to update the fuel level correctly. Instead, the bus should have a `drive(distance)` method that handles its own fuel consumption internally.

```java
// WITHOUT methods — the caller must know how to update fuel:
bus.fuelLevel = bus.fuelLevel - distance * bus.fuelConsumptionRate;
// What if someone forgets to do this? The bus magically drives forever.

// WITH methods — the bus manages its own state:
bus.drive(100);  // the bus updates its own fuelLevel internally, correctly, every time
```
::

::NoteBox
This is the seed of **Object-Oriented Programming** (OOP): data and the operations on that data travel together. The object is responsible for its own state. External code interacts with the object through its methods — not by reaching in and modifying fields directly.
::

### 2x02. Method Declaration Syntax

A **method** is a named block of code that belongs to a class. It takes input values (parameters) and optionally produces an output value (return value). Think of a method as a **machine**: you feed it raw materials (arguments), it performs work (the body), and it optionally produces a finished product (the return value).

::DefBox{id="Method Declaration BNF"}
```enbf
<method-decl> ::=
    "public"? <return-type> <name:methodName>
    "(" (<param-decl> ("," <param-decl>)*)? ")"
    "{" (<stmt>)* "}"

<return-type> ::= <type> | "void"
<param-decl>  ::= <type> <name:paramName>
```

Let's unpack this:
- **Return type**: The type of the value the method produces. If the method doesn't produce a value, the return type is `void`.
- **Method name**: Follows camelCase convention.
- **Parameters**: A comma-separated list of `(type name)` pairs. These are variables that will hold the input values when the method is called. If there are no inputs, the parentheses are empty.
- **Body**: The `{ }` block containing the statements to execute. **Even a single-statement body must be wrapped in braces** — unlike `if`, where braces are optional for single statements, Java requires braces around every method body.
::

::ExampleBox
Here's a complete class with a method:

```java
public class Collatz {
    // Method: apply one step of the Collatz (hailstone) conjecture
    public int next(int n) {
        if (n % 2 == 0) {
            return n / 2;
        } else {
            return 3 * n + 1;
        }
    }
}
```

Breakdown:
- **Return type**: `int` — the method produces an integer result
- **Method name**: `next` (camelCase)
- **Parameter**: `int n` — one input, of type `int`, whose local name within the method is `n`
- **Body**: two `return` statements, each guarded by an `if`/`else` branch

Once a method receives concrete arguments, the call expression evaluates to the return value — it behaves exactly like a value of the return type:

```java
Collatz c = new Collatz();
int x = c.next(6);     // c.next(6) evaluates to 3 — you can assign it
int y = c.next(7);     // c.next(7) evaluates to 22
int z = c.next(3) + 5; // 10 + 5 = 15 — you can use it in arithmetic
```
::

### 2x03. The `return` Statement

::DefBox{id="return Statement"}
```enbf
<return-stmt> ::= "return" <expr> ";"
```

`return` does two things simultaneously:
1. It **evaluates** the expression to a value
2. It **terminates** the method immediately — no code after `return` in the same execution path will run

The type of the expression **must** match the method's declared return type (or be assignable to it via type coercion — e.g., returning an `int` from a `double` method is fine via widening).
::

::ExampleBox
```java
public int signum(double x) {
    if (x > 0) {
        return 1;       // path 1: x is positive → return 1 and exit
    }
    if (x < 0) {
        return -1;      // path 2: x is negative → return -1 and exit
    }
    return 0;           // path 3: x is zero → return 0 and exit
}
```

The `signum` method has three distinct return paths, each reached under different conditions. When any `return` executes, the method ends — the remaining statements are skipped.
::

### 2x04. All Execution Paths Must Return a Value

This is the rule that trips up beginners the most. The Java compiler enforces a strict requirement:

::DefBox{id="Definite Return Rule"}
For a method with a non-`void` return type, **every possible execution path** must end in a `return` statement that produces a value of the correct type. If the compiler can find *any* path that reaches the end of the method without hitting a `return`, it refuses to compile.
::

::WarningBox
**The compiler is conservative — it does not reason about logical exhaustiveness.** Consider this:

```java
// DOES NOT COMPILE
public int collatzNext(int n) {
    if (n % 2 == 0) {
        return n / 2;
    }
    if (n % 2 == 1) {
        return 3 * n + 1;
    }
    // Compiler error: "missing return statement"
}
```

You and I know that `n % 2` can only be `0` or `1` — every integer is either even or odd. The two `if` conditions *logically* cover all possibilities. But the Java compiler doesn't perform this reasoning. It sees two separate `if` statements (not an `if`/`else` chain) and asks: "what if both conditions are false?" Even though that's mathematically impossible, the compiler doesn't know that — and it refuses to compile.
::

::ExampleBox
**How to satisfy the compiler.** There are several ways to fix this:

**Fix 1 — Use `if`/`else` (the compiler recognizes this pattern):**
```java
public int collatzNext(int n) {
    if (n % 2 == 0) {
        return n / 2;
    } else {
        return 3 * n + 1;
    }
}
```
The compiler sees `if ... else` and knows exactly one branch will execute — both contain `return`, so all paths are covered. ✓

**Fix 2 — Add a "dead code" return (when you need logical clarity):**
```java
public int collatzNext(int n) {
    if (n % 2 == 0) {
        return n / 2;
    }
    if (n % 2 == 1) {
        return 3 * n + 1;
    }
    return -1;  // logically unreachable — but it satisfies the compiler
}
```
This is sometimes used when keeping the conditions as separate `if` blocks improves readability. The compiler doesn't care that the final `return` is logically unreachable — it only cares that a `return` *exists* at the method level. ✓

**Fix 3 — Restructure as `else if`:**
```java
public int collatzNext(int n) {
    if (n % 2 == 0) {
        return n / 2;
    } else if (n % 2 == 1) {
        return 3 * n + 1;
    }
    return -1;  // still needed — else-if chain needs a terminal return
}
```
::

::Mcq
---
options:
    - "1. Every `if` has a corresponding `else` with a `return`"
    - "2. An unconditional `return` (or `throw`) appears after the conditional logic"
    - "3. The method ends with a `return` statement on the last line"
    - "4. The method declares `void` as its return type and has no `return` statement at all"
correct: 4
---
#prompt
Which of the following does **NOT** guarantee that a non-void method satisfies the definite return rule?

#explanation
Option 4 is the incorrect choice — `void` means the method produces no value, so it's a fundamentally different category. A non-void method can't declare `void`. Options 1, 2, and 3 all describe valid patterns that satisfy the compiler: `if`/`else` with returns in both branches (option 1), a fallback return after conditionals (option 2), or a return as the last line when all prior branches also return (option 3).
::

### 2x05. The Halting Problem — Why the Compiler Is Conservative

The compiler's refusal to analyze logical exhaustiveness isn't laziness — it's grounded in a fundamental result in computer science:

::DefBox{id="Halting Problem (Informal)"}
The **halting problem**, proved by Alan Turing in 1936, states that there is **no general algorithm** that can determine, for every possible program and input, whether that program will eventually halt (finish) or run forever. More broadly: it is **impossible** to write a program that perfectly decides, in all cases, whether an arbitrary piece of code will reach a particular state.
::

::Folding{title="Proof by diagonalization"}
Assume, for contradiction, that a method `halts` exists:

```java
// Returns true if program(p) eventually halts when given input(i)
public boolean halts(String program, String input);
```

We define a second program `trouble` that calls `halts`:

```java
public void trouble(String p) {
    if (halts(p, p)) {
        while (true) { }     // loop forever if halts says "yes"
    } else {
        return;               // halt immediately if halts says "no"
    }
}
```

Now ask: does `trouble("trouble")` halt?

- If `halts("trouble", "trouble")` returns `true` → `trouble` enters the infinite loop → it does **not** halt. Contradiction.
- If `halts("trouble", "trouble")` returns `false` → `trouble` returns immediately → it **does** halt. Contradiction.

Both possible answers lead to a contradiction. The only way out is that `halts` cannot exist in the first place. **No algorithm can decide whether an arbitrary program halts.**

For the compiler: if it tries to decide "does every execution path reach a `return`?", the `trouble` construction shows that a malicious program could feed the compiler a self-referential case that forces contradictory behavior. Rather than shipping a compiler that might be wrong (undefined behavior), Java accepts the theoretical limit and rejects code it cannot *mechanically prove* correct.
::

Applied to our compiler: determining whether a set of conditional branches covers all possible inputs is equivalent to determining whether the code after the branches is reachable. Since this is provably undecidable in the general case, Java takes the conservative approach:

> **"If I'm not certain every path returns, reject the program."**

This is a deliberate design choice. C and C++ take the opposite approach — they let you compile anyway, and if an execution path slips past without a return, the behavior is **undefined** (the program might crash, return garbage data, or appear to work until it doesn't). Java's philosophy: better a compile-time error than a runtime nightmare.

::NoteBox
The practical takeaway: when the compiler complains about a missing return, don't argue with it. Add the return — either by restructuring into `if`/`else`, or by adding a fallback `return` after your conditional logic. The compiler isn't questioning your logic; it's enforcing a rule that keeps Java programs safe from a provably unsolvable problem.
::

### 2x06. `void` Methods — The 0-Product in Action

Recall from Section 0x06: the **0-product** is a type with no projections — it carries zero bits of information. In Java, this is `void`. Methods returning `void` produce no value; they exist purely for their **side effects** — printing output, modifying state, sending data over a network.

::DefBox{id="void Method"}
A method declared with return type `void` produces no value. It executes its body statements for their side effects and implicitly returns when execution reaches the closing `}`. No explicit `return` statement is required (though `return;` — with no expression — can be used to exit early).
::

```java
public class Greeter {
    public void sayHello(String name) {
        System.out.println("Hello, " + name + "!");
        // No return statement needed — the method implicitly returns here
    }

    public void maybeGreet(String name, boolean shouldGreet) {
        if (!shouldGreet) {
            return;     // early exit — return to caller immediately
        }
        System.out.println("Hello, " + name + "!");
        // implicit return here
    }
}
```

::WarningBox
You cannot use the result of a `void` method call:

```java
Greeter g = new Greeter();
int x = g.sayHello("Alice");   // COMPILE ERROR: void method has no return value
System.out.println(g.sayHello("Alice")); // COMPILE ERROR: nothing to print
```

A `void` method call is a **statement**, not an expression. It stands alone — you can't assign it, pass it, or operate on it. This is the 0-product manifesting in Java's type system: there's nothing to extract, so there's nothing to use.
::

::Mcq
---
options:
    - "1. It must contain at least one `return;` statement"
    - "2. It cannot be used in an expression (e.g., assigned to a variable)"
    - "3. It executes its body and implicitly returns at the closing `}`"
    - "4. `return;` (no expression) can be used to exit early"
correct: 1
---
#prompt
Which of the following is **false** about `void` methods in Java?

#explanation
Option 1 is false — a `void` method does **not** need a `return;` statement. When execution reaches the closing `}`, the method returns implicitly. `return;` is optional and only used for early exit. Options 2, 3, and 4 are all correct statements about `void` methods.
::

## 3x00. Putting It Together — A Worked Example

Let's build a complete example that ties together everything from this lecture: the product (class with fields), the projections (dot operator), and methods (behavior).

::ExampleBox
**BankAccount.** A bank account is a product of `String` and `double` — owner and balance — with methods for deposits and withdrawals:

```java
public class BankAccount {
    public String owner;    // π₁ — project the owner
    public double balance;  // π₂ — project the balance

    // Deposit money into the account (side effect: modifies balance)
    public void deposit(double amount) {
        balance = balance + amount;
        System.out.println(owner + " deposited $" + amount + ". New balance: $" + balance);
    }

    // Withdraw money — returns true if successful, false if insufficient funds
    public boolean withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Insufficient funds. Balance: $" + balance);
            return false;
        } else {
            balance = balance - amount;
            System.out.println(owner + " withdrew $" + amount + ". New balance: $" + balance);
            return true;
        }
    }

    // Print current balance (the 0-product — produces no value)
    public void printBalance() {
        System.out.println(owner + "'s balance: $" + balance);
    }
}
```

Usage:

```java
BankAccount acct = new BankAccount();
acct.owner = "Alice";       // inject into the owner component
acct.balance = 1000.0;      // inject into the balance component

acct.printBalance();          // Alice's balance: $1000.0
acct.deposit(500.0);          // Alice deposited $500.0. New balance: $1500.0

boolean success = acct.withdraw(2000.0);
// Prints: Insufficient funds. Balance: $1500.0
// success = false

acct.withdraw(300.0);
// Prints: Alice withdrew $300.0. New balance: $1200.0
```

Points to notice:
- **Fields** (`owner`, `balance`) define the product `String × double` — they're the projections
- **`void` methods** (`deposit`, `printBalance`) are the 0-product — actions without return values
- **`boolean` method** (`withdraw`) performs an action *and* reports success/failure
- Every non-void method covers all return paths (`if`/`else` both have `return`)
- The object manages its own state — `deposit` and `withdraw` update `balance` internally
::

::McqMultiple
---
options:
    - "1. `deposit` updates `balance` and returns the new balance"
    - "2. `withdraw` returns `true` on success and `false` on failure"
    - "3. `printBalance` has a `void` return type and prints to the console"
    - "4. `withdraw` is missing a return path — the compiler would reject it"
correct:
    - 2
    - 3
---
#prompt
Which statements about the `BankAccount` class are true? (Select all that apply.)

#explanation
Option 1 is false — `deposit` is declared `void` and does not return any value; it only prints. Option 2 is true — `withdraw` returns `true` when sufficient funds exist and `false` otherwise. Option 3 is true — `printBalance` is `void` and prints via `System.out.println`. Option 4 is false — `withdraw` has an `if`/`else` where both branches contain `return` statements; the compiler recognizes this as covering all paths.
::

---
::NoteBox
**Cognitive Anchor**

- **Product**: A mathematical structure defined by projections and a universal construction property. The "bundle of variables" is a product. The class is the programmer's implementation of a product.
- **Projection**: Extracts one component from a product, discarding the rest. In Java: the dot operator (`p.x`, `p.y`). Named projection — uses names rather than positions.
- **Construction**: Assembles a product from its components. In Java: `new` + field assignment.
- **Universal property**: For any candidate that can produce the components, there's exactly one way to convert it into the product. This is why `makePoint` from `PolarPoint` has no design decisions — it's forced.
- **`&&` as product**: Logical AND is a product in the category of propositions. Projections: from $A \land B$, conclude $A$ (or $B$). Construction: from $C \to A$ and $C \to B$, construct $C \to A \land B$ via `f(c) && g(c)`.
- **n-product**: A product with $n$ components. A class with $n$ fields defines an $n$-ary product.
- **0-product** (`void`): The product of zero things. No projections, carries zero information. Can be constructed from anything. `void` methods produce nothing — only side effects.
- **Class**: A user-defined type that bundles fields (product components) and methods (behavior). PascalCase naming. Defined with `public class Name { ... }`.
- **Field**: A variable inside a class body. Defines one component (projection) of the product. camelCase naming.
- **Object (instance)**: A concrete realization of a class, created with `new`. Has its own copy of every field.
- **`new` keyword**: Allocates memory and returns a reference. Required for object creation.
- **Method**: A named block of code belonging to a class. Takes parameters, optionally returns a value. Body **must** use braces.
- **`return` statement**: Evaluates an expression and immediately exits. Every non-void path must hit a `return`.
- **Definite return rule**: Every execution path in a non-void method must end in `return`. The compiler is conservative — it rejects code it can't *prove* covers all paths.
- **Halting problem**: The theoretical reason for the compiler's conservatism. No general algorithm can decide reachability.
- **OOP principle**: Objects manage their own state. External code interacts through methods.
- **Access modifiers** (`public`, `private`): Control visibility. Using `public` for now; encapsulation later.

Next lecture will cover encapsulation, constructors, and the `this` keyword — how to properly initialize objects and protect their internal state.

::

## Glossary

New terms introduced in this lecture. For terms from Lectures 1–4 (bit, byte, stack, heap, Oxford bracket, type casting, boolean, De Morgan's laws, scope, sequencing, branching, loops, etc.), see the previous articles' glossaries.

| Term | Everyday / Literal Meaning | What It Means in CS |
|:---|:---|:---|
| **0-Product** (0元积) | Product of nothing | A product with zero components — the unit type, `void` in Java. Carries zero bits of information. Can be constructed from anything; has no projections. |
| **Attribute** (属性) | A quality or feature | See **Field**. |
| **Category Theory** (范畴论) | — | A branch of mathematics that defines objects by their relationships (morphisms) to other objects, rather than by internal structure. The product is one of its fundamental constructions. |
| **Class** (类) | A category or group | A user-defined type that serves as an implementation of a product type — bundles fields (projections) and methods (behavior). PascalCase naming. |
| **Construction** (构造) | Building something | Assembling a product from its individual components. In Java: `new` + field assignment. The inverse of projection. |
| **Dot Operator** (点运算符) | A punctuation dot | Named projection — extracts or injects a named component of a product. `p.x` reads the x-component; `p.x = 5.0` writes to it. |
| **Field** (字段/属性) | An area of land | A variable declared inside a class body. Defines one component (projection) of the product. Every instance gets its own copy. |
| **Halting Problem** (停机问题) | — | A fundamental result (Turing, 1936): no general algorithm can determine whether an arbitrary program halts. This is why Java's compiler conservatively rejects code with unprovable return paths. |
| **Instance** (实例) | A concrete example | A specific object created from a class blueprint with `new`. Each instance has its own copy of every field. |
| **Mediating Morphism** (中介态射) | A bridge between things | The unique arrow $\langle f, g \rangle : C \to P$ guaranteed by the universal property. In Java: the block of code that constructs a product from any candidate. |
| **Method** (方法) | A way of doing something | A named block of code belonging to a class. Takes input parameters, optionally returns a value. Body must be wrapped in `{ }` even for single statements. |
| **`new` Keyword** (new关键字) | Recently created | Allocates memory for a new object and returns a reference to it. Required for object instantiation in Java. |
| **Naming Convention** (命名规范) | Agreed-upon rules for names | PascalCase for class names, camelCase for variables, fields, and methods. Not compiler-enforced but universally expected. |
| **Object** (对象) | A thing you can see/touch | A concrete instance of a class, created with `new`. Has its own state (field values) and can perform behaviors (methods). |
| **Parameter** (参数) | A defining characteristic | A variable declared in a method's parentheses that receives a value when the method is called. `(int n, String name)`. |
| **Product (Binary)** (二元积) | Result of multiplication | An object $P$ with projections $\pi_1, \pi_2$ such that any candidate $C$ with morphisms to the components factors uniquely through $P$. Classes, `&&`, and Cartesian products are all binary products in different categories. |
| **Projection** (投影) | Casting light onto a surface | A morphism that extracts one component from a product and discards the rest. In Java: `obj.field`. In logic: "from $A \land B$, conclude $A$." |
| **Record Type** (记录类型) | A documented entry | The CS term for a product type with named fields. Called `struct` in C, `record` in Pascal, `class` in Java. |
| **Reference** (引用) | A mention or pointer | The value returned by `new` — it points to the object's location in memory. Variables of class type hold references, not the objects themselves. |
| **`return` Statement** (return语句) | To go or come back | Terminates a method and (for non-void methods) produces a value. Every execution path in a non-void method must reach a `return`. |
| **Universal Property** (泛性质) | A property that applies to everything | The defining characteristic of a product: for *any* candidate, there exists a *unique* mediating morphism. This, not the internal structure, is what makes something a product. |
| **`void`** (空) | Empty, containing nothing | The 0-product — a return type indicating the method produces no value. Carries zero bits of information. `void` calls are statements, not expressions. |

::LinkCard
---
url: "http://online-java.com"
title: "Online Java — Browser-Based Java REPL"
details: "Experiment with defining your own classes and methods. Try creating a Point class, instantiating several points, and manipulating their fields with the dot operator. Write a method with multiple return paths and deliberately remove one — observe the compiler error."
---
::
