<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { layoutKey } from './context'

defineOptions({
  name: 'SuSider',
})

export type LayoutSiderTheme = 'light' | 'dark'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
    width?: number | string
    collapsedWidth?: number | string
    collapsible?: boolean
    defaultCollapsed?: boolean
    theme?: LayoutSiderTheme
  }>(),
  {
    width: 220,
    collapsedWidth: 64,
    collapsible: false,
    defaultCollapsed: false,
    theme: 'light',
  },
)

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}>()

defineSlots<{
  default?: (props: { collapsed: boolean }) => unknown
  trigger?: (props: { collapsed: boolean }) => unknown
}>()

const layout = inject(layoutKey, undefined)
const instance = getCurrentInstance()
const internalCollapsed = ref(props.defaultCollapsed)

const isControlled = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}

  return 'collapsed' in vnodeProps || 'onUpdate:collapsed' in vnodeProps
})

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

const isCollapsed = computed(() =>
  isControlled.value ? props.collapsed : internalCollapsed.value,
)
const siderStyle = computed(() => {
  const currentWidth = isCollapsed.value ? props.collapsedWidth : props.width
  const normalizedWidth = normalizeSize(currentWidth)

  return {
    width: normalizedWidth,
    flexBasis: normalizedWidth,
    maxWidth: normalizedWidth,
    minWidth: normalizedWidth,
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

onMounted(() => {
  layout?.addSider()
})

onBeforeUnmount(() => {
  layout?.removeSider()
})
</script>

<template>
  <aside
    class="su-layout__sider"
    :class="[
      `su-layout__sider--${theme}`,
      {
        'is-collapsed': isCollapsed,
        'is-collapsible': collapsible,
      },
    ]"
    :style="siderStyle"
  >
    <div class="su-layout__sider-content">
      <slot :collapsed="isCollapsed" />
    </div>
    <button
      v-if="collapsible || $slots.trigger"
      class="su-layout__sider-trigger"
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
