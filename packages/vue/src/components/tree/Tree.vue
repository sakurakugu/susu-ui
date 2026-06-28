<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../config-provider'
import TreeNodeItem from './TreeNode.vue'

defineOptions({
  name: 'SuTree',
})

export type TreeNodeKey = string | number

export interface TreeNode {
  key: TreeNodeKey
  label: string
  children?: TreeNode[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export type TreeSize = 'small' | 'medium' | 'large'

export interface TreeRenderNode extends TreeNode {
  level: number
  parentKey?: TreeNodeKey
  children?: TreeRenderNode[]
}

const selectedKey = defineModel<TreeNodeKey | undefined>('selectedKey', {
  default: undefined,
})

const expandedKeys = defineModel<TreeNodeKey[]>('expandedKeys', {
  default: () => [],
})

const checkedKeys = defineModel<TreeNodeKey[]>('checkedKeys', {
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    data?: TreeNode[]
    size?: TreeSize
    selectable?: boolean
    checkable?: boolean
    accordion?: boolean
    defaultExpandAll?: boolean
    expandOnClickNode?: boolean
    checkOnClickNode?: boolean
    disabled?: boolean
    emptyText?: string
  }>(),
  {
    data: () => [],
    size: 'medium',
    selectable: true,
    checkable: false,
    accordion: false,
    defaultExpandAll: false,
    expandOnClickNode: true,
    checkOnClickNode: false,
    disabled: false,
    emptyText: undefined,
  },
)

const emit = defineEmits<{
  nodeClick: [node: TreeRenderNode, event: MouseEvent | KeyboardEvent]
  nodeExpand: [node: TreeRenderNode, expanded: boolean]
  check: [keys: TreeNodeKey[], node: TreeRenderNode, checked: boolean]
}>()

defineSlots<{
  default?: (props: { node: TreeRenderNode }) => unknown
  empty?: () => unknown
}>()

const autoExpandedKeys = ref<TreeNodeKey[]>([])
const locale = useLocale()
const mergedEmptyText = computed(
  () => props.emptyText ?? locale.value.tree.empty,
)

const normalizedData = computed<TreeRenderNode[]>(() =>
  normalizeNodes(props.data),
)

const hasData = computed(() => normalizedData.value.length > 0)

const allExpandableKeys = computed(() =>
  flattenNodes(normalizedData.value)
    .filter((node) => hasChildren(node))
    .map((node) => node.key),
)

const mergedExpandedKeys = computed(() =>
  props.defaultExpandAll && expandedKeys.value.length === 0
    ? autoExpandedKeys.value
    : expandedKeys.value,
)

const checkedKeySet = computed(() => new Set(checkedKeys.value))

const expandedKeySet = computed(() => new Set(mergedExpandedKeys.value))

const firstEnabledKey = computed(
  () =>
    flattenNodes(normalizedData.value).find((node) => !isNodeDisabled(node))
      ?.key,
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

function normalizeNodes(
  nodes: TreeNode[],
  level = 1,
  parentKey?: TreeNodeKey,
): TreeRenderNode[] {
  return nodes.map((node) => ({
    ...node,
    level,
    parentKey,
    children: node.children
      ? normalizeNodes(node.children, level + 1, node.key)
      : undefined,
  }))
}

function flattenNodes(nodes: TreeRenderNode[]): TreeRenderNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(node.children ? flattenNodes(node.children) : []),
  ])
}

function hasChildren(node: TreeRenderNode) {
  return !node.isLeaf && Boolean(node.children?.length)
}

function isExpanded(node: TreeRenderNode) {
  return expandedKeySet.value.has(node.key)
}

function isChecked(node: TreeRenderNode) {
  return checkedKeySet.value.has(node.key)
}

function isIndeterminate(node: TreeRenderNode) {
  const childKeys = getEnabledDescendantKeys(node)

  if (!childKeys.length) {
    return false
  }

  const checkedCount = childKeys.filter((key) =>
    checkedKeySet.value.has(key),
  ).length

  return checkedCount > 0 && checkedCount < childKeys.length
}

function isNodeDisabled(node: TreeRenderNode) {
  return props.disabled || Boolean(node.disabled)
}

function getEnabledDescendantKeys(node: TreeRenderNode) {
  return flattenNodes(node.children ?? [])
    .filter((item) => !isNodeDisabled(item))
    .map((item) => item.key)
}

function getCheckTargetKeys(node: TreeRenderNode) {
  return [
    node.key,
    ...flattenNodes(node.children ?? []).map((item) => item.key),
  ].filter((key) => {
    const target = findNode(key)
    return target && !isNodeDisabled(target)
  })
}

