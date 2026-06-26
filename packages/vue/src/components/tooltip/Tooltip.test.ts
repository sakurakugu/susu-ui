import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

describe('Tooltip', () => {
  it('渲染默认触发器并在 hover 后显示提示', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Tooltip, {
      props: {
        content: '保存当前配置',
      },
      slots: {
        default: '<button>保存</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tooltip').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)

    const popper = document.body.querySelector('.su-tooltip__popper')
    expect(popper?.textContent).toContain('保存当前配置')
    expect(popper?.getAttribute('role')).toBe('tooltip')
    expect(
      wrapper.find('.su-tooltip').attributes('aria-describedby'),
    ).toBeTruthy()

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('支持 content 插槽、位置和隐藏箭头', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        visible: true,
        placement: 'bottom-start',
        showArrow: false,
      },
      slots: {
        default: '<button>详情</button>',
        content: '<strong>更多信息</strong>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const popper = document.body.querySelector('.su-tooltip__popper')
    expect(popper?.classList.contains('su-tooltip__popper--bottom')).toBe(true)
    expect(popper?.textContent).toContain('更多信息')
    expect(document.body.querySelector('.su-tooltip__arrow')).toBeNull()

    wrapper.unmount()
  })

  it('支持点击触发和点击外部关闭', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: '点击提示',
        trigger: 'click',
      },
      slots: {
        default: '<button>打开</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tooltip').trigger('click')
    expect(document.body.querySelector('.su-tooltip__popper')).not.toBeNull()

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-tooltip__popper')).toBeNull()

    wrapper.unmount()
  })

  it('支持 visible 受控显示并触发更新事件', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: '受控提示',
        visible: false,
        trigger: 'click',
      },
      slots: {
        default: '<button>打开</button>',
      },
    })

    await wrapper.find('.su-tooltip').trigger('click')

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toHaveLength(1)

    wrapper.unmount()
  })

  it('禁用后不显示提示', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: '禁用提示',
        disabled: true,
      },
      slots: {
        default: '<button>保存</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tooltip').trigger('mouseenter')
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-tooltip__popper')).toBeNull()

    wrapper.unmount()
  })
})
