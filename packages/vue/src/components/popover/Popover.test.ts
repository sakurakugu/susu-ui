import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from './Popover.vue'

describe('Popover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('点击触发器后展示标题和内容', async () => {
    const wrapper = mount(Popover, {
      props: {
        title: '项目说明',
        content: '这里展示更完整的补充信息',
      },
      slots: {
        default: '<button>查看</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popover').trigger('click')

    const popper = document.body.querySelector('.su-popover__popper')
    expect(popper?.getAttribute('role')).toBe('dialog')
    expect(popper?.textContent).toContain('项目说明')
    expect(popper?.textContent).toContain('这里展示更完整的补充信息')
    expect(wrapper.find('.su-popover').attributes('aria-expanded')).toBe('true')

    wrapper.unmount()
  })

  it('支持标题插槽、内容插槽、位置和隐藏箭头', async () => {
    const wrapper = mount(Popover, {
      props: {
        visible: true,
        placement: 'top-end',
        showArrow: false,
        width: '320px',
      },
      slots: {
        default: '<button>详情</button>',
        title: '<span class="custom-title">自定义标题</span>',
        content: '<div class="custom-content">自定义内容</div>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const popper = document.body.querySelector<HTMLElement>(
      '.su-popover__popper',
    )
    expect(popper?.classList.contains('su-popover__popper--top')).toBe(true)
    expect(popper?.style.width).toBe('320px')
    expect(document.body.querySelector('.custom-title')?.textContent).toBe(
      '自定义标题',
    )
    expect(document.body.querySelector('.custom-content')?.textContent).toBe(
      '自定义内容',
    )
    expect(document.body.querySelector('.su-popover__arrow')).toBeNull()

    wrapper.unmount()
  })

  it('支持 hover 触发和延迟隐藏', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Popover, {
      props: {
        trigger: 'hover',
        content: '悬停内容',
      },
      slots: {
        default: '<button>悬停</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popover').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(document.body.querySelector('.su-popover__popper')).not.toBeNull()

    await wrapper.find('.su-popover').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(120)
    expect(document.body.querySelector('.su-popover__popper')).toBeNull()

    wrapper.unmount()
  })

  it('点击外部或按 Escape 时关闭浮层', async () => {
    const wrapper = mount(Popover, {
      props: {
        content: '点击关闭',
      },
      slots: {
        default: '<button>打开</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popover').trigger('click')
    expect(document.body.querySelector('.su-popover__popper')).not.toBeNull()

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-popover__popper')).toBeNull()

    await wrapper.find('.su-popover').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-popover__popper')).toBeNull()

    wrapper.unmount()
  })

  it('受控显示时触发更新事件', async () => {
    const wrapper = mount(Popover, {
      props: {
        visible: false,
        content: '受控内容',
      },
      slots: {
        default: '<button>打开</button>',
      },
    })

    await wrapper.find('.su-popover').trigger('click')

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toHaveLength(1)

    wrapper.unmount()
  })

  it('禁用后不显示浮层', async () => {
    const wrapper = mount(Popover, {
      props: {
        content: '禁用内容',
        disabled: true,
      },
      slots: {
        default: '<button>打开</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-popover__popper')).toBeNull()

    wrapper.unmount()
  })
})
