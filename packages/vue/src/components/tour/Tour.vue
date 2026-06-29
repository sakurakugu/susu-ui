<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch, type CSSProperties } from 'vue'
import { lockBodyScroll } from '../../utils/scroll-lock'

defineOptions({
  name: 'SuTour',
})

export type TourPlacement =
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
export type TourTarget =
  string | HTMLElement | null | undefined | (() => HTMLElement | null | undefined)
export type TourScrollIntoViewOptions = Parameters<HTMLElement['scrollIntoView']>[0]
export type TourCloseReason = 'close' | 'finish' | 'mask' | 'esc'

export interface TourStep {
  title?: string
  description?: string
  target?: TourTarget
  placement?: TourPlacement
  nextText?: string
  prevText?: string
  finishText?: string
  closeOnClickMask?: boolean
}

const visible = defineModel<boolean>({
  default: false,
})

const current = defineModel<number>('current', {
  default: 0,
})

const props = withDefaults(
  defineProps<{
    steps?: TourStep[]
    placement?: TourPlacement
    offset?: number
    padding?: number
    width?: string | number
    showMask?: boolean
    showArrow?: boolean
    showClose?: boolean
    closeOnClickMask?: boolean
    closeOnPressEscape?: boolean
    scrollIntoView?: boolean | TourScrollIntoViewOptions
    zIndex?: number
    nextText?: string
    prevText?: string
    finishText?: string
  }>(),
  {
    steps: () => [],
    placement: 'bottom',
    offset: 12,
    padding: 8,
    width: 320,
    showMask: true,
    showArrow: true,
    showClose: true,
    closeOnClickMask: true,
    closeOnPressEscape: true,
    scrollIntoView: true,
    zIndex: undefined,
    nextText: '下一步',
    prevText: '上一步',
    finishText: '完成',
  },
)

const emit = defineEmits<{
  change: [current: number, step: TourStep | undefined]
  close: [reason: TourCloseReason]
  finish: []
}>()

defineSlots<{
  title?: (props: { step: TourStep; current: number }) => unknown
  description?: (props: { step: TourStep; current: number }) => unknown
  footer?: (props: {
    step: TourStep
    current: number
    total: number
    isFirst: boolean
    isLast: boolean
    prev: () => void
    next: () => void
    finish: () => void
    close: () => void
  }) => unknown
}>()

const tourRef = ref<HTMLElement>()
const activeTarget = ref<HTMLElement>()
const targetRect = ref<DOMRect>()
const panelStyle = ref<CSSProperties>({})
const tourId = `su-tour-${useId()}`
let releaseBodyScrollLock: (() => void) | undefined

const total = computed(() => props.steps.length)
const activeIndex = computed(() => clamp(current.value, 0, total.value - 1))
const activeStep = computed(() => props.steps[activeIndex.value])
const isActive = computed(() => visible.value && total.value > 0)
const isFirst = computed(() => activeIndex.value <= 0)
const isLast = computed(() => activeIndex.value >= total.value - 1)
const activePlacement = computed(() => activeStep.value?.placement ?? props.placement)
const placementSide = computed(() => activePlacement.value.split('-')[0])
const normalizedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)
const overlayStyle = computed<CSSProperties>(() => ({
  zIndex: props.zIndex,
}))
const highlightStyle = computed<CSSProperties>(() => {
  if (!targetRect.value) {
    return { display: 'none' }
  }

  return {
    top: `${targetRect.value.top - props.padding}px`,
    left: `${targetRect.value.left - props.padding}px`,
    width: `${targetRect.value.width + props.padding * 2}px`,
    height: `${targetRect.value.height + props.padding * 2}px`,
  }
})
const displayCurrent = computed(() => activeIndex.value + 1)

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function resolveTarget(target: TourTarget) {
  if (!target) {
    return undefined
  }

  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target) ?? undefined
  }

  if (typeof target === 'function') {
    return target() ?? undefined
  }

  return target
}

function unlockBodyScroll() {
  releaseBodyScrollLock?.()
  releaseBodyScrollLock = undefined
}

function scrollTargetIntoView(target: HTMLElement) {
  if (!props.scrollIntoView) {
    return
  }

  if (props.scrollIntoView === true) {
    target.scrollIntoView({
      block: 'center',
      inline: 'center',
    })
    return
  }

  target.scrollIntoView(props.scrollIntoView)
}

