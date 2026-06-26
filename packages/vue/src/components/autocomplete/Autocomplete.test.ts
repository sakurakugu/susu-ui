import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Autocomplete from './Autocomplete.vue'
import { formKey } from '../form/context'

const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen', disabled: true },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Autocomplete', () => {
  it('渲染默认自动完成输入框', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        placeholder: '请输入城市',
        options,
      },
      attachTo: document.body,
    })

    const autocomplete = wrapper.find('.su-autocomplete')

    expect(autocomplete.classes()).toContain('su-autocomplete')
    expect(autocomplete.classes()).toContain('su-autocomplete--medium')
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入城市')

    await wrapper.find('input').trigger('focus')

    expect(
      document.body.querySelectorAll('.su-autocomplete__option'),
    ).toHaveLength(3)

    wrapper.unmount()
  })

  it('输入时更新 v-model 并过滤建议项', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        options,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').setValue('北')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['北'])
    expect(wrapper.emitted('input')?.[0][0]).toBe('北')
    expect(
      document.body.querySelectorAll('.su-autocomplete__option'),
    ).toHaveLength(1)
    expect(
      document.body.querySelector('.su-autocomplete__option')?.textContent,
    ).toBe('北京')

    wrapper.unmount()
  })

  it('支持选择建议项', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Autocomplete, {
      props: {
        options,
        onSelect,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').trigger('focus')
    const option = document.body.querySelectorAll('.su-autocomplete__option')[1]
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beijing'])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
    expect(onSelect).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('支持键盘选择建议项并跳过禁用项', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        options,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beijing'])

    wrapper.unmount()
  })

  it('支持自定义建议来源', async () => {
    const fetchSuggestions = vi.fn((query: string) =>
      query
        ? [{ label: `搜索 ${query}`, value: query }]
        : [{ label: '默认', value: 'default' }],
    )
    const wrapper = mount(Autocomplete, {
      props: {
        fetchSuggestions,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').setValue('组件')

    expect(fetchSuggestions).toHaveBeenCalledWith('组件')
    expect(
      document.body.querySelector('.su-autocomplete__option')?.textContent,
    ).toBe('搜索 组件')

    wrapper.unmount()
  })

  it('支持清空输入', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        modelValue: '上海',
        clearable: true,
        options,
      },
    })

    await wrapper.find('.su-autocomplete__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    const autocomplete = wrapper.find('.su-autocomplete')

    expect(autocomplete.classes()).toContain('su-autocomplete--large')
    expect(autocomplete.classes()).toContain('su-autocomplete--error')
  })

  it('支持禁用状态和原生属性', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        id: 'city',
        name: 'city',
        disabled: true,
        required: true,
      },
      attrs: {
        'aria-label': '城市',
      },
    })
    const input = wrapper.find('input')

    expect(wrapper.find('.su-autocomplete').classes()).toContain('is-disabled')
    expect(input.attributes('id')).toBe('city')
    expect(input.attributes('name')).toBe('city')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-label')).toBe('城市')
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Autocomplete, {
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

    const autocomplete = wrapper.find('.su-autocomplete')

    expect(autocomplete.classes()).toContain('su-autocomplete--small')
    expect(autocomplete.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露输入框控制方法', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        modelValue: '上海',
        options,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
