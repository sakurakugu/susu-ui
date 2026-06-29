import Message from './Message.vue'
import { messageMethod, type SuMessageMethod } from './method'
import { h, type SetupContext } from 'vue'

export type { MessageContent, MessageHandle, MessageOptions, SuMessageMethod } from './method'
export type { MessagePlacement, MessageType } from './Message.vue'

function isSetupContext(context: unknown): context is SetupContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'attrs' in context &&
    'slots' in context &&
    'emit' in context
  )
}

function SuMessageComponent(props: Record<string, unknown>, context?: SetupContext) {
  if (isSetupContext(context)) {
    return h(
      Message,
      {
        ...context.attrs,
        ...props,
        onClose() {
          context.emit('close')
        },
      },
      context.slots,
    )
  }

  return messageMethod(props)
}

SuMessageComponent.props = Message.props
SuMessageComponent.emits = Message.emits
SuMessageComponent.inheritAttrs = false
Object.defineProperty(SuMessageComponent, 'name', {
  value: 'SuMessage',
})

export const SuMessage = Object.assign(SuMessageComponent, {
  info: messageMethod.info,
  success: messageMethod.success,
  warning: messageMethod.warning,
  error: messageMethod.error,
  closeAll: messageMethod.closeAll,
}) as unknown as typeof Message & SuMessageMethod
export default SuMessage
