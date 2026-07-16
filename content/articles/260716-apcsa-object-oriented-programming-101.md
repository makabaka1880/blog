---
title: APCSA - Object Oriented Programming 101
description: AP Computer Science A Lecture 7 — instance variables, methods, the this keyword, shadowing, accessibility modifiers, and static members
createTime: 2026-07-16
updateTime: 2026-07-16

tags:
    - APCSA
ligatures: false
---

## 0x00. Review — What We Already Built

### 0x01. The Class So Far

In Lecture 5, we introduced the `class` as Java's implementation of the product type. A class bundles fields together, and you create instances with `new`:

```java
public class Point {
    double x;
    double y;
}

Point p = new Point();
p.x = 3.0;
p.y = 4.0;
```

We learned that `.` is the projection operator — `p.x` extracts the `x` component from the bundle `p`, exactly like $\pi_1$ extracts the first component from a pair. We learned that `new` is the constructor, and that you assign fields after construction.

We also learned to attach **methods** — functions that live inside the class and operate on its fields:

```java
public class Point {
    double x;
    double y;

    double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}
```

A method is a function with privileged access: it can read (and write) the fields of the instance it belongs to without them being passed as parameters. The fields are already in scope.

That was Lecture 5. We assembled the parts. Now we ask: **how do you use these parts to write programs that are safe, readable, and maintainable?**

### 0x02. The Full Anatomy — A Map of What's to Come

A Java class, fully dressed, has more structure than what we've seen so far. Here's the complete picture we'll build in this lecture:

```java
public class BankAccount {
    // ── Instance variables ──
    private String owner;
    private double balance;

    // ── Constructor ──
    public BankAccount(String ownerName, double initialDeposit) {
        this.owner = ownerName;
        this.balance = initialDeposit;
    }

    // ── Accessor (getter) ──
    public double getBalance() {
        return this.balance;
    }

    // ── Mutator (setter) ──
    public void deposit(double amount) {
        this.balance = this.balance + amount;
    }

    // ── Static members ──
    public static final double MINIMUM_DEPOSIT = 0.01;
}
```

By the end of this lecture, you'll understand every piece:
- **Instance variables** — what `owner` and `balance` are, and how they differ from local variables
- **Constructors** — what `public BankAccount(...)` is and how it initialises a new object all at once
- **`this`** — why `this.balance` isn't the same as `balance` when a parameter has the same name
- **`public` and `private`** — why `balance` is hidden behind `private` but `deposit()` is `public`
- **`static`** — why `MINIMUM_DEPOSIT` belongs to the class itself, not to any one account

Each of these exists for a reason. Let's build them one at a time.

## 1x00. Instance Variables — The Soul of an Object

### 1x01. What Makes a Variable an "Instance Variable"

You've declared variables before:

```java
int age = 17;
double gpa = 3.8;
```

These are **local variables** — they live inside a method, come into existence when the declaration is reached, and disappear when the method returns. Their scope is the block `{ }` they're declared in.

An **instance variable** is different. It's declared inside the class but **outside any method**:

```java
public class Student {
    String name;      // instance variable
    int gradeLevel;   // instance variable
    double gpa;       // instance variable
}
```

::DefBox{id="Instance Variable"}
An **instance variable** (also called a **field**) is a variable declared at the class level, outside any method. Each *instance* (object) of the class gets its own copy. The variable lives as long as the object lives.
::

Three things distinguish instance variables from local variables:

| | Local Variable | Instance Variable |
|:---|:---|:---|
| **Declared where** | Inside a method or block | Inside the class, outside all methods |
| **Lifetime** | Created when declaration is reached; destroyed when block exits | Created when the object is created; destroyed when the object is garbage-collected |
| **Scope** | The block it's declared in | The entire class — all methods can see it |
| **Default value** | **None** — must be initialised before use | **Automatic zero-initialisation** ($0$, $0.0$, `false`, `null`) |

::ExampleBox
**Every object gets its own copy.** Create two students:

```java
Student alice = new Student();
alice.name = "Alice";
alice.gradeLevel = 11;

Student bob = new Student();
bob.name = "Bob";
bob.gradeLevel = 10;

System.out.println(alice.name);   // "Alice"
System.out.println(bob.name);     // "Bob"
```

`alice.name` and `bob.name` are completely independent. Changing one doesn't affect the other. Each instance carries its own set of instance variables — that's why they're called *instance* variables.
::

### 1x02. Default Initialisation

