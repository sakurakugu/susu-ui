<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuGrid',
})

export type GridSize = 'small' | 'medium' | 'large' | number | string
export type GridGap = GridSize | [GridSize, GridSize]
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline'
export type GridJustify = 'start' | 'end' | 'center' | 'stretch'

const sizeMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'var(--su-space-sm)',
  medium: 'var(--su-space-md)',
  large: 'var(--su-space-lg)',
}

const props = withDefaults(
  defineProps<{
    columns?: number
    gap?: GridGap
    align?: GridAlign
    justify?: GridJustify
    dense?: boolean
    minItemWidth?: number | string
  }>(),
  {
    columns: 12,
    gap: 'medium',
    align: 'stretch',
    justify: 'stretch',
    dense: false,
    minItemWidth: undefined,
  },
)

defineSlots<{
  default?: () => unknown
}>()

const normalizedColumns = computed(() => Math.max(1, Math.floor(props.columns)))

const normalizedGap = computed(() => {
  const [column, row] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap]

  return {
    column: formatSize(column),
    row: formatSize(row),
  }
})

const gridStyle = computed<CSSProperties>(() => {
  const style: CSSProperties & Record<string, string | number | undefined> = {
    '--su-grid-columns': normalizedColumns.value,
    '--su-grid-column-gap': normalizedGap.value.column,
    '--su-grid-row-gap': normalizedGap.value.row,
    alignItems: props.align,
    justifyItems: props.justify,
  }

  if (props.minItemWidth !== undefined) {
    style['--su-grid-min-item-width'] = formatSize(props.minItemWidth)
  }

  return style
})

function formatSize(size: GridSize) {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return sizeMap[size as keyof typeof sizeMap] ?? size
}
</script>

<template>
  <div
    class="su-grid"
    :class="{
      'su-grid--dense': dense,
      'su-grid--auto-fit': minItemWidth !== undefined,
    }"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>

<style>
.su-grid {
  display: grid;
  grid-template-columns: repeat(var(--su-grid-columns), minmax(0, 1fr));
  column-gap: var(--su-grid-column-gap);
  row-gap: var(--su-grid-row-gap);
  min-width: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-grid--dense {
  grid-auto-flow: dense;
}

.su-grid--auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--su-grid-min-item-width)), 1fr));
}
</style>
