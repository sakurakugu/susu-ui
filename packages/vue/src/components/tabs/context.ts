import type { InjectionKey } from 'vue'

export type TabsValue = string | number
export type TabsType = 'line' | 'card'
export type TabsSize = 'small' | 'medium' | 'large'
export type TabsPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface RegisteredTabPane {
  id: symbol
  label?: string
  name?: TabsValue
  disabled?: boolean
  lazy?: boolean
  labelContent?: () => unknown
  content?: () => unknown
}

export interface TabsContext {
  updatePane: (pane: RegisteredTabPane) => void
  removePane: (id: symbol) => void
}

export const tabsKey: InjectionKey<TabsContext> = Symbol('su-tabs')
