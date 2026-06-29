import { inject, provide, type InjectionKey } from 'vue'

export type PlaygroundNotificationPlacement =
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type PlaygroundNotificationType = 'info' | 'success' | 'warning' | 'error'

export interface PlaygroundNotificationOptions {
  type?: PlaygroundNotificationType
  title?: string
  description?: string
  placement?: PlaygroundNotificationPlacement
  duration?: number
  showIcon?: boolean
  closable?: boolean
  iconText?: string
}

export interface PlaygroundDemoCallbacks {
  showMessage: (message?: string) => void
  showNotification: (options: PlaygroundNotificationOptions) => void
}

export interface PlaygroundDemoContext {
  showTopMessage: (message?: string | Event) => void
  showNotification: (options: PlaygroundNotificationOptions) => void
}

const playgroundDemoContextKey: InjectionKey<PlaygroundDemoContext> =
  Symbol('playgroundDemoContext')

export function providePlaygroundDemoContext(callbacks: PlaygroundDemoCallbacks) {
  const context: PlaygroundDemoContext = {
    showTopMessage(message) {
      callbacks.showMessage(typeof message === 'string' ? message : undefined)
    },
    showNotification: callbacks.showNotification,
  }
  provide(playgroundDemoContextKey, context)
  return context
}

export function usePlaygroundDemoContext() {
  const context = inject(playgroundDemoContextKey)

  if (!context) {
    throw new Error('请先提供 playground 示例上下文')
  }

  return context
}
