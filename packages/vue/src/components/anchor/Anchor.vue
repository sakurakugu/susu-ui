<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AnchorNode from './AnchorNode.vue'

defineOptions({
  name: 'SuAnchor',
})

export type AnchorTarget = Window | HTMLElement
export type AnchorBehavior = 'auto' | 'instant' | 'smooth'
export type AnchorKey = string | number

export interface AnchorItem {
  key: AnchorKey
  href: string
  title: string
  children?: AnchorItem[]
  disabled?: boolean
  [key: string]: unknown
}

export interface AnchorRenderItem extends AnchorItem {
  level: number
  children?: AnchorRenderItem[]
}

const activeKey = defineModel<AnchorKey | undefined>('activeKey', {
  default: undefined,
})

const props = withDefaults(
  defineProps<{
    items?: AnchorItem[]
    offsetTop?: number
    bounds?: number
    target?: () => AnchorTarget | null | undefined
    behavior?: AnchorBehavior
    disabled?: boolean
    emptyText?: string
  }>(),
  {
    items: () => [],
    offsetTop: 0,
    bounds: 5,
    target: undefined,
    behavior: 'smooth',
    disabled: false,
    emptyText: '暂无锚点',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent, item: AnchorRenderItem]
  change: [key: AnchorKey | undefined, item: AnchorRenderItem | undefined]
}>()

defineSlots<{
  default?: (props: { item: AnchorRenderItem; active: boolean }) => unknown
  empty?: () => unknown
}>()

const scrollingByClick = ref(false)
let activeTarget: AnchorTarget | undefined
let frame: number | undefined
let clickTimer: number | undefined

const normalizedItems = computed<AnchorRenderItem[]>(() =>
  normalizeItems(props.items),
)
const flatItems = computed(() => flattenItems(normalizedItems.value))
const enabledItems = computed(() =>
  flatItems.value.filter((item) => !item.disabled),
)
const hasItems = computed(() => normalizedItems.value.length > 0)

function normalizeItems(items: AnchorItem[], level = 1): AnchorRenderItem[] {
  return items.map((item) => ({
    ...item,
    level,
    children: item.children
      ? normalizeItems(item.children, level + 1)
      : undefined,
  }))
}

function flattenItems(items: AnchorRenderItem[]): AnchorRenderItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenItems(item.children) : []),
  ])
}

function getTarget() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return props.target?.() ?? window
}

function getScrollTop(target: AnchorTarget) {
  if (target === window) {
    return (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    )
  }

  return (target as HTMLElement).scrollTop
}

function getTargetTop(target: AnchorTarget) {
  return target === window
    ? 0
    : (target as HTMLElement).getBoundingClientRect().top
}

function getElementByHref(href: string): HTMLElement | null {
  if (!href.startsWith('#')) {
    return null
  }

  try {
    return document.getElementById(decodeURIComponent(href.slice(1)))
  } catch {
    try {
      const element = document.querySelector(href)
      return element instanceof HTMLElement ? element : null
    } catch {
      return null
    }
  }
}

function getElementTop(element: HTMLElement, target: AnchorTarget) {
  const elementTop = element.getBoundingClientRect().top

  if (target === window) {
    return elementTop + getScrollTop(target)
  }

  return elementTop - getTargetTop(target) + getScrollTop(target)
}

function setScrollTop(target: AnchorTarget, top: number) {
  const nextTop = Math.max(top - props.offsetTop, 0)

  if (target === window) {
    window.scrollTo({
      top: nextTop,
      behavior: props.behavior,
    })
    return
  }

  ;(target as HTMLElement).scrollTo?.({
    top: nextTop,
    behavior: props.behavior,
  })

  if (!(target as HTMLElement).scrollTo) {
    ;(target as HTMLElement).scrollTop = nextTop
  }
}

function setActive(
  key: AnchorKey | undefined,
  item: AnchorRenderItem | undefined,
) {
  if (activeKey.value === key) {
    return
  }

  activeKey.value = key
  emit('change', key, item)
}

