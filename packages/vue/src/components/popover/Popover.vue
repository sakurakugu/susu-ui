<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuPopover',
})

type PopoverPlacement =
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
type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

const visibleModel = defineModel<boolean>('visible')

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    placement?: PopoverPlacement
    trigger?: PopoverTrigger
    disabled?: boolean
    showArrow?: boolean
    showDelay?: number
    hideDelay?: number
    offset?: number
    width?: string | number
    popperClass?: string
    zIndex?: number
  }>(),
  {
    title: undefined,
    content: undefined,
    placement: 'bottom',
    trigger: 'click',
    disabled: false,
    showArrow: true,
    showDelay: 0,
    hideDelay: 120,
    offset: 8,
    width: 280,
    popperClass: undefined,
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  show: []
  hide: []
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  content?: () => unknown
}>()

const triggerRef = ref<HTMLElement>()
const popperRef = ref<HTMLElement>()
const innerVisible = ref(false)
const popoverId = `su-popover-${useId()}`
const popperStyle = ref<CSSProperties>({})
let showTimer: ReturnType<typeof window.setTimeout> | undefined
let hideTimer: ReturnType<typeof window.setTimeout> | undefined

const isControlled = computed(() => visibleModel.value !== undefined)
const visible = computed(() =>
  props.disabled ? false : isControlled.value ? Boolean(visibleModel.value) : innerVisible.value,
)
const placementSide = computed(() => props.placement.split('-')[0])
const normalizedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

function clearShowTimer() {
  if (showTimer === undefined) {
    return
  }

  window.clearTimeout(showTimer)
  showTimer = undefined
}

function clearHideTimer() {
  if (hideTimer === undefined) {
    return
  }

  window.clearTimeout(hideTimer)
  hideTimer = undefined
}

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

function show() {
  if (props.disabled || props.trigger === 'manual') {
    return
  }

  clearHideTimer()
  clearShowTimer()
  showTimer = window.setTimeout(() => setVisible(true), props.showDelay)
}

function hide() {
  if (props.trigger === 'manual') {
    return
  }

  clearShowTimer()
  clearHideTimer()
  hideTimer = window.setTimeout(() => setVisible(false), props.hideDelay)
}

function toggle() {
  if (props.disabled || props.trigger !== 'click') {
    return
  }

  clearShowTimer()
  clearHideTimer()
  setVisible(!visible.value)
}

function handleMouseenter() {
  if (props.trigger === 'hover') {
    show()
  }
}

function handleMouseleave() {
  if (props.trigger === 'hover') {
    hide()
  }
}

function handleFocus() {
  if (props.trigger === 'focus') {
    show()
  }
}

function handleBlur() {
  if (props.trigger === 'focus') {
    hide()
  }
}

function handleClick() {
  toggle()
}

function handleDocumentClick(event: MouseEvent) {
  if (!visible.value || props.trigger !== 'click') {
    return
  }

  const target = event.target as Node
  if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) {
    return
  }

  setVisible(false)
}

function handleKeydown(event: KeyboardEvent) {
  if (!visible.value) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    setVisible(false)
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
    return clamp(triggerStart + triggerSize - popperSize, 4, viewportSize - popperSize - 4)
  }

  return clamp(triggerStart + triggerSize / 2 - popperSize / 2, 4, viewportSize - popperSize - 4)
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
    left = alignCrossAxis(triggerRect.left, triggerRect.width, popperRect.width, viewportWidth)
    top =
      side === 'top'
        ? triggerRect.top - popperRect.height - props.offset
        : triggerRect.bottom + props.offset
    top = clamp(top, 4, viewportHeight - popperRect.height - 4)
  } else {
    top = alignCrossAxis(triggerRect.top, triggerRect.height, popperRect.height, viewportHeight)
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
      setVisible(false)
    }
  },
)

onBeforeUnmount(() => {
  clearShowTimer()
  clearHideTimer()
  removeListeners()
})
</script>

<template>
  <span
    ref="triggerRef"
    class="su-popover"
    :class="{ 'is-disabled': disabled, 'is-open': visible }"
    :aria-controls="visible ? popoverId : undefined"
    :aria-expanded="visible"
    aria-haspopup="dialog"
    tabindex="0"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @focusin="handleFocus"
    @focusout="handleBlur"
    @click="handleClick"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="su-popover">
      <div
        v-if="visible"
        :id="popoverId"
        ref="popperRef"
        class="su-popover__popper"
        :class="[`su-popover__popper--${placementSide}`, popperClass, { 'has-arrow': showArrow }]"
        :style="popperStyle"
        role="dialog"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
      >
        <div v-if="$slots.title || title" class="su-popover__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="su-popover__content">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
        <span v-if="showArrow" class="su-popover__arrow" aria-hidden="true" />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-popover {
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
  outline: none;
}

.su-popover.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-popover__popper {
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

.su-popover__title {
  margin-bottom: var(--su-space-xs);
  color: var(--su-color-text);
  font-weight: 600;
}

.su-popover__content {
  color: var(--su-color-text-muted);
}

.su-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--su-color-border);
  background: inherit;
  transform: rotate(45deg);
}

.su-popover__popper--top .su-popover__arrow {
  bottom: -6px;
  left: 50%;
  margin-left: -5px;
  border-top: 0;
  border-left: 0;
}

.su-popover__popper--bottom .su-popover__arrow {
  top: -6px;
  left: 50%;
  margin-left: -5px;
  border-right: 0;
  border-bottom: 0;
}

.su-popover__popper--left .su-popover__arrow {
  top: 50%;
  right: -6px;
  margin-top: -5px;
  border-bottom: 0;
  border-left: 0;
}

.su-popover__popper--right .su-popover__arrow {
  top: 50%;
  left: -6px;
  margin-top: -5px;
  border-top: 0;
  border-right: 0;
}

.su-popover-enter-active,
.su-popover-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-popover-enter-from,
.su-popover-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
