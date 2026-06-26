import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'

describe('Divider', () => {
  it('渲染默认横向分割线', () => {
    const wrapper = mount(Divider)

    expect(wrapper.classes()).toContain('su-divider')
    expect(wrapper.classes()).toContain('su-divider--horizontal')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
  })

  it('支持纵向分割线', () => {
    const wrapper = mount(Divider, {
      props: {
        direction: 'vertical',
      },
    })

    expect(wrapper.classes()).toContain('su-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('支持虚线样式', () => {
    const wrapper = mount(Divider, {
      props: {
        dashed: true,
      },
    })

    expect(wrapper.classes()).toContain('is-dashed')
  })

  it('支持默认插槽内容和位置', () => {
    const wrapper = mount(Divider, {
      props: {
        contentPosition: 'left',
      },
      slots: {
        default: '分组标题',
      },
    })

    expect(wrapper.classes()).toContain('has-content')
    expect(wrapper.classes()).toContain('su-divider--content-left')
    expect(wrapper.find('.su-divider__content').text()).toBe('分组标题')
  })
})
