<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'SuCodeBlock',
})

export type CodeBlockTheme = 'light' | 'dark'

const props = withDefaults(
  defineProps<{
    code?: string
    language?: string
    title?: string
    theme?: CodeBlockTheme
    showHeader?: boolean
    showLineNumbers?: boolean
    copyable?: boolean
    wrap?: boolean
    maxHeight?: number | string
    ariaLabel?: string
  }>(),
  {
    code: '',
    language: '',
    title: undefined,
    theme: 'light',
    showHeader: true,
    showLineNumbers: false,
    copyable: true,
    wrap: false,
    maxHeight: undefined,
    ariaLabel: '代码块',
  },
)

const emit = defineEmits<{
  copy: [code: string]
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  actions?: () => unknown
}>()

const copied = ref(false)
let copiedTimer: ReturnType<typeof window.setTimeout> | undefined

const codeLines = computed(() => {
  const lines = props.code.split(/\r?\n/)
  return lines.length > 0 ? lines : ['']
})

const hasHeader = computed(
  () =>
    props.showHeader &&
    (Boolean(props.title) ||
      Boolean(props.language) ||
      props.copyable ||
      Boolean(props.showLineNumbers)),
)

const codeBlockStyle = computed(() => {
  if (!props.maxHeight) {
    return undefined
  }

  return {
    '--su-code-block-max-height': normalizeSize(props.maxHeight),
  }
})

const displayTitle = computed(() => props.title ?? props.language)

async function copyCode() {
  if (!props.copyable) {
    return
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(props.code)
  }

  copied.value = true
  emit('copy', props.code)

  if (copiedTimer) {
    window.clearTimeout(copiedTimer)
  }

  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1600)
}

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}
</script>

<template>
  <figure
    class="su-code-block"
    :class="[
      `su-code-block--${theme}`,
      {
        'is-wrap': wrap,
        'has-line-numbers': showLineNumbers,
        'has-header': hasHeader,
      },
    ]"
    :style="codeBlockStyle"
  >
    <figcaption v-if="hasHeader" class="su-code-block__header">
      <div class="su-code-block__meta">
        <slot name="title">
          <span v-if="displayTitle" class="su-code-block__title">
            {{ displayTitle }}
          </span>
        </slot>
        <span v-if="language && title" class="su-code-block__language" aria-hidden="true">
          {{ language }}
        </span>
      </div>
      <div class="su-code-block__actions">
        <slot name="actions" />
        <button
          v-if="copyable"
          class="su-code-block__copy"
          type="button"
          :aria-label="copied ? '已复制代码' : '复制代码'"
          @click="copyCode"
        >
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </figcaption>

    <pre
      class="su-code-block__pre"
      :aria-label="ariaLabel"
    ><code class="su-code-block__code"><template v-if="$slots.default"><slot /></template><template v-else-if="showLineNumbers"><span v-for="(line, index) in codeLines" :key="index" class="su-code-block__line"><span class="su-code-block__line-number" aria-hidden="true">{{ index + 1 }}</span><span class="su-code-block__line-content">{{ line || ' ' }}</span></span></template><template v-else>{{ code }}</template></code></pre>
  </figure>
</template>

<style>
.su-code-block {
  --su-code-block-bg: var(--su-color-bg-elevated);
  --su-code-block-header-bg: var(--su-color-bg-soft);
  --su-code-block-color: var(--su-color-text);
  --su-code-block-muted: var(--su-color-text-muted);
  --su-code-block-border: var(--su-color-border);

  display: block;
  width: 100%;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--su-code-block-border);
  border-radius: var(--su-radius-md);
  background: var(--su-code-block-bg);
  color: var(--su-code-block-color);
  font-size: var(--su-font-size-sm);
}

.su-code-block--dark {
  --su-code-block-bg: #101418;
  --su-code-block-header-bg: #171d23;
  --su-code-block-color: #e5edf5;
  --su-code-block-muted: #8b98a5;
  --su-code-block-border: #27313a;
}

.su-code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 40px;
  padding: var(--su-space-xs) var(--su-space-md);
  border-bottom: 1px solid var(--su-code-block-border);
  background: var(--su-code-block-header-bg);
}

.su-code-block__meta,
.su-code-block__actions {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.su-code-block__meta {
  gap: var(--su-space-sm);
}

.su-code-block__actions {
  flex: none;
  gap: var(--su-space-xs);
}

.su-code-block__title {
  min-width: 0;
  overflow: hidden;
  color: var(--su-code-block-color);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-code-block__language {
  flex: none;
  color: var(--su-code-block-muted);
  font-size: var(--su-font-size-xs);
}

.su-code-block__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 var(--su-space-sm);
  border: 1px solid var(--su-code-block-border);
  border-radius: var(--su-radius-sm);
  color: var(--su-code-block-color);
  background: var(--su-code-block-bg);
  font: inherit;
  font-size: var(--su-font-size-xs);
  line-height: 1;
  cursor: pointer;
}

.su-code-block__copy:hover {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary);
}

.su-code-block__copy:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-code-block__pre {
  max-height: var(--su-code-block-max-height, none);
  margin: 0;
  overflow: auto;
  background: var(--su-code-block-bg);
}

.su-code-block__code {
  display: block;
  min-width: max-content;
  padding: var(--su-space-md);
  color: var(--su-code-block-color);
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: inherit;
  line-height: 1.7;
  tab-size: 2;
  white-space: pre;
}

.su-code-block.is-wrap .su-code-block__code {
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.su-code-block__line {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: var(--su-space-md);
}

.su-code-block__line-number {
  min-width: 2ch;
  color: var(--su-code-block-muted);
  text-align: right;
  user-select: none;
}

.su-code-block__line-content {
  min-width: 0;
}
</style>
