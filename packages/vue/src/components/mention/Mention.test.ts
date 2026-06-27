import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Mention from './Mention.vue'
import { formKey } from '../form/context'

const options = [
  { label: '张晨', value: 'zhangchen', description: '产品经理' },
  { label: '李明', value: 'liming', description: '前端工程师' },
  { label: '王雪', value: 'wangxue', disabled: true },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Mention', () => {
  it('渲染默认提及输入框', async () => {
    const wrapper = mount(Mention, {
      props: {
        placeholder: '输入 @ 提及成员',
        options,
      },
      attachTo: document.body,
    })

    const mention = wrapper.find('.su-mention')

    expect(mention.classes()).toContain('su-mention')
    expect(mention.classes()).toContain('su-mention--medium')
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      '输入 @ 提及成员',
    )

    await wrapper.find('input').setValue('@')

    expect(document.body.querySelectorAll('.su-mention__option')).toHaveLength(
      3,
    )

    wrapper.unmount()
  })

  it('输入提及关键词时更新 v-model 并过滤候选项', async () => {
    const wrapper = mount(Mention, {
      props: {
        options,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').setValue('请 @李')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['请 @李'])
    expect(wrapper.emitted('input')?.[0][0]).toBe('请 @李')
    expect(document.body.querySelectorAll('.su-mention__option')).toHaveLength(
      1,
    )
    expect(document.body.querySelector('.su-mention__label')?.textContent).toBe(
      '李明',
    )

    wrapper.unmount()
  })

  it('选择候选项后插入提及文本', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Mention, {
      props: {
        modelValue: '请 @李 确认',
        options,
        onSelect,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    input.setSelectionRange(4, 4)
    await wrapper.find('input').trigger('focus')
    const option = document.body.querySelector('.su-mention__option')
    option?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      '请 @liming 确认',
    ])
    expect(wrapper.emitted('select')?.[0]).toEqual([
      options[1],
      '请 @liming 确认',
    ])
    expect(onSelect).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('支持键盘选择候选项并跳过禁用项', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@',
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

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['@liming '])

    wrapper.unmount()
  })

  it('支持自定义候选来源', async () => {
    const fetchSuggestions = vi.fn((query: string) =>
      query
        ? [{ label: `成员 ${query}`, value: query }]
        : [{ label: '默认成员', value: 'default' }],
    )
    const wrapper = mount(Mention, {
      props: {
        fetchSuggestions,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').setValue('@周')

    expect(fetchSuggestions).toHaveBeenCalledWith('周', '@')
    expect(document.body.querySelector('.su-mention__label')?.textContent).toBe(
      '成员 周',
    )

    wrapper.unmount()
  })

  it('支持多行输入和自定义触发符', async () => {
    const wrapper = mount(Mention, {
      props: {
        type: 'textarea',
        prefix: '#',
        options: [{ label: '预算审批', value: 'budget' }],
        rows: 4,
      },
      attachTo: document.body,
    })

    await wrapper.find('textarea').setValue('关联 #预')

    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    expect(document.body.querySelectorAll('.su-mention__option')).toHaveLength(
      1,
    )
  })

  it('支持清空输入', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@liming ',
        clearable: true,
        options,
      },
    })

    await wrapper.find('.su-mention__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(Mention, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    const mention = wrapper.find('.su-mention')

    expect(mention.classes()).toContain('su-mention--large')
    expect(mention.classes()).toContain('su-mention--error')
  })

  it('支持禁用状态和原生属性', () => {
    const wrapper = mount(Mention, {
      props: {
        id: 'assignee',
        name: 'assignee',
        disabled: true,
        required: true,
        maxlength: 40,
      },
      attrs: {
        'aria-label': '处理人',
      },
    })
    const input = wrapper.find('input')

    expect(wrapper.find('.su-mention').classes()).toContain('is-disabled')
    expect(input.attributes('id')).toBe('assignee')
    expect(input.attributes('name')).toBe('assignee')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('maxlength')).toBe('40')
    expect(input.attributes('aria-label')).toBe('处理人')
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Mention, {
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

    const mention = wrapper.find('.su-mention')

    expect(mention.classes()).toContain('su-mention--small')
    expect(mention.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露输入框控制方法', () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@zhangchen ',
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
