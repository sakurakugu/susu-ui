<script setup lang="ts">
import { computed, nextTick, provide, ref, watch, type CSSProperties } from 'vue'
import {
  tabsKey,
  type RegisteredTabPane,
  type TabsPlacement,
  type TabsSize,
  type TabsType,
  type TabsValue,
} from './context'

defineOptions({
  name: 'SuTabs',
})

const model = defineModel<TabsValue>()

const props = withDefaults(
  defineProps<{
    type?: TabsType
    size?: TabsSize
    placement?: TabsPlacement
    stretch?: boolean
    destroyInactivePane?: boolean
  }>(),
  {
    type: 'line',
    size: 'medium',
    placement: 'top',
    stretch: false,
    destroyInactivePane: false,
  },
)

const emit = defineEmits<{
  change: [name: TabsValue]
  tabClick: [name: TabsValue, event: MouseEvent | KeyboardEvent]
}>()

defineSlots<{
  default?: () => unknown
  extra?: () => unknown
}>()

const panes = ref<RegisteredTabPane[]>([])
const visitedNames = ref<TabsValue[]>([])
const tabRefs = ref<HTMLButtonElement[]>([])

const isVertical = computed(() => props.placement === 'left' || props.placement === 'right')

const panesWithName = computed(() =>
  panes.value.map((pane, index) => ({
    ...pane,
    resolvedName: pane.name ?? index,
  })),
)

const enabledPanes = computed(() => panesWithName.value.filter((pane) => !pane.disabled))

const activeName = computed(() => {
  const activePane = panesWithName.value.find((pane) => pane.resolvedName === model.value)

  if (activePane) {
    return activePane.resolvedName
  }

  return enabledPanes.value[0]?.resolvedName
})

const tabsStyle = computed<CSSProperties>(() => ({
  '--su-tabs-count': Math.max(panesWithName.value.length, 1),
}))

provide(tabsKey, {
  updatePane(pane) {
    const index = panes.value.findIndex((current) => current.id === pane.id)

    if (index >= 0) {
      panes.value.splice(index, 1, pane)
      return
    }

    panes.value.push(pane)
  },
  removePane(id) {
    panes.value = panes.value.filter((pane) => pane.id !== id)
  },
})

watch(
  activeName,
  (name) => {
    if (name === undefined) {
      return
    }

    if (model.value !== name) {
      model.value = name
    }

    if (!visitedNames.value.includes(name)) {
      visitedNames.value.push(name)
    }
  },
  { immediate: true },
)

watch(
  () => panesWithName.value.map((pane) => pane.resolvedName),
  () => {
    tabRefs.value = []
  },
)

function selectPane(name: TabsValue, event: MouseEvent | KeyboardEvent) {
  const pane = panesWithName.value.find((item) => item.resolvedName === name)

  if (!pane || pane.disabled) {
    return
  }

  emit('tabClick', name, event)

  if (name === model.value) {
    return
  }

  model.value = name
  emit('change', name)
}

async function focusTab(index: number) {
  await nextTick()
  tabRefs.value[index]?.focus()
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const enabledIndexes = panesWithName.value
    .map((pane, paneIndex) => (pane.disabled ? -1 : paneIndex))
    .filter((paneIndex) => paneIndex >= 0)

  if (!enabledIndexes.length) {
    return
  }

  const currentEnabledIndex = enabledIndexes.indexOf(index)
  const lastEnabledIndex = enabledIndexes.length - 1
  let nextIndex: number | undefined

  if (event.key === 'Home') {
    nextIndex = enabledIndexes[0]
  } else if (event.key === 'End') {
    nextIndex = enabledIndexes[lastEnabledIndex]
  } else if (
    (!isVertical.value && event.key === 'ArrowRight') ||
    (isVertical.value && event.key === 'ArrowDown')
  ) {
    nextIndex = enabledIndexes[(currentEnabledIndex + 1) % enabledIndexes.length]
  } else if (
    (!isVertical.value && event.key === 'ArrowLeft') ||
    (isVertical.value && event.key === 'ArrowUp')
  ) {
    nextIndex =
      enabledIndexes[(currentEnabledIndex - 1 + enabledIndexes.length) % enabledIndexes.length]
  }

  if (nextIndex === undefined) {
    return
  }

  event.preventDefault()
  const nextPane = panesWithName.value[nextIndex]
  selectPane(nextPane.resolvedName, event)
  void focusTab(nextIndex)
}

function shouldRenderPane(pane: RegisteredTabPane & { resolvedName: TabsValue }) {
  if (pane.resolvedName === activeName.value) {
    return true
  }

  if (props.destroyInactivePane) {
    return false
  }

  return !pane.lazy || visitedNames.value.includes(pane.resolvedName)
}

function getTabId(name: TabsValue) {
  return `su-tab-${String(name)}`
}

function getPanelId(name: TabsValue) {
  return `su-tab-panel-${String(name)}`
}

function renderContent(content: unknown) {
  return () => content
}
</script>

