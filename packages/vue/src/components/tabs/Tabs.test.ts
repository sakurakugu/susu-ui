import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Tabs from './Tabs.vue'
import TabPane from './TabPane.vue'

describe('Tabs', () => {
  it('渲染默认标签页并自动选中第一项', async () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: [
          h(TabPane, { label: '概览', name: 'overview' }, () => '概览内容'),
          h(TabPane, { label: '成员', name: 'member' }, () => '成员内容'),
        ],
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('su-tabs')
    expect(wrapper.classes()).toContain('su-tabs--line')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['overview'])
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2)
    const panels = wrapper.findAll('.su-tabs__panel')
    expect(panels[0].isVisible()).toBe(true)
    expect(panels[0].text()).toBe('概览内容')
    expect(panels[1].isVisible()).toBe(false)
  })

  it('支持 v-model 切换并触发事件', async () => {
    const onChange = vi.fn()
    const onTabClick = vi.fn()
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'overview',
        onChange,
        onTabClick,
      },
      slots: {
        default: [
          h(TabPane, { label: '概览', name: 'overview' }, () => '概览内容'),
          h(TabPane, { label: '设置', name: 'setting' }, () => '设置内容'),
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['setting'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['setting'])
    expect(onChange).toHaveBeenCalledWith('setting')
    expect(onTabClick).toHaveBeenCalled()
  })

  it('忽略禁用标签页点击', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'overview',
      },
      slots: {
        default: [
          h(TabPane, { label: '概览', name: 'overview' }, () => '概览内容'),
          h(TabPane, { label: '审计', name: 'audit', disabled: true }, () => '审计内容'),
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.text()).toContain('概览内容')
  })

  it('支持自定义标签插槽、额外内容和样式属性', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'profile',
        type: 'card',
        size: 'large',
        placement: 'left',
        stretch: true,
      },
      slots: {
        default: [
          h(
            TabPane,
            { name: 'profile' },
            {
              label: () => h('strong', '资料'),
              default: () => '资料内容',
            },
          ),
        ],
        extra: () => h('button', '新增'),
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('su-tabs--card')
    expect(wrapper.classes()).toContain('su-tabs--large')
    expect(wrapper.classes()).toContain('su-tabs--left')
    expect(wrapper.classes()).toContain('is-stretch')
    expect(wrapper.find('strong').text()).toBe('资料')
    expect(wrapper.find('.su-tabs__extra').text()).toBe('新增')
  })

  it('未指定 name 时使用顺序索引作为值', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 1,
      },
      slots: {
        default: [
          h(TabPane, { label: '一' }, () => '第一项'),
          h(TabPane, { label: '二' }, () => '第二项'),
        ],
      },
    })
    await nextTick()

    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true')
    expect(wrapper.text()).toContain('第二项')
  })

  it('支持键盘方向键切换可用标签页', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'one',
      },
      attachTo: document.body,
      slots: {
        default: [
          h(TabPane, { label: '一', name: 'one' }, () => '第一项'),
          h(TabPane, { label: '二', name: 'two', disabled: true }, () => '第二项'),
          h(TabPane, { label: '三', name: 'three' }, () => '第三项'),
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['three'])
    wrapper.unmount()
  })

  it('支持延迟渲染和销毁非激活面板', async () => {
    const lazyWrapper = mount(Tabs, {
      props: {
        modelValue: 'one',
      },
      slots: {
        default: [
          h(TabPane, { label: '一', name: 'one' }, () => '第一项'),
          h(TabPane, { label: '二', name: 'two', lazy: true }, () => '第二项'),
        ],
      },
    })
    await nextTick()

    expect(lazyWrapper.text()).not.toContain('第二项')

    const destroyWrapper = mount(Tabs, {
      props: {
        modelValue: 'one',
        destroyInactivePane: true,
      },
      slots: {
        default: [
          h(TabPane, { label: '一', name: 'one' }, () => '第一项'),
          h(TabPane, { label: '二', name: 'two' }, () => '第二项'),
        ],
      },
    })
    await nextTick()

    expect(destroyWrapper.findAll('.su-tabs__panel')).toHaveLength(1)
  })
})
