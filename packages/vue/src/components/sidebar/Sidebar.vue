<script setup lang="ts">
import { computed, getCurrentInstance, ref, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuSidebar',
})

export type SidebarPlacement = 'left' | 'right'
export type SidebarShadow = 'always' | 'never'

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: SidebarPlacement
    width?: number | string
    collapsedWidth?: number | string
    collapsed?: boolean
    collapsible?: boolean
    defaultCollapsed?: boolean
    bordered?: boolean
    shadow?: SidebarShadow
    sticky?: boolean
    offsetTop?: number | string
  }>(),
  {
    title: undefined,
    placement: 'left',
    width: 280,
    collapsedWidth: 64,
    collapsed: false,
    collapsible: false,
    defaultCollapsed: false,
    bordered: true,
    shadow: 'never',
    sticky: false,
    offsetTop: 0,
  },
)

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}>()

defineSlots<{
  default?: (props: { collapsed: boolean }) => unknown
  header?: (props: { collapsed: boolean }) => unknown
  title?: (props: { collapsed: boolean }) => unknown
  footer?: (props: { collapsed: boolean }) => unknown
  trigger?: (props: { collapsed: boolean }) => unknown
}>()

const instance = getCurrentInstance()
const internalCollapsed = ref(props.defaultCollapsed)

const isControlled = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}

  return 'collapsed' in vnodeProps || 'onUpdate:collapsed' in vnodeProps
})

const isCollapsed = computed(() =>
  isControlled.value ? props.collapsed : internalCollapsed.value,
)

const hasHeader = computed(() => Boolean(props.title))

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

const sidebarStyle = computed<CSSProperties>(() => {
  const currentWidth = isCollapsed.value ? props.collapsedWidth : props.width
  const normalizedWidth = normalizeSize(currentWidth)
  const normalizedOffsetTop = normalizeSize(props.offsetTop)

  return {
    width: normalizedWidth,
    flexBasis: normalizedWidth,
    maxWidth: normalizedWidth,
    minWidth: normalizedWidth,
    top: props.sticky ? normalizedOffsetTop : undefined,
    '--su-sidebar-offset-top': normalizedOffsetTop,
  }
})

function toggleCollapsed() {
  if (!props.collapsible) {
    return
  }

  const nextCollapsed = !isCollapsed.value
  internalCollapsed.value = nextCollapsed
  emit('update:collapsed', nextCollapsed)
  emit('collapse', nextCollapsed)
}
</script>

<template>
  <aside
    class="su-sidebar"
    :class="[
      `su-sidebar--${placement}`,
      `su-sidebar--shadow-${shadow}`,
      {
        'is-bordered': bordered,
        'is-collapsed': isCollapsed,
        'is-collapsible': collapsible,
        'is-sticky': sticky,
        'has-header': hasHeader || $slots.header,
        'has-footer': $slots.footer,
      },
    ]"
    :style="sidebarStyle"
  >
    <header v-if="hasHeader || $slots.header" class="su-sidebar__header">
      <slot name="header" :collapsed="isCollapsed">
        <div class="su-sidebar__title">
          <slot name="title" :collapsed="isCollapsed">
            {{ title }}
          </slot>
        </div>
      </slot>
    </header>

    <div class="su-sidebar__body">
      <slot :collapsed="isCollapsed" />
    </div>

    <footer v-if="$slots.footer" class="su-sidebar__footer">
      <slot name="footer" :collapsed="isCollapsed" />
    </footer>

    <button
      v-if="collapsible || $slots.trigger"
      class="su-sidebar__trigger"
      type="button"
      :aria-expanded="!isCollapsed"
      @click="toggleCollapsed"
    >
      <slot name="trigger" :collapsed="isCollapsed">
        {{ isCollapsed ? '展开' : '收起' }}
      </slot>
    </button>
  </aside>
</template>

<style>
.su-sidebar {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transition:
    width 0.18s ease,
    min-width 0.18s ease,
    max-width 0.18s ease,
    flex-basis 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.su-sidebar.is-sticky {
  position: sticky;
  align-self: flex-start;
  max-height: calc(100vh - var(--su-sidebar-offset-top, 0px));
}

.su-sidebar.is-bordered.su-sidebar--left {
  border-right: 1px solid var(--su-color-border);
}

.su-sidebar.is-bordered.su-sidebar--right {
  border-left: 1px solid var(--su-color-border);
}

.su-sidebar--shadow-always {
  box-shadow: var(--su-shadow-sm);
}

.su-sidebar__header,
.su-sidebar__footer {
  display: flex;
  align-items: center;
  min-width: 0;
  background: var(--su-color-bg-elevated);
}

.su-sidebar__header {
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 52px;
  padding: var(--su-space-md) var(--su-space-lg);
  border-bottom: 1px solid var(--su-color-border);
}

.su-sidebar__title {
  min-width: 0;
  overflow: hidden;
  color: var(--su-color-text);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-sidebar__body {
  flex: 1;
  min-height: 0;
  padding: var(--su-space-lg);
  overflow: auto;
  word-break: break-word;
}

.su-sidebar__footer {
  justify-content: flex-start;
  gap: var(--su-space-sm);
  padding: var(--su-space-md) var(--su-space-lg);
  border-top: 1px solid var(--su-color-border);
}

.su-sidebar__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  min-height: 36px;
  padding: 0 var(--su-space-md);
  border: 0;
  border-top: 1px solid var(--su-color-border);
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-elevated);
  font: inherit;
  font-size: var(--su-font-size-sm);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-sidebar__trigger:hover,
.su-sidebar__trigger:focus-visible {
  outline: 0;
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-sidebar.is-collapsed .su-sidebar__header,
.su-sidebar.is-collapsed .su-sidebar__body,
.su-sidebar.is-collapsed .su-sidebar__footer {
  padding-right: var(--su-space-sm);
  padding-left: var(--su-space-sm);
}
</style>
