---
title: Designing KumoLang
description: Making correct cheesecakes.
createTime: 2026-06-13
updateTime: 2026-06-13
---

::LinkCard
---
title: KumoLang
details: Making Correct Cheesecakes.
url: https://kumo-lang.makabaka1880.xyz
---
::

::QuoteBox{source="Kumo"}
:Pic{src="Screenshot 2026-06-13 at 13.51.19.webp"}
::


T'was the end of semester, and needless to say, a time for mischeif. As a tribute to our dear CSA teacher Mr. Kumo and our favourite bakery KumoKumo, we present to the world **KumoLang - The First Formal Verification Language For Cake Culinary**.

> **Disclaimer**
> 
> First of all this is an academic parody. We are not affliated with KumoKumo and *Kumo* was not, is not, and will not be associated any individual or organization identified by "Kumo".
>
> Aside from the language itself, everything (the paper, interpreter, website and WASM bindings) is written by Claude Code under human supervision. 
> 
> KumoLang *is* actually usable and frankly a pretty novel approach to culinary (well maybe because formal culinary is pretty stupid afterall).

## 0x00. Brainstorming

I initially thought of a stack-based language. You can push ingredients onto the stack and combine them using operations.

$$
\begin{align}
p & ::= && s; p \; \\
& \mid && \texttt{skip} \\
s & ::= && \texttt{push}(a) \\
& \mid && \texttt{pop} \\
& \mid && \texttt{squish}(a, n) \\
\end{align}
$$

Let $V$ be a set of atoms. We write $a \in V$ for atoms and let $T(V)$ denote the set of $V$-labeled trees. The global stack $\sigma$ stores elements of $T(V)$.

::NoteBox
Some nuances on the notation. Since this language is essentially an effect system, termination will not be modeled as evaluation to a particular value. Therefore I use $\nrightarrow$ for the termination command `skip`.

I denote a stack as a linked list:

$$
\sigma ::= t \cdot \sigma' \;\mid\; \emptyset
$$

where $t \in T(V)$.

I use the notation $a(t_1, t_2, \dots, t_n)$ for a tree with root label $a$ and children $t_1, t_2, \dots, t_n$.
::

You can $\texttt{push}$ elements onto the stack:

$$
\frac{}{\langle \texttt{push}(a); P \;,\; \sigma \rangle \to \langle P\;,\; a() \cdot \sigma\rangle} (\text{Push})
$$

$\texttt{pop}$ elements off the stack,

$$
\frac{\sigma = t \cdot \sigma'}{\langle \texttt{pop}; P \;,\; \sigma \rangle \to \langle P\;,\; \sigma' \rangle} (\text{Pop})
$$

and combine the top $n$ elements by popping them from the stack, forming a new tree with root label $a$, using the $n$ popped trees as children, and pushing the resulting tree back.

$$
\frac{\sigma = t_1 \cdot t_2 \cdots t_n \cdot \sigma'}{ \langle \texttt{squish}(a, n); P \;,\; \sigma \rangle \to \langle P \;,\; a(t_1, t_2, \dots, t_n) \cdot \sigma' \rangle} (\text{Squish})
$$

At last, termination:

$$
\frac{}{\langle \texttt{skip} \;,\; \sigma \rangle \nrightarrow}(\text{Stasis})
$$

BTW this language is already powerful enough to construct any tree.

::LemmaBox{id="Completeness of Stack-Based KumoLang"}
Let $T(V)$ denote the set of $V$-labeled trees. Then for any $t \in T(V)$ and stack $\sigma$ over $T(V)$, there exists a program $P$ such that

$$
\langle P \;,\; \sigma \rangle \to^\ast \langle \texttt{skip} \;,\; t \cdot \sigma \rangle
$$

where $\to^\ast$ denotes an arbitrary chain of evaluation.

:::Folding{title="Proof"}
We proceed by structural induction on the construction of the tree $t$.

**Leaf.** Consider $t = a()$ and environment $\sigma$. Then the program $\texttt{push}(a);\, \texttt{skip}$ evaluates to $t \cdot \sigma$.

**Subtree.** Consider $t = a(t_1, t_2, \dots, t_n)$ and environment $\sigma$. By the inductive hypothesis, we can construct a program $P_1$ that evaluates to $\sigma_1 = t_n \cdot \sigma$. Now consider $\sigma_1$ as an environment. By the inductive hypothesis, we can construct a program $P_2$ that evaluates to $\sigma_2 = t_{n-1} \cdot \sigma_1$. Continuing in this way, we obtain programs $P_1, P_2, \dots, P_n$ whose concatenation evaluates to

$$
t_1 \cdot t_2 \cdots t_n \cdot \sigma.
$$

By appending $\texttt{squish}(a, n);\, \texttt{skip}$, we obtain

