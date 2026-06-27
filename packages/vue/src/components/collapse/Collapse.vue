<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import {
  collapseKey,
  type CollapseSize,
  type CollapseValue,
  type RegisteredCollapseItem,
} from './context'

defineOptions({
  name: 'SuCollapse',
})

const model = defineModel<CollapseValue | CollapseValue[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    accordion?: boolean
    size?: CollapseSize
    bordered?: boolean
    ghost?: boolean
    destroyInactivePanel?: boolean
  }>(),
  {
    accordion: false,
    size: 'medium',
    bordered: true,
    ghost: false,
    destroyInactivePanel: false,
  },
)

const emit = defineEmits<{
  change: [activeNames: CollapseValue | CollapseValue[]]
  itemClick: [name: CollapseValue, event: MouseEvent | KeyboardEvent]
}>()

defineSlots<{
  default?: () => unknown
}>()

const items = ref<RegisteredCollapseItem[]>([])
const visitedNames = ref<CollapseValue[]>([])

const itemsWithName = computed(() =>
  items.value.map((item, index) => ({
    ...item,
    resolvedName: item.name ?? index,
  })),
)

const activeNameList = computed(() => {
  if (props.accordion) {
    const activeName = Array.isArray(model.value) ? model.value[0] : model.value

    return activeName === undefined ? [] : [activeName]
  }

  return Array.isArray(model.value)
    ? model.value
    : model.value === undefined
      ? []
      : [model.value]
})

provide(collapseKey, {
  updateItem(item) {
    const index = items.value.findIndex((current) => current.id === item.id)

    if (index >= 0) {
      items.value.splice(index, 1, item)
      return
    }

    items.value.push(item)
  },
  removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
  },
})

watch(
  activeNameList,
  (names) => {
    names.forEach((name) => {
      if (!visitedNames.value.includes(name)) {
        visitedNames.value.push(name)
      }
    })
  },
  { immediate: true },
)

function isActive(name: CollapseValue) {
  return activeNameList.value.includes(name)
}

function setActiveNames(names: CollapseValue[]) {
  if (props.accordion) {
    model.value = names[0]
  } else {
    model.value = names
  }

  emit('change', model.value)
}

function toggleItem(
  item: RegisteredCollapseItem & { resolvedName: CollapseValue },
  event: MouseEvent | KeyboardEvent,
) {
  if (item.disabled) {
    return
  }

  emit('itemClick', item.resolvedName, event)

  if (props.accordion) {
    setActiveNames(isActive(item.resolvedName) ? [] : [item.resolvedName])
    return
  }

  const names = new Set(activeNameList.value)

  if (names.has(item.resolvedName)) {
    names.delete(item.resolvedName)
  } else {
    names.add(item.resolvedName)
  }

  setActiveNames(Array.from(names))
}

function handleKeydown(
  item: RegisteredCollapseItem & { resolvedName: CollapseValue },
  event: KeyboardEvent,
) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  toggleItem(item, event)
}

function shouldRenderContent(
  item: RegisteredCollapseItem & { resolvedName: CollapseValue },
) {
  if (isActive(item.resolvedName)) {
    return true
  }

  return (
    !props.destroyInactivePanel ||
    visitedNames.value.includes(item.resolvedName)
  )
}

function getHeaderId(name: CollapseValue) {
  return `su-collapse-header-${String(name)}`
}

function getPanelId(name: CollapseValue) {
  return `su-collapse-panel-${String(name)}`
}

function renderContent(content: unknown) {
  return () => content
}
</script>

<template>
  <div
    class="su-collapse"
    :class="[
      `su-collapse--${size}`,
      {
        'is-bordered': bordered,
        'is-ghost': ghost,
      },
    ]"
  >
    <div v-if="$slots.default" class="su-collapse__items-source">
      <slot />
    </div>

    <div
      v-for="item in itemsWithName"
      :key="item.id"
      class="su-collapse__item"
      :class="{
        'is-active': isActive(item.resolvedName),
        'is-disabled': item.disabled,
      }"
    >
      <button
        :id="getHeaderId(item.resolvedName)"
        class="su-collapse__header"
        type="button"
        :disabled="item.disabled"
        :aria-expanded="isActive(item.resolvedName)"
        :aria-controls="getPanelId(item.resolvedName)"
        @click="toggleItem(item, $event)"
        @keydown="handleKeydown(item, $event)"
      >
        <span class="su-collapse__arrow" aria-hidden="true" />
        <span class="su-collapse__title">
          <component
            :is="
              renderContent(
                item.titleContent ? item.titleContent() : (item.title ?? ''),
              )
            "
          />
        </span>
        <span v-if="item.extraContent" class="su-collapse__extra">
          <component :is="renderContent(item.extraContent())" />
        </span>
      </button>

      <div
        v-if="shouldRenderContent(item)"
        v-show="isActive(item.resolvedName)"
        :id="getPanelId(item.resolvedName)"
        class="su-collapse__panel"
        role="region"
        :aria-labelledby="getHeaderId(item.resolvedName)"
      >
        <div class="su-collapse__body">
          <component :is="renderContent(item.content ? item.content() : '')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.su-collapse {
  overflow: hidden;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-collapse.is-bordered {
  border: 1px solid var(--su-color-border);
}

.su-collapse.is-ghost {
  border: 0;
  background: transparent;
}

.su-collapse__items-source {
  display: none;
}

.su-collapse__item + .su-collapse__item {
  border-top: 1px solid var(--su-color-border);
}

.su-collapse.is-ghost .su-collapse__item {
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.su-collapse.is-ghost .su-collapse__item + .su-collapse__item {
  margin-top: var(--su-space-sm);
}

.su-collapse__header {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 0 var(--su-space-lg);
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-collapse__header:hover:not(:disabled) {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 42%, transparent);
}

.su-collapse__header:focus-visible {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--su-color-primary);
  outline-offset: -2px;
}

.su-collapse__header:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-collapse__arrow {
  width: 8px;
  height: 8px;
  margin-right: var(--su-space-sm);
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
  transition: transform 0.16s ease;
}

.su-collapse__item.is-active > .su-collapse__header .su-collapse__arrow {
  transform: rotate(45deg);
}

.su-collapse__title {
  overflow: hidden;
  min-width: 0;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-collapse__extra {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex: none;
  margin-left: var(--su-space-md);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-collapse__panel {
  border-top: 1px solid var(--su-color-border);
}

.su-collapse__body {
  padding: var(--su-space-md) var(--su-space-lg) var(--su-space-lg)
    calc(var(--su-space-lg) + var(--su-space-sm) + 8px);
  color: var(--su-color-text);
}

.su-collapse--small {
  font-size: var(--su-font-size-sm);
}

.su-collapse--small .su-collapse__header {
  min-height: 36px;
  padding-right: var(--su-space-md);
  padding-left: var(--su-space-md);
}

.su-collapse--small .su-collapse__body {
  padding: var(--su-space-sm) var(--su-space-md) var(--su-space-md)
    calc(var(--su-space-md) + var(--su-space-sm) + 8px);
}

.su-collapse--large {
  font-size: var(--su-font-size-lg);
}

.su-collapse--large .su-collapse__header {
  min-height: 52px;
  padding-right: var(--su-space-xl);
  padding-left: var(--su-space-xl);
}

.su-collapse--large .su-collapse__body {
  padding: var(--su-space-lg) var(--su-space-xl) var(--su-space-xl)
    calc(var(--su-space-xl) + var(--su-space-sm) + 8px);
}

@media (prefers-reduced-motion: reduce) {
  .su-collapse__header,
  .su-collapse__arrow {
    transition: none;
  }
}
</style>
