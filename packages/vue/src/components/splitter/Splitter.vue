<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'SuSplitter',
})

export type SplitterDirection = 'horizontal' | 'vertical'
export type SplitterSize = number | string

const model = defineModel<SplitterSize>()

const props = withDefaults(
  defineProps<{
    direction?: SplitterDirection
    defaultSize?: SplitterSize
    min?: number
    max?: number
    disabled?: boolean
    step?: number
    ariaLabel?: string
  }>(),
  {
    direction: 'horizontal',
    defaultSize: '50%',
    min: 80,
    max: Number.POSITIVE_INFINITY,
    disabled: false,
    step: 1,
    ariaLabel: '调整面板尺寸',
  },
)

const emit = defineEmits<{
  resizeStart: [size: number, event: PointerEvent]
  resize: [size: number, event: PointerEvent | KeyboardEvent]
  resizeEnd: [size: number, event: PointerEvent]
}>()

const rootRef = ref<HTMLElement>()
const firstSize = ref(0)
const dragging = ref(false)
let startPosition = 0
let startSize = 0
let pointerId: number | undefined

const isHorizontal = computed(() => props.direction === 'horizontal')
const normalizedStep = computed(() => (props.step > 0 ? props.step : 1))
const firstPaneStyle = computed(() => ({
  flexBasis: firstSize.value > 0 ? `${firstSize.value}px` : undefined,
}))

function clamp(value: number) {
  return Math.min(props.max, Math.max(props.min, value))
}

function alignToStep(value: number) {
  return Math.round(value / normalizedStep.value) * normalizedStep.value
}

function normalizeSize(value: number) {
  return clamp(alignToStep(value))
}

function getContainerSize() {
  const rect = rootRef.value?.getBoundingClientRect()

  return isHorizontal.value ? (rect?.width ?? 0) : (rect?.height ?? 0)
}

function parseSize(value: SplitterSize | undefined) {
  const source = value ?? props.defaultSize

  if (typeof source === 'number') {
    return source
  }

  if (source.endsWith('%')) {
    const percent = Number.parseFloat(source)
    const containerSize = getContainerSize()

    return containerSize > 0 ? (containerSize * percent) / 100 : props.min
  }

  if (source.endsWith('px')) {
    return Number.parseFloat(source)
  }

  const numericSize = Number.parseFloat(source)

  return Number.isFinite(numericSize) ? numericSize : props.min
}

function syncSize() {
  firstSize.value = normalizeSize(parseSize(model.value))
}

function updateSize(size: number, event: PointerEvent | KeyboardEvent) {
  if (props.disabled) {
    return
  }

  firstSize.value = normalizeSize(size)
  model.value = firstSize.value
  emit('resize', firstSize.value, event)
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled) {
    return
  }

  syncSize()
  dragging.value = true
  startPosition = isHorizontal.value ? event.clientX : event.clientY
  startSize = firstSize.value
  pointerId = event.pointerId
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  emit('resizeStart', firstSize.value, event)
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  const currentPosition = isHorizontal.value ? event.clientX : event.clientY
  updateSize(startSize + currentPosition - startPosition, event)
}

function handlePointerUp(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(pointerId ?? 0)
  pointerId = undefined
  emit('resizeEnd', firstSize.value, event)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const step = event.shiftKey ? normalizedStep.value * 10 : normalizedStep.value
  const delta =
    event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? step
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? -step
        : 0

  if (delta !== 0) {
    event.preventDefault()
    updateSize(firstSize.value + delta, event)
  }
}

watch(
  () => [
    model.value,
    props.defaultSize,
    props.direction,
    props.min,
    props.max,
    props.step,
  ],
  syncSize,
  { immediate: true },
)

onBeforeUnmount(() => {
  dragging.value = false
})
</script>

<template>
  <div
    ref="rootRef"
    class="su-splitter"
    :class="[
      `su-splitter--${direction}`,
      {
        'is-disabled': disabled,
        'is-dragging': dragging,
      },
    ]"
  >
    <div
      class="su-splitter__pane su-splitter__pane--first"
      :style="firstPaneStyle"
    >
      <slot name="first" />
    </div>
    <button
      class="su-splitter__bar"
      type="button"
      role="separator"
      :aria-label="ariaLabel"
      :aria-orientation="direction"
      :aria-valuenow="firstSize"
      :aria-valuemin="min"
      :aria-valuemax="Number.isFinite(max) ? max : undefined"
      :disabled="disabled"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @keydown="handleKeydown"
    >
      <span class="su-splitter__bar-grip" />
    </button>
    <div class="su-splitter__pane su-splitter__pane--second">
      <slot name="second" />
    </div>
  </div>
</template>

<style>
.su-splitter {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 160px;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
}

.su-splitter--vertical {
  flex-direction: column;
}

.su-splitter__pane {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.su-splitter--horizontal .su-splitter__pane--first {
  flex: 0 0 auto;
  min-width: 0;
}

.su-splitter--vertical .su-splitter__pane--first {
  flex: 0 0 auto;
  min-height: 0;
}

.su-splitter__pane--second {
  flex: 1 1 0;
}

.su-splitter__bar {
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  min-width: 10px;
  padding: 0;
  border: 0;
  border-inline: 1px solid var(--su-color-border);
  background: var(--su-color-bg-soft);
  cursor: col-resize;
}

.su-splitter--vertical .su-splitter__bar {
  width: auto;
  height: 10px;
  min-height: 10px;
  border-block: 1px solid var(--su-color-border);
  border-inline: 0;
  cursor: row-resize;
}

.su-splitter__bar:hover:not(:disabled),
.su-splitter__bar:focus-visible {
  outline: 0;
  background: color-mix(
    in srgb,
    var(--su-color-primary) 12%,
    var(--su-color-bg-soft)
  );
}

.su-splitter__bar-grip {
  width: 2px;
  height: 24px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-border);
  box-shadow:
    -3px 0 0 var(--su-color-border),
    3px 0 0 var(--su-color-border);
}

.su-splitter--vertical .su-splitter__bar-grip {
  width: 24px;
  height: 2px;
  box-shadow:
    0 -3px 0 var(--su-color-border),
    0 3px 0 var(--su-color-border);
}

.su-splitter.is-dragging {
  user-select: none;
}

.su-splitter.is-disabled {
  opacity: 0.6;
}

.su-splitter.is-disabled .su-splitter__bar {
  cursor: not-allowed;
}
</style>
