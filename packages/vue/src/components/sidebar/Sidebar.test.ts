import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from './Sidebar.vue'

describe('Sidebar', () => {
  it('渲染标题、内容和底部区域', () => {
    const wrapper = mount(Sidebar, {
      props: {
        title: '客户筛选',
      },
      slots: {
        default: '本周重点客户',
        footer: '已选择 12 个条件',
      },
    })

    expect(wrapper.classes()).toContain('su-sidebar')
    expect(wrapper.find('.su-sidebar__title').text()).toBe('客户筛选')
    expect(wrapper.find('.su-sidebar__body').text()).toContain('本周重点客户')
    expect(wrapper.find('.su-sidebar__footer').text()).toBe('已选择 12 个条件')
  })

  it('支持不同方向、尺寸、边框和阴影', () => {
    const wrapper = mount(Sidebar, {
      props: {
        placement: 'right',
        width: 320,
        bordered: false,
        shadow: 'always',
      },
    })

    expect(wrapper.classes()).toContain('su-sidebar--right')
    expect(wrapper.classes()).not.toContain('is-bordered')
    expect(wrapper.classes()).toContain('su-sidebar--shadow-always')
    expect(wrapper.attributes('style')).toContain('width: 320px')
  })

  it('支持非受控折叠并触发事件', async () => {
    const wrapper = mount(Sidebar, {
      props: {
        collapsible: true,
        width: 240,
        collapsedWidth: 72,
      },
      slots: {
        default: ({ collapsed }: { collapsed: boolean }) =>
          collapsed ? '窄栏' : '完整侧栏',
      },
    })

    expect(wrapper.text()).toContain('完整侧栏')
    expect(wrapper.attributes('style')).toContain('width: 240px')

    await wrapper.find('.su-sidebar__trigger').trigger('click')

    expect(wrapper.classes()).toContain('is-collapsed')
    expect(wrapper.text()).toContain('窄栏')
    expect(wrapper.attributes('style')).toContain('width: 72px')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
    expect(wrapper.emitted('collapse')?.[0]).toEqual([true])
  })

  it('支持受控折叠状态', async () => {
    const wrapper = mount(Sidebar, {
      props: {
        collapsed: true,
        collapsible: true,
        width: 260,
        collapsedWidth: 56,
      },
    })

    expect(wrapper.classes()).toContain('is-collapsed')
    expect(wrapper.attributes('style')).toContain('width: 56px')

    await wrapper.find('.su-sidebar__trigger').trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([false])
    expect(wrapper.classes()).toContain('is-collapsed')

    await wrapper.setProps({ collapsed: false })
    expect(wrapper.classes()).not.toContain('is-collapsed')
    expect(wrapper.attributes('style')).toContain('width: 260px')
  })

  it('支持 sticky 和自定义插槽', () => {
    const wrapper = mount(Sidebar, {
      props: {
        sticky: true,
        offsetTop: '72px',
        collapsible: true,
      },
      slots: {
        header: '<strong class="custom-header">项目导航</strong>',
        trigger: ({ collapsed }: { collapsed: boolean }) =>
          collapsed ? '展开导航' : '收起导航',
      },
    })

    expect(wrapper.classes()).toContain('is-sticky')
    expect(wrapper.attributes('style')).toContain('top: 72px')
    expect(wrapper.find('.custom-header').text()).toBe('项目导航')
    expect(wrapper.find('.su-sidebar__trigger').text()).toBe('收起导航')
  })
})
