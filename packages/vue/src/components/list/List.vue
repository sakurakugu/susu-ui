<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../config-provider'

defineOptions({
  name: 'SuList',
})

export type ListSize = 'small' | 'medium' | 'large'
export type ListItemLayout = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    title?: string
    bordered?: boolean
    divided?: boolean
    striped?: boolean
    hoverable?: boolean
    size?: ListSize
    itemLayout?: ListItemLayout
    loading?: boolean
    emptyText?: string
  }>(),
  {
    title: undefined,
    bordered: true,
    divided: true,
    striped: false,
    hoverable: false,
    size: 'medium',
    itemLayout: 'horizontal',
    loading: false,
    emptyText: undefined,
  },
)

defineSlots<{
  default?: () => unknown
  header?: () => unknown
  footer?: () => unknown
  empty?: () => unknown
}>()

const locale = useLocale()
const hasHeader = computed(() => Boolean(props.title))
const mergedEmptyText = computed(
  () => props.emptyText ?? locale.value.empty.description,
)
</script>

<template>
  <section
    class="su-list"
    :class="[
      `su-list--${size}`,
      `su-list--${itemLayout}`,
      {
        'is-bordered': bordered,
        'is-divided': divided,
        'is-striped': striped,
        'is-hoverable': hoverable,
        'is-loading': loading,
        'is-empty': !$slots.default,
        'has-header': hasHeader || $slots.header,
        'has-footer': $slots.footer,
      },
    ]"
  >
    <div v-if="hasHeader || $slots.header" class="su-list__header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>

    <div v-if="loading" class="su-list__loading" role="status">
      {{ locale.list.loading }}
    </div>

    <div v-else-if="$slots.default" class="su-list__body">
      <slot />
    </div>

    <div v-else class="su-list__empty">
      <slot name="empty">
        {{ mergedEmptyText }}
      </slot>
    </div>

    <div v-if="$slots.footer" class="su-list__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style>
.su-list {
  overflow: hidden;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-list.is-bordered {
  border: 1px solid var(--su-color-border);
}

.su-list__header,
.su-list__footer {
  padding: var(--su-list-padding-y) var(--su-list-padding-x);
  background: var(--su-color-bg-elevated);
  font-weight: 600;
}

.su-list__header {
  border-bottom: 1px solid var(--su-color-border);
}

.su-list__footer {
  border-top: 1px solid var(--su-color-border);
  color: var(--su-color-text-muted);
  font-weight: 400;
  font-size: var(--su-font-size-sm);
}

.su-list__body {
  min-width: 0;
}

.su-list__empty,
.su-list__loading {
  padding: calc(var(--su-list-padding-y) * 2) var(--su-list-padding-x);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-list--small {
  --su-list-padding-y: 8px;
  --su-list-padding-x: var(--su-space-md);

  font-size: var(--su-font-size-sm);
}

.su-list--medium {
  --su-list-padding-y: 12px;
  --su-list-padding-x: var(--su-space-lg);
}

.su-list--large {
  --su-list-padding-y: 16px;
  --su-list-padding-x: var(--su-space-xl);

  font-size: var(--su-font-size-lg);
}

.su-list.is-divided .su-list__item + .su-list__item {
  border-top: 1px solid var(--su-color-border);
}

.su-list.is-striped .su-list__item:nth-child(even) {
  background: var(--su-color-bg-soft);
}

.su-list.is-hoverable .su-list__item:hover {
  background: color-mix(
    in srgb,
    var(--su-color-primary) 8%,
    var(--su-color-bg-elevated)
  );
}

.su-list--vertical .su-list__item {
  align-items: stretch;
}
</style>
