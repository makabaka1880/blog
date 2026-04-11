<template>
    <details v-if="collapsible" class="feature-warning-box" :open="open">
        <summary class="feature-warning-content">
            <strong class="warning-title">
                <Icon name="uil:exclamation-triangle" size="1.2em" />
                <span>Warning</span>
            </strong>
            <Icon name="uil:angle-right" class="summary-marker" size="1em" />
        </summary>
        <small class="warning-message">{{ msg }}</small>
    </details>
    <div v-else class="feature-warning-box">
        <small class="feature-warning-content">
            <strong class="warning-title">
                <Icon name="uil:exclamation-triangle" size="1.2em" />
                <span>Warning</span>
            </strong>
            <span class="warning-message">{{ msg }}</span>
        </small>
    </div>
</template>

<style lang="scss" scoped>
.feature-warning-box {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 0.0625rem var(--color-warning-border) solid;
    background-color: var(--color-warning-bg);
    text-align: left;

    &[open] .summary-marker {
        transform: rotate(90deg);
    }

    &[open] .warning-message {
        opacity: 1;
        transform: translateY(0);
    }

    & summary {
        cursor: pointer;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &::-webkit-details-marker {
            display: none;
        }
    }

    .feature-warning-content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-warning-text);
    }

    .warning-title {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
    }

    .summary-marker {
        transition: transform 0.2s ease;
    }

    .warning-message {
        color: var(--color-warning-text);
    }
}

// Collapsible version specific styles
details.feature-warning-box .warning-message {
    display: block;
    margin-top: 0.25rem;
    opacity: 0;
    transform: translateY(-0.5rem);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

// Non-collapsible version specific styles
div.feature-warning-box .feature-warning-content {
    flex-wrap: wrap;
}

div.feature-warning-box .warning-message {
    display: inline;
}
</style>
<script setup lang="ts">
const props = withDefaults(defineProps<{
    msg: string,
    collapsible?: boolean,
    open?: boolean
}>(), {
    collapsible: true,
    open: false
});
</script>
