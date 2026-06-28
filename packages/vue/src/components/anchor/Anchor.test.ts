import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Anchor, { type AnchorItem } from './Anchor.vue'

const items: AnchorItem[] = [
  { key: 'overview', href: '#overview', title: '项目概览' },
  { key: 'usage', href: '#usage', title: '接入方式' },
]

function appendSection(id: string, top: number) {
  const section = document.createElement('section')
  section.id = id
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
    width: 320,
    height: 80,
    top,
    right: 320,
    bottom: top + 80,
    left: 0,
    x: 0,
    y: top,
    toJSON: () => '',
  } as DOMRect)
  document.body.appendChild(section)
  return section
}

describe('Anchor', () => {
  it('渲染锚点列表和空状态', () => {
    const wrapper = mount(Anchor, {
      props: {
        items,
      },
    })

    expect(wrapper.classes()).toContain('su-anchor')
    expect(wrapper.findAll('.su-anchor__link').map((link) => link.text())).toEqual([
      '项目概览',
      '接入方式',
    ])

    const empty = mount(Anchor)
    expect(empty.find('.su-anchor__empty').text()).toBe('暂无锚点')
  })

  it('点击锚点后滚动并触发事件', async () => {
    vi.useFakeTimers()
    const overview = appendSection('overview', 180)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        items,
        offsetTop: 24,
        behavior: 'auto',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-anchor__link').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 156,
      behavior: 'auto',
    })
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('change')?.[0]).toEqual(['overview', expect.any(Object)])
    expect(wrapper.find('.su-anchor__item').classes()).toContain('is-active')

    wrapper.unmount()
    overview.remove()
    vi.useRealTimers()
  })

  it('滚动时根据当前位置更新激活项', async () => {
    vi.useFakeTimers()
    const overview = appendSection('overview', -80)
    const usage = appendSection('usage', 0)
    const wrapper = mount(Anchor, {
      props: {
        items,
        offsetTop: 16,
      },
      attachTo: document.body,
    })

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
    window.dispatchEvent(new Event('scroll'))
    await vi.advanceTimersByTimeAsync(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.su-anchor__item')[1].classes()).toContain('is-active')
    expect(wrapper.emitted('change')?.[0]).toEqual(['usage', expect.any(Object)])

    wrapper.unmount()
    overview.remove()
    usage.remove()
    vi.useRealTimers()
  })

  it('支持自定义滚动容器和禁用项', async () => {
    vi.useFakeTimers()
    const target = document.createElement('div')
    const scrollTo = vi.fn()
    Object.defineProperty(target, 'scrollTop', {
      configurable: true,
      value: 40,
    })
    Object.defineProperty(target, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    })
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 240,
      top: 100,
      right: 300,
      bottom: 340,
      left: 0,
      x: 0,
      y: 100,
      toJSON: () => '',
    } as DOMRect)
    const overview = appendSection('overview', 180)
    document.body.appendChild(target)

    const wrapper = mount(Anchor, {
      props: {
        items: [{ ...items[0], disabled: true }],
        target: () => target,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-anchor__link').trigger('click')

    expect(scrollTo).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.su-anchor__item').classes()).toContain('is-disabled')

    wrapper.unmount()
    overview.remove()
    target.remove()
    vi.useRealTimers()
  })
})
