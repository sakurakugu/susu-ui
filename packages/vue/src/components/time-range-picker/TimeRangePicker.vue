<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'
import TimePicker, {
  type TimePickerFormat,
  type TimePickerTime,
} from '../time-picker/TimePicker.vue'

defineOptions({
  name: 'SuTimeRangePicker',
  inheritAttrs: false,
})

export type TimeRangePickerValue = [string, string]
export type TimeRangePickerDisabledTime = (time: TimePickerTime, type: 'start' | 'end') => boolean

interface PickerExpose {
  focus: () => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}

const model = defineModel<TimeRangePickerValue>({
  default: () => ['', ''],
})

const props = withDefaults(
  defineProps<{
    size?: FormSize
    status?: FormItemStatus
    startPlaceholder?: string
    endPlaceholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    format?: TimePickerFormat
    hourStep?: number
    minuteStep?: number
    secondStep?: number
    min?: string
    max?: string
    disabledTime?: TimeRangePickerDisabledTime
    startName?: string
    endName?: string
    startId?: string
    endId?: string
    required?: boolean
    autocomplete?: string
    startAriaLabel?: string
    endAriaLabel?: string
    separator?: string
  }>(),
  {
    size: undefined,
    status: 'default',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
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
    startName: undefined,
    endName: undefined,
    startId: undefined,
    endId: undefined,
    required: false,
    autocomplete: undefined,
    startAriaLabel: '开始时间',
    endAriaLabel: '结束时间',
    separator: '至',
  },
)

