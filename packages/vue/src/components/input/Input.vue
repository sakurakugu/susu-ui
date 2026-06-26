<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'

defineOptions({
  name: 'SuInput',
  inheritAttrs: false,
})

type InputSize = 'small' | 'medium' | 'large'
type InputStatus = 'default' | 'success' | 'warning' | 'error'
type InputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'
type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'id-card'
  | 'textarea'

const model = defineModel<string | number>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    showPassword?: boolean
    showWordLimit?: boolean
    clearFocus?: boolean
    selectOnFocus?: boolean
    trim?: boolean
    status?: InputStatus
    allowInput?: (value: string, event: Event) => boolean
    formatter?: (value: string | number) => string
    parser?: (value: string) => string | number
    name?: string
    id?: string
    autocomplete?: string
    inputmode?: InputMode
    pattern?: string
    required?: boolean
    minlength?: number | string
    maxlength?: number | string
    min?: number | string
    max?: number | string
    step?: number | string
    rows?: number | string
    autosize?: boolean
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  }>(),
  {
    type: 'text',
    size: 'medium',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    showPassword: false,
    showWordLimit: false,
    clearFocus: false,
    selectOnFocus: false,
    trim: false,
    status: 'default',
    allowInput: undefined,
    formatter: undefined,
    parser: undefined,
    name: undefined,
    id: undefined,
    autocomplete: undefined,
    inputmode: undefined,
    pattern: undefined,
    required: false,
    minlength: undefined,
    maxlength: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
    rows: 2,
    autosize: false,
    resize: undefined,
  },
)

const emit = defineEmits<{
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  enter: [event: KeyboardEvent]
  invalid: [event: Event]
  compositionstart: [event: CompositionEvent]
  compositionend: [event: CompositionEvent]
}>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()
const passwordVisible = ref(false)
const isComposing = ref(false)

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    `${model.value}`.length > 0,
)

const isTextarea = computed(() => props.type === 'textarea')

const nativeInputType = computed(() =>
  props.type === 'id-card' || props.type === 'textarea'
    ? 'text'
    : props.showPassword && props.type === 'password' && passwordVisible.value
      ? 'text'
      : props.type,
)

const modelText = computed(() => `${model.value ?? ''}`)

const displayValue = computed(() =>
  props.formatter ? props.formatter(model.value) : model.value,
)

const showPasswordToggle = computed(
  () =>
    props.showPassword &&
    props.type === 'password' &&
    !props.disabled &&
    !props.readonly,
)

const showWordLimit = computed(
  () => props.showWordLimit && props.maxlength !== undefined,
)

const wordLimitText = computed(
  () => `${modelText.value.length}/${props.maxlength}`,
)

const textareaStyle = computed(() => ({
  resize: props.resize,
}))

function validateIdCard(value: string) {
  const normalizedValue = value.toUpperCase()

  if (!normalizedValue) {
    return true
  }

  if (
    !/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(
      normalizedValue,
    )
  ) {
    return false
  }

  const birthDate = normalizedValue.slice(6, 14)
  const year = Number(birthDate.slice(0, 4))
  const month = Number(birthDate.slice(4, 6))
  const day = Number(birthDate.slice(6, 8))
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false
  }

  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const sum = weights.reduce(
    (total, weight, index) => total + Number(normalizedValue[index]) * weight,
    0,
  )

  return codes[sum % 11] === normalizedValue[17]
}

function updateCustomValidity(target = inputRef.value) {
  if (!target) {
    return
  }

  if (props.type !== 'id-card' || validateIdCard(target.value)) {
    target.setCustomValidity('')
    return
  }

  target.setCustomValidity('请输入有效的中国居民身份证号码')
}

function adjustTextareaHeight(target = inputRef.value) {
  if (!props.autosize || !target || !isTextarea.value) {
    return
  }

  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}

function getNormalizedValue(value: string) {
  return props.trim ? value.trim() : value
}

function restoreDisplayValue(target: HTMLInputElement | HTMLTextAreaElement) {
  target.value = `${displayValue.value ?? ''}`
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const normalizedValue = getNormalizedValue(target.value)

  if (
    props.allowInput &&
    !props.allowInput(normalizedValue, event) &&
    !isComposing.value
  ) {
    restoreDisplayValue(target)
    return
  }

  const parsedValue =
    props.parser && !isComposing.value
      ? props.parser(normalizedValue)
      : normalizedValue
  model.value =
    props.type === 'number' && target instanceof HTMLInputElement
      ? Number(parsedValue)
      : parsedValue
  updateCustomValidity(target)
  adjustTextareaHeight(target)
  emit('input', event)
}

function handleChange(event: Event) {
  updateCustomValidity(event.target as HTMLInputElement | HTMLTextAreaElement)
  emit('change', event)
}

function handleFocus(event: FocusEvent) {
  if (props.selectOnFocus) {
    select()
  }

  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  updateCustomValidity(event.target as HTMLInputElement | HTMLTextAreaElement)
  emit('blur', event)
}

function clearValue() {
  model.value = ''
  updateCustomValidity()
  adjustTextareaHeight()
  emit('clear')

  if (props.clearFocus) {
    focus()
  }
}

function handleEnter(event: KeyboardEvent) {
  emit('enter', event)
}

