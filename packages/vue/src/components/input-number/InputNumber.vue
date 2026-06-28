<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuInputNumber',
  inheritAttrs: false,
})

const model = defineModel<number | null>({
  default: null,
})

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    precision?: number
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    controls?: boolean
    name?: string
    id?: string
    required?: boolean
    autocomplete?: string
    ariaLabel?: string
  }>(),
  {
    min: undefined,
    max: undefined,
    step: 1,
    precision: undefined,
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    controls: true,
    name: undefined,
    id: undefined,
    required: false,
    autocomplete: undefined,
    ariaLabel: '数字输入',
  },
)

const emit = defineEmits<{
  input: [value: number | null, event: Event]
  change: [value: number | null, event?: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  invalid: [event: Event]
}>()

defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const inputRef = ref<HTMLInputElement>()
const inputText = ref('')
const isFocused = ref(false)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const normalizedStep = computed(() => (props.step > 0 ? props.step : 1))
const normalizedPrecision = computed(() => {
  if (props.precision !== undefined) {
    return Math.max(0, Math.floor(props.precision))
  }

  const stepText = `${normalizedStep.value}`
  const decimalIndex = stepText.indexOf('.')

  return decimalIndex === -1 ? 0 : stepText.length - decimalIndex - 1
})

const showClear = computed(
  () =>
    props.clearable &&
    isInteractive.value &&
    inputText.value.length > 0 &&
    model.value !== null,
)

const canDecrease = computed(
  () =>
    isInteractive.value &&
    (props.min === undefined ||
      model.value === null ||
      model.value > props.min),
)

const canIncrease = computed(
  () =>
    isInteractive.value &&
    (props.max === undefined ||
      model.value === null ||
      model.value < props.max),
)

function formatValue(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return ''
  }

  return normalizedPrecision.value > 0
    ? value.toFixed(normalizedPrecision.value)
    : `${value}`
}

function clampValue(value: number) {
  let nextValue = value

  if (props.min !== undefined) {
    nextValue = Math.max(props.min, nextValue)
  }

  if (props.max !== undefined) {
    nextValue = Math.min(props.max, nextValue)
  }

  return nextValue
}

function normalizeValue(value: number) {
  const multiplier = 10 ** normalizedPrecision.value
  const roundedValue = Math.round(clampValue(value) * multiplier) / multiplier

  return Number(roundedValue.toFixed(normalizedPrecision.value))
}

function parseValue(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (!/^[+-]?(\d+|\d*\.\d+)$/.test(trimmedValue)) {
    return undefined
  }

  const nextValue = Number(trimmedValue)

  return Number.isFinite(nextValue) ? nextValue : undefined
}

function syncInputText() {
  inputText.value = formatValue(model.value)
}