const emit = defineEmits<{
  input: [value: TimeRangePickerValue, type: 'start' | 'end', event: Event]
  change: [value: TimeRangePickerValue, type?: 'start' | 'end', event?: Event]
  focus: [event: FocusEvent, type: 'start' | 'end']
  blur: [event: FocusEvent, type: 'start' | 'end']
  clear: []
  open: [type: 'start' | 'end']
  close: [type: 'start' | 'end']
  invalid: [event: Event, type: 'start' | 'end']
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const startPickerRef = ref<PickerExpose>()
const endPickerRef = ref<PickerExpose>()

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(() => props.disabled || Boolean(form?.disabled.value))
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const normalizedValue = computed<TimeRangePickerValue>(() => [
  model.value?.[0] ?? '',
  model.value?.[1] ?? '',
])
const hasValue = computed(
  () => Boolean(normalizedValue.value[0]) || Boolean(normalizedValue.value[1]),
)
const showClear = computed(() => props.clearable && isInteractive.value && hasValue.value)

const startValue = computed({
  get: () => normalizedValue.value[0],
  set: (value: string) => {
    updateRange([value, normalizedValue.value[1]])
  },
})

const endValue = computed({
  get: () => normalizedValue.value[1],
  set: (value: string) => {
    updateRange([normalizedValue.value[0], value])
  },
})

const mergedStartMax = computed(() => normalizedValue.value[1] || props.max)
const mergedEndMin = computed(() => normalizedValue.value[0] || props.min)

function updateRange(value: TimeRangePickerValue) {
  model.value = value
}

function emitInput(type: 'start' | 'end', event: Event) {
  emit('input', [...normalizedValue.value] as TimeRangePickerValue, type, event)
}

function emitChange(type?: 'start' | 'end', event?: Event) {
  emit('change', [...normalizedValue.value] as TimeRangePickerValue, type, event)
}

function isStartTimeDisabled(time: TimePickerTime) {
  if (props.disabledTime?.(time, 'start')) {
    return true
  }

  return Boolean(normalizedValue.value[1] && formatTime(time) > normalizedValue.value[1])
}

function isEndTimeDisabled(time: TimePickerTime) {
  if (props.disabledTime?.(time, 'end')) {
    return true
  }

  return Boolean(normalizedValue.value[0] && formatTime(time) < normalizedValue.value[0])
}

function formatTime(time: TimePickerTime) {
  const hour = `${time.hour}`.padStart(2, '0')
  const minute = `${time.minute}`.padStart(2, '0')

  return props.format === 'HH:mm:ss'
    ? `${hour}:${minute}:${`${time.second}`.padStart(2, '0')}`
    : `${hour}:${minute}`
}

function clearValue() {
  if (!isInteractive.value) {
    return
  }

  model.value = ['', '']
  startPickerRef.value?.close()
  endPickerRef.value?.close()
  emit('clear')
  nextTick(() => startPickerRef.value?.focus())
}

function focus() {
  startPickerRef.value?.focus()
}

function blur() {
  startPickerRef.value?.blur()
  endPickerRef.value?.blur()
}

function open(type: 'start' | 'end' = 'start') {
  if (type === 'start') {
    startPickerRef.value?.open()
    return
  }

  endPickerRef.value?.open()
}

function close() {
  startPickerRef.value?.close()
  endPickerRef.value?.close()
}

defineExpose({
  focus,
  blur,
  open,
  close,
  clear: clearValue,
})
</script>

<template>
  <span
    class="su-time-range-picker"
    :class="[
      `su-time-range-picker--${mergedSize}`,
      `su-time-range-picker--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-empty': !hasValue,
        'is-clearable': showClear,
      },
    ]"
  >
    <TimePicker
      v-bind="attrs"
      :id="startId"
      ref="startPickerRef"
      v-model="startValue"
      class="su-time-range-picker__item"
      :size="mergedSize"
      :status="status"
      :placeholder="startPlaceholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :clearable="false"
      :format="format"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      :min="min"
      :max="mergedStartMax"
      :disabled-time="isStartTimeDisabled"
      :name="startName"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="startAriaLabel"
      @input="(_value, event) => emitInput('start', event)"
      @change="(_value, event) => emitChange('start', event)"
      @focus="(event) => emit('focus', event, 'start')"
      @blur="(event) => emit('blur', event, 'start')"
      @open="emit('open', 'start')"
      @close="emit('close', 'start')"
      @invalid="(event) => emit('invalid', event, 'start')"
    />

    <span class="su-time-range-picker__separator">{{ separator }}</span>

    <TimePicker
      :id="endId"
      ref="endPickerRef"
      v-model="endValue"
      class="su-time-range-picker__item"
      :size="mergedSize"
      :status="status"
      :placeholder="endPlaceholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :clearable="false"
      :format="format"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      :min="mergedEndMin"
      :max="max"
      :disabled-time="isEndTimeDisabled"
      :name="endName"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="endAriaLabel"
      @input="(_value, event) => emitInput('end', event)"
      @change="(_value, event) => emitChange('end', event)"
      @focus="(event) => emit('focus', event, 'end')"
      @blur="(event) => emit('blur', event, 'end')"
      @open="emit('open', 'end')"
      @close="emit('close', 'end')"
      @invalid="(event) => emit('invalid', event, 'end')"
    />

    <button
      v-if="showClear"
      class="su-time-range-picker__clear"
      type="button"
      aria-label="清空时间范围"
      @click="clearValue"
    >
      &times;
    </button>
  </span>
</template>

<style>
.su-time-range-picker {
  position: relative;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  gap: var(--su-space-xs);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-time-range-picker__item {
  min-width: 0;
}

.su-time-range-picker__separator {
  color: var(--su-color-text-muted);
  white-space: nowrap;
}

.su-time-range-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-time-range-picker__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-time-range-picker--small {
  font-size: var(--su-font-size-sm);
}

.su-time-range-picker--large {
  font-size: var(--su-font-size-lg);
}

.su-time-range-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-time-range-picker:not(.is-clearable) {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

@media (max-width: 640px) {
  .su-time-range-picker {
    grid-template-columns: minmax(0, 1fr);
  }

  .su-time-range-picker__separator {
    justify-self: start;
  }
}
</style>
