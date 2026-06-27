<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuText',
})

type TextType =
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'muted'
type TextSize = 'small' | 'medium' | 'large'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
type TextTag =
  'span' | 'p' | 'strong' | 'em' | 'small' | 'mark' | 'del' | 'ins' | 'code'

const props = withDefaults(
  defineProps<{
    tag?: TextTag
    type?: TextType
    size?: TextSize
    weight?: TextWeight
    block?: boolean
    ellipsis?: boolean
    lineClamp?: number | string
    underline?: boolean
    delete?: boolean
    italic?: boolean
  }>(),
  {
    tag: 'span',
    type: 'default',
    size: 'medium',
    weight: 'regular',
    block: false,
    ellipsis: false,
    lineClamp: undefined,
    underline: false,
    delete: false,
    italic: false,
  },
)

defineSlots<{
  default?: () => unknown
}>()

const textStyle = computed(() => {
  if (!props.lineClamp) {
    return undefined
  }

  return {
    '--su-text-line-clamp': String(props.lineClamp),
  }
})
</script>

<template>
  <component
    :is="tag"
    class="su-text"
    :class="[
      `su-text--${type}`,
      `su-text--${size}`,
      `su-text--weight-${weight}`,
      {
        'is-block': block,
        'is-ellipsis': ellipsis,
        'is-line-clamp': lineClamp,
        'is-underline': underline,
        'is-delete': props.delete,
        'is-italic': italic,
      },
    ]"
    :style="textStyle"
  >
    <slot />
  </component>
</template>

<style>
.su-text {
  display: inline;
  max-width: 100%;
  margin: 0;
  color: var(--su-text-color, var(--su-color-text));
  font-size: var(--su-text-size, var(--su-font-size-md));
  font-style: normal;
  font-weight: var(--su-text-weight, 400);
  line-height: var(--su-font-line-height);
  overflow-wrap: anywhere;
}

.su-text--default {
  --su-text-color: var(--su-color-text);
}

.su-text--primary {
  --su-text-color: var(--su-color-primary);
}

.su-text--success {
  --su-text-color: #15803d;
}

.su-text--warning {
  --su-text-color: #b45309;
}

.su-text--error {
  --su-text-color: #b91c1c;
}

.su-text--info {
  --su-text-color: #2563eb;
}

.su-text--muted {
  --su-text-color: var(--su-color-text-muted);
}

.su-text--small {
  --su-text-size: var(--su-font-size-sm);
}

.su-text--medium {
  --su-text-size: var(--su-font-size-md);
}

.su-text--large {
  --su-text-size: var(--su-font-size-lg);
}

.su-text--weight-regular {
  --su-text-weight: 400;
}

.su-text--weight-medium {
  --su-text-weight: 500;
}

.su-text--weight-semibold {
  --su-text-weight: 600;
}

.su-text--weight-bold {
  --su-text-weight: 700;
}

.su-text.is-block {
  display: block;
}

.su-text.is-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.su-text.is-line-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--su-text-line-clamp);
}

.su-text.is-underline {
  text-decoration-line: underline;
}

.su-text.is-delete {
  text-decoration-line: line-through;
}

.su-text.is-underline.is-delete {
  text-decoration-line: underline line-through;
}

.su-text.is-italic {
  font-style: italic;
}
</style>
