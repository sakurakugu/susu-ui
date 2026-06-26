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
  name: 'SuTooltip',
})

type TooltipPlacement =
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
type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

const visibleModel = defineModel<boolean>('visible')

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: TooltipPlacement
    trigger?: TooltipTrigger
    disabled?: boolean
    showArrow?: boolean
    showDelay?: number
    hideDelay?: number
    offset?: number
    popperClass?: string
    zIndex?: number
  }>(),
  {
    content: undefined,
    placement: 'top',
    trigger: 'hover',
    disabled: false,
    showArrow: true,
    showDelay: 0,
    hideDelay: 120,
    offset: 8,
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
  content?: () => unknown
}>()

const triggerRef = ref<HTMLElement>()
const popperRef = ref<HTMLElement>()
const innerVisible = ref(false)
const tooltipId = `su-tooltip-${useId()}`
const popperStyle = ref<CSSProperties>({})
let showTimer: ReturnType<typeof window.setTimeout> | undefined
let hideTimer: ReturnType<typeof window.setTimeout> | undefined

const isControlled = computed(() => visibleModel.value !== undefined)
const visible = computed(() =>
  props.disabled
    ? false
    : isControlled.value
      ? Boolean(visibleModel.value)
      : innerVisible.value,
)

const placementSide = computed(() => props.placement.split('-')[0])

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
    zIndex: props.zIndex,
  }
}

function addListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('click', handleDocumentClick)
}

function removeListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('click', handleDocumentClick)
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
  () => [props.placement, props.offset, props.zIndex],
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
    class="su-tooltip"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @focusin="handleFocus"
    @focusout="handleBlur"
    @click="handleClick"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="su-tooltip">
      <div
        v-if="visible"
        :id="tooltipId"
        ref="popperRef"
        class="su-tooltip__popper"
        :class="[
          `su-tooltip__popper--${placementSide}`,
          popperClass,
          { 'has-arrow': showArrow },
        ]"
        :style="popperStyle"
        role="tooltip"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <span v-if="showArrow" class="su-tooltip__arrow" aria-hidden="true" />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-tooltip {
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
}

.su-tooltip__popper {
  position: fixed;
  z-index: 2100;
  max-width: min(280px, calc(100vw - var(--su-space-xl) * 2));
  padding: 6px var(--su-space-sm);
  border-radius: var(--su-radius-sm);
  color: var(--su-color-bg-elevated);
  background: color-mix(in srgb, var(--su-color-text) 92%, #000);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
  overflow-wrap: break-word;
  pointer-events: auto;
}

.su-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}

.su-tooltip__popper--top .su-tooltip__arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.su-tooltip__popper--bottom .su-tooltip__arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.su-tooltip__popper--left .su-tooltip__arrow {
  top: 50%;
  right: -4px;
  margin-top: -4px;
}

.su-tooltip__popper--right .su-tooltip__arrow {
  top: 50%;
  left: -4px;
  margin-top: -4px;
}

.su-tooltip-enter-active,
.su-tooltip-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-tooltip-enter-from,
.su-tooltip-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
