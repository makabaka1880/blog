<template>
    <div class="content-section">
        <h2 class="section-header">The Author</h2>
        <p>
            I'm Sean, currently a highschooler. I'm <strong>{{ age.toFixed(9) }}</strong> years old, and I live in Shanghai.
        </p>
        <p>
            I like software engineering, computer science, and formal mathematics. I also enjoy music, chess, and 3D art.
        </p>
    </div>
</template>

<script lang="ts" setup>
const age = ref(0);

const birth = new Date(new Date('2009-12-28').getTime());

function getAgeInDecimal(dateOfBirth: Date, currentDate: Date = new Date()): number {
    const diffInMs = currentDate.getTime() - dateOfBirth.getTime();
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    return diffInYears;
}

onMounted(() => {
    age.value = getAgeInDecimal(birth);
    setInterval(() => {
        age.value = getAgeInDecimal(birth);
    }, 50);
});
</script>

<style lang="scss" scoped>
.content-section {
    margin: 2rem 0;
}

.section-header {
    margin-top: 3rem;
    margin-bottom: 1rem;
}
</style>