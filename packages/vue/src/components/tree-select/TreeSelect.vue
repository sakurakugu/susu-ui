<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import { useLocale } from '../../config-provider'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuTreeSelect',
  inheritAttrs: false,
})

export type TreeSelectValue = string | number

export interface TreeSelectNode {
  label: string
  value: TreeSelectValue
  children?: TreeSelectNode[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export interface TreeSelectRenderNode extends TreeSelectNode {
  level: number
  parent?: TreeSelectRenderNode
  children?: TreeSelectRenderNode[]
}

const model = defineModel<TreeSelectValue | undefined>({
  default: undefined,
})

const expandedKeys = defineModel<TreeSelectValue[]>('expandedKeys', {
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    data?: TreeSelectNode[]
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    searchable?: boolean
    defaultExpandAll?: boolean
    expandOnClickNode?: boolean
    emptyText?: string
    filterPlaceholder?: string
    name?: string
    id?: string
    required?: boolean
    ariaLabel?: string
  }>(),
  {
    data: () => [],
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    clearable: false,
    searchable: false,
    defaultExpandAll: false,
    expandOnClickNode: true,
    emptyText: undefined,
    filterPlaceholder: undefined,
    name: undefined,
    id: undefined,
    required: false,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  change: [value: TreeSelectValue | undefined, node?: TreeSelectRenderNode]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  open: []
  close: []
  nodeExpand: [node: TreeSelectRenderNode, expanded: boolean]
}>()

defineSlots<{
  node?: (props: { node: TreeSelectRenderNode }) => unknown
  empty?: () => unknown
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const locale = useLocale()
const rootRef = ref<HTMLElement>()
const triggerRef = ref<HTMLButtonElement>()
const panelRef = ref<HTMLElement>()
const searchRef = ref<HTMLInputElement>()
const isOpen = ref(false)
const activeValue = ref<TreeSelectValue>()
const keyword = ref('')
const panelStyle = ref<CSSProperties>({})
const autoExpandedKeys = ref<TreeSelectValue[]>([])
const panelId = `su-tree-select-${useId()}`

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(() => props.disabled || Boolean(form?.disabled.value))
const mergedPlaceholder = computed(() => props.placeholder ?? locale.value.treeSelect.placeholder)
const mergedEmptyText = computed(() => props.emptyText ?? locale.value.treeSelect.empty)
const mergedFilterPlaceholder = computed(
  () => props.filterPlaceholder ?? locale.value.treeSelect.filterPlaceholder,
)
const mergedAriaLabel = computed(() => props.ariaLabel ?? locale.value.treeSelect.ariaLabel)

const normalizedData = computed<TreeSelectRenderNode[]>(() => normalizeNodes(props.data))
const flatNodes = computed(() => flattenNodes(normalizedData.value))
const selectedNode = computed(() => flatNodes.value.find((node) => node.value === model.value))
const hasValue = computed(() => selectedNode.value !== undefined)
const showClear = computed(() => props.clearable && !mergedDisabled.value && hasValue.value)
const allExpandableKeys = computed(() =>
  flatNodes.value.filter((node) => hasChildren(node)).map((node) => node.value),
)
const mergedExpandedKeys = computed(() =>
  props.defaultExpandAll && expandedKeys.value.length === 0
    ? autoExpandedKeys.value
    : expandedKeys.value,
)
const expandedKeySet = computed(() => new Set(mergedExpandedKeys.value))
const filteredData = computed(() => {
  const trimmedKeyword = keyword.value.trim().toLocaleLowerCase()

  if (!trimmedKeyword) {
    return normalizedData.value
  }

  return filterNodes(normalizedData.value, trimmedKeyword)
})
const visibleNodes = computed(() => flattenVisibleNodes(filteredData.value))
const firstEnabledValue = computed(
  () => visibleNodes.value.find((node) => !isNodeDisabled(node))?.value,
)
const activeNode = computed(() =>
  visibleNodes.value.find((node) => node.value === activeValue.value),
)
const hiddenInputValue = computed(() => (model.value === undefined ? '' : `${model.value}`))

watch(
  allExpandableKeys,
  (keys) => {
    if (props.defaultExpandAll && expandedKeys.value.length === 0) {
      autoExpandedKeys.value = keys
    }
  },
  { immediate: true },
)

watch(isOpen, async (value) => {
  removeListeners()

  if (value) {
    activeValue.value = selectedNode.value?.value ?? firstEnabledValue.value
    await nextTick()
    updatePosition()
    addListeners()
    if (props.searchable) {
      searchRef.value?.focus()
    }
  } else {
    keyword.value = ''
  }
})

watch(
  () => [props.data, model.value],
  () => {
    if (isOpen.value) {
      activeValue.value = selectedNode.value?.value ?? firstEnabledValue.value
      void nextTick(updatePosition)
    }
  },
)

watch(mergedDisabled, (value) => {
  if (value) {
    closePanel()
  }
})

watch(filteredData, () => {
  if (
    isOpen.value &&
    activeValue.value !== undefined &&
    !visibleNodes.value.some((node) => node.value === activeValue.value)
  ) {
    activeValue.value = firstEnabledValue.value
  }
})

onBeforeUnmount(removeListeners)

function normalizeNodes(
  nodes: TreeSelectNode[] = [],
  level = 1,
  parent?: TreeSelectRenderNode,
): TreeSelectRenderNode[] {
  return nodes.map((node) => {
    const { children, ...restNode } = node
    const renderNode: TreeSelectRenderNode = {
      ...restNode,
      level,
      parent,
    }

    renderNode.children = children ? normalizeNodes(children, level + 1, renderNode) : undefined

    return renderNode
  })
}

function flattenNodes(nodes: TreeSelectRenderNode[]): TreeSelectRenderNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenNodes(node.children) : [])])
}

