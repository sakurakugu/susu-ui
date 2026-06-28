<script setup lang="ts">
import { computed, provide, ref, type CSSProperties, type VNodeChild } from 'vue'
import { useLocale } from '../../config-provider'
import {
  tableKey,
  type RegisteredTableColumn,
  type TableColumn,
  type TableRow,
  type TableSize,
} from './context'

defineOptions({
  name: 'SuTable',
})

const props = withDefaults(
  defineProps<{
    data?: TableRow[]
    columns?: TableColumn[]
    rowKey?: string | ((row: TableRow, rowIndex: number) => string | number)
    size?: TableSize
    stripe?: boolean
    border?: boolean
    loading?: boolean
    emptyText?: string
    height?: number | string
    maxHeight?: number | string
  }>(),
  {
    data: () => [],
    columns: undefined,
    rowKey: undefined,
    size: 'medium',
    stripe: false,
    border: false,
    loading: false,
    emptyText: undefined,
    height: undefined,
    maxHeight: undefined,
  },
)

const emit = defineEmits<{
  rowClick: [row: TableRow, rowIndex: number, event: MouseEvent]
  cellClick: [
    row: TableRow,
    column: TableColumn,
    rowIndex: number,
    columnIndex: number,
    event: MouseEvent,
  ]
}>()

defineSlots<{
  default?: () => unknown
  empty?: () => unknown
  loading?: () => unknown
}>()

const slotColumns = ref<RegisteredTableColumn[]>([])
const locale = useLocale()
const mergedEmptyText = computed(() => props.emptyText ?? locale.value.empty.description)

const normalizedPropColumns = computed<RegisteredTableColumn[]>(() =>
  (props.columns ?? []).map((column, index) => ({
    ...column,
    id: Symbol.for(`su-table-prop-column-${index}`),
  })),
)

const mergedColumns = computed(() => [...normalizedPropColumns.value, ...slotColumns.value])

const hasData = computed(() => props.data.length > 0)

const wrapperStyle = computed<CSSProperties>(() => ({
  height: formatSize(props.height),
  maxHeight: formatSize(props.maxHeight),
}))

provide(tableKey, {
  columns: slotColumns,
  addColumn(column) {
    slotColumns.value.push(column)
  },
  updateColumn(column) {
    const index = slotColumns.value.findIndex((item) => item.id === column.id)
    if (index >= 0) {
      slotColumns.value.splice(index, 1, column)
      return
    }

    slotColumns.value.push(column)
  },
  removeColumn(id) {
    slotColumns.value = slotColumns.value.filter((column) => column.id !== id)
  },
})

function formatSize(value: number | string | undefined) {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

function getRowKey(row: TableRow, rowIndex: number) {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, rowIndex)
  }

  if (props.rowKey) {
    return `${getValue(row, props.rowKey)}`
  }

  return rowIndex
}

function getValue(row: TableRow, prop?: string) {
  if (!prop) {
    return undefined
  }

  return prop.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object') {
      return (value as Record<string, unknown>)[key]
    }

    return undefined
  }, row)
}

function getCellContent(row: TableRow, column: TableColumn, rowIndex: number) {
  const value = getValue(row, column.prop)

  if (column.cell) {
    return column.cell({ row, column, rowIndex, value })
  }

  if (column.formatter) {
    return column.formatter(row, column, value, rowIndex)
  }

  if (value === undefined || value === null) {
    return ''
  }

  return `${value}`
}

function getHeaderContent(column: TableColumn, columnIndex: number) {
  if (column.header) {
    return column.header({ column, columnIndex })
  }

  return column.label ?? column.prop ?? ''
}

function renderContent(content: VNodeChild) {
  return () => content
}

function getColumnStyle(column: TableColumn): CSSProperties {
  return {
    width: formatSize(column.width),
    minWidth: formatSize(column.minWidth),
    textAlign: column.align,
  }
}

