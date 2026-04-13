<template>
    <div class="pseudocode">
        <pre ref="codeElement">
            {{ code }}
        </pre>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, useSlots, nextTick } from 'vue'

const code = ref('')
const codeElement = ref<HTMLElement | null>(null)
const slots = useSlots()

// Helper to recursively grab text from VNodes
function extractText(node: any): string[] {
    if (!node) return []
    if (typeof node.children === 'string') return [node.children]
    if (Array.isArray(node.children)) {
        return node.children.flatMap(extractText)
    }
    // Handle fragment nodes or components in slots
    if (typeof node.type === 'symbol' && Array.isArray(node.children)) {
        return node.children.flatMap(extractText)
    }
    return []
}

function getSlotTextContent(): string {
    const defaultSlot = slots.default?.()
    if (!defaultSlot) return ''

    return defaultSlot
        .flatMap(extractText)
        .join('')
        .replace(/```(glsl|pseudocode)?/g, '') // Clean blocks
        .replace(/```/g, '')
        .trim()
}

onMounted(async () => {
    // 1. Extract the text
    code.value = getSlotTextContent()

    // 2. Wait for Vue to update the DOM with the new 'code' value
    await nextTick()

    // 3. Render with pseudocode.js
    if (codeElement.value && typeof (window as any).pseudocode !== 'undefined') {
        try {
            (window as any).pseudocode.renderElement(codeElement.value)
        } catch (err) {
            console.error("Pseudocode render failed:", err)
        }
    }
})
</script>