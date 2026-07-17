---
title: APCSA - Arrays
description: AP Computer Science A Lecture 8 — arrays as polymorphic containers, construction syntax, zero-indexing, length, iterating with for loops, and arrays of objects
createTime: 2026-07-17
updateTime: 2026-07-17

tags:
    - APCSA
ligatures: false
---

## 0x00. One Variable, One Value — The Problem We've Been Ignoring

### 0x01. The Bottleneck

Every variable you've declared so far has held exactly one value:

```java
int score = 95;
String name = "Alice";
TrafficLight t = new TrafficLight("Main & 1st");
```

One name. One slot. One value. This works beautifully when the number of things you're tracking is small and fixed. But real programs deal with quantities that are neither small nor fixed.

Think about a teacher with thirty students. Thirty test scores to record, thirty names to remember, thirty averages to compute. You could declare thirty separate variables:

```java
int score0 = 95;
int score1 = 85;
int score2 = 92;
// ...twenty-seven more...
```

This is tedious. It's fragile — miss one and your average is wrong, with no compiler error to catch it. And it's impossible when the number isn't known until runtime. What if the teacher has a different number of students each semester? What if the data comes from a file and you have no idea how many entries it contains?

We've been building up to this moment since Lecture 1. We know how to store a single value. We know how to loop. We know how to write classes. What we don't have is a way to say: *"I need one name that refers to many values — a whole row of them, side by side, accessible by position."*

That's what an array is for.

### 0x02. What an Array Is

::DefBox{id="Array"}
An **array** is a fixed-length, ordered container that holds multiple values all of the **same type**. An array is an object — it lives on the heap, is constructed with `new`, and variables of array type hold references to it.
::

The core rule is simple: whatever you can store in a single variable, you can store in an array. An array of `int`s holds `int` values. An array of `String`s holds `String` references. An array of `TrafficLight`s holds `TrafficLight` references. And — because an array is itself a type — an array of `int[]` holds references to other `int` arrays.

```java
int[] scores;           // a variable that can refer to an array of ints
String[] names;         // a variable that can refer to an array of Strings
TrafficLight[] lights;  // a variable that can refer to an array of TrafficLights
int[][] matrix;         // a variable that can refer to an array of int-arrays
```

The square brackets are part of the **type**. `int` and `int[]` are two different types — as different as `int` and `String`. You cannot assign an `int[]` value to an `int` variable, or vice versa. The compiler treats `T[]` as a distinct type for every `T`.

::NoteBox
**Extension — The `..[]` syntax is a type family.** In more formal terms, `..[]` is a **type constructor**: you give it a type `T`, and it gives you back a new type `T[]` — the type of "arrays of `T`". This is an example of parametric polymorphism at the level of types: the same `[]` works for `int`, `double`, `String`, `TrafficLight`, and any other type you'll ever define. You won't be tested on this terminology, but understanding that `..[]` *generates new types* from old ones explains why `int[][]` is valid (apply `[]` twice — first to get `int[]`, then to get `int[][]`) and why every array type is its own distinct type.
::

## 1x00. Creating an Array

There are two ways to bring an array into existence. They serve different purposes, and mixing them up is a common source of bugs.

### 1x01. Constructor Syntax: `new T[count]`

The first way uses `new` — just like creating any other object — followed by the element type and a size in square brackets:

```java
int[] scores = new int[5];        // an array of 5 ints, all initialized to 0
String[] names = new String[3];   // an array of 3 Strings, all initialized to null
double[] temps = new double[7];   // an array of 7 doubles, all initialized to 0.0
boolean[] flags = new boolean[2]; // an array of 2 booleans, all initialized to false
```

This does three things. First, it allocates a block of memory on the heap — exactly enough contiguous space to hold `count` elements of the given type. Second, every slot in that block is automatically zeroed out — filled with the type's default value. Third, the address of that block is returned and stored in the variable.

The defaults are the same ones you already know from [Lecture 6](../260716-apcsa-object-oriented-programming-101):

