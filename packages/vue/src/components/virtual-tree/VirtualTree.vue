<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import { useLocale } from '../../config-provider'

defineOptions({
  name: 'SuVirtualTree',
})

export type VirtualTreeNodeKey = string | number

export interface VirtualTreeNode {
  key: VirtualTreeNodeKey
  label: string
  children?: VirtualTreeNode[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export type VirtualTreeSize = 'small' | 'medium' | 'large'

export interface VirtualTreeRenderNode extends VirtualTreeNode {
  level: number
  parentKey?: VirtualTreeNodeKey
  children?: VirtualTreeRenderNode[]
}

export interface VirtualTreeScrollState {
  scrollTop: number
  startIndex: number
  endIndex: number
  visibleCount: number
}

const selectedKey = defineModel<VirtualTreeNodeKey | undefined>('selectedKey', {
  default: undefined,
})

const expandedKeys = defineModel<VirtualTreeNodeKey[]>('expandedKeys', {
  default: () => [],
})

const checkedKeys = defineModel<VirtualTreeNodeKey[]>('checkedKeys', {
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    data?: VirtualTreeNode[]
    height?: number | string
    itemHeight?: number
    size?: VirtualTreeSize
    selectable?: boolean
    checkable?: boolean
    accordion?: boolean
    defaultExpandAll?: boolean
    expandOnClickNode?: boolean
    checkOnClickNode?: boolean
    disabled?: boolean
    buffer?: number
    emptyText?: string
  }>(),
  {
    data: () => [],
    height: 320,
    itemHeight: 32,
    size: 'medium',
    selectable: true,
    checkable: false,
    accordion: false,
    defaultExpandAll: false,
    expandOnClickNode: true,
    checkOnClickNode: false,
    disabled: false,
    buffer: 5,
    emptyText: undefined,
  },
)

const emit = defineEmits<{
  nodeClick: [node: VirtualTreeRenderNode, event: MouseEvent | KeyboardEvent]
  nodeExpand: [node: VirtualTreeRenderNode, expanded: boolean]
  check: [
    keys: VirtualTreeNodeKey[],
    node: VirtualTreeRenderNode,
    checked: boolean,
  ]
  scroll: [event: Event, state: VirtualTreeScrollState]
}>()

defineSlots<{
  default?: (props: { node: VirtualTreeRenderNode }) => unknown
  empty?: () => unknown
}>()

const viewportRef = ref<HTMLElement>()
const locale = useLocale()
const scrollTop = ref(0)
const measuredHeight = ref(
  typeof props.height === 'number' ? props.height : props.itemHeight * 10,
)
const autoExpandedKeys = ref<VirtualTreeNodeKey[]>([])

let resizeObserver: ResizeObserver | undefined

const normalizedItemHeight = computed(() => Math.max(1, props.itemHeight))
const normalizedBuffer = computed(() => Math.max(0, Math.floor(props.buffer)))
const mergedEmptyText = computed(
  () => props.emptyText ?? locale.value.tree.empty,
)

const viewportStyle = computed<CSSProperties>(() => ({
  height: formatSize(props.height),
}))

const itemStyle = computed<CSSProperties>(() => ({
  height: `${normalizedItemHeight.value}px`,
}))

const normalizedData = computed<VirtualTreeRenderNode[]>(() =>
  normalizeNodes(props.data),
)

const flatNodes = computed(() => flattenNodes(normalizedData.value))
const hasData = computed(() => normalizedData.value.length > 0)

const allExpandableKeys = computed(() =>
  flatNodes.value.filter((node) => hasChildren(node)).map((node) => node.key),
)

const mergedExpandedKeys = computed(() =>
  props.defaultExpandAll && expandedKeys.value.length === 0
    ? autoExpandedKeys.value
    : expandedKeys.value,
)

const expandedKeySet = computed(() => new Set(mergedExpandedKeys.value))
const checkedKeySet = computed(() => new Set(checkedKeys.value))

const visibleNodes = computed(() => flattenVisibleNodes(normalizedData.value))
const totalHeight = computed(
  () => visibleNodes.value.length * normalizedItemHeight.value,
)

const visibleCount = computed(() =>
  Math.max(1, Math.ceil(measuredHeight.value / normalizedItemHeight.value)),
)

const startIndex = computed(() =>
  Math.max(
    0,
    Math.floor(scrollTop.value / normalizedItemHeight.value) -
      normalizedBuffer.value,
  ),
)

const endIndex = computed(() =>
  Math.min(
    visibleNodes.value.length,
    startIndex.value + visibleCount.value + normalizedBuffer.value * 2,
  ),
)

const offsetTop = computed(() => startIndex.value * normalizedItemHeight.value)
const renderedNodes = computed(() =>
  visibleNodes.value.slice(startIndex.value, endIndex.value),
)

const contentStyle = computed<CSSProperties>(() => ({
  height: `${totalHeight.value}px`,
}))

const listStyle = computed<CSSProperties>(() => ({
  transform: `translateY(${offsetTop.value}px)`,
}))

const firstEnabledKey = computed(
  () => visibleNodes.value.find((node) => !isNodeDisabled(node))?.key,
)

watch(
  allExpandableKeys,
  (keys) => {
    if (props.defaultExpandAll && expandedKeys.value.length === 0) {
      autoExpandedKeys.value = keys
    }
  },
  { immediate: true },
)

watch(
  () => [visibleNodes.value.length, normalizedItemHeight.value],
  () => {
    nextTick(syncScrollBounds)
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

function normalizeNodes(
  nodes: VirtualTreeNode[],
  level = 1,
  parentKey?: VirtualTreeNodeKey,
): VirtualTreeRenderNode[] {
  return nodes.map((node) => ({
    ...node,
    level,
    parentKey,
    children: node.children
      ? normalizeNodes(node.children, level + 1, node.key)
      : undefined,
  }))
}

function flattenNodes(nodes: VirtualTreeRenderNode[]): VirtualTreeRenderNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(node.children ? flattenNodes(node.children) : []),
  ])
}

function flattenVisibleNodes(
  nodes: VirtualTreeRenderNode[],
): VirtualTreeRenderNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(hasChildren(node) && isExpanded(node)
      ? flattenVisibleNodes(node.children ?? [])
      : []),
  ])
}

