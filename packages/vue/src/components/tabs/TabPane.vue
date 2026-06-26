<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useSlots, watchEffect } from 'vue'
import { tabsKey, type RegisteredTabPane, type TabsValue } from './context'

defineOptions({
  name: 'SuTabPane',
})

const props = withDefaults(
  defineProps<{
    label?: string
    name?: TabsValue
    disabled?: boolean
    lazy?: boolean
  }>(),
  {
    label: undefined,
    name: undefined,
    disabled: false,
    lazy: false,
  },
)

defineSlots<{
  default?: () => unknown
  label?: () => unknown
}>()

const runtimeSlots = useSlots()
const tabs = inject(tabsKey, undefined)
const paneId = Symbol('su-tab-pane')

const pane = computed<RegisteredTabPane>(() => ({
  id: paneId,
  label: props.label,
  name: props.name,
  disabled: props.disabled,
  lazy: props.lazy,
  labelContent: runtimeSlots.label,
  content: runtimeSlots.default,
}))

watchEffect(() => {
  tabs?.updatePane(pane.value)
})

onBeforeUnmount(() => {
  tabs?.removePane(paneId)
})
</script>

<template>
  <span style="display: none" />
</template>
