import ConfigProvider from './ConfigProvider.vue'

export const SuConfigProvider = ConfigProvider
export default SuConfigProvider
export {
  configProviderKey,
  defaultConfig,
  mergeConfig,
  provideConfig,
  useConfig,
  useLocale,
  type SusuConfig,
  type SusuConfigProviderProps,
} from './context'