Unlike local variables, instance variables are automatically initialised to a **zero-like default**:

```java
public class Demo {
    int    a;    // defaults to 0
    double b;    // defaults to 0.0
    boolean c;   // defaults to false
    String d;    // defaults to null (String is a reference type)
}
```

::WarningBox
**Don't rely on defaults as a style choice.** While Java guarantees zero-initialisation for instance variables, explicitly initialising them makes your intent clear:

```java
// Bad — relies on default
int count;

// Good — intent is explicit
int count = 0;
```

The compiler won't save you from reading an uninitialised local variable (it's a compile error), but it *will* silently give you $0$ for an uninitialised instance variable. That silence can hide bugs. The AP exam expects you to know that instance variables default to zero-like values, but good code initialises explicitly.
::

::Mcq
---
options:
    - "1. Instance variables are initialised to zero-like defaults automatically"
    - "2. Local variables must be initialised before they are read"
    - "3. Each object gets its own copy of instance variables"
    - "4. Instance variables are destroyed when the method that created them returns"
correct: 4
---
#prompt
Which statement about instance variables is **false**?

#explanation
Option 4 is false — instance variables are **not** destroyed when a method returns. They live as long as the object they belong to exists. That's the whole point: they persist across method calls, carrying the object's state. Option 1 (default zero-initialisation), option 2 (locals must be initialised before use), and option 3 (each object gets its own copy) are all true.
::

## 2x00. Constructors — Initialising Objects Properly

### 2x01. The Problem with Manual Assignment

In Lecture 5, we created objects like this:

```java
Point p = new Point();
p.x = 3.0;
p.y = 4.0;
```

This works. But it has two problems. First, it's **tedious** — three lines to make one point. Second, and more important, it's **fragile**: nothing forces you to assign `x` and `y`. You could forget, and the object would drift around with zero-filled fields.

```java
Point p = new Point();
// forgot to set x and y...
double d = p.distanceFromOrigin();   // 0.0 — silently wrong!
```

What we really want is a way to say: "to create a `Point`, you **must** provide an `x` and a `y`." Java's answer is the **constructor**.

### 2x02. What a Constructor Is

::DefBox{id="Constructor"}
A **constructor** is a special method that runs **automatically when an object is created** with `new`. It has three distinguishing features:

1. Its name is **exactly the class name** (same spelling, same capitalisation).
2. It has **no return type** — not even `void`.
3. It is called with `new`: `new ClassName(arguments)`.
::

The constructor's job is to initialise the object's instance variables — to take the newborn, zero-filled object and give it meaningful state.

::ExampleBox
**A `Point` with a constructor:**

```java
public class Point {
    double x;
    double y;

    // Constructor — same name as class, no return type
    public Point(double xValue, double yValue) {
        x = xValue;
        y = yValue;
    }
}
```

Now creating a `Point` is one line:

```java
Point p = new Point(3.0, 4.0);
System.out.println(p.x);   // 3.0
System.out.println(p.y);   // 4.0
```

`new Point(3.0, 4.0)` does three things in sequence:
1. Allocates memory for the new `Point` object (all fields zero-filled)
2. Calls the constructor `Point(3.0, 4.0)`, which sets `x` to `3.0` and `y` to `4.0`
3. Returns a reference to the now-initialised object
::

### 2x03. The Naming Problem

Look at the constructor from section 2x02:

```java
public Point(double xValue, double yValue) {
    x = xValue;
    y = yValue;
}
```

The parameter names (`xValue`, `yValue`) are different from the field names (`x`, `y`). This works, but it's ugly — the names don't tell you they're related. You *want* the parameter names to match the field names:

```java
public Point(double x, double y) {
    x = x;
    y = y;
}
```

But this has a bug. Inside the constructor body, the parameters `x` and `y` are local variables. They **shadow** the instance variables of the same name — the names `x` and `y` now refer to the parameters, not the fields. `x = x` assigns the parameter to itself. The fields are never touched. Your `Point` is created with `x` and `y` both stuck at `0.0`.

We need a way to say "the field called `x`" even when a parameter is also called `x`."

### 2x04. Introducing `this`

Every object has a way to refer to itself. In Java, that self-reference is called `this`.

::DefBox{id="this"}
**`this`** is a keyword that refers to the **current object** — the specific instance on which a method (or constructor) is running.

