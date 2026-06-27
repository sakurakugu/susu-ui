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
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuMention',
  inheritAttrs: false,
})

export interface MentionOption {
  label: string
  value: string
  disabled?: boolean
  avatar?: string
  description?: string
}

type MentionType = 'text' | 'textarea'

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    options?: MentionOption[]
    size?: FormSize
    status?: FormItemStatus
    type?: MentionType
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    filterable?: boolean
    prefix?: string
    split?: string
    placement?: 'bottom' | 'top'
    emptyText?: string
    name?: string
    id?: string
    autocomplete?: string
    required?: boolean
    rows?: number | string
    maxlength?: number | string
    fetchSuggestions?: (query: string, prefix: string) => MentionOption[]
  }>(),
  {
    options: undefined,
    size: undefined,
    status: 'default',
    type: 'text',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    filterable: true,
    prefix: '@',
    split: ' ',
    placement: 'bottom',
    emptyText: '暂无匹配成员',
    name: undefined,
    id: undefined,
    autocomplete: 'off',
    required: false,
    rows: 3,
    maxlength: undefined,
    fetchSuggestions: undefined,
  },
)

const emit = defineEmits<{
  input: [value: string, event: Event]
  change: [value: string, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  select: [option: MentionOption, value: string]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()
const panelRef = ref<HTMLElement>()
const innerVisible = ref(false)
const activeIndex = ref(-1)
const query = ref('')
const mentionStart = ref(-1)
const panelStyle = ref<CSSProperties>({})
const listboxId = `su-mention-${useId()}`

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const isTextarea = computed(() => props.type === 'textarea')

const suggestions = computed(() => {
  if (props.fetchSuggestions) {
    return props.fetchSuggestions(query.value, props.prefix)
  }

  const options = props.options ?? []

  if (!props.filterable || !query.value) {
    return options
  }

  const normalizedQuery = query.value.toLowerCase()
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(normalizedQuery) ||
      option.value.toLowerCase().includes(normalizedQuery),
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
    mentionStart.value >= 0 &&
    (suggestions.value.length > 0 || Boolean(props.emptyText)),
)

const showClear = computed(
  () =>
    props.clearable &&
    !mergedDisabled.value &&
    !props.readonly &&
    model.value.length > 0,
)

const activeOption = computed(() =>
  activeIndex.value >= 0 ? suggestions.value[activeIndex.value] : undefined,
)

function getInputElement() {
  return inputRef.value
}

function updatePosition() {
  const root = rootRef.value
  const panel = panelRef.value

  if (!root || !panel || !visible.value) {
    return
  }

  const rect = root.getBoundingClientRect()
  const top =
    props.placement === 'top'
      ? rect.top - panel.offsetHeight - 6
      : rect.bottom + 6

  panelStyle.value = {
    top: `${Math.max(8, top)}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

function closePanel() {
  innerVisible.value = false
  activeIndex.value = -1
  mentionStart.value = -1
  query.value = ''
}

function findMentionRange(value: string, cursor: number) {
  const beforeCursor = value.slice(0, cursor)
  const start = beforeCursor.lastIndexOf(props.prefix)

  if (start < 0) {
    return undefined
  }

  const queryText = beforeCursor.slice(start + props.prefix.length)

  if (/\s/.test(queryText)) {
    return undefined
  }

  return {
    start,
    queryText,
  }
}

function openPanelByCursor() {
  const input = getInputElement()

  if (!input || mergedDisabled.value || props.readonly) {
    return
  }

  const cursor = input.selectionStart ?? model.value.length
  const range = findMentionRange(model.value, cursor)

  if (!range) {
    closePanel()
    return
  }

  mentionStart.value = range.start
  query.value = range.queryText
  innerVisible.value = true
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

function selectOption(option: MentionOption) {
  const input = getInputElement()

  if (option.disabled || !input || mentionStart.value < 0) {
    return
  }

  const cursor = input.selectionStart ?? model.value.length
  const beforeMention = model.value.slice(0, mentionStart.value)
  const afterMention = model.value
    .slice(cursor)
    .replace(
      new RegExp(`^${props.split.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      '',
    )
  const mentionText = `${props.prefix}${option.value}${props.split}`
  const nextValue = `${beforeMention}${mentionText}${afterMention}`
  const nextCursor = beforeMention.length + mentionText.length

  model.value = nextValue
  emit('select', option, nextValue)
  closePanel()

  void nextTick(() => {
    input.focus()
    input.setSelectionRange(nextCursor, nextCursor)
  })
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  model.value = target.value
  openPanelByCursor()
  emit('input', target.value, event)
}

function handleChange(event: Event) {
  emit('change', model.value, event)
}

function handleFocus(event: FocusEvent) {
  openPanelByCursor()
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
    openPanelByCursor()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    openPanelByCursor()
    moveActive(-1)
    return
  }

  if (event.key === 'Enter' && visible.value && activeOption.value) {
    event.preventDefault()
    selectOption(activeOption.value)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}

function handleSelect() {
  openPanelByCursor()
}

function clearValue() {
  model.value = ''
  closePanel()
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
    class="su-mention"
    :class="[
      `su-mention--${mergedSize}`,
      `su-mention--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-open': visible,
        'is-textarea': isTextarea,
        'is-clearable': showClear,
      },
    ]"
  >
    <textarea
      v-if="isTextarea"
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-mention__inner su-mention__textarea"
      :value="model"
      :placeholder="placeholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      role="combobox"
      :aria-controls="visible ? listboxId : undefined"
      :aria-expanded="visible"
      aria-autocomplete="list"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @click="handleSelect"
      @select="handleSelect"
    />
    <input
      v-else
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-mention__inner"
      type="text"
      :value="model"
      :placeholder="placeholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      :maxlength="maxlength"
      role="combobox"
      :aria-controls="visible ? listboxId : undefined"
      :aria-expanded="visible"
      aria-autocomplete="list"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @click="handleSelect"
      @select="handleSelect"
    />
    <button
      v-if="showClear"
      class="su-mention__clear"
      type="button"
      aria-label="清空输入"
      @click="clearValue"
    >
      &times;
    </button>
  </span>
  <Teleport to="body">
    <Transition name="su-mention">
      <div
        v-if="visible"
        :id="listboxId"
        ref="panelRef"
        class="su-mention__panel"
        :style="panelStyle"
        role="listbox"
      >
        <button
          v-for="(option, index) in suggestions"
          :key="option.value"
          class="su-mention__option"
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
          @click="selectOption(option)"
        >
          <slot name="option" :option="option" :query="query">
            <span v-if="option.avatar" class="su-mention__avatar">
              <img :src="option.avatar" :alt="option.label" />
            </span>
            <span class="su-mention__content">
              <span class="su-mention__label">{{ option.label }}</span>
              <span v-if="option.description" class="su-mention__description">
                {{ option.description }}
              </span>
            </span>
          </slot>
        </button>
        <div v-if="suggestions.length === 0" class="su-mention__empty">
          <slot name="empty">{{ emptyText }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-mention {
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

.su-mention:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-mention:focus-within,
.su-mention.is-open {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-mention--success {
  border-color: #16a34a;
}

.su-mention--success:focus-within {
  border-color: #15803d;
}

.su-mention--warning {
  border-color: #d97706;
}

.su-mention--warning:focus-within {
  border-color: #b45309;
}

.su-mention--error {
  border-color: #dc2626;
}

.su-mention--error:focus-within {
  border-color: #b91c1c;
}

.su-mention--small {
  min-height: 24px;
  font-size: var(--su-font-size-sm);
}

.su-mention--medium {
  min-height: 32px;
  font-size: var(--su-font-size-md);
}

.su-mention--large {
  min-height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-mention__inner {
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

.su-mention--small .su-mention__inner {
  padding: 0 var(--su-space-sm);
}

.su-mention--medium .su-mention__inner {
  padding: 0 var(--su-space-md);
}

.su-mention--large .su-mention__inner {
  padding: 0 var(--su-space-lg);
}

.su-mention.is-clearable .su-mention__inner {
  padding-right: var(--su-space-xs);
}

.su-mention.is-textarea {
  align-items: flex-start;
}

.su-mention.is-textarea .su-mention__inner {
  padding-top: var(--su-space-sm);
  padding-bottom: var(--su-space-sm);
  line-height: var(--su-font-line-height);
}

.su-mention__textarea {
  min-height: 72px;
  resize: vertical;
}

.su-mention__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-mention__clear {
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

.su-mention__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-mention.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-mention.is-disabled .su-mention__inner {
  cursor: not-allowed;
}

.su-mention.is-readonly .su-mention__inner {
  cursor: default;
}

.su-mention__panel {
  position: fixed;
  z-index: 2100;
  display: grid;
  max-height: 264px;
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

.su-mention__option {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  width: 100%;
  min-height: 40px;
  padding: var(--su-space-xs) var(--su-space-sm);
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

.su-mention__option:hover:not(:disabled),
.su-mention__option.is-active:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-mention__option:disabled,
.su-mention__option.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-mention__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-soft);
  overflow: hidden;
}

.su-mention__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.su-mention__content {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.su-mention__label,
.su-mention__description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-mention__description {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-mention__empty {
  min-height: 32px;
  padding: var(--su-space-sm) var(--su-space-md);
  color: var(--su-color-text-muted);
}

.su-mention-enter-active,
.su-mention-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-mention-enter-from,
.su-mention-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