function alignCrossAxis(
  targetStart: number,
  targetSize: number,
  panelSize: number,
  viewportSize: number,
) {
  const [, align] = activePlacement.value.split('-')

  if (align === 'start') {
    return clamp(targetStart, 8, viewportSize - panelSize - 8)
  }

  if (align === 'end') {
    return clamp(targetStart + targetSize - panelSize, 8, viewportSize - panelSize - 8)
  }

  return clamp(targetStart + targetSize / 2 - panelSize / 2, 8, viewportSize - panelSize - 8)
}

function getFallbackRect() {
  const width = Math.min(window.innerWidth * 0.8, 320)
  const height = 1
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2

  return {
    width,
    height,
    top,
    right: left + width,
    bottom: top + height,
    left,
    x: left,
    y: top,
    toJSON: () => '',
  } as DOMRect
}

function updatePosition() {
  if (!isActive.value) {
    return
  }

  const step = activeStep.value
  const target = resolveTarget(step?.target)
  const panel = tourRef.value

  activeTarget.value = target
  targetRect.value = target?.getBoundingClientRect() ?? getFallbackRect()

  if (!panel || !targetRect.value) {
    return
  }

  const rect = targetRect.value
  const panelRect = panel.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const side = placementSide.value
  let top: number
  let left: number

  if (side === 'top' || side === 'bottom') {
    left = alignCrossAxis(rect.left, rect.width, panelRect.width, viewportWidth)
    top = side === 'top' ? rect.top - panelRect.height - props.offset : rect.bottom + props.offset
    top = clamp(top, 8, viewportHeight - panelRect.height - 8)
  } else {
    top = alignCrossAxis(rect.top, rect.height, panelRect.height, viewportHeight)
    left = side === 'left' ? rect.left - panelRect.width - props.offset : rect.right + props.offset
    left = clamp(left, 8, viewportWidth - panelRect.width - 8)
  }

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: normalizedWidth.value,
  }
}

async function prepareStep() {
  const step = activeStep.value
  const target = resolveTarget(step?.target)

  if (target) {
    scrollTargetIntoView(target)
  }

  await nextTick()
  updatePosition()
  await nextTick()
  updatePosition()
  tourRef.value?.focus()
}

function addListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('keydown', handleKeydown)
}

function removeListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('keydown', handleKeydown)
}

function setCurrent(value: number) {
  const nextCurrent = clamp(value, 0, total.value - 1)

  if (current.value === nextCurrent) {
    return
  }

  current.value = nextCurrent
  emit('change', nextCurrent, props.steps[nextCurrent])
}

function requestClose(reason: TourCloseReason) {
  if (!visible.value) {
    return
  }

  emit('close', reason)
  visible.value = false
}

function handlePrev() {
  if (!isFirst.value) {
    setCurrent(activeIndex.value - 1)
  }
}

function handleNext() {
  if (isLast.value) {
    handleFinish()
    return
  }

  setCurrent(activeIndex.value + 1)
}

function handleFinish() {
  emit('finish')
  requestClose('finish')
}

function handleClose() {
  requestClose('close')
}

function handleMaskClick() {
  if (activeStep.value?.closeOnClickMask ?? props.closeOnClickMask) {
    requestClose('mask')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!visible.value || event.key !== 'Escape' || !props.closeOnPressEscape) {
    return
  }

  event.preventDefault()
  requestClose('esc')
}

watch(
  isActive,
  async (value) => {
    removeListeners()

    if (value) {
      releaseBodyScrollLock = lockBodyScroll()
      addListeners()
      await prepareStep()
      return
    }

    unlockBodyScroll()
    activeTarget.value = undefined
    targetRect.value = undefined
  },
  {
    immediate: true,
  },
)

watch(
  () => [activeIndex.value, activeStep.value, activePlacement.value],
  async () => {
    if (isActive.value) {
      await prepareStep()
    }
  },
)

watch(
  () => [props.offset, props.padding, props.width],
  () => {
    if (isActive.value) {
      void nextTick(updatePosition)
    }
  },
)

watch(total, (value) => {
  if (!value && visible.value) {
    requestClose('close')
    return
  }

  if (current.value > value - 1) {
    setCurrent(value - 1)
  }
})