When you call `p1.distanceFromOrigin()`, `this` inside that method is `p1`. When you call `p2.distanceFromOrigin()`, `this` is `p2`. The same code, bound to a different object each time. `this` is how an object talks about itself.
::

Inside a constructor or method, `this` gives you access to the object's instance variables:

```java
public Point(double x, double y) {
    this.x = x;    // this.x = the field "x" of this object
    this.y = y;    // this.y = the field "y" of this object
                   // plain x = the parameter
}
```

`this.x` unambiguously means "the instance variable called `x`." Plain `x` means "the nearest thing called `x` in scope" — which, inside this constructor body, is the parameter. `this` pierces through the shadow.

::ExampleBox
**`this` works in any method, not just constructors:**

```java
public class Counter {
    int value = 0;

    void increment() {
        this.value = this.value + 1;   // explicit — this.value is the instance variable
    }

    int getValue() {
        return this.value;             // explicit
    }
}
```

When shadowing isn't happening, `this` is optional — `value` and `this.value` mean the same thing. Most Java programmers omit `this` when it's not needed and use it only when a parameter or local variable shadows a field.
::

`this.x = x` is the idiomatic Java constructor pattern. The parameter carries the value in. `this.x` is the field where that value lands. You'll see it in virtually every constructor you ever write.

We'll explore shadowing more deeply in section 3x02. For now, the rule is simple: **when a parameter and a field share a name, use `this.fieldName` to refer to the field.**

::NoteBox
**Default constructor.** If you write a class with **no** constructor at all, Java secretly provides a **default constructor** — a no-argument constructor that does nothing (all fields stay at their zero defaults). This is why `new Point()` worked in Lecture 5 even though we never wrote a constructor.

The moment you write **any** constructor, Java stops providing the default. If you write `public Point(double x, double y)`, then `new Point()` becomes a compile error — you must supply the two doubles. This is a feature: it enforces that every `Point` is properly initialised.
::

::Mcq
---
options:
    - "1. A constructor has the same name as the class"
    - "2. A constructor has no return type, not even void"
    - "3. A constructor is called automatically when `new` is used"
    - "4. If you write a constructor with parameters, Java still provides the default no-argument constructor"
correct: 4
---
#prompt
Which statement about constructors is **false**?

#explanation
Option 4 is false — once you define **any** constructor, Java **stops** providing the default no-argument constructor. If you write `public Point(double x, double y)`, then `new Point()` will not compile. You'd need to explicitly write a no-argument constructor if you still want one. Options 1, 2, and 3 are all true.
::

## 3x00. Methods That Use Instance Variables

### 3x01. The Implicit `this`

In section 2x04, we learned that `this` is how an object refers to itself — and that `this.x` pierces through shadowing. But `this` does more than resolve name collisions. It's always there, even when you don't write it.

When you call a method on an object, the method automatically has access to that object's instance variables:

```java
public class Counter {
    int value = 0;

    void increment() {
        value = value + 1;    // whose value? The object you called increment() on!
    }
}
```

```java
Counter c1 = new Counter();
Counter c2 = new Counter();

c1.increment();   // c1.value becomes 1
c1.increment();   // c1.value becomes 2
c2.increment();   // c2.value becomes 1 (c2 is independent!)
```

The method `increment()` has no parameters. Yet `value` refers to the right object every time. How? Because `value` is shorthand for `this.value`, and `this` is bound to whichever object the method was called on. When you call `c1.increment()`, `this` is `c1`. When you call `c2.increment()`, `this` is `c2`. Same code, different `this`, correct behaviour.

::ExampleBox
**Implicit vs. explicit `this`.** The following two versions are equivalent:

```java
// Shorthand — implicit this
void increment() {
    value = value + 1;
}

// Explicit — same behaviour, more typing
void increment() {
    this.value = this.value + 1;
}
```

Version 1 is what most Java programmers write. `this` is implied — Java adds it for you when there's no ambiguity. Version 2 makes it visible. Both compile to the same bytecode.
::

### 3x02. When `this` Becomes Mandatory — Shadowing

We already saw the `this.x = x` pattern in the constructor (section 2x03). Now let's understand the general rule behind it.

Sometimes you can't rely on the implicit `this`. Consider this method:

```java
public class Student {
    String name;
    int gradeLevel;

    // BUG — does nothing useful
    void setup(String name, int gradeLevel) {
        name = name;             // assigns the parameter to ITSELF!
        gradeLevel = gradeLevel; // same bug
    }
}
```

