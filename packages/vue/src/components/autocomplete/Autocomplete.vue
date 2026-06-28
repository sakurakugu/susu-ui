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
  name: 'SuAutocomplete',
  inheritAttrs: false,
})

export type AutocompleteValue = string | number

export interface AutocompleteOption {
  label: string
  value: AutocompleteValue
  disabled?: boolean
}

const model = defineModel<AutocompleteValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    options?: AutocompleteOption[]
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    filterable?: boolean
    fetchSuggestions?: (query: string) => AutocompleteOption[]
    emptyText?: string
    name?: string
    id?: string
    autocomplete?: string
    required?: boolean
  }>(),
  {
    options: undefined,
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    filterable: true,
    fetchSuggestions: undefined,
    emptyText: undefined,
    name: undefined,
    id: undefined,
    autocomplete: 'off',
    required: false,
  },
)

const emit = defineEmits<{
  input: [value: string, event: Event]
  change: [value: AutocompleteValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  select: [option: AutocompleteOption]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const panelRef = ref<HTMLElement>()
const locale = useLocale()
const innerVisible = ref(false)
const activeIndex = ref(-1)
const panelStyle = ref<CSSProperties>({})
const listboxId = `su-autocomplete-${useId()}`

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedEmptyText = computed(
  () => props.emptyText ?? locale.value.autocomplete.empty,
)

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const modelText = computed(() => `${model.value ?? ''}`)

const suggestions = computed(() => {
  const query = modelText.value

  if (props.fetchSuggestions) {
    return props.fetchSuggestions(query)
  }

  const options = props.options ?? []

  if (!props.filterable || !query) {
    return options
  }

  const normalizedQuery = query.toLowerCase()
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(normalizedQuery) ||
      `${option.value}`.toLowerCase().includes(normalizedQuery),
  )
})

const enabledSuggestions = computed(() =>
  suggestions.value.filter((option) => !option.disabled),
)

const visible = computed(
  () =>
    innerVisible.value &&
    !mergedDisabled.value &&
    !props.readonly &&
    (suggestions.value.length > 0 || Boolean(mergedEmptyText.value)),
)

const showClear = computed(
  () =>
    props.clearable &&
    !mergedDisabled.value &&
    !props.readonly &&
    modelText.value.length > 0,
)

const activeOption = computed(() =>
  activeIndex.value >= 0 ? suggestions.value[activeIndex.value] : undefined,
)

function updatePosition() {
  const root = rootRef.value
  const panel = panelRef.value

  if (!root || !panel || !visible.value) {
    return
  }

  const rect = root.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

function openPanel() {
  if (mergedDisabled.value || props.readonly) {
    return
  }

  innerVisible.value = true
}

function closePanel() {
  innerVisible.value = false
  activeIndex.value = -1
}

function syncActiveIndex() {
  const active = activeOption.value

  if (!active || !suggestions.value.includes(active) || active.disabled) {
    activeIndex.value = suggestions.value.findIndex(
      (option) => !option.disabled,
    )
  }
}

function moveActive(step: number) {
  if (!visible.value || enabledSuggestions.value.length === 0) {
    return
  }

  const current = activeOption.value
  const enabledIndex = current
    ? enabledSuggestions.value.indexOf(current)
    : step > 0
      ? -1
      : 0
  const nextEnabledIndex =
    (enabledIndex + step + enabledSuggestions.value.length) %
    enabledSuggestions.value.length
  activeIndex.value = suggestions.value.indexOf(
    enabledSuggestions.value[nextEnabledIndex],
  )
}

function selectOption(option: AutocompleteOption, event?: Event) {
  if (option.disabled) {
    return
  }

  model.value = option.value
  emit('select', option)

  if (event) {
    emit('change', option.value, event)
  }

  closePanel()
  void nextTick(() => inputRef.value?.focus())
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  model.value = target.value
  openPanel()
  emit('input', target.value, event)
}

function handleChange(event: Event) {
  emit('change', model.value, event)
}

function handleFocus(event: FocusEvent) {
  openPanel()
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  window.setTimeout(() => {
    if (
      document.activeElement !== inputRef.value &&
      !panelRef.value?.contains(document.activeElement)
    ) {
      closePanel()
    }
  })
  emit('blur', event)
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

  if (event.key === 'Enter' && visible.value && activeOption.value) {
    event.preventDefault()
    selectOption(activeOption.value, event)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}

function clearValue() {
  model.value = ''
  activeIndex.value = -1
  emit('clear')
  void nextTick(() => inputRef.value?.focus())
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node

  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }

  closePanel()
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

watch(visible, async (value) => {
  removeListeners()

  if (value) {
    syncActiveIndex()
    await nextTick()
    updatePosition()
    addListeners()
  }
})

watch(suggestions, () => {
  syncActiveIndex()

  if (visible.value) {
    void nextTick(updatePosition)
  }
})

watch(
  () => [mergedDisabled.value, props.readonly],
  () => {
    if (mergedDisabled.value || props.readonly) {
      closePanel()
    }
  },
)

onBeforeUnmount(removeListeners)

defineExpose({
  ref: inputRef,
  focus,
  blur,
  clear: clearValue,
})
</script>

<template>
  <span
    ref="rootRef"
    class="su-autocomplete"
    :class="[
      `su-autocomplete--${mergedSize}`,
      `su-autocomplete--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-open': visible,
        'is-clearable': showClear,
      },
    ]"
  >
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-autocomplete__inner"
      type="text"
      :value="modelText"
      :placeholder="placeholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      role="combobox"
      :aria-controls="visible ? listboxId : undefined"
      :aria-expanded="visible"
      :aria-autocomplete="filterable ? 'list' : 'none'"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <button
      v-if="showClear"
      class="su-autocomplete__clear"
      type="button"
      :aria-label="locale.autocomplete.clear"
      @click="clearValue"
    >
      &times;
    </button>
  </span>
  <Teleport to="body">
    <Transition name="su-autocomplete">
      <div
        v-if="visible"
        :id="listboxId"
        ref="panelRef"
        class="su-autocomplete__panel"
        :style="panelStyle"
        role="listbox"
      >
        <button
          v-for="(option, index) in suggestions"
          :key="`${option.value}`"
          class="su-autocomplete__option"
          :class="{
            'is-active': index === activeIndex,
            'is-disabled': option.disabled,
          }"
          type="button"
          role="option"
          :aria-selected="index === activeIndex"
          :disabled="option.disabled"
          @mouseenter="activeIndex = index"
          @mousedown.prevent
          @click="selectOption(option, $event)"
        >
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </button>
        <div v-if="suggestions.length === 0" class="su-autocomplete__empty">
          <slot name="empty">{{ mergedEmptyText }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-autocomplete {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;
}

.su-autocomplete:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-autocomplete:focus-within,
.su-autocomplete.is-open {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-autocomplete--success {
  border-color: var(--su-color-success);
}

.su-autocomplete--success:focus-within {
  border-color: var(--su-color-success-active);
}

.su-autocomplete--warning {
  border-color: var(--su-color-warning);
}

.su-autocomplete--warning:focus-within {
  border-color: var(--su-color-warning-active);
}

.su-autocomplete--error {
  border-color: var(--su-color-error);
}

.su-autocomplete--error:focus-within {
  border-color: var(--su-color-error-active);
}

.su-autocomplete--small {
  min-height: 24px;
  font-size: var(--su-font-size-sm);
}

.su-autocomplete--medium {
  min-height: 32px;
  font-size: var(--su-font-size-md);
}

.su-autocomplete--large {
  min-height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-autocomplete__inner {
  min-width: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}

.su-autocomplete--small .su-autocomplete__inner {
  padding: 0 var(--su-space-sm);
}

.su-autocomplete--medium .su-autocomplete__inner {
  padding: 0 var(--su-space-md);
}

.su-autocomplete--large .su-autocomplete__inner {
  padding: 0 var(--su-space-lg);
}

.su-autocomplete.is-clearable .su-autocomplete__inner {
  padding-right: var(--su-space-xs);
}

.su-autocomplete__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-autocomplete__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-sm);
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-autocomplete__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-autocomplete.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-autocomplete.is-disabled .su-autocomplete__inner {
  cursor: not-allowed;
}

.su-autocomplete.is-readonly .su-autocomplete__inner {
  cursor: default;
}

.su-autocomplete__panel {
  position: fixed;
  z-index: 2100;
  display: grid;
  max-height: 248px;
  padding: var(--su-space-xs);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow: auto;
}

.su-autocomplete__option {
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
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-autocomplete__option:hover:not(:disabled),
.su-autocomplete__option.is-active:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-autocomplete__option:disabled,
.su-autocomplete__option.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-autocomplete__empty {
  min-height: 32px;
  padding: var(--su-space-sm) var(--su-space-md);
  color: var(--su-color-text-muted);
}

.su-autocomplete-enter-active,
.su-autocomplete-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-autocomplete-enter-from,
.su-autocomplete-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
