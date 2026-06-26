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

defineOptions({
  name: 'SuDialog',
})

type DialogCloseReason = 'close' | 'cancel' | 'mask' | 'esc'

const visible = defineModel<boolean>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string | number
    top?: string
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
    width: '520px',
    top: '15vh',
    closeOnClickMask: true,
    closeOnPressEscape: true,
    showClose: true,
    showFooter: true,
    confirmText: '确定',
    cancelText: '取消',
    confirmLoading: false,
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  open: []
  opened: []
  close: [reason: DialogCloseReason]
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

const dialogRef = ref<HTMLElement>()
const titleId = `su-dialog-title-${useId()}`
let previousBodyOverflow = ''
let bodyScrollLocked = false

const dialogStyle = computed<CSSProperties>(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  marginTop: props.top,
}))

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

function requestClose(reason: DialogCloseReason) {
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
      dialogRef.value?.focus()
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
      name="su-dialog"
      @after-enter="emit('opened')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="visible"
        class="su-dialog-overlay"
        :style="overlayStyle"
        @click.self="handleMaskClick"
      >
        <section
          ref="dialogRef"
          class="su-dialog"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="
            title || $slots.title || $slots.header ? titleId : undefined
          "
          tabindex="-1"
        >
          <header
            v-if="title || $slots.title || $slots.header || showClose"
            class="su-dialog__header"
          >
            <slot name="header">
              <h2
                v-if="title || $slots.title"
                :id="titleId"
                class="su-dialog__title"
              >
                <slot name="title">{{ title }}</slot>
              </h2>
            </slot>
            <button
              v-if="showClose"
              class="su-dialog__close"
              type="button"
              aria-label="关闭弹窗"
              @click="handleCloseClick"
            >
              &times;
            </button>
          </header>

          <div class="su-dialog__body">
            <slot />
          </div>

          <footer v-if="showFooter || $slots.footer" class="su-dialog__footer">
            <slot name="footer">
              <button
                class="su-dialog__button su-dialog__button--default"
                type="button"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="su-dialog__button su-dialog__button--primary"
                type="button"
                :disabled="confirmLoading"
                :aria-busy="confirmLoading || undefined"
                @click="handleConfirm"
              >
                <span
                  v-if="confirmLoading"
                  class="su-dialog__loading"
                  aria-hidden="true"
                />
                {{ confirmText }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-dialog-overlay {
  position: fixed;
  z-index: 2200;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 var(--su-space-lg) var(--su-space-xl);
  background: rgb(15 23 42 / 45%);
  overflow: auto;
}

.su-dialog {
  max-width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  outline: none;
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
}

.su-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 56px;
  padding: var(--su-space-lg) var(--su-space-xl);
  border-bottom: 1px solid var(--su-color-border);
}

.su-dialog__title {
  margin: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-lg);
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
}

.su-dialog__close {
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

.su-dialog__close:hover {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-dialog__body {
  padding: var(--su-space-xl);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  word-break: break-word;
}

.su-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
  padding: var(--su-space-md) var(--su-space-xl) var(--su-space-lg);
  border-top: 1px solid var(--su-color-border);
}

.su-dialog__button {
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

.su-dialog__button:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
}

.su-dialog__button--primary {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-dialog__button--primary:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-dialog__button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-dialog__loading {
  width: 1em;
  height: 1em;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: var(--su-radius-round);
  animation: su-dialog-loading 0.72s linear infinite;
}

.su-dialog-enter-active,
.su-dialog-leave-active {
  transition: opacity 0.18s ease;
}

.su-dialog-enter-active .su-dialog,
.su-dialog-leave-active .su-dialog {
  transition: transform 0.18s ease;
}

.su-dialog-enter-from,
.su-dialog-leave-to {
  opacity: 0;
}

.su-dialog-enter-from .su-dialog,
.su-dialog-leave-to .su-dialog {
  transform: translateY(-12px) scale(0.98);
}

@keyframes su-dialog-loading {
  to {
    transform: rotate(360deg);
  }
}
</style>
