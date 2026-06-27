import type { InjectionKey } from 'vue'

export type CollapseValue = string | number
export type CollapseSize = 'small' | 'medium' | 'large'

export interface RegisteredCollapseItem {
  id: symbol
  title?: string
  name?: CollapseValue
  disabled?: boolean
  titleContent?: () => unknown
  extraContent?: () => unknown
  content?: () => unknown
}

export interface CollapseContext {
  updateItem: (item: RegisteredCollapseItem) => void
  removeItem: (id: symbol) => void
}

export const collapseKey: InjectionKey<CollapseContext> = Symbol('su-collapse')
