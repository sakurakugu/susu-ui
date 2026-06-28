<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs, type CSSProperties } from 'vue'
import { formKey, type FormSize } from '../form/context'

defineOptions({
  name: 'SuSegmented',
  inheritAttrs: false,
})

export type SegmentedValue = string | number | boolean

export interface SegmentedOption {
  label: string
  value: SegmentedValue
  disabled?: boolean
}

const model = defineModel<SegmentedValue>()

const props = withDefaults(
  defineProps<{
    options: SegmentedOption[]
    size?: FormSize
    disabled?: boolean
    block?: boolean
    name?: string
  }>(),
  {
    size: undefined,
    disabled: false,
    block: false,
    name: undefined,
  },
)

const emit = defineEmits<{
  change: [value: SegmentedValue, event: MouseEvent | KeyboardEvent]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const itemRefs = ref<HTMLButtonElement[]>([])

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(() => props.disabled || Boolean(form?.disabled.value))

const normalizedOptions = computed(() =>
  props.options.map((option, index) => ({
    ...option,
    key: `${String(option.value)}-${index}`,
  })),
)

const enabledOptions = computed(() => normalizedOptions.value.filter((option) => !option.disabled))

const activeValue = computed(() => {
  const activeOption = normalizedOptions.value.find((option) => option.value === model.value)

  if (activeOption && !activeOption.disabled) {
    return activeOption.value
  }

  return enabledOptions.value[0]?.value
})

const activeIndex = computed(() =>
  normalizedOptions.value.findIndex((option) => option.value === activeValue.value),
)

const segmentedStyle = computed<CSSProperties>(() => ({
  '--su-segmented-count': Math.max(normalizedOptions.value.length, 1),
  '--su-segmented-active-index': Math.max(activeIndex.value, 0),
}))

function selectOption(option: SegmentedOption, event: MouseEvent | KeyboardEvent) {
  if (mergedDisabled.value || option.disabled) {
    return
  }

  if (option.value === model.value) {
    return
  }

  model.value = option.value
  emit('change', option.value, event)
}

async function focusItem(index: number) {
  await nextTick()
  itemRefs.value[index]?.focus()
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (mergedDisabled.value) {
    return
  }

  const enabledIndexes = normalizedOptions.value
    .map((option, optionIndex) => (option.disabled ? -1 : optionIndex))
    .filter((optionIndex) => optionIndex >= 0)

  if (!enabledIndexes.length) {
    return
  }

  const currentEnabledIndex = enabledIndexes.includes(index)
    ? enabledIndexes.indexOf(index)
    : enabledIndexes.findIndex((optionIndex) => optionIndex > index)

  let nextIndex: number | undefined

  if (event.key === 'Home') {
    nextIndex = enabledIndexes[0]
  } else if (event.key === 'End') {
    nextIndex = enabledIndexes[enabledIndexes.length - 1]
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    const currentIndex = Math.max(currentEnabledIndex, 0)
    nextIndex = enabledIndexes[(currentIndex + 1) % enabledIndexes.length]
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    const currentIndex = Math.max(currentEnabledIndex, 0)
    nextIndex = enabledIndexes[(currentIndex - 1 + enabledIndexes.length) % enabledIndexes.length]
  }

  if (nextIndex === undefined) {
    return
  }

  event.preventDefault()
  selectOption(normalizedOptions.value[nextIndex], event)
  void focusItem(nextIndex)
}
</script>

<template>
  <div
    v-bind="attrs"
    class="su-segmented"
    :class="[
      `su-segmented--${mergedSize}`,
      {
        'is-block': block,
        'is-disabled': mergedDisabled,
      },
    ]"
    :style="segmentedStyle"
    role="radiogroup"
    :aria-disabled="mergedDisabled"
  >
    <span v-if="activeValue !== undefined" class="su-segmented__indicator" aria-hidden="true" />
    <button
      v-for="(option, index) in normalizedOptions"
      :key="option.key"
      :ref="
        (element) => {
          if (element) itemRefs[index] = element as HTMLButtonElement
        }
      "
      class="su-segmented__item"
      :class="{
        'is-active': option.value === activeValue,
        'is-disabled': option.disabled || mergedDisabled,
      }"
      type="button"
      role="radio"
      :name="name"
      :disabled="option.disabled || mergedDisabled"
      :aria-checked="option.value === activeValue"
      :tabindex="option.value === activeValue ? 0 : -1"
      @click="selectOption(option, $event)"
      @keydown="handleKeydown($event, index)"
    >
      <span class="su-segmented__label">{{ option.label }}</span>
    </button>
  </div>
</template>

<style>
.su-segmented {
  --su-segmented-count: 1;
  --su-segmented-active-index: 0;
  --su-segmented-height: 36px;
  --su-segmented-padding: 3px;
  --su-segmented-font-size: var(--su-font-size-md);

  position: relative;
  display: inline-grid;
  grid-template-columns: repeat(var(--su-segmented-count), minmax(0, 1fr));
  align-items: center;
  max-width: 100%;
  padding: var(--su-segmented-padding);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
  color: var(--su-color-text);
  font-size: var(--su-segmented-font-size);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-segmented--small {
  --su-segmented-height: 30px;
  --su-segmented-padding: 2px;
  --su-segmented-font-size: var(--su-font-size-sm);
}

.su-segmented--large {
  --su-segmented-height: 44px;
  --su-segmented-padding: 4px;
  --su-segmented-font-size: var(--su-font-size-lg);
}

.su-segmented.is-block {
  display: grid;
  width: 100%;
}

.su-segmented__indicator {
  position: absolute;
  z-index: 0;
  top: var(--su-segmented-padding);
  bottom: var(--su-segmented-padding);
  left: var(--su-segmented-padding);
  width: calc((100% - var(--su-segmented-padding) * 2) / var(--su-segmented-count));
  border-radius: calc(var(--su-radius-md) - 2px);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  transform: translateX(calc(var(--su-segmented-active-index) * 100%));
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.su-segmented__item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: var(--su-segmented-height);
  padding: 0 var(--su-space-lg);
  border: 0;
  border-radius: calc(var(--su-radius-md) - 2px);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-segmented--small .su-segmented__item {
  padding: 0 var(--su-space-md);
}

.su-segmented--large .su-segmented__item {
  padding: 0 var(--su-space-xl);
}

.su-segmented__item:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
}

.su-segmented__item.is-active {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-segmented__item:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-segmented.is-disabled {
  opacity: 0.72;
}

.su-segmented__item:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: -2px;
}

.su-segmented__label {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .su-segmented__indicator,
  .su-segmented__item {
    transition: none;
  }
}
</style>
