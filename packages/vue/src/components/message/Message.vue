<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'SuMessage',
})

type MessageType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    type?: MessageType
    duration?: number
    showIcon?: boolean
  }>(),
  {
    type: 'info',
    duration: 3000,
    showIcon: true,
  },
)

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  default?: () => unknown
}>()

const visible = ref(true)
let timer: ReturnType<typeof window.setTimeout> | undefined

const iconText = computed(() => {
  const iconMap: Record<MessageType, string> = {
    info: 'i',
    success: '✓',
    warning: '!',
    error: '×',
  }

  return iconMap[props.type]
})

function clearTimer() {
  if (timer === undefined) {
    return
  }

  window.clearTimeout(timer)
  timer = undefined
}

function close() {
  if (!visible.value) {
    return
  }

  visible.value = false
  emit('close')
}

function startTimer() {
  clearTimer()

  if (props.duration <= 0) {
    return
  }

  timer = window.setTimeout(close, props.duration)
}

watch(() => props.duration, startTimer, {
  immediate: true,
})

onBeforeUnmount(clearTimer)
</script>

<template>
  <Transition name="su-message">
    <div
      v-if="visible"
      class="su-message"
      :class="`su-message--${type}`"
      role="status"
      aria-live="polite"
    >
      <span v-if="showIcon" class="su-message__icon" aria-hidden="true">
        {{ iconText }}
      </span>
      <span class="su-message__content">
        <slot />
      </span>
    </div>
  </Transition>
</template>

<style>
.su-message {
  position: fixed;
  z-index: 2000;
  top: var(--su-space-xl);
  left: 50%;
  display: inline-flex;
  align-items: center;
  max-width: min(720px, calc(100vw - var(--su-space-xl) * 2));
  min-height: 40px;
  padding: var(--su-space-sm) var(--su-space-lg);
  border: 1px solid var(--su-message-border-color);
  border-radius: var(--su-radius-md);
  color: var(--su-message-text-color);
  background: var(--su-message-bg-color);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transform: translateX(-50%);
}

.su-message--info {
  --su-message-text-color: var(--su-color-primary);
  --su-message-border-color: color-mix(
    in srgb,
    var(--su-color-primary) 24%,
    var(--su-color-border)
  );
  --su-message-bg-color: color-mix(
    in srgb,
    var(--su-color-primary-soft) 70%,
    var(--su-color-bg-elevated)
  );
}

.su-message--success {
  --su-message-text-color: var(--su-color-success-text);
  --su-message-border-color: color-mix(
    in srgb,
    var(--su-color-success-hover) 28%,
    var(--su-color-border)
  );
  --su-message-bg-color: color-mix(
    in srgb,
    var(--su-color-success-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-message--warning {
  --su-message-text-color: var(--su-color-warning-text);
  --su-message-border-color: color-mix(
    in srgb,
    var(--su-color-warning-hover) 32%,
    var(--su-color-border)
  );
  --su-message-bg-color: color-mix(
    in srgb,
    var(--su-color-warning-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-message--error {
  --su-message-text-color: var(--su-color-error-text);
  --su-message-border-color: color-mix(
    in srgb,
    var(--su-color-error-hover) 32%,
    var(--su-color-border)
  );
  --su-message-bg-color: color-mix(
    in srgb,
    var(--su-color-error-soft) 72%,
    var(--su-color-bg-elevated)
  );
}

.su-message__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-right: var(--su-space-sm);
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-message-text-color);
  font-size: var(--su-font-size-sm);
  font-weight: 700;
  line-height: 1;
}

.su-message__content {
  min-width: 0;
  color: var(--su-color-text);
  word-break: break-word;
}

.su-message-enter-active,
.su-message-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.su-message-enter-from,
.su-message-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
