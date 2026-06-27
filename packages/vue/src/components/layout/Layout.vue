<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { layoutKey } from './context'

defineOptions({
  name: 'SuLayout',
})

const props = withDefaults(
  defineProps<{
    hasSider?: boolean
  }>(),
  {
    hasSider: false,
  },
)

defineSlots<{
  default?: () => unknown
}>()

const siderCount = ref(0)
const hasSiderClass = computed(() => props.hasSider || siderCount.value > 0)

provide(layoutKey, {
  addSider() {
    siderCount.value += 1
  },
  removeSider() {
    siderCount.value = Math.max(0, siderCount.value - 1)
  },
})
</script>

<template>
  <section
    class="su-layout"
    :class="{
      'su-layout--has-sider': hasSiderClass,
    }"
  >
    <slot />
  </section>
</template>

<style>
.su-layout {
  display: flex;
  flex: auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  color: var(--su-color-text);
  background: var(--su-color-bg);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-layout--has-sider {
  flex-direction: row;
}

.su-layout .su-layout {
  background: transparent;
}

.su-layout__header,
.su-layout__footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 0 var(--su-space-xl);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
}

.su-layout__header {
  border-bottom: 1px solid var(--su-color-border);
}

.su-layout__footer {
  border-top: 1px solid var(--su-color-border);
}

.su-layout__content {
  flex: auto;
  min-width: 0;
  min-height: 0;
  padding: var(--su-space-xl);
  overflow: auto;
  background: var(--su-color-bg);
}

.su-layout__sider {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-right: 1px solid var(--su-color-border);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  transition:
    width 0.2s ease,
    flex-basis 0.2s ease,
    max-width 0.2s ease,
    min-width 0.2s ease;
}

.su-layout__sider--dark {
  border-right-color: color-mix(in srgb, #ffffff 16%, transparent);
  color: #ffffff;
  background: #1f2937;
}

.su-layout__sider-content {
  flex: auto;
  min-height: 0;
  overflow: auto;
}

.su-layout__sider-trigger {
  flex: 0 0 auto;
  width: 100%;
  min-height: 40px;
  padding: 0 var(--su-space-sm);
  border: 0;
  border-top: 1px solid var(--su-color-border);
  color: inherit;
  background: color-mix(in srgb, var(--su-color-bg-soft) 76%, transparent);
  cursor: pointer;
}

.su-layout__sider-trigger:hover,
.su-layout__sider-trigger:focus-visible {
  outline: 0;
  background: color-mix(
    in srgb,
    var(--su-color-primary) 12%,
    var(--su-color-bg-soft)
  );
}

.su-layout__sider--dark .su-layout__sider-trigger {
  border-top-color: color-mix(in srgb, #ffffff 16%, transparent);
  background: color-mix(in srgb, #ffffff 8%, transparent);
}

.su-layout__sider--dark .su-layout__sider-trigger:hover,
.su-layout__sider--dark .su-layout__sider-trigger:focus-visible {
  background: color-mix(in srgb, #ffffff 14%, transparent);
}
</style>