function flattenVisibleNodes(nodes: TreeSelectRenderNode[]): TreeSelectRenderNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(hasChildren(node) && isExpanded(node) ? flattenVisibleNodes(node.children ?? []) : []),
  ])
}

function cloneNode(
  node: TreeSelectRenderNode,
  children?: TreeSelectRenderNode[],
): TreeSelectRenderNode {
  return {
    ...node,
    children,
  }
}

function filterNodes(
  nodes: TreeSelectRenderNode[],
  trimmedKeyword: string,
): TreeSelectRenderNode[] {
  return nodes.reduce<TreeSelectRenderNode[]>((result, node) => {
    const matched = node.label.toLocaleLowerCase().includes(trimmedKeyword)
    const children = node.children ? filterNodes(node.children, trimmedKeyword) : undefined

    if (matched || children?.length) {
      result.push(cloneNode(node, children))
    }

    return result
  }, [])
}

function hasChildren(node: TreeSelectRenderNode) {
  return !node.isLeaf && Boolean(node.children?.length)
}

function isExpanded(node: TreeSelectRenderNode) {
  if (keyword.value.trim()) {
    return true
  }

  return expandedKeySet.value.has(node.value)
}

function isNodeDisabled(node: TreeSelectRenderNode) {
  return mergedDisabled.value || Boolean(node.disabled)
}

function updatePosition() {
  const root = rootRef.value
  const panel = panelRef.value

  if (!root || !panel || !isOpen.value) {
    return
  }

  const rect = root.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
  }
}

function openPanel() {
  if (mergedDisabled.value || isOpen.value) {
    return
  }

  isOpen.value = true
  emit('open')
}

function closePanel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('close')
}

function togglePanel() {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}

function updateExpandedKeys(node: TreeSelectRenderNode, expanded: boolean) {
  const keys = new Set(expandedKeys.value)

  if (expanded) {
    keys.add(node.value)
  } else {
    keys.delete(node.value)
  }

  expandedKeys.value = Array.from(keys)
}

function toggleExpand(node: TreeSelectRenderNode) {
  if (!hasChildren(node) || isNodeDisabled(node)) {
    return
  }

  const expanded = !isExpanded(node)
  updateExpandedKeys(node, expanded)
  emit('nodeExpand', node, expanded)
}

function selectNode(node: TreeSelectRenderNode) {
  if (isNodeDisabled(node)) {
    return
  }

  model.value = node.value
  activeValue.value = node.value
  emit('change', node.value, node)
  closePanel()
  void nextTick(() => triggerRef.value?.focus())
}

function handleNodeClick(node: TreeSelectRenderNode) {
  if (isNodeDisabled(node)) {
    return
  }

  if (props.expandOnClickNode && hasChildren(node)) {
    toggleExpand(node)
  }

  selectNode(node)
}

function clearValue(event?: MouseEvent) {
  event?.stopPropagation()

  if (mergedDisabled.value) {
    return
  }

  model.value = undefined
  activeValue.value = firstEnabledValue.value
  emit('clear')
  emit('change', undefined)
  closePanel()
  void nextTick(() => triggerRef.value?.focus())
}

function moveActive(step: number) {
  const enabledNodes = visibleNodes.value.filter((node) => !isNodeDisabled(node))

  if (!enabledNodes.length) {
    return
  }

  const currentIndex = activeNode.value ? enabledNodes.indexOf(activeNode.value) : step > 0 ? -1 : 0
  const nextIndex = (currentIndex + step + enabledNodes.length) % enabledNodes.length
  activeValue.value = enabledNodes[nextIndex].value
}

