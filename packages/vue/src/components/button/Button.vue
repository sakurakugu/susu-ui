<script setup lang="ts">
defineOptions({
  name: 'SuButton',
})

withDefaults(
  defineProps<{
    type?: 'default' | 'primary'
    disabled?: boolean
  }>(),
  {
    type: 'default',
    disabled: false,
  },
)
</script>

<template>
  <button
    class="su-button"
    :class="[`su-button--${type}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style>
.su-button {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-xs);
  padding: 0 var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-button:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
}

.su-button--primary {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-button--primary:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-button:active:not(:disabled) {
  border-color: var(--su-color-primary-active);
}

.su-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
