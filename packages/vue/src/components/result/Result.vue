<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuResult',
})

export type ResultStatus = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    status?: ResultStatus
    title?: string
    description?: string
    iconSize?: number | string
  }>(),
  {
    status: 'info',
    title: undefined,
    description: undefined,
    iconSize: 72,
  },
)

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  icon?: () => unknown
  footer?: () => unknown
}>()

const iconText = computed(() => {
  const iconMap: Record<ResultStatus, string> = {
    info: 'i',
    success: '✓',
    warning: '!',
    error: '×',
  }

  return iconMap[props.status]
})

const iconStyle = computed(() => {
  const size = typeof props.iconSize === 'number' ? `${props.iconSize}px` : props.iconSize

  return {
    width: size,
    height: size,
  }
})
</script>

<template>
  <div class="su-result" :class="`su-result--${status}`" role="status">
    <div class="su-result__icon" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <span class="su-result__default-icon">{{ iconText }}</span>
      </slot>
    </div>

    <div v-if="title || $slots.title" class="su-result__title">
      <slot name="title">{{ title }}</slot>
    </div>

    <div v-if="description || $slots.default" class="su-result__description">
      <slot>{{ description }}</slot>
    </div>

    <div v-if="$slots.footer" class="su-result__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.su-result {
  --su-result-color: var(--su-color-primary);
  --su-result-bg: color-mix(in srgb, var(--su-color-primary-soft) 72%, var(--su-color-bg-elevated));

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: var(--su-space-xl) var(--su-space-lg);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  text-align: center;
}

.su-result--success {
  --su-result-color: var(--su-color-success);
  --su-result-bg: color-mix(in srgb, var(--su-color-success-soft) 72%, var(--su-color-bg-elevated));
}

.su-result--warning {
  --su-result-color: var(--su-color-warning);
  --su-result-bg: color-mix(in srgb, var(--su-color-warning-soft) 72%, var(--su-color-bg-elevated));
}

.su-result--error {
  --su-result-color: var(--su-color-error);
  --su-result-bg: color-mix(in srgb, var(--su-color-error-soft) 72%, var(--su-color-bg-elevated));
}

.su-result__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  max-width: 100%;
  margin-bottom: var(--su-space-lg);
  color: var(--su-result-color);
}

.su-result__default-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid currentcolor;
  border-radius: var(--su-radius-round);
  background: var(--su-result-bg);
  font-size: 0.52em;
  font-weight: 700;
  line-height: 1;
}

.su-result__title {
  max-width: min(100%, 520px);
  color: var(--su-color-text);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.36;
  word-break: break-word;
}

.su-result__description {
  max-width: min(100%, 560px);
  margin-top: var(--su-space-sm);
  color: var(--su-color-text-muted);
  word-break: break-word;
}

.su-result__footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--su-space-sm);
  margin-top: var(--su-space-xl);
}
</style>