function hasChildren(node: VirtualTreeRenderNode) {
  return !node.isLeaf && Boolean(node.children?.length)
}

function isExpanded(node: VirtualTreeRenderNode) {
  return expandedKeySet.value.has(node.key)
}

function isChecked(node: VirtualTreeRenderNode) {
  return checkedKeySet.value.has(node.key)
}

function isIndeterminate(node: VirtualTreeRenderNode) {
  const childKeys = getEnabledDescendantKeys(node)

  if (!childKeys.length) {
    return false
  }

  const checkedCount = childKeys.filter((key) =>
    checkedKeySet.value.has(key),
  ).length

  return checkedCount > 0 && checkedCount < childKeys.length
}

function isNodeDisabled(node: VirtualTreeRenderNode) {
  return props.disabled || Boolean(node.disabled)
}

function getEnabledDescendantKeys(node: VirtualTreeRenderNode) {
  return flattenNodes(node.children ?? [])
    .filter((item) => !isNodeDisabled(item))
    .map((item) => item.key)
}

function getCheckTargetKeys(node: VirtualTreeRenderNode) {
  return [
    node.key,
    ...flattenNodes(node.children ?? []).map((item) => item.key),
  ].filter((key) => {
    const target = findNode(key)
    return target && !isNodeDisabled(target)
  })
}

function findNode(key: VirtualTreeNodeKey) {
  return flatNodes.value.find((node) => node.key === key)
}

function updateMeasuredHeight() {
  const viewport = viewportRef.value
  const nextHeight = viewport?.clientHeight ?? 0

  if (nextHeight > 0) {
    measuredHeight.value = nextHeight
  }
}

function syncScrollBounds() {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  const maxScrollTop = Math.max(0, totalHeight.value - measuredHeight.value)

  if (viewport.scrollTop > maxScrollTop) {
    viewport.scrollTop = maxScrollTop
  }

  scrollTop.value = viewport.scrollTop
}

