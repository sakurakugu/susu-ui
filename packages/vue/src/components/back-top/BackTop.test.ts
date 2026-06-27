import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BackTop from './BackTop.vue'

describe('BackTop', () => {
  it('滚动超过可见高度后显示按钮并触发 change', async () => {
    vi.useFakeTimers()
    const wrapper = mount(BackTop, {
      props: {
        visibilityHeight: 120,
      },
      attachTo: document.body,
    })

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(160)
    window.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.su-back-top').exists()).toBe(true)
    expect(wrapper.find('.su-back-top').attributes('aria-label')).toBe(
      '回到顶部',
    )
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('点击后回到窗口顶部并触发 click', async () => {
    vi.useFakeTimers()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const wrapper = mount(BackTop, {
      props: {
        visibilityHeight: 80,
        behavior: 'auto',
      },
      attachTo: document.body,
    })

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
    window.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    await wrapper.find('.su-back-top').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'auto',
    })
    expect(wrapper.emitted('click')).toHaveLength(1)

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('支持自定义滚动容器', async () => {
    vi.useFakeTimers()
    const target = document.createElement('div')
    const scrollTo = vi.fn()
    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 240,
    })
    Object.defineProperty(target, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    })
    document.body.appendChild(target)

    const wrapper = mount(BackTop, {
      props: {
        visibilityHeight: 100,
        target: () => target,
        right: 24,
        bottom: '32px',
      },
      slots: {
        default: '<span>返回顶部</span>',
      },
      attachTo: document.body,
    })

    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.su-back-top')
    expect(button.text()).toBe('返回顶部')
    expect(button.attributes('style')).toContain('right: 24px')
    expect(button.attributes('style')).toContain('bottom: 32px')

    await button.trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })

    wrapper.unmount()
    target.remove()
    vi.useRealTimers()
  })
})
