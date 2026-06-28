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
  name: 'SuCascader',
  inheritAttrs: false,
})

export type CascaderValue = string | number

export interface CascaderOption {
  label: string
  value: CascaderValue
  children?: CascaderOption[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export interface CascaderRenderOption extends CascaderOption {
  level: number
  pathValues: CascaderValue[]
  pathLabels: string[]
  parent?: CascaderRenderOption
  children?: CascaderRenderOption[]
}

const model = defineModel<CascaderValue[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    options?: CascaderOption[]
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    changeOnSelect?: boolean
    separator?: string
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
    changeOnSelect: false,
    separator: ' / ',
    emptyText: undefined,
    name: undefined,
    id: undefined,
    required: false,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  change: [value: CascaderValue[], selectedOptions: CascaderRenderOption[]]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  open: []
  close: []
}>()

defineSlots<{
  option?: (props: { option: CascaderRenderOption }) => unknown
  empty?: () => unknown
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const triggerRef = ref<HTMLButtonElement>()
const panelRef = ref<HTMLElement>()
const locale = useLocale()
const isOpen = ref(false)
const activePath = ref<CascaderValue[]>([])
const activeIndex = ref(0)
const panelStyle = ref<CSSProperties>({})
const panelId = `su-cascader-${useId()}`

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedPlaceholder = computed(
  () => props.placeholder ?? locale.value.cascader.placeholder,
)
const mergedEmptyText = computed(
  () => props.emptyText ?? locale.value.cascader.empty,
)
const mergedAriaLabel = computed(
  () => props.ariaLabel ?? locale.value.cascader.ariaLabel,
)

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const normalizedOptions = computed<CascaderRenderOption[]>(() =>
  normalizeOptions(props.options),
)

const selectedOptions = computed(() => findPath(model.value))

const displayText = computed(() =>
  selectedOptions.value.map((option) => option.label).join(props.separator),
)

const hasValue = computed(() => selectedOptions.value.length > 0)

const showClear = computed(
  () => props.clearable && !mergedDisabled.value && hasValue.value,
)

const activeOptions = computed(() => findPath(activePath.value))

const columns = computed(() => {
  const result: CascaderRenderOption[][] = [normalizedOptions.value]

  activeOptions.value.forEach((option) => {
    if (hasChildren(option)) {
      result.push(option.children ?? [])
    }
  })

  return result
})

const activeColumn = computed(() => columns.value[activeIndex.value] ?? [])

function normalizeOptions(
  options: CascaderOption[] = [],
  level = 0,
  parent?: CascaderRenderOption,
): CascaderRenderOption[] {
  return options.map((option) => {
    const { children, ...restOption } = option
    const pathValues = [...(parent?.pathValues ?? []), option.value]
    const pathLabels = [...(parent?.pathLabels ?? []), option.label]
    const renderOption: CascaderRenderOption = {
      ...restOption,
      level,
      parent,
      pathValues,
      pathLabels,
    }

    renderOption.children = children
      ? normalizeOptions(children, level + 1, renderOption)
      : undefined

    return renderOption
  })
}

function findOption(value: CascaderValue, options: CascaderRenderOption[]) {
  return options.find((option) => option.value === value)
}

function findPath(values: CascaderValue[]) {
  const result: CascaderRenderOption[] = []
  let options = normalizedOptions.value

  for (const value of values) {
    const option = findOption(value, options)

    if (!option) {
      break
    }

    result.push(option)
    options = option.children ?? []
  }

  return result
}

function hasChildren(option: CascaderRenderOption) {
  return !option.isLeaf && Boolean(option.children?.length)
}

function isOptionDisabled(option: CascaderRenderOption) {
  return mergedDisabled.value || Boolean(option.disabled)
}

function updatePosition() {
  const root = rootRef.value
  const panel = panelRef.value

  if (!root || !panel || !isOpen.value) {
    return
  }

  const rect = root.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
  }
}

function openPanel() {
  if (mergedDisabled.value || isOpen.value) {
    return
  }

  activePath.value = hasValue.value ? [...model.value] : []
  activeIndex.value = Math.max(0, activeOptions.value.length - 1)
  isOpen.value = true
  emit('open')
}

function closePanel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  activeIndex.value = 0
  emit('close')
}

function togglePanel() {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}

function selectOption(option: CascaderRenderOption) {
  if (isOptionDisabled(option)) {
    return
  }

  activePath.value = option.pathValues
  activeIndex.value = option.level

  if (hasChildren(option) && !props.changeOnSelect) {
    return
  }

  model.value = [...option.pathValues]
  emit('change', [...option.pathValues], findPath(option.pathValues))
  closePanel()
  void nextTick(() => triggerRef.value?.focus())
}

function setActiveOption(option: CascaderRenderOption) {
  activePath.value = option.pathValues
  activeIndex.value = option.level
}

function clearValue(event?: MouseEvent) {
  event?.stopPropagation()

  if (mergedDisabled.value) {
    return
  }

  model.value = []
  activePath.value = []
  emit('clear')
  closePanel()
  void nextTick(() => triggerRef.value?.focus())
}

function moveActive(step: number) {
  const enabledOptions = activeColumn.value.filter(
    (option) => !isOptionDisabled(option),
  )

  if (!enabledOptions.length) {
    return
  }

  const current = activeOptions.value[activeIndex.value]
  const enabledIndex = current
    ? enabledOptions.indexOf(current)
    : step > 0
      ? -1
      : 0
  const nextIndex =
    (enabledIndex + step + enabledOptions.length) % enabledOptions.length
  const nextOption = enabledOptions[nextIndex]
  activePath.value = nextOption.pathValues
}

function openActiveChild() {
  const option = activeOptions.value[activeIndex.value]

  if (!option || !hasChildren(option)) {
    return
  }

  activeIndex.value = Math.min(activeIndex.value + 1, columns.value.length - 1)
}

function backToParent() {
  activeIndex.value = Math.max(0, activeIndex.value - 1)
}

function selectActive() {
  const option =
    activeOptions.value[activeIndex.value] ??
    activeColumn.value.find((item) => !isOptionDisabled(item))

  if (option) {
    selectOption(option)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPanel()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    openPanel()
    moveActive(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    openPanel()
    openActiveChild()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    backToParent()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (isOpen.value) {
      selectActive()
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
    if (isOpen.value) {
      activePath.value = hasValue.value ? [...model.value] : []
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
    class="su-cascader"
    :class="[
      `su-cascader--${mergedSize}`,
      `su-cascader--${status}`,
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
      class="su-cascader__trigger"
      type="button"
      :disabled="mergedDisabled"
      :aria-label="mergedAriaLabel"
      :aria-controls="isOpen ? panelId : undefined"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="togglePanel"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <span class="su-cascader__value">
        <span v-if="hasValue">{{ displayText }}</span>
        <span v-else class="su-cascader__placeholder">
          {{ mergedPlaceholder }}
        </span>
      </span>
      <span class="su-cascader__arrow" aria-hidden="true" />
    </button>
    <button
      v-if="showClear"
      class="su-cascader__clear"
      type="button"
      :aria-label="locale.cascader.clear"
      @click="clearValue"
    >
      &times;
    </button>
    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="model.join(',')"
      :required="required"
    />
  </span>
  <Teleport to="body">
    <Transition name="su-cascader">
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        class="su-cascader__panel"
        :style="panelStyle"
        role="listbox"
        @keydown="handleKeydown"
      >
        <div v-if="normalizedOptions.length" class="su-cascader__columns">
          <div
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            class="su-cascader__column"
            role="group"
          >
            <button
              v-for="option in column"
              :key="`${option.level}-${option.value}`"
              class="su-cascader__option"
              :class="{
                'is-active': activePath[option.level] === option.value,
                'is-selected':
                  model.length === option.pathValues.length &&
                  model.every(
                    (value, index) => value === option.pathValues[index],
                  ),
                'is-disabled': isOptionDisabled(option),
              }"
              type="button"
              role="option"
              :aria-selected="activePath[option.level] === option.value"
              :disabled="isOptionDisabled(option)"
              @mouseenter="setActiveOption(option)"
              @mousedown.prevent
              @click="selectOption(option)"
            >
              <span class="su-cascader__option-label">
                <slot name="option" :option="option">
                  {{ option.label }}
                </slot>
              </span>
              <span
                v-if="hasChildren(option)"
                class="su-cascader__option-arrow"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div v-else class="su-cascader__empty">
          <slot name="empty">{{ mergedEmptyText }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-cascader {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-cascader__trigger {
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

.su-cascader__trigger:hover:not(:disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-cascader__trigger:focus-visible,
.su-cascader.is-open .su-cascader__trigger {
  border-color: var(--su-color-primary);
  outline: none;
  box-shadow: var(--su-shadow-sm);
}

.su-cascader--success .su-cascader__trigger {
  border-color: #16a34a;
}

.su-cascader--success .su-cascader__trigger:focus-visible {
  border-color: #15803d;
}

.su-cascader--warning .su-cascader__trigger {
  border-color: #d97706;
}

.su-cascader--warning .su-cascader__trigger:focus-visible {
  border-color: #b45309;
}

.su-cascader--error .su-cascader__trigger {
  border-color: #dc2626;
}

.su-cascader--error .su-cascader__trigger:focus-visible {
  border-color: #b91c1c;
}

.su-cascader--small {
  font-size: var(--su-font-size-sm);
}

.su-cascader--small .su-cascader__trigger {
  min-height: 24px;
  padding: 0 30px 0 var(--su-space-sm);
}

.su-cascader--medium .su-cascader__trigger {
  min-height: 32px;
  padding: 0 34px 0 var(--su-space-md);
}

.su-cascader--large {
  font-size: var(--su-font-size-lg);
}

.su-cascader--large .su-cascader__trigger {
  min-height: 44px;
  padding: 0 40px 0 var(--su-space-lg);
}

.su-cascader.is-clearable .su-cascader__trigger {
  padding-right: 58px;
}

.su-cascader__value {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-cascader__placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-cascader__clear {
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

.su-cascader__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-cascader__arrow {
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

.su-cascader.is-open .su-cascader__arrow {
  transform: translateY(-35%) rotate(225deg);
}

.su-cascader.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-cascader.is-disabled .su-cascader__trigger {
  cursor: not-allowed;
}

.su-cascader__panel {
  position: fixed;
  z-index: 2100;
  display: flex;
  max-width: min(720px, calc(100vw - var(--su-space-xl) * 2));
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow: hidden;
}

.su-cascader__columns {
  display: flex;
  max-width: 100%;
  overflow: auto;
}

.su-cascader__column {
  display: grid;
  align-content: start;
  flex: none;
  width: 184px;
  max-height: 264px;
  padding: var(--su-space-xs);
  overflow: auto;
}

.su-cascader__column + .su-cascader__column {
  border-left: 1px solid var(--su-color-border);
}

.su-cascader__option {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  width: 100%;
  min-height: 32px;
  padding: 0 var(--su-space-sm) 0 var(--su-space-md);
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

.su-cascader__option:hover:not(:disabled),
.su-cascader__option.is-active:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-cascader__option.is-selected:not(:disabled) {
  color: var(--su-color-primary);
  font-weight: 600;
}

.su-cascader__option:disabled,
.su-cascader__option.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-cascader__option-label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-cascader__option-arrow {
  flex: none;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(-45deg);
}

.su-cascader__empty {
  min-width: 184px;
  min-height: 72px;
  padding: var(--su-space-lg);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-cascader-enter-active,
.su-cascader-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-cascader-enter-from,
.su-cascader-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
