<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuGridItem',
})

const props = withDefaults(
  defineProps<{
    span?: number
    rowSpan?: number
    offset?: number
    order?: number
  }>(),
  {
    span: 1,
    rowSpan: 1,
    offset: 0,
    order: undefined,
  },
)

defineSlots<{
  default?: () => unknown
}>()

const itemStyle = computed<CSSProperties>(() => {
  const span = Math.max(1, Math.floor(props.span))
  const rowSpan = Math.max(1, Math.floor(props.rowSpan))
  const offset = Math.max(0, Math.floor(props.offset))

  return {
    gridColumn: offset > 0 ? `${offset + 1} / span ${span}` : `span ${span}`,
    gridRow: `span ${rowSpan}`,
    order: props.order,
  }
})
</script>

<template>
  <div class="su-grid__item" :style="itemStyle">
    <slot />
  </div>
</template>

<style>
.su-grid__item {
  min-width: 0;
}
</style>
