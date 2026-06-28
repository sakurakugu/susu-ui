<script setup lang="ts">
defineOptions({
  name: 'SuLoading',
})

export type LoadingSize = 'small' | 'medium' | 'large'

withDefaults(
  defineProps<{
    loading?: boolean
    text?: string
    size?: LoadingSize
    fullscreen?: boolean
    overlay?: boolean
    blur?: boolean
    ariaLabel?: string
  }>(),
  {
    loading: true,
    text: undefined,
    size: 'medium',
    fullscreen: false,
    overlay: false,
    blur: false,
    ariaLabel: '加载中',
  },
)

defineSlots<{
  default?: () => unknown
  icon?: () => unknown
}>()
</script>

<template>
  <div
    v-if="loading"
    class="su-loading"
    :class="[
      `su-loading--${size}`,
      {
        'is-fullscreen': fullscreen,
        'is-overlay': overlay || fullscreen,
        'is-blur': blur,
      },
    ]"
    role="status"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    :aria-live="loading ? 'polite' : undefined"
  >
    <span class="su-loading__indicator" aria-hidden="true">
      <slot name="icon">
        <span class="su-loading__spinner" />
      </slot>
    </span>
    <span v-if="text || $slots.default" class="su-loading__text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<style>
.su-loading {
  --su-loading-size: 24px;
  --su-loading-stroke: 3px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-sm);
  color: var(--su-color-primary);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-loading--small {
  --su-loading-size: 16px;
  --su-loading-stroke: 2px;

  font-size: var(--su-font-size-sm);
}

.su-loading--large {
  --su-loading-size: 32px;
  --su-loading-stroke: 4px;

  font-size: var(--su-font-size-lg);
}

.su-loading.is-overlay {
  position: absolute;
  z-index: 1000;
  inset: 0;
  min-height: 80px;
  background: color-mix(in srgb, var(--su-color-bg-elevated) 78%, transparent);
}

.su-loading.is-fullscreen {
  position: fixed;
  min-height: 100vh;
}

.su-loading.is-blur {
  backdrop-filter: blur(3px);
}

.su-loading__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-loading-size);
  height: var(--su-loading-size);
  flex: none;
}

.su-loading__spinner {
  width: 100%;
  height: 100%;
  border: var(--su-loading-stroke) solid color-mix(in srgb, currentcolor 22%, transparent);
  border-top-color: currentcolor;
  border-radius: var(--su-radius-round);
  animation: su-loading-spin 0.8s linear infinite;
}

.su-loading__text {
  color: var(--su-color-text-muted);
  white-space: nowrap;
}

.su-loading.is-overlay,
.su-loading.is-fullscreen {
  flex-direction: column;
}

.su-loading.is-overlay .su-loading__text,
.su-loading.is-fullscreen .su-loading__text {
  color: var(--su-color-text);
}

@keyframes su-loading-spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-loading__spinner {
    animation: none;
  }
}
</style>
