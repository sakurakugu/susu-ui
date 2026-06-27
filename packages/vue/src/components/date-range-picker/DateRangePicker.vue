<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'
import DatePicker from '../date-picker/DatePicker.vue'

defineOptions({
  name: 'SuDateRangePicker',
  inheritAttrs: false,
})

export type DateRangePickerValue = [string, string]
export type DateRangePickerDisabledDate = (
  date: Date,
  type: 'start' | 'end',
) => boolean

interface PickerExpose {
  focus: () => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}

const model = defineModel<DateRangePickerValue>({
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
    min?: string
    max?: string
    disabledDate?: DateRangePickerDisabledDate
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
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    disabled: false,
    readonly: false,
    clearable: false,
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    startName: undefined,
    endName: undefined,
    startId: undefined,
    endId: undefined,
    required: false,
    autocomplete: undefined,
    startAriaLabel: '开始日期',
    endAriaLabel: '结束日期',
    separator: '至',
  },
)

const emit = defineEmits<{
  change: [value: DateRangePickerValue]
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
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const normalizedValue = computed<DateRangePickerValue>(() => [
  model.value?.[0] ?? '',
  model.value?.[1] ?? '',
])
const hasValue = computed(
  () => Boolean(normalizedValue.value[0]) || Boolean(normalizedValue.value[1]),
)
const showClear = computed(
  () => props.clearable && isInteractive.value && hasValue.value,
)

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

function updateRange(value: DateRangePickerValue) {
  model.value = value
}

function emitChange() {
  emit('change', [...normalizedValue.value] as DateRangePickerValue)
}

function isStartDateDisabled(date: Date) {
  if (props.disabledDate?.(date, 'start')) {
    return true
  }

  return Boolean(
    normalizedValue.value[1] && formatDate(date) > normalizedValue.value[1],
  )
}

function isEndDateDisabled(date: Date) {
  if (props.disabledDate?.(date, 'end')) {
    return true
  }

  return Boolean(
    normalizedValue.value[0] && formatDate(date) < normalizedValue.value[0],
  )
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
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
    class="su-date-range-picker"
    :class="[
      `su-date-range-picker--${mergedSize}`,
      `su-date-range-picker--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-empty': !hasValue,
        'is-clearable': showClear,
      },
    ]"
  >
    <DatePicker
      v-bind="attrs"
      :id="startId"
      ref="startPickerRef"
      v-model="startValue"
      class="su-date-range-picker__item"
      :size="mergedSize"
      :status="status"
      :placeholder="startPlaceholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :clearable="false"
      :min="min"
      :max="mergedStartMax"
      :disabled-date="isStartDateDisabled"
      :name="startName"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="startAriaLabel"
      @change="emitChange"
      @focus="(event) => emit('focus', event, 'start')"
      @blur="(event) => emit('blur', event, 'start')"
      @open="emit('open', 'start')"
      @close="emit('close', 'start')"
      @invalid="(event) => emit('invalid', event, 'start')"
    />

    <span class="su-date-range-picker__separator">{{ separator }}</span>

    <DatePicker
      :id="endId"
      ref="endPickerRef"
      v-model="endValue"
      class="su-date-range-picker__item"
      :size="mergedSize"
      :status="status"
      :placeholder="endPlaceholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :clearable="false"
      :min="mergedEndMin"
      :max="max"
      :disabled-date="isEndDateDisabled"
      :name="endName"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="endAriaLabel"
      @change="emitChange"
      @focus="(event) => emit('focus', event, 'end')"
      @blur="(event) => emit('blur', event, 'end')"
      @open="emit('open', 'end')"
      @close="emit('close', 'end')"
      @invalid="(event) => emit('invalid', event, 'end')"
    />

    <button
      v-if="showClear"
      class="su-date-range-picker__clear"
      type="button"
      aria-label="清空日期范围"
      @click="clearValue"
    >
      &times;
    </button>
  </span>
</template>

<style>
.su-date-range-picker {
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

.su-date-range-picker__item {
  min-width: 0;
}

.su-date-range-picker__separator {
  color: var(--su-color-text-muted);
  white-space: nowrap;
}

.su-date-range-picker__clear {
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

.su-date-range-picker__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-date-range-picker--small {
  font-size: var(--su-font-size-sm);
}

.su-date-range-picker--large {
  font-size: var(--su-font-size-lg);
}

.su-date-range-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-date-range-picker:not(.is-clearable) {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

@media (max-width: 640px) {
  .su-date-range-picker {
    grid-template-columns: minmax(0, 1fr);
  }

  .su-date-range-picker__separator {
    justify-self: start;
  }
}
</style>
