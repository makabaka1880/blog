<template>
    <main class="container">
        <h1>Hi there 👋 </h1>
        <p>Welcome to the Teal Blog.</p>
        <section class="intro">
            <p>
                I'm Sean, a high school student in Shanghai. I'm <b>{{ age.toFixed(10) }}</b> years old, and I'm
                interested in software engineering, computer science, and formal mathematics.
            </p>
            <p>
                Outside academics, I enjoy music, chess, and 3D art. This site is where I collect notes, experiments,
                and personal projects.
            </p>
        </section>

        <section>
            <h2>Tech Stack</h2>
            <p>
                I work across frontend and backend systems. On the frontend I mainly use SwiftUI, UIKit, Vue, and
                Nuxt. On the backend I use Vapor, Express, and PostgreSQL.
            </p>
            <p>
                For research and theory work, I use Haskell, Lean, Python, and R. For miscellaneous projects, I also
                use Rust, C++, and Elixir. My markup language of choice is Typst.
            </p>
            <p>
                In my free time, I build small utilities and implement ideas from type theory. I also maintain what I
                believe is the only <a href="https://github.com/makabaka1880/learn-tt">public repository of
                    solutions</a> to exercises from Nederpelt's
                <a href="https://research.tue.nl/en/publications/type-theory-and-formal-proof-an-introduction/"
                    target="_blank" rel="noopener noreferrer">Type Theory and Formal Proof</a>.
            </p>
        </section>

        <section>
            <h2>Art & Photography</h2>
            <p>
                I create 3D renders in Blender, often using open-source assets. One of my recent pieces recreates a
                frame from the second scene of my render collection, inspired by poolcore aesthetics.
            </p>
            <p>
                For photography, I use a Sony A7II (ILCE-7M2). I also do VFX and composition work for friends, mainly
                with DaVinci Resolve and Blender on an M2 MacBook Pro (2022, 13-inch).
            </p>
        </section>
        <hr class="sep"/>
        <UIKitComment />
    </main>

</template>

<script setup lang="ts">
const birth = new Date('2009-12-28T00:00:00');
const now = ref(Date.now());
let ticker: ReturnType<typeof setInterval> | null = null;

const age = computed(() => {
    const diffInYears = (now.value - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return diffInYears;
});

onMounted(async () => {
    ticker = setInterval(() => {
        now.value = Date.now();
    }, 50);
});

onBeforeUnmount(() => {
    if (!ticker) return;
    clearInterval(ticker);
    ticker = null;
});
</script>


<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 0;
}

section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

h1 {
    margin: 0;
}

h2 {
    margin: 0;
}

p {
    margin: 0;
    line-height: 1.5;
}

a {
    color: var(--color-link);
}

</style>
