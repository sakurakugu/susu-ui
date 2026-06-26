<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from 'vue'
import { formKey, type FormSize } from '../form/context'

defineOptions({
  name: 'SuSlider',
  inheritAttrs: false,
})

export type SliderValue = number | [number, number]
export interface SliderMark {
  value: number
  label?: string
}

const model = defineModel<SliderValue>({
  default: 0,
})

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    range?: boolean
    size?: FormSize
    disabled?: boolean
    readonly?: boolean
    showStops?: boolean
    showTooltip?: boolean
    marks?: SliderMark[] | Record<number, string>
    formatTooltip?: (value: number) => string
    ariaLabel?: string
    ariaLabelStart?: string
    ariaLabelEnd?: string
    name?: string
    id?: string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    size: undefined,
    disabled: false,
    readonly: false,
    showStops: false,
    showTooltip: true,
    marks: undefined,
    formatTooltip: undefined,
    ariaLabel: '滑块',
    ariaLabelStart: '起始值',
    ariaLabelEnd: '结束值',
    name: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{
  input: [value: SliderValue, event: Event]
  change: [value: SliderValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const inputRef = ref<HTMLInputElement>()
const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const normalizedMin = computed(() => Math.min(props.min, props.max))
const normalizedMax = computed(() => Math.max(props.min, props.max))
const normalizedStep = computed(() => (props.step > 0 ? props.step : 1))
const valueSpan = computed(() => normalizedMax.value - normalizedMin.value)

const precision = computed(() => {
  const stepText = `${normalizedStep.value}`
  const decimalIndex = stepText.indexOf('.')

  return decimalIndex === -1 ? 0 : stepText.length - decimalIndex - 1
})

function clampValue(value: number) {
  return Math.min(normalizedMax.value, Math.max(normalizedMin.value, value))
}

function normalizeValue(value: number) {
  const min = normalizedMin.value
  const step = normalizedStep.value
  const steppedValue = Math.round((value - min) / step) * step + min
  const multiplier = 10 ** precision.value

  return Math.round(clampValue(steppedValue) * multiplier) / multiplier
}

function normalizeRangeValue(value: SliderValue): [number, number] {
  const sourceValue = Array.isArray(value)
    ? value
    : [normalizedMin.value, value]
  const startValue = normalizeValue(sourceValue[0])
  const endValue = normalizeValue(sourceValue[1])

  return startValue <= endValue
    ? [startValue, endValue]
    : [endValue, startValue]
}

const singleValue = computed(() =>
  normalizeValue(Array.isArray(model.value) ? model.value[1] : model.value),
)

const rangeValue = computed(() => normalizeRangeValue(model.value))

const startValue = computed(() =>
  props.range ? rangeValue.value[0] : normalizedMin.value,
)

const endValue = computed(() =>
  props.range ? rangeValue.value[1] : singleValue.value,
)

const startPercent = computed(() => getPercent(startValue.value))
const endPercent = computed(() => getPercent(endValue.value))

const trackStyle = computed(() => ({
  '--su-slider-start': `${startPercent.value}%`,
  '--su-slider-end': `${endPercent.value}%`,
}))

const normalizedMarks = computed(() => {
  if (!props.marks) {
    return []
  }

  const marks = Array.isArray(props.marks)
    ? props.marks
    : Object.entries(props.marks).map(([value, label]) => ({
        value: Number(value),
        label,
      }))

  return marks
    .map((mark) => ({
      value: normalizeValue(mark.value),
      label: mark.label,
      percent: getPercent(mark.value),
    }))
    .filter((mark) => mark.percent >= 0 && mark.percent <= 100)
})

const stops = computed(() => {
  if (!props.showStops || valueSpan.value <= 0) {
    return []
  }

  const count = Math.floor(valueSpan.value / normalizedStep.value)

  return Array.from({ length: Math.max(0, count - 1) }, (_, index) => {
    const value = normalizedMin.value + normalizedStep.value * (index + 1)

    return {
      value,
      percent: getPercent(value),
    }
  })
})

function getPercent(value: number) {
  if (valueSpan.value <= 0) {
    return 0
  }

  return ((clampValue(value) - normalizedMin.value) / valueSpan.value) * 100
}

function formatValue(value: number) {
  return props.formatTooltip ? props.formatTooltip(value) : `${value}`
}

function updateValue(value: SliderValue, event: Event, emitChange = false) {
  if (!isInteractive.value) {
    syncNativeInputs()
    return
  }

  const nextValue = props.range
    ? normalizeRangeValue(value)
    : normalizeValue(value as number)
  model.value = nextValue
  emit('input', nextValue, event)

  if (emitChange) {
    emit('change', nextValue, event)
  }
}

function handleSingleInput(event: Event) {
  const target = event.target as HTMLInputElement
  updateValue(Number(target.value), event)
}

function handleSingleChange(event: Event) {
  const target = event.target as HTMLInputElement
  updateValue(Number(target.value), event, true)
}

function handleRangeInput(type: 'start' | 'end', event: Event) {
  const target = event.target as HTMLInputElement
  const value = normalizeValue(Number(target.value))
  const [start, end] = rangeValue.value
  const nextValue: [number, number] =
    type === 'start'
      ? [Math.min(value, end), end]
      : [start, Math.max(value, start)]

  updateValue(nextValue, event)
}

function handleRangeChange(type: 'start' | 'end', event: Event) {
  const target = event.target as HTMLInputElement
  const value = normalizeValue(Number(target.value))
  const [start, end] = rangeValue.value
  const nextValue: [number, number] =
    type === 'start'
      ? [Math.min(value, end), end]
      : [start, Math.max(value, start)]

  updateValue(nextValue, event, true)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function syncNativeInputs() {
  if (inputRef.value) {
    inputRef.value.value = `${singleValue.value}`
  }

  if (startInputRef.value) {
    startInputRef.value.value = `${rangeValue.value[0]}`
  }

  if (endInputRef.value) {
    endInputRef.value.value = `${rangeValue.value[1]}`
  }
}

function focus() {
  ;(props.range ? startInputRef.value : inputRef.value)?.focus()
}

function blur() {
  inputRef.value?.blur()
  startInputRef.value?.blur()
  endInputRef.value?.blur()
}

watch(
  () => [model.value, props.range, normalizedMin.value, normalizedMax.value],
  syncNativeInputs,
  { flush: 'post' },
)

defineExpose({
  ref: computed(() => (props.range ? startInputRef.value : inputRef.value)),
  focus,
  blur,
})
</script>

<template>
  <div
    class="su-slider"
    :class="[
      `su-slider--${mergedSize}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-range': range,
        'has-marks': normalizedMarks.length > 0,
      },
    ]"
    :style="trackStyle"
  >
    <div class="su-slider__rail">
      <div class="su-slider__track" />
      <span
        v-for="stop in stops"
        :key="stop.value"
        class="su-slider__stop"
        :style="{ left: `${stop.percent}%` }"
      />
      <span
        class="su-slider__thumb"
        :style="{ left: `${range ? startPercent : endPercent}%` }"
        aria-hidden="true"
      >
        <span v-if="showTooltip" class="su-slider__tooltip">
          {{ formatValue(range ? startValue : endValue) }}
        </span>
      </span>
      <span
        v-if="range"
        class="su-slider__thumb"
        :style="{ left: `${endPercent}%` }"
        aria-hidden="true"
      >
        <span v-if="showTooltip" class="su-slider__tooltip">
          {{ formatValue(endValue) }}
        </span>
      </span>
      <input
        v-if="!range"
        v-bind="attrs"
        :id="id"
        ref="inputRef"
        class="su-slider__input"
        type="range"
        :min="normalizedMin"
        :max="normalizedMax"
        :step="normalizedStep"
        :value="singleValue"
        :disabled="mergedDisabled || readonly"
        :name="name"
        :aria-label="ariaLabel"
        :aria-valuetext="formatValue(singleValue)"
        @input="handleSingleInput"
        @change="handleSingleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <template v-else>
        <input
          v-bind="attrs"
          :id="id ? `${id}-start` : undefined"
          ref="startInputRef"
          class="su-slider__input su-slider__input--start"
          type="range"
          :min="normalizedMin"
          :max="normalizedMax"
          :step="normalizedStep"
          :value="rangeValue[0]"
          :disabled="mergedDisabled || readonly"
          :name="name ? `${name}-start` : undefined"
          :aria-label="ariaLabelStart"
          :aria-valuetext="formatValue(rangeValue[0])"
          @input="handleRangeInput('start', $event)"
          @change="handleRangeChange('start', $event)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <input
          :id="id ? `${id}-end` : undefined"
          ref="endInputRef"
          class="su-slider__input su-slider__input--end"
          type="range"
          :min="normalizedMin"
          :max="normalizedMax"
          :step="normalizedStep"
          :value="rangeValue[1]"
          :disabled="mergedDisabled || readonly"
          :name="name ? `${name}-end` : undefined"
          :aria-label="ariaLabelEnd"
          :aria-valuetext="formatValue(rangeValue[1])"
          @input="handleRangeInput('end', $event)"
          @change="handleRangeChange('end', $event)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </template>
    </div>
    <div v-if="normalizedMarks.length > 0" class="su-slider__marks">
      <button
        v-for="mark in normalizedMarks"
        :key="`${mark.value}-${mark.label ?? ''}`"
        class="su-slider__mark"
        type="button"
        :style="{ left: `${mark.percent}%` }"
        :disabled="mergedDisabled || readonly"
        @click="
          updateValue(
            range ? [rangeValue[0], mark.value] : mark.value,
            $event,
            true,
          )
        "
      >
        <span class="su-slider__mark-dot" />
        <span v-if="mark.label" class="su-slider__mark-label">
          {{ mark.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<style>
.su-slider {
  --su-slider-height: 32px;
  --su-slider-track-size: 6px;
  --su-slider-thumb-size: 18px;
  --su-slider-start: 0%;
  --su-slider-end: 0%;

  display: inline-grid;
  width: 100%;
  min-width: 120px;
  padding: 0 calc(var(--su-slider-thumb-size) / 2);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-slider--small {
  --su-slider-height: 24px;
  --su-slider-track-size: 4px;
  --su-slider-thumb-size: 14px;

  font-size: var(--su-font-size-sm);
}

.su-slider--large {
  --su-slider-height: 40px;
  --su-slider-track-size: 8px;
  --su-slider-thumb-size: 22px;

  font-size: var(--su-font-size-lg);
}

.su-slider__rail {
  position: relative;
  height: var(--su-slider-height);
}

.su-slider__rail::before,
.su-slider__track {
  position: absolute;
  top: 50%;
  height: var(--su-slider-track-size);
  border-radius: var(--su-radius-round);
  transform: translateY(-50%);
  content: '';
}

.su-slider__rail::before {
  right: 0;
  left: 0;
  background: color-mix(
    in srgb,
    var(--su-color-border) 70%,
    var(--su-color-bg-soft)
  );
}

.su-slider__track {
  left: var(--su-slider-start);
  width: calc(var(--su-slider-end) - var(--su-slider-start));
  background: var(--su-color-primary);
}

.su-slider__thumb {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-slider-thumb-size);
  height: var(--su-slider-thumb-size);
  border: 2px solid var(--su-color-primary);
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.su-slider__input {
  position: absolute;
  inset: 0 calc(var(--su-slider-thumb-size) / -2);
  z-index: 3;
  width: calc(100% + var(--su-slider-thumb-size));
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  appearance: none;
}

.su-slider__input::-webkit-slider-thumb {
  width: var(--su-slider-thumb-size);
  height: var(--su-slider-thumb-size);
  appearance: none;
}

.su-slider__input::-moz-range-thumb {
  width: var(--su-slider-thumb-size);
  height: var(--su-slider-thumb-size);
  border: 0;
}

.su-slider:focus-within .su-slider__thumb {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-slider__tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  padding: 2px 6px;
  border-radius: var(--su-radius-sm);
  color: var(--su-color-bg-elevated);
  background: var(--su-color-text);
  font-size: var(--su-font-size-sm);
  line-height: 1.4;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%);
  transition: opacity 0.16s ease;
}

.su-slider:hover .su-slider__tooltip,
.su-slider:focus-within .su-slider__tooltip {
  opacity: 1;
}

.su-slider__stop,
.su-slider__mark-dot {
  position: absolute;
  z-index: 1;
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-elevated);
  transform: translate(-50%, -50%);
}

.su-slider__stop {
  top: 50%;
  width: 4px;
  height: 4px;
}

.su-slider__marks {
  position: relative;
  min-height: 24px;
}

.su-slider__mark {
  position: absolute;
  top: 0;
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 0;
  border: 0;
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transform: translateX(-50%);
}

.su-slider__mark-dot {
  position: static;
  width: 6px;
  height: 6px;
  border: 1px solid var(--su-color-primary);
  transform: none;
}

.su-slider__mark-label {
  max-width: 72px;
  overflow: hidden;
  font-size: var(--su-font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-slider__mark:hover:not(:disabled) {
  color: var(--su-color-primary);
}

.su-slider.is-disabled,
.su-slider.is-readonly {
  opacity: 0.55;
}

.su-slider.is-disabled .su-slider__input,
.su-slider.is-readonly .su-slider__input,
.su-slider.is-disabled .su-slider__mark,
.su-slider.is-readonly .su-slider__mark {
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .su-slider__thumb,
  .su-slider__tooltip {
    transition: none;
  }
}
</style>
