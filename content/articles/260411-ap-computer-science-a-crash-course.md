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


### 0x02. Variables, Types, and Scopes

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

A nice way to visualize this is to draw a stack of variables. Take this example below:

::Defbox{id="Stack"}
A data structure where the last object goes in comes out first. Think of it as a pile of files where you always put things on top and take things on top, or an elevator where the people nearest to the doors are always the ones coming in last but they always get to go out first.

**BEWARE** This is not the same *stack* we're talking about in the computer memory.
::

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

The most outer scope declares the variable `x` as a `int` with value `5`. We put this in our stack.

:Pic{src="stack-1.webp" alt="This top-level scope colored red is also known as the global context."}

