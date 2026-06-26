<script setup lang="ts">
import type { SelectValue } from './Select.vue'

defineOptions({
  name: 'SuOption',
})

withDefaults(
  defineProps<{
    label?: string
    value: SelectValue
    disabled?: boolean
  }>(),
  {
    label: undefined,
    disabled: false,
  },
)
</script>

<template>
  <option :value="value" :disabled="disabled">
    <slot>{{ label }}</slot>
  </option>
</template>
