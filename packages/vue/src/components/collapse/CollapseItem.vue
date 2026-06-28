<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useSlots, watchEffect } from 'vue'
import { collapseKey, type CollapseValue, type RegisteredCollapseItem } from './context'

defineOptions({
  name: 'SuCollapseItem',
})

const props = withDefaults(
  defineProps<{
    title?: string
    name?: CollapseValue
    disabled?: boolean
  }>(),
  {
    title: undefined,
    name: undefined,
    disabled: false,
  },
)

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  extra?: () => unknown
}>()

const runtimeSlots = useSlots()
const collapse = inject(collapseKey, undefined)
const itemId = Symbol('su-collapse-item')

const item = computed<RegisteredCollapseItem>(() => ({
  id: itemId,
  title: props.title,
  name: props.name,
  disabled: props.disabled,
  titleContent: runtimeSlots.title,
  extraContent: runtimeSlots.extra,
  content: runtimeSlots.default,
}))

watchEffect(() => {
  collapse?.updateItem(item.value)
})

onBeforeUnmount(() => {
  collapse?.removeItem(itemId)
})
</script>

<template>
  <span style="display: none" />
</template>
