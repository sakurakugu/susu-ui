<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'

defineOptions({
  name: 'SuInput',
  inheritAttrs: false,
})

type InputSize = 'small' | 'medium' | 'large'
type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'id-card'

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
    name?: string
    id?: string
    autocomplete?: string
    minlength?: number | string
    maxlength?: number | string
  }>(),
  {
    type: 'text',
    size: 'medium',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    name: undefined,
    id: undefined,
    autocomplete: undefined,
    minlength: undefined,
    maxlength: undefined,
  },
)

const emit = defineEmits<{
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement>()

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    `${model.value}`.length > 0,
)

const nativeInputType = computed(() =>
  props.type === 'id-card' ? 'text' : props.type,
)

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

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  model.value = props.type === 'number' ? target.valueAsNumber : target.value
  updateCustomValidity(target)
  emit('input', event)
}

function handleChange(event: Event) {
  updateCustomValidity(event.target as HTMLInputElement)
  emit('change', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  updateCustomValidity(event.target as HTMLInputElement)
  emit('blur', event)
}

function clearValue() {
  model.value = ''
  updateCustomValidity()
  emit('clear')
}

watch(
  () => [props.type, model.value],
  () => updateCustomValidity(),
  { flush: 'post' },
)

onMounted(() => updateCustomValidity())
</script>

<template>
  <label
    class="su-input"
    :class="[
      `su-input--${size}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
        'has-prefix': $slots.prefix,
        'has-suffix': $slots.suffix || showClear,
      },
    ]"
  >
    <span v-if="$slots.prefix" class="su-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-input__inner"
      :type="nativeInputType"
      :value="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
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
    <span v-if="$slots.suffix" class="su-input__suffix">
      <slot name="suffix" />
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
.su-input__suffix {
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

.su-input__clear {
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

.su-input__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
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
