<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import { useLocale } from '../../config-provider'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuVirtualizedSelect',
  inheritAttrs: false,
})

export type VirtualizedSelectValue = string | number

export interface VirtualizedSelectOption {
  label: string
  value: VirtualizedSelectValue
  disabled?: boolean
  [key: string]: unknown
}

const model = defineModel<VirtualizedSelectValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    options?: VirtualizedSelectOption[]
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    height?: number
    itemHeight?: number
    buffer?: number
    emptyText?: string
    name?: string
    id?: string
    required?: boolean
    ariaLabel?: string
  }>(),
  {
    options: () => [],
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    clearable: false,
    height: 256,
    itemHeight: 34,
    buffer: 5,
    emptyText: undefined,
    name: undefined,
    id: undefined,
    required: false,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  change: [value: VirtualizedSelectValue, option: VirtualizedSelectOption]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  open: []
  close: []
}>()

defineSlots<{
  option?: (props: {
    option: VirtualizedSelectOption
    index: number
    selected: boolean
    active: boolean
  }) => unknown
  empty?: () => unknown
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const triggerRef = ref<HTMLButtonElement>()
const panelRef = ref<HTMLElement>()
const viewportRef = ref<HTMLElement>()
const locale = useLocale()
const isOpen = ref(false)
const activeIndex = ref(-1)
const scrollTop = ref(0)
const panelStyle = ref<CSSProperties>({})
const listboxId = `su-virtualized-select-${useId()}`

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedPlaceholder = computed(
  () => props.placeholder ?? locale.value.virtualizedSelect.placeholder,
)
const mergedEmptyText = computed(() => props.emptyText ?? locale.value.virtualizedSelect.empty)
const mergedAriaLabel = computed(() => props.ariaLabel ?? locale.value.virtualizedSelect.ariaLabel)
const mergedDisabled = computed(() => props.disabled || Boolean(form?.disabled.value))
const normalizedItemHeight = computed(() => Math.max(1, props.itemHeight))
const normalizedHeight = computed(() => Math.max(1, props.height))
const normalizedBuffer = computed(() => Math.max(0, Math.floor(props.buffer)))
const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
const hasValue = computed(() => Boolean(selectedOption.value))
const displayText = computed(() => selectedOption.value?.label ?? '')
const showClear = computed(() => props.clearable && !mergedDisabled.value && hasValue.value)
const totalHeight = computed(() => props.options.length * normalizedItemHeight.value)
const visibleCount = computed(() =>
  Math.max(1, Math.ceil(normalizedHeight.value / normalizedItemHeight.value)),
)
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / normalizedItemHeight.value) - normalizedBuffer.value),
)
const endIndex = computed(() =>
  Math.min(
    props.options.length,
    startIndex.value + visibleCount.value + normalizedBuffer.value * 2,
  ),
)
const visibleOptions = computed(() => props.options.slice(startIndex.value, endIndex.value))
const viewportStyle = computed<CSSProperties>(() => ({
  maxHeight: `${normalizedHeight.value}px`,
}))
const contentStyle = computed<CSSProperties>(() => ({
  height: `${totalHeight.value}px`,
}))
const listStyle = computed<CSSProperties>(() => ({
  transform: `translateY(${startIndex.value * normalizedItemHeight.value}px)`,
}))
const itemStyle = computed<CSSProperties>(() => ({
  height: `${normalizedItemHeight.value}px`,
}))

function isSelected(option: VirtualizedSelectOption) {
  return option.value === model.value
}

function isOptionDisabled(option: VirtualizedSelectOption) {
  return mergedDisabled.value || Boolean(option.disabled)
}

function getOptionIndex(index: number) {
  return startIndex.value + index
}

function findEnabledIndex(fromIndex: number, step: 1 | -1) {
  if (!props.options.length) {
    return -1
  }

  let index = fromIndex

  for (let count = 0; count < props.options.length; count += 1) {
    index = (index + step + props.options.length) % props.options.length

    if (!isOptionDisabled(props.options[index])) {
      return index
    }
  }

  return -1
}

function syncActiveIndex() {
  const selectedIndex = props.options.findIndex(
    (option) => option.value === model.value && !option.disabled,
  )

  activeIndex.value = selectedIndex >= 0 ? selectedIndex : findEnabledIndex(-1, 1)
}

function updatePosition() {
  const root = rootRef.value
  const panel = panelRef.value

  if (!root || !panel || !isOpen.value) {
    return
  }

  const rect = root.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const top = Math.min(rect.bottom + 6, Math.max(4, viewportHeight - panelRect.height - 4))

  panelStyle.value = {
    top: `${top}px`,
    left: `${Math.max(4, rect.left)}px`,
    width: `${Math.min(rect.width, window.innerWidth - 8)}px`,
  }
}

