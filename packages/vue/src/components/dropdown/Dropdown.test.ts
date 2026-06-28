import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Dropdown from './Dropdown.vue'

describe('Dropdown', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('点击触发器后展示选项菜单', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        options: [
          { label: '编辑', value: 'edit' },
          { label: '删除', value: 'delete' },
        ],
      },
      slots: {
        default: '<button>更多</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-dropdown').trigger('click')

    const menu = document.body.querySelector('.su-dropdown__menu')
    expect(menu?.getAttribute('role')).toBe('menu')
    expect(menu?.textContent).toContain('编辑')
    expect(wrapper.find('.su-dropdown').attributes('aria-expanded')).toBe('true')

    wrapper.unmount()
  })

  it('点击可用选项后触发 command 并关闭菜单', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        options: [{ label: '归档', value: 'archive' }],
      },
      slots: {
        default: '<button>更多</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-dropdown').trigger('click')
    document.body.querySelector<HTMLButtonElement>('.su-dropdown__item')?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('command')?.[0]).toEqual([
      'archive',
      { label: '归档', value: 'archive' },
    ])
    expect(document.body.querySelector('.su-dropdown__menu')).toBeNull()

    wrapper.unmount()
  })

  it('禁用选项不会触发 command', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        options: [{ label: '删除', value: 'delete', disabled: true }],
      },
      slots: {
        default: '<button>更多</button>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body.querySelector<HTMLButtonElement>('.su-dropdown__item')?.click()

    expect(wrapper.emitted('command')).toBeUndefined()

    wrapper.unmount()
  })

  it('支持菜单插槽和位置类名', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        placement: 'top-end',
      },
      slots: {
        default: '<button>更多</button>',
        menu: '<div class="custom-menu">自定义内容</div>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const menu = document.body.querySelector('.su-dropdown__menu')
    expect(menu?.classList.contains('su-dropdown__menu--top')).toBe(true)
    expect(document.body.querySelector('.custom-menu')?.textContent).toBe('自定义内容')

    wrapper.unmount()
  })

  it('支持 hover 触发和延迟隐藏', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'hover',
        options: [{ label: '编辑', value: 'edit' }],
      },
      slots: {
        default: '<button>更多</button>',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-dropdown').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(document.body.querySelector('.su-dropdown__menu')).not.toBeNull()

    await wrapper.find('.su-dropdown').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(120)
    expect(document.body.querySelector('.su-dropdown__menu')).toBeNull()

    wrapper.unmount()
  })

  it('受控显示时触发更新事件', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: false,
        options: [{ label: '编辑', value: 'edit' }],
      },
      slots: {
        default: '<button>更多</button>',
      },
    })

    await wrapper.find('.su-dropdown').trigger('click')

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toHaveLength(1)

    wrapper.unmount()
  })
})
