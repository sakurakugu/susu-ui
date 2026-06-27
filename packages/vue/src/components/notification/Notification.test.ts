import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Notification from './Notification.vue'

describe('Notification', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('渲染通知标题、内容和默认样式', async () => {
    const wrapper = mount(Notification, {
      props: {
        title: '发布完成',
      },
      slots: {
        default: '线上内容已经更新。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const notification = document.body.querySelector('.su-notification')

    expect(notification?.textContent).toContain('发布完成')
    expect(notification?.textContent).toContain('线上内容已经更新。')
    expect(notification?.classList.contains('su-notification--info')).toBe(true)
    expect(notification?.classList.contains('su-notification--top-right')).toBe(
      true,
    )
    expect(notification?.getAttribute('role')).toBe('status')

    wrapper.unmount()
  })

  it('支持类型、位置、宽度和层级', async () => {
    const wrapper = mount(Notification, {
      props: {
        type: 'error',
        placement: 'bottom-left',
        width: 420,
        offset: 32,
        zIndex: 3000,
        description: '同步失败，请稍后重试。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const notification =
      document.body.querySelector<HTMLElement>('.su-notification')

    expect(notification?.classList.contains('su-notification--error')).toBe(
      true,
    )
    expect(
      notification?.classList.contains('su-notification--bottom-left'),
    ).toBe(true)
    expect(notification?.getAttribute('role')).toBe('alert')
    expect(notification?.getAttribute('aria-live')).toBe('assertive')
    expect(notification?.style.width).toBe('420px')
    expect(notification?.style.left).toBe('32px')
    expect(notification?.style.bottom).toBe('32px')
    expect(notification?.style.zIndex).toBe('3000')

    wrapper.unmount()
  })

  it('支持隐藏图标和关闭按钮', async () => {
    const wrapper = mount(Notification, {
      props: {
        showIcon: false,
        closable: false,
        description: '持续展示。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-notification__icon')).toBeNull()
    expect(document.body.querySelector('.su-notification__close')).toBeNull()

    wrapper.unmount()
  })

  it('点击关闭按钮时隐藏并触发关闭事件', async () => {
    const wrapper = mount(Notification, {
      props: {
        description: '可以手动关闭。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body
      .querySelector<HTMLButtonElement>('.su-notification__close')
      ?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(document.body.querySelector('.su-notification')).toBeNull()

    wrapper.unmount()
  })

  it('默认 4.5 秒后自动关闭', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        description: '自动关闭。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-notification')).not.toBeNull()

    await vi.advanceTimersByTimeAsync(4500)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(document.body.querySelector('.su-notification')).toBeNull()

    wrapper.unmount()
  })

  it('duration 为 0 时不会自动关闭', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        duration: 0,
        description: '持续展示。',
      },
      attachTo: document.body,
    })

    await vi.advanceTimersByTimeAsync(4500)
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-notification')).not.toBeNull()
    expect(wrapper.emitted('close')).toBeUndefined()

    wrapper.unmount()
  })
})