| Element Type | Default Value |
|:---|:---|
| `int`, `long`, `short`, `byte` | `0` |
| `double`, `float` | `0.0` |
| `boolean` | `false` |
| `char` | `'\0'` (the null character) |
| Any object type (`String`, `TrafficLight`, etc.) | `null` |

The size doesn't have to be a literal — you can use any expression that evaluates to an `int`:

```java
int n = 10;
int[] data = new int[n];          // size determined at runtime — n could come from user input
int[] more = new int[n * 2 + 1];  // expressions are fine
```

This is important. The size of an array is **not** a compile-time constant. It can be a variable whose value you only know when the program runs. This is what separates arrays from declaring thirty separate variables — you don't need to know "thirty" in advance. You just need to know the count by the time you create the array.

::WarningBox
Once an array is created, its size **cannot change**. If you allocate space for 5 elements and later need 10, there is no method to "grow" the array. You must create a brand-new array of size 10 and copy the data over manually. Arrays are fixed-length containers. If you need something that grows and shrinks, that's `ArrayList` — which we'll cover in the next lecture.
::

### 1x02. Literal Syntax: `{...}`

If you already know exactly which values the array should contain, Java provides a more compact way to write it:

```java
int[] scores = {95, 85, 92, 78, 100};
String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri"};
double[] constants = {3.14159, 2.71828, 1.41421};
```

Java counts the values between the braces, creates an array of exactly that size, and populates the slots in order — `scores[0]` gets `95`, `scores[1]` gets `85`, and so on. You don't write `new` and you don't write the size — both are inferred.

::WarningBox
The `{...}` literal syntax can **only** be used in a variable declaration. You cannot use it to reassign an existing array variable:

```java
int[] data = {1, 2, 3};    // ✅ valid — this is a declaration
data = {4, 5, 6};          // ❌ illegal — this is an assignment, not a declaration
```

If you need an array literal outside of a declaration — for reassignment, for a method argument, for a return value — use the anonymous array syntax:

```java
data = new int[]{4, 5, 6};                // ✅ valid — anonymous array creation
someMethod(new String[]{"a", "b", "c"});  // ✅ valid — passing an array literal as argument
```

The `new T[]{...}` form works anywhere an array value is expected, not just in declarations.

**Why does Java impose this restriction?** The compiler uses the type on the left side of the declaration to determine what kind of array `{1, 2, 3}` should create. Without a declaration — `data = {4, 5, 6}` — there's no type context, and Java refuses to guess. `new int[]{4, 5, 6}` provides the type explicitly.
::

::Mcq
---
options:
    - "1. `int[] arr = new int[10];`"
    - "2. `int[] arr = {1, 2, 3};`"
    - "3. `int[] arr; arr = {4, 5, 6};`"
    - "4. `int[] arr = new int[]{7, 8, 9};`"
correct: 3
---
#prompt
Which of the following will cause a **compile-time error**?

#explanation
Option 3 fails because `{4, 5, 6}` appears in an assignment, not a declaration. The `{...}` literal syntax is only legal in a variable declaration. To reassign an array with literal values, use `new int[]{4, 5, 6}` instead. Options 1, 2, and 4 are all valid: option 1 uses the constructor syntax, option 2 is a declaration with literal syntax, and option 4 uses the anonymous array form.
::

## 2x00. Accessing Elements

### 2x01. Zero-Indexing

Each slot in an array is identified by its **index** — an integer position. Java, like almost every language descended from C, counts from zero.

```java
int[] primes = {2, 3, 5, 7, 11};

// primes[0] is 2   — the first element
// primes[1] is 3   — the second
// primes[2] is 5   — the third
// primes[3] is 7   — the fourth
// primes[4] is 11  — the fifth (and last)
```

For an array of length $n$, the valid indices are $0, 1, 2, \dots, n - 1$. The last element is always at `length - 1`. There is no element at index `length` — that's one past the end.

