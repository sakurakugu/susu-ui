<script setup lang="ts">
import type { TreeNodeKey, TreeRenderNode } from './Tree.vue'

defineOptions({
  name: 'SuTreeNode',
})

defineProps<{
  node: TreeRenderNode
  selectedKey?: TreeNodeKey
  selectable: boolean
  checkable: boolean
  firstEnabledKey?: TreeNodeKey
  hasChildren: (node: TreeRenderNode) => boolean
  isExpanded: (node: TreeRenderNode) => boolean
  isChecked: (node: TreeRenderNode) => boolean
  isIndeterminate: (node: TreeRenderNode) => boolean
  isNodeDisabled: (node: TreeRenderNode) => boolean
}>()

const emit = defineEmits<{
  nodeClick: [node: TreeRenderNode, event: MouseEvent | KeyboardEvent]
  nodeKeydown: [node: TreeRenderNode, event: KeyboardEvent]
  toggleExpand: [node: TreeRenderNode]
  toggleCheck: [node: TreeRenderNode]
}>()

defineSlots<{
  default?: (props: { node: TreeRenderNode }) => unknown
}>()

function forwardNodeClick(
  node: TreeRenderNode,
  event: MouseEvent | KeyboardEvent,
) {
  emit('nodeClick', node, event)
}

function forwardNodeKeydown(node: TreeRenderNode, event: KeyboardEvent) {
  emit('nodeKeydown', node, event)
}
</script>

<template>
  <li
    class="su-tree__item"
    role="treeitem"
    :aria-expanded="hasChildren(node) ? isExpanded(node) : undefined"
    :aria-selected="selectable ? selectedKey === node.key : undefined"
    :aria-disabled="isNodeDisabled(node)"
  >
    <div
      class="su-tree__node"
      :class="{
        'is-selected': selectedKey === node.key,
        'is-disabled': isNodeDisabled(node),
        'is-expanded': isExpanded(node),
      }"
      :style="{ '--su-tree-level': node.level }"
      :tabindex="
        isNodeDisabled(node)
          ? -1
          : selectedKey === node.key || firstEnabledKey === node.key
            ? 0
            : -1
      "
      @click="emit('nodeClick', node, $event)"
      @keydown="emit('nodeKeydown', node, $event)"
    >
      <button
        class="su-tree__switcher"
        type="button"
        :disabled="isNodeDisabled(node) || !hasChildren(node)"
        :aria-label="isExpanded(node) ? '收起节点' : '展开节点'"
        @click.stop="emit('toggleExpand', node)"
      >
        <span v-if="hasChildren(node)" class="su-tree__arrow" />
      </button>
      <label
        v-if="checkable"
        class="su-tree__checkbox"
        :class="{
          'is-checked': isChecked(node),
          'is-indeterminate': isIndeterminate(node),
          'is-disabled': isNodeDisabled(node),
        }"
        @click.stop
      >
        <input
          class="su-tree__checkbox-input"
          type="checkbox"
          :checked="isChecked(node)"
          :disabled="isNodeDisabled(node)"
          :aria-checked="isIndeterminate(node) ? 'mixed' : isChecked(node)"
          @change="emit('toggleCheck', node)"
        />
        <span class="su-tree__checkbox-box" aria-hidden="true">
          <span class="su-tree__checkbox-mark" />
        </span>
      </label>
      <span class="su-tree__label">
        <slot :node="node">{{ node.label }}</slot>
      </span>
    </div>

    <ul
      v-if="hasChildren(node) && isExpanded(node)"
      class="su-tree__list su-tree__children"
      role="group"
    >
      <TreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :selected-key="selectedKey"
        :selectable="selectable"
        :checkable="checkable"
        :first-enabled-key="firstEnabledKey"
        :has-children="hasChildren"
        :is-expanded="isExpanded"
        :is-checked="isChecked"
        :is-indeterminate="isIndeterminate"
        :is-node-disabled="isNodeDisabled"
        @node-click="forwardNodeClick"
        @node-keydown="forwardNodeKeydown"
        @toggle-expand="emit('toggleExpand', $event)"
        @toggle-check="emit('toggleCheck', $event)"
      >
        <template #default="{ node: slotNode }">
          <slot :node="slotNode">{{ slotNode.label }}</slot>
        </template>
      </TreeNode>
    </ul>
  </li>
</template>
