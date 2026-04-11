---
title: AP Computer Science - A Crash Course
description: A concise review guide for AP Computer Science A, covering key concepts, common pitfalls, and exam strategies. 
createTime: 2026-04-11
updateTime: 2026-04-11
---

::QuoteBox{source="Edsger W. Dijkstra"}
Computer science is no more about computers than astronomy is about telescopes.
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
::Defbox{id="Compiler"}
Something that turns your code into what machine can read called a **binary**.
::

::Hintbox
This is not in the AP subset but worth knowing.
::Defbox{id="Interpreter"}
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

[Click here for a cheatsheet of other exceptions in APCSA](#apdx-errors) in the appendix.
::


### 0x02. Variables, Types, and Scopes

A common point of confusion is the placement of Scope and Access. The AP curriculum places it under Class Creation (Unit 3), but in this guide, it is covered alongside Variables and Types -- which reflects how the concept is actually classified in theoretical computer science research.

::Defbox{id="Variable"}
A label to a container that holds a value.
::

::Defbox{id="Type"}
A collection of variables that contain similar values.
::

::Defbox{id="Scope"}
A context / environment that labels variables to container of values.
::

In Java, a scope is created wherever you see a pair of curly braces `{}`. If a scope is nested inside another scope (inner braces inside outer braces), then the inner scope **inherits** access to all variables from the outer scope.

A nice way to visualize this is to draw a stack of variables. Whenever you look down you see everything you've defined, and whenever you look up you see where you're going into. This sounds pretty abstract.

::Defbox{id="Stack"}
A data structure where the last object goes in comes out first. Think of it as a pile of files where you always put things on top and take things on top, or an elevator where the people nearest to the doors are always the ones coming in last but they always get to go out first.

**BEWARE** This is not the same *stack* we're talking about in the computer memory.
::

Take this example below (you can take out a draft paper and follow the steps below)

```java
int x = 5;

void main() {
    System.out.println(x);  // 5
    {
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

::Hintbox
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


### 0x03. Type Coercion, Type Promotion, and Others

> I'll be writing a blog entry on actual type theory. Here's an [entry from my last blog](https://makabaka1880.xyz/CS/theoretical/type-theory/type-systems/strong-and-weak-systems.html) on the basics of type systems, but its still quite basic.

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

[Click here for a cheatsheet](#apdx-expr-type) for the type of common arithmetic expressions in the appendix.

### 0x04. Object and Reference
There are two main ways of passing information: pass by value and pass by reference. To understand what actually happens when those two passing methods are invoked, we first need to understand the von-neumann computer archeticture.

The computer memory is a continuum of cells that could each store data of a fixed size. The easiest way to store data here is by using a stack (yep the same data structure we talked about before):

:Pic{src="stack-13.webp" alt="In fact, this section of memory is known as 'The Stack'."}

The only problem with this is that the data we store must have a fixed size. For example, it is not practical to store a list of data in the stack since we need to guaranteed a contiguous non-terminating vacuum of space for the list to dwell in, erasing any possibility of storing other data. Therefore, computer engineerers invented **The Heap**. The heap also lives in the stack, but deep inside it, and does not following the strict last-in-first-out rules of a stack. The operating system gives a full access to a segment of the stack to administrative algorithms called *memory allocators*, and their job is to do allocation.

::Defbox{id="Malloc"}
Short for memory allocation, is the action of searching through the heap until the allocater finds a big enough continuous space to store data.
::

The problem with this approach is that it is pretty hard to pass values. The difference between the stack and the heap is like a tent camping site and an apartment building; one is an organized aggregation of small units, and the other a chaotic soup of variadic-sized data. It's pretty easy to bring a tent around (pass-by-value), but not an apartment room. But what you can do is memorize your department address and bring your key whereever with you. This way, even though you are not physically carrying the building around, you still possess enough information to make the apartment accessable indirectly.

Similarly, Java uses the address of where the data is stored in the heap. Variables that store these addresses are known as **references**. However, when you pass a reference to a method, Java doesn't actually "pass-by-reference" in the traditional sense. Instead, it takes the value of the address and copies it into the new local variable. In this sense, Java is strictly pass-by-value: you aren't passing the apartment itself, or even the original key, but a photocopy of the key's bit pattern.

::NoteBox
The most important fact to remember is that the variable that contains the address and the object behind the address is not coupled. If you update the variable to another object, the original object don't just get replaced by the new object -- its only that the reference is pointing to a new object. Under the apartment analogy, if someone replaces your key with a new one, your apartment dont just get wiped off the map and gets replaced by the new one; its just that you're holding a new key.
::

In Java, **ANY VARIABLE OF OBJECT TYPE IS A REFERENCE.** Any `String`, any `ArrayList`, any variable of any type thats defined by a class is a reference.

::HintBox
If you are not sure, see if an inhabitant of the type could be `null`. If it is, then it is an object type. Also, any type that can call a method on it (ex, `ArrayList`'s `size()`) is an object type.
::

Let's see a concrete example in how reference passing works.

::Qabox{type="question"}
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
1. `5 5`
2. `10 5`
3. `10 20`
4. `5 20`
::
Let's track down the execution line by line (here no shadowing occurs, so i wont maintain a whole stack of declarations for clarity.)

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

::Quabox

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


For example, `a || b && c || !d` is in DNF. However, `(a || b) && c` is not. A better way to understand DNFs is to convert an expression into an algebraic expression, where you swap `&&`s for multiplication, `||` for addition, and `!` for inverses. If the resulting expression is a rational polynomial in standard form (a sum of monomials), then the corresponding expression is in DNF. Our last two expressions can thus be expressed as
$$
a + bc + (1 - d)
$$

and 

$$
(a + b)c
$$

At immediate glance we noticed that the second one is not canonical or strongly normalized.

::Defbox{id="DNF"}
A boolean expression is in **Disjunctive Normal Form** if it is a disjunction (OR, `||` or $\vee$) of one or more conjunctions (AND, `&&` or $\wedge$) of literals, where a **literal** is either a variable or its negation.

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


At last is an important set of colloraries: De Morgan's laws. They help accelerate in expanding negations rather then manually justifying using the absoption laws.

::NoteBox
There isn't quite a algebraic equivalence to De Morgan's laws, but you can memorize them like this:

> If not a or b happens, it meant that neither a nor b happens.
> If not both a and b happens, it must meant a didn't happen or b didn't happen.

In fact, the english `neither ... nor ...` directly utilized de morgans' laws.

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
\begin{align}
& (1 - (a \times (1 - b))) + ca(1 - ((1 - c) + b)) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + (1 - (1 - b)) + ca(1 - ((1 - c) + b)) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + b + ca(1 - (1 - c)) + ca(1 - b) + cd(1 - ((1 - c) + b)) \\
= & (1 - a) + b + cac + ca(1 - b) + cd(1 - (1 - c)) + cd(1 - b) \\
= & (1 - a) + b + cac + ca(1 - b) + cdc + cd(1 - b) \\
\end{align}
$$

After absorption, this yields

$$
\begin{align}
& (1 - a) + b + cac + ca(1 - b) + cdc + cd(1 - b) \\
= & (1 - a) + b + ac + ac(1 - b) + cd + cd(1 - b) \\
= & (1 - a) + b + ac + cd
\end{align}
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

[Click here for a cheatsheet of all formulae](#apdx-logic) used here.

## 1x00. Essential APIs
In this section I'll walk over the most commonly used APIs in APCSA.

### 1x01. `String` Class

> The String class represents character strings. All string literals in Java programs, such as "abc", are implemented as instances of this class.
> -- Oracle

A `String`

## Appendix / Cheatsheets

<h3 id="apdx-errors">Exceptions</h3>

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


<h3 id="apdx-expr-type">Expression Types</h3>

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

<h3 id="apdx-logic">
Logical Rewrites
</h3>

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

<h3 id="apdx-ref-sheet">APCSA API Reference Sheet</h3>

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