import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import List from './List.vue'
import ListItem from './ListItem.vue'

describe('List', () => {
  it('渲染标题和列表项', () => {
    const wrapper = mount(List, {
      props: {
        title: '待办事项',
      },
      slots: {
        default: [
          h(ListItem, { title: '确认合同', description: '法务已完成初审' }),
          h(ListItem, { title: '同步排期' }, { default: () => '今天 16:00' }),
        ],
      },
    })

    expect(wrapper.classes()).toContain('su-list')
    expect(wrapper.text()).toContain('待办事项')
    expect(wrapper.findAll('.su-list__item')).toHaveLength(2)
    expect(wrapper.text()).toContain('确认合同')
    expect(wrapper.text()).toContain('今天 16:00')
  })

  it('支持尺寸、布局和视觉状态', () => {
    const wrapper = mount(List, {
      props: {
        size: 'large',
        itemLayout: 'vertical',
        bordered: false,
        divided: false,
        striped: true,
        hoverable: true,
      },
    })

    expect(wrapper.classes()).toContain('su-list--large')
    expect(wrapper.classes()).toContain('su-list--vertical')
    expect(wrapper.classes()).not.toContain('is-bordered')
    expect(wrapper.classes()).not.toContain('is-divided')
    expect(wrapper.classes()).toContain('is-striped')
    expect(wrapper.classes()).toContain('is-hoverable')
  })

  it('支持加载和空状态', () => {
    const loadingWrapper = mount(List, {
      props: {
        loading: true,
      },
    })
    const emptyWrapper = mount(List, {
      props: {
        emptyText: '暂无项目记录',
      },
    })

    expect(loadingWrapper.find('.su-list__loading').text()).toBe('加载中...')
    expect(emptyWrapper.classes()).toContain('is-empty')
    expect(emptyWrapper.find('.su-list__empty').text()).toBe('暂无项目记录')
  })

  it('ListItem 支持头像、标题、描述、操作和扩展内容插槽', () => {
    const wrapper = mount(ListItem, {
      slots: {
        avatar: '<span>苏</span>',
        title: '<strong>苏州客户回访</strong>',
        description: '<span>客户成功团队负责</span>',
        default: '<p>本周需要确认续约意向。</p>',
        actions: '<button>记录结果</button>',
        extra: '<time>今天</time>',
      },
    })

    expect(wrapper.find('.su-list__item-avatar').text()).toBe('苏')
    expect(wrapper.find('strong').text()).toBe('苏州客户回访')
    expect(wrapper.find('.su-list__item-description').text()).toBe(
      '客户成功团队负责',
    )
    expect(wrapper.find('button').text()).toBe('记录结果')
    expect(wrapper.find('time').text()).toBe('今天')
  })
})
