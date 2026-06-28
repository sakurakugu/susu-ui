import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Affix from './Affix.vue'

function mockRect(element: Element, rect: Partial<DOMRect>) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width: 120,
    height: 40,
    top: 0,
    right: 120,
    bottom: 40,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
    ...rect,
  } as DOMRect)
}

describe('Affix', () => {
  it('渲染默认内容', async () => {
    const wrapper = mount(Affix, {
      slots: {
        default: '<button>保存筛选</button>',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.classes()).toContain('su-affix')
    expect(wrapper.find('button').text()).toBe('保存筛选')
  })

  it('滚动超过顶部偏移后固定内容并触发 change', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Affix, {
      props: {
        offsetTop: 12,
      },
      slots: {
        default: '<button>提交审批</button>',
      },
      attachTo: document.body,
    })
    const root = wrapper.find('.su-affix').element
    const content = wrapper.find('.su-affix__content').element

    mockRect(root, {
      top: 8,
      bottom: 48,
      left: 24,
      width: 160,
    })
    mockRect(content, {
      top: 8,
      bottom: 48,
      left: 24,
      width: 160,
      height: 40,
    })
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(80)

    window.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('is-fixed')
    expect(wrapper.attributes('style')).toContain('height: 40px')
    expect(wrapper.find('.su-affix__content').attributes('style')).toContain('position: fixed')
    expect(wrapper.find('.su-affix__content').attributes('style')).toContain('top: 12px')
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('支持底部固定', async () => {
    vi.useFakeTimers()
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    const wrapper = mount(Affix, {
      props: {
        offsetTop: undefined,
        offsetBottom: 24,
      },
      slots: {
        default: '<button>批量发布</button>',
      },
      attachTo: document.body,
    })
    const root = wrapper.find('.su-affix').element
    const content = wrapper.find('.su-affix__content').element

    mockRect(root, {
      top: 560,
      bottom: 600,
      left: 32,
      width: 180,
    })
    mockRect(content, {
      top: 560,
      bottom: 600,
      left: 32,
      width: 180,
      height: 40,
    })
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)

    window.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('is-fixed')
    expect(wrapper.find('.su-affix__content').attributes('style')).toContain('bottom: 24px')

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('支持自定义滚动容器', async () => {
    vi.useFakeTimers()
    const target = document.createElement('div')
    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 64,
    })
    document.body.appendChild(target)

    const wrapper = mount(Affix, {
      props: {
        offsetTop: 8,
        target: () => target,
      },
      slots: {
        default: '<button>同步库存</button>',
      },
      attachTo: document.body,
    })
    const root = wrapper.find('.su-affix').element
    const content = wrapper.find('.su-affix__content').element

    mockRect(target, {
      top: 100,
      bottom: 420,
      left: 0,
      width: 320,
      height: 320,
    })
    mockRect(root, {
      top: 104,
      bottom: 144,
      left: 16,
      width: 140,
    })
    mockRect(content, {
      top: 104,
      bottom: 144,
      left: 16,
      width: 140,
      height: 40,
    })

    target.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('is-fixed')
    expect(wrapper.find('.su-affix__content').attributes('style')).toContain('top: 108px')

    wrapper.unmount()
    target.remove()
    vi.useRealTimers()
  })
})
