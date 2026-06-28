<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuTimePicker',
  inheritAttrs: false,
})

export type TimePickerValue = string
export type TimePickerFormat = 'HH:mm' | 'HH:mm:ss'

interface TimeOption {
  value: number
  label: string
  isSelected: boolean
  isDisabled: boolean
}

export interface TimePickerTime {
  hour: number
  minute: number
  second: number
}

const model = defineModel<TimePickerValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    format?: TimePickerFormat
    hourStep?: number
    minuteStep?: number
    secondStep?: number
    min?: string
    max?: string
    disabledTime?: (time: TimePickerTime) => boolean
    name?: string
    id?: string
    required?: boolean
    autocomplete?: string
    ariaLabel?: string
  }>(),
  {
    size: undefined,
    status: 'default',
    placeholder: '请选择时间',
    disabled: false,
    readonly: false,
    clearable: false,
    format: 'HH:mm:ss',
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
    min: undefined,
    max: undefined,
    disabledTime: undefined,
    name: undefined,
    id: undefined,
    required: false,
    autocomplete: undefined,
    ariaLabel: '时间选择',
  },
)

const emit = defineEmits<{
  input: [value: TimePickerValue, event: Event]
  change: [value: TimePickerValue, event?: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  open: []
  close: []
  invalid: [event: Event]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const isOpen = ref(false)
const draftTime = ref<TimePickerTime>({ hour: 0, minute: 0, second: 0 })

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(() => props.disabled || Boolean(form?.disabled.value))
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const showSecond = computed(() => props.format === 'HH:mm:ss')
const selectedTime = computed(() => parseTime(model.value))
const minTime = computed(() => parseTime(props.min))
const maxTime = computed(() => parseTime(props.max))
const displayValue = computed(() => {
  const time = selectedTime.value
  return time ? formatTime(time) : model.value
})
const showClear = computed(() => props.clearable && isInteractive.value && model.value.length > 0)

const hourOptions = computed(() =>
  createOptions(24, normalizedStep(props.hourStep), draftTime.value.hour, (value) =>
    isColumnValueDisabled('hour', value),
  ),
)
const minuteOptions = computed(() =>
  createOptions(60, normalizedStep(props.minuteStep), draftTime.value.minute, (value) =>
    isColumnValueDisabled('minute', value),
  ),
)
const secondOptions = computed(() =>
  createOptions(60, normalizedStep(props.secondStep), draftTime.value.second, (value) =>
    isColumnValueDisabled('second', value),
  ),
)

function normalizedStep(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
}

function padTime(value: number) {
  return `${value}`.padStart(2, '0')
}

function parseTime(value?: string): TimePickerTime | undefined {
  const sourceValue = value?.trim()

  if (!sourceValue) {
    return undefined
  }

  const matched = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(sourceValue)

  if (!matched) {
    return undefined
  }

  const hour = Number(matched[1])
  const minute = Number(matched[2])
  const second = Number(matched[3] ?? 0)

  if (hour > 23 || minute > 59 || second > 59) {
    return undefined
  }

  if (!showSecond.value && matched[3] !== undefined) {
    return undefined
  }

  return { hour, minute, second }
}

function formatTime(time: TimePickerTime) {
  const hour = padTime(time.hour)
  const minute = padTime(time.minute)

  return showSecond.value ? `${hour}:${minute}:${padTime(time.second)}` : `${hour}:${minute}`
}

function toSecondOfDay(time: TimePickerTime) {
  return time.hour * 3600 + time.minute * 60 + time.second
}

function cloneTime(time: TimePickerTime) {
  return {
    hour: time.hour,
    minute: time.minute,
    second: showSecond.value ? time.second : 0,
  }
}

function isTimeDisabled(time: TimePickerTime) {
  const currentSecond = toSecondOfDay(time)

  if (minTime.value && currentSecond < toSecondOfDay(minTime.value)) {
    return true
  }

  if (maxTime.value && currentSecond > toSecondOfDay(maxTime.value)) {
    return true
  }

  return props.disabledTime ? props.disabledTime(cloneTime(time)) : false
}

function isColumnValueDisabled(column: 'hour' | 'minute' | 'second', value: number) {
  const nextTime = {
    ...draftTime.value,
    [column]: value,
  }

  return isTimeDisabled(nextTime)
}

function createOptions(
  total: number,
  step: number,
  selectedValue: number,
  isDisabled: (value: number) => boolean,
) {
  const options: TimeOption[] = []

  for (let value = 0; value < total; value += step) {
    options.push({
      value,
      label: padTime(value),
      isSelected: value === selectedValue,
      isDisabled: isDisabled(value),
    })
  }

  return options
}

function getFirstEnabledTime() {
  for (const hour of hourOptions.value) {
    for (const minute of minuteOptions.value) {
      const seconds = showSecond.value ? secondOptions.value : [{ value: 0, isDisabled: false }]

      for (const second of seconds) {
        const time = {
          hour: hour.value,
          minute: minute.value,
          second: second.value,
        }

        if (!isTimeDisabled(time)) {
          return time
        }
      }
    }
  }

  return undefined
}

function syncDraftTime(time = selectedTime.value) {
  if (time && !isTimeDisabled(time)) {
    draftTime.value = cloneTime(time)
    return
  }

  const enabledTime = getFirstEnabledTime()
  draftTime.value = enabledTime ?? { hour: 0, minute: 0, second: 0 }
}

function openPanel() {
  if (!isInteractive.value || isOpen.value) {
    return
  }

  syncDraftTime()
  isOpen.value = true
  emit('open')
  document.addEventListener('pointerdown', handleDocumentPointerdown)
}

function closePanel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('close')
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
}

function togglePanel() {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}

function selectTime(column: 'hour' | 'minute' | 'second', option: TimeOption) {
  if (option.isDisabled) {
    return
  }

  const nextTime = {
    ...draftTime.value,
    [column]: option.value,
  }

  if (isTimeDisabled(nextTime)) {
    return
  }

  draftTime.value = nextTime
  const value = formatTime(nextTime)
  model.value = value
  emit('change', value)
}

function clearValue() {
  if (!isInteractive.value) {
    return
  }

  model.value = ''
  emit('clear')
  closePanel()
  nextTick(() => inputRef.value?.focus())
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsedTime = parseTime(target.value)
  model.value = target.value

  if (parsedTime && !isTimeDisabled(parsedTime)) {
    draftTime.value = parsedTime
  }

  emit('input', target.value, event)
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsedTime = parseTime(target.value)

  if (!target.value) {
    model.value = ''
    emit('change', '', event)
    return
  }

  if (!parsedTime || isTimeDisabled(parsedTime)) {
    target.value = displayValue.value
    return
  }

  const value = formatTime(parsedTime)
  model.value = value
  draftTime.value = parsedTime
  emit('change', value, event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleInvalid(event: Event) {
  emit('invalid', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
    return
  }

  if (event.key === 'Escape') {
    closePanel()
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    inputRef.value?.focus()
  }
}

function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node

  if (!rootRef.value?.contains(target)) {
    closePanel()
  }
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

watch(
  () => [model.value, props.format, props.min, props.max],
  () => {
    syncDraftTime()
  },
  { immediate: true },
)

watch(
  () => isInteractive.value,
  (nextValue) => {
    if (!nextValue) {
      closePanel()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
})

defineExpose({
  ref: inputRef,
  focus,
  blur,
  open: openPanel,
  close: closePanel,
  clear: clearValue,
})
</script>

<template>
  <span
    ref="rootRef"
    class="su-time-picker"
    :class="[
      `su-time-picker--${mergedSize}`,
      `su-time-picker--${status}`,
      {
        'is-open': isOpen,
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-empty': !model,
        'is-clearable': showClear,
      },
    ]"
  >
    <span class="su-time-picker__control">
      <input
        v-bind="attrs"
        :id="id"
        ref="inputRef"
        class="su-time-picker__inner"
        type="text"
        inputmode="numeric"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="mergedDisabled"
        :readonly="readonly"
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @invalid="handleInvalid"
        @keydown="handleKeydown"
      />
      <button
        v-if="showClear"
        class="su-time-picker__clear"
        type="button"
        aria-label="清空时间"
        @click="clearValue"
      >
        &times;
      </button>
      <button
        class="su-time-picker__trigger"
        type="button"
        aria-label="打开时间面板"
        :disabled="!isInteractive"
        @click="togglePanel"
      >
        <span class="su-time-picker__icon" aria-hidden="true" />
      </button>
    </span>

    <div
      v-if="isOpen"
      class="su-time-picker__panel"
      role="dialog"
      aria-label="时间面板"
      @keydown="handlePanelKeydown"
    >
      <div class="su-time-picker__columns">
        <div class="su-time-picker__column" aria-label="小时">
          <span class="su-time-picker__column-title">时</span>
          <button
            v-for="option in hourOptions"
            :key="option.value"
            class="su-time-picker__option"
            type="button"
            :class="{ 'is-selected': option.isSelected }"
            :disabled="option.isDisabled"
            :aria-selected="option.isSelected"
            @click="selectTime('hour', option)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="su-time-picker__column" aria-label="分钟">
          <span class="su-time-picker__column-title">分</span>
          <button
            v-for="option in minuteOptions"
            :key="option.value"
            class="su-time-picker__option"
            type="button"
            :class="{ 'is-selected': option.isSelected }"
            :disabled="option.isDisabled"
            :aria-selected="option.isSelected"
            @click="selectTime('minute', option)"
          >
            {{ option.label }}
          </button>
        </div>

        <div v-if="showSecond" class="su-time-picker__column" aria-label="秒">
          <span class="su-time-picker__column-title">秒</span>
          <button
            v-for="option in secondOptions"
            :key="option.value"
            class="su-time-picker__option"
            type="button"
            :class="{ 'is-selected': option.isSelected }"
            :disabled="option.isDisabled"
            :aria-selected="option.isSelected"
            @click="selectTime('second', option)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<style>
.su-time-picker {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-time-picker__control {
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-time-picker:hover:not(.is-disabled) .su-time-picker__control {
  border-color: color-mix(in srgb, var(--su-color-primary) 48%, var(--su-color-border));
}

.su-time-picker:focus-within .su-time-picker__control,
.su-time-picker.is-open .su-time-picker__control {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-time-picker--success .su-time-picker__control {
  border-color: var(--su-color-success);
}

.su-time-picker--success:focus-within .su-time-picker__control {
  border-color: var(--su-color-success-active);
}

.su-time-picker--warning .su-time-picker__control {
  border-color: var(--su-color-warning);
}

.su-time-picker--warning:focus-within .su-time-picker__control {
  border-color: var(--su-color-warning-active);
}

.su-time-picker--error .su-time-picker__control {
  border-color: var(--su-color-error);
}

.su-time-picker--error:focus-within .su-time-picker__control {
  border-color: var(--su-color-error-active);
}

.su-time-picker--small {
  font-size: var(--su-font-size-sm);
}

.su-time-picker--small .su-time-picker__control {
  min-height: 24px;
}

.su-time-picker--medium .su-time-picker__control {
  min-height: 32px;
}

.su-time-picker--large {
  font-size: var(--su-font-size-lg);
}

.su-time-picker--large .su-time-picker__control {
  min-height: 44px;
}

.su-time-picker__inner {
  min-width: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}

.su-time-picker--small .su-time-picker__inner {
  padding: 0 var(--su-space-sm);
}

.su-time-picker--medium .su-time-picker__inner {
  padding: 0 var(--su-space-md);
}

.su-time-picker--large .su-time-picker__inner {
  padding: 0 var(--su-space-lg);
}

.su-time-picker__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-time-picker__clear,
.su-time-picker__trigger,
.su-time-picker__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.su-time-picker__clear {
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-xs);
  padding: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  line-height: 1;
}

.su-time-picker__trigger {
  align-self: stretch;
  flex: none;
  width: 34px;
  padding: 0;
  color: var(--su-color-text-muted);
}

.su-time-picker__clear:hover,
.su-time-picker__trigger:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-time-picker__trigger:disabled {
  cursor: not-allowed;
}

.su-time-picker__icon {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1.5px solid currentcolor;
  border-radius: var(--su-radius-round);
}

.su-time-picker__icon::before,
.su-time-picker__icon::after {
  position: absolute;
  content: '';
}

.su-time-picker__icon::before {
  top: 3px;
  left: 6px;
  height: 5px;
  border-left: 1.5px solid currentcolor;
}

.su-time-picker__icon::after {
  top: 8px;
  left: 6px;
  width: 4px;
  border-top: 1.5px solid currentcolor;
}

.su-time-picker__panel {
  position: absolute;
  top: calc(100% + var(--su-space-xs));
  left: 0;
  z-index: 20;
  width: 232px;
  padding: var(--su-space-sm);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
}

.su-time-picker__columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--su-space-xs);
}

.su-time-picker__column {
  display: grid;
  max-height: 214px;
  overflow: auto;
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-soft);
}

.su-time-picker__columns:has(.su-time-picker__column:nth-child(2):last-child) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.su-time-picker__column-title {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: var(--su-space-xs);
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-soft);
  font-size: var(--su-font-size-sm);
  text-align: center;
}

.su-time-picker__option {
  min-height: 30px;
  padding: 0 var(--su-space-sm);
  border-radius: var(--su-radius-sm);
}

.su-time-picker__option:hover:not(:disabled):not(.is-selected) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-elevated);
}

.su-time-picker__option.is-selected {
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-time-picker__option:disabled {
  cursor: not-allowed;
  opacity: 0.36;
}

.su-time-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-time-picker.is-disabled .su-time-picker__inner {
  cursor: not-allowed;
}

.su-time-picker.is-readonly .su-time-picker__inner {
  cursor: default;
}
</style>
