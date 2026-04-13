<template>
    <BaseBox background-char='🤔' :box-type="'mcq'"
        :box-class="`mcq-box ${selectedIndex !== null ? (isCorrect ? 'mcq-correct' : 'mcq-incorrect') : ''}`">
        <template #header>
            Multiple Choice Question
        </template>
        <div class="mcq-content">
            <slot name="prompt" />

            <p class="mcq-question">
            </p>

            <div class="mcq-options">
                <button v-for="(option, index) in options" :key="index" class="mcq-option"
                    :class="{ 'mcq-option-selected': selectedIndex === index, 'mcq-option-correct': selectedIndex !== null && option === correctValue, 'mcq-option-incorrect': selectedIndex === index && !isCorrect }"
                    :disabled="selectedIndex !== null" @click="selectOption(index)">
                    <span v-html="renderMath(option)" />
                </button>
            </div>
            <div v-if="selectedIndex !== null" class="mcq-feedback">
                <div v-if="isCorrect">
                    <p>Correct! 🎉</p>
                </div>
                <div v-else class="mcq-feedback-incorrect">
                    <p>Incorrect. 😔</p>
                </div>
                <div>
                    <slot name="explanation" />
                </div>
            </div>
        </div>
    </BaseBox>
</template>

<script lang="ts" setup>
import katex from 'katex'
function renderMath(text: string): string {
    return text.replace(/\$(.+?)\$/g, (_, expr) => {
        try {
            return katex.renderToString(expr, { throwOnError: false })
        } catch {
            return expr
        }
    })
}

import BaseBox from '../boxes/BaseBox.vue'
import { computed, ref } from 'vue'

interface Props {
    options: string[]
    correct: string | number
}

const props = defineProps<Props>();

const selectedIndex = ref<number | null>(null)

const correctValue = computed(() => {
    if (typeof props.correct === 'number') {
        return props.options[props.correct - 1]
    }
    return props.correct
})

const isCorrect = computed(() => {
    if (selectedIndex.value === null) return false
    return props.options[selectedIndex.value] === correctValue.value
})

function selectOption(index: number) {
    if (selectedIndex.value !== null) return
    selectedIndex.value = index
}
</script>

<style lang="scss" scoped>
.mcq-box {
    background-color: var(--color-card-background);
    border-color: var(--color-border);
    transition: border-color 0.2s ease;
    --box-header-color: var(--color-text);
    --box-bg-char-color: var(--color-text-muted);
    --box-bg-char-opacity: 0.1;
}

.mcq-box.mcq-correct {
    border-color: var(--color-success-border);
}

.mcq-box.mcq-incorrect {
    border-color: var(--color-error-border);
}

.mcq-content {
    color: var(--color-text);
}

.mcq-question {
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: var(--font-size-md);
}

.mcq-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.mcq-option {
    padding: 0.75rem 1rem;
    border: 0.125rem solid var(--color-border);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-card-background);
    color: var(--color-text);
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--font-size-sm);
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mcq-option:hover:not(:disabled) {
    background-color: var(--color-card-hover-background);
    border-color: var(--color-primary);
}

.mcq-option-selected {
    border-width: 0.1875rem;
}

.mcq-option-correct {
    border-color: var(--color-success-border);
    background-color: var(--color-success-background);
    color: var(--color-success-text);
}

.mcq-option-incorrect {
    border-color: var(--color-error-border);
    background-color: var(--color-error-background);
    color: var(--color-error-text);
}

.mcq-option:disabled {
    cursor: not-allowed;
    opacity: 0.8;
}

.mcq-feedback {
    padding-top: 1rem;
    border-top: 0.0625rem solid var(--color-border);
}

.mcq-feedback-correct {
    color: var(--color-success-text);
    font-weight: 600;
}

.mcq-feedback-incorrect {
    color: var(--color-error-text);
    font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .mcq-option {
        padding: 0.5rem 0.75rem;
    }
}
</style>