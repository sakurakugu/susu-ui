<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    dashed?: boolean
    contentPosition?: 'left' | 'center' | 'right'
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    contentPosition: 'center',
  },
)

defineOptions({
  name: 'SuDivider',
})
</script>

<template>
  <div
    class="su-divider"
    :class="[
      `su-divider--${direction}`,
      `su-divider--content-${contentPosition}`,
      {
        'is-dashed': dashed,
        'has-content': $slots.default,
      },
    ]"
    role="separator"
    :aria-orientation="direction"
  >
    <span v-if="$slots.default" class="su-divider__content">
      <slot />
    </span>
  </div>
</template>

<style>
.su-divider {
  border-color: var(--su-color-border);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
}

.su-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  margin: var(--su-space-lg) 0;
  border-top: 1px solid var(--su-color-border);
}

.su-divider--horizontal.has-content {
  border-top: 0;
}

.su-divider--horizontal.has-content::before,
.su-divider--horizontal.has-content::after {
  flex: 1;
  border-top: 1px solid var(--su-color-border);
  content: '';
}

.su-divider--horizontal.is-dashed {
  border-top-style: dashed;
}

.su-divider--horizontal.is-dashed.has-content::before,
.su-divider--horizontal.is-dashed.has-content::after {
  border-top-style: dashed;
}

.su-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 var(--su-space-sm);
  border-left: 1px solid var(--su-color-border);
  vertical-align: middle;
}

.su-divider--vertical.is-dashed {
  border-left-style: dashed;
}

.su-divider--vertical .su-divider__content {
  display: none;
}

.su-divider__content {
  flex: none;
  padding: 0 var(--su-space-md);
  white-space: nowrap;
}

.su-divider--content-left::before {
  max-width: 10%;
}

.su-divider--content-left::after {
  max-width: 90%;
}

.su-divider--content-right::before {
  max-width: 90%;
}

.su-divider--content-right::after {
  max-width: 10%;
}
</style>
