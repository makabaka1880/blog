<template>
    <div class="prose-blockquote-container">
        <div class="prose-blockquote-content-container">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
.prose-blockquote {
    &-container {
        position: relative;
        margin: 1.25em 0;
        padding: 0.75em 1.25em 0.75em 1.5em;

        border-left: 0.25rem solid var(--color-border);
        border-radius: 0.25rem;

        background-color: var(--color-card-bg);
        color: var(--color-text);

        line-height: 1.6;

        /* subtle depth */
        box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.04);
    }

    &-content-container {
        position: relative;

        &::before {
            font-family: 'Noto Serif', serif;
            content: '“';
            position: absolute;
            top: -0.2em;

            font-size: var(--font-size-quote);
            line-height: 1;
            font-weight: 700;

            color: var(--color-border);
            opacity: 0.15;

            pointer-events: none;
            user-select: none;
        }

        > p {
            margin: 0.5em 0;
        }

        > p:first-child {
            margin-top: 0;
        }

        > p:last-child {
            margin-bottom: 0;
        }
    }
}

</style>
