<script setup lang="ts">
defineOptions({
  name: 'SuBreadcrumb',
})

export interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItem[]
    separator?: string
    ariaLabel?: string
  }>(),
  {
    items: () => [],
    separator: '/',
    ariaLabel: '面包屑导航',
  },
)

const emit = defineEmits<{
  click: [item: BreadcrumbItem, index: number, event: MouseEvent]
}>()

defineSlots<{
  default?: () => unknown
  item?: (props: {
    item: BreadcrumbItem
    index: number
    isLast: boolean
  }) => unknown
  separator?: () => unknown
}>()

function handleClick(
  item: BreadcrumbItem,
  index: number,
  isLast: boolean,
  event: MouseEvent,
) {
  if (item.disabled || isLast) {
    event.preventDefault()
    return
  }

  emit('click', item, index, event)
}
</script>

<template>
  <nav class="su-breadcrumb" :aria-label="ariaLabel">
    <slot>
      <ol class="su-breadcrumb__list">
        <li
          v-for="(item, index) in props.items"
          :key="`${item.label}-${index}`"
          class="su-breadcrumb__item"
          :class="{
            'is-disabled': item.disabled,
            'is-current': index === props.items.length - 1,
          }"
        >
          <a
            v-if="item.href && index !== props.items.length - 1"
            class="su-breadcrumb__link"
            :href="item.href"
            :aria-disabled="item.disabled || undefined"
            @click="handleClick(item, index, false, $event)"
          >
            <slot name="item" :item="item" :index="index" :is-last="false">
              {{ item.label }}
            </slot>
          </a>
          <button
            v-else-if="index !== props.items.length - 1"
            class="su-breadcrumb__link su-breadcrumb__button"
            type="button"
            :disabled="item.disabled"
            @click="handleClick(item, index, false, $event)"
          >
            <slot name="item" :item="item" :index="index" :is-last="false">
              {{ item.label }}
            </slot>
          </button>
          <span v-else class="su-breadcrumb__current" aria-current="page">
            <slot name="item" :item="item" :index="index" :is-last="true">
              {{ item.label }}
            </slot>
          </span>

          <span
            v-if="index !== props.items.length - 1"
            class="su-breadcrumb__separator"
            aria-hidden="true"
          >
            <slot name="separator">
              {{ separator }}
            </slot>
          </span>
        </li>
      </ol>
    </slot>
  </nav>
</template>

<style>
.su-breadcrumb {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--su-space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--su-space-xs);
}

.su-breadcrumb__link,
.su-breadcrumb__current {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 16em;
}

.su-breadcrumb__link {
  border: 0;
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.16s ease;
}

.su-breadcrumb__link:hover,
.su-breadcrumb__link:focus-visible {
  color: var(--su-color-primary);
  outline: none;
}

.su-breadcrumb__button {
  padding: 0;
}

.su-breadcrumb__current {
  color: var(--su-color-text);
  font-weight: 500;
}

.su-breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  color: var(--su-color-text-muted);
  user-select: none;
}

.su-breadcrumb__item.is-disabled .su-breadcrumb__link {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
