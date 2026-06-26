import type { App, Plugin } from 'vue'
import { SuButton, SuButtonGroup } from './components/button'

export * from './components/button'

const components = [SuButton, SuButtonGroup]

export const SusuUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
