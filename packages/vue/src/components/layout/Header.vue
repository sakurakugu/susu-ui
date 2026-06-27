<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuHeader',
})

const props = withDefaults(
  defineProps<{
    height?: number | string
  }>(),
  {
    height: 64,
  },
)

defineSlots<{
  default?: () => unknown
}>()

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

const headerStyle = computed(() => ({
  height: normalizeSize(props.height),
}))
</script>

<template>
  <header class="su-layout__header" :style="headerStyle">
    <slot />
  </header>
</template>
