import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu, { type MenuItem } from './Menu.vue'

const items: MenuItem[] = [
  {
    key: 'dashboard',
    label: '工作台',
  },
  {
    key: 'components',
    label: '组件',
    children: [
      { key: 'button', label: '按钮' },
      { key: 'menu', label: '菜单' },
    ],
  },
  {
    key: 'settings',
    label: '设置',
    disabled: true,
  },
]

describe('Menu', () => {
  it('渲染基础菜单和空状态', () => {
    const wrapper = mount(Menu, {
      props: {
        items,
      },
    })
    const emptyWrapper = mount(Menu, {
      slots: {
        empty: '没有菜单',
      },
    })

    expect(wrapper.classes()).toContain('su-menu')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('工作台')
    expect(wrapper.text()).toContain('组件')
    expect(wrapper.text()).not.toContain('按钮')
    expect(emptyWrapper.find('.su-menu__empty').text()).toBe('没有菜单')
  })

  it('支持点击展开和收起子菜单', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Menu, {
      props: {
        items,
        openKeys: [],
        onOpenChange,
      },
    })

    await wrapper.findAll('.su-menu__trigger')[1].trigger('click')

    expect(wrapper.emitted('update:openKeys')?.[0]).toEqual([['components']])
    expect(wrapper.text()).toContain('按钮')
    expect(onOpenChange).toHaveBeenCalledWith(
      ['components'],
      expect.objectContaining({ key: 'components' }),
      true,
    )

    await wrapper.findAll('.su-menu__trigger')[1].trigger('click')

    expect(wrapper.emitted('update:openKeys')?.[1]).toEqual([[]])
  })

  it('支持默认展开全部子菜单', () => {
    const wrapper = mount(Menu, {
      props: {
        items,
        defaultOpenAll: true,
      },
    })

    expect(wrapper.text()).toContain('菜单')
  })

  it('支持选择菜单项和自定义内容', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Menu, {
      props: {
        items,
        openKeys: ['components'],
        onSelect,
      },
      slots: {
        default: ({ item }: { item: MenuItem }) => `菜单项：${item.label}`,
      },
    })

    await wrapper.findAll('.su-menu__trigger')[2].trigger('click')

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['button'])
    expect(wrapper.text()).toContain('菜单项：按钮')
    expect(onSelect).toHaveBeenCalledWith(
      'button',
      expect.objectContaining({ key: 'button' }),
    )
  })

  it('禁用菜单项不会响应交互', async () => {
    const wrapper = mount(Menu, {
      props: {
        items,
      },
    })

    await wrapper.findAll('.su-menu__trigger')[2].trigger('click')

    expect(wrapper.emitted('update:selectedKey')).toBeUndefined()
  })

  it('支持水平模式和折叠状态', () => {
    const horizontalWrapper = mount(Menu, {
      props: {
        items,
        mode: 'horizontal',
      },
    })
    const collapsedWrapper = mount(Menu, {
      props: {
        items,
        collapse: true,
      },
    })

    expect(horizontalWrapper.classes()).toContain('su-menu--horizontal')
    expect(
      horizontalWrapper.find('[role="menu"]').attributes('aria-orientation'),
    ).toBe('horizontal')
    expect(collapsedWrapper.classes()).toContain('is-collapsed')
  })

  it('支持键盘展开和选择', async () => {
    const wrapper = mount(Menu, {
      props: {
        items,
        openKeys: [],
      },
    })

    await wrapper.findAll('.su-menu__trigger')[1].trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:openKeys')?.[0]).toEqual([['components']])

    await wrapper.find('.su-menu__trigger').trigger('keydown', {
      key: 'Enter',
    })

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['dashboard'])
  })
})