function scrollToIndex(index: number, align: 'start' | 'center' = 'start') {
  const viewport = viewportRef.value

  if (!viewport || index < 0) {
    return
  }

  const baseTop = index * normalizedItemHeight.value
  const nextTop =
    align === 'center'
      ? baseTop - (normalizedHeight.value - normalizedItemHeight.value) / 2
      : baseTop
  const maxScrollTop = Math.max(0, totalHeight.value - normalizedHeight.value)

  viewport.scrollTop = Math.min(Math.max(0, nextTop), maxScrollTop)
  scrollTop.value = viewport.scrollTop
}

function openPanel() {
  if (mergedDisabled.value || isOpen.value) {
    return
  }

  syncActiveIndex()
  isOpen.value = true
  emit('open')

  void nextTick(() => scrollToIndex(activeIndex.value, 'center'))
}

function closePanel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('close')
}

function togglePanel() {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}

function selectOption(option: VirtualizedSelectOption, event?: Event) {
  if (isOptionDisabled(option)) {
    return
  }

  model.value = option.value
  emit('change', option.value, option)
  closePanel()

  if (event) {
    void nextTick(() => triggerRef.value?.focus())
  }
}

function clearValue(event?: MouseEvent) {
  event?.stopPropagation()

  if (mergedDisabled.value) {
    return
  }

  model.value = ''
  activeIndex.value = findEnabledIndex(-1, 1)
  emit('clear')
  closePanel()
  void nextTick(() => triggerRef.value?.focus())
}

function moveActive(step: 1 | -1) {
  if (!isOpen.value) {
    openPanel()
    return
  }

  const nextIndex = findEnabledIndex(activeIndex.value, step)

  if (nextIndex < 0) {
    return
  }

  activeIndex.value = nextIndex
  scrollToIndex(nextIndex, 'center')
}

function selectActive(event: Event) {
  const option = props.options[activeIndex.value]

  if (option) {
    selectOption(option, event)
  }
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement

  scrollTop.value = target.scrollTop
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    if (isOpen.value) {
      selectActive(event)
    } else {
      openPanel()
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  window.setTimeout(() => {
    if (
      document.activeElement !== triggerRef.value &&
      !panelRef.value?.contains(document.activeElement)
    ) {
      closePanel()
    }
  })
  emit('blur', event)
}

function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node

  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }

  closePanel()
}

function addListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('pointerdown', handleDocumentPointerdown)
}

function removeListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
}

function focus() {
  triggerRef.value?.focus()
}

function blur() {
  triggerRef.value?.blur()
}

watch(isOpen, async (value) => {
  removeListeners()

  if (value) {
    await nextTick()
    updatePosition()
    addListeners()
  }
})

watch(
  () => [props.options, model.value],
  () => {
    syncActiveIndex()

    if (isOpen.value) {
      void nextTick(updatePosition)
    }
  },
)

watch(mergedDisabled, (value) => {
  if (value) {
    closePanel()
  }
})

onBeforeUnmount(removeListeners)

defineExpose({
  ref: triggerRef,
  focus,
  blur,
  open: openPanel,
  close: closePanel,
  clear: clearValue,
})
</script>

<template>
  <span
    ref="rootRef"
    class="su-virtualized-select"
    :class="[
      `su-virtualized-select--${mergedSize}`,
      `su-virtualized-select--${status}`,
      {
        'is-open': isOpen,
        'is-disabled': mergedDisabled,
        'is-empty': !hasValue,
        'is-clearable': showClear,
      },
    ]"
  >
    <button
      v-bind="attrs"
      :id="id"
      ref="triggerRef"
      class="su-virtualized-select__trigger"
      type="button"
      :disabled="mergedDisabled"
      :aria-label="mergedAriaLabel"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="togglePanel"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <span class="su-virtualized-select__value">
        <span v-if="hasValue">{{ displayText }}</span>
        <span v-else class="su-virtualized-select__placeholder">
          {{ mergedPlaceholder }}
        </span>
      </span>
      <span class="su-virtualized-select__arrow" aria-hidden="true" />
    </button>
    <button
      v-if="showClear"
      class="su-virtualized-select__clear"
      type="button"
      :aria-label="locale.virtualizedSelect.clear"
      @click="clearValue"
    >
      &times;
    </button>
    <input v-if="name" type="hidden" :name="name" :value="model" :required="required" />
  </span>
  <Teleport to="body">
    <Transition name="su-virtualized-select">
      <div
        v-if="isOpen"
        :id="listboxId"
        ref="panelRef"
        class="su-virtualized-select__panel"
        :style="panelStyle"
        role="listbox"
        @keydown="handleKeydown"
      >
        <div
          v-if="options.length"
          ref="viewportRef"
          class="su-virtualized-select__viewport"
          :style="viewportStyle"
          @scroll="handleScroll"
        >
          <div class="su-virtualized-select__content" :style="contentStyle">
            <div class="su-virtualized-select__items" :style="listStyle">
              <button
                v-for="(option, index) in visibleOptions"
                :key="`${option.value}`"
                class="su-virtualized-select__option"
                :class="{
                  'is-active': getOptionIndex(index) === activeIndex,
                  'is-selected': isSelected(option),
                  'is-disabled': isOptionDisabled(option),
                }"
                :style="itemStyle"
                type="button"
                role="option"
                :aria-selected="isSelected(option)"
                :disabled="isOptionDisabled(option)"
                @mouseenter="activeIndex = getOptionIndex(index)"
                @mousedown.prevent
                @click="selectOption(option, $event)"
              >
                <slot
                  name="option"
                  :option="option"
                  :index="getOptionIndex(index)"
                  :selected="isSelected(option)"
                  :active="getOptionIndex(index) === activeIndex"
                >
                  {{ option.label }}
                </slot>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="su-virtualized-select__empty">
          <slot name="empty">{{ mergedEmptyText }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-virtualized-select {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-virtualized-select__trigger {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: inherit;
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;
}

.su-virtualized-select__trigger:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--su-color-primary) 48%, var(--su-color-border));
}

