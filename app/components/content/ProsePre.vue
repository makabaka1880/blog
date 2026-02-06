<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
    code?: string
    language?: string
    filename?: string
    highlights?: number[]
    meta?: string
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    code: '',
    highlights: () => [],
})

interface CodeblockMeta {
    icon?: string
    [key: string]: string | boolean | undefined
}

// Parse meta information
const meta = computed(() => {
    if (!props.meta) return {}

    return props.meta.split(' ').reduce((acc: CodeblockMeta, item) => {
        const [key, value] = item.split('=')
        acc[key!] = value ?? true
        return acc
    }, {})
})

// Copy functionality


</script>

<template>
    <div class="code-block-wrapper">
        <div v-if="filename" class="code-header">
            <span class="filename">{{ filename }}</span>
        </div>

        <div class="code-block">
            <pre :class="props.class"><slot /></pre>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.code-block-wrapper {
    margin: 1em 0;
    border-radius: 0.5em;
    background-color: var(--color-code-bg);
    overflow: hidden;
}

.code-header {
    position: relative;
    padding: 0.75em 1em;
    background-color: var(--color-card-bg);
    border-bottom: 1px solid var(--color-border);
    font-family: 'JetBrains Mono', monospace;

    .filename {
        color: var(--color-text);
        font-weight: 500;
    }
}


.code-block {
    position: relative;
    padding: 1em 0;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.9rem;
    line-height: 1.6;

    * {
        font-family: inherit !important;
    }

    pre {
        margin: 0;
        padding: 0 1em 0 5em;
        overflow-x: auto;
        white-space: pre;
        tab-size: 2;

        code {
            display: block;
            font-family: inherit;
        }
    }
}

// Line numbers and divider
:deep(.line) {
    position: relative;

    &::before {
        content: attr(line);
        position: absolute;
        left: -4.5em;
        width: 3.5em;
        text-align: right;
        color: var(--color-text-muted);
        user-select: none;
    }

    &::after {
        content: '';
        position: absolute;
        left: -0.5em;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: var(--color-border);
        opacity: 0.5;
    }

    &.highlight {
        background-color: var(--color-highlight-bg);
    }
}
</style>
