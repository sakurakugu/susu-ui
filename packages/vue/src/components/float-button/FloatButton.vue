<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
import { floatButtonGroupKey, type FloatButtonShape, type FloatButtonType } from './context'

defineOptions({
  name: 'SuFloatButton',
})

const props = withDefaults(
  defineProps<{
    type?: FloatButtonType
    shape?: FloatButtonShape
    description?: string
    href?: string
    target?: string
    rel?: string
    badge?: string | number
    badgeMax?: number
    badgeDot?: boolean
    badgeHidden?: boolean
    badgeShowZero?: boolean
    right?: number | string
    bottom?: number | string
    zIndex?: number
    ariaLabel?: string
  }>(),
  {
    type: 'default',
    shape: undefined,
    description: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
    badge: undefined,
    badgeMax: undefined,
    badgeDot: false,
    badgeHidden: false,
    badgeShowZero: false,
    right: 40,
    bottom: 40,
    zIndex: 100,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const group = inject(floatButtonGroupKey, undefined)

const mergedShape = computed(() => props.shape ?? group?.shape.value ?? 'circle')

const isLink = computed(() => Boolean(props.href))

const rootTag = computed(() => (isLink.value ? 'a' : 'button'))

const rootStyle = computed<CSSProperties>(() => {
  if (group) {
    return {}
  }

  return {
    right: formatOffset(props.right),
    bottom: formatOffset(props.bottom),
    zIndex: props.zIndex,
  }
})

const displayBadge = computed(() => {
  if (props.badgeDot) {
    return ''
  }

  if (typeof props.badge === 'number' && typeof props.badgeMax === 'number') {
    return props.badge > props.badgeMax ? `${props.badgeMax}+` : `${props.badge}`
  }

  return props.badge === undefined || props.badge === null ? '' : `${props.badge}`
})

const showBadge = computed(() => {
  if (props.badgeHidden) {
    return false
  }

  if (props.badgeDot) {
    return true
  }

  if (props.badge === 0 && !props.badgeShowZero) {
    return false
  }

  return displayBadge.value.length > 0
})

const mergedAriaLabel = computed(() => props.ariaLabel ?? props.description ?? '浮动操作')

const linkRel = computed(() => {
  if (props.rel) {
    return props.rel
  }

  return props.target === '_blank' ? 'noopener noreferrer' : undefined
})

function formatOffset(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <component
    :is="rootTag"
    class="su-float-button"
    :class="[
      `su-float-button--${type}`,
      `su-float-button--${mergedShape}`,
      {
        'is-in-group': Boolean(group),
        'has-description': Boolean(description),
      },
    ]"
    :style="rootStyle"
    :type="isLink ? undefined : 'button'"
    :href="href"
    :target="target"
    :rel="linkRel"
    :aria-label="mergedAriaLabel"
    @click="handleClick"
  >
    <span class="su-float-button__body">
      <span v-if="$slots.icon" class="su-float-button__icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span v-if="description" class="su-float-button__description">
        {{ description }}
      </span>
      <span v-else-if="$slots.default" class="su-float-button__content">
        <slot />
      </span>
    </span>
    <span
      v-if="showBadge"
      class="su-float-button__badge"
      :class="{ 'is-dot': badgeDot }"
      :aria-label="badgeDot ? '状态提醒' : `提醒数量：${displayBadge}`"
    >
      <span v-if="!badgeDot">{{ displayBadge }}</span>
    </span>
  </component>
</template>

<style>
.su-float-button {
  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 44px;
  height: 44px;
  border: 1px solid var(--su-color-border);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font: inherit;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.su-float-button.is-in-group {
  position: relative;
  right: auto;
  bottom: auto;
  z-index: auto;
}

.su-float-button--circle {
  border-radius: var(--su-radius-round);
}

.su-float-button--square {
  border-radius: var(--su-radius-lg);
}

.su-float-button--primary {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-float-button:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
  box-shadow: var(--su-shadow-lg);
  transform: translateY(-2px);
}

.su-float-button--primary:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-float-button:active {
  border-color: var(--su-color-primary-active);
  transform: translateY(0);
}

.su-float-button:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-float-button__body {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  width: 100%;
  height: 100%;
}

.su-float-button__icon,
.su-float-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.su-float-button__icon > svg,
.su-float-button__content > svg {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentcolor;
}

.su-float-button__description {
  display: -webkit-box;
  max-width: 34px;
  overflow: hidden;
  color: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.18;
  overflow-wrap: anywhere;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.su-float-button--circle.has-description {
  border-radius: var(--su-radius-round);
}

.su-float-button__badge {
  position: absolute;
  top: 0;
  right: 0;
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
  background: var(--su-color-error);
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
  white-space: nowrap;
  transform: translate(40%, -40%);
}

.su-float-button__badge.is-dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
  line-height: 1;
}
</style>
