---
title: AP Computer Science - A Crash Course
description: A concise review guide for AP Computer Science A, covering key concepts, common pitfalls, and exam strategies. 
createTime: 2026-04-11
updateTime: 2026-04-11
---


::WarningBox
To be fair, this guide does not cover everything from APCSA. I didn't cover datasets, ethics, or wrapper classes. I only picked out what I assumed to be the sections that require emphasis during review. 

**IF YOU WOULD LIKE ME TO ELABORATE ON ANY SECTION ON THE EXAM THAT I DIDN'T, SCROLL TO THE BOTTOM AND LEAVE A COMMENT TO LET ME KNOW.**
::


::QuoteBox{source="Edsger W. Dijkstra"}
Computer science is no more about computers than astronomy is about telescopes.
::

::NoteBox
Cheat sheets (logic laws, Reference Sheet, etc..) see [Appendix ->](#appendix-cheatsheets).

I wont recommend reading this on a mobile device because you definitely will need the table of contents for navigation.
::

AP Computer Science A can feel overwhelming with its blend of object-oriented programming, data structures, and algorithm analysis. This crash course distills the essential concepts and common pitfalls to help you review efficiently before the exam. Whether you're brushing up on inheritance hierarchies, tracing recursive methods, or decoding GridWorld legacy questions, this guide aims to clarify the key ideas you'll need to succeed.

> OK That intro was written by claude. But you get the idea.

Here's the syllabus for the entire course:

::LinkCard
---
url: "https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-and-exam-description.pdf"
title: "AP® Computer Science A | COURSE AND EXAM DESCRIPTION"
details: "Thousands of Advanced Placement teachers have contributed to the principles articulated here. These principles are not new; they are, rather, a reminder of how AP already works in classrooms nationwide. The following principles are designed to ensure that teachers’ expertise is respected, required course content is understood, and that students are academically challenged and free to make up their own minds."
image: "CB.webp"
---
::

But I reckon no one would like to review using this. So I wrote this entry, where I put together everything I consider worth reviewing -- or rather, what could help you most efficiently get a 5* in a weekend's time.

## 0x00. Foundations: Compiler, Programming, and Algorithms

### 0x01. Compilers
::DefBox{id="Compiler"}
Something that turns your code into what machine can read called a **binary**.
::

::HintBox
This is not in the AP subset but worth knowing.
::DefBox{id="Interpreter"}
Something that reads your code and runs it. In a sense, languages that do not compile to a binary can only be run by an interpreter because the CPU simply doesn't read the code you write directly.
::
The Java compiler is a special compiler. It compiles code into **JVM Machine Code**, which is then read and executed by a *virtual* computer called the JVM (Java Virtual Machine). In a sense, `javac` is a translator that converts code into a format that the JVM can interpret.
::

A language's syntax is what you write out. It is formally known as the **concrete syntax**.

::NoteBox
Think of concrete syntax like English grammar rules. Grammar tells you if you're speaking *correct* English (e.g., "I am going to store" vs. "Store to going am I"), but it doesn't tell you if what you're saying makes *sense* (e.g., "Colorless green ideas sleep furiously" is grammatically correct but meaningless).

Similarly, a Java compiler checking syntax only verifies that your code follows the language's structural rules. The absence of a `SyntaxError` means your code is *grammatically* correct Java, but it doesn't guarantee that your program is:
- **Correct** (does what you intended)
- **Safe** (free of runtime errors like `NullPointerException`)
- **Compilable** (other errors like type mismatches may still occur)
- **Logical** (the algorithm might still be wrong)

Syntax checking is just the first layer of validation -- it ensures you're speaking Java's "grammar" correctly, not that you're saying something sensible.

[Click here for a cheatsheet of other exceptions in APCSA](#exceptions) in the appendix.
::

::Mcq
---
options:
    - "1. A program that translates Java code into machine-readable binary"
    - "2. A program that checks if code follows Java's grammatical rules"
    - "3. A program that ensures code is logically correct and free of runtime errors"
    - "4. A program that optimizes code for better performance"
correct: 2
---

#prompt
What is the primary function of a Java compiler's syntax checking phase?

#explanation
Syntax checking only verifies that code follows Java's grammatical rules (concrete syntax), similar to checking if a sentence follows English grammar. It does not guarantee logical correctness, absence of runtime errors, or code optimization. The compiler ensures the code is structurally valid Java, but meaningful and correct program behavior requires additional validation.
::



### 0x02. Variables, Types, and Scopes

A common point of confusion is the placement of Scope and Access. The AP curriculum places it under Class Creation (Unit 3), but in this guide, it is covered alongside Variables and Types -- which reflects how the concept is actually classified in theoretical computer science research.

::DefBox{id="Variable"}
A label to a container that holds a value.
::

::DefBox{id="Contents"}
A label to a container that guarantees non-mutability. In java, this is denoted by the keyword `final`.

```java
final int a = 10;
a = 1; //  error: cannot assign a value to final variable a
```
::

::DefBox{id="Type"}
A collection of variables that contain similar values.
::

::DefBox{id="Scope"}
A context / environment that labels variables to container of values.
::

In Java, a scope is created wherever you see a pair of curly braces `{}`. If a scope is nested inside another scope (inner braces inside outer braces), then the inner scope **inherits** access to all variables from the outer scope.

A nice way to visualize this is to draw a stack of variables. Whenever you look down you see everything you've defined, and whenever you look up you see where you're going into. This sounds pretty abstract.

::DefBox{id="Stack"}
A data structure where the last object goes in comes out first. Think of it as a pile of files where you always put things on top and take things on top, or an elevator where the people nearest to the doors are always the ones coming in last but they always get to go out first.

**BEWARE** This is not the same *stack* we're talking about in the computer memory.
::

Take this example below (you can take out a draft paper and follow the steps below)

```java
int x = 5;

void main() {
    System.out.println(x);  // 5
    if (x > 0) {
        String x = "hello";
        System.out.println(x);  // hello
    }
    System.out.println(x);  // 5
}
```

The outermost scope declares the variable `x` as an `int` with value `5`. To denote this in our stack, simply push the declaration onto it.

:Pic{src="stack-1.webp" alt="This top-level scope colored red is also known as the global context."}

By going into the `void main()` declaration, we dive into one left brace. Therefore we descend into a new scope that inherits everything in the parent scope. I denote this by filling everything above with the color corresponding with the scope. You can write this on paper with a line that separates the stack's outer and inner section, but it's just a visual representation and totally up to you.

Here we enter a request to find what `x` stands for. To do this, we trace from the top to the bottom for the first occurrence of `x`. In this case, there is only one declaration entry on the stack, so it's pretty trivial.

> Setting the value of a variable is also known as "mutating" the variable. In our case, the procedure for mutating a variable is similar to looking up a value: we scan from the top to the bottom and mutate the first occurrence we find.

:Pic{src="stack-2.webp" alt="This should print 5."}

I'll omit the steps for the `x > 0` expression, but it's similar. We go into the new scope formed by the `if` statement:

:Pic{src="stack-3.webp" alt="Third scope! Note that I kept a sliver of blue in between the two declarations just to remind you that there exists a layer of scope sandwiched between them."}

Note that something interesting happens here: we declared a new variable named `x`. Note that now we have two declarations of `x` on our stack. This might not seem like much, but see what happens when we reach the next line:

:Pic{src="stack-4.webp" alt="This should print 'hello'."}

When we carry out our previous procedure of scanning from the top to the bottom, we first encountered the `string` declaration. Therefore, that is what we print. This overriding of previous declarations is called **shadowing**, and is generally discouraged by a doctrine called the **Barendregt Convention** (Even though AP does ask you to analyze those weird listings).

::HintBox
The Barendregt Convention is not something that you'll get tested on in the APCSA exam, but its considered good style and will ensure you write good code in FRQs. Simply put, just **DON'T DECLARE DIFFERENT VARIABLES WITH THE SAME NAME**.
::

Now we leave the inner context. To denote this in our stack, just simply throw away everything we declared in this stack.

:Pic{src="stack-5.webp" alt="In our example, the yellow scope only contains one variable. But if you declared multiple variables you should ditch all of them too."}

Now we see another `println` statement that queries for `x`. We scan from top to bottom; since now the `x` declaration that shadows our first declaration is gone, we see the original `x`:

:Pic{src="stack-6.webp" alt="This should print 5."}

An exercise for you: walk through this code example from below

```java
public class Box {
    private int size;

    public Box(int size) {
        size = size;
    }

    public int getSize() {
        return size;
    }
}
```

What does this print?
```java
System.out.println(new Box(5).getSize());
```

::Folding{title="Answer"}
Let's walk through the call. First of all, the constructor is called. Before calling the constructor, we can think of the class itself as being a scope and declaring two variables that you can access using or not the `this.` specifier.

:Pic{src="stack-7.webp" alt="Class as a scope. Here, im using ? instead of 0 because it better signifies the fact that the instance variable is not yet defined."}

Next up we went into the constructor. Remember: function parameters are also variable definitions that carries the value of the passed param.

:Pic{src="stack-8.webp" alt="We called new Box(5), so the parameter size is 5"}

Notice that here, the parameter name `size` shadows one variable that accesses the real instance variable. Therefore, this variable mutation actually mutates the local variables `size` instead of the instance variables.

:Pic{src="stack-9.webp" alt="Shadowing effects mutation"}

::NoteBox
The correct constructor should be
```java
public Box(int size) {
    this.size = size;
}
```
::

After getting out of the constructor scope and into the getter scope, this becomes even more clear:

:Pic{src="stack-10.webp" alt="The instance variables are not touched at all"}

Therefore, this call to the `getSize()` getter yields `0`.

:Pic{src="stack-11.webp" alt="Entering getSize sub-scope, which actually is the same as the class scope."}
:Pic{src="stack-12.webp" alt="The default value for int is 0, so the method returns 0."}
::

::Mcq
---
options:
    - "1. The constructor parameter `size` shadows the instance variable `size`"
    - "2. The instance variable `size` is initialized to 0 by default"
    - "3. The constructor doesn't assign a value to the instance variable `size`"
    - "4. All of the above"
correct: 4
---

#prompt
Consider the following `Box` class constructor:
```java
public class Box {
    private int size;

    public Box(int size) {
        size = size;  // This line has an issue
    }

    public int getSize() {
        return size;
    }
}
```
Why does `new Box(5).getSize()` return 0 instead of 5?

#explanation
All three statements are correct: (1) The parameter `size` shadows the instance variable `size`, so `size = size` assigns the parameter to itself, not to the instance variable. (2) Instance variables of type `int` are initialized to 0 by default. (3) The constructor never assigns a value to the instance variable `size`, leaving it at its default value of 0.
::



### 0x03. Type Coercion, Type Promotion, and Others

> Maybe later I'll write a blog entry on actual dependent type theory. Here's an [entry from my last blog](https://makabaka1880.xyz/CS/theoretical/type-theory/type-systems/strong-and-weak-systems.html) on the basics of type systems, but its still quite basic.

Java is a strongly typed language. This meant that the declaration of variables destinates the variable's type; in fact, Java declares variables exactly by preceding a type name before an identifier.

```java
int a = 0;
a += 1; // OK, a = 1
a = "Hello"; // incompatible types: java.lang.String cannot be converted to int
```

Let's take a closer look at the error message. Java didn't say "a is an int and you can't assign String", but rather "String cannot be converted to int". This is because whenever Java encounters a value that is expected to be a type but isn't, it does something known as an "implicit cast", or a "type coercion".

```java
int a = 0;
double b = 1.0;
a += b;
```

Under the hood, b is casted into `int`. Here's an other example:

```java
double b = 1;
```

On the right hand side is a *literal*. This is just a shorthand for a constant value that appears directly in the source code without requiring any computation or memory lookup. This literal is of type `int`, and here it is implicitly cast to `double`. This is a special case of type casting known as **type promotion / lifting**, where the value is of a type that is a subset of the target type. For example, `int` is a subset of `double`. Mathematically, this can be seen as the guarantee that the cast is a total function over its domain — every possible `int` value maps to a valid `double` value, so no information is ever lost.

> In computer science, a literal is also known as a **right-hand value** (or **rvalue**). This is not in APCSA, but just so you know.

There are also something known as an **explicit cast**. This is where you explicitly tell java to convert a type to another. For example, casting from `double` to `int` requires an explicit expression:

```java
double b = 2.0;
int a = b; // incompatible types: possible lossy conversion from double to int
int a = (int) b; // OK, a = 2
```

Mathematically, any cast thats not an injection requires an explicit cast. Here, multiple `double`s could cast to the same `int`:
```java
(int) 2.0 == (int) 2.5 // true
```

Specifically, casting `double` to `int` takes the floor of the double. Therefore, you should do `(int) (x + 0.5)` to round the integer.

> The explicit case is the most cohesive operators in java. This meant that it is the operator of most precedence. So don't forget to add the parenthesis in those random number generation problems:
> ``` java
> (int) (Math.random() * 5) // ✅ Uniform({0, 1, 2, 3, 4})
> (int) Math.random() * 5 // ❌ Uniform([0, 1]) always casts to 0, so this always generates 0 * 5 = 0.
> ```

So just remember:

> Promoting (`int -> double`) can be implicit
> 
> Narrowing (`double -> int`) needs explicit casting

Another import thing to remember is adding anything with a string is considered a promotion, because basically anything that has implemented `toString` can be represented by a string. So `a + any string` results in a string.

[Click here for a cheatsheet](#expression-types) for the type of common arithmetic expressions in the appendix.

::Mcq
---
options:
    - "1. `int x = 5.0;`"
    - "2. `double y = 5;`"
    - "3. `int z = (int) 5.7;`"
    - "4. `double w = 3 + 2.5;`"
correct: 1
---

#prompt
Which of the following Java statements will cause a compilation error due to type mismatch?

#explanation
Statement 1 (`int x = 5.0;`) requires explicit casting because it involves narrowing from `double` to `int`. Java requires explicit casting for narrowing conversions. Statements 2 and 4 involve promotion (`int` to `double`), which is implicit. Statement 3 uses explicit casting, which is correct for narrowing.
::


### 0x04. Object and Reference
There are two main ways of passing information: pass by value and pass by reference. To understand what actually happens when those two passing methods are invoked, we first need to understand the von-neumann computer archeticture.

The computer memory is a continuum of cells that could each store data of a fixed size. The easiest way to store data here is by using a stack (yep the same data structure we talked about before):

:Pic{src="stack-13.webp" alt="In fact, this section of memory is known as 'The Stack'."}

The only problem with this is that the data we store must have a fixed size. For example, it is not practical to store a list of data in the stack since we need to guaranteed a contiguous non-terminating vacuum of space for the list to dwell in, erasing any possibility of storing other data. Therefore, computer engineerers invented **The Heap**. The heap also lives in the stack, but deep inside it, and does not following the strict last-in-first-out rules of a stack. The operating system gives a full access to a segment of the stack to administrative algorithms called *memory allocators*, and their job is to do allocation.

::DefBox{id="Malloc"}
Short for memory allocation, is the action of searching through the heap until the allocater finds a big enough continuous space to store data.
::

The problem with this approach is that it is pretty hard to pass values. The difference between the stack and the heap is like a tent camping site and an apartment building; one is an organized aggregation of small units, and the other a chaotic soup of variadic-sized data. It's pretty easy to bring a tent around (pass-by-value), but not an apartment room. But what you can do is memorize your department address and bring your key whereever with you. This way, even though you are not physically carrying the building around, you still possess enough information to make the apartment accessable indirectly.

Similarly, Java uses the address of where the data is stored in the heap. Variables that store these addresses are known as **references**. However, when you pass a reference to a method, Java doesn't actually "pass-by-reference" in the traditional sense. Instead, it takes the value of the address and copies it into the new local variable. In this sense, Java is strictly pass-by-value: you aren't passing the apartment itself, or even the original key, but a photocopy of the key's bit pattern.

In Java, memory allocation is marked by the usage of the keyword `new`. Whenever you use `new`, Java takes the value on the right hand side and extracts its address. Whenever you see a variable declared with or mutate to a value constructed using `new`, it means the variable is a reference to something that has just been created on the heap.

::NoteBox
The most important fact to remember is that the variable that contains the address and the object behind the address is not coupled. If you update the variable to another object, the original object don't just get replaced by the new object -- its only that the reference is pointing to a new object. Under the apartment analogy, if someone replaces your key with a new one, your apartment dont just get wiped off the map and gets replaced by the new one; its just that you're holding a new key.
::

In Java, **ANY VARIABLE OF OBJECT TYPE IS A REFERENCE.** Any `String`, any `ArrayList`, any variable of any type thats defined by a class is a reference.

::HintBox
If you are not sure, see if an inhabitant of the type could be `null`. If it is, then it is an object type. Also, any type that can call a method on it (ex, `ArrayList`'s `size()`) is an object type.
::

To make sense of how reference types work, you can create a similar stack to the ones we used in [the previous section](#_0x02-variables-types-and-scopes), but instead of writing declarations in each box, draw an arrow out to point seperate entities that represents object in the heap.

Let's see a concrete example in how reference passing works.

::Mcq
---
options:
    - 1. `5 5`
    - 2. `10 5`
    - 3. `10 20`
    - 4. `5 20`
correct: 2
---
#prompt
Consider the following classes.
```java
public class Thing {
    private int value;

    public Thing(int v) {
        value = v;
    }

    public void setVal(int v) {
        value = v;
    }

    public int getVal() {
        return value;
    }
}

public class Test {
    public static void modify(Thing obj1, Thing obj2) {
        obj1.setVal(10);
        obj2 = new Thing(20);
    }

    public static void main(String[] args) {
        Thing a = new Thing(5);
        Thing b = new Thing(5);
        modify(a, b);
        System.out.println(a.getVal() + " " + b.getVal());
    }
}
```
What will be printed when the `main` method is executed?

#explanation
See following content.
::
Let's track down the execution line by line (here no shadowing occurs, so instead of maintaining a whole stack of declarations I will directly write the identifiers next to the object for clarity.)

:Pic{src="heap-1.webp" alt="Initially"}

At first, `a` and `b` each binds to an address of their objects

:Pic{src="heap-2.webp" alt="Passing the params"}

But then, they are passed as parameters into the method modify. This introduced two different variables, and at the same time, mutated the object behind `a` and `obj1`'s reference.

:Pic{src="heap-3.webp" alt="More scoping"}

This line, `obj2` is binded to a new instance of `Thing`. 

:Pic{src="heap-4.webp" alt="Return to main scope"}

Notice that we are now back in the main scope, and `b` maintains the value without ever changing. However, `a` did change; or, rather, what behind `a` did change.

::Qabox{type="answer"}
2. `10 5`.
::

::McqMultiple
---
options:
    - "1. `a == b` returns true because both reference the same object"
    - "2. `a.equals(b)` returns true because both contain the same value"
    - "3. `a` and `b` are separate objects with independent memory locations"
    - "4. Changing `a`'s value will also change `b`'s value"
correct: 
    - 2
    - 3
---

#prompt
Consider the following code:
```java
Integer a = new Integer(5);
Integer b = new Integer(5);
```
Which statement is correct about the relationship between `a` and `b`?

#explanation
`a` and `b` are separate objects created with `new`, so they occupy different memory locations. `a == b` compares references and returns false. `a.equals(b)` compares values and returns true for `Integer` objects. Changing `a`'s value (if possible) would not affect `b` since they're independent objects.
::

### 0x05. Boolean Algebra and Rewritting Logics
Consider this expression:
```java
(a || !b) && c
```
Where `a, b, c : boolean`. Which of the following is equivalent to it?

1. `!(!a && b) && c`
2. `!(a || !b) || !c`
3. `(a && c) || (!b && c)`
4. `(a || !b) && (a || c)`

The answer is 1 and 3, but how do we derive this?

The first method that we can use it enumerate for all a, b, c. Evidentally this will not work since a simple combinatorics argument gives that the size of the table grows exponentially with the number of variables.

A better way is to reduce this predicate to a **disjunctive normal form**, which is basically `||`ing a bunch of `&&`s or the `!` of a bunch of `&&`s.

> I didn't recall Kumo teaching this in class but nevertheless its a good method.

For example, `a || b && c || !d` is in DNF. However, `(a || b) && c` is not. A better way to understand DNFs is to convert an expression into an algebraic expression, where you swap `&&`s for multiplication, `||` for addition, and `!` for inverses. If the resulting expression is a polynomial in standard form (a sum of monomials), then the corresponding expression is in DNF. This way of expression boolean clauses and the study of disjunction and conjunction is known as **Boolean Algebra**, and this specific way to reducing expressions is known as a **Rewriting Sysmem**. Our last two expressions can thus be expressed as
$$
a + bc + (1 - d)
$$

and 

$$
(a + b)c
$$

At immediate glance we noticed that the second one is not canonical or strongly normalized (Note that the negation of a single atom like $1 - d$ *is not* a redux. That is, you cannot reduce it further. However in our case we require the expression to be **strongly normalized**, which simply put, requires you to absorb all redundent terms and so.)

For example, `!(a && b) || c` is **not** in DNF. Expanding, `!a || !b || c` is in DNF.

Another example is `(a && !a) || b`. This is in DNF, however it just not strongly normalized since `(a && !a)` is a redux that can be reduced to `false`. This should be `b` after strong normalization.

::DefBox{id="DNF"}
A boolean expression is in **Disjunctive Normal Form** if it is a disjunction (OR, `||` or $\vee$) of one or more conjunctions (AND, `&&` or $\wedge$) of literals, where a **literal** is either a variable or its negation. Under strong normalization, we require some a Negation Normal Form (NNF) property that negations cannot be further reduced.

Formally, a DNF expression has the shape:

$$ 
\bigvee_{i} \bigwedge_{j} l_{ij}
$$

Where each $l_{ij}$ is either a variable $x$ or its negation $\neg x$.
::

::WarningBox
After reduction, **ALWAYS** check for disparities with the original clause, especially in computations with side effects takes upon an important role. Take this example:
```java
public class Box {
    private int cnt;

    public boolean isOdd() {
        this.cnt++;
        return this.cnt % 2 == 1;
    }
}

Box a = new Box(0);
System.out.println(a.isOdd() && (false || true));
```
If you directly compute this, it gives `true`. But if you reduce it to a DNF:
```java
System.out.println(a.isOdd() && false || a.isOdd() && true);
```
The first time `isOdd` is called, `cnt` is 1, so it returns true, but `false && true == false`. The next time `cnt` becomes 2, so RHS also reduces to false. Therefore, this clause actually evaluates to `false`.
::

It can be proven that every boolean expression can be rewritten into DNF -- it is a **normal form**, meaning it is a canonical, unambiguous representation of any truth table. For a prove of this, consult your first discrete mathematics homework. There are three main sets of rules we're using: the **Ring Properties**, the **Absorption Laws** and the **De Morgan's Laws**.

First of all, we have the ring properties. Those are the natural laws that apply to any rings, like addition and multiplication. This immediately signifies the benefits on the conversion of logical formulae to algebraic expressions: this allows us to use familiar operations on them that we've been using since primary school: taking apart parenthesis, switching orders, and combining terms.

::NoteBox
The law of distribution, association, and commutation applies to conjunctions and disjunctions:

| Boolean | Algebriac |
| - | - |
| `a && (b \|\| c) == a && b \|\| a && c` | `a(b + c) = ab + ac` |
| `a \|\| (b \|\| c) == (a \|\| b) \|\| c` | `a + (b + c) = (a + b) + c` |
| `a && (b && c) == (a && b) && c` | `a (b c) = (a b) c` |
| `a \|\| b == b \|\| a` | `a + b = b = a` |
| `a && b == b && a` | `ab = ba` |

Basically put: expand and manipulate the algebraic expression however you like **WITHOUT EXPANDING THE INVERSIONS(`!`)**.
::

Next up are the specific nuances of boolean algebra : absoption laws. Specifically, it's with the existence of $1$ (Truth) and $0$ (False).

::NoteBox
For any term $a$:
| Boolean | Algebraic |
| - | - |
| `a && a && a ... == a` | `a^n = a` |
| `a \|\| a \|\| a ... == a` | `na = a, n \in \mathbb{Z}` |
| `a && \neg a == false` | `a \times (1 - a) = 0` |
| `a \|\| \neg a == true` | `a + (1 - a) = 1` |
| `a \|\| a && b == a` | `a + ab = a` |
::


At last is an important set of corollaries: De Morgan's laws. They help accelerate in expanding negations rather than manually justifying using the absorption laws.

::NoteBox
There isn't quite an algebraic equivalence to De Morgan's laws, but you can memorize them like this:

> If not (a or b) happens, it means that neither a nor b happens.
> If not both a and b happen, it must mean a didn't happen or b didn't happen.

In fact, the English phrase `neither ... nor ...` directly utilizes De Morgan's laws.

$$
\lnot(A \vee B) = \lnot A \wedge \lnot B \\
\lnot(A \wedge B) = \lnot A \vee \lnot B \\
$$
```java
!(a || b) == !a && !b
!(a && b) == !a || !b
```
Or in boolean algebra
$$
(1 - (a + b)) = (1 - a)(1 - b) \\
(1 - (a b)) = (1 - a) + (1 - b)
::

Let's get into how to actually derive the normal form of a boolean expression. Let's take the following example:
```java
!(a && !b) || (c && (a || d)) && !(!c || b)
```
At first glance this looks like an absolute jargon. Let's write them out in boolean algebra

$$
(1 - (a \times (1 - b))) + (c \times (a + d)) \times (1 - ((1 - c) + b))
$$

This immediately clears everything up. Already, we can do some reduction on the original expression:

Distribute $c$ into $(a + d)$:

$$
(1 - (a \times (1 - b))) + (ca + cd) \times (1 - ((1 - c) + b))
$$

Distribute $(1 - ((1 - c) + b))$ into $(ca + cd)$:

$$
(1 - (a \times (1 - b))) + ca(1 - ((1 - c) + b)) + cd(1 - ((1 - c) + b))
$$

Which in Java notation is:

```java
!(a && !b) || (c && a && !(!c || b)) || (c && d && !(!c || b))
```

Each clause is now a conjunction of literals or inversions of literals -- ready for the next step, which is to expand the inversions (`!`) using De Morgan's law.


By applying them on the expressions we have here, we get

$$
\begin{align*}
& (1 - (a \times (1 - b))) + ca(1 - ((1 - c) + b)) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + (1 - (1 - b)) + ca(1 - ((1 - c) + b)) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + b + ca(1 - (1 - c)) + ca(1 - b) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + b + cac + ca(1 - b) + cd(1 - (1 - c)) + cd(1 - b) \\
= & (1 - a) + b + cac + ca(1 - b) + cdc + cd(1 - b) \\
\end{align*}
$$

After absorption, this yields

$$
\begin{align*}
& (1 - a) + b + cac + ca(1 - b) + cdc + cd(1 - b) \\
= & (1 - a) + b + ac + ac(1 - b) + cd + cd(1 - b) \\
= & (1 - a) + b + ac + cd
\end{align*}
$$

Which is
```java
!a || b || (a && c) || (c && d)
```

Now try applying the same principle on the first problem in this section!

::Folding{title="Answer"}
The corresponding DNFs are
Prompt: `a && c || !b && c`
1. `(a || !b) && c == a && c || !b && c` 
2. `(!a && b) || !c`
3. Already in DNF,`a && c || !b && c` 
4. `a && (a || c) || !b && (a || c) = a || ac || !b && a || !b && c = a || !b`

Therefore, 1 and 3 are isomorphic to the prompt.
::

[Click here for a cheatsheet of all formulae](#logical-rewrites) used here.


::Mcq
---
options:
    - "1. `!(p && q)`"
    - "2. `!p || !q`"
    - "3. `!p && !q`"
    - "4. `p || q`"
correct: 2
---

#prompt
According to De Morgan's Law, which expression is equivalent to `!(p && q)`?

#explanation
De Morgan's Law states that `!(p && q)` is equivalent to `!p || !q`. This is one of the fundamental logical rewrites in Boolean algebra. Option 1 is the original expression, option 3 is `!(p || q)` by De Morgan's Law, and option 4 is unrelated.
::

## 1x00. Essential APIs
In this section I'll walk over the most commonly used APIs in APCSA.
[Click here for the APCSA API Reference Sheet](#apcsa-api-reference-sheet)

### 1x01. Arrays

::McqMultiple
---
options:
    - "1. `int[] arr = new int[5];`"
    - "2. `int[] arr = {1, 2, 3, 4, 5};`"
    - "3. `int[] arr = new int[]{1, 2, 3, 4, 5};`"
correct: 
    - 1
    - 2
    - 3
---

#prompt
Which of the following are valid ways to declare and initialize an array in Java?

#explanation
All three are valid array declarations and initializations in Java. Option 1 creates an array of size 5 with default values (0 for `int`). Option 2 uses array literal syntax (only allowed during declaration). Option 3 uses explicit array creation syntax, which can be used anywhere, not just during declaration.
::
> [Click here for all the constructors](#array-constructors) for arrays listed in the appendix.

When you define a normal primitive variable, you simply push the data into the stack. However, most of the time we want a way to define multiple values in a collection and query them based on their location. Arrays are interfaces built for this; they are fixed-sized containers that take up a block of contagious memory in the heap.

To access the an element of an array, use `a[i]`, where `0 <= i && i < a.length`. This is called 0-indexing. Im not sure if this will be tested, but there is also a convention known as 1-indexing, where the first element correponds to the index `1`.

When indexing an array with `i` out of `[0, a.length)` bounds, the JVM runtime throws an error `ArrayIndexOutOfBoundsException`

::WarningBox
`ArrayIndexOutOfBoundsException` and `IndexOutOfBoundsException` are **NOT** the same exception. One applies to arrays and the other applies to `ArrayList`s.
::

In other languages arrays are considered primitive types and are allocated on the stack. HOWEVER IN JAVA, <mark>ARRAYS ARE OBJECTS, CONSTRUCTED USING `new`, PASSED BY REFERENCE, AND ALLOCATED ON THE HEAP</mark>. By indexing an array, you get a variable of the same scope as the array. Generally you don't need to worry about shadowing because Java does not allow identifiers with names like `a[i]`, but arrays can shadow each other, which is worth knowing. Apart from that, just treat indexed arrays as normal variables and you can apply all previously discussed analysis on them.

> Arrays can and can only hold references to objects. Even though arrays are on the heap, it does not mean that allocating an array of objects allows you to actually store the objects in the array.

The idiom for iterating over an array is using a for loop. I wont delve deep into what a for loop is because its just too basic.

```java
for (int i = 0; i < a.length; i++) // And now access a[i]
```

In mordern Java, we allow a syntatic sugar called the **Enhanced For Loop**. Introduced in Java 5, it was designed to eliminate the clutter of manual iteration (handling counters or `Iterator` objects) when you simply need to process every element in a collection or array from start to finish.

```java
for (int n : a) // And now access n
```

Just beware: `i` is an index and `n` is a value. If you want to *mutate* the array, the enhanced for loop wont do because `n` is just a new variables scoped within the loop that has nothing to do with the original array.

```java
int[] a = {1, 2, 3};
for (int n : a) n++;
System.out.println(a[0]) // Prints 1

for (int i = 0; i < a.length; i++) a[i]++;
System.out.println(a[0]) // Prints 2
```

### 1x02. `String` Class


> The String class represents character strings. All string literals in Java programs, such as "abc", are implemented as instances of this class.
> -- Oracle

A `String` is an abstraction of an array of characters(`char[]`). You can use the enhanced for loop to loop through a string, but you **cannot** index a string using the brackets notation. To get the character at a specific index, use `charAt(n)`. If you want a string representation of that `char`, use `substring(n, n + 1)`.

> You cannot set the character at a specific index. This is because strings in java are immutable by default, meaning that you can only allocate a new string each time you do manipulation on a string.

`String`s can also be represented using a construct known as a string literal. Whenever you enclose text in <mark>straight double quotation marks</mark>, you create a new string. However, string literals can only span a single line and cannot contain quotation marks within them. To work around this limitation, Java provides a special syntax called **escaping**. An **escape sequence** in Java is a two-character construct where the first character is a backslash `\`. By following the backslash with different characters, you can represent special characters that are not otherwise supported. Common escape sequences include `\"` for double quotation marks and `\n` for newline. 

[Click here for a complete cheatsheet](#string-literal-escape-sequences) of all Java escape sequences in the appendix.

```java
String a = "Humpty \"Dumpty\" sat on a wall\nHumpty \"Dumpty\" had a great fall";
System.out.println(a);
```
Will print
```stdout
Humpty "Dumpty" sat on a wall
Humpty "Dumpty" had a great fall
```

String constructed using literals are stored in a special area in the heap memory known as the **String Constant Pool**.

One benefit of the SCP is that string constructed using literals often show up many times in a program. If a string is in the SCP, then constructing with a literal directly give you a reference to that prior object in the constant pool without wasting extra memory.

> Note that this meant that strings inside the SCP is unique. There does not exist a case where two strings `a` and `b` in the SCP satisfies `a.equals(b)` but not `a == b`.

```java
String a = new String("apple");
String b = new String("apple");
a == b // false

String c = "apple";
String d = "apple";
c == d // true
```

> Remember: `String`s are objects. This meant that when you compare them using `==`, it compares the underlaying address. Therefore, `a == b` returns whether if `a` and `b` are the same object, not just the same string. Simply put, `a == b` implies `a.equals(b)` but not necessarily the converse.

::Qabox{type=question}
```java
String a = "coffee";
String b = "coffee";
String c = new String("coffee");
String d = c;

System.out.print((a == b) + " ");
System.out.print((a == c) + " ");
System.out.print((c == d) + " ");
System.out.print(a.equals(c));
```
What is printed as a result of executing the code segment?

1. `true false true true`
2. `true true true true`
3. `false false true true`
4. `true false false true`
::

Lets walk through this problem using the same approach from previous problems. Firstly, `a` is constructed using a literal, so it is store in the SCP.

:Pic{src="scp-1.webp" alt="Here I seperated SCP and the heap because the signifance of SCP as a subset of the heap isn't that useful in AP."}

`b` is constructed with the same literal, so the JVM found the reference to `"coffee"` in the SCP and gave it to `b`. Now, `a == b` already holds so we can rule out (3).

:Pic{src="scp-2.webp"}

Now, `c` is constructed with a regular `new` constructor. This instantiates a new string in the heap.

:Pic{src="scp-3.webp" alt="Now objects in the heap are **not** guaranteed unique. You can totally have multiple objects with the exact same data in the heap."}

And the last line assigns `d` to `c`, which makes the two reference the same string.

:Pic{src="scp-4.webp"}

::Qabox{type=answer}
1. `true false true true`

`a.equals(c)` is trivial. 
::

[Click here for the string section](#string-class) of the AP reference sheet.



::McqMultiple
---
options:
    - "1. `str1 == str2`"
    - "2. `str1.equals(str2)`"
    - "3. `str1.compareTo(str2) == 0`"
correct: 
    - 2
    - 3
---

#prompt
Given two `String` objects `str1` and `str2`, which expression(s) correctly check if they contain the same sequence of characters?

#explanation
For `String` objects, `equals()` compares the actual character sequences, and `compareTo() == 0` also indicates equality of content. The `==` operator compares object references, not content, so it returns true only if both variables reference the exact same `String` object in memory.
::

### 1x03. `ArrayList` Class Family

An `ArrayList` is a primary example of a **generic type**. Although the APCSA exam does not cover the formal theory of generics, it is essentially a method of parameterizing type variables to make one type dependent on another. For instance, an `ArrayList<Integer>` is dependent on the `Integer` type, whereas an `ArrayList<String>` is dependent on the `String` type. Within the APCSA reference sheet, the capital `E` serves as a placeholder for the specific type passed in at construction time.

::Folding{title="Extension - Parametric Polymorphism"}
In regular type theory, a function (constructor) could only take on a specific type. This quickly became a big problem. Let's take a simple example; we want to construct a simple function that takes a value and spits it right out. We first implement an instance for integers:
$$
\text{identity}_\mathbb{Z} := \lambda x : \mathbb{Z}. x \\
\mathbb{Z}: * \vdash \text{identity}_\mathbb{Z} : \mathbb{Z}. x
$$
Then for floating points:
$$
\text{identity}_\mathbb{R} := \lambda x : \mathbb{Z}. x \\
\mathbb{R}: * \vdash \text{identity}_\mathbb{R} : \mathbb{R}. x
$$
Then for strings:
$$
\text{identity}_{\Sigma^*} := \lambda x : \mathbb{Z}. x \\
\Sigma^*: * \vdash \text{identity}_{\Sigma^*} : \Sigma^*. x
$$
And so on.

the above in Java would be written as
```java
// For integers (using Integer wrapper)
public Integer identity(Integer x) {
    return x;
}

// For floating points (using Double wrapper)
public Double identity(Double x) {
    return x;
}

// For strings
public String identity(String x) {
    return x;
}
...
```

But just writing out our function for every single type is not going to work. We developers are human, and we make mistakes. Can you automate this repetition into some sort of pattern?

The same problem popped up in 1974 when Jean-Yves Girard (and independently John C. Reynolds in 1974) developed **System F**, also known as the **Polymorphic Lambda Calculus**. To cope with the explosion of redundant code, Girard and Reynolds introduced **universal quantification** over the type universe (which is just a fancy name for providing a placeholder for a type).

In System F, instead of defining a new function for every type, we define a "type-abstraction" using the uppercase Lambda ($\Lambda$). This allows the function to work across the entire universe of types by abstracting the type itself into a variable:

$$
\text{id} := \Lambda \alpha. \lambda x : \alpha. x \\
\emptyset \vdash \text{id} : \forall \alpha. \alpha \to \alpha
$$

Here, $\forall \alpha$ (read as "for all alpha") signifies that the function is now a **generalized template**. 

In **Java**, this System F concept is implemented as **Generics**. We use angle brackets `< >` to denote the universal quantification of a type variable (usually denoted as `E` for Element or `T` for Type).

```java
public <T> T identity(T x) {
    return x;
}
```
The same concept is utilized here with `ArrayList`. If Oracle were to implement a separate `ArrayList` for every type then it would have been a nightmare of manual overloading and access breach.
::

The `ArrayList` provides an abstraction for a general container. It is not fixed-sized like arrays, and provides ergonomic interfaces for structural mutation like inserting and removing elements. Because of its polymorphic nature, you'll need to explicitly provide which type it contains at construction time.

```java
ArrayList<String> names = new ArrayList<String>();
ArrayList<String> names = new ArrayList<>(); // Since Java 7, you can omit the type on the RHS using the diamond operator <>.

ArrayList<Integer> scores = new ArrayList<>(50); // You can also provide an initial capacity.
ArrayList<String> listFromSet = new ArrayList<>(existingSet); // Or construct using an array or other collections. This is not covered in the AP Subset but legal to use.
```
> Note that the initial capacity parameter **does not fill the arraylist up with that much data**. It just reserves that much space in the heap to avoid needing to resize later. You could buy 50 apartment rooms in a building, but if you didn't furnish them you cannot live in any of these. Other than optimization, `ArrayList`s constructed with this constructor behave exactly like the default construct. 
> 
> You can use this constructor to make yourself look smart but since it's not covered in the AP Subset, I wouldn't recommend risking your score for this.
> 
> ```java
> ArrayList<Integer> scores = new ArrayList<>(50);
> scores.set(0, 100); // Exception java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
> ```

::WarningBox
`ArrayList`s only work for objects! That is, you cannot write `ArrayList<double>` to create an abstracted collection of `double`s. This is partly due to how java implements parametric polymorphism as an implicit private attribute of as an extra pointer. 

However, you can utilize what's known as **Wrapper Classes**.
::

By default, the `add` method appends the element to the back of the list (bigger index). You can also provide an index to put the element in and shift everything backwards.

The `set` method is different from `insert` in the sense that `set` does not account for any elemnets already occuring in the target index; it just overwrites everything.

`ArrayList` also support the enhanced for loop. 

::WarningBox
Just remember **NOT** to mutate the `ArrayList` while you are looping over it, or else Java gets really angry and throws an error not covered in the AP Subset (`ConcurrentModificationException`, but you *can* modify elements because its essentially mutating another object whose point is in the `ArrayList`.). Even in the AP Subset, mutating during iteration is very non-idiomatic code and carries a high risk of losing points.

```java
ArrayList<String> tasks = new ArrayList<>();
tasks.add("Buy milk");
tasks.add("Urgent: Fix the leak");
tasks.add("Call mom");

for (String task : tasks) {
    if (task.contains("Urgent")) {
        tasks.remove(task); // ConcurrentModificationException
    }
}
```
::

::McqMultiple
---
options:
    - 1. `ArrayList&lt;int>; list = new ArrayList&lt;int>();`
    - 2. `ArrayList&lt;Integer> list = new ArrayList&lt;Integer>();`
    - 3. `ArrayList list = new ArrayList();`
correct: 
    - 2
    - 3
---

#prompt
Which of the following are valid `ArrayList` declarations in Java?

#explanation
Option 2 is the correct generic syntax using the wrapper class `Integer`. Option 3 is valid without generics (raw type), though not recommended. Option 1 is invalid because generics require reference types, not primitives like `int`. `ArrayList` is a generic class that works with reference types, so primitive types need their corresponding wrapper classes.
::


### 1x04. `Scanner` and `File` Class

> [Click here for a complete cheatsheet of Scanner methods](#scanner-class) in the appendix.

There is not much to the `File` class. It is just a container that contains the path to the file, so it does not throw anything upon construction.

On the other hand, actually using the `File` class might throw all sorts of errors. For example, constructing a `Scanner` class throws `IOException`s.

Just remember to include `throws` in your method header. 

```java
public static void main(String[] args) throws IOException {
    String fileName = "example_log.txt";
    File myFile = new File(fileName);
}

```
> Error throwing is contagious under the call chain. The AP Subset does not cover `try` `catch` `finally`, so there is virtually no way of breaking this chain. Just remember, if you call any method that `throws`, mark the current method as `throws` too.
> ```java
> public class FileWrapper {
>     private Scanner reader;
>     public void loadfile(String fileName) throws IOException {
>         File myFile = new File(fileName);
>         this.reader = new Scanner(myFile);
>     }
> 
>     public FileWrapper(String path) {
>         this.loadfile(path);    // unreported exception java.io.IOException; must be caught or declared to be thrown
>     }
> }
> ```
> A correct version would be
> ```java
> public class FileWrapper {
>     private Scanner reader;
>     public void loadfile(String fileName) throws IOException {
>         File myFile = new File(fileName);
>         this.reader = new Scanner(myFile);
>     }
> 
>     public FileWrapper(String path) throws IOException {
>         this.loadfile(path);    // unreported exception java.io.IOException; must be caught or declared to be thrown
>     }
> }
> ```

The `Scanner` class is an **$LL(1)$ top-down parser** with regular parsing power. In computer science terms, this means it follows a specific set of rules to process data:

1.  **Linear Scanning:** It scans the input stream sequentially from start to finish. It is a "one-way" street; it cannot backtrack to a previous token once it has been consumed.
2.  **Lookahead ($LL(1)$):** It can "look ahead" by exactly **one** token. Using the `hasNext...()` methods (like `hasNextInt()`), the `Scanner` can peek at the next piece of data to check its type without actually moving the cursor.
3.  **Regex Matching:** It uses **Regular Expressions** to identify tokens. For the AP Exam, just remember that `Scanner` uses **delimiters** (whitespace and newlines by default) to decide where one token ends and the next begins.


::NoteBox
Remeber that `next...()` methods **consume**, and `hasNext...()` only takes a look. For example, the following never terminates:
```java
while (sn.hasNextInt()) System.out.println("Has Int!");
```

The following is correct and halts when hitting the first non-integer token.
```java
while (sn.hasNextInt()) System.out.println("Has Int " + sn.nextInt());
```
::

To trace what a scanner does is pretty easy. Just simply write out the text, and imagine yourself being the parser.

::Qabox{type=question}
Consider the following program.
```java
while (sn.hasNext()) {
    if (sn.hasNextAlpha()) {
        String name = sn.next();
        
        if (sn.hasNextInt()) {
            int age = sn.nextInt();
            
            if (sn.hasNextDouble()) {
                double gpa = sn.nextDouble();
                System.out.println(name + " (" + age + ") GPA: " + gpa);
            }
        }
    }
}
```
Given the input string
```
Alice 17 3.8 Bob 18 3.9
```
What does it print?
::

> Here I'll denote the cursor as `|` and wrap the next token in parenthesis.

Let's start with line 1. It checks if the next token is present, which absolutely does:
```
|(Alice) 17 3.8 Bob 18 3.9
```

So we go into the loop. Now, the next check is if the next token is alphanumeric, which `Alice` obviously satisfies, so we move on.

We call `String name = sn.next();` which consumes `Alice` and moves the cursor:

```
Alice |(17) 3.8 Bob 18 3.9
```

Now `sn.hasNextInt()` returns `true` because `17` is an integer, so we enter the inner if block. We call `int age = sn.nextInt();` to consume the integer:

```
Alice 17 |(3.8) Bob 18 3.9
```

Next, `sn.hasNextDouble()` returns `true` because `3.8` is a double, so we enter the innermost block. We call `double gpa = sn.nextDouble();`:

```
Alice 17 3.8 |(Bob) 18 3.9
```

Now we print: `Alice (17) GPA: 3.8`.

The loop continues because `sn.hasNext()` still returns `true` (there's `Bob` ahead). We repeat the process:

- `sn.hasNextAlpha()` returns `true` for `Bob`
- `sn.next()` consumes `Bob`:
```
Alice 17 3.8 Bob |(18) 3.9
```
- `sn.hasNextInt()` returns `true` for `18`
- `sn.nextInt()` consumes `18`:
```
Alice 17 3.8 Bob 18 |(3.9)
```
- `sn.hasNextDouble()` returns `true` for `3.9`
- `sn.nextDouble()` consumes `3.9`:
```
Alice 17 3.8 Bob 18 3.9 |
```
- Print: `Bob (18) GPA: 3.9`

Now `sn.hasNext()` returns `false`, so the loop terminates.

::Qabox{type=answer}
```
Alice (17) GPA: 3.8
Bob (18) GPA: 3.9
```
::

## 2x00. Algorithms 101

Algorithms is a substantial section of APCSA. You can't just understand algorithms overnight, but I'll do my best to give a brief overview and a few excercises for each big section of algorithm design.

### 2x01. Iteration
Iteration refers to the practice of sequentially computing over an ordered collection of things. It generally is comprised of one or more nested loops. They could accumulate computation, aggregate arrays, or employ more complex operations like searching or sorting a collection.

We can utilize the `for` loop's abstraction of termination conditions and looping control to write efficient and clean code.  The most idiomatic way to use `for` loop is to maintain an index variables `i` to keep track of the loop count and also to control termination.

::Qabox{type=question}
Given positive integer $n$, print integers 0 up to $n$ delimited by newlines.
::

::Qabox{type=answer}
```java
void printIntegers(int n) {
    for (int i = 0; i <= n; i++) {
        System.out.println(i);
    }
}
```
::

The operational semantics of the `for` loop does not restrict the termination predicate and update statement to be about our loop index. It could be anything.

::Qabox{type=question}
Given positive integer $n$ and $k$, compute the sum of its digits under base $k$ expansion.
::

::Qabox{type=answer}
```java
int sumOfDigits(int n, int k) {
    int sum;
    for (sum = 0; n > 0; n /= k) {
        sum += n % k;
    }
    return sum;
}
```
::

There is another type of linear for-loop called **Triangular Iteration**, where the inner loop is dependent on the outer loop.
```java
void printTriangle(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) System.out.print("*");
        System.out.println();
    }
}
```


Iterative problems are generally pretty easy, and the hard part is usually off-by-one errors.

::NoteBox
Everyone has learned about the tree planting problem before. Assume that we have 4 buildings and we want to plant trees between each of those buildings. The correct count of trees is 3, not 4. Humans are actually really prone to writing those simple offsets of indices because of all sorts of rounding errors. I myself have frankly never figured out a good way to get around it, so I generally just simulate the algorithm and add random offsets to index variables wherever off-by-ones could occur. It is not a good method, nevertheless it works.

The recommended way to avoid such errors is to formalize your algorithm, but it's pretty hard for iterative programs. Later on we will go over recursive algorithms, which I recommend over iterative programs since they are easily formalizable at high school level mathematics.
::


### 2x02. Recursion

Recursive algorithms are a bit hard to wrap your head around at first, but become much easier to understand once you develop an intuition for them. 

::DefBox{id=Recursion}
Recursion is a method of problem-solving where a function calls itself, directly or indirectly, to solve smaller instances of the same problem. It relies on the principle of self-similarity, breaking a complex task into a base case (the simplest possible version that can be solved immediately) and a recursive step (the process of reducing the problem toward the base case).
::

A simple recursive algorithm is the factorial:

$$
\begin{align*}
\Gamma(n) &= n \times \Gamma(n - 1) \\
\Gamma(0) &= 1
\end{align*}
$$

The $\Gamma(0) = 1$ case is called the **base case**. The $\Gamma(n)$ case is called the **recursive case / step**.

In Java, this translates to:

```java
public static int factorial(int n) {
    if (n == 0) {           // base case
        return 1;
    } else {                // recursive case
        return n * factorial(n - 1);
    }
}
```

To see how it works, plug a value in:

$$
\begin{align*}
\Gamma(5) &= 5 \times \Gamma(4) \\
&= 5 \times 4 \times \Gamma(3) \\
&= 5 \times 4 \times 3 \times \Gamma(2) \\
&= 5 \times 4 \times 3 \times 2 \times \Gamma(1) \\
&= 5 \times 4 \times 3 \times 2 \times 1 \times \Gamma(0) \\
&= 5 \times 4 \times 3 \times 2 \times 1 \times 1 \\
&= 120
\end{align*}
$$

In order to make a recursive algorithm work, the function must satisfy **strict positivity**. This is not something that can be explained in one blog entry, but basically you need to descend "into" the data rather than build higher and higher on top of the input. For example:
$$
\begin{align*}
f(n) = 2f(n + 1) \\
f(1) = 1
\end{align*}
$$
If you plug in any value other than $1$, the algorithm just explodes to infinity. If you look at the parameter to each call of a method, it increases rather than decreases, and because you cannot reach the end of integers by increasing, the function never stops.

In Java, executing such program will likely result in a `StackOverflowError`.

::NoteBox
Note that this exception is not caused by the incorrectness of the program: it is simply that function calls are nested so deep that they reach the maximum allowed depth for the JVM. In theory, you could write a recursive program that terminates theoretically and give it a large enough input to trigger the `StackOverflowError`. But in practice this is nearly impossible.
::

The key to writing recursive programs is to construct your data in a structured way. For example, to define factorial, we view natural numbers as
```haskell
Numbers := 0 | Numbers + 1
```

And define what happens for each case:

1. **Base case (0)**: `factorial(0) = 1`
2. **Recursive case (n + 1)**: `factorial(n + 1) = (n + 1) × factorial(n)`

The power of this approach comes from **structural induction**. When we write `factorial(n)`, we can assume—as our *inductive hypothesis*—that `factorial(n - 1)` already works correctly for the smaller natural number. This assumption is justified because `n - 1` is structurally smaller than `n` in our definition `Numbers := 0 | Numbers + 1`.

In programming terms: when `factorial(n)` calls `factorial(n - 1)`, we are **trusting** that the recursive call will handle the smaller subproblem correctly. This "leap of faith" is exactly the inductive hypothesis in action. The base case ensures the chain of recursive calls eventually terminates.

Let's see another classical recursive problem. Recursive reversion. Here, we define the string to be
```haskell
String := "" | Char + String
```

::Folding{title="Formal Definition of Reversion"}
$$
(a w)^R = w^R a \\
\lambda^R = \lambda
$$
```haskell
reversion :: String -> String
reversion (a:w) = w ++ [a]
reversion [] = []
```
::


```java
String reverse(String n) {
    if (n.length() > 0) return reverse(n.substring(1)) + n.substring(0, 1);
    else return n;
}
```

> I encourage you to write recursive algorithms. They are much easier to analyze formally by structural induction on those algorithms, in contrast to imperative programs (loops, states) which require a much deeper technique called operational semantics that I don't think we can handle in a single exam.

### 2x03. Sorting
In APCSA, there are basically just 4 types of sorting:
1. Bubble sort ($O(n^2)$)
2. Insertion sort ($O(n^2)$)
3. Selection sort ($O(n^2)$)
4. Merge sort ($O(n log n)$)

Let's walk through them one by one.

#### Bubble Sort
Bubble sort is the simplest algorithm of them all: we just scan from the beginning to the end of the list and for every adjacent pair, swap them if they are out of order. This process repeats until no more swaps are needed, with larger elements "bubbling up" to the end of the list.

::Folding{title="Proof of Correctness"}
**Invariant:** After each complete pass through the array, the largest unsorted element "bubbles up" to its correct final position.

**Base:** Initially, no elements are in correct sorted positions.

**Step:** Each pass compares adjacent pairs. If they're out of order, they swap. This ensures the largest element in the unsorted portion moves toward the end. After a full pass, the largest element reaches its final position.

**Termination:** When a complete pass makes no swaps, the array is sorted (all adjacent pairs are in order).
:Qed
::

The implementation is also the easiest.

```java
public static void bubbleSort(int[] arr) {
    boolean swapped;
    do {
        swapped = false;
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap adjacent elements
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}
```

#### Insertion Sort
Insertion sort builds the final sorted array one element at a time. It takes each element from the input and inserts it into its correct position within the already-sorted portion of the array. Think of it like sorting a hand of playing cards.

::Folding{title="Proof of Correctness"}
**Invariant:** After processing the first $i$ elements, they form a sorted array.

**Base:** The first element alone is trivially sorted.

**Step:** For each new element, we shift larger elements right to make space, then insert the new element. This preserves the sorted order of the first $i+1$ elements.

**Termination:** After processing all $n$ elements, the entire array is sorted.
:Qed
::

```java
public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Shift elements greater than key to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key; // Insert key at correct position
    }
}
```

#### Selection Sort
Selection sort repeatedly finds the minimum element from the unsorted portion and places it at the beginning of the sorted portion. It maintains two subarrays: one sorted and one unsorted. Each iteration expands the sorted subarray by one element.

::Folding{title="Proof of Correctness"}
**Invariant:** The first $i$ elements are sorted and are the $i$ smallest elements of the array.

**Base:** When $i=0$, the invariant holds trivially.

**Step:** We find the minimum element in the unsorted portion and swap it with the element at position $i$. This element is now the $(i+1)$-th smallest and belongs at position $i$ in sorted order.

**Termination:** After $n$ iterations, the first $n$ elements are sorted and contain all elements.
:Qed
::

```java
public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // Swap
        int temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
}
```

#### Merge Sort
Merge sort uses a divide-and-conquer approach: it recursively splits the array in half until reaching single elements, then merges the sorted halves back together. The merge operation combines two sorted arrays into one sorted array. This algorithm has $O(n \log n)$ time complexity but requires additional memory for the merging step.

::Folding{title="Proof of Correctness"}
**Base Case:** An array of size 0 or 1 is already sorted.

**Inductive Hypothesis:** Assume merge sort correctly sorts arrays of size $< n$.

**Inductive Step:** For an array of size $n$, we split it into two halves of size $\lfloor n/2 \rfloor$ and $\lceil n/2 \rceil$. By the inductive hypothesis, both halves are sorted correctly. The merge operation then combines two sorted arrays into one sorted array.

**Termination:** Recursion terminates when arrays reach size 0 or 1.
:Qed
::

```java
public static void mergeSort(int[] arr) {
    if (arr.length <= 1) return;
    int mid = arr.length / 2;
    int[] left = new int[mid];
    int[] right = new int[arr.length - mid];
    // Copy elements
    for (int i = 0; i < mid; i++) left[i] = arr[i];
    for (int i = mid; i < arr.length; i++) right[i - mid] = arr[i];
    
    mergeSort(left);
    mergeSort(right);
    merge(arr, left, right);
}

private static void merge(int[] result, int[] left, int[] right) {
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result[k++] = left[i++];
        } else {
            result[k++] = right[j++];
        }
    }
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
}
```
Sometimes merging is taken out on its on as a seperate algorithm.

::Mcq
---
options:
    - "1. Bubble Sort - $O(n^2)$"
    - "2. Insertion Sort - $O(n^2)$"
    - "3. Selection Sort - $O(n^2)$"
    - "4. Merge Sort - $O(n^2)$"
correct: 4
---

#prompt
Which sorting algorithm has an incorrect time complexity listed?

#explanation
Merge Sort has a time complexity of $O(n \log n)$, not $O(n^2)$. Bubble Sort, Insertion Sort, and Selection Sort all have worst-case time complexities of $O(n^2)$. Merge Sort uses a divide-and-conquer approach that achieves better asymptotic performance than the simple quadratic sorts.
::

### 2x04. Searching



#### Linear Search
Linear search sequentially checks each element of an array until it finds the target value or reaches the end of the array. This is the simplest search algorithm but has $O(n)$ time complexity in the worst case.

::Folding{title="Proof of Correctness"}
**Invariant:** After checking the first $i$ elements, the target is not present in positions $0$ through $i-1$.

**Base:** Before any elements are checked ($i=0$), the invariant holds trivially.

**Step:** At each iteration, we check if the current element equals the target. If yes, we return the index. If not, we continue to the next element, maintaining the invariant.

**Termination:** The algorithm terminates when either the target is found or all elements have been checked. In the first case, it returns the correct index; in the second, it correctly returns $-1$.
:Qed
::

```java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}
```

#### Binary Search
Binary search requires a sorted array and uses a divide-and-conquer approach. It repeatedly compares the target with the middle element, eliminating half of the remaining search space each time. This gives $O(\log n)$ time complexity.

::Folding{title="Proof of Correctness"}
**Invariant:** If the target is present in the array, its index must be within the range `[low, high]` (inclusive).

**Base:** Initially, `low = 0` and `high = arr.length - 1`, so the invariant holds.

**Step:** At each iteration, we examine the middle element `mid`. If `arr[mid] == target`, we return `mid`. If `arr[mid] < target`, the target must be in the right half (`low = mid + 1`). If `arr[mid] > target`, the target must be in the left half (`high = mid - 1`). The invariant is preserved.

**Termination:** The loop terminates when `low > high`. At this point, the search space is empty, and the target is not in the array.
:Qed
::

```java
public static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}
```

::Mcq
---
options:
    - 1. Binary search requires the array to be sorted
    - 2. Linear search works on both sorted and unsorted arrays
    - 3. Binary search has $O(\log n)$ time complexity
    - 4. Linear search is always faster than binary search
correct: 4
---

#prompt
Which statement about searching algorithms is FALSE?

#explanation
Linear search is NOT always faster than binary search. For large sorted arrays, binary search ($O(\log n)$) is significantly faster than linear search ($O(n)$). Binary search does require a sorted array and has logarithmic time complexity. Linear search works on any array regardless of sorting but has linear time complexity.
::


### 2x05. Miscellaneous Algorithms

#### Extrema Searching
Given a collection and a total order over it, find the maxima / minima of the collection. Always initialize with the first element (or `Integer.MIN_VALUE`/`Integer.MAX_VALUE` for empty array handling).

```java
public static int findMax(int[] arr) {
    if (arr.length == 0) throw new IllegalArgumentException("Array is empty");
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

public static int findMin(int[] arr) {
    if (arr.length == 0) throw new IllegalArgumentException("Array is empty");
    int min = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}
```

## 3x00. Writing Classes

::DefBox{id=Class}
In programming, a **class** is a syntactic entity structure used to create objects.
::

Simply put, a class is a template for create objects, which are just the coupling of various other data. For example, a point in a cartesian plane is just the cartesian product of the $X$ axis and the $Y$ axis, which is a quantity that could be expressed with two instance variables `double X` and `double Y`. A class, thus, is a standarized way to implement this kind of coupling and inject semantic meaning to it, and provide convenient method that acts upon them.

### 3x01. Anatomy of a Class

Any class declaration starts with the keywords

```java
public class SomeClass {
    // Declares things..
}
```

A class is made up of two parts
1. The instance variables
2. The methods.

Instance variables are just regular variables that are scoped withint the curly brackets of the class definition
```java
public class Person {
    String name;
    int age;
}
```

Sometimes we define a class not merely for the coupled storage of data, but to encapsulate **behavior**. In such cases, the instance variables serve as an internal state -- a hidden engine that drives the class's logic -- rather than data meant to be freely read or written by outside code. Exposing this state carelessly invites misuse and error.

Consider how we interact with a computer. Nobody operates a computer by reaching inside the chassis and toggling logic gates by hand -- not only is the hardware shielded behind a physical casing, but doing so would completely defeat the purpose of having a convenient, well-designed interface in the first place. The keyboard and mouse are the only intended points of contact; everything beneath them is deliberately hidden and protected.

The same principle governs class design. A class may maintain internal state that is critical to its correct behavior -- state that, if tampered with directly, could corrupt the logic entirely. Ideally, we want to expose only a clean, controlled interface to the outside world, while keeping the internal mechanics strictly off-limits.

Luckily, Java provides a feature known as **visibility modifiers** -- keywords that let us explicitly declare who is and isn't allowed to access a given variable or method. The two most fundamental ones are `public` and `private`.

```java
public class Person {
    private final int yearBorn;   // The year someone is born in should be kept constant and nonaccessible.
    private String name;        // Only the person themself should be responsible for changing their names.
}
```

Defining methods is similar to defining instance variables. We can define `public` or `private` methods.

```java
public class Person public class Person {
    private final int yearBorn;   // The year someone is born in should be kept constant and nonaccessible.
    private String name;        // Only the person themself should be responsible for changing their names.

    // Maybe this is a shy person who don't like to share their thoughts so much
    private boolean satisfiedWithName(String newName);

    public void changeName(String newName) {
        if (this.satisfiedWithName(newName)) {
            this.name = newName;
        }
    }
}
```

These are called **instance variables and methods** because for each object that used the class as a template, they obtain those variables and methods of their own. Instances don't effect each other.

There is a special keyword called `static`. This declares **class variables and methods** and defines attributes tied to the class itself.

Unlike instance variables, which each object owns a separate copy of, a `static` variable is shared across every object of that class — there is only ever one copy of it, belonging to the class itself.

```java
public class Person {
    private static int population = 0;  // Shared across all Person objects
    private final int yearBorn;
    private String name;

    public static int getPopulation() {
        return Person.population;
    }
}
```

Notice that `static` methods are called on the **class**, not on any particular object — `Person.getPopulation()` rather than `somePerson.getPopulation()`. In fact, because a `static` method belongs to the class rather than any instance, it cannot access instance variables or use `this` — there is no "current object" to refer to.

Every class also needs a way to initialize its instance variables when a new object is created. This is handled by a special method called a **constructor** — it shares the exact name of the class and has no return type.

```java
public class Person {
    private static int population = 0;
    private final int yearBorn;
    private String name;

    public Person(String name, int yearBorn) {
        this.name = name;
        this.yearBorn = yearBorn;
        Person.population++;        // Every new Person increments the shared count
    }

    public static int getPopulation() { return Person.population; }
    public String getName()           { return this.name; }
}
```

The keyword `this` refers to the current object (which is `self` in many other languages) — useful here to disambiguate between the parameter `name` and the instance variable `this.name`. 

::WarningBox
Just as discussed in the [first section](#_0x02-variables-types-and-scopes), variable shadowing is a common problem when writing constructors. If you defined parameters with the same name as your instance variables, the `this.` directory is mandatory. Or else you are just mutating the parameters which just does nothing.
```java
// ⚠️ this.name and this.yearBorn is not initialized
public Person(String name, int yearBorn) {
    name = name;
    yearBorn = yearBorn;
    Person.population++;
}
```
::


Putting it all together, a fully structured class therefore looks like this:

```java
public class SomeClass {
    // 1. Static (class) variables
    // 2. Instance variables
    // 3. Constructor(s)
    // 4. Private helper methods
    // 5. Public methods
}
```

This ordering is a convention, not a rule enforced by the compiler — but following it keeps classes readable and predictable.

### 3x02. Writing Functional Classes

Let's look at a real problem.

::Qabox{type=question}
A `TrafficLight` models a simple three-phase traffic light that cycles through **green → yellow → red → green → ...**. Each light also belongs to an **intersection** (a `String` given at construction) that never changes. The city tracks how many `TrafficLight` objects have been created in total.

Each light starts on **green**. Advancing the light moves it to the next phase in the cycle. A light can also be **manually overridden** via `setPhase(String phase)`, which forces it to any phase directly, bypassing the normal cycle. A light that has ever been manually overridden is considered **dangerous**. Any light that has gone through 10000 cycles is considered degraded, and thus also **dangerous**.

Write the complete `TrafficLight` class.

| Code | STDOUT | Notes |
|---|---|---|
| `TrafficLight t1 = new TrafficLight("Main & 1st");` | *(none)* | First object created |
| `TrafficLight t2 = new TrafficLight("Oak & 5th");` | *(none)* | Second object created |
| `System.out.println(TrafficLight.getCount());` | `2` | Static; reflects both objects |
| `System.out.println(t1.getIntersection());` | `Main & 1st` | Never changes |
| `System.out.println(t1.getPhase());` | `green` | Starts on green |
| `t1.advance();` | *(none)* | green → yellow |
| `t1.advance();` | *(none)* | yellow → red |
| `System.out.println(t1.getPhase());` | `red` | |
| `t1.advance();` | *(none)* | red → green |
| `System.out.println(t1.getPhase());` | `green` | Cycles back |
| `System.out.println(t1.isDangerous());` | `false` | Never overridden |
| `System.out.println(t2.getPhase());` | `green` | `t2` is unaffected by `t1` |
| `t2.setPhase("red");` | *(none)* | Manual override |
| `System.out.println(t2.getPhase());` | `red` | Phase was forced |
| `System.out.println(t2.isDangerous());` | `true` | Was manually overridden |
| `System.out.println(t1.isDangerous());` | `false` | `t1` unaffected by `t2`'s override |
| `System.out.println(t1.toString());` | `TrafficLight[Main & 1st, green, advances: 3]` | |
| `t1.setIntersection("Broadway & 2nd");` | *(none)* | Should do **nothing** — intersection is final |
| `System.out.println(t1.getIntersection());` | `Main & 1st` | Confirms immutability |
::

A nice way to start planing about those problems is to identify all the methods required and draw an **UML diagram**.

::DefBox{id="UML Diagrams"}
**Universal Modeling Language** is a standardized visual language for describing the structure and behavior of a system. In the context of classes, a UML class diagram summarizes everything a class declares -- its name, instance variables, and methods -- in a compact, language-agnostic box.
For example: 
```java
public class BankAccount {
    private static int totalAccounts = 0;
    private double balance;
    private String owner;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
        totalAccounts++;
    }

    private boolean hasSufficientFunds(double amount) {
        return this.balance >= amount;
    }

    public void withdraw(double amount) {
        if (this.hasSufficientFunds(amount)) this.balance -= amount;
    }

    public double getBalance()          { return this.balance; }
    public static int getTotalAccounts() { return totalAccounts; }
}
```
Could be drawn in UML as:

:Pic{src="UML-1.webp"}

| Keyword / Visibility | UML Representation |
| - | - |
| `private` | Minus sign |
| `public` | Positive sign |
| `static` | Underline |
::

Try drawing the UML for TrafficLight, and you'll get this:

:Pic{src="UML-2.webp" alt="Here I've already populated some private instance variables to model the state correctly."}

> The biggest benefit of UML is that it is a **visual language**. You can sketch it anywhere -- on paper, on a whiteboard, in the margins of an exam -- and it gives you an immediate, at-a-glance reference while you code. Rather than re-reading a lengthy, noisy problem prompt every time you need to recall a method signature, the UML diagram puts everything in one compact, structured place.

Note that here we utilized a public static constant `DEGRADE_CYCLE_CNT`. In UML convention, all caps correspond to immutable quantities or constants. The significance of this variable is that it abstracts the actual cycle threshold behind a named class constant rather than scattering a raw literal like 10000 throughout the code.

> This is a practice known as avoiding **magic numbers** -- unnamed literals buried in logic that carry no inherent meaning to the reader. If the threshold ever needs to change, a magic number forces you to hunt down every occurrence and update them individually, risking an inconsistency if even one is missed. A named constant, by contrast, requires exactly one change in exactly one place, and every reference updates automatically.

Let's implement the constructor first.
```java
public TrafficLight(String intersection) {
    this.intersection = intersection;
    this.phase = "green";       // .. each light starts on green...
    this.advanceCount = 0;      // The light is new.
    this.hasBeenOverriden = false; // New light, ever overriden.
    TrafficLight.count++;       // One more traffic light is erected.
}
```

The constructor is pretty trivial since the prompt told us explicitly what to do. The next method is `setPhase()`. This is a method that returns `void` (denoted by `()` in UML) and its significance is by executing **side effects**, such as mutating variables or logging to streams. In this case, the method updates the traffic light's inner state:

```java
public void setPhase(String phase) {
    this.phase = phase;
    this.hasBeenOverriden = true;
}
```


Getter methods are also pretty trivial:

```java
public String getIntersection() {
    return this.intersection;
}

public String getPhase() {
    return this.phase;
}
```

Getter methods is a way of implementing ad-hoc read-only accessibility in Java. Therefore those methods are all basically of the same form.

Next up is the method `advance()`. This is also a method for side effect.

```java
public void advance() {
    if (this.phase == "green") {
        this.phase = "yellow";
    } else if (this.phase == "yellow") {
        this.phase = "red";
    } else if (this.phase == "red") {
        this.phase = "green";
        this.advanceCount++;
    }
}
```

After clearifying all conditions and semantics of instance variables, `isDangerous()` becomes much easier to implement.

```java
public boolean isDangerous() {
    return this.advanceCount > TrafficLight.DEGRADE_CYCLE_CNT || this.hasBeenOverriden;
}
```

`toString` is also very principled string concatenation:

```java
public String toString() {
    return "TrafficLight[" + this.intersection + ", " + this.phase  + ", advances: " + this.advanceCount + "]";
}
```

Beware! `getCount` is a static method; it fetches the total count of traffic lights erected so it should be dispatched to the class itself. This can also be seen in the listing given in the prompt.

```java
public static int getCount() {
    return TrafficLight.count;
}
```

And we're done! Just remember to correctly implement the variables, and we're good to go.

::Qabox{type=answer}

```java
public class TrafficLight {
    private String intersection;
    private String phase;
    private int advanceCount;
    private boolean hasBeenOverriden;
    private static int count;

    public static final int DEGRADE_CYCLE_CNT = 10000;

    public TrafficLight(String intersection) {
        this.intersection = intersection;
        this.phase = "green";
        this.advanceCount = 0;
        this.hasBeenOverriden = false;
        TrafficLight.count++;
    } 

    public void setPhase(String phase) {
        this.phase = phase;
        this.hasBeenOverriden = true;
    }

    public String getIntersection() {
        return this.intersection;
    }

    public String getPhase() {
        return this.phase;
    }

    public void advance() {
        if (this.phase == "green") {
            this.phase = "yellow";
        } else if (this.phase == "yellow") {
            this.phase = "red";
        } else if (this.phase == "red") {
            this.phase = "green";
            this.advanceCount++;
        }
    }

    public boolean isDangerous() {
        return this.advanceCount > TrafficLight.DEGRADE_CYCLE_CNT || this.hasBeenOverriden;
    }
    
    public String toString() {
        return "TrafficLight[" + this.intersection + ", " + this.phase  + ", advances: " + this.advanceCount + "]";
    }
    public static int getCount() {
        return TrafficLight.count;
    }
}
```
::

::Mcq
---
options:
    - "1. Instance variables should be declared as `public` for better encapsulation"
    - "2. Constructors should initialize all instance variables"
    - "3. Getter methods should have `void` return type"
    - "4. Static variables should be accessed through object instances"
correct: 2
---

#prompt
Which of the following is a good practice when writing classes in Java?

#explanation
Constructors should initialize all instance variables to ensure objects are in a valid state. Instance variables should typically be `private` for encapsulation. Getter methods should return the value of the field they're getting. Static variables should be accessed through the class name, not object instances.
::

## Appendix / Cheatsheets

### Exceptions

| Exception | Thrown When |
|---|---|
| `ArrayIndexOutOfBoundsException` | Accessing an array index < 0 or ≥ length |
| `NullPointerException` | Calling a method or accessing a field on `null` |
| `ArithmeticException` | Integer division by zero (`int / 0`) |
| `ClassCastException` | Invalid explicit object cast e.g. `(Dog) myCat` |
| `NegativeArraySizeException` | Creating an array with negative size e.g. `new int[-1]` |
| `StackOverflowError` | Unbounded recursion |
| `StringIndexOutOfBoundsException` | `String.charAt(i)` where `i` < 0 or ≥ length |
| `IndexOutOfBoundsException` | Accessing an invalid index on an `ArrayList` |


### Expression Types

| Expression | Type |
|---|---|
| `int + int` | `int` |
| `int + double` | `double` |
| `double + double` | `double` |
| `int + String` | `String` |
| `double + String` | `String` |
| `boolean + String` | `String` |
| `char + String` | `String` |
| `char + char` | `int` |
| `char + int` | `int` |
| `int / int` | `int` |
| `double / int` | `double` |
| `int / double` | `double` |
| `double / double` | `double` |
| `int % int` | `int` |
| `double % int` | `double` |
| `Math.random()` | `double` $\in [0, 1)$ |
| `Math.pow(double, double)` | `double` |
| `Math.sqrt(double)` | `double` |
| `Math.log(double)` | `double` |
| `Math.floor(double)` | `double` |
| `Math.ceil(double)` | `double` |
| `Math.round(double)` | `long` |
| `Math.round(float)` | `int` |
| `Math.PI` | `double` |
| `Math.E` | `double` |
| `Math.abs(T)` | `T` |
| `Math.min(T, T)` | `T` |
| `Math.max(T, T)` | `T` |

Where `T` $\in$ `{ int, long, float, double }` for the polymorphic ones.

Polymorphic means that whatever goes in comes out with the same type. `Math.abs(int) : int`, `Math.abs(double) : double`.

### Logical Rewrites

| Java | Boolean Algebra | Logical Formula |
|---|---|---|
| `a && (b \|\| c) == a && b \|\| a && c` | $a(b + c) = ab + ac$ | $a \land (b \lor c) \equiv (a \land b) \lor (a \land c)$ |
| `a \|\| (b \|\| c) == (a \|\| b) \|\| c` | $a + (b + c) = (a + b) + c$ | $a \lor (b \lor c) \equiv (a \lor b) \lor c$ |
| `a && (b && c) == (a && b) && c` | $a(bc) = (ab)c$ | $a \land (b \land c) \equiv (a \land b) \land c$ |
| `a \|\| b == b \|\| a` | $a + b = b + a$ | $a \lor b \equiv b \lor a$ |
| `a && b == b && a` | $ab = ba$ | $a \land b \equiv b \land a$ |
| `a && a && a ... == a` | $a^n = a$ | $a \land a \land a \cdots \equiv a$ |
| `a \|\| a \|\| a ... == a` | $na = a,\ n \in \mathbb{Z}$ | $a \lor a \lor a \cdots \equiv a$ |
| `a && !a == false` | $a(1 - a) = 0$ | $a \land \lnot a \equiv \bot$ |
| `a \|\| !a == true` | $a + (1 - a) = 1$ | $a \lor \lnot a \equiv \top$ |
| `a \|\| a && b == a` | $a + ab = a$ | $a \lor (a \land b) \equiv a$ |
| `!(a \|\| b) == !a && !b` | $(1 - (a + b)) = (1-a)(1-b)$ | $\lnot(a \lor b) \equiv \lnot a \land \lnot b$ |
| `!(a && b) == !a \|\| !b` | $(1 - ab) = (1-a) + (1-b)$ | $\lnot(a \land b) \equiv \lnot a \lor \lnot b$ |

### Array Constructors

```java
int[] numbers = new int[5]; // constructors with fixed-length
int[] numbers = {10, 20, 30, 40, 50}; // literal constructing. Note that this syntax can only be used in declarations.
numbers = new int[]{100, 200}; // Literal construction
int[][] matrix = new int[3][3]; // 2D arrays

numbers = {100, 200, 300}; // illegal start of expression
```

Default values for different types:

| Data Type | Default Value |
| :--- | :--- |
| `byte`, `short`, `int`, `long` | `0` |
| `float`, `double` | `0.0` |
| `char` | `\u0000` (null character) |
| `boolean` | `false` |
| `Object` (String, Custom classes) | `null` |

### String Literal Escape Sequences

| Escape Sequence | Meaning |
| :--- | :--- |
| `\"` | Double quotation mark |
| `\'` | Single quotation mark |
| `\\` | Backslash |
| `\n` | Newline (line feed) |
| `\r` | Carriage return |
| `\t` | Horizontal tab |
| `\b` | Backspace |
| `\f` | Form feed |
| `\0` | Null character |
| `\uXXXX` | Unicode character (where XXXX is a 4-digit hexadecimal code) |

### APCSA API Reference Sheet

::LinkCard
---
url: "https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-java-quick-reference.pdf"
title: "AP® Computer Science A | 2026 EXAM REFERENCE INFORMATION"
details: "Thousands of Advanced Placement teachers have contributed to the principles articulated here. These principles are not new; they are, rather, a reminder of how AP already works in classrooms nationwide. The following principles are designed to ensure that teachers’ expertise is respected, required course content is understood, and that students are academically challenged and free to make up their own minds."
image: "CB.webp"
---
::



#### `String` Class
| Constructor / Method | Explanation |
| :--- | :--- |
| `String(String str)` | Constructs a new `String` object that represents the same sequence of characters as `str`. |
| `int length()` | Returns the number of characters in a `String` object. |
| `String substring(int from, int to)` | Returns the substring beginning at index `from` and ending at index `to - 1`. |
| `String substring(int from)` | Returns `substring(from, length())`. |
| `int indexOf(String str)` | Returns the index of the first occurrence of `str`; returns -1 if not found. |
| `boolean equals(Object other)` | Returns `true` if this corresponds to the same sequence of characters as `other`; returns `false` otherwise. |
| `int compareTo(String other)` | Returns a value < 0 if this is less than `other`; returns zero if this is equal to `other`; returns a value > 0 if this is greater than `other`. Strings are ordered based upon the alphabet. |
| `String[] split(String del)` | Returns a `String` array where each element is a substring of this `String`, which has been split around matches of the given expression `del`. |

#### `Integer` Class
| Field / Method | Explanation |
| :--- | :--- |
| `Integer.MIN_VALUE` | The minimum value represented by an `int` or `Integer`. |
| `Integer.MAX_VALUE` | The maximum value represented by an `int` or `Integer`. |
| `static int parseInt(String s)` | Returns the `String` argument as an `int`. |

#### `Double` Class
| Method | Explanation |
| :--- | :--- |
| `static double parseDouble(String s)` | Returns the `String` argument as a `double`. |

#### `Math` Class
| Method | Explanation |
| :--- | :--- |
| `static int abs(int x)` | Returns the absolute value of an `int` value. |
| `static double abs(double x)` | Returns the absolute value of a `double` value. |
| `static double pow(double base, double exponent)` | Returns the value of the first parameter raised to the power of the second parameter. |
| `static double sqrt(double x)` | Returns the nonnegative square root of a double value. |
| `static double random()` | Returns a `double` value greater than or equal to 0.0 and less than 1.0. |

#### `ArrayList<E>` Class
| Method | Explanation |
| :--- | :--- |
| `int size()` | Returns the number of elements in the list. |
| `boolean add(E obj)` | Appends `obj` to end of list; returns `true`. |
| `void add(int index, E obj)` | Inserts `obj` at position `index` ($0 \le \text{index} \le \text{size}$), moving elements at position `index` and higher to the right and adds 1 to size. |
| `E get(int index)` | Returns the element at position `index` in the list. |
| `E set(int index, E obj)` | Replaces the element at position `index` with `obj`; returns the element formerly at position `index`. |
| `E remove(int index)` | Removes element from position `index`, moving elements at position `index + 1` and higher to the left; returns the element formerly at position `index`. |

#### `Object` Class
| Method | Explanation |
| :--- | :--- |
| `boolean equals(Object other)` | Returns `true` if this object is equal to `other`; `false` otherwise. |
| `String toString()` | Returns a string representation of the object. |

#### `File` Class
| Constructor | Explanation |
| :--- | :--- |
| `File(String pathname)` | The `File` constructor that accepts a `String` pathname. |

#### `Scanner` Class
| Constructor / Method | Explanation |
| :--- | :--- |
| `Scanner(File f)` | The `Scanner` constructor that accepts a `File` for reading. |
| `int nextInt()` | Returns the next `int` read from the source. Results in `InputMismatchException` if not found or out of range. |
| `double nextDouble()` | Returns the next `double` read from the source. Results in `InputMismatchException` if not found. |
| `boolean nextBoolean()` | Returns the next `boolean` read from the source. Results in `InputMismatchException` if not found. |
| `String nextLine()` | Returns the next line of text as a `String`. Can return an empty string if called immediately after another `Scanner` method. |
| `String next()` | Returns the next `String` read from the file or input source. |
| `boolean hasNext()` | Returns `true` if there is a next item to read; `false` otherwise. |
| `void close()` | Closes this scanner. |