What happened? Inside `setup()`, the parameters `name` and `gradeLevel` are local variables. They **shadow** the instance variables of the same name. When you write `name = name`, both occurrences refer to the parameter — the instance variable is hidden and never touched.

::NoteBox
**We first encountered shadowing in [Lecture 4](260710-apcsa-control-flow-scoping-and-branching).** There, we built a mental model based on the **environment stack**: the compiler maintains a stack pointer, and every `{ }` block marks a checkpoint. When a new scope declares a variable with the same name as an outer one, the new declaration sits higher on the stack. The compiler's top-down lookup hits it first — so it **shadows** the outer binding, which appears in lighter gray in the diagrams.

Back then, we noted that Java forbids redeclaring same-name variables in overlapping block scopes (those pseudocode examples were for building intuition). The **legitimate** case of shadowing — the one Java actually allows — is exactly what we're seeing now: a method parameter or local variable shadowing an instance variable. The mechanism is the same: the local sits "higher" in the lookup, so plain `name` resolves to it. `this.name` reaches past the local, directly to the instance variable.
::

::DefBox{id="Shadowing"}
**Shadowing** occurs when a local variable (or parameter) has the same name as an instance variable. The local variable *shadows* (hides) the instance variable within its scope. Any unqualified reference to the name resolves to the **local** variable, not the instance variable.
::

The fix: use `this` to pierce through the shadow.

```java
void setup(String name, int gradeLevel) {
    this.name = name;                 // this.name = instance variable; name = parameter
    this.gradeLevel = gradeLevel;     // same pattern
}
```

`this.name` unambiguously refers to the instance variable. Plain `name` refers to the parameter. The distinction only matters when the names collide — but setter methods almost always use the same name for the parameter and the field, so `this` is everywhere in idiomatic Java.

::NoteBox
**Why shadow the names at all?** Because using the same name for the parameter and the field is the clearest convention. When you read `this.name = name`, you instantly know: "the parameter called `name` is being stored into the field called `name`." Alternative conventions like `aName` or `_name` exist, but the `this.x = x` pattern is the most widely used in modern Java.
::

::Mcq
---
options:
    - "1. `this` is a reference to the current object"
    - "2. `this` is required when a parameter shadows an instance variable"
    - "3. Without `this`, a local variable with the same name will shadow the instance variable"
    - "4. `this` is a reference to the class itself, not to any specific object"
correct: 4
---
#prompt
Which statement about `this` is **false**?

#explanation
Option 4 is false — `this` refers to the **current object** (the specific instance the method was called on), not the class. If you call `alice.setup(...)`, `this` is `alice`. If you call `bob.setup(...)`, `this` is `bob`. Options 1, 2, and 3 are all correct.
::

### 3x03. Getters and Setters — A First Pattern

Instance variables store state. Methods operate on that state. The simplest useful methods are **getters** (return a field's value) and **setters** (update a field's value):

```java
public class BankAccount {
    String owner;
    double balance;

    // Constructor — initialise both fields at creation time
    public BankAccount(String ownerName, double initialDeposit) {
        owner = ownerName;
        balance = initialDeposit;
    }

    // Getter — read the balance
    double getBalance() {
        return balance;
    }

    // Setter — deposit money
    void deposit(double amount) {
        balance = balance + amount;
    }

    // Another getter
    String getOwner() {
        return owner;
    }
}
```

This looks simple, but it already contains an important design decision: `balance` is modified only through `deposit()`, not by directly writing `account.balance = x`. Why? Because `deposit()` could validate the amount (no negative deposits), log the transaction, or enforce business rules — none of which direct field access can do.

We'll make this design decision enforceable soon. But first, we need the tool that enforces it.

## 4x00. Accessibility Modifiers — Controlling Who Sees What

### 4x01. The Problem with Exposed Fields

Right now, every field in our classes is wide open:

```java
BankAccount account = new BankAccount("Alice", 100.0);
account.balance = -1000000;   // anyone can set any value — no protection!
account.owner = null;          // anyone can break invariants — no protection!
```

There's nothing stopping a programmer (or yourself, at 2 AM, six months later) from putting the object into an invalid state. If `balance` should never be negative, or `owner` should never be `null`, those rules exist only as comments and good intentions.

Java's answer: **accessibility modifiers**.

### 4x02. `public` and `private`

::DefBox{id="Accessibility Modifiers"}
Accessibility modifiers control which code can access a field, method, or class:

- **`public`** — accessible from **any** code, anywhere in the program.
- **`private`** — accessible only from code **inside the same class**. Not from subclasses, not from other classes in the same package — only from within the exact same `{ }` that defines the class.
::

There are two more — `protected` and package-private (the default when no modifier is written) — but they're for inheritance and packages. The AP exam focuses on `public` and `private`. Those two alone give you a powerful design tool.

::ExampleBox
**Applying `private` to `BankAccount`:**

```java
public class BankAccount {
    private String owner;
    private double balance;

    public BankAccount(String ownerName, double initialDeposit) {
        this.owner = ownerName;
        this.balance = initialDeposit;
    }

    public double getBalance() {
        return this.balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance = this.balance + amount;
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= this.balance) {
            this.balance = this.balance - amount;
        }
    }
}
```

Now external code **cannot** write `account.balance = -1000000`. The compiler rejects it:

```java
BankAccount account = new BankAccount("Alice", 100.0);
account.balance = -1000000;     // COMPILE ERROR: balance has private access
account.deposit(50.0);          // OK — deposit() is public
```

The fields are `private`. The methods `deposit()` and `withdraw()` form a controlled interface — they can validate inputs and maintain invariants. The object's state is protected from direct tampering.
::

::NoteBox
**This pattern has a name: encapsulation.** The idea is to bundle data (fields) with the operations that act on it (methods), and to hide the data behind a controlled interface. External code interacts with the object through its public methods — never by reaching inside and touching fields directly.

Encapsulation isn't about security (a determined programmer can always use reflection to bypass `private`). It's about **contracts**. When `balance` is `private` and only modified through `deposit()` and `withdraw()`, you can guarantee invariants like "balance is never negative" by checking in exactly two places. When `balance` is `public`, you have to check everywhere it might be assigned — across the entire codebase.
::

::Mcq
---
options:
    - "1. A `private` field can only be accessed from within its own class"
    - "2. A `public` method can be called from any code in the program"
    - "3. A `private` method can be called from subclasses"
    - "4. Encapsulation uses `private` fields with `public` methods to control access"
correct: 3
---
#prompt
Which statement about accessibility modifiers is **false**?

#explanation
Option 3 is false — a `private` method (or field) is accessible **only** from within the exact same class. Not from subclasses, not from other classes in the same file — only from code inside the same `class { }` block. Subclass access requires `protected`. Options 1, 2, and 4 are all correct.
::

### 4x03. `private` Methods

Methods can be `private`, too. If a method is an internal helper — something other classes don't need to call — mark it `private`:

```java
public class BankAccount {
    private String owner;
    private double balance;

    // Public interface
    public void deposit(double amount) {
        if (isValidAmount(amount)) {
            balance = balance + amount;
        }
    }

    // Private helper — no external code needs to call this
    private boolean isValidAmount(double amount) {
        return amount > 0 && amount < 1000000.0;
    }
}
```

`isValidAmount()` is an implementation detail. External code shouldn't call it directly — it doesn't make sense outside the context of `deposit()` or `withdraw()`. Making it `private` communicates this intent and prevents accidental misuse.

::NoteBox
**A rule of thumb:** make everything `private` unless you have a reason to make it `public`. Fields should almost always be `private`. Methods should be `public` only if they're part of the class's intended interface — the operations you design for external code to use. Internal helpers stay `private`. This is sometimes called the **principle of least privilege**: give code only the access it needs to do its job, and nothing more.
::

## 5x00. Static — Belonging to the Class, Not the Instance

### 5x01. What `static` Means

Every field and method we've seen so far belongs to an **instance** — a specific object. `alice.name` is Alice's name. `bob.getBalance()` returns Bob's balance. No object, no field, no method call.

But some things don't belong to any one instance. They belong to the class as a whole.

::DefBox{id="Static Member"}
A **static** member (field or method) belongs to the **class itself**, not to any individual instance. You access it through the class name — `ClassName.staticMember` — without creating an object. There is exactly **one** copy of each static field, shared by all instances.
::

::ExampleBox
**An informal analogy — concrete things vs. the concept.** To ask someone's age, you need a concrete person in front of you — Alice, Bob, your neighbour. You can't ask "Human, how old are you?" The question doesn't land. Age is a property of an **instance**.

But consider the question "how long have humans existed?" That's not about Alice. It's not about Bob. It's about the **concept** of Human itself — the category, not any member of it. You don't need a specific person to answer it. `Human.getTimeSinceExistence()` makes sense. `alice.getTimeSinceExistence()` is nonsense — as if Alice personally dates back to the Paleolithic.

