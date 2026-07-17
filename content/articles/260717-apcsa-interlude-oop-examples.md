---
title: APCSA Interlude - OOP Examples
description: Three worked case studies in class design — TrafficLight, VendingMachine, and StudentRecord — with step-by-step walkthroughs and complete implementations.
createTime: 2026-07-17
updateTime: 2026-07-17
---

::NoteBox
This is not a regular lecture. It's a reference interlude — three worked examples of writing real classes, end-to-end. [Lecture 6](../260716-apcsa-object-oriented-programming-101) is about the theoretical stuff behind OOP.
::

## Case 1: TrafficLight

::QaBox{type=question}
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

### Walkthrough

First, extract what the spec asks for. We need instance variables for `intersection`, `phase`, `advanceCount`, and `hasBeenOverriden`; a static `count`; and a static constant `DEGRADE_CYCLE_CNT`. The constructor takes a single `String`.

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
}
```

The accessors are straightforward — just return what's stored:

```java
public String getIntersection() { return this.intersection; }
public String getPhase()       { return this.phase; }
public static int getCount()   { return TrafficLight.count; }
```

`setPhase` is a mutator with a side effect: it not only changes the phase, but also marks the light as having been overridden.

```java
public void setPhase(String phase) {
    this.phase = phase;
    this.hasBeenOverriden = true;
}
```

`advance()` cycles through the three phases. We only increment `advanceCount` on a full cycle (red → green).

```java
public void advance() {
    if (this.phase.equals("green")) {
        this.phase = "yellow";
    } else if (this.phase.equals("yellow")) {
        this.phase = "red";
    } else if (this.phase.equals("red")) {
        this.phase = "green";
        this.advanceCount++;
    }
}
```

::WarningBox
Always use `.equals()` for `String` comparison, not `==`. The `==` operator compares references; `.equals()` compares character sequences.
::

`isDangerous()` is a **derived query** — it doesn't store its own boolean, it computes the answer from existing state:

```java
public boolean isDangerous() {
    return this.advanceCount > DEGRADE_CYCLE_CNT || this.hasBeenOverriden;
}

public String toString() {
    return "TrafficLight[" + this.intersection + ", " + this.phase
         + ", advances: " + this.advanceCount + "]";
}
```

::Folding{title="Full TrafficLight class"}
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

    public String getIntersection() { return this.intersection; }
    public String getPhase()       { return this.phase; }

    public void advance() {
        if (this.phase.equals("green")) {
            this.phase = "yellow";
        } else if (this.phase.equals("yellow")) {
            this.phase = "red";
        } else if (this.phase.equals("red")) {
            this.phase = "green";
            this.advanceCount++;
        }
    }

    public boolean isDangerous() {
        return this.advanceCount > DEGRADE_CYCLE_CNT || this.hasBeenOverriden;
    }

    public String toString() {
        return "TrafficLight[" + this.intersection + ", " + this.phase
             + ", advances: " + this.advanceCount + "]";
    }

    public static int getCount() { return TrafficLight.count; }
}
```
::

---

## Case 2: VendingMachine

::QaBox{type=question}
A `VendingMachine` models a canned-drink vending machine installed at a fixed **location** (a `String` given at construction, never changes). Each machine holds a stock of **cans** and tracks its own **revenue** from sales. The company maintains two global statistics: the total number of machines deployed and the total number of cans sold across all machines.

Each machine starts with an initial number of cans given at construction. Calling `vend()` dispenses one can — if any are in stock — collecting \$1.50 and returning `true` to indicate success; if the machine is empty, `vend()` returns `false` and does nothing. The company charges a flat \$0.50 tax per can, deducted at the moment of sale, so `getRevenue()` returns the *net* revenue (i.e., \$1.00 per can actually vended). A machine can be refilled via `restock(int amount)`, which adds cans to the inventory, but only if `amount` is positive — negative or zero amounts are ignored. A machine with fewer than 5 cans remaining is considered **low stock**.

Write the complete `VendingMachine` class.

