import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from './Loading.vue'

describe('Loading', () => {
  it('渲染默认加载状态', () => {
    const wrapper = mount(Loading)

    expect(wrapper.classes()).toContain('su-loading')
    expect(wrapper.find('.su-loading__spinner').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('支持关闭加载状态', () => {
    const wrapper = mount(Loading, {
      props: {
        loading: false,
      },
    })

    expect(wrapper.find('.su-loading').exists()).toBe(false)
  })

  it('支持尺寸、文案和遮罩状态', () => {
    const wrapper = mount(Loading, {
      props: {
        size: 'large',
        text: '正在同步',
        overlay: true,
        blur: true,
      },
    })

    expect(wrapper.classes()).toContain('su-loading--large')
    expect(wrapper.classes()).toContain('is-overlay')
    expect(wrapper.classes()).toContain('is-blur')
    expect(wrapper.find('.su-loading__text').text()).toBe('正在同步')
  })

  it('支持全屏和自定义插槽', () => {
    const wrapper = mount(Loading, {
      props: {
        fullscreen: true,
      },
      slots: {
        default: '加载项目',
        icon: '<span class="custom-icon">转</span>',
      },
    })

    expect(wrapper.classes()).toContain('is-fullscreen')
    expect(wrapper.classes()).toContain('is-overlay')
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.su-loading__text').text()).toBe('加载项目')
  })
})
