<script setup lang="ts">
import { playgroundNavItems } from '../playgroundNav'
</script>

<template>
  <aside class="playground-sidebar">
    <div class="sidebar-brand">
      <strong>Susu UI</strong>
      <span>Playground</span>
    </div>
    <nav class="sidebar-nav" aria-label="组件示例导航">
      <a
        v-for="item in playgroundNavItems"
        :key="item.id"
        class="sidebar-nav-item"
        :href="`#${item.id}`"
      >
        {{ item.label }}
      </a>
    </nav>
  </aside>
</template>
