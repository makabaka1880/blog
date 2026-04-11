<template>
    <details v-if="collapsible" class="feature-error-box" :open="open">
        <summary class="feature-error-content">
            <strong class="error-title">
                <Icon name="uil:exclamation-octagon" size="1.2em" />
                <span>Error</span>
            </strong>
            <Icon name="uil:angle-right" class="summary-marker" size="1em" />
        </summary>
        <small class="error-message">{{ msg }}</small>
    </details>
    <div v-else class="feature-error-box">
        <small class="feature-error-content">
            <strong class="error-title">
                <Icon name="uil:exclamation-octagon" size="1.2em" />
                <span>Error</span>
            </strong>
            <span class="error-message">{{ msg }}</span>
        </small>
    </div>
</template>

<style lang="scss" scoped>
.feature-error-box {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 0.0625rem var(--color-error-border) solid;
    background-color: var(--color-error-bg);
    text-align: left;

    &[open] .summary-marker {
        transform: rotate(90deg);
    }

    &[open] .error-message {
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

    .feature-error-content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-error-text);
    }

    .error-title {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
    }

    .summary-marker {
        transition: transform 0.2s ease;
    }

    .error-message {
        color: var(--color-error-text);
    }
}

// Collapsible version specific styles
details.feature-error-box .error-message {
    display: block;
    margin-top: 0.25rem;
    opacity: 0;
    transform: translateY(-0.5rem);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

// Non-collapsible version specific styles
div.feature-error-box .feature-error-content {
    flex-wrap: wrap;
}

div.feature-error-box .error-message {
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
