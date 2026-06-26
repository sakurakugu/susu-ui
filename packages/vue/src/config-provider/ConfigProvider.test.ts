import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfigProvider from './ConfigProvider.vue'
import { useConfig, useLocale } from './context'
import { enUS } from '../locale'

const ConfigConsumer = defineComponent({
  setup() {
    const locale = useLocale()
    const config = useConfig()

    return {
      config,
      locale,
    }
  },
  template:
    '<span data-locale-description>{{ locale.empty.description }}</span><span data-locale-name>{{ config.locale.name }}</span>',
})

describe('ConfigProvider', () => {
  it('默认使用中文配置', () => {
    const wrapper = mount(ConfigConsumer)

    expect(wrapper.find('[data-locale-description]').text()).toBe('暂无数据')
  })

  it('支持通过 ConfigProvider 覆盖 locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: enUS,
      },
      slots: {
        default: ConfigConsumer,
      },
    })

    expect(wrapper.find('[data-locale-description]').text()).toBe('No data')
  })

  it('支持读取完整全局配置', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: enUS,
      },
      slots: {
        default: ConfigConsumer,
      },
    })

    expect(wrapper.find('[data-locale-name]').text()).toBe('en-us')
  })
})
