<script setup lang="ts">
import type { AnchorKey, AnchorRenderItem } from './Anchor.vue'

defineOptions({
  name: 'SuAnchorNode',
})

defineProps<{
  item: AnchorRenderItem
  activeKey?: AnchorKey
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent, item: AnchorRenderItem]
}>()

defineSlots<{
  default?: (props: { item: AnchorRenderItem; active: boolean }) => unknown
}>()

function handleChildClick(event: MouseEvent, item: AnchorRenderItem) {
  emit('click', event, item)
}
</script>

<template>
  <li
    class="su-anchor__item"
    :class="{
      'is-active': item.key === activeKey,
      'is-disabled': disabled || item.disabled,
    }"
    :style="{ '--su-anchor-level': item.level }"
  >
    <a
      class="su-anchor__link"
      :href="item.href"
      :aria-current="item.key === activeKey ? 'true' : undefined"
      :aria-disabled="disabled || item.disabled"
      @click="emit('click', $event, item)"
    >
      <slot :item="item" :active="item.key === activeKey">
        {{ item.title }}
      </slot>
    </a>

    <ul v-if="item.children?.length" class="su-anchor__children">
      <AnchorNode
        v-for="child in item.children"
        :key="child.key"
        :item="child"
        :active-key="activeKey"
        :disabled="disabled"
        @click="handleChildClick"
      >
        <template #default="{ item: slotItem, active }">
          <slot :item="slotItem" :active="active">
            {{ slotItem.title }}
          </slot>
        </template>
      </AnchorNode>
    </ul>
  </li>
</template>
