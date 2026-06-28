import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VirtualTree, { type VirtualTreeNode } from './VirtualTree.vue'

const data: VirtualTreeNode[] = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'guide', label: '指南' },
      { key: 'components', label: '组件' },
    ],
  },
  {
    key: 'packages',
    label: '包',
    children: [
      {
        key: 'vue',
        label: 'Vue',
        children: Array.from({ length: 40 }, (_, index) => ({
          key: `component-${index + 1}`,
          label: `组件 ${index + 1}`,
        })),
      },
    ],
  },
]

describe('VirtualTree', () => {
  it('只渲染可视区和缓冲区节点', () => {
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        expandedKeys: ['docs', 'packages', 'vue'],
        height: 120,
        itemHeight: 30,
        buffer: 1,
      },
    })

    expect(wrapper.classes()).toContain('su-virtual-tree')
    expect(wrapper.find('[role="tree"]').exists()).toBe(true)
    expect(
      wrapper.find('.su-virtual-tree__content').attributes('style'),
    ).toContain('height: 1350px')
    expect(wrapper.findAll('.su-virtual-tree__item')).toHaveLength(6)
    expect(wrapper.text()).toContain('文档')
    expect(wrapper.text()).not.toContain('组件 40')
  })

  it('支持点击展开和收起节点', async () => {
    const onNodeExpand = vi.fn()
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        expandedKeys: [],
        height: 160,
        itemHeight: 32,
        onNodeExpand,
      },
    })

    await wrapper.find('.su-virtual-tree__switcher').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']])
    expect(wrapper.text()).toContain('指南')
    expect(onNodeExpand).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'docs' }),
      true,
    )

    await wrapper.find('.su-virtual-tree__switcher').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[1]).toEqual([[]])
  })

  it('支持默认展开全部节点', () => {
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        defaultExpandAll: true,
        height: 200,
        itemHeight: 32,
      },
    })

    expect(
      wrapper.find('.su-virtual-tree__content').attributes('style'),
    ).toContain('height: 1440px')
  })

  it('支持选中节点和自定义节点内容', async () => {
    const onNodeClick = vi.fn()
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        expandedKeys: ['docs'],
        height: 160,
        onNodeClick,
      },
      slots: {
        default: ({ node }: { node: VirtualTreeNode }) => `节点：${node.label}`,
      },
    })

    await wrapper.findAll('.su-virtual-tree__node')[1].trigger('click')

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['guide'])
    expect(wrapper.text()).toContain('节点：指南')
    expect(onNodeClick).toHaveBeenCalledOnce()
  })

  it('支持复选和半选状态', async () => {
    const onCheck = vi.fn()
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        expandedKeys: ['docs'],
        checkedKeys: [],
        checkable: true,
        height: 160,
        onCheck,
      },
    })

    await wrapper.findAll('.su-virtual-tree__checkbox-input')[1].setValue(true)

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['guide']])
    expect(
      wrapper.findAll('.su-virtual-tree__checkbox')[0].classes(),
    ).toContain('is-indeterminate')
    expect(onCheck).toHaveBeenCalledWith(['guide'], expect.any(Object), true)

    await wrapper.findAll('.su-virtual-tree__checkbox-input')[0].setValue(true)

    expect(wrapper.emitted('update:checkedKeys')?.[1]).toEqual([
      ['guide', 'docs', 'components'],
    ])
  })

  it('禁用节点不会响应交互', async () => {
    const wrapper = mount(VirtualTree, {
      props: {
        data: [{ key: 'disabled', label: '禁用', disabled: true }],
      },
    })

    await wrapper.find('.su-virtual-tree__node').trigger('click')

    expect(wrapper.emitted('update:selectedKey')).toBeUndefined()
  })

  it('支持滚动到指定节点并触发 scroll 事件', async () => {
    const onScroll = vi.fn()
    const wrapper = mount(VirtualTree, {
      props: {
        data,
        expandedKeys: ['docs', 'packages', 'vue'],
        height: 120,
        itemHeight: 30,
        buffer: 0,
        onScroll,
      },
    })
    const viewport = wrapper.find('.su-virtual-tree__viewport')

    wrapper.vm.scrollToKey('component-20')
    await wrapper.vm.$nextTick()

    expect(viewport.element.scrollTop).toBe(720)
    expect(wrapper.text()).toContain('组件 20')

    viewport.element.scrollTop = 300
    await viewport.trigger('scroll')

    expect(wrapper.emitted('scroll')?.[0][1]).toMatchObject({
      scrollTop: 300,
      startIndex: 10,
      endIndex: 14,
      visibleCount: 4,
    })
    expect(onScroll).toHaveBeenCalledOnce()
  })

  it('支持空状态插槽', () => {
    const wrapper = mount(VirtualTree, {
      props: {
        data: [],
        emptyText: '暂无节点',
      },
      slots: {
        empty: '请先创建目录',
      },
    })

    expect(wrapper.find('.su-virtual-tree__empty').text()).toBe('请先创建目录')
    expect(wrapper.text()).not.toContain('暂无节点')
  })
})
