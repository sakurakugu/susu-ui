import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from './Message.vue'

describe('Message', () => {
  it('渲染顶部消息内容和默认样式', () => {
    const wrapper = mount(Message, {
      slots: {
        default: '操作成功',
      },
    })

    const message = wrapper.find('.su-message')

    expect(wrapper.text()).toContain('操作成功')
    expect(message.classes()).toContain('su-message')
    expect(message.classes()).toContain('su-message--info')
    expect(message.attributes('role')).toBe('status')
  })

  it('支持消息类型和隐藏图标', () => {
    const wrapper = mount(Message, {
      props: {
        type: 'success',
        showIcon: false,
      },
      slots: {
        default: '保存成功',
      },
    })

    expect(wrapper.find('.su-message').classes()).toContain(
      'su-message--success',
    )
    expect(wrapper.find('.su-message__icon').exists()).toBe(false)
  })

  it('默认 3 秒后自动消失并触发关闭事件', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Message, {
      slots: {
        default: '自动关闭',
      },
    })

    expect(wrapper.find('.su-message').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(3000)

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.su-message').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('duration 为 0 时不会自动消失', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Message, {
      props: {
        duration: 0,
      },
      slots: {
        default: '持续展示',
      },
    })

    await vi.advanceTimersByTimeAsync(3000)

    expect(wrapper.find('.su-message').exists()).toBe(true)
    expect(wrapper.emitted('close')).toBeUndefined()

    vi.useRealTimers()
  })
})
