<script setup lang="ts">
import { computed, provide, ref, type CSSProperties } from 'vue'
import {
  descriptionsKey,
  type DescriptionsItem,
  type DescriptionsLayout,
  type DescriptionsSize,
  type RegisteredDescriptionsItem,
} from './context'

defineOptions({
  name: 'SuDescriptions',
})

const props = withDefaults(
  defineProps<{
    title?: string
    items?: DescriptionsItem[]
    column?: number
    size?: DescriptionsSize
    layout?: DescriptionsLayout
    border?: boolean
    colon?: boolean
    labelWidth?: number | string
  }>(),
  {
    title: undefined,
    items: undefined,
    column: 3,
    size: 'medium',
    layout: 'horizontal',
    border: false,
    colon: true,
    labelWidth: undefined,
  },
)

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  extra?: () => unknown
}>()

const slotItems = ref<RegisteredDescriptionsItem[]>([])

const normalizedPropItems = computed<RegisteredDescriptionsItem[]>(() =>
  (props.items ?? []).map((item, index) => ({
    ...item,
    id: Symbol.for(`su-descriptions-prop-item-${index}`),
  })),
)

const mergedItems = computed<RegisteredDescriptionsItem[]>(() => [
  ...normalizedPropItems.value,
  ...slotItems.value,
])

const normalizedColumn = computed(() => Math.max(1, props.column))

const descriptionsStyle = computed<CSSProperties>(() => ({
  '--su-descriptions-column': normalizedColumn.value,
  '--su-descriptions-label-width': formatSize(props.labelWidth),
}))

provide(descriptionsKey, {
  items: slotItems,
  updateItem(item) {
    const index = slotItems.value.findIndex((current) => current.id === item.id)
    if (index >= 0) {
      slotItems.value.splice(index, 1, item)
      return
    }

    slotItems.value.push(item)
  },
  removeItem(id) {
    slotItems.value = slotItems.value.filter((item) => item.id !== id)
  },
})

function formatSize(value: number | string | undefined) {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

function getItemStyle(item: DescriptionsItem): CSSProperties {
  return {
    gridColumn: `span ${Math.min(Math.max(item.span ?? 1, 1), normalizedColumn.value)}`,
  }
}

function getItemContent(item: DescriptionsItem) {
  if (typeof item.content === 'function') {
    return item.content()
  }

  return item.content ?? ''
}

function getItemLabel(item: DescriptionsItem) {
  if (item.labelContent) {
    return item.labelContent()
  }

  return item.label ?? ''
}

function renderContent(content: unknown) {
  return () => content
}
</script>

<template>
  <section
    class="su-descriptions"
    :class="[
      `su-descriptions--${size}`,
      `su-descriptions--${layout}`,
      {
        'su-descriptions--border': border,
        'su-descriptions--colon': colon,
        'has-header': title || $slots.title || $slots.extra,
      },
    ]"
    :style="descriptionsStyle"
  >
    <div v-if="title || $slots.title || $slots.extra" class="su-descriptions__header">
      <div class="su-descriptions__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="$slots.extra" class="su-descriptions__extra">
        <slot name="extra" />
      </div>
    </div>

    <div v-if="$slots.default" class="su-descriptions__items">
      <slot />
    </div>

    <div class="su-descriptions__body">
      <div
        v-for="item in mergedItems"
        :key="item.id"
        class="su-descriptions__item"
        :class="[item.className]"
        :style="getItemStyle(item)"
      >
        <div class="su-descriptions__label" :class="[item.labelClassName]">
          <component :is="renderContent(getItemLabel(item))" />
        </div>
        <div class="su-descriptions__content" :class="[item.contentClassName]">
          <component :is="renderContent(getItemContent(item))" />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.su-descriptions {
  --su-descriptions-column: 3;
  --su-descriptions-label-width: auto;
  --su-descriptions-padding-y: 8px;
  --su-descriptions-padding-x: var(--su-space-md);

  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-descriptions--small {
  --su-descriptions-padding-y: 6px;
  --su-descriptions-padding-x: var(--su-space-sm);

  font-size: var(--su-font-size-sm);
}

.su-descriptions--large {
  --su-descriptions-padding-y: 12px;
  --su-descriptions-padding-x: var(--su-space-lg);

  font-size: var(--su-font-size-lg);
}

.su-descriptions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  margin-bottom: var(--su-space-md);
}

.su-descriptions__title {
  min-width: 0;
  font-weight: 600;
}

.su-descriptions__extra {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex: none;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-descriptions__items {
  display: none;
}

.su-descriptions__body {
  display: grid;
  grid-template-columns: repeat(var(--su-descriptions-column), minmax(0, 1fr));
  row-gap: var(--su-space-sm);
  column-gap: var(--su-space-xl);
}

.su-descriptions__item {
  display: flex;
  min-width: 0;
}

.su-descriptions--vertical .su-descriptions__item {
  flex-direction: column;
}

.su-descriptions__label {
  flex: none;
  width: var(--su-descriptions-label-width);
  min-width: 0;
  color: var(--su-color-text-muted);
  white-space: nowrap;
}

.su-descriptions--colon .su-descriptions__label:not(:empty)::after {
  content: ':';
}

.su-descriptions__content {
  min-width: 0;
  color: var(--su-color-text);
  word-break: break-word;
}

.su-descriptions--horizontal .su-descriptions__label {
  margin-right: var(--su-space-sm);
}

.su-descriptions--vertical .su-descriptions__label {
  margin-bottom: var(--su-space-xs);
}

.su-descriptions--border .su-descriptions__body {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.su-descriptions--border .su-descriptions__item {
  border-right: 1px solid var(--su-color-border);
  border-bottom: 1px solid var(--su-color-border);
}

.su-descriptions--border .su-descriptions__label,
.su-descriptions--border .su-descriptions__content {
  padding: var(--su-descriptions-padding-y) var(--su-descriptions-padding-x);
}

.su-descriptions--border .su-descriptions__label {
  display: flex;
  align-items: center;
  background: var(--su-color-bg-soft);
  font-weight: 500;
}

.su-descriptions--border .su-descriptions__content {
  flex: 1;
}

.su-descriptions--border.su-descriptions--vertical .su-descriptions__label {
  margin-bottom: 0;
  border-bottom: 1px solid var(--su-color-border);
}

@media (width <= 640px) {
  .su-descriptions__body {
    grid-template-columns: 1fr;
  }

  .su-descriptions__item {
    grid-column: span 1 !important;
  }
}
</style>
