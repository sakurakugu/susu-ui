<script setup lang="ts">
import { computed, inject, provide, toRef } from 'vue'
import { formKey, type FormSize } from '../form/context'
import {
  checkboxGroupKey,
  type CheckboxGroupDirection,
  type CheckboxValue,
} from './context'

defineOptions({
  name: 'SuCheckboxGroup',
})

const model = defineModel<CheckboxValue[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    size?: FormSize
    disabled?: boolean
    name?: string
    direction?: CheckboxGroupDirection
    max?: number
  }>(),
  {
    size: undefined,
    disabled: false,
    name: undefined,
    direction: 'horizontal',
    max: undefined,
  },
)

const emit = defineEmits<{
  change: [value: CheckboxValue[], event: Event]
}>()

const form = inject(formKey, undefined)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

function handleChange(
  value: CheckboxValue,
  checked: boolean,
  event: Event,
): CheckboxValue[] {
  const currentValue = Array.isArray(model.value) ? model.value : []
  const shouldIgnoreChecked =
    checked &&
    !currentValue.includes(value) &&
    props.max !== undefined &&
    currentValue.length >= props.max

  if (shouldIgnoreChecked) {
    return currentValue
  }

  const nextValue = checked
    ? currentValue.includes(value)
      ? currentValue
      : [...currentValue, value]
    : currentValue.filter((item) => item !== value)

  model.value = nextValue
  emit('change', nextValue, event)
  return nextValue
}

provide(checkboxGroupKey, {
  modelValue: model,
  name: toRef(props, 'name'),
  size: mergedSize,
  disabled: mergedDisabled,
  max: toRef(props, 'max'),
  change: handleChange,
})
</script>

<template>
  <div
    class="su-checkbox-group"
    :class="[
      `su-checkbox-group--${direction}`,
      `su-checkbox-group--${mergedSize}`,
      {
        'is-disabled': mergedDisabled,
      },
    ]"
    role="group"
  >
    <slot />
  </div>
</template>

<style>
.su-checkbox-group {
  display: inline-flex;
  gap: var(--su-space-lg);
  max-width: 100%;
  vertical-align: middle;
}

.su-checkbox-group--vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--su-space-sm);
}

.su-checkbox-group--horizontal {
  flex-wrap: wrap;
  align-items: center;
}
</style>
