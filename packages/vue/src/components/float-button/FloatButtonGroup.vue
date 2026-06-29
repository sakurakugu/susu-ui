<script setup lang="ts">
import { computed, provide, ref, watch, type CSSProperties } from 'vue'
import {
  floatButtonGroupKey,
  type FloatButtonGroupPlacement,
  type FloatButtonGroupTrigger,
  type FloatButtonShape,
} from './context'

defineOptions({
  name: 'SuFloatButtonGroup',
})

const props = withDefaults(
  defineProps<{
    shape?: FloatButtonShape
    trigger?: FloatButtonGroupTrigger
    placement?: FloatButtonGroupPlacement
    open?: boolean
    right?: number | string
    bottom?: number | string
    zIndex?: number
    ariaLabel?: string
  }>(),
  {
    shape: undefined,
    trigger: undefined,
    placement: 'top',
    open: undefined,
    right: 40,
    bottom: 40,
    zIndex: 100,
    ariaLabel: '展开浮动操作',
  },
)

const emit = defineEmits<{
  'update:open': [open: boolean]
  openChange: [open: boolean]
}>()

const uncontrolledOpen = ref(false)

const isControlled = computed(() => props.open !== undefined)

const mergedOpen = computed(() => props.open ?? uncontrolledOpen.value)

const groupStyle = computed<CSSProperties>(() => ({
  right: formatOffset(props.right),
  bottom: formatOffset(props.bottom),
  zIndex: props.zIndex,
}))

const providedShape = computed(() => props.shape)

provide(floatButtonGroupKey, {
  shape: providedShape,
})

watch(
  () => props.trigger,
  (trigger) => {
    if (!trigger) {
      setOpen(false)
    }
  },
)

function formatOffset(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function setOpen(nextOpen: boolean) {
  const previousOpen = mergedOpen.value

  if (!isControlled.value) {
    uncontrolledOpen.value = nextOpen
  }

  if (previousOpen !== nextOpen || isControlled.value) {
    emit('update:open', nextOpen)
    emit('openChange', nextOpen)
  }
}

function toggleOpen() {
  if (props.trigger !== 'click') {
    return
  }

  setOpen(!mergedOpen.value)
}

function handleMouseenter() {
  if (props.trigger === 'hover') {
    setOpen(true)
  }
}

function handleMouseleave() {
  if (props.trigger === 'hover') {
    setOpen(false)
  }
}
</script>

<template>
  <div
    class="su-float-button-group"
    :class="[
      `su-float-button-group--${placement}`,
      {
        'is-menu': Boolean(trigger),
        'is-open': mergedOpen,
      },
    ]"
    :style="groupStyle"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <Transition name="su-float-button-group-list">
      <div v-if="!trigger || mergedOpen" class="su-float-button-group__list">
        <slot />
      </div>
    </Transition>

    <button
      v-if="trigger"
      class="su-float-button-group__trigger"
      :class="[`su-float-button-group__trigger--${shape ?? 'circle'}`]"
      type="button"
      :aria-label="ariaLabel"
      :aria-expanded="mergedOpen"
      @click="toggleOpen"
    >
      <slot name="trigger">
        <span class="su-float-button-group__trigger-icon" aria-hidden="true" />
      </slot>
    </button>
  </div>
</template>

<style>
.su-float-button-group {
  position: fixed;
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-sm);
}

.su-float-button-group--top {
  flex-direction: column;
}

.su-float-button-group--bottom {
  flex-direction: column-reverse;
}

.su-float-button-group--left {
  flex-direction: row;
}

.su-float-button-group--right {
  flex-direction: row-reverse;
}

.su-float-button-group__list {
  display: inline-flex;
  gap: var(--su-space-sm);
}

.su-float-button-group--top .su-float-button-group__list,
.su-float-button-group--bottom .su-float-button-group__list {
  flex-direction: column;
}

.su-float-button-group--left .su-float-button-group__list,
.su-float-button-group--right .su-float-button-group__list {
  flex-direction: row;
}

.su-float-button-group__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--su-color-border);
  color: var(--su-color-text);
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

.su-float-button-group__trigger--circle {
  border-radius: var(--su-radius-round);
}

.su-float-button-group__trigger--square {
  border-radius: var(--su-radius-lg);
}

.su-float-button-group__trigger:hover {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
  box-shadow: var(--su-shadow-lg);
}

.su-float-button-group__trigger:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-float-button-group__trigger-icon {
  position: relative;
  width: 16px;
  height: 16px;
  transition: transform 0.16s ease;
}

.su-float-button-group.is-open .su-float-button-group__trigger-icon {
  transform: rotate(45deg);
}

.su-float-button-group__trigger-icon::before,
.su-float-button-group__trigger-icon::after {
  position: absolute;
  border-radius: var(--su-radius-round);
  background: currentcolor;
  content: '';
}

.su-float-button-group__trigger-icon::before {
  top: 7px;
  left: 1px;
  width: 14px;
  height: 2px;
}

.su-float-button-group__trigger-icon::after {
  top: 1px;
  left: 7px;
  width: 2px;
  height: 14px;
}

.su-float-button-group-list-enter-active,
.su-float-button-group-list-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-float-button-group-list-enter-from,
.su-float-button-group-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.su-float-button-group--bottom .su-float-button-group-list-enter-from,
.su-float-button-group--bottom .su-float-button-group-list-leave-to {
  transform: translateY(-8px);
}

.su-float-button-group--left .su-float-button-group-list-enter-from,
.su-float-button-group--left .su-float-button-group-list-leave-to {
  transform: translateX(8px);
}

.su-float-button-group--right .su-float-button-group-list-enter-from,
.su-float-button-group--right .su-float-button-group-list-leave-to {
  transform: translateX(-8px);
}
</style>
