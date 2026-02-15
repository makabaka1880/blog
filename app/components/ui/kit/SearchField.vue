<template>
    <div class="search-field-container">
        <div class="search-field-wrapper" :class="{ 'is-focused': isFocused, 'is-disabled': disabled }">
            <!-- Search Icon -->
            <div class="search-icon">
                <Icon name="uil:search" v-if="!isLoading" />
                <Icon name="uil:spinner" v-else />
            </div>

            <!-- Input Field -->
            <input ref="searchInput" type="text" class="search-field input" :placeholder="placeholder"
                :value="modelValue" :disabled="disabled" :aria-label="ariaLabel" :aria-describedby="ariaDescribedby"
                @input="handleInput" @focus="handleFocus" @blur="handleBlur" @keydown="handleKeydown" />

            <!-- Clear Button -->
            <button v-if="showClearButton && modelValue" type="button" class="clear-button"
                :aria-label="clearButtonLabel" @click="handleClear">
                <Icon name="mage:multiply" />
            </button>
        </div>

        <!-- Helper Text -->
        <div v-if="helperText" :id="ariaDescribedby" class="helper-text">
            {{ helperText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    isLoading?: boolean
    showClearButton?: boolean
    debounceDelay?: number
    helperText?: string
    ariaLabel?: string
    clearButtonLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Search...',
    disabled: false,
    isLoading: false,
    showClearButton: true,
    debounceDelay: 300,
    helperText: '',
    ariaLabel: 'Search',
    clearButtonLabel: 'Clear search'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'search': [value: string]
    'clear': []
    'focus': [event: FocusEvent]
    'blur': [event: FocusEvent]
}>()

const searchInput = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const debounceTimer = ref<number | null>(null)

const ariaDescribedby = computed(() => props.helperText ? 'search-helper-text' : undefined)

function handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    emit('update:modelValue', value)

    // Debounce search
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value)
    }

    debounceTimer.value = window.setTimeout(() => {
        emit('search', value)
    }, props.debounceDelay)
}

function handleClear() {
    emit('update:modelValue', '')
    emit('clear')
    searchInput.value?.focus()
}

function handleFocus(event: FocusEvent) {
    isFocused.value = true
    emit('focus', event)
}

function handleBlur(event: FocusEvent) {
    isFocused.value = false
    emit('blur', event)
}

function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
        case 'Escape':
            event.preventDefault()
            if (props.modelValue) {
                handleClear()
            } else {
                searchInput.value?.blur()
            }
            break
        case 'Enter':
            event.preventDefault()
            emit('search', props.modelValue)
            break
    }
}

// Expose focus method for parent components
defineExpose({
    focus: () => searchInput.value?.focus(),
    blur: () => searchInput.value?.blur()
})
</script>

<style scoped>
.search-field-container {
    width: 100%;
    position: relative;
}

.search-field-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 0.0625rem solid var(--color-input-border);
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

.search-field-wrapper:hover {
    border-color: var(--color-input-border-hover);
}

.search-field-wrapper.is-focused {
    border-color: var(--color-primary);
}

.search-field-wrapper.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    transition: color 0.2s ease;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.search-field-wrapper.is-focused .search-icon {
    color: var(--color-primary);
}

.loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.input {
    border: none;
    background-color: transparent;
    color: var(--color-input-text);
    width: 100%;
    padding: 0.5rem 0;
    font-size: 1rem;
    line-height: 1.5;
}

.input:focus {
    outline: none;
}

.input::placeholder {
    color: var(--color-text-muted);
}

.input:disabled {
    cursor: not-allowed;
}

.clear-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.clear-button:hover {
    color: var(--color-text);
    background-color: var(--color-background-hover);
}

.clear-button:active {
    transform: scale(0.95);
}

.clear-button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.helper-text {
    margin-top: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.25;
}
</style>