Instance members are properties of concrete things. Static members are properties of the **concept** — the class as a category. You need an object to ask its age. You don't need an object to ask how old the species is.
::

::ExampleBox
**The same idea in `BankAccount`.** Each account has its own `balance` — ask a concrete account, get a concrete answer. But "how many accounts exist total?" is a question about the **concept** of bank accounts, not about any one account:

```java
public class BankAccount {
    private String owner;
    private double balance;

    // Static field — one copy, shared by all BankAccount objects
    private static int totalAccounts = 0;

    public BankAccount(String ownerName, double initialDeposit) {
        this.owner = ownerName;
        this.balance = initialDeposit;
        totalAccounts = totalAccounts + 1;    // increment the shared counter
    }

    // Static method — called on the class, not on an instance
    public static int getTotalAccounts() {
        return totalAccounts;
    }
}
```

Usage:

```java
BankAccount a1 = new BankAccount("Alice", 100.0);
BankAccount a2 = new BankAccount("Bob", 200.0);

System.out.println(BankAccount.getTotalAccounts());   // 2 — called on the CLASS
// NOT: a1.getTotalAccounts() — that doesn't make sense (and doesn't compile cleanly)
```

`totalAccounts` is incremented every time the constructor runs. There's only one `totalAccounts` — all instances see the same value because it lives on the class, not on any object.

::NoteBox
**A word on destructors.** If a constructor is like a **birth certificate** — a registration of a new object coming into existence — then a **destructor** is like a **death certificate**: a method that runs automatically when an object is destroyed, serving as a witness of its passing. Some languages, like C++, give you both: you write a constructor to initialise, and a destructor to clean up (close files, release resources, decrement counters). They are **methods** that run at construction and destruction time — not the act of construction or destruction itself.

Java gives you the birth certificate. It does **not** give you the death certificate.

Why? Because in Java, you can't even know exactly when an object dies. There's a special department — the **garbage collector** — that handles all of that. It runs on its own schedule, reclaiming memory from objects no longer in use. You don't control it. You can't hook into it. There is no `finalize()` you can reliably count on (it was deprecated in Java 9 and removed).

So our `totalAccounts` counter only tracks how many instances have **ever** been created, not how many are **currently alive**. In a long-running program, these two numbers can diverge significantly. This is a deliberate trade-off: Java gives up the precision of manual destruction in exchange for not having to worry about memory leaks and dangling pointers.
::
::
### 5x02. Static Methods and Their Limitations

A static method can only access static members directly. It has no `this` — because it wasn't called on an instance:

```java
public class Demo {
    private int instanceVar = 5;
    private static int staticVar = 10;

    public void instanceMethod() {
        // Can access both:
        System.out.println(instanceVar);    // OK — has 'this'
        System.out.println(staticVar);      // OK — static members are always accessible
    }

    public static void staticMethod() {
        // System.out.println(instanceVar); // COMPILE ERROR — no 'this'!
        System.out.println(staticVar);      // OK
    }
}
```

