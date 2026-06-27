import { inject, provide, type InjectionKey } from 'vue'

export type PlaygroundNotificationPlacement = 'top-right' | 'bottom-left'

export interface PlaygroundDemoCallbacks {
  showMessage: () => void
  showNotification: (placement: PlaygroundNotificationPlacement) => void
}

export interface PlaygroundDemoContext {
  showTopMessage: () => void
  showNotification: (placement: PlaygroundNotificationPlacement) => void
}

const playgroundDemoContextKey: InjectionKey<PlaygroundDemoContext> = Symbol(
  'playgroundDemoContext',
)

export function providePlaygroundDemoContext(
  callbacks: PlaygroundDemoCallbacks,
) {
  const context: PlaygroundDemoContext = {
    showTopMessage: callbacks.showMessage,
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
