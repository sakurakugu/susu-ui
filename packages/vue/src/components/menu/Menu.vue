<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useLocale } from '../../config-provider'
import MenuNode from './MenuNode.vue'
import { menuKey } from './context'

defineOptions({
  name: 'SuMenu',
})

export type MenuKey = string | number
export type MenuMode = 'vertical' | 'horizontal'
export type MenuSize = 'small' | 'medium' | 'large'

export interface MenuItem {
  key: MenuKey
  label: string
  icon?: unknown
  children?: MenuItem[]
  disabled?: boolean
  divided?: boolean
  [key: string]: unknown
}

export interface MenuRenderItem extends MenuItem {
  level: number
  parentKey?: MenuKey
  children?: MenuRenderItem[]
}

const selectedKey = defineModel<MenuKey | undefined>('selectedKey', {
  default: undefined,
})

const openKeys = defineModel<MenuKey[]>('openKeys', {
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    items?: MenuItem[]
    mode?: MenuMode
    size?: MenuSize
    accordion?: boolean
    collapse?: boolean
    selectable?: boolean
    defaultOpenAll?: boolean
    disabled?: boolean
    emptyText?: string
  }>(),
  {
    items: () => [],
    mode: 'vertical',
    size: 'medium',
    accordion: false,
    collapse: false,
    selectable: true,
    defaultOpenAll: false,
    disabled: false,
    emptyText: undefined,
  },
)

const emit = defineEmits<{
  select: [key: MenuKey, item: MenuRenderItem]
  openChange: [keys: MenuKey[], item: MenuRenderItem, opened: boolean]
}>()

defineSlots<{
  default?: (props: { item: MenuRenderItem }) => unknown
  empty?: () => unknown
}>()

const autoOpenKeys = ref<MenuKey[]>([])
const locale = useLocale()

const normalizedItems = computed<MenuRenderItem[]>(() => normalizeItems(props.items))

const hasItems = computed(() => normalizedItems.value.length > 0)
const mergedEmptyText = computed(() => props.emptyText ?? locale.value.menu.empty)
const isHorizontal = computed(() => props.mode === 'horizontal')
const isCollapsed = computed(() => props.collapse && !isHorizontal.value)
const allSubmenuKeys = computed(() =>
  flattenItems(normalizedItems.value)
    .filter((item) => hasChildren(item))
    .map((item) => item.key),
)
const mergedOpenKeys = computed(() =>
  props.defaultOpenAll && openKeys.value.length === 0 ? autoOpenKeys.value : openKeys.value,
)
const openKeySet = computed(() => new Set(mergedOpenKeys.value))
const firstEnabledKey = computed(
  () => flattenItems(normalizedItems.value).find((item) => !isItemDisabled(item))?.key,
)

watch(
  allSubmenuKeys,
  (keys) => {
    if (props.defaultOpenAll && openKeys.value.length === 0) {
      autoOpenKeys.value = keys
    }
  },
  { immediate: true },
)

provide(menuKey, {
  selectedKey,
  firstEnabledKey,
  isHorizontal,
  isCollapsed,
  selectable: computed(() => props.selectable),
  disabled: computed(() => props.disabled),
  isOpen,
  isItemDisabled,
  hasChildren,
  handleItemClick,
  handleItemKeydown,
})

function normalizeItems(items: MenuItem[], level = 1, parentKey?: MenuKey): MenuRenderItem[] {
  return items.map((item) => ({
    ...item,
    level,
    parentKey,
    children: item.children ? normalizeItems(item.children, level + 1, item.key) : undefined,
  }))
}

function flattenItems(items: MenuRenderItem[]): MenuRenderItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])])
}

function hasChildren(item: MenuRenderItem) {
  return Boolean(item.children?.length)
}

function isOpen(item: MenuRenderItem) {
  return openKeySet.value.has(item.key)
}

function isItemDisabled(item: MenuRenderItem) {
  return props.disabled || Boolean(item.disabled)
}

function updateOpenKeys(item: MenuRenderItem, opened: boolean) {
  const keys = new Set(openKeys.value)

  if (opened) {
    if (props.accordion && item.parentKey === undefined) {
      openKeys.value = [item.key]
      return
    }

    keys.add(item.key)
  } else {
    keys.delete(item.key)
  }

  openKeys.value = Array.from(keys)
}

function toggleOpen(item: MenuRenderItem) {
  if (!hasChildren(item) || isItemDisabled(item)) {
    return
  }

  const opened = !isOpen(item)
  updateOpenKeys(item, opened)
  emit('openChange', openKeys.value, item, opened)
}

function selectItem(item: MenuRenderItem) {
  if (!props.selectable || hasChildren(item) || isItemDisabled(item)) {
    return
  }

  selectedKey.value = item.key
  emit('select', item.key, item)
}

function handleItemClick(item: MenuRenderItem) {
  if (isItemDisabled(item)) {
    return
  }

  if (hasChildren(item)) {
    toggleOpen(item)
    return
  }

  selectItem(item)
}

