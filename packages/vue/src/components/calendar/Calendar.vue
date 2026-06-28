<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'SuCalendar',
})

export type CalendarValue = string
export type CalendarSize = 'small' | 'medium' | 'large'

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

const model = defineModel<CalendarValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    size?: CalendarSize
    min?: string
    max?: string
    disabledDate?: (date: Date) => boolean
    disabled?: boolean
    readonly?: boolean
    showAdjacentMonths?: boolean
    showToday?: boolean
    ariaLabel?: string
  }>(),
  {
    size: 'medium',
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    disabled: false,
    readonly: false,
    showAdjacentMonths: true,
    showToday: true,
    ariaLabel: '日历',
  },
)

const emit = defineEmits<{
  change: [value: CalendarValue]
  panelChange: [year: number, month: number]
}>()

const weekdays = ['一', '二', '三', '四', '五', '六', '日']
const selectedDate = computed(() => parseDate(model.value))
const minDate = computed(() => parseDate(props.min))
const maxDate = computed(() => parseDate(props.max))
const today = computed(() => new Date())
const todayValue = computed(() => formatDate(today.value))
const viewYear = ref(today.value.getFullYear())
const viewMonth = ref(today.value.getMonth())

const isInteractive = computed(() => !props.disabled && !props.readonly)
const monthTitle = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

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
      isSelected: value === model.value,
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

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
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

function syncViewDate(date = selectedDate.value ?? today.value) {
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function changeMonth(offset: number) {
  const date = new Date(viewYear.value, viewMonth.value + offset, 1)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
  emit('panelChange', viewYear.value, viewMonth.value + 1)
}

function changeYear(offset: number) {
  viewYear.value += offset
  emit('panelChange', viewYear.value, viewMonth.value + 1)
}

function selectDate(cell: CalendarCell) {
  if (!isInteractive.value || cell.isDisabled) {
    return
  }

  model.value = cell.value
  emit('change', cell.value)

  if (!cell.inCurrentMonth) {
    syncViewDate(cell.date)
    emit('panelChange', viewYear.value, viewMonth.value + 1)
  }
}

function selectToday() {
  const date = today.value

  if (!isInteractive.value || isDateDisabled(date)) {
    return
  }

  const value = formatDate(date)
  model.value = value
  syncViewDate(date)
  emit('change', value)
  emit('panelChange', viewYear.value, viewMonth.value + 1)
}

function handleKeydown(event: KeyboardEvent, cell: CalendarCell) {
  if (!isInteractive.value) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectDate(cell)
  }
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

defineExpose({
  focusDate: syncViewDate,
  previousMonth: () => changeMonth(-1),
  nextMonth: () => changeMonth(1),
  previousYear: () => changeYear(-1),
  nextYear: () => changeYear(1),
  selectToday,
})
</script>

<template>
  <div
    class="su-calendar"
    :class="[
      `su-calendar--${size}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
      },
    ]"
    role="application"
    :aria-label="ariaLabel"
  >
    <div class="su-calendar__header">
      <div class="su-calendar__nav-group">
        <button
          class="su-calendar__nav"
          type="button"
          aria-label="上一年"
          :disabled="!isInteractive"
          @click="changeYear(-1)"
        >
          «
        </button>
        <button
          class="su-calendar__nav"
          type="button"
          aria-label="上一月"
          :disabled="!isInteractive"
          @click="changeMonth(-1)"
        >
          ‹
        </button>
      </div>

      <span class="su-calendar__title">{{ monthTitle }}</span>

      <div class="su-calendar__nav-group">
        <button
          class="su-calendar__nav"
          type="button"
          aria-label="下一月"
          :disabled="!isInteractive"
          @click="changeMonth(1)"
        >
          ›
        </button>
        <button
          class="su-calendar__nav"
          type="button"
          aria-label="下一年"
          :disabled="!isInteractive"
          @click="changeYear(1)"
        >
          »
        </button>
      </div>
    </div>

    <div class="su-calendar__weekdays" aria-hidden="true">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>

    <div class="su-calendar__grid" role="grid">
      <button
        v-for="cell in calendarCells"
        :key="cell.key"
        class="su-calendar__cell"
        type="button"
        role="gridcell"
        :class="{
          'is-muted': !cell.inCurrentMonth,
          'is-hidden': !showAdjacentMonths && !cell.inCurrentMonth,
          'is-today': cell.isToday,
          'is-selected': cell.isSelected,
        }"
        :disabled="!isInteractive || cell.isDisabled"
        :aria-selected="cell.isSelected"
        :aria-label="cell.value"
        @click="selectDate(cell)"
        @keydown="handleKeydown($event, cell)"
      >
        {{ cell.label }}
      </button>
    </div>

    <div v-if="showToday" class="su-calendar__footer">
      <button
        class="su-calendar__today"
        type="button"
        :disabled="!isInteractive || isDateDisabled(today)"
        @click="selectToday"
      >
        今天
      </button>
    </div>
  </div>
</template>

<style>
.su-calendar {
  display: inline-flex;
  flex-direction: column;
  width: 292px;
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-calendar--small {
  width: 252px;
  padding: var(--su-space-sm);
  font-size: var(--su-font-size-sm);
}

.su-calendar--large {
  width: 332px;
  padding: var(--su-space-lg);
  font-size: var(--su-font-size-lg);
}

.su-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-sm);
  margin-bottom: var(--su-space-sm);
}

.su-calendar__nav-group {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-xs);
}

.su-calendar__title {
  color: var(--su-color-text);
  font-weight: 600;
  white-space: nowrap;
}

.su-calendar__nav,
.su-calendar__cell,
.su-calendar__today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.su-calendar__nav {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text-muted);
  font-size: 18px;
  line-height: 1;
}

.su-calendar__nav:hover:not(:disabled),
.su-calendar__cell:hover:not(:disabled):not(.is-selected),
.su-calendar__today:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-calendar__weekdays,
.su-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--su-space-xs);
}

.su-calendar__weekdays {
  margin-bottom: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  text-align: center;
}

.su-calendar__cell {
  aspect-ratio: 1;
  width: 100%;
  min-width: 0;
  padding: 0;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
}

.su-calendar__cell.is-muted {
  color: color-mix(in srgb, var(--su-color-text-muted) 64%, transparent);
}

.su-calendar__cell.is-hidden {
  visibility: hidden;
}

.su-calendar__cell.is-today:not(.is-selected) {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-calendar__cell.is-selected {
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-calendar__cell:focus-visible,
.su-calendar__nav:focus-visible,
.su-calendar__today:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 2px var(--su-color-primary-soft);
}

.su-calendar__cell:disabled,
.su-calendar__nav:disabled,
.su-calendar__today:disabled {
  cursor: not-allowed;
  opacity: 0.36;
}

.su-calendar__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--su-space-sm);
  padding-top: var(--su-space-sm);
  border-top: 1px solid var(--su-color-border);
}

.su-calendar__today {
  min-width: 52px;
  height: 28px;
  padding: 0 var(--su-space-sm);
  border-radius: var(--su-radius-md);
  color: var(--su-color-primary);
}

.su-calendar.is-disabled,
.su-calendar.is-readonly {
  opacity: 0.6;
}
</style>