$$
a(t_1, t_2, \dots, t_n) \cdot \sigma.
$$

Therefore the inductive case holds.

:Qed

:::
::

However this does not offer anything other then a topological ordering of the dependency graph. This is useful, but not merely enough to be made into a language. Also using a single stack to build an entire recipe tree is very unintuitive.

After pondering around for a bit I had enough of effect systems and single-state semantics. So I tried to get sth out of more environment-oriented design that focues more on individual entities and provides access to the environment through bindings. 


## 0x01. Semantics


At last I thought of treating culinary containers as first class citizens. 

> What *is* a container, you ask? If you enjoy academic jargon, it is a provenance-preserving, monoid-enriched aggregation context parameterized over a culinary mixture domain and admitting variadic compositional fusion. Otherwise, it's just a bowl of stuff that you can pour together and give a name.

Here's the syntax for the language

$$
\begin{align}
P & ::= && \texttt{skip} &&& \text{(Stasis)} \\
  & \mid  && s \;;\; P &&& \text{(Sequence)} \\ \\
s & ::= && x \leftarrow \text{\texttt{new-mixture}}() &&& \text{(Domain allocation)} \\
  & \mid  && y \leftarrow \text{\texttt{prep}}(x) &&& \text{(Lift mixture $x$ to container $y$)} \\
  & \mid  && y \leftarrow \text{\texttt{pour}}(y, z) &&& \text{(Merge container $z$ into container $y$)} \\
  & \mid  && z \leftarrow \text{\texttt{pour-out}}(y, x) &&& \text{(Type casting: lift container $y$ into domain $x$)} \\
\end{align}
$$

KumoLang has a very simple type system based on the concept of "mixture". To create one, you call `new-mixture` to declare sth like an "atomic type" in other languages. Each container has a domain, which is a mixture. You can only mix containers of the same domain together. Even though this level of type safety does not actually bring any safeguard ergonomics into usage, it does encourage the types-as-documentation paradigm.

Let's first define some semantic domains. First of all, using the syntatic identifier of the declared mixture as the semantic label for it really seems wierd. First of all, in an interpreter keeping track of mixtures using UUIDs or integers is significantly more efficient then strings. Secondly it just makes you look more professional. 

We define $\mathcal M$ to be the set of nominal mixture labels, and $\mathcal L_m$ be a family of sets indexed by mixtures. 

$$
\begin{align*}
m &\in \mathcal M \\
L &\in \mathcal L_m = \text{List}\langle m\rangle \\
\end{align*}
$$

For any $L \in \mathcal L_m$, $L$ is the set of all lists of ingredients that could be the chronological history log of ingredients poured into a certain container. The environment is a map $\sigma : \text{Var} \to \mathcal M \cup  \bigcup \{\mathcal L_m\}$

To define a mixture, use the `new-mixture` command, which assigns the identifier $x$ a random label $m$ from the nomimal mixture domain:

$$
\frac{
    m \notin \text{img}(\sigma)
}{
    \langle x \leftarrow \texttt{new-mixture}(); P \;,\; \sigma \rangle \to \langle P \;,\; \sigma[x \mapsto m] \rangle
}
$$

I had quite a thought on how to formalize ingredients and containers. And at last I decided to completely ditch the idea of making ingredients seperate definable entities. Ingredients could only appear in containers. Therefore you can only introduce ingredients via declaring a new container, which could be done via $\texttt{prep}(x)$, where $x$ is a mixture:

$$
\frac{
    \sigma(x) = m
}{
    \langle y \leftarrow \texttt{prep}(x); P \;,\; \sigma \rangle \to \langle P \;,\; \sigma[y \mapsto [m]] \rangle
}
$$

In order to combine mixtures, we introduce the $\texttt{pour}(x,y)$ method. When $x$ and $y$ are of the same mixture, you can pour them into a new container:

$$
\frac{
    \sigma(x) = L_1 \in \mathcal{L}_m \quad \sigma(y) = L_2 \in \mathcal{L}_m
}{
    \langle z \leftarrow \texttt{pour}(x,y); P \;,\; \sigma \rangle \to \langle P \;,\; \sigma[z \mapsto L_1 \mathbin{+\!\!+} L_2] \rangle
}
$$

But most of the time containers are not of the same mixture. Therefore we introduce $\texttt{pour-out}(x, y)$ to do a "type lifting" that transforms a container $x$ to another container of mixture $y$:

$$
\frac{
    \sigma(x) = L_1 \in L_m \quad \sigma(y) = m
}{
    \langle z \leftarrow \texttt{pour-out}(x, y) ; P \;,\; \sigma \rangle \to \langle P \;,\; \sigma[x \mapsto [], z \mapsto [m]]
}
$$

At last the termination rule:

$$
\frac{}{
    \langle \texttt{skip} ; P \;,\; \sigma \rangle \nrightarrow
}
$$