<script setup lang="ts">
import { computed, provide } from 'vue'
import {
  buttonGroupKey,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
} from './context'

type ButtonGroupDirection = 'horizontal' | 'vertical'

defineOptions({
  name: 'SuButtonGroup',
})

const props = withDefaults(
  defineProps<{
    type?: ButtonType
    variant?: ButtonVariant
    size?: ButtonSize
    direction?: ButtonGroupDirection
  }>(),
  {
    type: undefined,
    variant: undefined,
    size: undefined,
    direction: 'horizontal',
  },
)

const context = computed(() => ({
  type: props.type,
  variant: props.variant,
  size: props.size,
}))

provide(buttonGroupKey, context)
</script>

<template>
  <div
    class="su-button-group"
    :class="`su-button-group--${direction}`"
    role="group"
  >
    <slot />
  </div>
</template>

<style>
.su-button-group {
  display: inline-flex;
  vertical-align: middle;
}

.su-button-group--vertical {
  flex-direction: column;
  align-items: stretch;
}

.su-button-group > .su-button {
  position: relative;
  border-radius: 0;
  box-shadow: none;
}

.su-button-group > .su-button:hover:not(:disabled),
.su-button-group > .su-button:focus-visible {
  z-index: 1;
}

.su-button-group--horizontal > .su-button:not(:first-child) {
  margin-left: -1px;
}

.su-button-group--horizontal > .su-button:first-child {
  border-top-left-radius: var(--su-radius-md);
  border-bottom-left-radius: var(--su-radius-md);
}

.su-button-group--horizontal > .su-button:last-child {
  border-top-right-radius: var(--su-radius-md);
  border-bottom-right-radius: var(--su-radius-md);
}

.su-button-group--vertical > .su-button:not(:first-child) {
  margin-top: -1px;
}

.su-button-group--vertical > .su-button:first-child {
  border-top-left-radius: var(--su-radius-md);
  border-top-right-radius: var(--su-radius-md);
}

.su-button-group--vertical > .su-button:last-child {
  border-bottom-right-radius: var(--su-radius-md);
  border-bottom-left-radius: var(--su-radius-md);
}

.su-button-group > .su-button:only-child {
  border-radius: var(--su-radius-md);
}
</style>
