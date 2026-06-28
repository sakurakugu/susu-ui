import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Cascader from './Cascader.vue'
import { formKey } from '../form/context'

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang', disabled: true },
        ],
      },
      { label: '宁波', value: 'ningbo' },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing' }],
  },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Cascader', () => {
  it('渲染默认级联选择器', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        placeholder: '请选择地区',
      },
    })

    expect(wrapper.find('.su-cascader').classes()).toContain('su-cascader')
    expect(wrapper.find('.su-cascader').classes()).toContain('su-cascader--medium')
    expect(wrapper.find('.su-cascader').classes()).toContain('is-empty')
    expect(wrapper.find('.su-cascader__placeholder').text()).toBe('请选择地区')
  })

  it('支持打开面板并选择叶子节点', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Cascader, {
      props: {
        options,
        onChange,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-cascader__trigger').trigger('click')
    expect(document.body.querySelector('.su-cascader__panel')).toBeTruthy()
    expect(document.body.querySelectorAll('.su-cascader__column')).toHaveLength(1)

    const zhejiang = document.body.querySelectorAll('.su-cascader__option')[0]
    zhejiang.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelectorAll('.su-cascader__column')).toHaveLength(2)

    const hangzhou = document.body.querySelectorAll('.su-cascader__option')[2]
    hangzhou.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelectorAll('.su-cascader__column')).toHaveLength(3)

    const xihu = document.body.querySelectorAll('.su-cascader__option')[4]
    xihu.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhejiang', 'hangzhou', 'xihu']])
    expect(wrapper.emitted('change')?.[0][0]).toEqual(['zhejiang', 'hangzhou', 'xihu'])
    expect(wrapper.emitted('change')?.[0][1]).toHaveLength(3)
    expect(onChange).toHaveBeenCalledOnce()
    expect(document.body.querySelector('.su-cascader__panel')).toBeFalsy()

    wrapper.unmount()
  })

  it('默认不选择非叶子节点', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-cascader__trigger').trigger('click')
    document.body
      .querySelectorAll('.su-cascader__option')[0]
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.querySelector('.su-cascader__panel')).toBeTruthy()

    wrapper.unmount()
  })

  it('支持 changeOnSelect 选择任意层级', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        changeOnSelect: true,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-cascader__trigger').trigger('click')
    document.body
      .querySelectorAll('.su-cascader__option')[0]
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhejiang']])

    wrapper.unmount()
  })

  it('根据绑定值显示完整路径', () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
        options,
      },
    })

    expect(wrapper.find('.su-cascader__value').text()).toBe('浙江 / 杭州 / 西湖区')
  })

  it('支持清空选择', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
        options,
        clearable: true,
      },
    })

    await wrapper.find('.su-cascader__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('跳过禁用选项和禁用状态', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-cascader__trigger').trigger('click')
    document.body
      .querySelectorAll('.su-cascader__option')[0]
      .dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await wrapper.vm.$nextTick()
    document.body
      .querySelectorAll('.su-cascader__option')[2]
      .dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await wrapper.vm.$nextTick()

    const disabledOption = document.body.querySelectorAll('.su-cascader__option')[5]
    expect(disabledOption.hasAttribute('disabled')).toBe(true)

    wrapper.unmount()

    const disabledWrapper = mount(Cascader, {
      props: {
        options,
        disabled: true,
      },
    })

    expect(disabledWrapper.find('.su-cascader').classes()).toContain('is-disabled')
    expect(disabledWrapper.find('.su-cascader__trigger').attributes('disabled')).toBeDefined()
  })

  it('支持键盘导航选择', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.su-cascader__trigger')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowRight' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowRight' })
    await trigger.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['zhejiang', 'hangzhou', 'xihu']])

    wrapper.unmount()
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(Cascader, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.find('.su-cascader').classes()).toContain('su-cascader--large')
    expect(wrapper.find('.su-cascader').classes()).toContain('su-cascader--error')
  })

  it('转发原生属性和事件并渲染隐藏表单值', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Cascader, {
      props: {
        id: 'area',
        name: 'area',
        required: true,
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
        options,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'area-help',
      },
    })

    const trigger = wrapper.find('.su-cascader__trigger')
    await trigger.trigger('focus')
    await trigger.trigger('blur')

    expect(trigger.attributes('id')).toBe('area')
    expect(trigger.attributes('aria-describedby')).toBe('area-help')
    expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('area')
    expect(wrapper.find('input[type="hidden"]').attributes('value')).toBe('zhejiang,hangzhou,xihu')
    expect(wrapper.find('input[type="hidden"]').attributes('required')).toBeDefined()
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Cascader, {
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

    expect(wrapper.find('.su-cascader').classes()).toContain('su-cascader--small')
    expect(wrapper.find('.su-cascader').classes()).toContain('is-disabled')
    expect(wrapper.find('.su-cascader__trigger').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
        options,
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.su-cascader__trigger').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(trigger)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-cascader__panel')).toBeTruthy()

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-cascader__panel')).toBeFalsy()

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(trigger)

    wrapper.unmount()
  })
})
