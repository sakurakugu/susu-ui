<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuTagInput',
  inheritAttrs: false,
})

export type TagInputSize = FormSize
export type TagInputStatus = FormItemStatus

const model = defineModel<string[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    size?: TagInputSize
    status?: TagInputStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    allowDuplicate?: boolean
    addOnBlur?: boolean
    trim?: boolean
    max?: number
    maxlength?: number | string
    separators?: string[]
    validateTag?: (tag: string, tags: string[]) => boolean
    name?: string
    id?: string
    autocomplete?: string
    inputmode?:
      | 'none'
      | 'text'
      | 'tel'
      | 'url'
      | 'email'
      | 'numeric'
      | 'decimal'
      | 'search'
  }>(),
  {
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    allowDuplicate: false,
    addOnBlur: true,
    trim: true,
    max: undefined,
    maxlength: undefined,
    separators: () => ['Enter', ','],
    validateTag: undefined,
    name: undefined,
    id: undefined,
    autocomplete: 'off',
    inputmode: undefined,
  },
)

const emit = defineEmits<{
  add: [tag: string]
  remove: [tag: string, index: number]
  clear: []
  input: [value: string, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  invalid: [value: string]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const inputRef = ref<HTMLInputElement>()
const inputValue = ref('')
const isComposing = ref(false)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isLimitReached = computed(
  () => props.max !== undefined && model.value.length >= props.max,
)
const canEdit = computed(
  () => !mergedDisabled.value && !props.readonly && !isLimitReached.value,
)
const showClear = computed(
  () =>
    props.clearable &&
    !mergedDisabled.value &&
    !props.readonly &&
    model.value.length > 0,
)
const inputPlaceholder = computed(() =>
  model.value.length === 0 ? props.placeholder : undefined,
)

function normalizeTag(value: string) {
  return props.trim ? value.trim() : value
}

function isValidTag(tag: string) {
  if (!tag) {
    return false
  }

  if (!props.allowDuplicate && model.value.includes(tag)) {
    return false
  }

  if (isLimitReached.value) {
    return false
  }

  return props.validateTag ? props.validateTag(tag, model.value) : true
}

function addTag(value = inputValue.value) {
  const tag = normalizeTag(value)

  if (!isValidTag(tag)) {
    if (tag) {
      emit('invalid', tag)
    }
    inputValue.value = ''
    return false
  }

  model.value = [...model.value, tag]
  inputValue.value = ''
  emit('add', tag)
  return true
}

function removeTag(index: number) {
  if (mergedDisabled.value || props.readonly) {
    return
  }

  const nextTags = [...model.value]
  const [tag] = nextTags.splice(index, 1)

  if (tag === undefined) {
    return
  }

  model.value = nextTags
  emit('remove', tag, index)
  void nextTick(() => inputRef.value?.focus())
}

function clearTags() {
  if (mergedDisabled.value || props.readonly) {
    return
  }

  model.value = []
  inputValue.value = ''
  emit('clear')
  void nextTick(() => inputRef.value?.focus())
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('input', inputValue.value, event)
}

function handleKeydown(event: KeyboardEvent) {
  if (isComposing.value) {
    return
  }

  if (props.separators.includes(event.key)) {
    event.preventDefault()
    addTag()
    return
  }

  if (
    event.key === 'Backspace' &&
    !inputValue.value &&
    model.value.length > 0
  ) {
    event.preventDefault()
    removeTag(model.value.length - 1)
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  if (props.addOnBlur && inputValue.value && canEdit.value) {
    addTag()
  }

  emit('blur', event)
}

function handleCompositionStart() {
  isComposing.value = true
}

function handleCompositionEnd() {
  isComposing.value = false
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

defineExpose({
  ref: inputRef,
  focus,
  blur,
  clear: clearTags,
})
</script>

<template>
  <label
    class="su-tag-input"
    :class="[
      `su-tag-input--${mergedSize}`,
      `su-tag-input--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-limit-reached': isLimitReached,
        'is-clearable': showClear,
      },
    ]"
  >
    <span v-if="$slots.prefix" class="su-tag-input__prefix">
      <slot name="prefix" />
    </span>
    <span class="su-tag-input__tags">
      <span
        v-for="(tag, index) in model"
        :key="`${tag}-${index}`"
        class="su-tag-input__tag"
      >
        <slot
          name="tag"
          :tag="tag"
          :index="index"
          :remove="() => removeTag(index)"
        >
          <span class="su-tag-input__tag-text">{{ tag }}</span>
        </slot>
        <button
          v-if="!mergedDisabled && !readonly"
          class="su-tag-input__tag-close"
          type="button"
          :aria-label="`移除标签 ${tag}`"
          @click="removeTag(index)"
        >
          &times;
        </button>
      </span>
      <input
        v-bind="attrs"
        :id="id"
        ref="inputRef"
        class="su-tag-input__inner"
        type="text"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        :disabled="mergedDisabled || isLimitReached"
        :readonly="readonly"
        :name="name"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />
    </span>
    <button
      v-if="showClear"
      class="su-tag-input__clear"
      type="button"
      aria-label="清空标签"
      @click="clearTags"
    >
      &times;
    </button>
    <span v-if="$slots.suffix" class="su-tag-input__suffix">
      <slot name="suffix" />
    </span>
  </label>
</template>

<style>
.su-tag-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
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

.su-tag-input:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-tag-input:focus-within {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-tag-input--success {
  border-color: #16a34a;
}

.su-tag-input--success:focus-within {
  border-color: #15803d;
}

.su-tag-input--warning {
  border-color: #d97706;
}

.su-tag-input--warning:focus-within {
  border-color: #b45309;
}

.su-tag-input--error {
  border-color: #dc2626;
}

.su-tag-input--error:focus-within {
  border-color: #b91c1c;
}

.su-tag-input--small {
  min-height: 28px;
  font-size: var(--su-font-size-sm);
}

.su-tag-input--medium {
  min-height: 36px;
  font-size: var(--su-font-size-md);
}

.su-tag-input--large {
  min-height: 46px;
  font-size: var(--su-font-size-lg);
}

.su-tag-input__tags {
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  min-width: 0;
  gap: var(--su-space-xs);
}

.su-tag-input--small .su-tag-input__tags {
  padding: 2px var(--su-space-sm);
}

.su-tag-input--medium .su-tag-input__tags {
  padding: 3px var(--su-space-md);
}

.su-tag-input--large .su-tag-input__tags {
  padding: 5px var(--su-space-lg);
}

.su-tag-input__tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-height: 22px;
  padding: 0 var(--su-space-xs);
  border: 1px solid
    color-mix(in srgb, var(--su-color-primary) 28%, var(--su-color-border));
  border-radius: var(--su-radius-sm);
  color: var(--su-color-primary);
  background: color-mix(
    in srgb,
    var(--su-color-primary-soft) 72%,
    var(--su-color-bg-elevated)
  );
  font-size: var(--su-font-size-sm);
}

.su-tag-input__tag-text {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-tag-input__tag-close,
.su-tag-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border: 0;
  border-radius: var(--su-radius-round);
  color: currentcolor;
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-tag-input__tag-close {
  width: 1.25em;
  height: 1.25em;
  margin-left: var(--su-space-xs);
  padding: 0;
  opacity: 0.82;
}

.su-tag-input__tag-close:hover {
  background: color-mix(in srgb, currentcolor 12%, transparent);
  opacity: 1;
}

.su-tag-input__inner {
  min-width: 96px;
  flex: 1;
  width: 96px;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}

.su-tag-input__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-tag-input__clear {
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-sm);
  padding: 0;
  color: var(--su-color-text-muted);
}

.su-tag-input__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-tag-input__prefix,
.su-tag-input__suffix {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: var(--su-color-text-muted);
}

.su-tag-input__prefix {
  padding-left: var(--su-space-md);
}

.su-tag-input__suffix {
  padding-right: var(--su-space-md);
}

.su-tag-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-tag-input.is-disabled .su-tag-input__inner,
.su-tag-input.is-limit-reached .su-tag-input__inner {
  cursor: not-allowed;
}

.su-tag-input.is-readonly .su-tag-input__inner {
  cursor: default;
}
</style>
