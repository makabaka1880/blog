<template>
    <div class="search-field-container">
        <div class="search-field-wrapper" :class="{ 'is-focused': isFocused, 'is-disabled': disabled }">
            <!-- Search Icon -->
            <div class="search-icon">
                <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <svg v-else class="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
            </div>

            <!-- Input Field -->
            <input 
                ref="searchInput"
                type="text" 
                class="search-field input" 
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
                :aria-label="ariaLabel"
                :aria-describedby="ariaDescribedby"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown="handleKeydown"
            />

            <!-- Clear Button -->
            <button 
                v-if="showClearButton && modelValue"
                type="button"
                class="clear-button"
                :aria-label="clearButtonLabel"
                @click="handleClear"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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
