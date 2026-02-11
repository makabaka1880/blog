<template>
    <section class="hero">
        <!-- ART LAYER -->
        <DrinkAnimation class="art" />

        <!-- CONTENT LAYER -->
        <div class="content">
            <small id="draggable-hint"><- This is draggable</small>
                    <h2>Hi There 👋</h2>
                    <GlitchedElement>
                        <h1 style="margin-top: 0; margin-bottom: 2rem;">{{ blogConfig.title }}</h1>
                    </GlitchedElement>

                    <p>Welcome To the Teal Blog.</p>

                    <h2 style="margin-top:2rem;">Latest Posts</h2>
                    <div class="article-list">
                        <div v-for="article in recentArticles" :key="article.path" class="article-item">
                            <NuxtLink :to="article.path" class="content-entry">
                                <small>{{ new Date(article.createTime).toLocaleDateString() }}</small>
                                <strong>{{ article.title }}</strong>
                            </NuxtLink>
                        </div>
                        <div class="article-item">
                            <a href="/posts">More -> </a>
                        </div>
                    </div>

                    <div class="scroll-indicator" :class="{ 'hidden': showAuthorSection }" style="margin: 3rem 0;">
                        <em>Continue Scrolling...</em>
                    </div>

                    <div class="author-section" :class="{ 'scroll-up': showAuthorSection }">
                        <h2 class="section-header">The Author</h2>
                        <p>
                            I'm Sean, currently a highschooler. I'm <strong>{{ age.toFixed(9) }}</strong> years old, and
                            I
                            live
                            in
                            Shanghai. </p>

                        <p>
                            I like software engineering, computer science, and formal mathematics. I also enjoy music,
                            chess,
                            and 3D
                            art.
                        </p>

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

                    </div>
        </div>
    </section>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import blogConfig from '~~/blog.config';

const videoEnded = ref(false);  // Track whether the first video has ended
const glitched = ref<{ startGlitch: () => void; stopGlitch: () => void } | null>(null);
const birth = new Date(blogConfig.birth)
const age = ref(getAgeInDecimal(birth));
const recentArticles = ref<any[]>([]);
const showAuthorSection = ref(false);




onMounted(async () => {
    const scrollThreshold = window.innerHeight / 200; // Show author section when scrolled past 300px
    const result = await queryCollection('articles').select('title', 'description', 'createTime', 'path').order('createTime', 'DESC');
    const allArticles = await result.all();
    recentArticles.value = allArticles.slice(0, 3);

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        console.log(currentScroll, scrollThreshold)
        showAuthorSection.value = currentScroll > scrollThreshold;
    })

    setInterval(() => {
        age.value = getAgeInDecimal(birth)
    })
});


function getAgeInDecimal(dateOfBirth: Date, currentDate: Date = new Date()): number {
    const diffInMs = currentDate.getTime() - dateOfBirth.getTime();
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // Convert ms to years (taking leap years into account)
    return diffInYears;
}

</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

/* ROOT */
.hero {
    // min-height: 100vh;
    display: flex;
    align-items: center;
}

/* ---------------- ART ---------------- */
/* 🚫 NOT in layout, 🚫 NOT flex child */
.art {
    position: fixed;
    left: 0;
    top: 50%;
    width: 45vw;

    transform: translateY(-50%);
    pointer-events: none;
    z-index: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    mix-blend-mode: darken;

    :deep(canvas) {
        pointer-events: auto;
    }
}

/* ---------------- CONTENT ---------------- */
.content {
    position: relative;
    z-index: 1;

    max-width: 75ch;
    margin-left: calc(75vw - 40em);
    padding: 4rem 4rem 8rem;
}

/* ---------------- SCROLL INDICATOR ---------------- */
.scroll-indicator {
    opacity: 1;
    transition: opacity 0.3s ease-out;
}

.scroll-indicator.hidden {
    opacity: 0;
}

/* ---------------- AUTHOR SECTION ---------------- */
.author-section {
    opacity: 0;
    transform: translateY(100%);
    /* Initially out of view */
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    margin: 5rem 0;
}

.author-section.scroll-up {
    opacity: 1;
    transform: translateY(0);
    /* Animate back into view */
}

/* ---------------- SECTION HEADER ---------------- */
.section-header {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

/* ---------------- TECH STACK GRID ---------------- */
.tech-stack-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
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

body {
    overflow-x: hidden;
}

/* ---------------- ARTICLE LIST ---------------- */
.article-list {
    text-align: left;

    .article-item {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: start;
        padding: 0.75rem;
        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

        &:hover {
            background-color: var(--color-card-hover-bg);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .content-entry {
            display: contents;
            text-decoration: none;
            color: inherit;

            small {
                color: var(--text-muted);
                font-size: 0.875rem;
                white-space: nowrap;
            }

            strong {
                font-weight: 600;
            }
        }
    }

    .article-item:last-child {
        border: none;
        background: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}

/* ---------------- MOBILE ---------------- */
@media (max-width: $critical-width) {
    #draggable-hint {
        display: none;
    }

    .hero {
        min-height: 100vh;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .art {
        position: fixed;
        inset: 0;
        width: 100%;
        transform: translateY(20vh) translateX(10vw) scale(1.4);
        opacity: 0.2;
        z-index: -1;
    }

    .content {
        width: 100%;
        padding: 2rem;
        margin-left: 0;
        box-sizing: border-box;
    }
}
</style>
