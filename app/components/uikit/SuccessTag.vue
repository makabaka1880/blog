<template>
    <details v-if="collapsible" class="feature-success-box" :open="open">
        <summary class="feature-success-content">
            <strong class="success-title">
                <Icon name="uil:check-circle" size="1.2em" />
                <span>Okay</span>
            </strong>
            <Icon name="uil:angle-right" class="summary-marker" size="1em" />
        </summary>
        <small class="success-message">{{ msg }}</small>
    </details>
    <div v-else class="feature-success-box">
        <small class="feature-success-content">
            <strong class="success-title">
                <Icon name="uil:check-circle" size="1.2em" />
                <span>Okay</span>
            </strong>
            <span class="success-message">{{ msg }}</span>
        </small>
    </div>
</template>

<style lang="scss" scoped>
.feature-success-box {
    padding: 0.6rem;
    border-radius: 0.4rem;
    border: 1px var(--color-success-border) solid;
    background-color: var(--color-success-bg);
    text-align: left;

    &[open] .summary-marker {
        transform: rotate(90deg);
    }

    &[open] .success-message {
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

    .feature-success-content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-success-text);
    }

    .success-title {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
    }

    .summary-marker {
        transition: transform 0.2s ease;
    }

    .success-message {
        color: var(--color-success-text);
    }
}

// Collapsible version specific styles
details.feature-success-box .success-message {
    display: block;
    margin-top: 0.25rem;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

// Non-collapsible version specific styles
div.feature-success-box .feature-success-content {
    flex-wrap: wrap;
}

div.feature-success-box .success-message {
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