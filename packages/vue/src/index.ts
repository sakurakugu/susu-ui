import type { App, Plugin } from 'vue'
import { SuButton, SuButtonGroup } from './components/button'
import { SuDivider } from './components/divider'
import { SuIcon } from './components/icon'

export * from './components/button'
export * from './components/divider'
export * from './components/icon'

const components = [SuButton, SuButtonGroup, SuDivider, SuIcon]

export const SusuUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