function updateValue(value: number | null, event?: Event, emitChange = false) {
  const nextValue = value === null ? null : normalizeValue(value)
  model.value = nextValue
  inputText.value = formatValue(nextValue)

  if (emitChange) {
    emit('change', nextValue, event)
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsedValue = parseValue(target.value)
  inputText.value = target.value

  if (parsedValue === undefined) {
    return
  }

  const nextValue = parsedValue === null ? null : normalizeValue(parsedValue)
  model.value = nextValue
  emit('input', nextValue, event)
}

function handleChange(event: Event) {
  const parsedValue = parseValue(inputText.value)

  if (parsedValue === undefined) {
    syncInputText()
    emit('change', model.value, event)
    return
  }

  updateValue(parsedValue, event, true)
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  handleChange(event)
  emit('blur', event)
}

function handleInvalid(event: Event) {
  emit('invalid', event)
}

function clearValue() {
  if (!isInteractive.value) {
    return
  }

  model.value = null
  inputText.value = ''
  emit('clear')
}

function stepValue(direction: 1 | -1, event?: Event) {
  if (!isInteractive.value) {
    return
  }

  const baseValue =
    model.value ?? (direction > 0 ? (props.min ?? 0) : (props.max ?? 0))
  updateValue(baseValue + normalizedStep.value * direction, event, true)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepValue(1, event)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepValue(-1, event)
  }
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

function select() {
  inputRef.value?.select()
}

watch(
  () => [model.value, normalizedPrecision.value],
  () => {
    if (!isFocused.value) {
      syncInputText()
    }
  },
  { immediate: true },
)

defineExpose({
  ref: inputRef,
  focus,
  blur,
  select,
  clear: clearValue,
  increase: () => stepValue(1),
  decrease: () => stepValue(-1),
})
</script>

<template>
  <span
    class="su-input-number"
    :class="[
      `su-input-number--${mergedSize}`,
      `su-input-number--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'has-prefix': $slots.prefix,
        'has-suffix': $slots.suffix || showClear,
        'has-controls': controls,
      },
    ]"
  >
    <span v-if="$slots.prefix" class="su-input-number__prefix">
      <slot name="prefix" />
    </span>
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-input-number__inner"
      type="text"
      inputmode="decimal"
      :value="inputText"
      :placeholder="placeholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :name="name"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="model ?? undefined"
      role="spinbutton"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @invalid="handleInvalid"
      @keydown="handleKeydown"
    />
    <button
      v-if="showClear"
      class="su-input-number__clear"
      type="button"
      aria-label="清空数字"
      @click="clearValue"
    >
      &times;
    </button>
    <span v-if="$slots.suffix" class="su-input-number__suffix">
      <slot name="suffix" />
    </span>
    <span v-if="controls" class="su-input-number__controls">
      <button
        class="su-input-number__control"
        type="button"
        aria-label="增加"
        :disabled="!canIncrease"
        @click="stepValue(1, $event)"
      >
        +
      </button>
      <button
        class="su-input-number__control"
        type="button"
        aria-label="减少"
        :disabled="!canDecrease"
        @click="stepValue(-1, $event)"
      >
        -
      </button>
    </span>
  </span>
</template>

<style>
.su-input-number {
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-input-number:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-input-number:focus-within {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-input-number--success {
  border-color: var(--su-color-success);
}

.su-input-number--success:focus-within {
  border-color: var(--su-color-success-active);
}

.su-input-number--warning {
  border-color: var(--su-color-warning);
}

.su-input-number--warning:focus-within {
  border-color: var(--su-color-warning-active);
}

.su-input-number--error {
  border-color: var(--su-color-error);
}

.su-input-number--error:focus-within {
  border-color: var(--su-color-error-active);
}

.su-input-number--small {
  min-height: 24px;
  font-size: var(--su-font-size-sm);
}

.su-input-number--medium {
  min-height: 32px;
  font-size: var(--su-font-size-md);
}

.su-input-number--large {
  min-height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-input-number__inner {
  min-width: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
}

.su-input-number--small .su-input-number__inner {
  padding: 0 var(--su-space-sm);
}

.su-input-number--medium .su-input-number__inner {
  padding: 0 var(--su-space-md);
}

.su-input-number--large .su-input-number__inner {
  padding: 0 var(--su-space-lg);
}

.su-input-number.has-prefix .su-input-number__inner {
  padding-left: var(--su-space-xs);
}

.su-input-number.has-suffix .su-input-number__inner {
  padding-right: var(--su-space-xs);
}

.su-input-number__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-input-number__prefix,
.su-input-number__suffix {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: var(--su-color-text-muted);
}

.su-input-number__prefix {
  padding-left: var(--su-space-md);
}

.su-input-number__suffix {
  padding-right: var(--su-space-md);
}

.su-input-number__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-sm);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-input-number__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-input-number__controls {
  display: inline-grid;
  align-self: stretch;
  flex: none;
  width: 28px;
  border-left: 1px solid var(--su-color-border);
}

.su-input-number__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-input-number__control + .su-input-number__control {
  border-top: 1px solid var(--su-color-border);
}

.su-input-number__control:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-input-number__control:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.su-input-number.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-input-number.is-disabled .su-input-number__inner {
  cursor: not-allowed;
}

.su-input-number.is-readonly .su-input-number__inner {
  cursor: default;
}
</style>