function getHeaderStyle(column: TableColumn): CSSProperties {
  return {
    width: formatSize(column.width),
    minWidth: formatSize(column.minWidth),
    textAlign: column.headerAlign ?? column.align,
  }
}

function handleRowClick(row: TableRow, rowIndex: number, event: MouseEvent) {
  emit('rowClick', row, rowIndex, event)
}

function handleCellClick(
  row: TableRow,
  column: TableColumn,
  rowIndex: number,
  columnIndex: number,
  event: MouseEvent,
) {
  emit('cellClick', row, column, rowIndex, columnIndex, event)
}
</script>

<template>
  <div
    class="su-table"
    :class="[
      `su-table--${size}`,
      {
        'su-table--border': border,
        'su-table--stripe': stripe,
        'is-loading': loading,
        'is-scrollable': height || maxHeight,
      },
    ]"
  >
    <div v-if="$slots.default" class="su-table__columns">
      <slot />
    </div>

    <div class="su-table__wrapper" :style="wrapperStyle">
      <table class="su-table__table">
        <thead class="su-table__head">
          <tr class="su-table__row">
            <th
              v-for="(column, columnIndex) in mergedColumns"
              :key="column.id"
              class="su-table__cell su-table__header-cell"
              :class="[column.headerClassName]"
              :style="getHeaderStyle(column)"
              scope="col"
            >
              <component :is="renderContent(getHeaderContent(column, columnIndex))" />
            </th>
          </tr>
        </thead>
        <tbody v-if="hasData" class="su-table__body">
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="su-table__row"
            @click="handleRowClick(row, rowIndex, $event)"
          >
            <td
              v-for="(column, columnIndex) in mergedColumns"
              :key="column.id"
              class="su-table__cell"
              :class="[column.className]"
              :style="getColumnStyle(column)"
              @click="handleCellClick(row, column, rowIndex, columnIndex, $event)"
            >
              <component :is="renderContent(getCellContent(row, column, rowIndex))" />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!hasData" class="su-table__empty">
        <slot name="empty">{{ mergedEmptyText }}</slot>
      </div>
    </div>

    <div v-if="loading" class="su-table__loading">
      <slot name="loading">{{ locale.table.loading }}</slot>
    </div>
  </div>
</template>

<style>
.su-table {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-table__columns {
  display: none;
}

.su-table__wrapper {
  width: 100%;
  overflow: auto;
}

.su-table__table {
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
}

.su-table__head {
  color: var(--su-color-text);
  background: var(--su-color-bg-soft);
}

.su-table__cell {
  padding: 10px var(--su-space-md);
  border-bottom: 1px solid var(--su-color-border);
  vertical-align: middle;
  word-break: break-word;
  transition: background-color 0.16s ease;
}

.su-table__header-cell {
  font-weight: 600;
  white-space: nowrap;
}

.su-table__body .su-table__row:hover .su-table__cell {
  background: color-mix(in srgb, var(--su-color-primary-soft) 42%, transparent);
}

.su-table__body .su-table__row:last-child .su-table__cell {
  border-bottom: 0;
}

.su-table--stripe .su-table__body .su-table__row:nth-child(even) .su-table__cell {
  background: color-mix(in srgb, var(--su-color-bg-soft) 72%, transparent);
}

.su-table--border .su-table__cell {
  border-right: 1px solid var(--su-color-border);
}

.su-table--border .su-table__cell:last-child {
  border-right: 0;
}

.su-table--small {
  font-size: var(--su-font-size-sm);
}

.su-table--small .su-table__cell {
  padding: 6px var(--su-space-sm);
}

.su-table--large {
  font-size: var(--su-font-size-lg);
}

.su-table--large .su-table__cell {
  padding: 14px var(--su-space-lg);
}

.su-table.is-scrollable .su-table__head {
  position: sticky;
  top: 0;
  z-index: 1;
}

.su-table__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  padding: var(--su-space-xl);
  border-top: 1px solid var(--su-color-border);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-table__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-bg-elevated) 72%, transparent);
  font-weight: 600;
}
</style>