onBeforeUnmount(() => {
  removeListeners()
  unlockBodyScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="su-tour">
      <div
        v-if="isActive"
        class="su-tour-overlay"
        :class="{ 'su-tour-overlay--maskless': !showMask }"
        :style="overlayStyle"
      >
        <button
          v-if="showMask"
          class="su-tour__mask"
          type="button"
          aria-label="关闭引导"
          @click="handleMaskClick"
        />
        <div
          v-if="showMask"
          class="su-tour__highlight"
          :style="highlightStyle"
          aria-hidden="true"
        />
        <section
          :id="tourId"
          ref="tourRef"
          class="su-tour"
          :class="`su-tour--${placementSide}`"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <button
            v-if="showClose"
            class="su-tour__close"
            type="button"
            aria-label="关闭引导"
            @click="handleClose"
          >
            &times;
          </button>

          <div class="su-tour__body">
            <div class="su-tour__title">
              <slot name="title" :step="activeStep!" :current="activeIndex">
                {{ activeStep?.title }}
              </slot>
            </div>
            <div v-if="activeStep?.description || $slots.description" class="su-tour__description">
              <slot name="description" :step="activeStep!" :current="activeIndex">
                {{ activeStep?.description }}
              </slot>
            </div>
          </div>

          <footer class="su-tour__footer">
            <slot
              name="footer"
              :step="activeStep!"
              :current="activeIndex"
              :total="total"
              :is-first="isFirst"
              :is-last="isLast"
              :prev="handlePrev"
              :next="handleNext"
              :finish="handleFinish"
              :close="handleClose"
            >
              <span class="su-tour__counter"> {{ displayCurrent }} / {{ total }} </span>
              <div class="su-tour__actions">
                <button
                  v-if="!isFirst"
                  class="su-tour__button su-tour__button--default"
                  type="button"
                  @click="handlePrev"
                >
                  {{ activeStep?.prevText ?? prevText }}
                </button>
                <button
                  class="su-tour__button su-tour__button--primary"
                  type="button"
                  @click="handleNext"
                >
                  {{
                    isLast
                      ? (activeStep?.finishText ?? finishText)
                      : (activeStep?.nextText ?? nextText)
                  }}
                </button>
              </div>
            </slot>
          </footer>

          <span v-if="showArrow" class="su-tour__arrow" aria-hidden="true" />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-tour-overlay {
  position: fixed;
  z-index: 2300;
  inset: 0;
  pointer-events: none;
}

.su-tour__mask {
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
  pointer-events: auto;
}

.su-tour-overlay--maskless .su-tour__mask {
  display: none;
}

.su-tour__highlight {
  position: fixed;
  border-radius: var(--su-radius-md);
  box-shadow:
    0 0 0 2px var(--su-color-bg-elevated),
    0 0 0 9999px rgb(15 23 42 / 45%);
  pointer-events: none;
  transition:
    top 0.16s ease,
    left 0.16s ease,
    width 0.16s ease,
    height 0.16s ease;
}

.su-tour {
  position: fixed;
  z-index: 1;
  max-width: min(360px, calc(100vw - var(--su-space-xl) * 2));
  padding: var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  outline: none;
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow-wrap: break-word;
  pointer-events: auto;
}

.su-tour__close {
  position: absolute;
  top: var(--su-space-sm);
  right: var(--su-space-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
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

.su-tour__close:hover {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-tour__body {
  padding-right: var(--su-space-xl);
}

.su-tour__title {
  color: var(--su-color-text);
  font-size: var(--su-font-size-lg);
  font-weight: 600;
  line-height: 1.4;
}

.su-tour__description {
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
}

.su-tour__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--su-space-md);
  margin-top: var(--su-space-lg);
}

.su-tour__counter {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-tour__actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
}

.su-tour__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  color: var(--su-color-text);
  font: inherit;
  font-size: var(--su-font-size-md);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.su-tour__button:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
}

.su-tour__button--primary {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-tour__button--primary:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary-hover);
}

.su-tour__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--su-color-border);
  background: inherit;
  transform: rotate(45deg);
}

.su-tour--top .su-tour__arrow {
  bottom: -6px;
  left: 50%;
  margin-left: -5px;
  border-top: 0;
  border-left: 0;
}

.su-tour--bottom .su-tour__arrow {
  top: -6px;
  left: 50%;
  margin-left: -5px;
  border-right: 0;
  border-bottom: 0;
}

.su-tour--left .su-tour__arrow {
  top: 50%;
  right: -6px;
  margin-top: -5px;
  border-bottom: 0;
  border-left: 0;
}

.su-tour--right .su-tour__arrow {
  top: 50%;
  left: -6px;
  margin-top: -5px;
  border-top: 0;
  border-right: 0;
}

.su-tour-enter-active,
.su-tour-leave-active {
  transition: opacity 0.18s ease;
}

.su-tour-enter-active .su-tour,
.su-tour-leave-active .su-tour {
  transition: transform 0.18s ease;
}

.su-tour-enter-from,
.su-tour-leave-to {
  opacity: 0;
}

.su-tour-enter-from .su-tour,
.su-tour-leave-to .su-tour {
  transform: translateY(-4px) scale(0.98);
}
</style>
