import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import Layout from './Layout.vue'
import Header from './Header.vue'
import Sider from './Sider.vue'
import Content from './Content.vue'
import Footer from './Footer.vue'

describe('Layout', () => {
  it('渲染基础上下结构', () => {
    const wrapper = mount(Layout, {
      slots: {
        default: [
          h(Header, null, { default: () => '顶部导航' }),
          h(Content, null, { default: () => '项目总览' }),
          h(Footer, null, { default: () => '版权信息' }),
        ],
      },
    })

    expect(wrapper.classes()).toContain('su-layout')
    expect(wrapper.classes()).not.toContain('su-layout--has-sider')
    expect(wrapper.find('.su-layout__header').text()).toBe('顶部导航')
    expect(wrapper.find('.su-layout__content').text()).toBe('项目总览')
    expect(wrapper.find('.su-layout__footer').text()).toBe('版权信息')
  })

  it('自动识别侧边栏布局', async () => {
    const wrapper = mount(Layout, {
      slots: {
        default: [
          h(Sider, null, { default: () => '项目菜单' }),
          h(Content, null, { default: () => '内容区域' }),
        ],
      },
    })

    await nextTick()

    expect(wrapper.classes()).toContain('su-layout--has-sider')
    expect(wrapper.find('.su-layout__sider').text()).toContain('项目菜单')
  })

  it('支持手动声明侧边栏方向', () => {
    const wrapper = mount(Layout, {
      props: {
        hasSider: true,
      },
    })

    expect(wrapper.classes()).toContain('su-layout--has-sider')
  })

  it('支持顶部、底部和侧边栏尺寸', () => {
    const wrapper = mount(Layout, {
      slots: {
        default: [
          h(Header, { height: 72 }, { default: () => '页头' }),
          h(
            Sider,
            { width: '248px', collapsedWidth: 80, defaultCollapsed: true },
            { default: () => '侧边栏' },
          ),
          h(Footer, { height: '48px' }, { default: () => '页脚' }),
        ],
      },
    })

    expect(wrapper.find('.su-layout__header').attributes('style')).toContain(
      'height: 72px',
    )
    expect(wrapper.find('.su-layout__sider').attributes('style')).toContain(
      'width: 80px',
    )
    expect(wrapper.find('.su-layout__footer').attributes('style')).toContain(
      'min-height: 48px',
    )
  })

  it('支持受控折叠和自定义触发器', async () => {
    const collapsed = ref(false)
    const wrapper = mount(Sider, {
      props: {
        collapsed: collapsed.value,
        collapsible: true,
        'onUpdate:collapsed': (value: boolean) => {
          collapsed.value = value
          void wrapper.setProps({ collapsed: value })
        },
      },
      slots: {
        default: ({ collapsed: slotCollapsed }) =>
          slotCollapsed ? '精简菜单' : '完整菜单',
        trigger: ({ collapsed: slotCollapsed }) =>
          slotCollapsed ? '展开菜单' : '收起菜单',
      },
    })

    expect(wrapper.text()).toContain('完整菜单')
    expect(wrapper.text()).toContain('收起菜单')

    await wrapper.find('.su-layout__sider-trigger').trigger('click')

    expect(collapsed.value).toBe(true)
    expect(wrapper.emitted('collapse')?.[0]).toEqual([true])
    expect(wrapper.text()).toContain('精简菜单')
    expect(wrapper.text()).toContain('展开菜单')
  })
})
