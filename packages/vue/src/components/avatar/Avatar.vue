<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'SuAvatar',
})

type AvatarShape = 'circle' | 'square'
type AvatarSize = 'small' | 'medium' | 'large'
type AvatarFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    size?: AvatarSize | number | string
    shape?: AvatarShape
    fit?: AvatarFit
    text?: string
    color?: string
    background?: string
  }>(),
  {
    src: undefined,
    alt: '',
    size: 'medium',
    shape: 'circle',
    fit: 'cover',
    text: undefined,
    color: undefined,
    background: undefined,
  },
)

const emit = defineEmits<{
  error: [event: Event]
}>()

defineSlots<{
  default?: () => unknown
  icon?: () => unknown
}>()

const imageFailed = ref(false)

const hasImage = computed(() => Boolean(props.src) && !imageFailed.value)

const avatarStyle = computed(() => {
  const style: Record<string, string> = {}

  if (typeof props.size === 'number') {
    style['--su-avatar-size'] = `${props.size}px`
  } else if (
    props.size !== 'small' &&
    props.size !== 'medium' &&
    props.size !== 'large'
  ) {
    style['--su-avatar-size'] = props.size
  }

  if (props.color) {
    style['--su-avatar-color'] = props.color
  }

  if (props.background) {
    style['--su-avatar-bg'] = props.background
  }

  return style
})

watch(
  () => props.src,
  () => {
    imageFailed.value = false
  },
)

function handleImageError(event: Event) {
  imageFailed.value = true
  emit('error', event)
}
</script>

<template>
  <span
    class="su-avatar"
    :class="[
      `su-avatar--${shape}`,
      typeof size === 'string' && ['small', 'medium', 'large'].includes(size)
        ? `su-avatar--${size}`
        : 'su-avatar--custom',
      {
        'is-image': hasImage,
      },
    ]"
    :style="avatarStyle"
  >
    <img
      v-if="hasImage"
      class="su-avatar__image"
      :src="src"
      :alt="alt"
      :style="{ objectFit: fit }"
      @error="handleImageError"
    />
    <span v-else-if="$slots.icon" class="su-avatar__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-else class="su-avatar__text">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<style>
.su-avatar {
  --su-avatar-size: 32px;
  --su-avatar-color: var(--su-color-primary-text);
  --su-avatar-bg: var(--su-color-primary);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--su-avatar-size);
  height: var(--su-avatar-size);
  overflow: hidden;
  color: var(--su-avatar-color);
  background: var(--su-avatar-bg);
  font-size: calc(var(--su-avatar-size) * 0.42);
  font-weight: 600;
  line-height: 1;
  vertical-align: middle;
  user-select: none;
}

.su-avatar--small {
  --su-avatar-size: 24px;
}

.su-avatar--medium {
  --su-avatar-size: 32px;
}

.su-avatar--large {
  --su-avatar-size: 40px;
}

.su-avatar--circle {
  border-radius: var(--su-radius-round);
}

.su-avatar--square {
  border-radius: var(--su-radius-md);
}

.su-avatar.is-image {
  background: var(--su-color-bg-soft);
}

.su-avatar__image {
  display: block;
  width: 100%;
  height: 100%;
}

.su-avatar__icon,
.su-avatar__text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
}

.su-avatar__icon {
  font-size: calc(var(--su-avatar-size) * 0.56);
}

.su-avatar__icon > svg {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentcolor;
}

.su-avatar__text {
  padding: 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
