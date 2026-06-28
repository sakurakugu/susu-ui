<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'SuResizable',
})

export type ResizableDirection = 'horizontal' | 'vertical' | 'both'
export type ResizableModelValue =
  | number
  | {
      width?: number
      height?: number
    }

const model = defineModel<ResizableModelValue>()

const props = withDefaults(
  defineProps<{
    direction?: ResizableDirection
    width?: number
    height?: number
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    disabled?: boolean
    step?: number
    ariaLabel?: string
  }>(),
  {
    direction: 'both',
    width: undefined,
    height: undefined,
    minWidth: 80,
    maxWidth: Number.POSITIVE_INFINITY,
    minHeight: 80,
    maxHeight: Number.POSITIVE_INFINITY,
    disabled: false,
    step: 1,
    ariaLabel: '调整尺寸',
  },
)

const emit = defineEmits<{
  resizeStart: [value: ResizableModelValue, event: PointerEvent]
  resize: [value: ResizableModelValue, event: PointerEvent | KeyboardEvent]
  resizeEnd: [value: ResizableModelValue, event: PointerEvent]
}>()

const rootRef = ref<HTMLElement>()
const widthValue = ref(0)
const heightValue = ref(0)
const dragging = ref(false)
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let pointerId: number | undefined

const canResizeWidth = computed(
  () => props.direction === 'horizontal' || props.direction === 'both',
)
const canResizeHeight = computed(() => props.direction === 'vertical' || props.direction === 'both')
const normalizedStep = computed(() => (props.step > 0 ? props.step : 1))

const currentValue = computed<ResizableModelValue>(() => {
  if (props.direction === 'horizontal') {
    return widthValue.value
  }

  if (props.direction === 'vertical') {
    return heightValue.value
  }

  return {
    width: widthValue.value,
    height: heightValue.value,
  }
})

const resizableStyle = computed(() => ({
  width: widthValue.value > 0 ? `${widthValue.value}px` : undefined,
  height: heightValue.value > 0 ? `${heightValue.value}px` : undefined,
}))

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function alignToStep(value: number) {
  return Math.round(value / normalizedStep.value) * normalizedStep.value
}

function normalizeWidth(value: number) {
  return clamp(alignToStep(value), props.minWidth, props.maxWidth)
}

function normalizeHeight(value: number) {
  return clamp(alignToStep(value), props.minHeight, props.maxHeight)
}

function readModelValue(value: ResizableModelValue | undefined) {
  if (typeof value === 'number') {
    if (props.direction === 'vertical') {
      heightValue.value = normalizeHeight(value)
      return
    }

    widthValue.value = normalizeWidth(value)
    return
  }

  if (value) {
    if (typeof value.width === 'number') {
      widthValue.value = normalizeWidth(value.width)
    }

    if (typeof value.height === 'number') {
      heightValue.value = normalizeHeight(value.height)
    }
  }
}

function ensureSize() {
  const rect = rootRef.value?.getBoundingClientRect()
  const propWidth = props.width
  const propHeight = props.height
  const fallbackWidth = typeof propWidth === 'number' ? propWidth : (rect?.width ?? props.minWidth)
  const fallbackHeight =
    typeof propHeight === 'number' ? propHeight : (rect?.height ?? props.minHeight)

  if (widthValue.value <= 0) {
    widthValue.value = normalizeWidth(fallbackWidth ?? 80)
  }

  if (heightValue.value <= 0) {
    heightValue.value = normalizeHeight(fallbackHeight ?? 80)
  }

  readModelValue(model.value)
}

function updateSize(nextWidth: number, nextHeight: number, event: PointerEvent | KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (canResizeWidth.value) {
    widthValue.value = normalizeWidth(nextWidth)
  }

  if (canResizeHeight.value) {
    heightValue.value = normalizeHeight(nextHeight)
  }

  model.value = currentValue.value
  emit('resize', currentValue.value, event)
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled) {
    return
  }

  ensureSize()
  dragging.value = true
  startX = event.clientX
  startY = event.clientY
  startWidth = widthValue.value
  startHeight = heightValue.value
  pointerId = event.pointerId
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  emit('resizeStart', currentValue.value, event)
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  updateSize(startWidth + event.clientX - startX, startHeight + event.clientY - startY, event)
}