| Code | STDOUT | Notes |
|---|---|---|
| `VendingMachine m1 = new VendingMachine("Library", 10);` | *(none)* | |
| `VendingMachine m2 = new VendingMachine("Gym", 3);` | *(none)* | |
| `System.out.println(VendingMachine.getTotalMachines());` | `2` | Static |
| `System.out.println(m1.getLocation());` | `Library` | Never changes |
| `System.out.println(m1.getCans());` | `10` | Initial stock |
| `m1.vend();` | *(none)* | One can dispensed |
| `System.out.println(m1.getCans());` | `9` | Stock decreased |
| `System.out.println(m1.getRevenue());` | `1.0` | $1.50 − $0.50 tax |
| `System.out.println(m2.isLowStock());` | `true` | Started with 3 cans |
| `System.out.println(m1.isLowStock());` | `false` | 9 cans remaining |
| `System.out.println(VendingMachine.getTotalCansSold());` | `1` | Only m1 has vended |
| `m2.restock(10);` | *(none)* | |
| `System.out.println(m2.getCans());` | `13` | 3 + 10 |
| `System.out.println(m2.isLowStock());` | `false` | Now above threshold |
| `m2.restock(-5);` | *(none)* | Should do **nothing** — amount not positive |
| `System.out.println(m2.getCans());` | `13` | Unchanged |
| `System.out.println(m1.toString());` | `VendingMachine[Library, cans:9, revenue:1.0]` | |
| `m2.vend(); m2.vend();` | *(none)* | Two more cans sold |
| `System.out.println(VendingMachine.getTotalCansSold());` | `3` | 1 from m1 + 2 from m2 |
| `System.out.println(m2.getRevenue());` | `2.0` | 2 × $1.00 net |
::

### Walkthrough

From the spec and trace table, we identify: static variables `totalMachines` and `totalCansSold`; static constants `PRICE`, `TAX`, and `LOW_STOCK_THRESHOLD`; instance variables `location` (final), `cans`, and `revenue`. The constructor takes a location and initial stock.

```java
public class VendingMachine {
    private final String location;
    private int cans;
    private double revenue;
    private static int totalMachines;
    private static int totalCansSold;

    public static final double PRICE = 1.50;
    public static final double TAX = 0.50;
    public static final int LOW_STOCK_THRESHOLD = 5;

    public VendingMachine(String location, int initialCans) {
        this.location = location;
        this.cans = initialCans;
        this.revenue = 0.0;
        VendingMachine.totalMachines++;
    }
}
```

`location` is `final` because the spec says it never changes — we enforce it at the language level. Revenue starts at zero and accumulates.

`vend()` is the core method: it guards against empty stock, mutates the instance state, updates the static counter, and returns a success boolean.

```java
public boolean vend() {
    if (this.cans > 0) {
        this.cans--;
        this.revenue += PRICE - TAX;   // net: $1.00 per can
        VendingMachine.totalCansSold++;
        return true;
    }
    return false;
}
```

`restock()` validates its input: only positive amounts are accepted.

```java
public void restock(int amount) {
    if (amount > 0) {
        this.cans += amount;
    }
}
```

The remaining methods are straightforward — accessors, a derived query for low stock, and `toString`.

```java
public String getLocation() { return this.location; }
public int getCans()        { return this.cans; }
public double getRevenue()  { return this.revenue; }

public boolean isLowStock() {
    return this.cans < LOW_STOCK_THRESHOLD;
}

public String toString() {
    return "VendingMachine[" + this.location + ", cans:" + this.cans
         + ", revenue:" + this.revenue + "]";
}

public static int getTotalMachines()  { return VendingMachine.totalMachines; }
public static int getTotalCansSold()  { return VendingMachine.totalCansSold; }
```

::Folding{title="Full VendingMachine class"}
```java
public class VendingMachine {
    private final String location;
    private int cans;
    private double revenue;
    private static int totalMachines;
    private static int totalCansSold;

    public static final double PRICE = 1.50;
    public static final double TAX = 0.50;
    public static final int LOW_STOCK_THRESHOLD = 5;

    public VendingMachine(String location, int initialCans) {
        this.location = location;
        this.cans = initialCans;
        this.revenue = 0.0;
        VendingMachine.totalMachines++;
    }

    public boolean vend() {
        if (this.cans > 0) {
            this.cans--;
            this.revenue += PRICE - TAX;
            VendingMachine.totalCansSold++;
            return true;
        }
        return false;
    }

    public void restock(int amount) {
        if (amount > 0) {
            this.cans += amount;
        }
    }

    public String getLocation() { return this.location; }
    public int getCans()        { return this.cans; }
    public double getRevenue()  { return this.revenue; }

    public boolean isLowStock() {
        return this.cans < LOW_STOCK_THRESHOLD;
    }

    public String toString() {
        return "VendingMachine[" + this.location + ", cans:" + this.cans
             + ", revenue:" + this.revenue + "]";
    }

    public static int getTotalMachines()  { return VendingMachine.totalMachines; }
    public static int getTotalCansSold()  { return VendingMachine.totalCansSold; }
}
```
::

---

## Case 3: StudentRecord

