<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useLocale } from '../../config-provider'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuDatePicker',
  inheritAttrs: false,
})

export type DatePickerValue = string

interface CalendarCell {
  key: string
  label: number
  value: string
  date: Date
  inCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

const model = defineModel<DatePickerValue>({
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
    min?: string
    max?: string
    disabledDate?: (date: Date) => boolean
    name?: string
    id?: string
    required?: boolean
    autocomplete?: string
    ariaLabel?: string
  }>(),
  {
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    name: undefined,
    id: undefined,
    required: false,
    autocomplete: undefined,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  change: [value: DatePickerValue]
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
const panelRef = ref<HTMLElement>()
const locale = useLocale()
const isOpen = ref(false)
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

const weekdays = computed(() => locale.value.datePicker.weekdays)
const mergedPlaceholder = computed(
  () => props.placeholder ?? locale.value.datePicker.placeholder,
)
const mergedAriaLabel = computed(
  () => props.ariaLabel ?? locale.value.datePicker.ariaLabel,
)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const selectedDate = computed(() => parseDate(model.value))
const minDate = computed(() => parseDate(props.min))
const maxDate = computed(() => parseDate(props.max))
const todayValue = computed(() => formatDate(new Date()))

const displayValue = computed(() => {
  const date = selectedDate.value
  return date ? formatDate(date) : ''
})

const monthTitle = computed(() =>
  locale.value.datePicker.monthTitle(viewYear.value, viewMonth.value + 1),
)

const showClear = computed(
  () => props.clearable && isInteractive.value && model.value.length > 0,
)

const calendarCells = computed<CalendarCell[]>(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const startDate = new Date(viewYear.value, viewMonth.value, 1 - startOffset)
  const cells: CalendarCell[] = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + index,
    )
    const value = formatDate(date)

    cells.push({
      key: value,
      label: date.getDate(),
      value,
      date,
      inCurrentMonth: date.getMonth() === viewMonth.value,
      isToday: value === todayValue.value,
      isSelected: value === displayValue.value,
      isDisabled: isDateDisabled(date),
    })
  }

  return cells
})

