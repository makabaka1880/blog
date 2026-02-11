<template>
    <div>
        <input type="text" class="search-field input" placeholder="Search" :value="modelValue"
            @input="handleInput" />
    </div>
</template>

<script setup lang="ts">
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'search'])

function handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    emit('update:modelValue', value)
    emit('search')
}


</script>

<style scoped>
/* Input field */
.input {
    border: none;
    border-bottom: 1px solid var(--color-input-border);
    background-color: transparent;
    color: var(--color-input-text);
    width: 100%;
}

.input:focus {
    outline: none;
    border-color: var(--color-primary);
}

.input::placeholder {
    color: var(--color-text-muted);
}
</style>