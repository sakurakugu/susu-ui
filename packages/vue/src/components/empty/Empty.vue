<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../config-provider'

defineOptions({
  name: 'SuEmpty',
})

const props = withDefaults(
  defineProps<{
    description?: string
    image?: string
    imageSize?: number | string
  }>(),
  {
    description: undefined,
    image: undefined,
    imageSize: 96,
  },
)

defineSlots<{
  default?: () => unknown
  image?: () => unknown
  footer?: () => unknown
}>()

const locale = useLocale()

const mergedDescription = computed(() => props.description ?? locale.value.empty.description)

const imageStyle = computed(() => {
  const size = typeof props.imageSize === 'number' ? `${props.imageSize}px` : props.imageSize

  return {
    width: size,
    height: size,
  }
})
</script>

<template>
  <div class="su-empty">
    <div class="su-empty__image" :style="imageStyle" aria-hidden="true">
      <slot name="image">
        <img v-if="image" class="su-empty__img" :src="image" alt="" />
        <svg v-else class="su-empty__default-image" viewBox="0 0 96 96" fill="none">
          <path
            d="M20 35.5L31.5 18h33L76 35.5v38A4.5 4.5 0 0 1 71.5 78h-47A4.5 4.5 0 0 1 20 73.5v-38Z"
            class="su-empty__default-box"
          />
          <path
            d="M20 35.5h19.2c1.7 0 3.1 1 3.7 2.6l1.1 2.8c.6 1.6 2.1 2.6 3.7 2.6h.6c1.7 0 3.1-1 3.7-2.6l1.1-2.8c.6-1.6 2.1-2.6 3.7-2.6H76"
            class="su-empty__default-line"
          />
          <path d="M31.5 18 20 35.5h56L64.5 18" class="su-empty__default-line" />
          <path
            d="M37 61h22M42 52h12"
            class="su-empty__default-line su-empty__default-muted-line"
          />
        </svg>
      </slot>
    </div>
    <div class="su-empty__description">
      <slot>{{ mergedDescription }}</slot>
    </div>
    <div v-if="$slots.footer" class="su-empty__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.su-empty {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: var(--su-space-xl) var(--su-space-lg);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  text-align: center;
}

.su-empty__image {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  margin-bottom: var(--su-space-md);
  color: var(--su-color-text-muted);
}

.su-empty__img,
.su-empty__default-image {
  display: block;
  width: 100%;
  height: 100%;
}

.su-empty__img {
  object-fit: contain;
}

.su-empty__default-box {
  fill: var(--su-color-bg-soft);
  stroke: var(--su-color-border);
  stroke-width: 2;
}

.su-empty__default-line {
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  opacity: 0.62;
}

.su-empty__default-muted-line {
  opacity: 0.38;
}

.su-empty__description {
  max-width: min(100%, 360px);
  word-break: break-word;
}

.su-empty__footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--su-space-sm);
  margin-top: var(--su-space-lg);
}
</style>
