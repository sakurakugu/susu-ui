import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

describe('Badge', () => {
  it('渲染默认角标内容和包裹元素', () => {
    const wrapper = mount(Badge, {
      props: {
        value: 8,
      },
      slots: {
        default: '<button>消息</button>',
      },
    })

    expect(wrapper.classes()).toContain('su-badge')
    expect(wrapper.classes()).not.toContain('is-standalone')
    expect(wrapper.find('button').text()).toBe('消息')
    expect(wrapper.find('.su-badge__content').text()).toBe('8')
    expect(wrapper.find('.su-badge__content').classes()).toContain(
      'su-badge--error',
    )
    expect(wrapper.find('.su-badge__content').classes()).toContain(
      'su-badge--top-right',
    )
  })

  it('支持最大值显示', () => {
    const wrapper = mount(Badge, {
      props: {
        value: 120,
        max: 99,
      },
    })

    expect(wrapper.classes()).toContain('is-standalone')
    expect(wrapper.find('.su-badge__content').text()).toBe('99+')
  })

  it('默认隐藏零值并可通过 showZero 展示', () => {
    const hiddenWrapper = mount(Badge, {
      props: {
        value: 0,
      },
    })
    const visibleWrapper = mount(Badge, {
      props: {
        value: 0,
        showZero: true,
      },
    })

    expect(hiddenWrapper.find('.su-badge__content').exists()).toBe(false)
    expect(visibleWrapper.find('.su-badge__content').text()).toBe('0')
  })

  it('支持小红点模式', () => {
    const wrapper = mount(Badge, {
      props: {
        dot: true,
        type: 'primary',
        size: 'small',
      },
    })

    const badge = wrapper.find('.su-badge__content')
    expect(badge.text()).toBe('')
    expect(badge.classes()).toContain('is-dot')
    expect(badge.classes()).toContain('su-badge--primary')
    expect(badge.classes()).toContain('su-badge--small')
    expect(badge.attributes('aria-label')).toBe('状态提醒')
  })

  it('支持隐藏和位置配置', () => {
    const wrapper = mount(Badge, {
      props: {
        value: '新',
        hidden: true,
        position: 'bottom-left',
      },
    })

    expect(wrapper.find('.su-badge__content').exists()).toBe(false)

    wrapper.setProps({
      hidden: false,
    })

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('.su-badge__content').text()).toBe('新')
      expect(wrapper.find('.su-badge__content').classes()).toContain(
        'su-badge--bottom-left',
      )
    })
  })
})
