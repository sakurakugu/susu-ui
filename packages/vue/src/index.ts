import type { App, Plugin } from 'vue'
import { computed } from 'vue'
import {
  configProviderKey,
  mergeConfig,
  SuConfigProvider,
  type SusuConfigProviderProps,
} from './config-provider'
import { SuButton, SuButtonGroup } from './components/button'
import { SuDivider } from './components/divider'
import { SuIcon } from './components/icon'
import { SuInput } from './components/input'
import { SuMessage } from './components/message'
import { SuRate } from './components/rate'

export * from './config-provider'
export * from './components/button'
export * from './components/divider'
export * from './components/icon'
export * from './components/input'
export * from './components/message'
export * from './components/rate'
export * from './locale'

const components = [
  SuConfigProvider,
  SuButton,
  SuButtonGroup,
  SuDivider,
  SuIcon,
  SuInput,
  SuMessage,
  SuRate,
]

export const SusuUI: Plugin = {
  install(app: App, options?: SusuConfigProviderProps) {
    app.provide(
      configProviderKey,
      computed(() => mergeConfig(options)),
    )

    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