::DefBox{id="Static Method Rules"}
In a **static method**:
- You **can** access static fields and call static methods.
- You **cannot** access instance fields or call instance methods directly (there's no `this`).
- To access instance members, you need a reference to a specific object: `someObject.instanceField`.
::

### 5x03. `static final` — Constants

The most common use of `static` in AP-level code is **constants**:

```java
public class Physics {
    public static final double GRAVITY = 9.8;
    public static final int MAX_CAPACITY = 100;
}
```

`static` means it belongs to the class (one copy). `final` means it can't be reassigned after initialisation. Together, `static final` gives you a named constant accessible from anywhere: `Physics.GRAVITY`. No object needed.

::NoteBox
**Naming convention for constants:** `ALL_CAPS_WITH_UNDERSCORES`. This is a universal Java convention — when you see `MAX_VALUE` or `DEFAULT_TIMEOUT` in all-caps, you know it's a `static final` constant without even looking at the declaration.
::

### 5x04. Instance vs. Static — A Summary

| | Instance (no `static`) | Static |
|:---|:---|:---|
| **Belongs to** | Each object | The class itself |
| **How many copies** | One per object | One total |
| **How to access** | `objectName.member` | `ClassName.member` |
| **Has `this`?** | Yes | No |
| **Can access instance fields?** | Yes | Only through an object reference |
| **Can access static fields?** | Yes | Yes |
| **Example** | `account.balance` | `BankAccount.totalAccounts` |
| **Use for** | Per-object state | Shared counters, constants, utility functions |

::Mcq
---
options:
    - "1. A static field has one copy shared by all instances"
    - "2. A static method can directly access instance fields of its class"
    - "3. A static method has no `this` reference"
    - "4. `static final` is the standard way to declare constants in Java"
correct: 2
---
#prompt
Which statement about `static` is **false**?

#explanation
Option 2 is false — a static method **cannot** directly access instance fields. It has no `this` reference, so there's no way to know *which* instance's field to read. To access an instance field from a static method, you must have an explicit object reference: `someObject.someField`. Options 1, 3, and 4 are all correct.
::

### 5x05. The `main` Method — Your Program's Front Door

Every language that can produce a runnable program has to answer one question: **where does execution begin?** The answer always takes the shape of whatever that language treats as its first-class citizen:

- **Assembly** uses a **label** — a named address in memory. The assembler writes `_start:` and the CPU jumps there.
- **Haskell** uses a **function** evaluating to a **monadic wrapper** — `main :: IO ()`. The runtime evaluates that function, and the side effects it describes become the running program.
- **Java** uses a **class**. Everything in Java lives inside a class, so the entry point must be a class too.

The class that contains `main` is called the **main class**. It's not a special kind of class — no special keyword, no special inheritance. It's just an ordinary class that happens to contain a method with the exact signature:

```java
public static void main(String[] args)
```

The JVM looks for this method in the class you tell it to run. If it finds it, the program starts. If it doesn't, you get `Main method not found`.

::DefBox{id="main Method"}
`public static void main(String[] args)` is Java's entry point. The JVM calls it to start the program. It must be:

- **`public`** — the JVM needs to call it from outside the class
- **`static`** — no objects exist yet when the program starts; the JVM calls `ClassName.main(args)` on the class itself
- **`void`** — `main` doesn't return a value to the JVM; the program ends when `main` returns or `System.exit()` is called
- **`String[] args`** — command-line arguments, passed in as an array of strings
::

::ExampleBox
**A minimal program.** Every program you've written so far has a main class:

```java
public class HelloWorld {          // ← the main class
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

`HelloWorld` is the main class. It contains `main`. The JVM calls `HelloWorld.main(args)`. `main` is `static` because no `HelloWorld` object exists yet — in fact, the whole point of `main` is to create the first objects.

**`String[] args` — command-line arguments.** When you run a program from the terminal, you can pass extra information after the class name:

```
java Echo apple banana cherry
```

The JVM collects everything after the class name into a `String[]` and hands it to `main`. `args[0]` is `"apple"`, `args[1]` is `"banana"`, `args[2]` is `"cherry"`. If you pass nothing, `args` is an empty array (length 0, never `null`).

```java
public class Echo {
    public static void main(String[] args) {
        System.out.println("You gave " + args.length + " arguments.");
        for (int i = 0; i < args.length; i = i + 1) {
            System.out.println("  args[" + i + "] = " + args[i]);
        }
    }
}
```

Running `java Echo apple banana cherry`:

```
You gave 3 arguments.
  args[0] = apple
  args[1] = banana
  args[2] = cherry
```

`args` is just a plain `String[]`. There's nothing magical about it — the JVM fills it in before calling `main`, and your code reads it like any other array.
::

`main` is the entry point. It creates the first objects. It kicks off the program. By the time instance methods start getting called, `main` has already built the world they live in — using `new`, constructors, and all the tools from this lecture.

::ExampleBox
**A complete program using everything from this lecture:**

```java
public class Counter {               // ← the main class
    // Instance variable — one per Counter
    private int value;

    // Static constant — one for the whole class
    public static final int DEFAULT_START = 0;

    // Constructor
    public Counter() {
        this.value = DEFAULT_START;
    }

    // Public mutator
    public void increment() {
        this.value = this.value + 1;
    }

    // Public accessor
    public int getValue() {
        return this.value;
    }

    // Static utility
    public static Counter createStartedAt(int start) {
        Counter c = new Counter();
        c.value = start;          // OK — inside the class, private is accessible
        return c;
    }

    // Entry point
    public static void main(String[] args) {
        Counter c1 = new Counter();
        Counter c2 = Counter.createStartedAt(100);

        c1.increment();
        c1.increment();
        c2.increment();

        System.out.println(c1.getValue());   // 2
        System.out.println(c2.getValue());   // 101
    }
}
```

Every concept from this lecture appears: instance variables, constructors, `this`, `private`, `public`, `static`, `static final`, and the `main` method. Together they form the basic vocabulary of object-oriented programming in Java.
::

---

::NoteBox
**Cognitive Anchor**

- **Instance variables** are declared at the class level, outside methods. Each object gets its own copy. They live as long as the object lives and default to zero-like values ($0$, $0.0$, `false`, `null`).
- **Local variables** are declared inside methods. They must be initialised before use and die when the block exits. Parameters are local variables.
- **Constructor** — a special method that runs automatically when `new` is called. Same name as the class, no return type. Initialises instance variables so the object is ready to use in one step: `new Point(3.0, 4.0)`. If you write **any** constructor, Java stops providing the default no-argument one.
- **`this`** is a reference to the current object — the instance the method was called on. It's implicit when there's no ambiguity, but **mandatory** when a parameter or local variable shadows an instance variable. The idiomatic constructor pattern is `this.x = x`.
- **Shadowing** happens when a local variable has the same name as an instance variable. The local hides the instance. Use `this` to pierce through.
- **`private`** restricts access to within the same class. Use it on fields to protect invariants. Use it on internal helper methods.
- **`public`** makes a member accessible from anywhere. Use it on methods that form the class's intended interface.
- **Encapsulation** = `private` fields + `public` methods. External code interacts through the methods, not by touching fields directly. This lets you enforce rules (no negative balances) in a single place.
- **`static`** means the member belongs to the **class**, not to any instance. One copy, shared. Static methods have no `this`. Access via `ClassName.member`.
- **`static final`** is the constant pattern. `ALL_CAPS` naming by convention.
- **`main` is static** because the JVM needs to call it before any objects exist. It's the entry point that creates the first objects.
::

## Glossary

| Term | Everyday / Literal Meaning | Meaning in CS |
|:---|:---|:---|
| **Instance Variable** / 实例变量 | A variable each instance has. | A field declared at the class level, outside methods. Each object gets its own copy. Exists for the lifetime of the object. |
| **Local Variable** / 局部变量 | A variable local to a block of code. | A variable declared inside a method or block. Must be initialised before use. Dies when the block exits. |
| **Constructor** / 构造函数 | To construct — to build something. | A special method called automatically by `new` to initialise a new object. Same name as the class, no return type. Idiom: `this.field = parameter`. |
| **Default Constructor** / 默认构造函数 | The constructor you get by default. | The no-argument constructor Java provides automatically if you write no constructors. Disappears the moment you define any constructor of your own. |
| **`this`** / this关键字 | This one — the current thing. | A reference to the current object — the instance on which the method was called. Used to disambiguate shadowed fields. |
| **Shadowing** / 遮蔽 | One thing hiding another behind it. | When a local variable or parameter has the same name as an instance variable, hiding it within that scope. Resolved with `this`. |
| **`public`** / 公共访问 | Open to the public. | Accessible from any code anywhere in the program. |
| **`private`** / 私有访问 | For private use only. | Accessible only from within the same class. |
| **Encapsulation** / 封装 | Putting things in a capsule. | Bundling data (fields) with the operations on that data (methods) and hiding the data behind a controlled interface. |
| **`static`** / 静态 | Standing still, not moving — belonging to the class, not to instances. | A member (field or method) that belongs to the class itself rather than to any individual object. One shared copy. No `this` in static methods. |
| **`static final`** / 静态常量 | A final, unchanging thing belonging to the class. | A named constant. `static` = one copy for the class; `final` = cannot be reassigned. Convention: `ALL_CAPS`. |
| **`main` method** / main方法 | The main entry point. | The `public static void main(String[] args)` method — the entry point the JVM calls to start the program. Must be `static` because no objects exist when it runs. |
| **Getter / Accessor** / 访问器 | A method that gets something. | A public method that returns the value of a private field. Provides read-only access: `getBalance()`. |
| **Setter / Mutator** / 修改器 | A method that sets something. | A public method that modifies a private field. Can include validation logic: `deposit(double amount)`. |

::LinkCard
---
url: "https://www.online-java.com/"
title: "Online Java Compiler"
details: "Write, compile, and run Java code directly in the browser. Try creating a class with private fields, a constructor, getters and setters, and a static counter."
image: "default-siteicon.webp"
---
::
