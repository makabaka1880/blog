<template>
  <div class="content-area">
    <div class="content">
      <div v-if="isLoading">Loading content...</div>
      <div v-else-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
      <span id="content" v-else v-html="docContents"></span>
    </div>
  </div>
</template>

<style scoped>
@import url('@/style/content.scss');

.error {
  color: #dc2626;
  padding: 1rem;
  border: 1px solid #fecaca;
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { renderMarkdown } from '@/utils/markdown.js'
import '@/style/content.scss'

const docContents = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const uri = import.meta.env.VITE_API_BASE + '/posts/post'
    console.log('Requesting URL:', uri)

    const response = await axios.get(uri)

    if (!response.data) {
      throw new Error('API returned empty data')
    }
    const raw = String(response.data)
    docContents.value = await renderMarkdown(raw)
  } catch (error) {
    console.error('Error fetching content:', error)
    errorMessage.value = 'Failed to load content. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>
