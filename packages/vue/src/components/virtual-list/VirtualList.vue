<script setup lang="ts" generic="T = unknown">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import { useLocale } from '../../config-provider'
import type { VirtualListItemKey, VirtualListScrollState } from './context'

defineOptions({
  name: 'SuVirtualList',
})

const props = withDefaults(
  defineProps<{
    items?: T[]
    height?: number | string
    itemHeight?: number
    itemKey?: VirtualListItemKey<T>
    buffer?: number
    emptyText?: string
  }>(),
  {
    items: () => [],
    height: 320,
    itemHeight: 40,
    itemKey: undefined,
    buffer: 5,
    emptyText: undefined,
  },
)

const emit = defineEmits<{
  scroll: [event: Event, state: VirtualListScrollState]
}>()

defineSlots<{
  default?: (scope: { item: T; index: number; itemIndex: number }) => unknown
  empty?: () => unknown
}>()

const viewportRef = ref<HTMLElement>()
const locale = useLocale()
const scrollTop = ref(0)
const measuredHeight = ref(typeof props.height === 'number' ? props.height : props.itemHeight * 10)

let resizeObserver: ResizeObserver | undefined

const normalizedItemHeight = computed(() => Math.max(1, props.itemHeight))
const mergedEmptyText = computed(() => props.emptyText ?? locale.value.virtualList.empty)
const normalizedBuffer = computed(() => Math.max(0, Math.floor(props.buffer)))

const viewportStyle = computed<CSSProperties>(() => ({
  height: formatSize(props.height),
}))

const totalHeight = computed(() => props.items.length * normalizedItemHeight.value)

const visibleCount = computed(() =>
  Math.max(1, Math.ceil(measuredHeight.value / normalizedItemHeight.value)),
)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / normalizedItemHeight.value) - normalizedBuffer.value),
)

const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + normalizedBuffer.value * 2),
)

const offsetTop = computed(() => startIndex.value * normalizedItemHeight.value)

const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

const contentStyle = computed<CSSProperties>(() => ({
  height: `${totalHeight.value}px`,
}))

const listStyle = computed<CSSProperties>(() => ({
  transform: `translateY(${offsetTop.value}px)`,
}))

const itemStyle = computed<CSSProperties>(() => ({
  height: `${normalizedItemHeight.value}px`,
}))

watch(
  () => [props.items.length, normalizedItemHeight.value],
  () => {
    nextTick(() => {
      const viewport = viewportRef.value

      if (!viewport) {
        return
      }

      const maxScrollTop = Math.max(0, totalHeight.value - measuredHeight.value)

      if (viewport.scrollTop > maxScrollTop) {
        viewport.scrollTop = maxScrollTop
      }

      scrollTop.value = viewport.scrollTop
    })
  },
)

onMounted(() => {
  updateMeasuredHeight()

  if (typeof ResizeObserver !== 'undefined' && viewportRef.value) {
    resizeObserver = new ResizeObserver(updateMeasuredHeight)
    resizeObserver.observe(viewportRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function formatSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function updateMeasuredHeight() {
  const viewport = viewportRef.value
  const nextHeight = viewport?.clientHeight ?? 0

  if (nextHeight > 0) {
    measuredHeight.value = nextHeight
  }
}

function getItemIndex(index: number) {
  return startIndex.value + index
}

function getItemKey(item: T, index: number) {
  const itemIndex = getItemIndex(index)

  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, itemIndex)
  }

  if (props.itemKey !== undefined && item && typeof item === 'object' && props.itemKey in item) {
    return (item as Record<string | number, unknown>)[props.itemKey] as string | number
  }

  return itemIndex
}

function createScrollState(): VirtualListScrollState {
  return {
    scrollTop: scrollTop.value,
    startIndex: startIndex.value,
    endIndex: endIndex.value,
    visibleCount: visibleCount.value,
  }
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement

  scrollTop.value = target.scrollTop
  emit('scroll', event, createScrollState())
}

function scrollToIndex(index: number, align: 'start' | 'center' | 'end' = 'start') {
  const viewport = viewportRef.value

  if (!viewport || props.items.length === 0) {
    return
  }

  const targetIndex = Math.min(Math.max(0, index), props.items.length - 1)
  const baseTop = targetIndex * normalizedItemHeight.value
  const nextTop =
    align === 'center'
      ? baseTop - (measuredHeight.value - normalizedItemHeight.value) / 2
      : align === 'end'
        ? baseTop - measuredHeight.value + normalizedItemHeight.value
        : baseTop
  const maxScrollTop = Math.max(0, totalHeight.value - measuredHeight.value)

  viewport.scrollTop = Math.min(Math.max(0, nextTop), maxScrollTop)
  scrollTop.value = viewport.scrollTop
}

function scrollTo(offset: number) {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  const maxScrollTop = Math.max(0, totalHeight.value - measuredHeight.value)

  viewport.scrollTop = Math.min(Math.max(0, offset), maxScrollTop)
  scrollTop.value = viewport.scrollTop
}

defineExpose({
  scrollTo,
  scrollToIndex,
})
</script>

<template>
  <div class="su-virtual-list">
    <div
      ref="viewportRef"
      class="su-virtual-list__viewport"
      :style="viewportStyle"
      @scroll="handleScroll"
    >
      <div v-if="items.length > 0" class="su-virtual-list__content" :style="contentStyle">
        <div class="su-virtual-list__items" :style="listStyle">
          <div
            v-for="(item, index) in visibleItems"
            :key="getItemKey(item, index)"
            class="su-virtual-list__item"
            :style="itemStyle"
          >
            <slot :item="item" :index="getItemIndex(index)" :item-index="getItemIndex(index)">
              {{ item }}
            </slot>
          </div>
        </div>
      </div>

      <div v-else class="su-virtual-list__empty">
        <slot name="empty">{{ mergedEmptyText }}</slot>
      </div>
    </div>
  </div>
</template>

<style>
.su-virtual-list {
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-virtual-list__viewport {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.su-virtual-list__content {
  position: relative;
  width: 100%;
}

.su-virtual-list__items {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  will-change: transform;
}

.su-virtual-list__item {
  box-sizing: border-box;
  overflow: hidden;
}

.su-virtual-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: var(--su-space-xl);
  color: var(--su-color-text-muted);
  text-align: center;
}
</style>
