<template>
  <div>
    <input
      type="text"
      class="foliage-search-field foliage-input"
      placeholder="Search"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('search')"
      />
  </div>
</template>

<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
/* Input field */
.foliage-input {
  border: none;
  border-bottom: 1px solid var(--color-input-border);
  background-color: transparent;
  color: var(--color-input-text);
  width: 100%;
}

.foliage-input:focus{
  outline: none;
  border-color: var(--color-primary);
}

.foliage-input::placeholder {
  color: var(--color-text-muted);
}
</style>