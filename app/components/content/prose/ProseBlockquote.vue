<template>
    <div class="prose-blockquote-container">
        <div class="prose-blockquote-content">
            <slot />
        </div>
        <div class="prose-blockquote-background-char">“</div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">

.prose-blockquote {
    &-container {
        position: relative;
        margin: 1.25em 0;
        padding: 0.75em 1.25em 0.75em 1.5em;

        border-left: 0.25rem solid var(--color-border);
        border-radius: var(--border-radius-box);

        background-color: var(--color-card-background);
        color: var(--color-text);

        line-height: 1.6;

        /* subtle depth */
        box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.04);
        overflow: hidden;
    }

    &-content {
        position: relative;
        z-index: 1;

        >p {
            margin: 0.5em 0;
        }

        >p:first-child {
            margin-top: 0;
        }

        >p:last-child {
            margin-bottom: 0;
        }
    }

    &-background-char {
        position: absolute;
        top: -0.25em;

        left: 0.75rem;

        font-family: 'Noto Serif', serif;
        font-size: var(--font-size-quote);
        font-weight: 700;
        color: var(--color-box-background-char);
        z-index: 0;
        pointer-events: none;
        user-select: none;
    }

}
</style>
