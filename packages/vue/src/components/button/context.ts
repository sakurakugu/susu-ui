import type { ComputedRef, InjectionKey } from 'vue'

export type ButtonType = 'default' | 'primary'

export type ButtonVariant = 'solid' | 'outline' | 'text' | 'ghost'

export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonNativeType = 'button' | 'submit' | 'reset'

export type ButtonGroupContext = {
  type?: ButtonType
  variant?: ButtonVariant
  size?: ButtonSize
}

export const buttonGroupKey: InjectionKey<ComputedRef<ButtonGroupContext>> =
  Symbol('buttonGroup')
