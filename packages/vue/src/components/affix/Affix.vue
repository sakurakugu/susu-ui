<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuAffix',
})

export type AffixTarget = Window | HTMLElement

const props = withDefaults(
  defineProps<{
    offsetTop?: number
    offsetBottom?: number
    target?: () => AffixTarget | null | undefined
    zIndex?: number
  }>(),
  {
    offsetTop: undefined,
    offsetBottom: undefined,
    target: undefined,
    zIndex: 100,
  },
)

const emit = defineEmits<{
  change: [fixed: boolean]
}>()

const rootRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const fixed = ref(false)
const placeholderStyle = ref<CSSProperties>({})
const fixedStyle = ref<CSSProperties>({})
let activeTarget: AffixTarget | undefined
let frame: number | undefined

const mode = computed(() =>
  props.offsetBottom !== undefined && props.offsetTop === undefined ? 'bottom' : 'top',
)

function getTarget() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return props.target?.() ?? window
}

function getTargetRect(target: AffixTarget) {
  if (target === window) {
    return {
      top: 0,
      bottom: window.innerHeight,
    }
  }

  return (target as HTMLElement).getBoundingClientRect()
}

function getScrollTop(target: AffixTarget) {
  if (target === window) {
    return window.scrollY || document.documentElement.scrollTop
  }

  return (target as HTMLElement).scrollTop
}

function setFixed(nextFixed: boolean) {
  if (fixed.value === nextFixed) {
    return
  }

  fixed.value = nextFixed
  emit('change', nextFixed)
}

function updatePosition() {
  const root = rootRef.value
  const content = contentRef.value
  const target = getTarget()

  if (!root || !content || !target) {
    return
  }

  const rootRect = root.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const targetRect = getTargetRect(target)
  const offset = mode.value === 'top' ? (props.offsetTop ?? 0) : (props.offsetBottom ?? 0)

  if (mode.value === 'top') {
    const top = targetRect.top + offset
    const shouldFix =
      rootRect.top <= top &&
      targetRect.bottom > top + contentRect.height &&
      getScrollTop(target) > 0

    if (shouldFix) {
      placeholderStyle.value = {
        width: `${rootRect.width}px`,
        height: `${contentRect.height}px`,
      }
      fixedStyle.value = {
        position: 'fixed',
        top: `${top}px`,
        left: `${rootRect.left}px`,
        width: `${rootRect.width}px`,
        zIndex: props.zIndex,
      }
    } else {
      placeholderStyle.value = {}
      fixedStyle.value = {}
    }

    setFixed(shouldFix)
    return
  }

  const bottom = window.innerHeight - targetRect.bottom + offset
  const fixedLine = targetRect.bottom - offset
  const shouldFix =
    rootRect.bottom >= fixedLine &&
    targetRect.top < fixedLine - contentRect.height &&
    getScrollTop(target) > 0

  if (shouldFix) {
    placeholderStyle.value = {
      width: `${rootRect.width}px`,
      height: `${contentRect.height}px`,
    }
    fixedStyle.value = {
      position: 'fixed',
      bottom: `${bottom}px`,
      left: `${rootRect.left}px`,
      width: `${rootRect.width}px`,
      zIndex: props.zIndex,
    }
  } else {
    placeholderStyle.value = {}
    fixedStyle.value = {}
  }

  setFixed(shouldFix)
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
    updatePosition()
  })
}

function removeListeners() {
  activeTarget?.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
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
  window.addEventListener('resize', requestUpdate)
}

watch(
  () => [props.offsetTop, props.offsetBottom, props.zIndex, props.target],
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
  <div ref="rootRef" class="su-affix" :class="{ 'is-fixed': fixed }" :style="placeholderStyle">
    <div ref="contentRef" class="su-affix__content" :style="fixedStyle">
      <slot />
    </div>
  </div>
</template>

<style>
.su-affix {
  display: block;
}

.su-affix__content {
  display: block;
}
</style>
