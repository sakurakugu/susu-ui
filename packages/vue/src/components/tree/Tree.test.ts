import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tree, { type TreeNode } from './Tree.vue'

const data: TreeNode[] = [
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
        children: [{ key: 'tree', label: 'Tree' }],
      },
    ],
  },
]

describe('Tree', () => {
  it('渲染基础树和空状态', () => {
    const wrapper = mount(Tree, {
      props: {
        data,
        expandedKeys: ['docs'],
      },
    })
    const emptyWrapper = mount(Tree, {
      slots: {
        empty: '没有节点',
      },
    })

    expect(wrapper.classes()).toContain('su-tree')
    expect(wrapper.find('[role="tree"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('文档')
    expect(wrapper.text()).toContain('指南')
    expect(wrapper.text()).not.toContain('Tree')
    expect(emptyWrapper.find('.su-tree__empty').text()).toBe('没有节点')
  })

  it('支持点击展开和收起节点', async () => {
    const onNodeExpand = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data,
        expandedKeys: [],
        onNodeExpand,
      },
    })

    await wrapper.find('.su-tree__switcher').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']])
    expect(wrapper.text()).toContain('指南')
    expect(onNodeExpand).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'docs' }),
      true,
    )

    await wrapper.find('.su-tree__switcher').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[1]).toEqual([[]])
  })

  it('支持默认展开全部节点', () => {
    const wrapper = mount(Tree, {
      props: {
        data,
        defaultExpandAll: true,
      },
    })

    expect(wrapper.text()).toContain('Tree')
  })

  it('支持选中节点和自定义节点内容', async () => {
    const onNodeClick = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data,
        expandedKeys: ['docs'],
        onNodeClick,
      },
      slots: {
        default: ({ node }: { node: TreeNode }) => `节点：${node.label}`,
      },
    })

    await wrapper.findAll('.su-tree__node')[1].trigger('click')

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['guide'])
    expect(wrapper.text()).toContain('节点：指南')
    expect(onNodeClick).toHaveBeenCalledOnce()
  })

  it('支持复选和半选状态', async () => {
    const onCheck = vi.fn()
    const wrapper = mount(Tree, {
      props: {
        data,
        expandedKeys: ['docs'],
        checkedKeys: [],
        checkable: true,
        onCheck,
      },
    })

    await wrapper.findAll('.su-tree__checkbox-input')[1].setValue(true)

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['guide']])
    expect(wrapper.findAll('.su-tree__checkbox')[0].classes()).toContain(
      'is-indeterminate',
    )
    expect(onCheck).toHaveBeenCalledWith(['guide'], expect.any(Object), true)

    await wrapper.findAll('.su-tree__checkbox-input')[0].setValue(true)

    expect(wrapper.emitted('update:checkedKeys')?.[1]).toEqual([
      ['guide', 'docs', 'components'],
    ])
  })

  it('禁用节点不会响应交互', async () => {
    const wrapper = mount(Tree, {
      props: {
        data: [{ key: 'disabled', label: '禁用', disabled: true }],
      },
    })

    await wrapper.find('.su-tree__node').trigger('click')

    expect(wrapper.emitted('update:selectedKey')).toBeUndefined()
  })

  it('支持键盘展开和选择', async () => {
    const wrapper = mount(Tree, {
      props: {
        data,
        expandedKeys: [],
      },
    })

    await wrapper.find('.su-tree__node').trigger('keydown', {
      key: 'ArrowRight',
    })
    await wrapper.find('.su-tree__node').trigger('keydown', {
      key: 'Enter',
    })

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']])
    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['docs'])
  })
})
