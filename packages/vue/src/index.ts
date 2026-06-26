import type { App, Plugin } from 'vue'
import { SuButton, SuButtonGroup } from './components/button'
import { SuIcon } from './components/icon'

export * from './components/button'
export * from './components/icon'

const components = [SuButton, SuButtonGroup, SuIcon]

export const SusuUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
