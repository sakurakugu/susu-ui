<script setup lang="ts">
defineOptions({
  name: 'SuTag',
})

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
type TagVariant = 'light' | 'outline' | 'solid'
type TagSize = 'small' | 'medium' | 'large'

withDefaults(
  defineProps<{
    type?: TagType
    variant?: TagVariant
    size?: TagSize
    closable?: boolean
    round?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'default',
    variant: 'light',
    size: 'medium',
    closable: false,
    round: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

function handleClose(event: MouseEvent) {
  emit('close', event)
}
</script>

<template>
  <span
    class="su-tag"
    :class="[
      `su-tag--${type}`,
      `su-tag--${variant}`,
      `su-tag--${size}`,
      {
        'is-round': round,
        'is-disabled': disabled,
        'has-prefix': $slots.prefix,
      },
    ]"
  >
    <span v-if="$slots.prefix" class="su-tag__prefix">
      <slot name="prefix" />
    </span>
    <span class="su-tag__content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="su-tag__close"
      type="button"
      :disabled="disabled"
      aria-label="关闭标签"
      @click="handleClose"
    >
      &times;
    </button>
  </span>
</template>

<style>
.su-tag {
  --su-tag-color: var(--su-color-text);
  --su-tag-border-color: var(--su-color-border);
  --su-tag-bg: var(--su-color-bg-soft);
  --su-tag-solid-bg: var(--su-color-text-muted);
  --su-tag-solid-color: var(--su-color-primary-text);

  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid var(--su-tag-border-color);
  border-radius: var(--su-radius-sm);
  color: var(--su-tag-color);
  background: var(--su-tag-bg);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    opacity 0.16s ease;
}

.su-tag--primary {
  --su-tag-color: var(--su-color-primary);
  --su-tag-border-color: color-mix(
    in srgb,
    var(--su-color-primary) 36%,
    var(--su-color-border)
  );
  --su-tag-bg: color-mix(
    in srgb,
    var(--su-color-primary-soft) 72%,
    var(--su-color-bg-elevated)
  );
  --su-tag-solid-bg: var(--su-color-primary);
}

.su-tag--success {
  --su-tag-color: #15803d;
  --su-tag-border-color: #86efac;
  --su-tag-bg: #f0fdf4;
  --su-tag-solid-bg: #16a34a;
}

.su-tag--warning {
  --su-tag-color: #b45309;
  --su-tag-border-color: #fcd34d;
  --su-tag-bg: #fffbeb;
  --su-tag-solid-bg: #d97706;
}

.su-tag--error {
  --su-tag-color: #b91c1c;
  --su-tag-border-color: #fca5a5;
  --su-tag-bg: #fef2f2;
  --su-tag-solid-bg: #dc2626;
}

.su-tag--info {
  --su-tag-color: #2563eb;
  --su-tag-border-color: #bfdbfe;
  --su-tag-bg: #eff6ff;
  --su-tag-solid-bg: #2563eb;
}

.su-tag--outline {
  background: transparent;
}

.su-tag--solid {
  border-color: var(--su-tag-solid-bg);
  color: var(--su-tag-solid-color);
  background: var(--su-tag-solid-bg);
}

.su-tag--small {
  min-height: 22px;
  padding: 0 7px;
  font-size: var(--su-font-size-sm);
}

.su-tag--medium {
  min-height: 26px;
  padding: 0 var(--su-space-sm);
  font-size: var(--su-font-size-md);
}

.su-tag--large {
  min-height: 32px;
  padding: 0 var(--su-space-md);
  font-size: var(--su-font-size-lg);
}

.su-tag.is-round {
  border-radius: var(--su-radius-round);
}

.su-tag.is-disabled {
  opacity: 0.55;
}

.su-tag__content {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-tag__prefix,
.su-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.su-tag__prefix {
  margin-right: var(--su-space-xs);
}

.su-tag__close {
  width: 1.25em;
  height: 1.25em;
  margin-right: -2px;
  margin-left: var(--su-space-xs);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: currentcolor;
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  opacity: 0.82;
}

.su-tag__close:hover:not(:disabled) {
  background: color-mix(in srgb, currentcolor 12%, transparent);
  opacity: 1;
}

.su-tag__close:disabled {
  cursor: not-allowed;
}
</style>
