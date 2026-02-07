<template>
    <div v-for="(canvas, index) in canvases" :key="index">
        <canvas :ref="`canvas-${index}`" style="width: 100%; height: 100%;"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const canvases = ref(new Array(5));  // 5 canvases for example

// Function to handle drawing on each canvas
const drawOnCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100); // Example drawing on canvas
};

const canvasRefs = canvases.value.map(() => ref(null)); // Create an array of refs for each canvas

onMounted(() => {
    // Access each canvas using the corresponding ref
    canvasRefs.forEach((canvasRef, index) => {
        const canvas = canvasRef.value;
        const ctx = canvas.getContext('2d');
        drawOnCanvas(ctx); // Draw on each canvas
    });
});
</script>
<style lang="scss" scoped></style>