<template>
    <div class="content-section">
        <h2 class="section-header">Tech Stack</h2>
        <div class="tech-stack-grid">
            <div class="grid-item">
                <h3>Frontend</h3>
                <p>SwiftUI / UIKit / Vue / Nuxt</p>
            </div>
            <div class="grid-item">
                <h3>Backend</h3>
                <p>Vapor / Express / PostgreSQL</p>
            </div>
            <div class="grid-item">
                <h3>Research</h3>
                <p>Haskell / Lean / Python / R</p>
            </div>
            <div class="grid-item">
                <h3>Miscellaneous</h3>
                <p>Rust / C++ / Elixir</p>
            </div>
        </div>
        <p>In my free time, I mainly code fun utilies or implement fun theories. I am learning type theory, and is
            maintaining the <a href="https://github.com/makabaka1880/learn-tt"><a href="https://github.com/makabaka1880/learn-tt"></a><strong>only</strong> repository on github</a> of answers
            to R.P. Nederpelt's <a
                href="https://research.tue.nl/en/publications/type-theory-and-formal-proof-an-introduction/">Formal
                Proof and Type Theory.</a></p>
    </div>
</template>

<style lang="scss" scoped>
.content-section {
    margin: 2rem 0;
}

.section-header {
    margin-top: 3rem;
    margin-bottom: 1rem;
}

.tech-stack-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 2rem 0;
}

.grid-item {
    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }

    p {
        margin: 0;
        color: var(--text-secondary);
    }

}

:deep(a) {
    text-decoration: underline;
}
</style>