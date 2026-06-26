import type { InjectionKey, Ref } from 'vue'

export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormSize = 'small' | 'medium' | 'large'
export type FormItemStatus = 'default' | 'success' | 'warning' | 'error'

export interface FormContext {
  labelWidth: Ref<number | string | undefined>
  labelPosition: Ref<FormLabelPosition>
  size: Ref<FormSize>
  disabled: Ref<boolean>
}

export const formKey: InjectionKey<FormContext> = Symbol('su-form')