::NoteBox
**Why zero?** This is a historical convention inherited from C, where an array variable is literally a pointer to the start of a memory block, and `a[i]` means "the value at address `a + i * (element size)`." When `i = 0`, you get the value at the starting address — the first element. The notation made sense for pointer arithmetic and it stuck.

You don't need to know pointer arithmetic for the AP exam. You just need to remember: first element is index 0, last is length − 1. Count the positions, not the elements.
::

The expression `a[i]` can appear anywhere a normal variable can. You can read from it, write to it, pass it to a method, increment it — it behaves exactly like a variable of the array's element type:

```java
int x = primes[0];              // read: x becomes 2
primes[2] = 13;                 // write: replace 5 with 13
System.out.println(primes[1]);  // prints 3
primes[3]++;                    // increment: 7 becomes 8
```

`a[i]` is an lvalue — it names a location in memory, so it can sit on the left side of `=`. This is what makes arrays useful: you can loop over them and modify elements in place.

### 2x02. `length` — How Big Is It?

Every array has a public `length` attribute:

```java
int[] data = {10, 20, 30, 40, 50};
System.out.println(data.length);    // prints 5

int[] empty = new int[0];
System.out.println(empty.length);   // prints 0 — yes, zero-length arrays are legal
```

::WarningBox
`length` is a **field**, not a method — notice there are no parentheses. Don't confuse it with `String`'s `length()` (which *is* a method). This is a classic AP trick question:

```java
String s = "hello";
int a = s.length();     // ✅ 5 — length() is a String method

int[] arr = {1, 2, 3};
int b = arr.length;     // ✅ 3 — length is an array field
int c = arr.length();   // ❌ won't compile — arrays don't have a length() method
```
::

`length` is fixed at creation time and never changes. It tells you the capacity, not how many slots are "in use." When you create `new int[10]`, `length` is 10 — even if you've only assigned values to the first three slots. The distinction between capacity and meaningful content is something your code has to manage.

### 2x03. Staying in Bounds

Accessing an index outside the valid range throws an `ArrayIndexOutOfBoundsException` at runtime:

```java
int[] data = {10, 20, 30};
System.out.println(data[3]);   // ❌ ArrayIndexOutOfBoundsException — valid indices: 0, 1, 2
System.out.println(data[-1]);  // ❌ ArrayIndexOutOfBoundsException — negative indices don't wrap around
```

The compiler does **not** catch out-of-bounds access — the index could be a variable, and its value isn't known until runtime. This is a runtime error: the code compiles but crashes mid-execution.

