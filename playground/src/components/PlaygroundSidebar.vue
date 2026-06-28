<script setup lang="ts">
import { computed } from 'vue'
import { playgroundGroups, playgroundNavItems } from '../playgroundNav'

defineProps<{
  activeId: string
}>()

const emit = defineEmits<{
  selectDemo: [id: string]
}>()

const groupedNavItems = computed(() =>
  playgroundGroups
    .map((group) => ({
      ...group,
      items: playgroundNavItems.filter((item) => item.group === group.id),
    }))
    .filter((group) => group.items.length > 0),
)
</script>

<template>
  <aside class="playground-sidebar">
    <div class="sidebar-brand">
      <strong>Susu UI</strong>
      <span>Playground</span>
    </div>
    <nav class="sidebar-nav" aria-label="组件示例导航">
      <section
        v-for="group in groupedNavItems"
        :key="group.id"
        class="sidebar-nav-group"
      >
        <h2>{{ group.label }}</h2>
        <button
          v-for="item in group.items"
          :key="item.id"
          class="sidebar-nav-item"
          :class="{ 'is-active': item.id === activeId }"
          type="button"
          @click="emit('selectDemo', item.id)"
        >
          <span class="sidebar-nav-label">{{ item.label }}</span>
          <span class="sidebar-nav-name">{{ item.name }}</span>
        </button>
      </section>
    </nav>
  </aside>
</template>
