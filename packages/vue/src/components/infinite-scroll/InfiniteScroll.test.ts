import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InfiniteScroll from './InfiniteScroll.vue'

function mockScrollMetrics(
  element: HTMLElement,
  metrics: {
    scrollTop: number
    scrollHeight: number
    clientHeight: number
  },
) {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      configurable: true,
      value,
    })
  })
}

describe('InfiniteScroll', () => {
  it('渲染默认内容和加载状态', () => {
    const wrapper = mount(InfiniteScroll, {
      props: {
        loading: true,
        loadingText: '正在同步更多客户',
        immediate: false,
      },
      slots: {
        default: '<div class="record">客户动态</div>',
      },
    })

    expect(wrapper.classes()).toContain('su-infinite-scroll')
    expect(wrapper.find('.record').text()).toBe('客户动态')
    expect(wrapper.find('.su-infinite-scroll__status').text()).toContain(
      '正在同步更多客户',
    )
  })

  it('滚动到阈值内时触发 load 事件', async () => {
    vi.useFakeTimers()
    const target = document.createElement('div')
    mockScrollMetrics(target, {
      scrollTop: 720,
      scrollHeight: 1000,
      clientHeight: 240,
    })
    document.body.appendChild(target)

    const wrapper = mount(InfiniteScroll, {
      props: {
        target: () => target,
        distance: 48,
        immediate: false,
      },
      attachTo: document.body,
    })

    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('load')?.[0][0]).toMatchObject({
      scrollTop: 720,
      scrollHeight: 1000,
      clientHeight: 240,
      remaining: 40,
    })
    expect(wrapper.emitted('scroll')?.[0][1]).toMatchObject({
      remaining: 40,
    })

    wrapper.unmount()
    target.remove()
    vi.useRealTimers()
  })

  it('加载中、结束、禁用和错误状态不会触发 load', async () => {
    vi.useFakeTimers()
    const target = document.createElement('div')
    mockScrollMetrics(target, {
      scrollTop: 760,
      scrollHeight: 1000,
      clientHeight: 240,
    })
    document.body.appendChild(target)

    const wrapper = mount(InfiniteScroll, {
      props: {
        target: () => target,
        immediate: false,
        loading: true,
      },
      attachTo: document.body,
    })

    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('load')).toBeUndefined()

    await wrapper.setProps({ loading: false, finished: true })
    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('load')).toBeUndefined()

    await wrapper.setProps({ finished: false, disabled: true })
    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('load')).toBeUndefined()

    await wrapper.setProps({ disabled: false, error: true })
    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('load')).toBeUndefined()

    wrapper.unmount()
    target.remove()
    vi.useRealTimers()
  })

  it('支持自带滚动容器和手动检测', async () => {
    const wrapper = mount(InfiniteScroll, {
      props: {
        height: 240,
        distance: 20,
        immediate: false,
      },
      attachTo: document.body,
    })
    const root = wrapper.find('.su-infinite-scroll').element as HTMLElement

    mockScrollMetrics(root, {
      scrollTop: 760,
      scrollHeight: 1000,
      clientHeight: 240,
    })
    wrapper.vm.check()
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('is-scrollable')
    expect(wrapper.attributes('style')).toContain('height: 240px')
    expect(wrapper.emitted('load')).toHaveLength(1)

    wrapper.unmount()
  })

  it('支持完成和错误插槽', () => {
    const finishedWrapper = mount(InfiniteScroll, {
      props: {
        finished: true,
        immediate: false,
      },
      slots: {
        finished: '已加载全部审批记录',
      },
    })
    const errorWrapper = mount(InfiniteScroll, {
      props: {
        error: true,
        immediate: false,
      },
      slots: {
        error: '加载失败，请稍后重试',
      },
    })

    expect(finishedWrapper.find('.su-infinite-scroll__status').text()).toBe(
      '已加载全部审批记录',
    )
    expect(errorWrapper.find('.su-infinite-scroll__status').text()).toBe(
      '加载失败，请稍后重试',
    )
  })
})
