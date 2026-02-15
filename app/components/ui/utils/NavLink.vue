<template>
    <NuxtLink :to="to" @mouseenter="mark = true" @mouseleave="mark = false">
        <RoughNotation :is-show="mark" type="underline" :strokeWidth="2" color="var(--color-navlink-special)" :multiline="true">
            <slot />
        </RoughNotation>
    </NuxtLink>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ to: string }>();
const mark = ref(false);
</script>