function selectActive() {
  const node = activeNode.value

  if (node) {
    selectNode(node)
  }
}

function expandActive() {
  const node = activeNode.value

  if (node && hasChildren(node) && !isExpanded(node)) {
    toggleExpand(node)
  }
}

function collapseActive() {
  const node = activeNode.value

  if (node && hasChildren(node) && isExpanded(node)) {
    toggleExpand(node)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPanel()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    openPanel()
    moveActive(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    openPanel()
    expandActive()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    collapseActive()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (isOpen.value) {
      selectActive()
    } else {
      openPanel()
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  window.setTimeout(() => {
    if (
      document.activeElement !== triggerRef.value &&
      document.activeElement !== searchRef.value &&
      !panelRef.value?.contains(document.activeElement)
    ) {
      closePanel()
    }
  })
  emit('blur', event)
}

function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node

  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }

  closePanel()
}

function addListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('pointerdown', handleDocumentPointerdown)
}

function removeListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
}

function focus() {
  triggerRef.value?.focus()
}

function blur() {
  triggerRef.value?.blur()
}

defineExpose({
  ref: triggerRef,
  focus,
  blur,
  open: openPanel,
  close: closePanel,
  clear: clearValue,
})
</script>

<template>
  <span
    ref="rootRef"
    class="su-tree-select"
    :class="[
      `su-tree-select--${mergedSize}`,
      `su-tree-select--${status}`,
      {
        'is-open': isOpen,
        'is-disabled': mergedDisabled,
        'is-empty': !hasValue,
        'is-clearable': showClear,
      },
    ]"
  >
    <button
      v-bind="attrs"
      :id="id"
      ref="triggerRef"
      class="su-tree-select__trigger"
      type="button"
      :disabled="mergedDisabled"
      :aria-label="mergedAriaLabel"
      :aria-controls="isOpen ? panelId : undefined"
      :aria-expanded="isOpen"
      aria-haspopup="tree"
      @click="togglePanel"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <span class="su-tree-select__value">
        <span v-if="selectedNode">{{ selectedNode.label }}</span>
        <span v-else class="su-tree-select__placeholder">
          {{ mergedPlaceholder }}
        </span>
      </span>
      <span class="su-tree-select__arrow" aria-hidden="true" />
    </button>
    <button
      v-if="showClear"
      class="su-tree-select__clear"
      type="button"
      :aria-label="locale.treeSelect.clear"
      @click="clearValue"
    >
      &times;
    </button>
    <input v-if="name" type="hidden" :name="name" :value="hiddenInputValue" :required="required" />
  </span>
  <Teleport to="body">
    <Transition name="su-tree-select">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        class="su-tree-select__panel"
        :style="panelStyle"
        @keydown="handleKeydown"
      >
        <div v-if="searchable" class="su-tree-select__search">
          <input
            ref="searchRef"
            v-model="keyword"
            class="su-tree-select__search-input"
            type="search"
            :placeholder="mergedFilterPlaceholder"
            @keydown="handleKeydown"
            @blur="handleBlur"
          />
        </div>
        <ul v-if="filteredData.length" class="su-tree-select__list" role="tree">
          <li
            v-for="node in visibleNodes"
            :key="node.value"
            class="su-tree-select__item"
            role="treeitem"
            :aria-expanded="hasChildren(node) ? isExpanded(node) : undefined"
            :aria-selected="model === node.value"
            :aria-disabled="isNodeDisabled(node)"
          >
            <div
              class="su-tree-select__node"
              :class="{
                'is-active': activeValue === node.value,
                'is-selected': model === node.value,
                'is-disabled': isNodeDisabled(node),
                'is-expanded': isExpanded(node),
              }"
              :style="{ '--su-tree-select-level': node.level }"
              @mouseenter="activeValue = node.value"
              @mousedown.prevent
              @click="handleNodeClick(node)"
            >
              <button
                class="su-tree-select__switcher"
                type="button"
                :disabled="isNodeDisabled(node) || !hasChildren(node)"
                :aria-label="isExpanded(node) ? '收起节点' : '展开节点'"
                @click.stop="toggleExpand(node)"
              >
                <span v-if="hasChildren(node)" class="su-tree-select__caret" />
              </button>
              <span class="su-tree-select__node-label">
                <slot name="node" :node="node">
                  {{ node.label }}
                </slot>
              </span>
            </div>
          </li>
        </ul>
        <div v-else class="su-tree-select__empty">
          <slot name="empty">{{ mergedEmptyText }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-tree-select {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-tree-select__trigger {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: inherit;
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;
}

.su-tree-select__trigger:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--su-color-primary) 48%, var(--su-color-border));
}

