import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VirtualList from './VirtualList.vue'

const items = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `客户 ${index + 1}`,
}))

type Customer = (typeof items)[number]

function toCustomer(item: unknown) {
  return item as Customer
}

describe('VirtualList', () => {
  it('只渲染可视区和缓冲区数据', () => {
    const wrapper = mount(VirtualList, {
      props: {
        items,
        height: 120,
        itemHeight: 30,
        buffer: 1,
        itemKey: 'id',
      },
      slots: {
        default: ({ item, index }: { item: unknown; index: number }) =>
          `${index} - ${toCustomer(item).name}`,
      },
    })

    expect(wrapper.classes()).toContain('su-virtual-list')
    expect(
      wrapper.find('.su-virtual-list__content').attributes('style'),
    ).toContain('height: 3000px')
    expect(wrapper.findAll('.su-virtual-list__item')).toHaveLength(6)
    expect(wrapper.text()).toContain('0 - 客户 1')
    expect(wrapper.text()).not.toContain('客户 40')
  })

  it('滚动后更新渲染范围并触发 scroll 事件', async () => {
    const onScroll = vi.fn()
    const wrapper = mount(VirtualList, {
      props: {
        items,
        height: 120,
        itemHeight: 30,
        buffer: 0,
        onScroll,
      },
      slots: {
        default: ({ item }: { item: unknown }) => toCustomer(item).name,
      },
    })
    const viewport = wrapper.find('.su-virtual-list__viewport')

    viewport.element.scrollTop = 300
    await viewport.trigger('scroll')

    const renderedItems = wrapper.findAll('.su-virtual-list__item')

    expect(renderedItems).toHaveLength(4)
    expect(renderedItems[0].text()).toBe('客户 11')
    expect(wrapper.emitted('scroll')?.[0][1]).toMatchObject({
      scrollTop: 300,
      startIndex: 10,
      endIndex: 14,
      visibleCount: 4,
    })
    expect(onScroll).toHaveBeenCalledOnce()
  })

  it('支持空状态插槽', () => {
    const wrapper = mount(VirtualList, {
      props: {
        items: [],
        emptyText: '没有客户记录',
      },
      slots: {
        empty: '请调整筛选条件',
      },
    })

    expect(wrapper.find('.su-virtual-list__empty').text()).toBe(
      '请调整筛选条件',
    )
    expect(wrapper.text()).not.toContain('没有客户记录')
  })

  it('支持滚动到指定索引', async () => {
    const wrapper = mount(VirtualList, {
      props: {
        items,
        height: 120,
        itemHeight: 30,
        buffer: 0,
      },
      slots: {
        default: ({ item }: { item: unknown }) => toCustomer(item).name,
      },
    })

    wrapper.vm.scrollToIndex(20)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.su-virtual-list__viewport').element.scrollTop).toBe(
      600,
    )
    expect(wrapper.text()).toContain('客户 21')
  })
})
