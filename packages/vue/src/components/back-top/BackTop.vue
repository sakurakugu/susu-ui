<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'

defineOptions({
  name: 'SuBackTop',
})

export type BackTopTarget = Window | HTMLElement
export type BackTopBehavior = 'auto' | 'instant' | 'smooth'

const props = withDefaults(
  defineProps<{
    visibilityHeight?: number
    right?: number | string
    bottom?: number | string
    target?: () => BackTopTarget | null | undefined
    behavior?: BackTopBehavior
    zIndex?: number
    ariaLabel?: string
  }>(),
  {
    visibilityHeight: 200,
    right: 40,
    bottom: 40,
    target: undefined,
    behavior: 'smooth',
    zIndex: 100,
    ariaLabel: '回到顶部',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  change: [visible: boolean]
}>()

const visible = ref(false)
let activeTarget: BackTopTarget | undefined
let frame: number | undefined

const backTopStyle = computed<CSSProperties>(() => ({
  right: formatOffset(props.right),
  bottom: formatOffset(props.bottom),
  zIndex: props.zIndex,
}))

function formatOffset(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function getTarget() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return props.target?.() ?? window
}

function getScrollTop(target: BackTopTarget) {
  if (target === window) {
    return (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    )
  }

  return (target as HTMLElement).scrollTop
}

function setScrollTop(target: BackTopTarget) {
  if (target === window) {
    window.scrollTo({
      top: 0,
      behavior: props.behavior,
    })
    return
  }

  ;(target as HTMLElement).scrollTo?.({
    top: 0,
    behavior: props.behavior,
  })

  if (!(target as HTMLElement).scrollTo) {
    ;(target as HTMLElement).scrollTop = 0
  }
}

function setVisible(nextVisible: boolean) {
  if (visible.value === nextVisible) {
    return
  }

  visible.value = nextVisible
  emit('change', nextVisible)
}

function updateVisible() {
  const target = getTarget()

  if (!target) {
    return
  }

  setVisible(getScrollTop(target) >= props.visibilityHeight)
}

function requestUpdate() {
  if (typeof window === 'undefined') {
    return
  }

  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  frame = window.requestAnimationFrame(() => {
    frame = undefined
    updateVisible()
  })
}

function removeListeners() {
  activeTarget?.removeEventListener('scroll', requestUpdate)
  activeTarget = undefined
}

function addListeners() {
  removeListeners()
  const target = getTarget()

  if (!target) {
    return
  }

  activeTarget = target
  activeTarget.addEventListener('scroll', requestUpdate, { passive: true })
}

function handleClick(event: MouseEvent) {
  emit('click', event)
  const target = getTarget()

  if (!target) {
    return
  }

  setScrollTop(target)
}

watch(
  () => [props.visibilityHeight, props.target],
  async () => {
    await nextTick()
    addListeners()
    requestUpdate()
  },
)

onMounted(() => {
  addListeners()
  requestUpdate()
})

onBeforeUnmount(() => {
  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  removeListeners()
})
</script>

<template>
  <Transition name="su-back-top-fade">
    <button
      v-if="visible"
      class="su-back-top"
      type="button"
      :style="backTopStyle"
      :aria-label="ariaLabel"
      @click="handleClick"
    >
      <slot>
        <span class="su-back-top__icon" aria-hidden="true" />
      </slot>
    </button>
  </Transition>
</template>

<style>
.su-back-top {
  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font: inherit;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.su-back-top:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
  box-shadow: var(--su-shadow-lg);
  transform: translateY(-2px);
}

.su-back-top:active {
  border-color: var(--su-color-primary-active);
  color: var(--su-color-primary-active);
  transform: translateY(0);
}

.su-back-top:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-back-top__icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.su-back-top__icon::before,
.su-back-top__icon::after {
  position: absolute;
  content: '';
}

.su-back-top__icon::before {
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  border-top: 2px solid currentcolor;
  border-left: 2px solid currentcolor;
  transform: rotate(45deg);
}

.su-back-top__icon::after {
  top: 5px;
  left: 6px;
  width: 2px;
  height: 8px;
  border-radius: var(--su-radius-round);
  background: currentcolor;
}

.su-back-top-fade-enter-active,
.su-back-top-fade-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-back-top-fade-enter-from,
.su-back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
