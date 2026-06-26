import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'

describe('Icon', () => {
  it('渲染默认图标容器和插槽', () => {
    const wrapper = mount(Icon, {
      slots: {
        default: '<svg><path d="M1 1h10v10H1z" /></svg>',
      },
    })

    expect(wrapper.classes()).toContain('su-icon')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('支持数字尺寸', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 20,
      },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 20px')
  })

  it('支持字符串尺寸和颜色', () => {
    const wrapper = mount(Icon, {
      props: {
        size: '1.5rem',
        color: 'rgb(255, 0, 0)',
      },
    })

    expect(wrapper.attributes('style')).toContain('font-size: 1.5rem')
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
  })
})
