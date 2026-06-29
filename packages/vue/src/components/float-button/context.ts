import type { ComputedRef, InjectionKey } from 'vue'

export type FloatButtonType = 'default' | 'primary'
export type FloatButtonShape = 'circle' | 'square'
export type FloatButtonGroupTrigger = 'click' | 'hover'
export type FloatButtonGroupPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface FloatButtonGroupContext {
  shape: ComputedRef<FloatButtonShape | undefined>
}

export const floatButtonGroupKey: InjectionKey<FloatButtonGroupContext> =
  Symbol('suFloatButtonGroup')
