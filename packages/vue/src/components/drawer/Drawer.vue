<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import { useLocale } from '../../config-provider'

defineOptions({
  name: 'SuDrawer',
})

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'
type DrawerCloseReason = 'close' | 'cancel' | 'mask' | 'esc'

const visible = defineModel<boolean>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: DrawerPlacement
    size?: string | number
    closeOnClickMask?: boolean
    closeOnPressEscape?: boolean
    showClose?: boolean
    showFooter?: boolean
    confirmText?: string
    cancelText?: string
    confirmLoading?: boolean
    zIndex?: number
  }>(),
  {
    title: undefined,
    placement: 'right',
    size: '420px',
    closeOnClickMask: true,
    closeOnPressEscape: true,
    showClose: true,
    showFooter: true,
    confirmText: undefined,
    cancelText: undefined,
    confirmLoading: false,
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  open: []
  opened: []
  close: [reason: DrawerCloseReason]
  closed: []
  cancel: []
  confirm: []
}>()

defineSlots<{
  default?: () => unknown
  header?: () => unknown
  title?: () => unknown
  footer?: () => unknown
}>()

const drawerRef = ref<HTMLElement>()
const locale = useLocale()
const titleId = `su-drawer-title-${useId()}`
let previousBodyOverflow = ''
let bodyScrollLocked = false

const mergedConfirmText = computed(
  () => props.confirmText ?? locale.value.common.confirm,
)
const mergedCancelText = computed(
  () => props.cancelText ?? locale.value.common.cancel,
)

const isHorizontal = computed(
  () => props.placement === 'left' || props.placement === 'right',
)

const drawerSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)

const drawerStyle = computed<CSSProperties>(() =>
  isHorizontal.value
    ? { width: drawerSize.value }
    : { height: drawerSize.value },
)

const overlayStyle = computed<CSSProperties>(() => ({
  zIndex: props.zIndex,
}))

function lockBodyScroll() {
  if (bodyScrollLocked) {
    return
  }

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  bodyScrollLocked = true
}

function unlockBodyScroll() {
  if (!bodyScrollLocked) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  bodyScrollLocked = false
}

function requestClose(reason: DrawerCloseReason) {
  if (!visible.value) {
    return
  }

  emit('close', reason)
  visible.value = false
}

function handleMaskClick() {
  if (props.closeOnClickMask) {
    requestClose('mask')
  }
}

function handleCloseClick() {
  requestClose('close')
}

function handleCancel() {
  emit('cancel')
  requestClose('cancel')
}

function handleConfirm() {
  emit('confirm')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !visible.value || !props.closeOnPressEscape) {
    return
  }

  event.preventDefault()
  requestClose('esc')
}