::QaBox{type=question}
A `StudentRecord` tracks one student's academic performance. Each student has a **name** (a `String` given at construction, never changes). A student takes tests throughout the term, and each test score is an integer between 0 and 100. The school automatically assigns each student a unique **ID number**, starting from 1000 and incrementing by one for each new student. The school also tracks the total number of enrolled students and the single highest test score *ever* recorded across all students. This highest-score tracker starts at $-1$ to indicate that no scores have been submitted yet.

Scores are submitted via `addScore(int score)`. Only scores between 0 and 100 (inclusive) are accepted — any score outside this range is silently ignored. Whenever a valid score is submitted, the school's global highest-score tracker is updated if the new score beats the current record. `getAverage()` returns the arithmetic mean of all accepted scores submitted so far for this student, or $0.0$ if no scores have been added yet. `getLetterGrade()` returns a letter grade based on that average: A for 90 and above, B for 80–89, C for 70–79, D for 60–69, and F for anything below 60.

Write the complete `StudentRecord` class.

| Code | STDOUT | Notes |
|---|---|---|
| `StudentRecord s1 = new StudentRecord("Alice");` | *(none)* | ID auto-assigned: 1000 |
| `StudentRecord s2 = new StudentRecord("Bob");` | *(none)* | ID auto-assigned: 1001 |
| `System.out.println(s1.getId());` | `1000` | First student |
| `System.out.println(s2.getId());` | `1001` | Second student |
| `System.out.println(StudentRecord.getTotalStudents());` | `2` | Static |
| `s1.addScore(95); s1.addScore(85); s1.addScore(92);` | *(none)* | Three valid scores |
| `System.out.println(s1.getAverage());` | `90.666...` | (95 + 85 + 92) / 3 |
| `System.out.println(s1.getLetterGrade());` | `A` | Average ≥ 90 |
| `s2.addScore(72); s2.addScore(68);` | *(none)* | Two valid scores |
| `System.out.println(s2.getAverage());` | `70.0` | (72 + 68) / 2 |
| `System.out.println(s2.getLetterGrade());` | `C` | 70 ≤ avg < 80 |
| `System.out.println(StudentRecord.getHighestScoreEver());` | `95` | Alice's 95 |
| `s2.addScore(99);` | *(none)* | New highest score |
| `System.out.println(StudentRecord.getHighestScoreEver());` | `99` | Updated across all students |
| `s1.addScore(150);` | *(none)* | Should do **nothing** — out of range |
| `System.out.println(s1.getAverage());` | `90.666...` | Unchanged (still 3 scores) |
| `System.out.println(s1.toString());` | `StudentRecord[#1000 Alice, 3 scores, avg:90.67, grade:A]` | |
| `System.out.println(StudentRecord.getHighestScoreEver());` | `99` | 150 was rejected, record unchanged |
| `StudentRecord s3 = new StudentRecord("Carol");` | *(none)* | ID auto-assigned: 1002 |
| `System.out.println(s3.getAverage());` | `0.0` | No scores yet |
| `System.out.println(s3.getLetterGrade());` | `F` | 0.0 < 60 |
::

### Walkthrough

The spec calls for static variables `nextId` (starts at 1000), `totalStudents`, and `highestScoreEver` (starts at −1). But here's the design question: how do we store an unbounded list of scores without using arrays or `ArrayList`?

The trick is that we don't need to store individual scores at all. To compute an average, we only need two numbers: the running total of all scores and how many have been submitted. So we use two instance variables: `totalPoints` (an `int`) and `scoreCount` (an `int`). This is a common pattern — maintain a **running aggregate** rather than a collection of raw data.

```java
public class StudentRecord {
    private final String name;
    private final int id;
    private int totalPoints;
    private int scoreCount;
    private static int nextId = 1000;
    private static int totalStudents;
    private static int highestScoreEver = -1;

    public StudentRecord(String name) {
        this.name = name;
        this.id = StudentRecord.nextId;
        StudentRecord.nextId++;
        this.totalPoints = 0;
        this.scoreCount = 0;
        StudentRecord.totalStudents++;
    }
}
```

`addScore` validates the input, then updates both the running total and the count. If the score is a new global record, it also updates the static tracker.

```java
public void addScore(int score) {
    if (score >= 0 && score <= 100) {
        this.totalPoints += score;
        this.scoreCount++;
        if (score > StudentRecord.highestScoreEver) {
            StudentRecord.highestScoreEver = score;
        }
    }
}
```

`getAverage()` divides total points by score count. The zero-guard prevents division by zero; the cast to `double` prevents integer division from truncating the result.

```java
public double getAverage() {
    if (this.scoreCount == 0) return 0.0;
    return (double) this.totalPoints / this.scoreCount;
}
```

