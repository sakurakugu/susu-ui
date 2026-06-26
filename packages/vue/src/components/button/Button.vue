<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  buttonGroupKey,
  type ButtonNativeType,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
} from './context'

defineOptions({
  name: 'SuButton',
})

const props = withDefaults(
  defineProps<{
    type?: ButtonType
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    nativeType?: ButtonNativeType
  }>(),
  {
    type: undefined,
    variant: undefined,
    size: undefined,
    disabled: false,
    loading: false,
    nativeType: 'button',
  },
)

const buttonGroup = inject(buttonGroupKey, undefined)

const mergedType = computed(
  () => props.type ?? buttonGroup?.value.type ?? 'default',
)

const mergedVariant = computed(
  () => props.variant ?? buttonGroup?.value.variant ?? 'solid',
)

const mergedSize = computed(
  () => props.size ?? buttonGroup?.value.size ?? 'medium',
)
</script>

<template>
  <button
    class="su-button"
    :class="[
      `su-button--${mergedType}`,
      `su-button--${mergedVariant}`,
      `su-button--${mergedSize}`,
      {
        'is-loading': loading,
      },
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="su-button__loading" aria-hidden="true" />
    <span v-if="$slots.prefix" class="su-button__prefix">
      <slot name="prefix" />
    </span>
    <slot />
    <span v-if="$slots.suffix" class="su-button__suffix">
      <slot name="suffix" />
    </span>
  </button>
</template>

<style>
.su-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-xs);
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

.su-button--small {
  height: 24px;
  padding: 0 var(--su-space-sm);
  font-size: var(--su-font-size-sm);
}

.su-button--medium {
  height: 32px;
  padding: 0 var(--su-space-lg);
  font-size: var(--su-font-size-md);
}

.su-button--large {
  height: 44px;
  padding: 0 var(--su-space-xl);
  font-size: var(--su-font-size-lg);
}

.su-button--small .su-button__prefix,
.su-button--small .su-button__suffix,
.su-button--small .su-button__loading {
  font-size: var(--su-font-size-sm);
}

.su-button--large .su-button__prefix,
.su-button--large .su-button__suffix,
.su-button--large .su-button__loading {
  font-size: var(--su-font-size-lg);
}

.su-button__loading {
  width: 1em;
  height: 1em;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: var(--su-radius-round);
  animation: su-button-loading 0.72s linear infinite;
}

.su-button__prefix,
.su-button__suffix {
  display: inline-flex;
  align-items: center;
}

.su-button--default.su-button--solid:hover:not(:disabled),
.su-button--default.su-button--outline:hover:not(:disabled),
.su-button--default.su-button--ghost:hover:not(:disabled),
.su-button--default.su-button--text:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
}

.su-button--primary.su-button--solid {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-button--primary.su-button--solid:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-button--outline {
  color: var(--su-color-primary);
  background: transparent;
}

.su-button--outline:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-button--text,
.su-button--ghost {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.su-button--text {
  padding-right: var(--su-space-sm);
  padding-left: var(--su-space-sm);
}

.su-button--primary.su-button--text,
.su-button--primary.su-button--ghost {
  color: var(--su-color-primary);
}

.su-button--text:hover:not(:disabled),
.su-button--ghost:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-button:active:not(:disabled) {
  border-color: var(--su-color-primary-active);
}

.su-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@keyframes su-button-loading {
  to {
    transform: rotate(360deg);
  }
}
</style>
