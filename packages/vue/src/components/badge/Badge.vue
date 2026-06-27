<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuBadge',
})

type BadgeType = 'primary' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'small' | 'medium'
type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    value?: string | number
    max?: number
    dot?: boolean
    hidden?: boolean
    showZero?: boolean
    type?: BadgeType
    size?: BadgeSize
    position?: BadgePosition
  }>(),
  {
    value: undefined,
    max: undefined,
    dot: false,
    hidden: false,
    showZero: false,
    type: 'error',
    size: 'medium',
    position: 'top-right',
  },
)

const displayValue = computed(() => {
  if (typeof props.value === 'number' && typeof props.max === 'number') {
    return props.value > props.max ? `${props.max}+` : `${props.value}`
  }

  return props.value === undefined || props.value === null
    ? ''
    : `${props.value}`
})

const isVisible = computed(() => {
  if (props.hidden) {
    return false
  }

  if (props.dot) {
    return true
  }

  if (props.value === 0 && !props.showZero) {
    return false
  }

  return displayValue.value.length > 0
})

const ariaLabel = computed(() => {
  if (props.dot) {
    return '状态提醒'
  }

  return `提醒数量：${displayValue.value}`
})
</script>

<template>
  <span class="su-badge" :class="{ 'is-standalone': !$slots.default }">
    <slot />
    <sup
      v-if="isVisible"
      class="su-badge__content"
      :class="[
        `su-badge--${type}`,
        `su-badge--${size}`,
        `su-badge--${position}`,
        {
          'is-dot': dot,
        },
      ]"
      :aria-label="ariaLabel"
    >
      <span v-if="!dot" class="su-badge__value">{{ displayValue }}</span>
    </sup>
  </span>
</template>

<style>
.su-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.su-badge.is-standalone {
  line-height: 1;
}

.su-badge__content {
  --su-badge-color: #dc2626;

  position: absolute;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border: 1px solid var(--su-color-bg-elevated);
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-badge-color);
  font-size: var(--su-font-size-sm);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
  white-space: nowrap;
  transform-origin: center;
}

.su-badge.is-standalone .su-badge__content {
  position: static;
  transform: none;
}

.su-badge--primary {
  --su-badge-color: var(--su-color-primary);
}

.su-badge--success {
  --su-badge-color: #16a34a;
}

.su-badge--warning {
  --su-badge-color: #d97706;
}

.su-badge--error {
  --su-badge-color: #dc2626;
}

.su-badge--info {
  --su-badge-color: #2563eb;
}

.su-badge--small {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 14px;
}

.su-badge--medium {
  min-width: 18px;
  height: 18px;
}

.su-badge--top-right {
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.su-badge--top-left {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.su-badge--bottom-right {
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
}

.su-badge--bottom-left {
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
}

.su-badge__content.is-dot {
  width: 8px;
  min-width: 8px;
  height: 8px;
  padding: 0;
  line-height: 1;
}

.su-badge__content.is-dot.su-badge--small {
  width: 6px;
  min-width: 6px;
  height: 6px;
}

.su-badge__value {
  display: inline-block;
  min-width: 0;
}
</style>
