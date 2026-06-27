<script setup lang="ts">
defineOptions({
  name: 'SuContent',
})

defineSlots<{
  default?: () => unknown
}>()
</script>

<template>
  <main class="su-layout__content">
    <slot />
  </main>
</template>
