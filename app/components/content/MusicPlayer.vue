<template>
  <div class="audio-player-container box-container">
    <div class="top-section">
      <img v-if="displayPic" :src="displayPic" class="cover-art" alt="Cover" draggable="false" />
      <div class="info-wrapper">
        <em>{{ displayTitle }}</em>
        <div v-if="hasMeta" class="meta">
          <span v-if="displayAuthor" class="author">{{ displayAuthor }}</span>
          <span v-if="displayAlbum" class="album">{{ displayAlbum }}</span>
        </div>
      </div>
    </div>
    <div class="audio-player">
      <button
        class="play-pause-toggle"
        type="button"
        :disabled="!audioSrc"
        :aria-pressed="isPlaying"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click="togglePlay"
      >
        <UIKitSvgIcon v-if="isPlaying" class="icon" name="pause" />
        <UIKitSvgIcon v-else class="icon" name="play" />
      </button>

      <input type="range" min="0" :max="duration" step="0.01" v-model="currentTime" @input="seek" />

      <span class="time"> {{ format(currentTime) }} / {{ format(duration) }} </span>

      <div class="volume-wrapper">
        <button class="volume-button" type="button" :aria-label="isMuted ? 'Unmute' : 'Mute'" @click="toggleMute">
          <UIKitSvgIcon class="volume-icon" name="volume" :class="{ 'text-muted': isMuted }" />
        </button>
        <div class="volume-popover">
          <input
            ref="volumeRange"
            class="volume-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            @mouseup="releaseFocus"
            @touchend="releaseFocus"
          />
        </div>
      </div>

      <audio
        ref="audio"
        :src="audioSrc"
        preload="metadata"
        @timeupdate="updateTime"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
        @loadedmetadata="onLoadedMetadata"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { MetingApi, type MusicServer, type MusicSong } from '@/utils/music-api'

const props = withDefaults(
  defineProps<{
    mode?: 'server' | 'local'
    src?: string
    title?: string
    author?: string
    album?: string
    pic?: string
    server?: MusicServer
    id?: string | number
    autoplay?: boolean
  }>(),
  {
    mode: 'local',
  },
)

const api = new MetingApi({ baseUrl: 'https://api.i-meto.com/meting/api' })

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const lastVolume = ref(1)
const songInfo = ref<MusicSong | null>(null)
const volumeRange = ref<HTMLInputElement | null>(null)

const isMuted = computed(() => volume.value === 0)

const audioSrc = computed(() => {
  if (props.mode === 'server' && songInfo.value?.url) return songInfo.value.url
  return props.src || ''
})

const displayTitle = computed(() => {
  if (props.mode === 'server' && songInfo.value?.title) return songInfo.value.title
  const explicit = props.title?.trim()
  if (explicit) return explicit
  if (!props.src) return 'Unknown Title'
  const file = props.src.split('/').pop() ?? ''
  const decoded = decodeURIComponent(file)
  return decoded.replace(/\.[^.]+$/, '')
})

const displayAuthor = computed(() => {
  if (props.mode === 'server' && songInfo.value?.author) return songInfo.value.author
  return props.author
})

const displayAlbum = computed(() => {
  if (props.mode === 'server' && songInfo.value?.album) return songInfo.value.album
  return props.album
})

const displayPic = computed(() => {
  if (props.mode === 'server' && songInfo.value?.pic) return songInfo.value.pic
  return props.pic
})

const hasMeta = computed(() => {
  return !!(displayAuthor.value || displayAlbum.value)
})

const fetchSong = async () => {
  if (props.mode === 'server' && props.server && props.id) {
    try {
      console.log(`Fetching song: server=${props.server}, id=${props.id}`)
      const songs = await api.getSong(props.server, props.id)
      console.log('Fetched songs:', songs)
      if (songs.length > 0) {
        songInfo.value = songs[0] ?? null
      } else {
        console.warn('No songs found for this ID')
      }
    } catch (e) {
      console.error('Failed to fetch song:', e)
    }
  }
}
const togglePlay = async () => {
  if (!audio.value || !audioSrc.value) return
  try {
    if (audio.value.paused) {
      await audio.value.play()
    } else {
      audio.value.pause()
    }
  } catch (e) {
    console.error('Playback failed:', e)
    isPlaying.value = false
  }
}

const onLoadedMetadata = () => {
  if (!audio.value) return
  duration.value = audio.value.duration
}

const updateTime = () => {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime
}

const seek = () => {
  if (!audio.value) return
  audio.value.currentTime = currentTime.value
}

const toggleMute = () => {
  if (volume.value > 0) {
    lastVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = lastVolume.value || 1
  }
}

const updateVolume = () => {
  if (!audio.value) return
  audio.value.volume = volume.value
  try {
    localStorage.setItem('player-volume', volume.value.toString())
  } catch (e) {
    // ignore
  }
}

const releaseFocus = () => {
  volumeRange.value?.blur()
}

onMounted(() => {
  fetchSong()
  
  // Restore volume
  try {
    const saved = localStorage.getItem('player-volume')
    if (saved !== null) {
      const v = parseFloat(saved)
      if (!isNaN(v) && v >= 0 && v <= 1) {
        volume.value = v
      }
    }
  } catch (e) {
    // ignore
  }

  if (!audio.value) return
  if (isFinite(audio.value.duration)) {
    duration.value = audio.value.duration
  }
  updateVolume()
})

watch(() => [props.mode, props.server, props.id], fetchSong)

watch(volume, updateVolume)

const format = (t: number) => {
  if (isNaN(t) || !isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.audio-player-container {
  padding: 1.5em 1em;
  border: 1.2pt var(--color-border) solid;
  box-shadow: 1px 1px 2px;
  border-radius: 0.5rem;
  margin-bottom: 2rem;

  .top-section {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .cover-art {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.25rem;
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;

    em {
      font-style: normal;
      font-weight: 600;
    }

    .meta {
      font-size: 0.85em;
      color: var(--color-text-muted);
      display: flex;
      gap: 0.5em;

      .album {
        opacity: 0.8;
        font-size: 0.95em;
      }
    }
  }

  .audio-player {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin-top: 1rem;
  }
}

.play-pause-toggle {
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-primary, #3d4888);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

input[type='range'] {
  flex: 1;
  accent-color: var(--color-accent);
}

.time {
  font-size: 0.8em;
  opacity: 0.7;
  white-space: nowrap;
}

.volume-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.volume-button {
  appearance: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.15rem;
  color: var(--color-accent);
}

.volume-icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

.volume-popover {
  position: absolute;
  right: 0;
  bottom: 100%;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: var(--color-bg);
  border: 1pt var(--color-border) solid;
  border-radius: 0.5rem;
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.volume-popover::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 1rem;
}

.volume-wrapper:hover .volume-popover,
.volume-wrapper:focus-within .volume-popover {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.text-muted {
  opacity: 0.4;
}

.volume-range {
  width: 6rem;
  accent-color: var(--color-accent);
}
</style>
