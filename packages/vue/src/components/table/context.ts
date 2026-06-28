import type { InjectionKey, Ref, VNodeChild } from 'vue'

export type TableRow = Record<string, unknown>
export type TableColumnAlign = 'left' | 'center' | 'right'
export type TableSize = 'small' | 'medium' | 'large'

export interface TableColumnScope {
  row: TableRow
  column: TableColumn
  rowIndex: number
  value: unknown
}

export interface TableHeaderScope {
  column: TableColumn
  columnIndex: number
}

export interface TableColumn {
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  align?: TableColumnAlign
  headerAlign?: TableColumnAlign
  className?: string
  headerClassName?: string
  formatter?: (row: TableRow, column: TableColumn, value: unknown, rowIndex: number) => VNodeChild
  cell?: (scope: TableColumnScope) => VNodeChild
  header?: (scope: TableHeaderScope) => VNodeChild
}

export interface RegisteredTableColumn extends TableColumn {
  id: symbol
}

export interface TableContext {
  columns: Ref<RegisteredTableColumn[]>
  addColumn: (column: RegisteredTableColumn) => void
  updateColumn: (column: RegisteredTableColumn) => void
  removeColumn: (id: symbol) => void
}

export const tableKey: InjectionKey<TableContext> = Symbol('su-table')
