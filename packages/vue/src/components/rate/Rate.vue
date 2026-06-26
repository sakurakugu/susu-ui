<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'SuRate',
})

type RateSize = 'small' | 'medium' | 'large'

const model = defineModel<number>({
  default: 0,
})

const props = withDefaults(
  defineProps<{
    max?: number
    size?: RateSize
    precision?: number
    allowHalf?: boolean
    clearable?: boolean
    disabled?: boolean
    readonly?: boolean
    texts?: string[]
    showText?: boolean
    ariaLabel?: string
  }>(),
  {
    max: 5,
    size: 'medium',
    precision: undefined,
    allowHalf: false,
    clearable: false,
    disabled: false,
    readonly: false,
    texts: undefined,
    showText: false,
    ariaLabel: '评分',
  },
)

const emit = defineEmits<{
  change: [value: number]
  hoverChange: [value: number]
}>()

defineSlots<{
  icon?: (props: {
    item: number
    value: number
    active: boolean
    filled: boolean
  }) => unknown
}>()

const hoverValue = ref<number | undefined>()

const normalizedMax = computed(() => Math.max(1, Math.floor(props.max)))
const normalizedPrecision = computed(() => {
  const precision = props.precision ?? (props.allowHalf ? 0.5 : 1)
  return Math.min(1, Math.max(0.1, precision))
})
const isInteractive = computed(() => !props.disabled && !props.readonly)
const displayValue = computed(() => hoverValue.value ?? model.value)
const rateItems = computed(() =>
  Array.from({ length: normalizedMax.value }, (_, index) => index + 1),
)

const displayText = computed(() => {
  const value = Math.ceil(displayValue.value)
  return (
    props.texts?.[value - 1] ?? `${displayValue.value}/${normalizedMax.value}`
  )
})

function clampValue(value: number) {
  return Math.min(normalizedMax.value, Math.max(0, value))
}

function normalizeValue(value: number) {
  const precision = normalizedPrecision.value
  const nextValue = Math.ceil(value / precision) * precision

  return Number(clampValue(nextValue).toFixed(10))
}

function getItemValue(index: number, event?: MouseEvent) {
  if (!event?.currentTarget || normalizedPrecision.value === 1) {
    return index
  }

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const offsetRatio = Math.min(
    1,
    Math.max(0, (event.clientX - rect.left) / rect.width),
  )

  return index - 1 + offsetRatio
}

function updateValue(value: number) {
  if (!isInteractive.value) {
    return
  }

  const nextValue =
    props.clearable && model.value === value ? 0 : normalizeValue(value)
  model.value = nextValue
  emit('change', nextValue)
}

function handlePointerMove(index: number, event: MouseEvent) {
  if (!isInteractive.value) {
    return
  }

  const nextValue = normalizeValue(getItemValue(index, event))
  hoverValue.value = nextValue
  emit('hoverChange', nextValue)
}

function handleFocus(index: number) {
  if (!isInteractive.value) {
    return
  }

  const nextValue = clampValue(index)
  hoverValue.value = nextValue
  emit('hoverChange', nextValue)
}

function clearHoverValue() {
  hoverValue.value = undefined
}

function handleClick(index: number, event: MouseEvent) {
  updateValue(getItemValue(index, event))
}

function handleKeydown(event: KeyboardEvent) {
  if (!isInteractive.value) {
    return
  }

  const step = normalizedPrecision.value
  const keyValueMap: Record<string, number> = {
    ArrowRight: model.value + step,
    ArrowUp: model.value + step,
    ArrowLeft: model.value - step,
    ArrowDown: model.value - step,
    Home: 0,
    End: normalizedMax.value,
  }
  const nextValue = keyValueMap[event.key]

  if (nextValue === undefined) {
    return
  }

  event.preventDefault()
  updateValue(normalizeValue(nextValue))
}

function getFillWidth(index: number) {
  const value = displayValue.value

  if (value >= index) {
    return '100%'
  }

  if (value > index - 1) {
    return `${Number(((value - index + 1) * 100).toFixed(6))}%`
  }

  return '0%'
}
</script>

<template>
  <div
    class="su-rate"
    :class="[
      `su-rate--${size}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
      },
    ]"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readonly || undefined"
    @mouseleave="clearHoverValue"
    @keydown="handleKeydown"
  >
    <button
      v-for="item in rateItems"
      :key="item"
      class="su-rate__item"
      type="button"
      role="radio"
      :tabindex="isInteractive ? 0 : -1"
      :disabled="disabled"
      :aria-checked="model === item"
      :aria-label="`${item} 分`"
      @mousemove="handlePointerMove(item, $event)"
      @focus="handleFocus(item)"
      @click="handleClick(item, $event)"
    >
      <span class="su-rate__star" aria-hidden="true">
        <span class="su-rate__star-base">
          <span class="su-rate__star-content">
            <slot
              name="icon"
              :item="item"
              :value="displayValue"
              :active="displayValue >= item"
              :filled="false"
            >
              <svg class="su-rate__icon" viewBox="0 0 24 24">
                <path
                  d="M12 2.75l2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.35l-5.72 3.01 1.09-6.37-4.63-4.51 6.4-.93L12 2.75z"
                />
              </svg>
            </slot>
          </span>
        </span>
        <span class="su-rate__star-fill" :style="{ width: getFillWidth(item) }">
          <span class="su-rate__star-content">
            <slot
              name="icon"
              :item="item"
              :value="displayValue"
              :active="displayValue >= item"
              :filled="true"
            >
              <svg class="su-rate__icon" viewBox="0 0 24 24">
                <path
                  d="M12 2.75l2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.35l-5.72 3.01 1.09-6.37-4.63-4.51 6.4-.93L12 2.75z"
                />
              </svg>
            </slot>
          </span>
        </span>
      </span>
    </button>
    <span v-if="showText" class="su-rate__text">
      {{ displayText }}
    </span>
  </div>
</template>

<style>
.su-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-xs);
  color: #f59e0b;
  font-size: var(--su-font-size-md);
  line-height: 1;
}

.su-rate--small {
  font-size: var(--su-font-size-sm);
}

.su-rate--medium {
  font-size: var(--su-font-size-lg);
}

.su-rate--large {
  font-size: 22px;
}

.su-rate__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.25em;
  height: 1.25em;
  padding: 0;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-rate__item:focus-visible {
  border-radius: var(--su-radius-sm);
  box-shadow: 0 0 0 2px var(--su-color-primary-soft);
}

.su-rate__star {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
}

.su-rate__star-base,
.su-rate__star-fill {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.su-rate__star-base {
  color: color-mix(in srgb, currentcolor 22%, var(--su-color-border));
}

.su-rate__star-fill {
  right: auto;
  color: currentcolor;
  white-space: nowrap;
}

.su-rate__star-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1em;
  height: 1em;
}

.su-rate__icon {
  display: block;
  flex: none;
  width: 1em;
  height: 1em;
  fill: currentcolor;
}

.su-rate__star-content :where(svg) {
  display: block;
  flex: none;
  width: 1em;
  height: 1em;
  fill: currentcolor;
}

.su-rate__text {
  margin-left: var(--su-space-sm);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-rate.is-disabled,
.su-rate.is-readonly {
  opacity: 0.6;
}

.su-rate.is-disabled .su-rate__item,
.su-rate.is-readonly .su-rate__item {
  cursor: default;
}
</style>
