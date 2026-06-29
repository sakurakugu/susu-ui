<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuMessage',
})

export type MessageType = 'info' | 'success' | 'warning' | 'error'
export type MessagePlacement =
  'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right'

const props = withDefaults(
  defineProps<{
    type?: MessageType
    duration?: number
    showIcon?: boolean
    closable?: boolean
    placement?: MessagePlacement
    offset?: number
    zIndex?: number
  }>(),
  {
    type: 'info',
    duration: 3000,
    showIcon: true,
    closable: true,
    placement: 'top',
    offset: 24,
    zIndex: undefined,
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

const messageRole = computed(() => (props.type === 'error' ? 'alert' : 'status'))

const ariaLive = computed(() => (props.type === 'error' ? 'assertive' : 'polite'))

const messageStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    zIndex: props.zIndex,
  }

  if (props.placement.startsWith('top')) {
    style.top = `${props.offset}px`
  } else {
    style.bottom = `${props.offset}px`
  }

  if (props.placement.endsWith('left')) {
    style.left = `${props.offset}px`
  } else if (props.placement.endsWith('right')) {
    style.right = `${props.offset}px`
  } else {
    style.left = '50%'
  }

  return style
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

defineExpose({
  close,
})
</script>

<template>
  <Transition name="su-message">
    <div
      v-if="visible"
      class="su-message"
      :class="[`su-message--${type}`, `su-message--${placement}`]"
      :style="messageStyle"
      :role="messageRole"
      :aria-live="ariaLive"
    >
      <span v-if="showIcon" class="su-message__icon" aria-hidden="true">
        {{ iconText }}
      </span>
      <span class="su-message__content">
        <slot />
      </span>
      <button
        v-if="closable"
        class="su-message__close"
        type="button"
        aria-label="关闭消息"
        @click="close"
      >
        &times;
      </button>
    </div>
  </Transition>
</template>

<style>
.su-message {
  position: fixed;
  z-index: 2000;
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
}

.su-message--top,
.su-message--bottom {
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

.su-message__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin: -2px -6px -2px var(--su-space-md);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-message__close:hover {
  color: var(--su-message-text-color);
  background: color-mix(in srgb, var(--su-message-text-color) 10%, transparent);
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
}

.su-message--top.su-message-enter-from,
.su-message--top.su-message-leave-to {
  transform: translate(-50%, -8px);
}

.su-message--bottom.su-message-enter-from,
.su-message--bottom.su-message-leave-to {
  transform: translate(-50%, 8px);
}

.su-message--top-left.su-message-enter-from,
.su-message--top-left.su-message-leave-to,
.su-message--top-right.su-message-enter-from,
.su-message--top-right.su-message-leave-to {
  transform: translateY(-8px);
}

.su-message--bottom-left.su-message-enter-from,
.su-message--bottom-left.su-message-leave-to,
.su-message--bottom-right.su-message-enter-from,
.su-message--bottom-right.su-message-leave-to {
  transform: translateY(8px);
}
</style>
