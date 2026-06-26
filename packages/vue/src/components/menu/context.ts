import type { ComputedRef, Ref } from 'vue'
import type { InjectionKey } from 'vue'
import type { MenuKey, MenuRenderItem } from './Menu.vue'

export interface MenuContext {
  selectedKey: Ref<MenuKey | undefined>
  firstEnabledKey: ComputedRef<MenuKey | undefined>
  isHorizontal: ComputedRef<boolean>
  isCollapsed: ComputedRef<boolean>
  selectable: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  isOpen: (item: MenuRenderItem) => boolean
  isItemDisabled: (item: MenuRenderItem) => boolean
  hasChildren: (item: MenuRenderItem) => boolean
  handleItemClick: (item: MenuRenderItem) => void
  handleItemKeydown: (item: MenuRenderItem, event: KeyboardEvent) => void
}

export const menuKey: InjectionKey<MenuContext> = Symbol('su-menu')
