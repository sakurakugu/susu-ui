<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuNotification',
})

type NotificationType = 'info' | 'success' | 'warning' | 'error'
type NotificationPlacement =
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    type?: NotificationType
    title?: string
    description?: string
    duration?: number
    showIcon?: boolean
    closable?: boolean
    placement?: NotificationPlacement
    width?: string | number
    offset?: number
    zIndex?: number
  }>(),
  {
    type: 'info',
    title: undefined,
    description: undefined,
    duration: 4500,
    showIcon: true,
    closable: true,
    placement: 'top-right',
    width: 360,
    offset: 24,
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  icon?: () => unknown
}>()

const visible = ref(true)
let timer: ReturnType<typeof window.setTimeout> | undefined

const iconText = computed(() => {
  const iconMap: Record<NotificationType, string> = {
    info: 'i',
    success: '✓',
    warning: '!',
    error: '×',
  }

  return iconMap[props.type]
})

const notificationRole = computed(() =>
  props.type === 'error' ? 'alert' : 'status',
)

const ariaLive = computed(() =>
  props.type === 'error' ? 'assertive' : 'polite',
)

const notificationStyle = computed<CSSProperties>(() => {
  const horizontalProperty = props.placement.endsWith('right')
    ? 'right'
    : 'left'
  const verticalProperty = props.placement.startsWith('top') ? 'top' : 'bottom'

  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    maxWidth: `calc(100vw - ${props.offset * 2}px)`,
    zIndex: props.zIndex,
    [horizontalProperty]: `${props.offset}px`,
    [verticalProperty]: `${props.offset}px`,
  }
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
  <Teleport to="body">
    <Transition name="su-notification">
      <section
        v-if="visible"
        class="su-notification"
        :class="[`su-notification--${type}`, `su-notification--${placement}`]"
        :style="notificationStyle"
        :role="notificationRole"
        :aria-live="ariaLive"
      >
        <span v-if="showIcon" class="su-notification__icon" aria-hidden="true">
          <slot name="icon">
            {{ iconText }}
          </slot>
        </span>
        <div class="su-notification__content">
          <h3 v-if="title || $slots.title" class="su-notification__title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <div
            v-if="description || $slots.default"
            class="su-notification__description"
          >
            <slot>{{ description }}</slot>
          </div>
        </div>
        <button
          v-if="closable"
          class="su-notification__close"
          type="button"
          aria-label="关闭通知"
          @click="close"
        >
          &times;
        </button>
      </section>
    </Transition>
  </Teleport>
</template>

<style>
.su-notification {
  --su-notification-color: var(--su-color-primary);
  --su-notification-border-color: color-mix(
    in srgb,
    var(--su-color-primary) 18%,
    var(--su-color-border)
  );
  --su-notification-bg: var(--su-color-bg-elevated);

  position: fixed;
  z-index: 2100;
  display: flex;
  align-items: flex-start;
  min-height: 72px;
  padding: var(--su-space-lg);
  border: 1px solid var(--su-notification-border-color);
  border-radius: var(--su-radius-lg);
  color: var(--su-color-text);
  background: var(--su-notification-bg);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-notification--success {
  --su-notification-color: #15803d;
  --su-notification-border-color: color-mix(
    in srgb,
    #22c55e 24%,
    var(--su-color-border)
  );
}

.su-notification--warning {
  --su-notification-color: #b45309;
  --su-notification-border-color: color-mix(
    in srgb,
    #f59e0b 28%,
    var(--su-color-border)
  );
}

.su-notification--error {
  --su-notification-color: #b91c1c;
  --su-notification-border-color: color-mix(
    in srgb,
    #ef4444 28%,
    var(--su-color-border)
  );
}

.su-notification__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 22px;
  height: 22px;
  margin-right: var(--su-space-md);
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-notification-color);
  font-size: var(--su-font-size-sm);
  font-weight: 700;
  line-height: 1;
}

.su-notification__content {
  flex: 1;
  min-width: 0;
}

.su-notification__title {
  margin: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
}

.su-notification__description {
  color: var(--su-color-text-muted);
  word-break: break-word;
}

.su-notification__title + .su-notification__description {
  margin-top: var(--su-space-xs);
}

.su-notification__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  margin: -4px -6px -4px var(--su-space-md);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-notification__close:hover {
  color: var(--su-notification-color);
  background: color-mix(in srgb, var(--su-notification-color) 10%, transparent);
}

.su-notification-enter-active,
.su-notification-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.su-notification-enter-from,
.su-notification-leave-to {
  opacity: 0;
}

.su-notification--top-right.su-notification-enter-from,
.su-notification--top-right.su-notification-leave-to,
.su-notification--bottom-right.su-notification-enter-from,
.su-notification--bottom-right.su-notification-leave-to {
  transform: translateX(16px);
}

.su-notification--top-left.su-notification-enter-from,
.su-notification--top-left.su-notification-leave-to,
.su-notification--bottom-left.su-notification-enter-from,
.su-notification--bottom-left.su-notification-leave-to {
  transform: translateX(-16px);
}
</style>