watch(
  visible,
  async (value) => {
    if (value) {
      emit('open')
      lockBodyScroll()
      document.addEventListener('keydown', handleKeydown)
      await nextTick()
      drawerRef.value?.focus()
      return
    }

    document.removeEventListener('keydown', handleKeydown)
    unlockBodyScroll()
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (visible.value) {
    unlockBodyScroll()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      :name="`su-drawer-${placement}`"
      @after-enter="emit('opened')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="visible"
        class="su-drawer-overlay"
        :class="`su-drawer-overlay--${placement}`"
        :style="overlayStyle"
        @click.self="handleMaskClick"
      >
        <section
          ref="drawerRef"
          class="su-drawer"
          :class="`su-drawer--${placement}`"
          :style="drawerStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="
            title || $slots.title || $slots.header ? titleId : undefined
          "
          tabindex="-1"
        >
          <header
            v-if="title || $slots.title || $slots.header || showClose"
            class="su-drawer__header"
          >
            <slot name="header">
              <h2
                v-if="title || $slots.title"
                :id="titleId"
                class="su-drawer__title"
              >
                <slot name="title">{{ title }}</slot>
              </h2>
            </slot>
            <button
              v-if="showClose"
              class="su-drawer__close"
              type="button"
              :aria-label="locale.drawer.close"
              @click="handleCloseClick"
            >
              &times;
            </button>
          </header>

          <div class="su-drawer__body">
            <slot />
          </div>

          <footer v-if="showFooter || $slots.footer" class="su-drawer__footer">
            <slot name="footer">
              <button
                class="su-drawer__button su-drawer__button--default"
                type="button"
                @click="handleCancel"
              >
                {{ mergedCancelText }}
              </button>
              <button
                class="su-drawer__button su-drawer__button--primary"
                type="button"
                :disabled="confirmLoading"
                :aria-busy="confirmLoading || undefined"
                @click="handleConfirm"
              >
                <span
                  v-if="confirmLoading"
                  class="su-drawer__loading"
                  aria-hidden="true"
                />
                {{ mergedConfirmText }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-drawer-overlay {
  position: fixed;
  z-index: 2200;
  inset: 0;
  display: flex;
  background: rgb(15 23 42 / 45%);
}

.su-drawer-overlay--left {
  justify-content: flex-start;
}

.su-drawer-overlay--right {
  justify-content: flex-end;
}

.su-drawer-overlay--top {
  align-items: flex-start;
}

.su-drawer-overlay--bottom {
  align-items: flex-end;
}

.su-drawer {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  outline: none;
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
}

.su-drawer--left,
.su-drawer--right {
  height: 100%;
}

.su-drawer--top,
.su-drawer--bottom {
  width: 100%;
}

.su-drawer--left {
  border-right: 1px solid var(--su-color-border);
}

.su-drawer--right {
  border-left: 1px solid var(--su-color-border);
}

.su-drawer--top {
  border-bottom: 1px solid var(--su-color-border);
}

.su-drawer--bottom {
  border-top: 1px solid var(--su-color-border);
}

.su-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 56px;
  padding: var(--su-space-lg) var(--su-space-xl);
  border-bottom: 1px solid var(--su-color-border);
}

.su-drawer__title {
  margin: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-lg);
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
}

.su-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  margin: -4px -6px -4px 0;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-drawer__close:hover {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-drawer__body {
  flex: 1;
  min-height: 0;
  padding: var(--su-space-xl);
  overflow: auto;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  word-break: break-word;
}

.su-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
  padding: var(--su-space-md) var(--su-space-xl) var(--su-space-lg);
  border-top: 1px solid var(--su-color-border);
}

.su-drawer__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-xs);
  height: 32px;
  padding: 0 var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  color: var(--su-color-text);
  font: inherit;
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.su-drawer__button:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
}

.su-drawer__button--primary {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-drawer__button--primary:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-drawer__button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-drawer__loading {
  width: 1em;
  height: 1em;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: var(--su-radius-round);
  animation: su-drawer-loading 0.72s linear infinite;
}

.su-drawer-left-enter-active,
.su-drawer-left-leave-active,
.su-drawer-right-enter-active,
.su-drawer-right-leave-active,
.su-drawer-top-enter-active,
.su-drawer-top-leave-active,
.su-drawer-bottom-enter-active,
.su-drawer-bottom-leave-active {
  transition: opacity 0.18s ease;
}

.su-drawer-left-enter-active .su-drawer,
.su-drawer-left-leave-active .su-drawer,
.su-drawer-right-enter-active .su-drawer,
.su-drawer-right-leave-active .su-drawer,
.su-drawer-top-enter-active .su-drawer,
.su-drawer-top-leave-active .su-drawer,
.su-drawer-bottom-enter-active .su-drawer,
.su-drawer-bottom-leave-active .su-drawer {
  transition: transform 0.18s ease;
}

.su-drawer-left-enter-from,
.su-drawer-left-leave-to,
.su-drawer-right-enter-from,
.su-drawer-right-leave-to,
.su-drawer-top-enter-from,
.su-drawer-top-leave-to,
.su-drawer-bottom-enter-from,
.su-drawer-bottom-leave-to {
  opacity: 0;
}

.su-drawer-left-enter-from .su-drawer,
.su-drawer-left-leave-to .su-drawer {
  transform: translateX(-100%);
}

.su-drawer-right-enter-from .su-drawer,
.su-drawer-right-leave-to .su-drawer {
  transform: translateX(100%);
}

.su-drawer-top-enter-from .su-drawer,
.su-drawer-top-leave-to .su-drawer {
  transform: translateY(-100%);
}

.su-drawer-bottom-enter-from .su-drawer,
.su-drawer-bottom-leave-to .su-drawer {
  transform: translateY(100%);
}

@keyframes su-drawer-loading {
  to {
    transform: rotate(360deg);
  }
}
</style>