::WarningBox
`ArrayIndexOutOfBoundsException` and `IndexOutOfBoundsException` are **different exceptions**. Arrays throw the first; `ArrayList` (which we haven't covered yet) throws the second. The AP exam expects you to know which is which.
::

::Mcq
---
options:
    - "1. `arr[0]` accesses the first element"
    - "2. For an array of length `n`, the last valid index is `n - 1`"
    - "3. Accessing `arr[arr.length]` throws `ArrayIndexOutOfBoundsException`"
    - "4. `arr.length()` returns the number of elements in the array"
correct: 4
---
#prompt
Which statement about arrays is **false**?

#explanation
Option 4 is false — `arr.length` is a **field**, not a method. There are no parentheses. Options 1, 2, and 3 are all true: arrays are zero-indexed, the last element is at `length - 1`, and accessing `arr[arr.length]` (one past the end) throws `ArrayIndexOutOfBoundsException`.
::

## 3x00. Arrays and Loops

Arrays and `for` loops are a natural pair. The loop counter becomes the index, and `length` tells the loop when to stop. This is the single most common pattern in array code, and you'll use it in nearly every FRQ.

### 3x01. The Canonical Traversal

```java
int[] scores = {95, 85, 92, 78, 100};

for (int i = 0; i < scores.length; i++) {
    System.out.println("Score " + i + ": " + scores[i]);
}
```

This prints:

```stdout
Score 0: 95
Score 1: 85
Score 2: 92
Score 3: 78
Score 4: 100
```

The pattern is `for (int i = 0; i < arr.length; i++)`. Start at zero. Stop **before** `length` (strict `<`, not `<=`). Step by one. This visits every element exactly once, left to right. Commit this to memory — it's the "hello world" of array processing.

::NoteBox
**Why `<` and not `<=`?** Because the last valid index is `length - 1`. When `i` reaches `length`, `arr[i]` would be out of bounds. Using `< length` ensures the loop stops at exactly the right moment. If you write `<=`, the loop runs one extra time — and the last iteration crashes.
::

### 3x02. Accumulation — Sum, Average, Maximum

Looping over an array is almost always paired with **accumulation**: building up a result from the elements one by one. The pattern is the same every time — initialise an accumulator variable, loop through the array updating it, and after the loop, the accumulator holds your answer.

::ExampleBox
**Computing the sum of all elements:**

```java
int[] data = {4, 7, 2, 9, 3};
int sum = 0;
for (int i = 0; i < data.length; i++) {
    sum = sum + data[i];
}
System.out.println(sum);  // prints 25
```

Think of `sum` as a running total. Before the loop it's 0. Each iteration adds one element. After the loop, it has accumulated every element. The order doesn't matter for addition, but it matters for your understanding: the loop visits elements left to right, and `sum` grows with each step.
::

::ExampleBox
**Finding the maximum:**

```java
int[] data = {4, 7, 2, 9, 3};
int max = data[0];  // start with the first element
for (int i = 1; i < data.length; i++) {
    if (data[i] > max) {
        max = data[i];
    }
}
System.out.println(max);  // prints 9
```

We start `max` at `data[0]`, not `0`. Why? Because if all the values are negative — say, `{-5, -3, -8}` — initialising `max = 0` would give the wrong answer. `0` isn't even in the array; it just happens to be larger than any negative number. Always seed the accumulator with an actual element from the array.
::

::HintBox
The accumulation pattern appears in almost every AP FRQ that involves arrays. The recipe: (1) initialise an accumulator outside the loop, (2) update it inside the loop based on `arr[i]`, (3) after the loop, the accumulator is your result. Whether you're summing, max-finding, counting matches, or building a string, the skeleton is identical. Only the update step changes.
::

### 3x03. Modifying Elements in Place

Because `a[i]` is an lvalue, you can write through it. This lets you transform an array without creating a new one:

```java
// Double every element
int[] values = {1, 2, 3, 4, 5};
for (int i = 0; i < values.length; i++) {
    values[i] = values[i] * 2;
}
// values is now {2, 4, 6, 8, 10}
```

::ExampleBox
**Shifting elements right — the "scootch" pattern.** A classic problem: shift every element one position to the right, with the last element wrapping around to the front.

```java
int[] arr = {10, 20, 30, 40};
int last = arr[arr.length - 1];           // save the last element before it's overwritten
for (int i = arr.length - 1; i > 0; i--) {
    arr[i] = arr[i - 1];                  // each element gets the value of the one before it
}
arr[0] = last;                            // wrap the saved last element to the front
// arr is now {40, 10, 20, 30}
```

Notice the loop runs **backwards** — from the end toward the beginning. If you tried to run it forwards, you'd overwrite `arr[1]` with `arr[0]` before `arr[1]`'s original value was saved, and by the time you reached the end every element would be a copy of `arr[0]`. Right-shifting always goes right-to-left.
::

### 3x04. Counting Backwards and Partial Traversals

The loop doesn't have to start at 0 or visit every element. The index is just a variable — you control where it starts, where it stops, and which direction it moves:

```java
// Print in reverse order
int[] data = {1, 2, 3, 4, 5};
for (int i = data.length - 1; i >= 0; i--) {
    System.out.print(data[i] + " ");
}
// prints: 5 4 3 2 1

// Print only the first half
for (int i = 0; i < data.length / 2; i++) {
    System.out.print(data[i] + " ");
}
// prints: 1 2
```

The loop header is a contract: initial value, stopping condition, step. As long as the contract is consistent, the loop does exactly what you ask — no more, no less.

::Mcq
---
options:
    - "1. `for (int i = 0; i < arr.length; i++)`"
    - "2. `for (int i = 0; i <= arr.length; i++)`"
    - "3. `for (int i = 0; i < arr.length; i = i + 1)`"
    - "4. `for (int i = 0; i <= arr.length - 1; i++)`"
correct: 2
---
#prompt
Which loop header will cause an `ArrayIndexOutOfBoundsException` when used to access `arr[i]` (assuming `arr` is a non-empty array)?

#explanation
Option 2 uses `<= arr.length`. When `i` reaches `arr.length`, the loop runs one more time — but `arr[arr.length]` is out of bounds. Option 1 is the canonical pattern (stops at `length - 1`). Option 3 is equivalent to option 1 but written with `i = i + 1` instead of `i++`. Option 4 is equivalent to option 1 — `arr.length - 1` is the last valid index, and `<=` of it is the same as `< arr.length`. Both stop at the last element.
::

## 4x00. Arrays of Objects

### 4x01. References All the Way Down

[Lecture 2](../260707-apcsa-all-about-types) taught us that object variables store **references** — addresses pointing to objects on the heap. Array slots are no different. When you create an array of an object type, each slot is a reference, and each reference starts as `null`:

```java
String[] names = {"Alice", "Bob", "Carol"};          // three references to String objects
System.out.println(names[1].length());                // prints 3 — Bob has 3 characters
System.out.println(names[2].substring(0, 2));         // prints "Ca"
```

The literal syntax is convenient here because it populates the slots immediately. But with the constructor syntax, you get a row of `null`:

```java
TrafficLight[] lights = new TrafficLight[3];  // all three slots are null
// lights[0], lights[1], lights[2] are all null
```

Before you can call any methods on `lights[0]`, you need to put a `TrafficLight` object there:

```java
lights[0] = new TrafficLight("Main & 1st");
lights[1] = new TrafficLight("Oak & 5th");
lights[2] = new TrafficLight("Broadway & 3rd");
```

::WarningBox
Calling a method on `null` throws a `NullPointerException`. This is the single most common runtime error in Java, and arrays of objects are where it most often strikes beginners:

```java
TrafficLight[] lights = new TrafficLight[3];
System.out.println(lights[0].getPhase());     // ❌ NullPointerException — lights[0] is null
```

The array itself is not null — `lights` holds a valid reference to a heap-allocated array. But the slots inside that array are null. You must assign objects to them before use, exactly like you must assign a value to an object variable before calling methods on it.
::

### 4x02. Looping Over Object Arrays

The iteration pattern is identical — the only difference is what you do with `a[i]`. Instead of arithmetic, you call methods:

```java
for (int i = 0; i < lights.length; i++) {
    System.out.println(lights[i].getIntersection() + " → " + lights[i].getPhase());
}
```

This works because `lights[i]` has type `TrafficLight`, and `TrafficLight` has `getIntersection()` and `getPhase()` methods. The compiler checks this statically — it knows the element type from the array's declared type, and it verifies that every method call is valid for that type.

### 4x03. Creating Objects in a Loop

You can combine the loop with `new` to initialise an entire array of objects at once:

```java
TrafficLight[] lights = new TrafficLight[4];
String[] intersections = {"Main & 1st", "Oak & 5th", "Broadway & 3rd", "Park & 7th"};

for (int i = 0; i < lights.length; i++) {
    lights[i] = new TrafficLight(intersections[i]);
}
```

Now every slot holds a live object, and you can safely call methods on any element.

## 5x00. Arrays as Instance Variables

Arrays earn their keep when they become part of a class — when an object *has* an array as part of its state. This combines everything from [Lecture 6](../260716-apcsa-object-oriented-programming-101) (classes, constructors, `private`, `static`) with everything from this lecture.

::ExampleBox
A `ScoreTracker` maintains a fixed number of test scores for one student. It can report the highest score, the average, and whether all scores are passing.

```java
public class ScoreTracker {
    private int[] scores;

    public ScoreTracker(int numTests) {
        this.scores = new int[numTests];   // all slots start at 0
    }

    public void setScore(int testIndex, int score) {
        if (testIndex >= 0 && testIndex < this.scores.length
                && score >= 0 && score <= 100) {
            this.scores[testIndex] = score;
        }
    }

    public int getScore(int testIndex) {
        if (testIndex >= 0 && testIndex < this.scores.length) {
            return this.scores[testIndex];
        }
        return -1;  // sentinel value: invalid index
    }

    public int getHighest() {
        int max = this.scores[0];
        for (int i = 1; i < this.scores.length; i++) {
            if (this.scores[i] > max) {
                max = this.scores[i];
            }
        }
        return max;
    }

    public double getAverage() {
        int sum = 0;
        for (int i = 0; i < this.scores.length; i++) {
            sum = sum + this.scores[i];
        }
        return (double) sum / this.scores.length;
    }

    public boolean allPassing() {
        for (int i = 0; i < this.scores.length; i++) {
            if (this.scores[i] < 60) {
                return false;  // found a failing score — no need to check the rest
            }
        }
        return true;
    }
}
```

Usage:

```java
ScoreTracker st = new ScoreTracker(4);
st.setScore(0, 85);
st.setScore(1, 92);
st.setScore(2, 78);
st.setScore(3, 95);

System.out.println(st.getAverage());  // prints 87.5
System.out.println(st.getHighest());  // prints 95
System.out.println(st.allPassing());  // prints true
```
::

Notice the patterns. We validate indices against `this.scores.length` to stay in bounds — the same `0` to `length - 1` rule from [Section 2](#2x00-accessing-elements). We use the canonical `for (int i = 0; i < this.scores.length; i++)` for traversal. And in `allPassing()`, we return `false` the instant we find a failing score — we don't need to keep looking. This is a technique called **early return**, and it's perfectly valid: once you know the answer, you can stop.

::McqMultiple
---
options:
    - "1. `int[] arr; System.out.println(arr.length);` — prints 0"
    - "2. `int[] arr = new int[5]; arr[0] = 1;` — valid"
    - "3. `int[] arr = {1, 2, 3}; arr[3] = 4;` — throws `ArrayIndexOutOfBoundsException`"
    - "4. `String[] arr = new String[2]; System.out.println(arr[0].length());` — prints 0"
correct:
    - 2
    - 3
---
#prompt
Which of the following statements about arrays are TRUE? (Select all that apply.)

#explanation
Option 2 is true — assigning to a slot within bounds is valid. Option 3 is true — `{1, 2, 3}` creates an array of length 3, so index 3 is out of bounds (valid: 0,1,2). Option 1 is false — `int[] arr;` declares a variable but doesn't create an array; `arr` is uninitialised and accessing `arr.length` won't compile (variable might not have been initialised). Option 4 is false — `new String[2]` creates an array with two null slots; calling `length()` on `null` throws `NullPointerException`.
::

---

::NoteBox
**Cognitive Anchor**

- An **array** is a fixed-length, heap-allocated container that holds multiple values of the same type. `T[]` is a distinct type for each `T` — `int[]` and `double[]` are as different as `int` and `double`.
- The `..[]` syntax is a **type constructor**: it takes a type `T` and produces a new type `T[]`. Apply it twice → `T[][]` (arrays of arrays).
- **Construction** — two ways. `new T[n]` allocates `n` slots initialised to zero-like defaults (`0`, `0.0`, `false`, `null`). `{a, b, c}` literal syntax works only in declarations; use `new T[]{a, b, c}` for assignments or method arguments.
- **Size is fixed** — once created, an array cannot grow or shrink. Need more space? Create a new array and copy.
- **Zero-indexing** — the first element is at index `0`, the last at `length - 1`. Accessing anything outside `[0, length)` throws `ArrayIndexOutOfBoundsException` at runtime.
- **`length` is a field**, not a method — no parentheses. `String`'s `length()` is a method. Don't mix them up.
- **Canonical traversal**: `for (int i = 0; i < arr.length; i++)`. Start at 0. Stop **before** `length` (strict `<`). Step by 1. The `<` is critical — `<=` causes an out-of-bounds crash on the last iteration.
- **Accumulation pattern**: initialise an accumulator outside the loop, update it inside using `arr[i]`, read the result after the loop. Used for sum, max, count, average — the skeleton is identical; only the update changes.
- **`arr[i]` is an lvalue** — you can read from it and write to it. Loop over an array to transform elements in place.
- **Arrays of objects** — slots are references, defaulting to `null`. Calling a method on `null` throws `NullPointerException`. Initialise each slot before use.
- **`ArrayIndexOutOfBoundsException`** is for arrays; `IndexOutOfBoundsException` is for `ArrayList`. The AP exam expects you to distinguish them.
::

## Glossary

| Term | Everyday / Literal Meaning | Meaning in CS |
|:---|:---|:---|
| **Array** / 数组 | An orderly arrangement of things. | A fixed-length, heap-allocated container that holds multiple values of the same type. Created with `new T[n]` or `{...}`. Elements are accessed by integer index using `a[i]`. |
| **Index** / 索引 | A pointer or indicator — like a finger in a book's index pointing to a page. | An integer position within an array. Java uses zero-based indexing: the first element is at index `0`, the last at `length - 1`. |
| **Zero-Indexing** / 零索引 | Counting from zero instead of one. | The convention where the first element of an array is at position 0. Inherited from C's pointer arithmetic model. The $n$th element is at index $n - 1$. |
| **`length`** / 长度 | How long something is. | A public **field** (not method) on every array, giving the number of elements it can hold. Fixed at creation time. Contrast with `String`'s `length()` method. |
| **Bounds** / 边界 | The limits of an area. | The valid index range for an array: $0$ through `length - 1`. Accessing outside this range throws `ArrayIndexOutOfBoundsException`. |
| **Array Literal** / 数组字面量 | A literal (directly written) array value. | The `{a, b, c}` syntax for creating an array with known values. Legal only in variable declarations. Use `new T[]{a, b, c}` elsewhere. |
| **Anonymous Array** / 匿名数组 | An array without a name. | The `new T[]{a, b, c}` expression — creates an array value that can be used anywhere (assignment, argument, return value) without a declaration. |
| **Accumulator** / 累加器 | Something that gathers or collects over time. | A variable initialised before a loop and updated each iteration, building up a result (sum, max, count, concatenated string) from array elements. |
| **Traversal** / 遍历 | Walking through a place from end to end. | Visiting every element of an array exactly once, typically with a `for` loop. The canonical form is `for (int i = 0; i < arr.length; i++)`. |
| **`NullPointerException`** / 空指针异常 | An exception about a null pointer. | A runtime error thrown when calling a method or accessing a field on a `null` reference. Common with arrays of objects whose slots haven't been initialised. |
| **`ArrayIndexOutOfBoundsException`** / 数组索引越界异常 | An exception about an index outside the array's bounds. | A runtime error thrown when accessing an array with an index < 0 or ≥ `length`. Distinct from `IndexOutOfBoundsException` (which is for `ArrayList`). |
| **Type Constructor** / 类型构造器 | Something that builds types. | An operation that takes a type and produces a new type. `[]` is a type constructor: given `T`, it gives `T[]`. `int[]` and `String[]` are different types built by the same constructor. |

::LinkCard
---
url: "https://www.online-java.com/"
title: "Online Java Compiler"
details: "Create arrays, loop over them, shift elements, find maxima, and experiment with out-of-bounds access. Try creating an array of a custom class with null slots — then initialise them in a loop."
image: "default-siteicon.webp"
---
::