function getCurrentAnchor() {
  const target = getTarget()

  if (!target) {
    return undefined
  }

  const scrollTop = getScrollTop(target)
  const activeLine = scrollTop + props.offsetTop + props.bounds
  let current: AnchorRenderItem | undefined

  for (const item of enabledItems.value) {
    const element = getElementByHref(item.href)

    if (!element) {
      continue
    }

    const elementTop = getElementTop(element, target)

    if (elementTop <= activeLine) {
      current = item
    } else {
      break
    }
  }

  return current
}

function updateActive() {
  if (scrollingByClick.value) {
    return
  }

  const item = getCurrentAnchor()
  setActive(item?.key, item)
}

function requestUpdate() {
  if (typeof window === 'undefined') {
    return
  }

  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  frame = window.requestAnimationFrame(() => {
    frame = undefined
    updateActive()
  })
}

function removeListeners() {
  activeTarget?.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
  activeTarget = undefined
}

function addListeners() {
  removeListeners()
  const target = getTarget()

  if (!target) {
    return
  }

  activeTarget = target
  activeTarget.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
}

function resetClickScrolling() {
  if (clickTimer !== undefined) {
    window.clearTimeout(clickTimer)
  }

  clickTimer = window.setTimeout(() => {
    scrollingByClick.value = false
    requestUpdate()
  }, 220)
}

function handleClick(event: MouseEvent, item: AnchorRenderItem) {
  emit('click', event, item)

  if (props.disabled || item.disabled) {
    event.preventDefault()
    return
  }

  const target = getTarget()
  const element = target ? getElementByHref(item.href) : null

  if (!target || !element) {
    return
  }

  event.preventDefault()
  scrollingByClick.value = true
  setActive(item.key, item)
  setScrollTop(target, getElementTop(element, target))
  resetClickScrolling()
}

watch(
  () => [props.items, props.offsetTop, props.bounds, props.target],
  async () => {
    await nextTick()
    addListeners()
    requestUpdate()
  },
  { deep: true },
)

onMounted(() => {
  addListeners()
  requestUpdate()
})

onBeforeUnmount(() => {
  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  if (clickTimer !== undefined) {
    window.clearTimeout(clickTimer)
  }

  removeListeners()
})
</script>

<template>
  <nav
    class="su-anchor"
    :class="{ 'is-disabled': disabled }"
    :aria-disabled="disabled"
  >
    <ul v-if="hasItems" class="su-anchor__list">
      <AnchorNode
        v-for="item in normalizedItems"
        :key="item.key"
        :item="item"
        :active-key="activeKey"
        :disabled="disabled"
        @click="handleClick"
      >
        <template #default="{ item: slotItem, active }">
          <slot :item="slotItem" :active="active">
            {{ slotItem.title }}
          </slot>
        </template>
      </AnchorNode>
    </ul>

    <div v-else class="su-anchor__empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </nav>
</template>

<style>
.su-anchor {
  position: relative;
  width: 100%;
  color: var(--su-color-text-secondary);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
}

.su-anchor::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: var(--su-color-border);
  content: '';
}

.su-anchor__list,
.su-anchor__children {
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-anchor__item {
  --su-anchor-level: 1;

  position: relative;
}

.su-anchor__link {
  display: block;
  overflow: hidden;
  min-height: 30px;
  padding: var(--su-space-xs) var(--su-space-sm) var(--su-space-xs)
    calc(var(--su-space-md) + (var(--su-anchor-level) - 1) * var(--su-space-lg));
  border-radius: var(--su-radius-sm);
  color: inherit;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  outline: 0;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-anchor__link::before {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 0;
  width: 2px;
  border-radius: var(--su-radius-round);
  background: transparent;
  content: '';
  transition: background-color 0.16s ease;
}

.su-anchor__link:hover,
.su-anchor__link:focus-visible {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 52%, transparent);
}

.su-anchor__link:focus-visible {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 18%, transparent);
}

.su-anchor__item.is-active > .su-anchor__link {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-anchor__item.is-active > .su-anchor__link::before {
  background: var(--su-color-primary);
}

.su-anchor__item.is-disabled > .su-anchor__link,
.su-anchor.is-disabled .su-anchor__link {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.su-anchor__empty {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding-left: var(--su-space-md);
  color: var(--su-color-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .su-anchor__link,
  .su-anchor__link::before {
    transition: none;
  }
}
</style>
