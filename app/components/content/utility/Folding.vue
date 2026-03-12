<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>

<template>
    <details>
        <summary>
            <slot name="title">
                {{ title }}
            </slot>
        </summary>
        <slot />
    </details>
</template>

<style lang="scss" scoped>
details {
    margin: 1em 0;
    padding: 1em 1.5em;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.5em;
    background-color: var(--color-card-background);
    font-size: var(--font-size-md);

    &[open] {
        >summary {
            margin-bottom: 0.5em;
            font-weight: bold;
            color: currentcolor;

            &::before {
                content: "Fold";
            }
        }
    }

    >summary {
        margin: -0.5em -0.8em;
        padding: 0.5em 0.8em;
        color: var(--color-text-muted);
        transition: all 0.2s;
        cursor: pointer;

        > :deep(p) {
            display: inline;
        }

        &::before {
            content: "Expand";
            float: right;
            float: inline-end;
            opacity: 0.5;
            margin-inline-start: 0.5em;
            font-weight: normal;
            transition: color 0.2s;
        }

        &:hover {
            color: var(--color-text);
        }
    }

    > :deep(.z-codeblock) {
        margin: 0 -0.8em -0.5em;
    }
}
</style>
