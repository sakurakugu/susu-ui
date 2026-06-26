<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useSlots, watchEffect } from 'vue'
import {
  tableKey,
  type RegisteredTableColumn,
  type TableColumn,
  type TableColumnAlign,
} from './context'

defineOptions({
  name: 'SuTableColumn',
})

const props = withDefaults(
  defineProps<{
    prop?: string
    label?: string
    width?: number | string
    minWidth?: number | string
    align?: TableColumnAlign
    headerAlign?: TableColumnAlign
    className?: string
    headerClassName?: string
    formatter?: TableColumn['formatter']
  }>(),
  {
    prop: undefined,
    label: undefined,
    width: undefined,
    minWidth: undefined,
    align: 'left',
    headerAlign: undefined,
    className: undefined,
    headerClassName: undefined,
    formatter: undefined,
  },
)

defineSlots<{
  default?: (scope: {
    row: Record<string, unknown>
    column: TableColumn
    rowIndex: number
    value: unknown
  }) => unknown
  header?: (scope: { column: TableColumn; columnIndex: number }) => unknown
}>()

const runtimeSlots = useSlots()
const table = inject(tableKey, undefined)
const columnId = Symbol('su-table-column')

const column = computed<RegisteredTableColumn>(() => ({
  id: columnId,
  prop: props.prop,
  label: props.label,
  width: props.width,
  minWidth: props.minWidth,
  align: props.align,
  headerAlign: props.headerAlign,
  className: props.className,
  headerClassName: props.headerClassName,
  formatter: props.formatter,
  cell: runtimeSlots.default,
  header: runtimeSlots.header,
}))

watchEffect(() => {
  table?.updateColumn(column.value)
})

onBeforeUnmount(() => {
  table?.removeColumn(columnId)
})
</script>

<template>
  <span style="display: none" />
</template>