function createScrollState(): VirtualTreeScrollState {
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

function updateExpandedKeys(node: VirtualTreeRenderNode, expanded: boolean) {
  const keys = new Set(expandedKeys.value)

  if (expanded) {
    if (props.accordion && node.parentKey === undefined) {
      expandedKeys.value = [node.key]
      return
    }

    keys.add(node.key)
  } else {
    keys.delete(node.key)
  }

  expandedKeys.value = Array.from(keys)
}

function toggleExpand(node: VirtualTreeRenderNode) {
  if (!hasChildren(node) || isNodeDisabled(node)) {
    return
  }

  const expanded = !isExpanded(node)
  updateExpandedKeys(node, expanded)
  emit('nodeExpand', node, expanded)
}

function toggleCheck(node: VirtualTreeRenderNode) {
  if (!props.checkable || isNodeDisabled(node)) {
    return
  }

  const checked = !isChecked(node) || isIndeterminate(node)
  const keys = new Set(checkedKeys.value)

  getCheckTargetKeys(node).forEach((key) => {
    if (checked) {
      keys.add(key)
    } else {
      keys.delete(key)
    }
  })

  checkedKeys.value = Array.from(keys)
  emit('check', checkedKeys.value, node, checked)
}

function selectNode(node: VirtualTreeRenderNode) {
  if (!props.selectable || isNodeDisabled(node)) {
    return
  }

  selectedKey.value = node.key
}

function handleNodeClick(
  node: VirtualTreeRenderNode,
  event: MouseEvent | KeyboardEvent,
) {
  if (isNodeDisabled(node)) {
    return
  }

  if (props.checkOnClickNode && props.checkable) {
    toggleCheck(node)
  } else {
    selectNode(node)
  }

  if (props.expandOnClickNode) {
    toggleExpand(node)
  }

  emit('nodeClick', node, event)
}

function handleNodeKeydown(node: VirtualTreeRenderNode, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleNodeClick(node, event)
  }

  if (event.key === 'ArrowRight' && hasChildren(node) && !isExpanded(node)) {
    event.preventDefault()
    toggleExpand(node)
  }

  if (event.key === 'ArrowLeft' && hasChildren(node) && isExpanded(node)) {
    event.preventDefault()
    toggleExpand(node)
  }
}

function scrollToIndex(
  index: number,
  align: 'start' | 'center' | 'end' = 'start',
) {
  const viewport = viewportRef.value

  if (!viewport || visibleNodes.value.length === 0) {
    return
  }

  const targetIndex = Math.min(
    Math.max(0, index),
    visibleNodes.value.length - 1,
  )
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

function scrollToKey(
  key: VirtualTreeNodeKey,
  align: 'start' | 'center' | 'end' = 'start',
) {
  const index = visibleNodes.value.findIndex((node) => node.key === key)

  if (index >= 0) {
    scrollToIndex(index, align)
  }
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
  scrollToKey,
})
</script>

<template>
  <div
    class="su-virtual-tree"
    :class="[
      `su-virtual-tree--${size}`,
      {
        'is-disabled': disabled,
        'is-checkable': checkable,
      },
    ]"
  >
    <div
      ref="viewportRef"
      class="su-virtual-tree__viewport"
      :style="viewportStyle"
      @scroll="handleScroll"
    >
      <div
        v-if="hasData"
        class="su-virtual-tree__content"
        :style="contentStyle"
      >
        <ul
          class="su-virtual-tree__list"
          :style="listStyle"
          role="tree"
          :aria-disabled="disabled"
        >
          <li
            v-for="node in renderedNodes"
            :key="node.key"
            class="su-virtual-tree__item"
            role="treeitem"
            :aria-level="node.level"
            :aria-expanded="hasChildren(node) ? isExpanded(node) : undefined"
            :aria-selected="selectable ? selectedKey === node.key : undefined"
            :aria-disabled="isNodeDisabled(node)"
            :style="itemStyle"
          >
            <div
              class="su-virtual-tree__node"
              :class="{
                'is-selected': selectedKey === node.key,
                'is-disabled': isNodeDisabled(node),
                'is-expanded': isExpanded(node),
              }"
              :style="{ '--su-virtual-tree-level': node.level }"
              :tabindex="
                isNodeDisabled(node)
                  ? -1
                  : selectedKey === node.key || firstEnabledKey === node.key
                    ? 0
                    : -1
              "
              @click="handleNodeClick(node, $event)"
              @keydown="handleNodeKeydown(node, $event)"
            >
              <button
                class="su-virtual-tree__switcher"
                type="button"
                :disabled="isNodeDisabled(node) || !hasChildren(node)"
                :aria-label="isExpanded(node) ? '收起节点' : '展开节点'"
                @click.stop="toggleExpand(node)"
              >
                <span v-if="hasChildren(node)" class="su-virtual-tree__arrow" />
              </button>
              <label
                v-if="checkable"
                class="su-virtual-tree__checkbox"
                :class="{
                  'is-checked': isChecked(node),
                  'is-indeterminate': isIndeterminate(node),
                  'is-disabled': isNodeDisabled(node),
                }"
                @click.stop
              >
                <input
                  class="su-virtual-tree__checkbox-input"
                  type="checkbox"
                  :checked="isChecked(node)"
                  :disabled="isNodeDisabled(node)"
                  :aria-checked="
                    isIndeterminate(node) ? 'mixed' : isChecked(node)
                  "
                  @change="toggleCheck(node)"
                />
                <span class="su-virtual-tree__checkbox-box" aria-hidden="true">
                  <span class="su-virtual-tree__checkbox-mark" />
                </span>
              </label>
              <span class="su-virtual-tree__label">
                <slot :node="node">{{ node.label }}</slot>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="su-virtual-tree__empty">
        <slot name="empty">{{ mergedEmptyText }}</slot>
      </div>
    </div>
  </div>
