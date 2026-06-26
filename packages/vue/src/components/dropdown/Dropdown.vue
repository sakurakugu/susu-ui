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
  name: 'SuDropdown',
})

type DropdownPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
type DropdownTrigger = 'click' | 'hover' | 'manual'

export type DropdownValue = string | number

export interface DropdownOption {
  label: string
  value: DropdownValue
  disabled?: boolean
  divided?: boolean
}

const visibleModel = defineModel<boolean>('visible')

const props = withDefaults(
  defineProps<{
    options?: DropdownOption[]
    placement?: DropdownPlacement
    trigger?: DropdownTrigger
    disabled?: boolean
    hideOnClick?: boolean
    showDelay?: number
    hideDelay?: number
    offset?: number
    menuClass?: string
    zIndex?: number
  }>(),
  {
    options: undefined,
    placement: 'bottom-start',
    trigger: 'click',
    disabled: false,
    hideOnClick: true,
    showDelay: 0,
    hideDelay: 120,
    offset: 8,
    menuClass: undefined,
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  show: []
  hide: []
  command: [value: DropdownValue, option: DropdownOption]
}>()

defineSlots<{
  default?: () => unknown
  menu?: () => unknown
}>()

const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const innerVisible = ref(false)
const dropdownId = `su-dropdown-${useId()}`
const menuStyle = ref<CSSProperties>({})
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

function handleClick() {
  toggle()
}

function handleDocumentClick(event: MouseEvent) {
  if (!visible.value || props.trigger !== 'click') {
    return
  }

  const target = event.target as Node
  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) {
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

function alignHorizontal(
  triggerLeft: number,
  triggerWidth: number,
  menuWidth: number,
  viewportWidth: number,
) {
  const [, align] = props.placement.split('-')

  if (align === 'end') {
    return clamp(
      triggerLeft + triggerWidth - menuWidth,
      4,
      viewportWidth - menuWidth - 4,
    )
  }

  if (align === undefined) {
    return clamp(
      triggerLeft + triggerWidth / 2 - menuWidth / 2,
      4,
      viewportWidth - menuWidth - 4,
    )
  }

  return clamp(triggerLeft, 4, viewportWidth - menuWidth - 4)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function updatePosition() {
  const trigger = triggerRef.value
  const menu = menuRef.value

  if (!trigger || !menu || !visible.value) {
    return
  }

  const triggerRect = trigger.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const side = placementSide.value
  const left = alignHorizontal(
    triggerRect.left,
    triggerRect.width,
    menuRect.width,
    viewportWidth,
  )
  let top =
    side === 'top'
      ? triggerRect.top - menuRect.height - props.offset
      : triggerRect.bottom + props.offset

  top = clamp(top, 4, viewportHeight - menuRect.height - 4)

  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${triggerRect.width}px`,
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

function handleOptionClick(option: DropdownOption) {
  if (option.disabled) {
    return
  }

  emit('command', option.value, option)

  if (props.hideOnClick) {
    setVisible(false)
  }
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
    class="su-dropdown"
    :class="{ 'is-disabled': disabled, 'is-open': visible }"
    :aria-controls="visible ? dropdownId : undefined"
    :aria-expanded="visible"
    aria-haspopup="menu"
    tabindex="0"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @click="handleClick"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="su-dropdown">
      <div
        v-if="visible"
        :id="dropdownId"
        ref="menuRef"
        class="su-dropdown__menu"
        :class="[`su-dropdown__menu--${placementSide}`, menuClass]"
        :style="menuStyle"
        role="menu"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
      >
        <slot name="menu">
          <button
            v-for="option in options"
            :key="`${option.value}`"
            class="su-dropdown__item"
            :class="{
              'is-disabled': option.disabled,
              'is-divided': option.divided,
            }"
            type="button"
            role="menuitem"
            :disabled="option.disabled"
            @click="handleOptionClick(option)"
          >
            {{ option.label }}
          </button>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-dropdown {
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
  outline: none;
}

.su-dropdown.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-dropdown__menu {
  position: fixed;
  z-index: 2100;
  display: grid;
  min-width: 120px;
  max-width: min(320px, calc(100vw - var(--su-space-xl) * 2));
  padding: var(--su-space-xs);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow: hidden;
}

.su-dropdown__item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 0 var(--su-space-md);
  border: 0;
  border-radius: var(--su-radius-sm);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-dropdown__item:hover:not(:disabled),
.su-dropdown__item:focus-visible:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
  outline: none;
}

.su-dropdown__item.is-divided {
  margin-top: var(--su-space-xs);
  border-top: 1px solid var(--su-color-border);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-top: var(--su-space-xs);
}

.su-dropdown__item:disabled,
.su-dropdown__item.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-dropdown-enter-active,
.su-dropdown-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-dropdown-enter-from,
.su-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
