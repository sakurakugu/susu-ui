import type { App, Plugin } from 'vue'
import { SuButton } from './components/button'

export * from './components/button'

const components = [SuButton]

export const SusuUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
