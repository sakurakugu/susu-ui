<script setup lang="ts">
import { computed, ref } from 'vue'
import { SuCodeBlock } from '../code-block'

defineOptions({
  name: 'SuTerminal',
})

export type TerminalStatus = 'idle' | 'running' | 'success' | 'error'
export type TerminalLineType = 'command' | 'output' | 'info' | 'success' | 'warning' | 'error'

export interface TerminalLine {
  type?: TerminalLineType
  text: string
  prompt?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    lines?: TerminalLine[]
    prompt?: string
    status?: TerminalStatus
    showHeader?: boolean
    copyable?: boolean
    wrap?: boolean
    maxHeight?: number | string
    ariaLabel?: string
  }>(),
  {
    title: '终端',
    content: '',
    lines: undefined,
    prompt: '$',
    status: 'idle',
    showHeader: true,
    copyable: true,
    wrap: false,
    maxHeight: 320,
    ariaLabel: '终端输出',
  },
)

const emit = defineEmits<{
  copy: [content: string]
}>()

defineSlots<{
  title?: () => unknown
  actions?: () => unknown
}>()

const terminalContent = computed(() => {
  if (props.lines?.length) {
    return props.lines.map(formatLine).join('\n')
  }

  return props.content
})

const copied = ref(false)
let copiedTimer: ReturnType<typeof window.setTimeout> | undefined

const statusText = computed(() => {
  const textMap: Record<TerminalStatus, string> = {
    idle: '空闲',
    running: '运行中',
    success: '已完成',
    error: '失败',
  }

  return textMap[props.status]
})

function formatLine(line: TerminalLine) {
  if (line.type === 'command') {
    return `${line.prompt ?? props.prompt} ${line.text}`
  }

  return line.text
}

function handleCopy(content: string) {
  emit('copy', content)
}

async function copyTerminalContent() {
  if (!props.copyable) {
    return
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(terminalContent.value)
  }

  copied.value = true
  handleCopy(terminalContent.value)

  if (copiedTimer) {
    window.clearTimeout(copiedTimer)
  }

  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <section class="su-terminal" :class="[`su-terminal--${status}`]">
    <header v-if="showHeader" class="su-terminal__header">
      <div class="su-terminal__controls" aria-hidden="true">
        <span class="su-terminal__control su-terminal__control--close" />
        <span class="su-terminal__control su-terminal__control--minimize" />
        <span class="su-terminal__control su-terminal__control--maximize" />
      </div>
      <div class="su-terminal__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="su-terminal__meta">
        <span class="su-terminal__status">{{ statusText }}</span>
        <slot name="actions" />
        <button
          v-if="copyable"
          class="su-terminal__copy"
          type="button"
          :aria-label="copied ? '已复制终端内容' : '复制终端内容'"
          @click="copyTerminalContent"
        >
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </header>

    <SuCodeBlock
      class="su-terminal__code"
      :code="terminalContent"
      theme="dark"
      :show-header="false"
      :copyable="false"
      :wrap="wrap"
      :max-height="maxHeight"
      :aria-label="ariaLabel"
      @copy="handleCopy"
    />
  </section>
</template>

<style>
.su-terminal {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #27313a;
  border-radius: var(--su-radius-md);
  background: #101418;
  color: #e5edf5;
  font-size: var(--su-font-size-sm);
}

.su-terminal__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--su-space-md);
  min-height: 42px;
  padding: var(--su-space-xs) var(--su-space-md);
  border-bottom: 1px solid #27313a;
  background: #171d23;
}

.su-terminal__controls,
.su-terminal__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-xs);
}

.su-terminal__control {
  width: 10px;
  height: 10px;
  border-radius: var(--su-radius-round);
}

.su-terminal__control--close {
  background: #ef6461;
}

.su-terminal__control--minimize {
  background: #f6c177;
}

.su-terminal__control--maximize {
  background: #7bc88f;
}

.su-terminal__title {
  min-width: 0;
  overflow: hidden;
  color: #e5edf5;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-terminal__meta {
  justify-content: flex-end;
  min-width: 72px;
}

.su-terminal__status {
  color: #8b98a5;
  font-size: var(--su-font-size-xs);
}

.su-terminal__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 var(--su-space-sm);
  border: 1px solid #27313a;
  border-radius: var(--su-radius-sm);
  color: #e5edf5;
  background: #101418;
  font: inherit;
  font-size: var(--su-font-size-xs);
  line-height: 1;
  cursor: pointer;
}

.su-terminal__copy:hover {
  border-color: var(--su-color-primary);
  color: #8fb9ff;
}

.su-terminal__copy:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-terminal--running .su-terminal__status {
  color: #8fb9ff;
}

.su-terminal--success .su-terminal__status {
  color: #7bc88f;
}

.su-terminal--error .su-terminal__status {
  color: #ef8f8c;
}

.su-terminal__code {
  border: 0;
  border-radius: 0;
}
</style>
