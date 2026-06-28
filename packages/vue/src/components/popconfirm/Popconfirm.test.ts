import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Popconfirm from './Popconfirm.vue'

describe('Popconfirm', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('点击触发器后展示确认内容和操作按钮', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: '确认归档项目？',
        description: '归档后项目会从当前列表移除。',
      },
      slots: {
        default: '<button>归档</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popconfirm').trigger('click')

    const popper = document.body.querySelector('.su-popconfirm__popper')
    expect(popper?.getAttribute('role')).toBe('dialog')
    expect(popper?.textContent).toContain('确认归档项目？')
    expect(popper?.textContent).toContain('归档后项目会从当前列表移除。')
    expect(popper?.textContent).toContain('取消')
    expect(popper?.textContent).toContain('确定')
    expect(wrapper.find('.su-popconfirm').attributes('aria-expanded')).toBe('true')

    wrapper.unmount()
  })

  it('点击确定后触发确认事件并关闭浮层', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: '确认删除客户？',
      },
      slots: {
        default: '<button>删除</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popconfirm').trigger('click')
    const buttons = document.body.querySelectorAll('.su-popconfirm__actions button')
    buttons[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(document.body.querySelector('.su-popconfirm__popper')).toBeNull()

    wrapper.unmount()
  })

  it('点击取消后触发取消事件并关闭浮层', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: '取消发布排期？',
      },
      slots: {
        default: '<button>取消发布</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popconfirm').trigger('click')
    const buttons = document.body.querySelectorAll('.su-popconfirm__actions button')
    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(document.body.querySelector('.su-popconfirm__popper')).toBeNull()

    wrapper.unmount()
  })

  it('支持插槽、位置、宽度和隐藏箭头', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        visible: true,
        placement: 'bottom-end',
        showArrow: false,
        width: '320px',
      },
      slots: {
        default: '<button>审批</button>',
        icon: '<span class="custom-icon">?</span>',
        title: '<span class="custom-title">确认通过审批</span>',
        description: '<span class="custom-description">通过后进入付款流程。</span>',
        actions: '<button class="custom-action">我知道了</button>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const popper = document.body.querySelector<HTMLElement>('.su-popconfirm__popper')
    expect(popper?.classList.contains('su-popconfirm__popper--bottom')).toBe(true)
    expect(popper?.style.width).toBe('320px')
    expect(document.body.querySelector('.custom-icon')?.textContent).toBe('?')
    expect(document.body.querySelector('.custom-title')?.textContent).toBe('确认通过审批')
    expect(document.body.querySelector('.custom-description')?.textContent).toBe(
      '通过后进入付款流程。',
    )
    expect(document.body.querySelector('.custom-action')?.textContent).toBe('我知道了')
    expect(document.body.querySelector('.su-popconfirm__arrow')).toBeNull()

    wrapper.unmount()
  })

  it('受控显示时触发更新事件', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        visible: false,
        title: '确认变更状态？',
      },
      slots: {
        default: '<button>变更</button>',
      },
    })

    await wrapper.find('.su-popconfirm').trigger('click')

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toHaveLength(1)

    wrapper.unmount()
  })

  it('点击外部或按 Escape 时关闭浮层', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: '确认关闭窗口？',
      },
      slots: {
        default: '<button>关闭</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popconfirm').trigger('click')
    expect(document.body.querySelector('.su-popconfirm__popper')).not.toBeNull()

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-popconfirm__popper')).toBeNull()

    await wrapper.find('.su-popconfirm').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-popconfirm__popper')).toBeNull()

    wrapper.unmount()
  })

  it('禁用后不显示浮层', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: '禁用确认',
        disabled: true,
      },
      slots: {
        default: '<button>打开</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-popconfirm').trigger('click')
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-popconfirm__popper')).toBeNull()

    wrapper.unmount()
  })
})
