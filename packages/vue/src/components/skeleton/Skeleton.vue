<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuSkeleton',
})

type SkeletonVariant = 'text' | 'rect' | 'circle'

const props = withDefaults(
  defineProps<{
    variant?: SkeletonVariant
    width?: number | string
    height?: number | string
    rows?: number
    animated?: boolean
    round?: boolean
  }>(),
  {
    variant: 'text',
    width: undefined,
    height: undefined,
    rows: 1,
    animated: true,
    round: false,
  },
)

const normalizedRows = computed(() => Math.max(1, Math.floor(props.rows)))

function formatSize(value: number | string | undefined) {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

const blockStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
}))
</script>

<template>
  <div
    class="su-skeleton"
    :class="{
      'is-animated': animated,
      'is-round': round,
      'is-paragraph': normalizedRows > 1,
    }"
    aria-hidden="true"
  >
    <template v-if="normalizedRows > 1">
      <span
        v-for="row in normalizedRows"
        :key="row"
        class="su-skeleton__item su-skeleton__item--text"
        :class="{ 'is-last': row === normalizedRows }"
      />
    </template>
    <span
      v-else
      class="su-skeleton__item"
      :class="`su-skeleton__item--${variant}`"
      :style="blockStyle"
    />
  </div>
</template>

<style>
.su-skeleton {
  display: block;
  width: 100%;
  line-height: 1;
}

.su-skeleton__item {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  height: 1em;
  border-radius: var(--su-radius-sm);
  background: color-mix(
    in srgb,
    var(--su-color-text-muted) 14%,
    var(--su-color-bg-soft)
  );
}

.su-skeleton__item--text {
  height: 1em;
  border-radius: var(--su-radius-sm);
}

.su-skeleton__item--rect {
  min-height: 32px;
}

.su-skeleton__item--circle {
  width: 40px;
  height: 40px;
  border-radius: var(--su-radius-round);
}

.su-skeleton.is-round .su-skeleton__item {
  border-radius: var(--su-radius-round);
}

.su-skeleton.is-paragraph {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-sm);
}

.su-skeleton.is-paragraph .su-skeleton__item.is-last {
  width: 62%;
}

.su-skeleton.is-animated .su-skeleton__item::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--su-color-bg-elevated) 72%, transparent),
    transparent
  );
  animation: su-skeleton-wave 1.4s ease-in-out infinite;
  content: '';
  transform: translateX(-100%);
}

@keyframes su-skeleton-wave {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-skeleton.is-animated .su-skeleton__item::after {
    animation: none;
  }
}
</style>
