<script setup lang="ts">
import { inject } from 'vue'
import type { MenuRenderItem } from './Menu.vue'
import { menuKey } from './context'

defineOptions({
  name: 'SuMenuNode',
})

defineProps<{
  item: MenuRenderItem
}>()

defineSlots<{
  default?: (props: { item: MenuRenderItem }) => unknown
}>()

const injectedMenu = inject(menuKey)

if (!injectedMenu) {
  throw new Error('SuMenuNode 必须在 SuMenu 内部使用')
}

const menu = injectedMenu

function getTabindex(item: MenuRenderItem) {
  if (menu.isItemDisabled(item)) {
    return -1
  }

  if (menu.selectedKey.value === item.key || menu.firstEnabledKey.value === item.key) {
    return 0
  }

  return -1
}
</script>

<template>
  <li
    class="su-menu__item"
    :class="{
      'is-divided': item.divided,
      'is-open': menu.isOpen(item),
      'is-disabled': menu.isItemDisabled(item),
    }"
    role="none"
  >
    <button
      class="su-menu__trigger"
      :class="{
        'is-selected': menu.selectedKey.value === item.key,
        'is-open': menu.isOpen(item),
        'is-disabled': menu.isItemDisabled(item),
      }"
      type="button"
      role="menuitem"
      :style="{ '--su-menu-level': item.level }"
      :disabled="menu.isItemDisabled(item)"
      :aria-current="menu.selectedKey.value === item.key ? 'page' : undefined"
      :aria-haspopup="menu.hasChildren(item) ? 'menu' : undefined"
      :aria-expanded="menu.hasChildren(item) ? menu.isOpen(item) : undefined"
      :tabindex="getTabindex(item)"
      @click="menu.handleItemClick(item)"
      @keydown="menu.handleItemKeydown(item, $event)"
    >
      <span v-if="item.icon" class="su-menu__icon">
        <component :is="item.icon" />
      </span>
      <span class="su-menu__label">
        <slot :item="item">{{ item.label }}</slot>
      </span>
      <span v-if="menu.hasChildren(item)" class="su-menu__arrow" aria-hidden="true" />
    </button>

    <ul v-if="menu.hasChildren(item) && menu.isOpen(item)" class="su-menu__children" role="menu">
      <MenuNode v-for="child in item.children" :key="child.key" :item="child">
        <template #default="{ item: slotItem }">
          <slot :item="slotItem">{{ slotItem.label }}</slot>
        </template>
      </MenuNode>
    </ul>
  </li>
</template>
