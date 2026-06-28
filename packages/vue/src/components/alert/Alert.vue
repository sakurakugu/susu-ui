<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'SuAlert',
})

type AlertType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    type?: AlertType
    title?: string
    description?: string
    showIcon?: boolean
    closable?: boolean
  }>(),
  {
    type: 'info',
    title: undefined,
    description: undefined,
    showIcon: true,
    closable: false,
  },
)

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  icon?: () => unknown
}>()

const visible = ref(true)

const iconText = computed(() => {
  const iconMap: Record<AlertType, string> = {
    info: 'i',
    success: '✓',
    warning: '!',
    error: '×',
  }

  return iconMap[props.type]
})

function close(event: MouseEvent) {
  if (!visible.value) {
    return
  }

  visible.value = false
  emit('close', event)
}
</script>

<template>
  <Transition name="su-alert">
    <div
      v-if="visible"
      class="su-alert"
      :class="[
        `su-alert--${type}`,
        {
          'is-closable': closable,
          'has-title': title || $slots.title,
        },
      ]"
      role="alert"
    >
      <span v-if="showIcon" class="su-alert__icon" aria-hidden="true">
        <slot name="icon">
          {{ iconText }}
        </slot>
      </span>
      <div class="su-alert__content">
        <div v-if="title || $slots.title" class="su-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.default" class="su-alert__description">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button
        v-if="closable"
        class="su-alert__close"
        type="button"
        aria-label="关闭提示"
        @click="close"
      >
        &times;
      </button>
    </div>
  </Transition>
</template>

<style>
.su-alert {
  --su-alert-color: var(--su-color-primary);
  --su-alert-border-color: color-mix(
    in srgb,
    var(--su-color-primary) 24%,
    var(--su-color-border)
  );
  --su-alert-bg: color-mix(
    in srgb,
    var(--su-color-primary-soft) 70%,
    var(--su-color-bg-elevated)
  );

  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--su-space-md) var(--su-space-lg);
  border: 1px solid var(--su-alert-border-color);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-alert-bg);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-alert--success {
  --su-alert-color: var(--su-color-success-text);
  --su-alert-border-color: color-mix(
    in srgb,
    var(--su-color-success-hover) 28%,
    var(--su-color-border)
  );
  --su-alert-bg: color-mix(
    in srgb,
    var(--su-color-success-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-alert--warning {
  --su-alert-color: var(--su-color-warning-text);
  --su-alert-border-color: color-mix(
    in srgb,
    var(--su-color-warning-hover) 32%,
    var(--su-color-border)
  );
  --su-alert-bg: color-mix(
    in srgb,
    var(--su-color-warning-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-alert--error {
  --su-alert-color: var(--su-color-error-text);
  --su-alert-border-color: color-mix(
    in srgb,
    var(--su-color-error-hover) 32%,
    var(--su-color-border)
  );
  --su-alert-bg: color-mix(
    in srgb,
    var(--su-color-error-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-sm);
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-alert-color);
  font-size: var(--su-font-size-sm);
  font-weight: 700;
  line-height: 1;
}

.su-alert__content {
  flex: 1;
  min-width: 0;
}

.su-alert__title {
  color: var(--su-alert-color);
  font-weight: 600;
  word-break: break-word;
}

.su-alert__description {
  color: var(--su-color-text);
  word-break: break-word;
}

.su-alert.has-title .su-alert__description {
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
}

.su-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  margin: -2px -4px -2px var(--su-space-md);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-alert__close:hover {
  color: var(--su-alert-color);
  background: color-mix(in srgb, var(--su-alert-color) 10%, transparent);
}

.su-alert-enter-active,
.su-alert-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.su-alert-enter-from,
.su-alert-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
