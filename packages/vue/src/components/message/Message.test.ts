import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from './Message.vue'
import { SuMessage } from './index'

describe('Message', () => {
  afterEach(() => {
    SuMessage.closeAll()
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

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
    expect(message.classes()).toContain('su-message--top')
    expect(wrapper.find('.su-message__close').exists()).toBe(true)
  })

  it('支持消息类型、位置、层级和隐藏图标关闭按钮', () => {
    const wrapper = mount(Message, {
      props: {
        type: 'success',
        placement: 'bottom-right',
        offset: 32,
        zIndex: 3000,
        showIcon: false,
        closable: false,
      },
      slots: {
        default: '保存成功',
      },
    })

    const message = wrapper.find<HTMLElement>('.su-message')

    expect(message.classes()).toContain('su-message--success')
    expect(message.classes()).toContain('su-message--bottom-right')
    expect(message.element.style.bottom).toBe('32px')
    expect(message.element.style.right).toBe('32px')
    expect(message.element.style.zIndex).toBe('3000')
    expect(wrapper.find('.su-message__icon').exists()).toBe(false)
    expect(wrapper.find('.su-message__close').exists()).toBe(false)
  })

  it('错误消息使用警告语义', () => {
    const wrapper = mount(Message, {
      props: {
        type: 'error',
      },
      slots: {
        default: '提交失败',
      },
    })

    const message = wrapper.find('.su-message')

    expect(message.attributes('role')).toBe('alert')
    expect(message.attributes('aria-live')).toBe('assertive')
  })

  it('点击关闭按钮时隐藏并触发关闭事件', async () => {
    const wrapper = mount(Message, {
      slots: {
        default: '手动关闭',
      },
    })

    await wrapper.find('.su-message__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.su-message').exists()).toBe(false)
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

  it('支持函数式调用基础消息', async () => {
    SuMessage('这是一条消息')
    await vi.dynamicImportSettled()

    const message = document.body.querySelector('.su-message')

    expect(message?.textContent).toContain('这是一条消息')
    expect(message?.classList.contains('su-message--info')).toBe(true)
    expect(message?.classList.contains('su-message--top')).toBe(true)
    expect(document.body.querySelector('.su-message__close')).not.toBeNull()
  })

  it('支持函数式快捷类型和位置', async () => {
    SuMessage.success({
      content: '保存成功',
      placement: 'bottom-left',
      offset: 40,
      zIndex: 3100,
      showIcon: false,
      closable: false,
    })
    await vi.dynamicImportSettled()

    const message = document.body.querySelector<HTMLElement>('.su-message')

    expect(message?.textContent).toContain('保存成功')
    expect(message?.classList.contains('su-message--success')).toBe(true)
    expect(message?.classList.contains('su-message--bottom-left')).toBe(true)
    expect(message?.style.bottom).toBe('40px')
    expect(message?.style.left).toBe('40px')
    expect(message?.style.zIndex).toBe('3100')
    expect(document.body.querySelector('.su-message__icon')).toBeNull()
    expect(document.body.querySelector('.su-message__close')).toBeNull()
  })

  it('支持六种展示位置', async () => {
    const placements = [
      'top-left',
      'top',
      'top-right',
      'bottom-left',
      'bottom',
      'bottom-right',
    ] as const

    placements.forEach((placement) => {
      SuMessage({
        content: placement,
        placement,
        merge: false,
        duration: 0,
      })
    })
    await vi.dynamicImportSettled()

    const messages = Array.from(document.body.querySelectorAll('.su-message'))

    placements.forEach((placement) => {
      expect(
        messages.some((message) => message.classList.contains(`su-message--${placement}`)),
      ).toBe(true)
    })
  })

  it('默认合并相同内容并刷新自动关闭时间', async () => {
    vi.useFakeTimers()

    SuMessage.success('保存成功')
    SuMessage.success('保存成功')
    await vi.dynamicImportSettled()

    expect(document.body.querySelectorAll('.su-message')).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(2999)
    expect(document.body.querySelectorAll('.su-message')).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(1)
    await vi.dynamicImportSettled()
    expect(document.body.querySelectorAll('.su-message')).toHaveLength(0)
  })

  it('支持关闭相同内容合并', async () => {
    SuMessage({
      content: '重复提醒',
      merge: false,
    })
    SuMessage({
      content: '重复提醒',
      merge: false,
    })
    await vi.dynamicImportSettled()

    expect(document.body.querySelectorAll('.su-message')).toHaveLength(2)
  })
})
