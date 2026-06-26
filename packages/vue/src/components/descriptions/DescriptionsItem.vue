<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useSlots, watchEffect } from 'vue'
import {
  descriptionsKey,
  type DescriptionsItem,
  type RegisteredDescriptionsItem,
} from './context'

defineOptions({
  name: 'SuDescriptionsItem',
})

const props = withDefaults(
  defineProps<{
    label?: string
    span?: number
    className?: string
    labelClassName?: string
    contentClassName?: string
  }>(),
  {
    label: undefined,
    span: 1,
    className: undefined,
    labelClassName: undefined,
    contentClassName: undefined,
  },
)

defineSlots<{
  default?: () => unknown
  label?: () => unknown
}>()

const runtimeSlots = useSlots()
const descriptions = inject(descriptionsKey, undefined)
const itemId = Symbol('su-descriptions-item')

const item = computed<RegisteredDescriptionsItem>(() => ({
  id: itemId,
  label: props.label,
  labelContent: runtimeSlots.label as DescriptionsItem['labelContent'],
  span: props.span,
  className: props.className,
  labelClassName: props.labelClassName,
  contentClassName: props.contentClassName,
  content: runtimeSlots.default as DescriptionsItem['content'],
}))

watchEffect(() => {
  descriptions?.updateItem(item.value)
})

onBeforeUnmount(() => {
  descriptions?.removeItem(itemId)
})
</script>

<template>
  <span style="display: none" />
</template>