function parseDate(value?: string) {
  if (!value) {
    return undefined
  }

  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!matched) {
    return undefined
  }

  const year = Number(matched[1])
  const month = Number(matched[2])
  const day = Number(matched[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isDateDisabled(date: Date) {
  if (minDate.value && date < minDate.value) {
    return true
  }

  if (maxDate.value && date > maxDate.value) {
    return true
  }

  return props.disabledDate ? props.disabledDate(new Date(date)) : false
}

function syncViewDate(date = selectedDate.value ?? new Date()) {
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function openPanel() {
  if (!isInteractive.value || isOpen.value) {
    return
  }

  syncViewDate()
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

function selectDate(cell: CalendarCell) {
  if (cell.isDisabled) {
    return
  }

  model.value = cell.value
  emit('change', cell.value)
  closePanel()
  nextTick(() => inputRef.value?.focus())
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

function changeMonth(offset: number) {
  const date = new Date(viewYear.value, viewMonth.value + offset, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsedDate = parseDate(target.value)

  model.value = target.value

  if (parsedDate && !isDateDisabled(parsedDate)) {
    syncViewDate(parsedDate)
  }
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsedDate = parseDate(target.value)

  if (!target.value) {
    model.value = ''
    emit('change', '')
    return
  }

  if (!parsedDate || isDateDisabled(parsedDate)) {
    target.value = displayValue.value
    return
  }

  const value = formatDate(parsedDate)
  model.value = value
  emit('change', value)
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
  if (event.key === 'ArrowDown') {
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
  () => model.value,
  () => {
    if (selectedDate.value) {
      syncViewDate(selectedDate.value)
    }
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
    class="su-date-picker"
    :class="[
      `su-date-picker--${mergedSize}`,
      `su-date-picker--${status}`,
      {
        'is-open': isOpen,
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-empty': !model,
        'is-clearable': showClear,
      },
    ]"
  >
    <span class="su-date-picker__control">
      <input
        v-bind="attrs"
        :id="id"
        ref="inputRef"
        class="su-date-picker__inner"
        type="text"
        inputmode="numeric"
        :value="model"
        :placeholder="mergedPlaceholder"
        :disabled="mergedDisabled"
        :readonly="readonly"
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="mergedAriaLabel"
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
        class="su-date-picker__clear"
        type="button"
        :aria-label="locale.datePicker.clear"
        @click="clearValue"
      >
        &times;
      </button>
      <button
        class="su-date-picker__trigger"
        type="button"
        :aria-label="locale.datePicker.openPanel"
        :disabled="!isInteractive"
        @click="togglePanel"
      >
        <span class="su-date-picker__icon" aria-hidden="true" />
      </button>
    </span>

    <div
      v-if="isOpen"
      ref="panelRef"
      class="su-date-picker__panel"
      role="dialog"
      :aria-label="locale.datePicker.panel"
      @keydown="handlePanelKeydown"
    >
      <div class="su-date-picker__header">
        <button
          class="su-date-picker__nav"
          type="button"
          :aria-label="locale.datePicker.previousMonth"
          @click="changeMonth(-1)"
        >
          ‹
        </button>
        <span class="su-date-picker__title">{{ monthTitle }}</span>
        <button
          class="su-date-picker__nav"
          type="button"
          :aria-label="locale.datePicker.nextMonth"
          @click="changeMonth(1)"
        >
          ›
        </button>
      </div>

      <div class="su-date-picker__weekdays" aria-hidden="true">
        <span v-for="day in weekdays" :key="day">{{ day }}</span>
      </div>

      <div class="su-date-picker__grid" role="grid">
        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          class="su-date-picker__cell"
          type="button"
          role="gridcell"
          :class="{
            'is-muted': !cell.inCurrentMonth,
            'is-today': cell.isToday,
            'is-selected': cell.isSelected,
          }"
          :disabled="cell.isDisabled"
          :aria-selected="cell.isSelected"
          :aria-label="cell.value"
          @click="selectDate(cell)"
        >
          {{ cell.label }}
        </button>
      </div>
    </div>
  </span>
</template>

<style>
.su-date-picker {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-date-picker__control {
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

.su-date-picker:hover:not(.is-disabled) .su-date-picker__control {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-date-picker:focus-within .su-date-picker__control,
.su-date-picker.is-open .su-date-picker__control {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-date-picker--success .su-date-picker__control {
  border-color: var(--su-color-success);
}

.su-date-picker--success:focus-within .su-date-picker__control {
  border-color: var(--su-color-success-active);
}

.su-date-picker--warning .su-date-picker__control {
  border-color: var(--su-color-warning);
}

.su-date-picker--warning:focus-within .su-date-picker__control {
  border-color: var(--su-color-warning-active);
}

.su-date-picker--error .su-date-picker__control {
  border-color: var(--su-color-error);
}

.su-date-picker--error:focus-within .su-date-picker__control {
  border-color: var(--su-color-error-active);
}

.su-date-picker--small {
  font-size: var(--su-font-size-sm);
}

.su-date-picker--small .su-date-picker__control {
  min-height: 24px;
}

.su-date-picker--medium .su-date-picker__control {
  min-height: 32px;
}

.su-date-picker--large {
  font-size: var(--su-font-size-lg);
}

.su-date-picker--large .su-date-picker__control {
  min-height: 44px;
}

.su-date-picker__inner {
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

.su-date-picker--small .su-date-picker__inner {
  padding: 0 var(--su-space-sm);
}

.su-date-picker--medium .su-date-picker__inner {
  padding: 0 var(--su-space-md);
}

.su-date-picker--large .su-date-picker__inner {
  padding: 0 var(--su-space-lg);
}

.su-date-picker__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-date-picker__clear,
.su-date-picker__trigger,
.su-date-picker__nav,
.su-date-picker__cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.su-date-picker__clear {
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-xs);
  padding: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  line-height: 1;
}

.su-date-picker__trigger {
  align-self: stretch;
  flex: none;
  width: 34px;
  padding: 0;
  color: var(--su-color-text-muted);
}

.su-date-picker__clear:hover,
.su-date-picker__trigger:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-date-picker__trigger:disabled {
  cursor: not-allowed;
}

.su-date-picker__icon {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1.5px solid currentcolor;
  border-radius: 3px;
}

.su-date-picker__icon::before,
.su-date-picker__icon::after {
  position: absolute;
  content: '';
}

.su-date-picker__icon::before {
  top: 3px;
  left: -1.5px;
  width: 16px;
  border-top: 1.5px solid currentcolor;
}

.su-date-picker__icon::after {
  top: -4px;
  left: 3px;
  width: 8px;
  height: 5px;
  border-right: 1.5px solid currentcolor;
  border-left: 1.5px solid currentcolor;
}

.su-date-picker__panel {
  position: absolute;
  top: calc(100% + var(--su-space-xs));
  left: 0;
  z-index: 20;
  width: 284px;
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
}

.su-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-sm);
  margin-bottom: var(--su-space-sm);
}

.su-date-picker__title {
  color: var(--su-color-text);
  font-weight: 600;
}

.su-date-picker__nav {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text-muted);
  font-size: 20px;
  line-height: 1;
}

.su-date-picker__nav:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-date-picker__weekdays,
.su-date-picker__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--su-space-xs);
}

.su-date-picker__weekdays {
  margin-bottom: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  text-align: center;
}

.su-date-picker__cell {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
}

.su-date-picker__cell:hover:not(:disabled):not(.is-selected) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-date-picker__cell.is-muted {
  color: color-mix(in srgb, var(--su-color-text-muted) 64%, transparent);
}

.su-date-picker__cell.is-today:not(.is-selected) {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-date-picker__cell.is-selected {
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-date-picker__cell:disabled {
  cursor: not-allowed;
  opacity: 0.36;
}

.su-date-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-date-picker.is-disabled .su-date-picker__inner {
  cursor: not-allowed;
}

.su-date-picker.is-readonly .su-date-picker__inner {
  cursor: default;
}
</style>
