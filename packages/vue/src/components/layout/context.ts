import type { InjectionKey } from 'vue'

export interface LayoutContext {
  addSider: () => void
  removeSider: () => void
}

export const layoutKey: InjectionKey<LayoutContext> = Symbol('SuLayout')
