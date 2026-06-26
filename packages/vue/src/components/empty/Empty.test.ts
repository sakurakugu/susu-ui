import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Empty from './Empty.vue'
import { configProviderKey } from '../../config-provider'

describe('Empty', () => {
  it('渲染默认空状态', () => {
    const wrapper = mount(Empty)

    expect(wrapper.classes()).toContain('su-empty')
    expect(wrapper.find('.su-empty__default-image').exists()).toBe(true)
    expect(wrapper.find('.su-empty__description').text()).toBe('暂无数据')
  })

  it('支持自定义描述和图片', () => {
    const wrapper = mount(Empty, {
      props: {
        description: '没有搜索结果',
        image: '/empty.png',
        imageSize: 120,
      },
    })

    expect(wrapper.find('.su-empty__description').text()).toBe('没有搜索结果')
    expect(wrapper.find('.su-empty__img').attributes('src')).toBe('/empty.png')
    expect(wrapper.find('.su-empty__image').attributes('style')).toContain(
      'width: 120px',
    )
  })

  it('支持字符串图片尺寸', () => {
    const wrapper = mount(Empty, {
      props: {
        imageSize: '8rem',
      },
    })

    expect(wrapper.find('.su-empty__image').attributes('style')).toContain(
      'width: 8rem',
    )
  })

  it('支持默认、图片和底部插槽', () => {
    const wrapper = mount(Empty, {
      slots: {
        default: '列表为空',
        image: '<span class="custom-image">空</span>',
        footer: '<button>新建</button>',
      },
    })

    expect(wrapper.find('.su-empty__description').text()).toBe('列表为空')
    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('.su-empty__footer').text()).toBe('新建')
  })

  it('跟随配置的国际化文案', () => {
    const wrapper = mount(Empty, {
      global: {
        provide: {
          [configProviderKey as symbol]: computed(() => ({
            locale: {
              name: 'en-us',
              empty: {
                description: 'No data',
              },
            },
          })),
        },
      },
    })

    expect(wrapper.find('.su-empty__description').text()).toBe('No data')
  })
})
