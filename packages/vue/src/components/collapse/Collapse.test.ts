import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'

describe('Collapse', () => {
  it('渲染折叠面板并根据 v-model 展开内容', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: ['basic'],
      },
      slots: {
        default: [
          h(CollapseItem, { title: '基础信息', name: 'basic' }, () => '基础内容'),
          h(CollapseItem, { title: '权限设置', name: 'permission' }, () => '权限内容'),
        ],
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('su-collapse')
    expect(wrapper.classes()).toContain('su-collapse--medium')
    expect(wrapper.findAll('.su-collapse__item')).toHaveLength(2)
    expect(wrapper.findAll('.su-collapse__panel')[0].isVisible()).toBe(true)
    expect(wrapper.text()).toContain('基础内容')
  })

  it('支持点击切换多项展开并触发事件', async () => {
    const onChange = vi.fn()
    const onItemClick = vi.fn()
    const wrapper = mount(Collapse, {
      props: {
        modelValue: ['basic'],
        onChange,
        onItemClick,
      },
      slots: {
        default: [
          h(CollapseItem, { title: '基础信息', name: 'basic' }, () => '基础内容'),
          h(CollapseItem, { title: '权限设置', name: 'permission' }, () => '权限内容'),
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('.su-collapse__header')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['basic', 'permission']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['basic', 'permission']])
    expect(onChange).toHaveBeenCalledWith(['basic', 'permission'])
    expect(onItemClick).toHaveBeenCalled()
  })

  it('支持手风琴模式', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: 'basic',
        accordion: true,
      },
      slots: {
        default: [
          h(CollapseItem, { title: '基础信息', name: 'basic' }, () => '基础内容'),
          h(CollapseItem, { title: '权限设置', name: 'permission' }, () => '权限内容'),
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('.su-collapse__header')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['permission'])
  })

  it('忽略禁用面板点击', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
      },
      slots: {
        default: [
          h(CollapseItem, { title: '审计记录', name: 'audit', disabled: true }, () => '审计内容'),
        ],
      },
    })
    await nextTick()

    await wrapper.find('.su-collapse__header').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.su-collapse__panel').isVisible()).toBe(false)
  })

  it('支持自定义标题、额外内容和样式属性', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [0],
        size: 'large',
        bordered: false,
        ghost: true,
      },
      slots: {
        default: h(
          CollapseItem,
          {},
          {
            title: () => h('strong', '自定义标题'),
            extra: () => h('span', '已完成'),
            default: () => '自定义内容',
          },
        ),
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('su-collapse--large')
    expect(wrapper.classes()).not.toContain('is-bordered')
    expect(wrapper.classes()).toContain('is-ghost')
    expect(wrapper.find('strong').text()).toBe('自定义标题')
    expect(wrapper.find('.su-collapse__extra').text()).toBe('已完成')
  })

  it('支持键盘切换和销毁未展开内容', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: [],
        destroyInactivePanel: true,
      },
      slots: {
        default: h(CollapseItem, { title: '配置项', name: 'config' }, () => '配置内容'),
      },
    })
    await nextTick()

    expect(wrapper.text()).not.toContain('配置内容')

    await wrapper.find('.su-collapse__header').trigger('keydown', {
      key: 'Enter',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['config']])
  })
})
