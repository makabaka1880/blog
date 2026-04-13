<template>
    <BaseBox background-char='🤔' :box-type="'mcq-multiple'"
        :box-class="`mcq-multiple-box ${checked ? (isFullyCorrect ? 'mcq-multiple-correct' : 'mcq-multiple-incorrect') : ''}`">
        <template #header>
            Multiple Select Question
        </template>
        <div class="mcq-multiple-content">
            <slot name="prompt" />

            <p class="mcq-multiple-question">
            </p>

            <div class="mcq-multiple-options">
                <button v-for="(option, index) in options" :key="index" class="mcq-multiple-option" :class="{
                    'mcq-multiple-option-selected': selectedIndices.includes(index),
                    'mcq-multiple-option-correct': checked && correctIndices.includes(index),
                    'mcq-multiple-option-incorrect': checked && selectedIndices.includes(index) && !correctIndices.includes(index),
                    'mcq-multiple-option-missing': checked && !selectedIndices.includes(index) && correctIndices.includes(index)
                }" :disabled="checked" @click="toggleOption(index)">
                    <span v-html="renderMath(option)" />
                </button>
            </div>

            <div v-if="!checked" class="mcq-multiple-actions">
                <button class="mcq-multiple-check-button" @click="checkAnswers"
                    :disabled="selectedIndices.length === 0">
                    Check Answers
                </button>
            </div>

            <div v-if="checked" class="mcq-multiple-feedback">
                <div v-if="isFullyCorrect">
                    <strong>All correct! 🎉</strong>
                </div>
                <div v-else class="mcq-multiple-feedback-incorrect">
                    <strong>Not quite right. 😔</strong>
                    <strong v-if="correctIndices.length === 1">The correct answer is option {{ correctIndices[0] + 1 }}.</strong>
                    <p v-else>The correct answers are options {{correctIndices.map(i => i + 1).join(', ')}}.</p>
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
    correct: (string | number)[]
}

const props = defineProps<Props>();

const selectedIndices = ref<number[]>([])
const checked = ref(false)

const correctIndices = computed(() => {
    return props.correct.map(c => {
        if (typeof c === 'number') {
            return c - 1
        }
        // Find index of option matching the string
        const index = props.options.indexOf(c)
        if (index === -1) {
            console.warn(`Correct option "${c}" not found in options`)
            return -1
        }
        return index
    }).filter(i => i >= 0) // Filter out invalid indices
})

const isFullyCorrect = computed(() => {
    if (selectedIndices.value.length !== correctIndices.value.length) {
        return false
    }
    // Check if selected indices match correct indices (order doesn't matter)
    return selectedIndices.value.every(i => correctIndices.value.includes(i)) &&
        correctIndices.value.every(i => selectedIndices.value.includes(i))
})

function toggleOption(index: number) {
    if (checked.value) return

    const currentIndex = selectedIndices.value.indexOf(index)
    if (currentIndex === -1) {
        selectedIndices.value.push(index)
    } else {
        selectedIndices.value.splice(currentIndex, 1)
    }
}

function checkAnswers() {
    if (selectedIndices.value.length === 0) return
    checked.value = true
}
</script>

<style lang="scss" scoped>
.mcq-multiple-box {
    background-color: var(--color-card-background);
    border-color: var(--color-border);
    transition: border-color 0.2s ease;
    --box-header-color: var(--color-text);
    --box-bg-char-color: var(--color-text-muted);
    --box-bg-char-opacity: 0.1;
}

.mcq-multiple-box.mcq-multiple-correct {
    border-color: var(--color-success-border);
}

.mcq-multiple-box.mcq-multiple-incorrect {
    border-color: var(--color-error-border);
}

.mcq-multiple-content {
    color: var(--color-text);
}

.mcq-multiple-question {
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: var(--font-size-md);
}

.mcq-multiple-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.mcq-multiple-option {
    padding: 0.75rem 1rem;
    border: 0.125rem solid var(--color-border);
    margin: 0.03125rem 0;
    border-radius: var(--border-radius-sm);
    background-color: var(--color-card-background);
    color: var(--color-text);
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--font-size-sm);
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mcq-multiple-option:hover:not(:disabled) {
    background-color: var(--color-card-hover-background);
    border-color: var(--color-primary);
}

.mcq-multiple-option-selected {
    border-width: 0.1875rem;
    border-color: var(--color-primary);
}

.mcq-multiple-option-correct {
    border-color: var(--color-success-border);
    background-color: var(--color-success-background);
    color: var(--color-success-text);
}

.mcq-multiple-option-incorrect {
    border-color: var(--color-error-border);
    background-color: var(--color-error-background);
    color: var(--color-error-text);
}

.mcq-multiple-option-missing {
    border-color: var(--color-warning-border);
    background-color: var(--color-warning-background);
    color: var(--color-warning-text);
}

.mcq-multiple-option:disabled {
    cursor: not-allowed;
    opacity: 0.8;
}

.mcq-multiple-actions {
    margin-bottom: 1.5rem;
}

.mcq-multiple-check-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background-color: var(--color-primary);
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mcq-multiple-check-button:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
}

.mcq-multiple-check-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.mcq-multiple-feedback {
    padding-top: 1rem;
    border-top: 0.0625rem solid var(--color-border);
}

.mcq-multiple-feedback-incorrect {
    color: var(--color-error-text);
    font-weight: 600;
    margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .mcq-multiple-option {
        padding: 0.5rem 0.75rem;
    }

    .mcq-multiple-check-button {
        padding: 0.5rem 1rem;
    }
}
</style>