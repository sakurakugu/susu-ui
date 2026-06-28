import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import VirtualizedSelect from './VirtualizedSelect.vue'
import { formKey } from '../form/context'

const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen', disabled: true },
  { label: '杭州', value: 'hangzhou' },
]

const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `客户 ${index + 1}`,
  value: index + 1,
}))

describe('VirtualizedSelect', () => {
  it('渲染默认虚拟选择器', () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        placeholder: '请选择城市',
        options,
      },
    })

    const select = wrapper.find('.su-virtualized-select')

    expect(select.exists()).toBe(true)
    expect(select.classes()).toContain('su-virtualized-select--medium')
    expect(select.classes()).toContain('is-empty')
    expect(wrapper.find('button').text()).toContain('请选择城市')
  })

  it('打开时只渲染可视区和缓冲区选项', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        options: largeOptions,
        height: 120,
        itemHeight: 30,
        buffer: 2,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-virtualized-select__trigger').trigger('click')

    const renderedOptions = document.body.querySelectorAll('.su-virtualized-select__option')
    expect(renderedOptions.length).toBeLessThan(largeOptions.length)
    expect(renderedOptions.length).toBe(8)

    wrapper.unmount()
  })

  it('支持选择并保留数字值类型', async () => {
    const onChange = vi.fn()
    const wrapper = mount(VirtualizedSelect, {
      props: {
        options: largeOptions,
        onChange,
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-virtualized-select__trigger').trigger('click')
    const firstOption = document.body.querySelector(
      '.su-virtualized-select__option',
    ) as HTMLButtonElement
    firstOption.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0][0]).toBe(1)
    expect(onChange).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    const select = wrapper.find('.su-virtualized-select')

    expect(select.classes()).toContain('su-virtualized-select--large')
    expect(select.classes()).toContain('su-virtualized-select--error')
  })

  it('支持禁用状态和禁用选项', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        disabled: true,
        options,
      },
      attachTo: document.body,
    })

    expect(wrapper.find('.su-virtualized-select').classes()).toContain('is-disabled')
    expect(wrapper.find('.su-virtualized-select__trigger').attributes('disabled')).toBeDefined()

    await wrapper.find('.su-virtualized-select__trigger').trigger('click')
    expect(document.body.querySelector('.su-virtualized-select__panel')).toBeNull()

    wrapper.unmount()
  })

  it('支持清空选择', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        modelValue: 'beijing',
        clearable: true,
        options,
      },
    })

    await wrapper.find('.su-virtualized-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('禁用时不显示清空按钮', () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        modelValue: 'beijing',
        clearable: true,
        disabled: true,
        options,
      },
    })

    expect(wrapper.find('.su-virtualized-select__clear').exists()).toBe(false)
  })

  it('支持键盘打开、移动和选择', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        options,
      },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.su-virtualized-select__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beijing'])
    expect(document.body.querySelector('.su-virtualized-select__panel')).toBeNull()

    wrapper.unmount()
  })

  it('支持自定义选项和空状态插槽', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        options: [],
      },
      slots: {
        option: '<span class="custom-option">{{ option.label }}</span>',
        empty: '没有可分配成员',
      },
      attachTo: document.body,
    })

    await wrapper.find('.su-virtualized-select__trigger').trigger('click')

    expect(document.body.querySelector('.su-virtualized-select__empty')?.textContent).toBe(
      '没有可分配成员',
    )

    wrapper.unmount()
  })

  it('转发属性并渲染表单隐藏值', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(VirtualizedSelect, {
      props: {
        id: 'city',
        name: 'city',
        required: true,
        modelValue: 'shanghai',
        options,
        onFocus,
      },
      attrs: {
        'data-field': 'city',
      },
    })

    const trigger = wrapper.find('.su-virtualized-select__trigger')
    await trigger.trigger('focus')
    await trigger.trigger('blur')

    expect(trigger.attributes('id')).toBe('city')
    expect(trigger.attributes('data-field')).toBe('city')
    expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('city')
    expect(wrapper.find('input[type="hidden"]').attributes('value')).toBe('shanghai')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(VirtualizedSelect, {
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

    const select = wrapper.find('.su-virtualized-select')

    expect(select.classes()).toContain('su-virtualized-select--small')
    expect(select.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-virtualized-select__trigger').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(VirtualizedSelect, {
      props: {
        modelValue: 'beijing',
        options,
      },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.su-virtualized-select__trigger').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(trigger)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-virtualized-select__panel')).not.toBeNull()

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(trigger)

    wrapper.unmount()
  })
})
