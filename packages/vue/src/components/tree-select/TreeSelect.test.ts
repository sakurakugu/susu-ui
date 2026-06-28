import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import TreeSelect, { type TreeSelectNode } from './TreeSelect.vue'
import { formKey } from '../form/context'

const data: TreeSelectNode[] = [
  {
    label: '产品中心',
    value: 'product',
    children: [
      { label: '组件库', value: 'components' },
      { label: '设计系统', value: 'design' },
    ],
  },
  {
    label: '研发平台',
    value: 'platform',
    children: [
      { label: '构建服务', value: 'build' },
      { label: '发布流程', value: 'release', disabled: true },
    ],
  },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('TreeSelect', () => {
  it('渲染默认树选择器', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        placeholder: '请选择业务目录',
      },
    })

    expect(wrapper.find('.su-tree-select').classes()).toContain('su-tree-select')
    expect(wrapper.find('.su-tree-select').classes()).toContain('su-tree-select--medium')
    expect(wrapper.find('.su-tree-select').classes()).toContain('is-empty')
    expect(wrapper.find('.su-tree-select__placeholder').text()).toBe('请选择业务目录')
  })

  it('支持打开面板并选择节点', async () => {
    const onChange = vi.fn()
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        expandedKeys: ['product'],
        onChange,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tree-select__trigger').trigger('click')
    expect(document.body.querySelector('.su-tree-select__panel')).toBeTruthy()
    expect(document.body.textContent).toContain('组件库')

    document.body
      .querySelectorAll('.su-tree-select__node')[1]
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['components'])
    expect(wrapper.emitted('change')?.[0][0]).toBe('components')
    expect(wrapper.emitted('change')?.[0][1]).toEqual(expect.objectContaining({ label: '组件库' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(document.body.querySelector('.su-tree-select__panel')).toBeFalsy()

    wrapper.unmount()
  })

  it('支持展开节点和默认展开全部', async () => {
    const onNodeExpand = vi.fn()
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        expandedKeys: [],
        onNodeExpand,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tree-select__trigger').trigger('click')
    document.body
      .querySelector('.su-tree-select__switcher')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['product']])
    expect(onNodeExpand).toHaveBeenCalledWith(expect.objectContaining({ value: 'product' }), true)

    wrapper.unmount()

    const expandAllWrapper = mount(TreeSelect, {
      props: {
        data,
        defaultExpandAll: true,
      },
      attachTo: document.body,
    })

    await expandAllWrapper.find('.su-tree-select__trigger').trigger('click')
    expect(document.body.textContent).toContain('构建服务')

    expandAllWrapper.unmount()
  })

  it('支持清空选择', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        modelValue: 'components',
        data,
        clearable: true,
      },
    })

    await wrapper.find('.su-tree-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
  })

  it('支持搜索过滤和自定义节点', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        searchable: true,
      },
      slots: {
        node: ({ node }) => `节点：${node.label}`,
        empty: '没有匹配目录',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tree-select__trigger').trigger('click')
    const input = document.body.querySelector<HTMLInputElement>('.su-tree-select__search-input')
    input!.value = '构建'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('节点：构建服务')
    expect(document.body.textContent).not.toContain('组件库')

    input!.value = '不存在'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('没有匹配目录')

    wrapper.unmount()
  })

  it('禁用节点和禁用状态不会响应选择', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        defaultExpandAll: true,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-tree-select__trigger').trigger('click')
    const disabledNode = Array.from(document.body.querySelectorAll('.su-tree-select__node')).find(
      (node) => node.textContent?.includes('发布流程'),
    )!
    disabledNode.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()

    const disabledWrapper = mount(TreeSelect, {
      props: {
        data,
        disabled: true,
      },
    })

    expect(disabledWrapper.find('.su-tree-select').classes()).toContain('is-disabled')
    expect(disabledWrapper.find('.su-tree-select__trigger').attributes('disabled')).toBeDefined()
  })

  it('支持键盘导航选择', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        data,
        expandedKeys: ['product'],
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.su-tree-select__trigger')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['components'])

    wrapper.unmount()
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.find('.su-tree-select').classes()).toContain('su-tree-select--large')
    expect(wrapper.find('.su-tree-select').classes()).toContain('su-tree-select--error')
  })

  it('转发原生属性和事件并渲染隐藏表单值', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(TreeSelect, {
      props: {
        id: 'directory',
        name: 'directory',
        required: true,
        modelValue: 'components',
        data,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'directory-help',
      },
    })

    const trigger = wrapper.find('.su-tree-select__trigger')
    await trigger.trigger('focus')
    await trigger.trigger('blur')

    expect(trigger.attributes('id')).toBe('directory')
    expect(trigger.attributes('aria-describedby')).toBe('directory-help')
    expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('directory')
    expect(wrapper.find('input[type="hidden"]').attributes('value')).toBe('components')
    expect(wrapper.find('input[type="hidden"]').attributes('required')).toBeDefined()
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(TreeSelect, {
      global: {
        provide: {
          [formKey as symbol]: {
            labelWidth: computed(() => undefined),
            labelPosition: computed(() => 'right'),
            size: computed(() => 'small'),
            disabled: computed(() => true),
          },
        },
      },
    })

    expect(wrapper.find('.su-tree-select').classes()).toContain('su-tree-select--small')
    expect(wrapper.find('.su-tree-select').classes()).toContain('is-disabled')
    expect(wrapper.find('.su-tree-select__trigger').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        modelValue: 'components',
        data,
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.su-tree-select__trigger').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(trigger)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-tree-select__panel')).toBeTruthy()

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-tree-select__panel')).toBeFalsy()

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(trigger)

    wrapper.unmount()
  })
})
