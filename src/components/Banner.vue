<template>
  <div class="band">
    <p class="band-label">
      Site Under Construction. For any development issues please contact us at
      <a href="mailto:makabaka1880@outlook.com">makabaka1880@outlook.com</a>
      or state an issue at
      <a href="https://github.com/makabaka1880/blog/issues">my github repository</a>.
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/style/palette.scss';

div.page-under-development {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3em;
  gap: 2em;
}
.band {
  top: 1rem;
  padding: 1rem;
  background-color: $emphasis-color;
  color: white;
  border-radius: 1rem;
  width: 100%;
}

.band a {
  color: white;
  text-decoration: underline;
}

.band a:hover {
  color: $selection-color;
}
</style>
