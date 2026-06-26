import type { InjectionKey, Ref } from 'vue'

export type DescriptionsSize = 'small' | 'medium' | 'large'
export type DescriptionsLayout = 'horizontal' | 'vertical'

export interface DescriptionsItem {
  label?: string
  labelContent?: () => unknown
  span?: number
  className?: string
  labelClassName?: string
  contentClassName?: string
  content?: unknown | (() => unknown)
}

export interface RegisteredDescriptionsItem extends DescriptionsItem {
  id: symbol
}

export interface DescriptionsContext {
  items: Ref<RegisteredDescriptionsItem[]>
  updateItem: (item: RegisteredDescriptionsItem) => void
  removeItem: (id: symbol) => void
}

export const descriptionsKey: InjectionKey<DescriptionsContext> =
  Symbol('su-descriptions')
