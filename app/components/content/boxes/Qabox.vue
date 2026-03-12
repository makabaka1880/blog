<template>
    <BaseBox :header-text="headerText" :background-char="backgroundChar" :box-type="props.type"
        :box-class="`qa-box qa-box-${props.type}`">
        <template #header>
            {{ headerText }}
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import BaseBox from './BaseBox.vue'

const props = defineProps({
    type: {
        type: String as PropType<'question' | 'answer'>,
        default: 'question'
    }
})

const headerText = computed(() =>
    props.type === 'question' ? 'QUESTION' : 'ANSWER'
)

const backgroundChar = computed(() =>
    props.type === 'question' ? 'Q' : 'A'
)
</script>

<style lang="scss" scoped>
/* QA box specific styles can go here */
.qa-box {
    // Any QA-specific styles would go here
}

.qa-box-question {
    // Qxuestion-specific overrides
}

.qa-box-answer {
    // Answer-specific overrides
}
</style>