function handleInvalid(event: Event) {
  emit('invalid', event)
}

function handleCompositionStart(event: CompositionEvent) {
  isComposing.value = true
  emit('compositionstart', event)
}

function handleCompositionEnd(event: CompositionEvent) {
  isComposing.value = false
  handleInput(event)
  emit('compositionend', event)
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

function select() {
  inputRef.value?.select()
}

watch(
  () => [props.type, model.value],
  () => {
    updateCustomValidity()
    adjustTextareaHeight()
  },
  { flush: 'post' },
)

onMounted(() => {
  updateCustomValidity()
  adjustTextareaHeight()
})

defineExpose({
  ref: inputRef,
  focus,
  blur,
  select,
  clear: clearValue,
})
</script>

<template>
  <label
    class="su-input"
    :class="[
      `su-input--${size}`,
      `su-input--${status}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
        'is-textarea': isTextarea,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
        'has-prefix': $slots.prefix,
        'has-suffix':
          $slots.suffix || showClear || showPasswordToggle || showWordLimit,
      },
    ]"
  >
    <span v-if="$slots.prepend" class="su-input__prepend">
      <slot name="prepend" />
    </span>
    <span v-if="$slots.prefix" class="su-input__prefix">
      <slot name="prefix" />
    </span>
    <textarea
      v-if="isTextarea"
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-input__inner su-input__textarea"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :pattern="pattern"
      :required="required"
      :minlength="minlength"
      :maxlength="maxlength"
      :rows="rows"
      :style="textareaStyle"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @invalid="handleInvalid"
      @keydown.enter="handleEnter"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />
    <input
      v-else
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-input__inner"
      :type="nativeInputType"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :pattern="pattern"
      :required="required"
      :minlength="minlength"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @invalid="handleInvalid"
      @keydown.enter="handleEnter"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />
    <button
      v-if="showClear"
      class="su-input__clear"
      type="button"
      aria-label="清空输入"
      @click="clearValue"
    >
      &times;
    </button>
    <button
      v-if="showPasswordToggle"
      class="su-input__password"
      type="button"
      :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
      @click="togglePasswordVisible"
    >
      {{ passwordVisible ? '隐' : '显' }}
    </button>
    <span v-if="showWordLimit" class="su-input__word-limit">
      {{ wordLimitText }}
    </span>
    <span v-if="$slots.suffix" class="su-input__suffix">
      <slot name="suffix" />
    </span>
    <span v-if="$slots.append" class="su-input__append">
      <slot name="append" />
    </span>
  </label>
</template>

<style>
.su-input {
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
    box-shadow 0.16s ease;
}

.su-input:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-input:focus-within {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-input--success {
  border-color: #16a34a;
}

.su-input--success:focus-within {
  border-color: #15803d;
}

.su-input--warning {
  border-color: #d97706;
}

.su-input--warning:focus-within {
  border-color: #b45309;
}

.su-input--error {
  border-color: #dc2626;
}

.su-input--error:focus-within {
  border-color: #b91c1c;
}

.su-input--small {
  min-height: 24px;
  font-size: var(--su-font-size-sm);
}

.su-input--medium {
  min-height: 32px;
  font-size: var(--su-font-size-md);
}

.su-input--large {
  min-height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-input__inner {
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

.su-input--small .su-input__inner {
  padding: 0 var(--su-space-sm);
}

.su-input--medium .su-input__inner {
  padding: 0 var(--su-space-md);
}

.su-input--large .su-input__inner {
  padding: 0 var(--su-space-lg);
}

.su-input.is-textarea {
  align-items: flex-start;
}

.su-input.is-textarea .su-input__inner {
  padding-top: var(--su-space-sm);
  padding-bottom: var(--su-space-sm);
  line-height: var(--su-font-line-height);
}

.su-input__textarea {
  min-height: 64px;
}

.su-input.has-prefix .su-input__inner {
  padding-left: var(--su-space-xs);
}

.su-input.has-suffix .su-input__inner {
  padding-right: var(--su-space-xs);
}

.su-input__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-input__prefix,
.su-input__suffix,
.su-input__prepend,
.su-input__append {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: var(--su-color-text-muted);
}

.su-input__prefix {
  padding-left: var(--su-space-md);
}

.su-input__suffix {
  padding-right: var(--su-space-md);
}

.su-input__prepend,
.su-input__append {
  align-self: stretch;
  padding: 0 var(--su-space-md);
  background: var(--su-color-bg-soft);
}

.su-input__prepend {
  border-right: 1px solid var(--su-color-border);
}

.su-input__append {
  border-left: 1px solid var(--su-color-border);
}

.su-input.has-prepend .su-input__inner {
  padding-left: var(--su-space-sm);
}

.su-input.has-append .su-input__inner {
  padding-right: var(--su-space-sm);
}

.su-input__clear,
.su-input__password {
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

.su-input__clear:hover,
.su-input__password:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-input__word-limit {
  display: inline-flex;
  align-items: center;
  flex: none;
  padding-right: var(--su-space-md);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  white-space: nowrap;
}

.su-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-input.is-disabled .su-input__inner {
  cursor: not-allowed;
}

.su-input.is-readonly .su-input__inner {
  cursor: default;
}
</style>
