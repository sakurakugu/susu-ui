<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuMasonry',
})

export type MasonrySize = 'small' | 'medium' | 'large' | number | string
export type MasonryGap = MasonrySize | [MasonrySize, MasonrySize]
export type MasonryColumnFill = 'balance' | 'auto'
export type MasonryItemKey =
  string | number | ((item: unknown, index: number) => PropertyKey)

const sizeMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'var(--su-space-sm)',
  medium: 'var(--su-space-md)',
  large: 'var(--su-space-lg)',
}

const props = withDefaults(
  defineProps<{
    items?: unknown[]
    columns?: number
    minColumnWidth?: number | string
    gap?: MasonryGap
    columnFill?: MasonryColumnFill
    tag?: string
    itemTag?: string
    itemKey?: MasonryItemKey
  }>(),
  {
    items: undefined,
    columns: 3,
    minColumnWidth: undefined,
    gap: 'medium',
    columnFill: 'balance',
    tag: 'div',
    itemTag: 'div',
    itemKey: undefined,
  },
)

defineSlots<{
  default?: () => unknown
  item?: (props: { item: unknown; index: number }) => unknown
}>()

const normalizedColumns = computed(() => Math.max(1, Math.floor(props.columns)))

const normalizedGap = computed(() => {
  const [column, row] = Array.isArray(props.gap)
    ? props.gap
    : [props.gap, props.gap]

  return {
    column: formatSize(column),
    row: formatSize(row),
  }
})

const masonryStyle = computed<CSSProperties>(() => {
  const style: CSSProperties & Record<string, string | number | undefined> = {
    '--su-masonry-columns': normalizedColumns.value,
    '--su-masonry-column-gap': normalizedGap.value.column,
    '--su-masonry-row-gap': normalizedGap.value.row,
    columnFill: props.columnFill,
  }

  if (props.minColumnWidth !== undefined) {
    style['--su-masonry-min-column-width'] = formatSize(props.minColumnWidth)
  }

  return style
})

function formatSize(size: MasonrySize) {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return sizeMap[size as keyof typeof sizeMap] ?? size
}

function resolveItemKey(item: unknown, index: number) {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }

  if (typeof props.itemKey === 'string' || typeof props.itemKey === 'number') {
    return getValueByPath(item, String(props.itemKey)) ?? index
  }

  return index
}

function getValueByPath(source: unknown, path: string) {
  if (!source || typeof source !== 'object') {
    return undefined
  }

  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') {
      return undefined
    }

    return (value as Record<string, unknown>)[key]
  }, source)
}
</script>

<template>
  <component
    :is="tag"
    class="su-masonry"
    :class="{
      'su-masonry--auto': minColumnWidth !== undefined,
      'su-masonry--with-data': items,
    }"
    :style="masonryStyle"
  >
    <template v-if="items">
      <component
        :is="itemTag"
        v-for="(item, index) in items"
        :key="resolveItemKey(item, index)"
        class="su-masonry__item"
      >
        <slot name="item" :item="item" :index="index">
          {{ item }}
        </slot>
      </component>
    </template>
    <slot v-else />
  </component>
</template>

<style>
.su-masonry {
  column-count: var(--su-masonry-columns);
  column-gap: var(--su-masonry-column-gap);
  min-width: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-masonry--auto {
  column-count: auto;
  column-width: min(100%, var(--su-masonry-min-column-width));
}

.su-masonry > * {
  display: block;
  width: 100%;
  margin-block-end: var(--su-masonry-row-gap);
  break-inside: avoid;
  page-break-inside: avoid;
}

.su-masonry > *:last-child {
  margin-block-end: 0;
}
</style>
