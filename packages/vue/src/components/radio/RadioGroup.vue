<script setup lang="ts">
import { computed, inject, provide, toRef } from 'vue'
import { formKey, type FormSize } from '../form/context'
import {
  radioGroupKey,
  type RadioGroupDirection,
  type RadioValue,
} from './context'

defineOptions({
  name: 'SuRadioGroup',
})

const model = defineModel<RadioValue>()

const props = withDefaults(
  defineProps<{
    size?: FormSize
    disabled?: boolean
    name?: string
    direction?: RadioGroupDirection
  }>(),
  {
    size: undefined,
    disabled: false,
    name: undefined,
    direction: 'horizontal',
  },
)

const emit = defineEmits<{
  change: [value: RadioValue, event: Event]
}>()

const form = inject(formKey, undefined)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

function handleChange(value: RadioValue, event: Event) {
  model.value = value
  emit('change', value, event)
}

provide(radioGroupKey, {
  modelValue: model,
  name: toRef(props, 'name'),
  size: mergedSize,
  disabled: mergedDisabled,
  change: handleChange,
})
</script>

<template>
  <div
    class="su-radio-group"
    :class="[
      `su-radio-group--${direction}`,
      `su-radio-group--${mergedSize}`,
      {
        'is-disabled': mergedDisabled,
      },
    ]"
    role="radiogroup"
  >
    <slot />
  </div>
</template>

<style>
.su-radio-group {
  display: inline-flex;
  gap: var(--su-space-lg);
  max-width: 100%;
  vertical-align: middle;
}

.su-radio-group--vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--su-space-sm);
}

.su-radio-group--horizontal {
  flex-wrap: wrap;
  align-items: center;
}
</style>
