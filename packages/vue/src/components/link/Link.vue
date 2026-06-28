<script setup lang="ts">
import { computed } from 'vue'
import type { LinkType, LinkUnderline } from './context'

defineOptions({
  name: 'SuLink',
})

const props = withDefaults(
  defineProps<{
    href?: string
    target?: '_self' | '_blank' | '_parent' | '_top' | string
    rel?: string
    type?: LinkType
    underline?: LinkUnderline
    disabled?: boolean
  }>(),
  {
    href: undefined,
    target: undefined,
    rel: undefined,
    type: 'primary',
    underline: 'hover',
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedHref = computed(() => (props.disabled ? undefined : props.href))

const resolvedRel = computed(() => {
  if (props.rel) {
    return props.rel
  }

  if (props.target === '_blank') {
    return 'noopener noreferrer'
  }

  return undefined
})

const resolvedTabindex = computed(() => (props.disabled ? -1 : undefined))

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>

<template>
  <a
    class="su-link"
    :class="[
      `su-link--${type}`,
      `su-link--underline-${underline}`,
      {
        'is-disabled': disabled,
      },
    ]"
    :href="resolvedHref"
    :target="target"
    :rel="resolvedRel"
    :aria-disabled="disabled || undefined"
    :tabindex="resolvedTabindex"
    @click="handleClick"
  >
    <span v-if="$slots.prefix" class="su-link__prefix">
      <slot name="prefix" />
    </span>
    <slot />
    <span v-if="$slots.suffix" class="su-link__suffix">
      <slot name="suffix" />
    </span>
  </a>
</template>

<style>
.su-link {
  --su-link-color: var(--su-color-primary);
  --su-link-hover-color: var(--su-color-primary-hover);
  --su-link-active-color: var(--su-color-primary-active);

  display: inline-flex;
  align-items: center;
  max-width: 100%;
  gap: var(--su-space-xs);
  border-radius: var(--su-radius-sm);
  color: var(--su-link-color);
  font: inherit;
  line-height: var(--su-font-line-height);
  overflow-wrap: anywhere;
  text-decoration-color: currentcolor;
  text-underline-offset: 0.18em;
  cursor: pointer;
  transition:
    color 0.16s ease,
    opacity 0.16s ease;
}

.su-link--default {
  --su-link-color: var(--su-color-text);
  --su-link-hover-color: var(--su-color-primary-hover);
  --su-link-active-color: var(--su-color-primary-active);
}

.su-link--primary {
  --su-link-color: var(--su-color-primary);
  --su-link-hover-color: var(--su-color-primary-hover);
  --su-link-active-color: var(--su-color-primary-active);
}

.su-link--success {
  --su-link-color: var(--su-color-success-text);
  --su-link-hover-color: var(--su-color-success);
  --su-link-active-color: var(--su-color-success-active);
}

.su-link--warning {
  --su-link-color: var(--su-color-warning-text);
  --su-link-hover-color: var(--su-color-warning);
  --su-link-active-color: var(--su-color-warning-active);
}

.su-link--error {
  --su-link-color: var(--su-color-error-text);
  --su-link-hover-color: var(--su-color-error);
  --su-link-active-color: var(--su-color-error-active);
}

.su-link--info {
  --su-link-color: var(--su-color-info);
  --su-link-hover-color: var(--su-color-info-hover);
  --su-link-active-color: var(--su-color-info-active);
}

.su-link--underline-always {
  text-decoration-line: underline;
}

.su-link--underline-hover,
.su-link--underline-never {
  text-decoration-line: none;
}

.su-link:hover:not(.is-disabled),
.su-link:focus-visible:not(.is-disabled) {
  color: var(--su-link-hover-color);
}

.su-link--underline-hover:hover:not(.is-disabled),
.su-link--underline-hover:focus-visible:not(.is-disabled) {
  text-decoration-line: underline;
}

.su-link:active:not(.is-disabled) {
  color: var(--su-link-active-color);
}

.su-link:focus-visible {
  outline: 2px solid var(--su-color-primary-soft);
  outline-offset: 2px;
}

.su-link.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-link__prefix,
.su-link__suffix {
  display: inline-flex;
  align-items: center;
  flex: none;
}
</style>
