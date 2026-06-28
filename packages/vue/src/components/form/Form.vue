<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { formKey, type FormLabelPosition, type FormSize } from './context'

defineOptions({
  name: 'SuForm',
})

const props = withDefaults(
  defineProps<{
    labelWidth?: number | string
    labelPosition?: FormLabelPosition
    size?: FormSize
    disabled?: boolean
    inline?: boolean
    validateOnSubmit?: boolean
  }>(),
  {
    labelWidth: undefined,
    labelPosition: 'right',
    size: 'medium',
    disabled: false,
    inline: false,
    validateOnSubmit: true,
  },
)

const emit = defineEmits<{
  submit: [event: SubmitEvent]
  reset: [event: Event]
}>()

const formRef = ref<HTMLFormElement>()

const labelWidth = computed(() => props.labelWidth)
const labelPosition = computed(() => props.labelPosition)
const size = computed(() => props.size)
const disabled = computed(() => props.disabled)

const formStyle = computed(() => {
  if (props.labelWidth === undefined) {
    return undefined
  }

  const width = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth

  return {
    '--su-form-label-width': width,
  }
})

function handleSubmit(event: SubmitEvent) {
  if (props.validateOnSubmit && !formRef.value?.checkValidity()) {
    return
  }

  emit('submit', event)
}

function handleReset(event: Event) {
  emit('reset', event)
}

function submit() {
  formRef.value?.requestSubmit()
}

function reset() {
  formRef.value?.reset()
}

function checkValidity() {
  return formRef.value?.checkValidity() ?? true
}

function reportValidity() {
  return formRef.value?.reportValidity() ?? true
}

provide(formKey, {
  labelWidth,
  labelPosition,
  size,
  disabled,
})

defineExpose({
  ref: formRef,
  submit,
  reset,
  checkValidity,
  reportValidity,
})
</script>

<template>
  <form
    ref="formRef"
    class="su-form"
    :class="[
      `su-form--${size}`,
      `su-form--label-${labelPosition}`,
      {
        'is-inline': inline,
        'is-disabled': disabled,
      },
    ]"
    :style="formStyle"
    :novalidate="!validateOnSubmit || undefined"
    @submit="handleSubmit"
    @reset="handleReset"
  >
    <fieldset class="su-form__fieldset" :disabled="disabled || undefined">
      <slot />
    </fieldset>
  </form>
</template>

<style>
.su-form {
  --su-form-label-width: 96px;
  --su-form-item-gap: var(--su-space-md);

  display: block;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-form--small {
  --su-form-item-gap: var(--su-space-sm);

  font-size: var(--su-font-size-sm);
}

.su-form--large {
  --su-form-item-gap: var(--su-space-lg);

  font-size: var(--su-font-size-lg);
}

.su-form__fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--su-form-item-gap);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.su-form.is-inline .su-form__fieldset {
  align-items: flex-start;
  flex-flow: row wrap;
}

.su-form.is-disabled {
  opacity: 0.72;
}
</style>
