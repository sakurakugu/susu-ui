<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuIcon',
})

const props = defineProps<{
  size?: number | string
  color?: string
}>()

const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.size !== undefined) {
    style.fontSize =
      typeof props.size === 'number' ? `${props.size}px` : props.size
  }

  if (props.color) {
    style.color = props.color
  }

  return style
})
</script>

<template>
  <span class="su-icon" :style="iconStyle" aria-hidden="true">
    <slot />
  </span>
</template>

<style>
.su-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: inherit;
  font-size: 1em;
  line-height: 1;
  vertical-align: -0.125em;
}

.su-icon > svg {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentcolor;
}
</style>
