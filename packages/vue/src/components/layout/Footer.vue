<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuFooter',
})

const props = withDefaults(
  defineProps<{
    height?: number | string
  }>(),
  {
    height: 56,
  },
)

defineSlots<{
  default?: () => unknown
}>()

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

const footerStyle = computed(() => ({
  minHeight: normalizeSize(props.height),
}))
</script>

<template>
  <footer class="su-layout__footer" :style="footerStyle">
    <slot />
  </footer>
</template>