</template>

<style>
.su-virtual-tree {
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-virtual-tree__viewport {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.su-virtual-tree__content {
  position: relative;
  width: 100%;
}

.su-virtual-tree__list {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin: 0;
  padding: var(--su-space-xs);
  list-style: none;
  will-change: transform;
}

.su-virtual-tree__item {
  box-sizing: border-box;
  overflow: hidden;
}

.su-virtual-tree__node {
  --su-virtual-tree-indent: 20px;

  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--su-space-sm) 0
    calc((var(--su-virtual-tree-level) - 1) * var(--su-virtual-tree-indent));
  border-radius: var(--su-radius-md);
  outline: 0;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
  cursor: pointer;
}

.su-virtual-tree__node:hover:not(.is-disabled) {
  background: color-mix(in srgb, var(--su-color-primary-soft) 36%, transparent);
}

.su-virtual-tree__node:focus-visible {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 20%, transparent);
}

.su-virtual-tree__node.is-selected {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 68%, transparent);
  font-weight: 600;
}

.su-virtual-tree__node.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-virtual-tree__switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  color: var(--su-color-text-muted);
  background: transparent;
  cursor: pointer;
}

.su-virtual-tree__switcher:disabled {
  cursor: default;
}

.su-virtual-tree__arrow {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
  transition: transform 0.16s ease;
}

.su-virtual-tree__node.is-expanded .su-virtual-tree__arrow {
  transform: rotate(45deg);
}

.su-virtual-tree__checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.su-virtual-tree__checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-virtual-tree__checkbox-box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-elevated);
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-virtual-tree__checkbox-mark {
  width: 5px;
  height: 9px;
  border: 2px solid var(--su-color-primary-text);
  border-top: 0;
  border-left: 0;
  opacity: 0;
  transform: rotate(45deg) scale(0.72);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-virtual-tree__checkbox.is-checked .su-virtual-tree__checkbox-box,
.su-virtual-tree__checkbox.is-indeterminate .su-virtual-tree__checkbox-box {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-virtual-tree__checkbox.is-checked .su-virtual-tree__checkbox-mark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.su-virtual-tree__checkbox.is-indeterminate .su-virtual-tree__checkbox-mark {
  width: 8px;
  height: 2px;
  border: 0;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary-text);
  opacity: 1;
  transform: none;
}

.su-virtual-tree__checkbox-input:focus-visible
  + .su-virtual-tree__checkbox-box {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-virtual-tree__checkbox.is-disabled {
  cursor: not-allowed;
}

.su-virtual-tree__label {
  overflow: hidden;
  min-width: 0;
  padding: 0 var(--su-space-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-virtual-tree__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: var(--su-space-xl);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-virtual-tree--small {
  font-size: var(--su-font-size-sm);
}

.su-virtual-tree--small .su-virtual-tree__node {
  --su-virtual-tree-indent: 18px;
}

.su-virtual-tree--large {
  font-size: var(--su-font-size-lg);
}

.su-virtual-tree--large .su-virtual-tree__node {
  --su-virtual-tree-indent: 24px;
}

.su-virtual-tree.is-disabled {
  opacity: 0.72;
}

@media (prefers-reduced-motion: reduce) {
  .su-virtual-tree__node,
  .su-virtual-tree__arrow,
  .su-virtual-tree__checkbox-box,
  .su-virtual-tree__checkbox-mark {
    transition: none;
  }
}
</style>
