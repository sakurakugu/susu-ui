import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Descriptions from './Descriptions.vue'
import DescriptionsItem from './DescriptionsItem.vue'
import type { DescriptionsItem as DescriptionsItemType } from './context'

describe('Descriptions', () => {
  it('通过 items 渲染基础描述列表', () => {
    const items: DescriptionsItemType[] = [
      { label: '用户名', content: '苏苏' },
      { label: '角色', content: '设计师' },
    ]
    const wrapper = mount(Descriptions, {
      props: {
        title: '用户信息',
        items,
      },
    })

    expect(wrapper.classes()).toContain('su-descriptions')
    expect(wrapper.text()).toContain('用户信息')
    expect(wrapper.text()).toContain('用户名')
    expect(wrapper.text()).toContain('苏苏')
    expect(wrapper.findAll('.su-descriptions__item')).toHaveLength(2)
  })

  it('支持 DescriptionsItem 声明内容和自定义插槽', async () => {
    const wrapper = mount(Descriptions, {
      slots: {
        default: [
          h(DescriptionsItem, { label: '成员' }, { default: () => '小满' }),
          h(
            DescriptionsItem,
            { label: '状态', span: 2 },
            { default: () => h('strong', '在线') },
          ),
        ],
      },
    })
    await nextTick()

    expect(wrapper.findAll('.su-descriptions__item')).toHaveLength(2)
    expect(wrapper.text()).toContain('成员')
    expect(wrapper.text()).toContain('在线')
    expect(wrapper.find('strong').exists()).toBe(true)
  })

  it('根据布局、尺寸、边框和冒号渲染样式', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: '团队', content: '体验组' }],
        column: 2,
        size: 'large',
        layout: 'vertical',
        border: true,
        colon: false,
        labelWidth: 96,
      },
    })

    expect(wrapper.classes()).toContain('su-descriptions--large')
    expect(wrapper.classes()).toContain('su-descriptions--vertical')
    expect(wrapper.classes()).toContain('su-descriptions--border')
    expect(wrapper.classes()).not.toContain('su-descriptions--colon')
    expect(wrapper.attributes('style')).toContain('--su-descriptions-column: 2')
    expect(wrapper.attributes('style')).toContain(
      '--su-descriptions-label-width: 96px',
    )
  })

  it('限制 span 不超过 column', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 2,
        items: [{ label: '备注', content: '跨列内容', span: 4 }],
      },
    })

    expect(
      wrapper.find('.su-descriptions__item').attributes('style'),
    ).toContain('grid-column: span 2')
  })
})
