import type { InjectionKey, Ref } from 'vue'
import type { FormSize } from '../form/context'

export type CheckboxValue = boolean | string | number
export type CheckboxGroupDirection = 'horizontal' | 'vertical'

export interface CheckboxGroupContext {
  modelValue: Ref<CheckboxValue[]>
  name: Ref<string | undefined>
  size: Ref<FormSize>
  disabled: Ref<boolean>
  max: Ref<number | undefined>
  change: (value: CheckboxValue, checked: boolean, event: Event) => CheckboxValue[]
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('su-checkbox-group')