<template>
  <div
    class="su-tabs"
    :class="[
      `su-tabs--${type}`,
      `su-tabs--${size}`,
      `su-tabs--${placement}`,
      {
        'is-stretch': stretch,
        'is-vertical': isVertical,
      },
    ]"
    :style="tabsStyle"
  >
    <div v-if="$slots.default" class="su-tabs__panes">
      <slot />
    </div>

    <div class="su-tabs__header">
      <div
        class="su-tabs__nav"
        role="tablist"
        :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      >
        <button
          v-for="(pane, index) in panesWithName"
          :id="getTabId(pane.resolvedName)"
          :key="pane.id"
          :ref="
            (element) => {
              if (element) tabRefs[index] = element as HTMLButtonElement
            }
          "
          class="su-tabs__tab"
          :class="{
            'is-active': pane.resolvedName === activeName,
            'is-disabled': pane.disabled,
          }"
          type="button"
          role="tab"
          :disabled="pane.disabled"
          :aria-selected="pane.resolvedName === activeName"
          :aria-controls="getPanelId(pane.resolvedName)"
          :tabindex="pane.resolvedName === activeName ? 0 : -1"
          @click="selectPane(pane.resolvedName, $event)"
          @keydown="handleKeydown($event, index)"
        >
          <component
            :is="renderContent(pane.labelContent ? pane.labelContent() : (pane.label ?? ''))"
          />
        </button>
      </div>
      <div v-if="$slots.extra" class="su-tabs__extra">
        <slot name="extra" />
      </div>
    </div>

    <div class="su-tabs__content">
      <template v-for="pane in panesWithName" :key="pane.id">
        <div
          v-if="shouldRenderPane(pane)"
          v-show="pane.resolvedName === activeName"
          :id="getPanelId(pane.resolvedName)"
          class="su-tabs__panel"
          role="tabpanel"
          :aria-labelledby="getTabId(pane.resolvedName)"
        >
          <component :is="renderContent(pane.content ? pane.content() : '')" />
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.su-tabs {
  --su-tabs-count: 1;
  --su-tabs-tab-height: 40px;
  --su-tabs-tab-padding: var(--su-space-md) var(--su-space-lg);

  display: flex;
  flex-direction: column;
  gap: var(--su-space-md);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-tabs--small {
  --su-tabs-tab-height: 32px;
  --su-tabs-tab-padding: var(--su-space-xs) var(--su-space-md);

  font-size: var(--su-font-size-sm);
}

.su-tabs--large {
  --su-tabs-tab-height: 48px;
  --su-tabs-tab-padding: var(--su-space-md) var(--su-space-xl);

  font-size: var(--su-font-size-lg);
}

.su-tabs--left {
  flex-direction: row;
}

.su-tabs--right {
  flex-direction: row-reverse;
}

.su-tabs--bottom {
  flex-direction: column-reverse;
}

.su-tabs__panes {
  display: none;
}

.su-tabs__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  border-bottom: 1px solid var(--su-color-border);
}

.su-tabs--bottom .su-tabs__header {
  border-top: 1px solid var(--su-color-border);
  border-bottom: 0;
}

.su-tabs.is-vertical .su-tabs__header {
  align-items: stretch;
  flex: none;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 160px;
  border-right: 1px solid var(--su-color-border);
  border-bottom: 0;
}

.su-tabs--right.su-tabs.is-vertical .su-tabs__header {
  border-right: 0;
  border-left: 1px solid var(--su-color-border);
}

.su-tabs__nav {
  display: flex;
  min-width: 0;
}

.su-tabs.is-vertical .su-tabs__nav {
  flex-direction: column;
}

.su-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: var(--su-tabs-tab-height);
  padding: var(--su-tabs-tab-padding);
  border: 0;
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-tabs.is-stretch:not(.is-vertical) .su-tabs__tab {
  flex: 1 1 calc(100% / var(--su-tabs-count));
}

.su-tabs__tab:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
}

.su-tabs__tab.is-active {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-tabs__tab.is-active::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary);
  content: '';
}

.su-tabs--bottom .su-tabs__tab.is-active::after {
  top: -1px;
  bottom: auto;
}

.su-tabs.is-vertical .su-tabs__tab {
  justify-content: flex-start;
}

.su-tabs.is-vertical .su-tabs__tab.is-active::after {
  top: 0;
  right: -1px;
  bottom: 0;
  left: auto;
  width: 2px;
  height: auto;
}

.su-tabs--right.su-tabs.is-vertical .su-tabs__tab.is-active::after {
  right: auto;
  left: -1px;
}

.su-tabs__tab:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-tabs__tab:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: -2px;
}

.su-tabs--card {
  gap: 0;
}

.su-tabs--card .su-tabs__header {
  border-bottom: 0;
}

.su-tabs--card .su-tabs__nav {
  gap: var(--su-space-xs);
}

.su-tabs--card .su-tabs__tab {
  min-height: 36px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md) var(--su-radius-md) 0 0;
  background: var(--su-color-bg-soft);
}

.su-tabs--card .su-tabs__tab.is-active {
  border-color: var(--su-color-primary);
  background: var(--su-color-bg-elevated);
}

.su-tabs--card .su-tabs__tab.is-active::after {
  display: none;
}

.su-tabs--card.su-tabs--bottom .su-tabs__tab {
  border-radius: 0 0 var(--su-radius-md) var(--su-radius-md);
}

.su-tabs--card.su-tabs.is-vertical .su-tabs__tab {
  border-radius: var(--su-radius-md) 0 0 var(--su-radius-md);
}

.su-tabs--card.su-tabs--right.su-tabs.is-vertical .su-tabs__tab {
  border-radius: 0 var(--su-radius-md) var(--su-radius-md) 0;
}

.su-tabs__extra {
  display: inline-flex;
  align-items: center;
  flex: none;
}

.su-tabs__content {
  min-width: 0;
  flex: 1;
}

.su-tabs__panel {
  color: var(--su-color-text);
}
</style>
