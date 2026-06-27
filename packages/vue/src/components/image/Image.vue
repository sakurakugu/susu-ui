<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'SuImage',
})

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type ImageLoading = 'eager' | 'lazy'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    width?: number | string
    height?: number | string
    fit?: ImageFit
    radius?: number | string
    loading?: ImageLoading
    preview?: boolean
    previewText?: string
    fallback?: string
    fallbackText?: string
  }>(),
  {
    src: undefined,
    alt: '',
    width: undefined,
    height: undefined,
    fit: 'cover',
    radius: undefined,
    loading: 'eager',
    preview: false,
    previewText: '预览',
    fallback: undefined,
    fallbackText: '图片加载失败',
  },
)

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  preview: [src: string]
}>()

defineSlots<{
  placeholder?: () => unknown
  error?: () => unknown
  preview?: () => unknown
}>()

const loaded = ref(false)
const failed = ref(false)

const hasImage = computed(() => Boolean(props.src) && !failed.value)
const showPlaceholder = computed(() => hasImage.value && !loaded.value)
const showError = computed(() => !hasImage.value)
const canPreview = computed(
  () => props.preview && hasImage.value && loaded.value,
)

const imageStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width !== undefined) {
    style['--su-image-width'] = normalizeSize(props.width)
  }

  if (props.height !== undefined) {
    style['--su-image-height'] = normalizeSize(props.height)
  }

  if (props.radius !== undefined) {
    style['--su-image-radius'] = normalizeSize(props.radius)
  }

  return style
})

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
  },
)

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function handleLoad(event: Event) {
  loaded.value = true
  emit('load', event)
}

function handleError(event: Event) {
  loaded.value = false
  failed.value = true
  emit('error', event)
}

function handlePreview() {
  if (canPreview.value && props.src) {
    emit('preview', props.src)
  }
}
</script>

<template>
  <div
    class="su-image"
    :class="{
      'is-loaded': loaded,
      'is-error': showError,
      'is-preview': canPreview,
    }"
    :style="imageStyle"
  >
    <img
      v-if="hasImage"
      class="su-image__img"
      :src="src"
      :alt="alt"
      :loading="loading"
      :style="{ objectFit: fit }"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-if="showPlaceholder" class="su-image__placeholder">
      <slot name="placeholder">
        <span class="su-image__placeholder-icon" aria-hidden="true" />
      </slot>
    </div>

    <div v-if="showError" class="su-image__error">
      <slot name="error">
        <img
          v-if="fallback"
          class="su-image__fallback"
          :src="fallback"
          :alt="fallbackText"
        />
        <span v-else class="su-image__error-text">{{ fallbackText }}</span>
      </slot>
    </div>

    <button
      v-if="canPreview"
      class="su-image__preview"
      type="button"
      :aria-label="previewText"
      @click="handlePreview"
    >
      <slot name="preview">
        <span>{{ previewText }}</span>
      </slot>
    </button>
  </div>
</template>

<style>
.su-image {
  --su-image-width: auto;
  --su-image-height: auto;
  --su-image-radius: var(--su-radius-md);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-image-width);
  height: var(--su-image-height);
  min-width: 0;
  overflow: hidden;
  border-radius: var(--su-image-radius);
  background: var(--su-color-bg-soft);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-image__img,
.su-image__fallback {
  display: block;
  width: 100%;
  height: 100%;
}

.su-image__img {
  opacity: 0;
  transition: opacity 0.18s ease;
}

.su-image.is-loaded .su-image__img {
  opacity: 1;
}

.su-image__fallback {
  object-fit: contain;
}

.su-image__placeholder,
.su-image__error,
.su-image__preview {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.su-image__placeholder,
.su-image__error {
  padding: var(--su-space-sm);
  text-align: center;
}

.su-image__placeholder-icon {
  width: 28px;
  height: 28px;
  border: 3px solid var(--su-color-border);
  border-top-color: var(--su-color-primary);
  border-radius: var(--su-radius-round);
  animation: su-image-spin 0.8s linear infinite;
}

.su-image__error-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-image__preview {
  border: 0;
  color: var(--su-color-primary-text);
  background: rgb(0 0 0 / 48%);
  font: inherit;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.16s ease;
}

.su-image.is-preview:hover .su-image__preview,
.su-image__preview:focus-visible {
  opacity: 1;
}

.su-image__preview:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: -2px;
}

@keyframes su-image-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