function findNode(key: TreeNodeKey) {
  return flattenNodes(normalizedData.value).find((node) => node.key === key)
}

function updateExpandedKeys(node: TreeRenderNode, expanded: boolean) {
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

function toggleExpand(node: TreeRenderNode) {
  if (!hasChildren(node) || isNodeDisabled(node)) {
    return
  }

  const expanded = !isExpanded(node)
  updateExpandedKeys(node, expanded)
  emit('nodeExpand', node, expanded)
}

function toggleCheck(node: TreeRenderNode) {
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

function selectNode(node: TreeRenderNode) {
  if (!props.selectable || isNodeDisabled(node)) {
    return
  }

  selectedKey.value = node.key
}

function handleNodeClick(
  node: TreeRenderNode,
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

function handleNodeKeydown(node: TreeRenderNode, event: KeyboardEvent) {
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
</script>

<template>
  <div
    class="su-tree"
    :class="[
      `su-tree--${size}`,
      {
        'is-disabled': disabled,
        'is-checkable': checkable,
      },
    ]"
  >
    <ul v-if="hasData" class="su-tree__list" role="tree">
      <TreeNodeItem
        v-for="node in normalizedData"
        :key="node.key"
        :node="node"
        :selected-key="selectedKey"
        :selectable="selectable"
        :checkable="checkable"
        :first-enabled-key="firstEnabledKey"
        :has-children="hasChildren"
        :is-expanded="isExpanded"
        :is-checked="isChecked"
        :is-indeterminate="isIndeterminate"
        :is-node-disabled="isNodeDisabled"
        @node-click="handleNodeClick"
        @node-keydown="handleNodeKeydown"
        @toggle-expand="toggleExpand"
        @toggle-check="toggleCheck"
      >
        <template #default="{ node: slotNode }">
          <slot :node="slotNode">{{ slotNode.label }}</slot>
        </template>
      </TreeNodeItem>
    </ul>

    <div v-else class="su-tree__empty">
      <slot name="empty">{{ mergedEmptyText }}</slot>
    </div>
  </div>
</template>

<style>
.su-tree {
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-tree__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-tree__children {
  margin-top: 2px;
}

.su-tree__node {
  --su-tree-indent: 20px;
  --su-tree-node-height: 32px;

  display: flex;
  align-items: center;
  min-height: var(--su-tree-node-height);
  padding: 0 var(--su-space-sm) 0
    calc((var(--su-tree-level) - 1) * var(--su-tree-indent));
  border-radius: var(--su-radius-md);
  outline: 0;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
  cursor: pointer;
}

.su-tree__node:hover:not(.is-disabled) {
  background: color-mix(in srgb, var(--su-color-primary-soft) 36%, transparent);
}

.su-tree__node:focus-visible {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 20%, transparent);
}

.su-tree__node.is-selected {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 68%, transparent);
  font-weight: 600;
}

.su-tree__node.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-tree__switcher {
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

.su-tree__switcher:disabled {
  cursor: default;
}

.su-tree__arrow {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
  transition: transform 0.16s ease;
}

.su-tree__node.is-expanded .su-tree__arrow {
  transform: rotate(45deg);
}

.su-tree__checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.su-tree__checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-tree__checkbox-box {
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

.su-tree__checkbox-mark {
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

.su-tree__checkbox.is-checked .su-tree__checkbox-box,
.su-tree__checkbox.is-indeterminate .su-tree__checkbox-box {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-tree__checkbox.is-checked .su-tree__checkbox-mark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.su-tree__checkbox.is-indeterminate .su-tree__checkbox-mark {
  width: 8px;
  height: 2px;
  border: 0;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary-text);
  opacity: 1;
  transform: none;
}

.su-tree__checkbox-input:focus-visible + .su-tree__checkbox-box {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-tree__checkbox.is-disabled {
  cursor: not-allowed;
}

.su-tree__label {
  overflow: hidden;
  min-width: 0;
  padding: 0 var(--su-space-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-tree__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  padding: var(--su-space-xl);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-tree--small {
  font-size: var(--su-font-size-sm);
}

.su-tree--small .su-tree__node {
  --su-tree-node-height: 28px;
  --su-tree-indent: 18px;
}

.su-tree--large {
  font-size: var(--su-font-size-lg);
}

.su-tree--large .su-tree__node {
  --su-tree-node-height: 38px;
  --su-tree-indent: 24px;
}

.su-tree.is-disabled {
  opacity: 0.72;
}

@media (prefers-reduced-motion: reduce) {
  .su-tree__node,
  .su-tree__arrow,
  .su-tree__checkbox-box,
  .su-tree__checkbox-mark {
    transition: none;
  }
}
</style>