.su-tree-select__trigger:focus-visible,
.su-tree-select.is-open .su-tree-select__trigger {
  border-color: var(--su-color-primary);
  outline: none;
  box-shadow: var(--su-shadow-sm);
}

.su-tree-select--success .su-tree-select__trigger {
  border-color: var(--su-color-success);
}

.su-tree-select--success .su-tree-select__trigger:focus-visible {
  border-color: var(--su-color-success-active);
}

.su-tree-select--warning .su-tree-select__trigger {
  border-color: var(--su-color-warning);
}

.su-tree-select--warning .su-tree-select__trigger:focus-visible {
  border-color: var(--su-color-warning-active);
}

.su-tree-select--error .su-tree-select__trigger {
  border-color: var(--su-color-error);
}

.su-tree-select--error .su-tree-select__trigger:focus-visible {
  border-color: var(--su-color-error-active);
}

.su-tree-select--small {
  font-size: var(--su-font-size-sm);
}

.su-tree-select--small .su-tree-select__trigger {
  min-height: 24px;
  padding: 0 30px 0 var(--su-space-sm);
}

.su-tree-select--medium .su-tree-select__trigger {
  min-height: 32px;
  padding: 0 34px 0 var(--su-space-md);
}

.su-tree-select--large {
  font-size: var(--su-font-size-lg);
}

.su-tree-select--large .su-tree-select__trigger {
  min-height: 44px;
  padding: 0 40px 0 var(--su-space-lg);
}

.su-tree-select.is-clearable .su-tree-select__trigger {
  padding-right: 58px;
}

.su-tree-select__value {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-tree-select__placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-tree-select__clear {
  position: absolute;
  top: 50%;
  right: 30px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
}

.su-tree-select__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-tree-select__arrow {
  position: absolute;
  top: 50%;
  right: var(--su-space-md);
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  color: var(--su-color-text-muted);
  pointer-events: none;
  transform: translateY(-65%) rotate(45deg);
  transition: transform 0.16s ease;
}

.su-tree-select.is-open .su-tree-select__arrow {
  transform: translateY(-35%) rotate(225deg);
}

.su-tree-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-tree-select.is-disabled .su-tree-select__trigger {
  cursor: not-allowed;
}

.su-tree-select__panel {
  position: fixed;
  z-index: 2100;
  max-width: min(420px, calc(100vw - var(--su-space-xl) * 2));
  max-height: 320px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow: hidden;
}

.su-tree-select__search {
  padding: var(--su-space-sm);
  border-bottom: 1px solid var(--su-color-border);
}

.su-tree-select__search-input {
  width: 100%;
  min-height: 30px;
  padding: 0 var(--su-space-sm);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  outline: 0;
  color: inherit;
  background: var(--su-color-bg-elevated);
  font: inherit;
}

.su-tree-select__search-input:focus {
  border-color: var(--su-color-primary);
}

.su-tree-select__list {
  max-height: 280px;
  margin: 0;
  padding: var(--su-space-xs);
  list-style: none;
  overflow: auto;
}

.su-tree-select__item {
  margin: 0;
  padding: 0;
}

.su-tree-select__node {
  --su-tree-select-indent: 20px;

  display: flex;
  align-items: center;
  min-height: 32px;
  padding-right: var(--su-space-sm);
  padding-left: calc((var(--su-tree-select-level) - 1) * var(--su-tree-select-indent));
  border-radius: var(--su-radius-sm);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-tree-select__node:hover:not(.is-disabled),
.su-tree-select__node.is-active:not(.is-disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-tree-select__node.is-selected:not(.is-disabled) {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 68%, transparent);
  font-weight: 600;
}

.su-tree-select__node.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-tree-select__switcher {
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

.su-tree-select__switcher:disabled {
  cursor: default;
}

.su-tree-select__caret {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
  transition: transform 0.16s ease;
}

.su-tree-select__node.is-expanded .su-tree-select__caret {
  transform: rotate(45deg);
}

.su-tree-select__node-label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  padding: 0 var(--su-space-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-tree-select__empty {
  min-height: 72px;
  padding: var(--su-space-lg);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-tree-select-enter-active,
.su-tree-select-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-tree-select-enter-from,
.su-tree-select-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .su-tree-select__trigger,
  .su-tree-select__arrow,
  .su-tree-select__node,
  .su-tree-select__caret,
  .su-tree-select-enter-active,
  .su-tree-select-leave-active {
    transition: none;
  }
}
</style>
