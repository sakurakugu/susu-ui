import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Select from './Select.vue'
import { formKey } from '../form/context'

const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen', disabled: true },
]

describe('Select', () => {
  it('渲染默认选择器', () => {
    const wrapper = mount(Select, {
      props: {
        placeholder: '请选择城市',
        options,
      },
    })

    expect(wrapper.classes()).toContain('su-select')
    expect(wrapper.classes()).toContain('su-select--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.findAll('option')).toHaveLength(4)
    expect(wrapper.find('option').text()).toBe('请选择城市')
  })

  it('支持 v-model 更新并保留数字值类型', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Select, {
      props: {
        modelValue: 1,
        options: [
          { label: '一月', value: 1 },
          { label: '二月', value: 2 },
        ],
        onChange,
      },
    })

    await wrapper.find('select').setValue('2')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0][0]).toBe(2)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(Select, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-select--large')
    expect(wrapper.classes()).toContain('su-select--error')
  })

  it('支持禁用状态和禁用选项', () => {
    const wrapper = mount(Select, {
      props: {
        disabled: true,
        options,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('option')[2].attributes('disabled')).toBeDefined()
  })

  it('支持清空选择', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'beijing',
        clearable: true,
        options,
      },
    })

    await wrapper.find('.su-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('禁用时不显示清空按钮', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'beijing',
        clearable: true,
        disabled: true,
        options,
      },
    })

    expect(wrapper.find('.su-select__clear').exists()).toBe(false)
  })

  it('支持默认插槽传入原生选项', async () => {
    const wrapper = mount(Select, {
      slots: {
        default:
          '<option value="draft">草稿</option><option value="published">已发布</option>',
      },
    })

    await wrapper.find('select').setValue('published')

    expect(wrapper.findAll('option')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['published'])
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Select, {
      props: {
        id: 'city',
        name: 'city',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-label': '城市',
      },
    })

    const select = wrapper.find('select')
    await select.trigger('focus')
    await select.trigger('blur')

    expect(select.attributes('id')).toBe('city')
    expect(select.attributes('name')).toBe('city')
    expect(select.attributes('required')).toBeDefined()
    expect(select.attributes('aria-label')).toBe('城市')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Select, {
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

    expect(wrapper.classes()).toContain('su-select--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('暴露选择器控制方法', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'beijing',
        options,
      },
      attachTo: document.body,
    })
    const select = wrapper.find('select').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(select)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(select)

    wrapper.unmount()
  })
})
