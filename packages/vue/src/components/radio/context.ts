import type { InjectionKey, Ref } from 'vue'
import type { FormSize } from '../form/context'

export type RadioValue = string | number | boolean
export type RadioGroupDirection = 'horizontal' | 'vertical'

export interface RadioGroupContext {
  modelValue: Ref<RadioValue | undefined>
  name: Ref<string | undefined>
  size: Ref<FormSize>
  disabled: Ref<boolean>
  change: (value: RadioValue, event: Event) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol('su-radio-group')