function handlePointerUp(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(pointerId ?? 0)
  pointerId = undefined
  emit('resizeEnd', currentValue.value, event)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const step = event.shiftKey ? normalizedStep.value * 10 : normalizedStep.value
  const widthDelta = event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0
  const heightDelta = event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0

  if ((widthDelta !== 0 && canResizeWidth.value) || (heightDelta !== 0 && canResizeHeight.value)) {
    event.preventDefault()
    ensureSize()
    updateSize(widthValue.value + widthDelta, heightValue.value + heightDelta, event)
  }
}

watch(
  () => [
    model.value,
    props.width,
    props.height,
    props.minWidth,
    props.maxWidth,
    props.minHeight,
    props.maxHeight,
    props.direction,
  ],
  () => {
    if (typeof props.width === 'number') {
      widthValue.value = normalizeWidth(props.width)
    }

    if (typeof props.height === 'number') {
      heightValue.value = normalizeHeight(props.height)
    }

    readModelValue(model.value)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  dragging.value = false
})
</script>

<template>
  <div
    ref="rootRef"
    class="su-resizable"
    :class="[
      `su-resizable--${direction}`,
      {
        'is-disabled': disabled,
        'is-dragging': dragging,
      },
    ]"
    :style="resizableStyle"
  >
    <div class="su-resizable__content">
      <slot />
    </div>
    <button
      class="su-resizable__handle"
      type="button"
      :aria-label="ariaLabel"
      :disabled="disabled"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style>
.su-resizable {
  position: relative;
  display: inline-block;
  min-width: var(--su-resizable-min-width, 80px);
  min-height: var(--su-resizable-min-height, 80px);
  max-width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  vertical-align: top;
}

.su-resizable__content {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.su-resizable__handle {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-sm) 0 var(--su-radius-md) 0;
  background: linear-gradient(
    135deg,
    transparent 0 42%,
    var(--su-color-border) 42% 50%,
    transparent 50% 62%,
    var(--su-color-border) 62% 70%,
    transparent 70%
  );
  cursor: nwse-resize;
}

.su-resizable--horizontal .su-resizable__handle {
  top: 50%;
  bottom: auto;
  width: 14px;
  height: 36px;
  border-radius: var(--su-radius-sm) 0 0 var(--su-radius-sm);
  background:
    linear-gradient(var(--su-color-border), var(--su-color-border)) center 10px / 2px 14px no-repeat,
    linear-gradient(var(--su-color-border), var(--su-color-border)) center 18px / 2px 14px no-repeat;
  cursor: ew-resize;
  transform: translateY(-50%);
}

.su-resizable--vertical .su-resizable__handle {
  right: 50%;
  bottom: 0;
  width: 36px;
  height: 14px;
  border-radius: var(--su-radius-sm) var(--su-radius-sm) 0 0;
  background:
    linear-gradient(var(--su-color-border), var(--su-color-border)) 10px center / 14px 2px no-repeat,
    linear-gradient(var(--su-color-border), var(--su-color-border)) 18px center / 14px 2px no-repeat;
  cursor: ns-resize;
  transform: translateX(50%);
}

.su-resizable__handle:hover:not(:disabled),
.su-resizable__handle:focus-visible {
  outline: 0;
  background-color: color-mix(in srgb, var(--su-color-primary) 12%, transparent);
}

.su-resizable.is-dragging {
  user-select: none;
}

.su-resizable.is-disabled {
  opacity: 0.6;
}

.su-resizable.is-disabled .su-resizable__handle {
  cursor: not-allowed;
}
</style>