.su-virtualized-select__trigger:focus-visible,
.su-virtualized-select.is-open .su-virtualized-select__trigger {
  border-color: var(--su-color-primary);
  outline: none;
  box-shadow: var(--su-shadow-sm);
}

.su-virtualized-select--success .su-virtualized-select__trigger {
  border-color: var(--su-color-success);
}

.su-virtualized-select--success .su-virtualized-select__trigger:focus-visible {
  border-color: var(--su-color-success-active);
}

.su-virtualized-select--warning .su-virtualized-select__trigger {
  border-color: var(--su-color-warning);
}

.su-virtualized-select--warning .su-virtualized-select__trigger:focus-visible {
  border-color: var(--su-color-warning-active);
}

.su-virtualized-select--error .su-virtualized-select__trigger {
  border-color: var(--su-color-error);
}

.su-virtualized-select--error .su-virtualized-select__trigger:focus-visible {
  border-color: var(--su-color-error-active);
}

.su-virtualized-select--small {
  font-size: var(--su-font-size-sm);
}

.su-virtualized-select--small .su-virtualized-select__trigger {
  min-height: 24px;
  padding: 0 30px 0 var(--su-space-sm);
}

.su-virtualized-select--medium .su-virtualized-select__trigger {
  min-height: 32px;
  padding: 0 34px 0 var(--su-space-md);
}

.su-virtualized-select--large {
  font-size: var(--su-font-size-lg);
}

.su-virtualized-select--large .su-virtualized-select__trigger {
  min-height: 44px;
  padding: 0 40px 0 var(--su-space-lg);
}

.su-virtualized-select.is-clearable .su-virtualized-select__trigger {
  padding-right: 58px;
}

.su-virtualized-select__value {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-virtualized-select__placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-virtualized-select__clear {
  position: absolute;
  top: 50%;
  right: 30px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
}

.su-virtualized-select__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-virtualized-select__arrow {
  position: absolute;
  top: 50%;
  right: var(--su-space-md);
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  color: var(--su-color-text-muted);
  pointer-events: none;
  transform: translateY(-65%) rotate(45deg);
  transition: transform 0.16s ease;
}

.su-virtualized-select.is-open .su-virtualized-select__arrow {
  transform: translateY(-35%) rotate(225deg);
}

.su-virtualized-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-virtualized-select.is-disabled .su-virtualized-select__trigger {
  cursor: not-allowed;
}

.su-virtualized-select__panel {
  position: fixed;
  z-index: 2100;
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

.su-virtualized-select__viewport {
  width: 100%;
  overflow: auto;
}

.su-virtualized-select__content {
  position: relative;
  width: 100%;
}

.su-virtualized-select__items {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  will-change: transform;
}

.su-virtualized-select__option {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding: 0 var(--su-space-md);
  border: 0;
  border-radius: var(--su-radius-sm);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-virtualized-select__option:hover:not(:disabled),
.su-virtualized-select__option.is-active:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-virtualized-select__option.is-selected:not(:disabled) {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-virtualized-select__option:disabled,
.su-virtualized-select__option.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-virtualized-select__empty {
  min-height: 72px;
  padding: var(--su-space-lg);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-virtualized-select-enter-active,
.su-virtualized-select-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-virtualized-select-enter-from,
.su-virtualized-select-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
