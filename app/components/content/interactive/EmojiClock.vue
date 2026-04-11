<script setup lang="ts">
const emojiClock = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦']

const now = ref(new Date())

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    timer = setInterval(() => {
        now.value = new Date()
    }, 60000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

const clockEmoji = computed(() => {
    const clockIndex = now.value.getHours() * 2 + Math.round(now.value.getMinutes() / 30)
    return emojiClock[clockIndex % emojiClock.length]
})
</script>

<template>
    <span class="emoji-clock">{{ clockEmoji }}</span>
</template>
