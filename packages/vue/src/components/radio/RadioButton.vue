<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue'
import { formKey, type FormSize } from '../form/context'
import { radioGroupKey, type RadioValue } from './context'

defineOptions({
  name: 'SuRadioButton',
  inheritAttrs: false,
})

const model = defineModel<RadioValue | undefined>()

const props = withDefaults(
  defineProps<{
    value: RadioValue
    label?: string
    size?: FormSize
    disabled?: boolean
    name?: string
    id?: string
    required?: boolean
  }>(),
  {
    label: undefined,
    size: undefined,
    disabled: false,
    name: undefined,
    id: undefined,
    required: false,
  },
)

const emit = defineEmits<{
  change: [value: RadioValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const radioGroup = inject(radioGroupKey, undefined)
const inputRef = ref<HTMLInputElement>()

const mergedModel = computed(() => radioGroup?.modelValue.value ?? model.value)

const mergedSize = computed(
  () => props.size ?? radioGroup?.size.value ?? form?.size.value ?? 'medium',
)

const mergedDisabled = computed(
  () =>
    props.disabled ||
    Boolean(radioGroup?.disabled.value) ||
    Boolean(form?.disabled.value),
)

const mergedName = computed(() => props.name ?? radioGroup?.name.value)

const checked = computed(() => mergedModel.value === props.value)

function handleChange(event: Event) {
  if (mergedDisabled.value) {
    return
  }

  if (radioGroup) {
    radioGroup.change(props.value, event)
  } else {
    model.value = props.value
    emit('change', props.value, event)
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
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
})
</script>

<template>
  <label
    class="su-radio-button"
    :class="[
      `su-radio-button--${mergedSize}`,
      {
        'is-checked': checked,
        'is-disabled': mergedDisabled,
      },
    ]"
  >
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-radio-button__input"
      type="radio"
      :checked="checked"
      :disabled="mergedDisabled"
      :name="mergedName"
      :value="value"
      :required="required"
      :aria-checked="checked"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span class="su-radio-button__dot" aria-hidden="true">
      <span class="su-radio-button__mark" />
    </span>
    <span v-if="$slots.default || label" class="su-radio-button__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style>
.su-radio-button {
  --su-radio-size: 16px;
  --su-radio-mark-size: 8px;

  display: inline-flex;
  align-items: center;
  gap: var(--su-space-sm);
  max-width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
  cursor: pointer;
}

.su-radio-button--small {
  --su-radio-size: 14px;
  --su-radio-mark-size: 6px;

  font-size: var(--su-font-size-sm);
}

.su-radio-button--large {
  --su-radio-size: 18px;
  --su-radio-mark-size: 10px;

  font-size: var(--su-font-size-lg);
}

.su-radio-button__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-radio-button__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--su-radio-size);
  height: var(--su-radio-size);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-elevated);
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-radio-button__mark {
  width: var(--su-radio-mark-size);
  height: var(--su-radio-mark-size);
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary-text);
  opacity: 0;
  transform: scale(0.64);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-radio-button.is-checked .su-radio-button__dot {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-radio-button.is-checked .su-radio-button__mark {
  opacity: 1;
  transform: scale(1);
}

.su-radio-button__input:focus-visible + .su-radio-button__dot {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-radio-button__label {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-radio-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .su-radio-button__dot,
  .su-radio-button__mark {
    transition: none;
  }
}
</style>
