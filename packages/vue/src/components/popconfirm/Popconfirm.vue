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
import { SuButton } from '../button'

defineOptions({
  name: 'SuPopconfirm',
})

export type PopconfirmPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type PopconfirmButtonType = 'default' | 'primary'
export type PopconfirmButtonVariant = 'solid' | 'outline' | 'ghost' | 'text'

const visibleModel = defineModel<boolean>('visible')

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    placement?: PopconfirmPlacement
    disabled?: boolean
    showArrow?: boolean
    offset?: number
    width?: string | number
    popperClass?: string
    zIndex?: number
    confirmText?: string
    cancelText?: string
    confirmType?: PopconfirmButtonType
    confirmVariant?: PopconfirmButtonVariant
    cancelType?: PopconfirmButtonType
    cancelVariant?: PopconfirmButtonVariant
    confirmLoading?: boolean
    hideAfterConfirm?: boolean
    hideAfterCancel?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    placement: 'top',
    disabled: false,
    showArrow: true,
    offset: 8,
    width: 280,
    popperClass: undefined,
    zIndex: undefined,
    confirmText: '确定',
    cancelText: '取消',
    confirmType: 'primary',
    confirmVariant: 'solid',
    cancelType: 'default',
    cancelVariant: 'text',
    confirmLoading: false,
    hideAfterConfirm: true,
    hideAfterCancel: true,
  },
)

const emit = defineEmits<{
  show: []
  hide: []
  confirm: []
  cancel: []
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  description?: () => unknown
  icon?: () => unknown
  actions?: () => unknown
}>()

const triggerRef = ref<HTMLElement>()
const popperRef = ref<HTMLElement>()
const innerVisible = ref(false)
const popconfirmId = `su-popconfirm-${useId()}`
const popperStyle = ref<CSSProperties>({})

const isControlled = computed(() => visibleModel.value !== undefined)
const visible = computed(() =>
  props.disabled
    ? false
    : isControlled.value
      ? Boolean(visibleModel.value)
      : innerVisible.value,
)
const placementSide = computed(() => props.placement.split('-')[0])
const normalizedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

function setVisible(value: boolean) {
  if (props.disabled) {
    value = false
  }

  if (visible.value === value) {
    return
  }

  if (isControlled.value) {
    visibleModel.value = value
  } else {
    innerVisible.value = value
  }

  if (value) {
    emit('show')
  } else {
    emit('hide')
  }
}

function toggle() {
  if (props.disabled) {
    return
  }

  setVisible(!visible.value)
}

function close() {
  setVisible(false)
}

function handleConfirm() {
  emit('confirm')

  if (props.hideAfterConfirm) {
    close()
  }
}

function handleCancel() {
  emit('cancel')

  if (props.hideAfterCancel) {
    close()
  }
}

function handleDocumentClick(event: MouseEvent) {
  if (!visible.value) {
    return
  }

  const target = event.target as Node
  if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) {
    return
  }

  close()
}

function handleKeydown(event: KeyboardEvent) {
  if (!visible.value) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    triggerRef.value?.focus()
  }
}

function alignCrossAxis(
  triggerStart: number,
  triggerSize: number,
  popperSize: number,
  viewportSize: number,
) {
  const [, align] = props.placement.split('-')

  if (align === 'start') {
    return clamp(triggerStart, 4, viewportSize - popperSize - 4)
  }

  if (align === 'end') {
    return clamp(
      triggerStart + triggerSize - popperSize,
      4,
      viewportSize - popperSize - 4,
    )
  }

  return clamp(
    triggerStart + triggerSize / 2 - popperSize / 2,
    4,
    viewportSize - popperSize - 4,
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function updatePosition() {
  const trigger = triggerRef.value
  const popper = popperRef.value

  if (!trigger || !popper || !visible.value) {
    return
  }

  const triggerRect = trigger.getBoundingClientRect()
  const popperRect = popper.getBoundingClientRect()
  const side = placementSide.value
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let top: number
  let left: number

  if (side === 'top' || side === 'bottom') {
    left = alignCrossAxis(
      triggerRect.left,
      triggerRect.width,
      popperRect.width,
      viewportWidth,
    )
    top =
      side === 'top'
        ? triggerRect.top - popperRect.height - props.offset
        : triggerRect.bottom + props.offset
    top = clamp(top, 4, viewportHeight - popperRect.height - 4)
  } else {
    top = alignCrossAxis(
      triggerRect.top,
      triggerRect.height,
      popperRect.height,
      viewportHeight,
    )
    left =
      side === 'left'
        ? triggerRect.left - popperRect.width - props.offset
        : triggerRect.right + props.offset
    left = clamp(left, 4, viewportWidth - popperRect.width - 4)
  }

  popperStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: normalizedWidth.value,
    zIndex: props.zIndex,
  }
}

function addListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
}

function removeListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
}

watch(
  visible,
  async (value) => {
    removeListeners()

    if (value) {
      await nextTick()
      updatePosition()
      addListeners()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => [props.placement, props.offset, props.zIndex, props.width],
  () => {
    if (visible.value) {
      void nextTick(updatePosition)
    }
  },
)

watch(
  () => props.disabled,
  (value) => {
    if (value && visible.value) {
      close()
    }
  },
)

onBeforeUnmount(() => {
  removeListeners()
})
</script>

<template>
  <span
    ref="triggerRef"
    class="su-popconfirm"
    :class="{ 'is-disabled': disabled, 'is-open': visible }"
    :aria-controls="visible ? popconfirmId : undefined"
    :aria-expanded="visible"
    aria-haspopup="dialog"
    tabindex="0"
    @click="toggle"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="su-popconfirm">
      <div
        v-if="visible"
        :id="popconfirmId"
        ref="popperRef"
        class="su-popconfirm__popper"
        :class="[
          `su-popconfirm__popper--${placementSide}`,
          popperClass,
          { 'has-arrow': showArrow },
        ]"
        :style="popperStyle"
        role="dialog"
      >
        <div class="su-popconfirm__body">
          <span class="su-popconfirm__icon" aria-hidden="true">
            <slot name="icon">!</slot>
          </span>
          <div class="su-popconfirm__text">
            <div v-if="$slots.title || title" class="su-popconfirm__title">
              <slot name="title">{{ title }}</slot>
            </div>
            <div
              v-if="$slots.description || description"
              class="su-popconfirm__description"
            >
              <slot name="description">{{ description }}</slot>
            </div>
          </div>
        </div>
        <div class="su-popconfirm__actions">
          <slot name="actions">
            <SuButton
              size="small"
              :type="cancelType"
              :variant="cancelVariant"
              @click="handleCancel"
            >
              {{ cancelText }}
            </SuButton>
            <SuButton
              size="small"
              :type="confirmType"
              :variant="confirmVariant"
              :loading="confirmLoading"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </SuButton>
          </slot>
        </div>
        <span
          v-if="showArrow"
          class="su-popconfirm__arrow"
          aria-hidden="true"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-popconfirm {
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
  outline: none;
}

.su-popconfirm.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-popconfirm__popper {
  position: fixed;
  z-index: 2100;
  max-width: min(360px, calc(100vw - var(--su-space-xl) * 2));
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow-wrap: break-word;
  pointer-events: auto;
}

.su-popconfirm__body {
  display: flex;
  align-items: flex-start;
  gap: var(--su-space-sm);
}

.su-popconfirm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-color-warning);
  font-size: var(--su-font-size-sm);
  font-weight: 700;
  line-height: 1;
}

.su-popconfirm__text {
  min-width: 0;
}

.su-popconfirm__title {
  color: var(--su-color-text);
  font-weight: 600;
}

.su-popconfirm__description {
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--su-space-xs);
  margin-top: var(--su-space-md);
}

.su-popconfirm__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--su-color-border);
  background: inherit;
  transform: rotate(45deg);
}

.su-popconfirm__popper--top .su-popconfirm__arrow {
  bottom: -6px;
  left: 50%;
  margin-left: -5px;
  border-top: 0;
  border-left: 0;
}

.su-popconfirm__popper--bottom .su-popconfirm__arrow {
  top: -6px;
  left: 50%;
  margin-left: -5px;
  border-right: 0;
  border-bottom: 0;
}

.su-popconfirm__popper--left .su-popconfirm__arrow {
  top: 50%;
  right: -6px;
  margin-top: -5px;
  border-bottom: 0;
  border-left: 0;
}

.su-popconfirm__popper--right .su-popconfirm__arrow {
  top: 50%;
  left: -6px;
  margin-top: -5px;
  border-top: 0;
  border-right: 0;
}

.su-popconfirm-enter-active,
.su-popconfirm-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-popconfirm-enter-from,
.su-popconfirm-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
