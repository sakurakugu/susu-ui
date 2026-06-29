import { createVNode, defineComponent, h, render, type Component, type VNode } from 'vue'
import Message, { type MessagePlacement, type MessageType } from './Message.vue'

export type MessageContent = string | number | VNode

export interface MessageOptions {
  type?: MessageType
  content?: MessageContent
  duration?: number
  showIcon?: boolean
  closable?: boolean
  placement?: MessagePlacement
  offset?: number
  zIndex?: number
  merge?: boolean
  onClose?: () => void
}

export interface MessageHandle {
  close: () => void
}

type MessageInput = MessageContent | MessageOptions

interface MessageRecord {
  id: number
  content: MessageContent
  options: Required<Pick<MessageOptions, 'type' | 'placement' | 'merge'>>
  close: () => void
  resetTimer: () => void
  container: HTMLDivElement
}

const DEFAULT_TYPE: MessageType = 'info'
const DEFAULT_PLACEMENT: MessagePlacement = 'top'
const DEFAULT_MERGE = true

let seed = 0
const records: MessageRecord[] = []

function isVNodeContent(content: unknown): content is VNode {
  return typeof content === 'object' && content !== null && '__v_isVNode' in content
}

function normalizeOptions(input: MessageInput, type?: MessageType): MessageOptions {
  const baseType = type ?? DEFAULT_TYPE

  if (typeof input === 'string' || typeof input === 'number' || isVNodeContent(input)) {
    return {
      type: baseType,
      content: input,
    }
  }

  return {
    ...input,
    type: input.type ?? baseType,
  }
}

function getMergeKey(options: MessageOptions) {
  return [
    options.type ?? DEFAULT_TYPE,
    options.placement ?? DEFAULT_PLACEMENT,
    typeof options.content === 'number' ? String(options.content) : options.content,
  ].join('::')
}

function findMergeRecord(options: MessageOptions) {
  if (options.merge === false) {
    return undefined
  }

  return records.find(
    (record) =>
      record.options.merge &&
      getMergeKey({
        type: record.options.type,
        placement: record.options.placement,
        content: record.content,
      }) === getMergeKey(options),
  )
}

function removeRecord(id: number) {
  const index = records.findIndex((record) => record.id === id)

  if (index >= 0) {
    records.splice(index, 1)
  }
}

function createMessage(input: MessageInput, type?: MessageType): MessageHandle {
  if (typeof document === 'undefined') {
    return {
      close() {},
    }
  }

  const options = normalizeOptions(input, type)
  const content = options.content ?? ''
  const mergeRecord = findMergeRecord({
    ...options,
    content,
  })

  if (mergeRecord) {
    mergeRecord.resetTimer()
    return {
      close: mergeRecord.close,
    }
  }

  const id = ++seed
  const container = document.createElement('div')
  const mountNode = document.createElement('div')

  container.className = 'su-message-method'
  container.appendChild(mountNode)
  document.body.appendChild(container)

  function cleanup() {
    removeRecord(id)
    render(null, mountNode)
    container.remove()
  }

  const MessageHost = defineComponent({
    name: 'SuMessageHost',
    setup() {
      let closeInstance: (() => void) | undefined
      let timer: ReturnType<typeof window.setTimeout> | undefined

      function clearTimer() {
        if (timer === undefined) {
          return
        }

        window.clearTimeout(timer)
        timer = undefined
      }

      function close() {
        clearTimer()
        closeInstance?.()
      }

      function resetTimer() {
        clearTimer()

        const duration = options.duration ?? 3000

        if (duration <= 0) {
          return
        }

        timer = window.setTimeout(close, duration)
      }

      const record: MessageRecord = {
        id,
        content,
        options: {
          type: options.type ?? DEFAULT_TYPE,
          placement: options.placement ?? DEFAULT_PLACEMENT,
          merge: options.merge ?? DEFAULT_MERGE,
        },
        close,
        resetTimer,
        container,
      }

      records.push(record)

      resetTimer()

      return () =>
        h(
          Message as Component,
          {
            type: options.type,
            duration: 0,
            showIcon: options.showIcon,
            closable: options.closable,
            placement: options.placement,
            offset: options.offset,
            zIndex: options.zIndex,
            onClose() {
              clearTimer()
              options.onClose?.()
              cleanup()
            },
            ref(instance: unknown) {
              closeInstance = (instance as { close?: () => void } | null)?.close
            },
          },
          {
            default: () => content,
          },
        )
    },
  })

  render(createVNode(MessageHost), mountNode)

  const record = records.find((item) => item.id === id)

  return {
    close() {
      record?.close()
    },
  }
}

export interface SuMessageMethod {
  (content: MessageInput): MessageHandle
  info: (content: MessageInput) => MessageHandle
  success: (content: MessageInput) => MessageHandle
  warning: (content: MessageInput) => MessageHandle
  error: (content: MessageInput) => MessageHandle
  closeAll: () => void
}

export const messageMethod = createMessage as SuMessageMethod

messageMethod.info = (content) => createMessage(content, 'info')
messageMethod.success = (content) => createMessage(content, 'success')
messageMethod.warning = (content) => createMessage(content, 'warning')
messageMethod.error = (content) => createMessage(content, 'error')
messageMethod.closeAll = () => {
  records.slice().forEach((record) => record.close())
}
