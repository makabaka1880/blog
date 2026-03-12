<template>
    <div class="derivation-wrapper" :class="{ center }">
        <div class="derivation-container">
            <div class="flag-column">
                <slot name="flag" />
            </div>

            <slot name="pole" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const props = defineProps({
    center: {
        type: Boolean,
        default: false
    }
});

const slots = useSlots();
</script>

<style scoped>
.derivation-wrapper {
    display: flex;
}

.derivation-wrapper.center {
    justify-content: center;
}

.derivation-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-left: 2px #000 solid;

    &>* {
        width: max-content
    }

    & .flag-column {
        padding: 0.5rem 1rem;
        border: 2px #000 solid;
        transform: translateX(-2px);

        &>* {
            margin: 0;
        }
    }

    &> :not(.flag-column) {
        margin: 0;
        margin-left: 1rem;
    }
}
</style>