function handleItemKeydown(item: MenuRenderItem, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleItemClick(item)
  }

  if (event.key === 'ArrowRight' && hasChildren(item) && !isOpen(item)) {
    event.preventDefault()
    toggleOpen(item)
  }

  if (event.key === 'ArrowLeft' && hasChildren(item) && isOpen(item)) {
    event.preventDefault()
    toggleOpen(item)
  }
}
</script>

<template>
  <nav
    class="su-menu"
    :class="[
      `su-menu--${mode}`,
      `su-menu--${size}`,
      {
        'is-disabled': disabled,
        'is-collapsed': isCollapsed,
      },
    ]"
    :aria-disabled="disabled"
  >
    <ul
      v-if="hasItems"
      class="su-menu__list"
      role="menu"
      :aria-orientation="isHorizontal ? 'horizontal' : 'vertical'"
    >
      <MenuNode v-for="item in normalizedItems" :key="item.key" :item="item">
        <template #default="{ item: slotItem }">
          <slot :item="slotItem">{{ slotItem.label }}</slot>
        </template>
      </MenuNode>
    </ul>

    <div v-else class="su-menu__empty">
      <slot name="empty">{{ mergedEmptyText }}</slot>
    </div>
  </nav>
</template>

<style>
.su-menu {
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-menu__list,
.su-menu__children {
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-menu__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.su-menu--horizontal > .su-menu__list {
  flex-direction: row;
  align-items: center;
  gap: var(--su-space-xs);
  border-bottom: 1px solid var(--su-color-border);
}

.su-menu__children {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
}

.su-menu__item {
  position: relative;
}

.su-menu__item.is-divided {
  margin-top: var(--su-space-xs);
  padding-top: var(--su-space-xs);
  border-top: 1px solid var(--su-color-border);
}

.su-menu__trigger {
  --su-menu-indent: 20px;
  --su-menu-item-height: 36px;

  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--su-menu-item-height);
  padding: 0 var(--su-space-sm) 0
    calc(var(--su-space-sm) + (var(--su-menu-level) - 1) * var(--su-menu-indent));
  border: 0;
  border-radius: var(--su-radius-md);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  outline: 0;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-menu--horizontal > .su-menu__list > .su-menu__item > .su-menu__trigger {
  min-height: 40px;
  padding: 0 var(--su-space-md);
  border-radius: var(--su-radius-md) var(--su-radius-md) 0 0;
}

.su-menu__trigger:hover:not(:disabled),
.su-menu__trigger:focus-visible:not(:disabled) {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 48%, transparent);
}

.su-menu__trigger:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--su-color-primary) 20%, transparent);
}

.su-menu__trigger.is-selected {
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary-soft) 72%, transparent);
  font-weight: 600;
}

.su-menu--horizontal > .su-menu__list > .su-menu__item > .su-menu__trigger.is-selected::after,
.su-menu--horizontal > .su-menu__list > .su-menu__item > .su-menu__trigger.is-open::after {
  position: absolute;
  right: var(--su-space-sm);
  bottom: -1px;
  left: var(--su-space-sm);
  height: 2px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary);
  content: '';
}

.su-menu__trigger:disabled,
.su-menu__trigger.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-xs);
}

.su-menu__label {
  overflow: hidden;
  min-width: 0;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-menu__arrow {
  width: 7px;
  height: 7px;
  margin-left: var(--su-space-sm);
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
  transition: transform 0.16s ease;
}

.su-menu__trigger.is-open .su-menu__arrow {
  transform: rotate(45deg);
}

.su-menu--horizontal > .su-menu__list > .su-menu__item > .su-menu__trigger .su-menu__arrow {
  transform: rotate(45deg);
}

.su-menu--horizontal > .su-menu__list > .su-menu__item > .su-menu__trigger.is-open .su-menu__arrow {
  transform: rotate(-135deg);
}

.su-menu--small {
  font-size: var(--su-font-size-sm);
}

.su-menu--small .su-menu__trigger {
  --su-menu-item-height: 30px;
  --su-menu-indent: 18px;
}

.su-menu--large {
  font-size: var(--su-font-size-lg);
}

.su-menu--large .su-menu__trigger {
  --su-menu-item-height: 44px;
  --su-menu-indent: 24px;
}

.su-menu.is-collapsed {
  width: 56px;
}

.su-menu.is-collapsed .su-menu__trigger {
  justify-content: center;
  padding: 0;
}

.su-menu.is-collapsed .su-menu__icon {
  margin-right: 0;
}

.su-menu.is-collapsed .su-menu__label,
.su-menu.is-collapsed .su-menu__arrow,
.su-menu.is-collapsed .su-menu__children {
  display: none;
}

.su-menu.is-disabled {
  opacity: 0.72;
}

.su-menu__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  padding: var(--su-space-xl);
  color: var(--su-color-text-muted);
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .su-menu__trigger,
  .su-menu__arrow {
    transition: none;
  }
}
</style>