::WarningBox
The cast `(double) this.totalPoints` must come *before* the division. Without it, integer division truncates: `272 / 3` yields `90`, not `90.666...`.
::

`getLetterGrade()` delegates to `getAverage()`. If the averaging logic ever changes, the grade computation automatically benefits.

```java
public String getLetterGrade() {
    double avg = this.getAverage();
    if (avg >= 90) return "A";
    if (avg >= 80) return "B";
    if (avg >= 70) return "C";
    if (avg >= 60) return "D";
    return "F";
}
```

The remaining accessors and `toString`:

```java
public String getName()      { return this.name; }
public int getId()           { return this.id; }
public int getScoreCount()   { return this.scoreCount; }

public String toString() {
    return "StudentRecord[#" + this.id + " " + this.name
         + ", " + this.scoreCount + " scores"
         + ", avg:" + String.format("%.2f", this.getAverage())
         + ", grade:" + this.getLetterGrade() + "]";
}

public static int getTotalStudents()   { return StudentRecord.totalStudents; }
public static int getHighestScoreEver() { return StudentRecord.highestScoreEver; }
```

::Folding{title="Full StudentRecord class"}
```java
public class StudentRecord {
    private final String name;
    private final int id;
    private int totalPoints;
    private int scoreCount;
    private static int nextId = 1000;
    private static int totalStudents;
    private static int highestScoreEver = -1;

    public StudentRecord(String name) {
        this.name = name;
        this.id = StudentRecord.nextId;
        StudentRecord.nextId++;
        this.totalPoints = 0;
        this.scoreCount = 0;
        StudentRecord.totalStudents++;
    }

    public void addScore(int score) {
        if (score >= 0 && score <= 100) {
            this.totalPoints += score;
            this.scoreCount++;
            if (score > StudentRecord.highestScoreEver) {
                StudentRecord.highestScoreEver = score;
            }
        }
    }

    public double getAverage() {
        if (this.scoreCount == 0) return 0.0;
        return (double) this.totalPoints / this.scoreCount;
    }

    public String getLetterGrade() {
        double avg = this.getAverage();
        if (avg >= 90) return "A";
        if (avg >= 80) return "B";
        if (avg >= 70) return "C";
        if (avg >= 60) return "D";
        return "F";
    }

    public String getName()      { return this.name; }
    public int getId()           { return this.id; }
    public int getScoreCount()   { return this.scoreCount; }

    public String toString() {
        return "StudentRecord[#" + this.id + " " + this.name
             + ", " + this.scoreCount + " scores"
             + ", avg:" + String.format("%.2f", this.getAverage())
             + ", grade:" + this.getLetterGrade() + "]";
    }

    public static int getTotalStudents()   { return StudentRecord.totalStudents; }
    public static int getHighestScoreEver() { return StudentRecord.highestScoreEver; }
}
```
::

::HintBox
This design — `totalPoints` + `scoreCount` instead of a list — is an example of **maintaining a running aggregate**. You don't need to store every data point if you only ever need their sum and count. The same pattern appears whenever a problem asks for an average or a total: accumulate as you go, rather than collecting and computing later. It's simpler and uses less memory.
::

---

## What these three problems have in common

Look across all three solutions and you'll see a repeatable workflow:

1. **Extract the spec.** The trace table *is* the specification — it tells you every method name, every parameter, every return value, and every edge case. Implement exactly what the table exercises.

2. **Separate instance from class.** Instance variables (`phase`, `cans`, `totalPoints`) belong to each object. `static` variables (`count`, `totalCansSold`, `highestScoreEver`) belong to the class as a whole. Ask yourself: *if I create a second object, should this value be shared or independent?*

3. **Constructor initializes everything.** Every instance variable should be set in the constructor. Uninitialized variables — especially object references defaulting to `null` — are the source of countless `NullPointerException` bugs.

4. **Validate at the boundary.** `restock(int amount)` guards against non-positive input. `addScore(int score)` rejects scores outside 0–100. Invalid input should be rejected where it enters the class, not silently corrupt internal state.

5. **Derive, don't duplicate.** `isDangerous()`, `isLowStock()`, and `getLetterGrade()` all compute their answer from existing instance variables. They don't store a separate boolean that could become stale. A stored `isLowStock` boolean, for example, would need to be manually updated every time `cans` changes — an easy thing to forget.

6. **Static accessors for static data.** `getCount()`, `getTotalCansSold()`, `getHighestScoreEver()` are `static` because they answer questions about the *class*, not about any particular object. They should be called as `ClassName.method()`, not `someObject.method()`.

That's the pattern. The rest is practice.
