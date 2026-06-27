import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Transfer, { type TransferOption } from './Transfer.vue'

const data: TransferOption[] = [
  { label: 'Button 按钮', value: 'button', description: '基础操作' },
  { label: 'Input 输入框', value: 'input' },
  { label: 'Table 表格', value: 'table', disabled: true },
  { label: 'Tree 树', value: 'tree' },
]

describe('Transfer', () => {
  it('渲染基础穿梭框和目标列表', () => {
    const wrapper = mount(Transfer, {
      props: {
        data,
        modelValue: ['tree'],
        titles: ['可选组件', '已选组件'],
      },
    })

    expect(wrapper.classes()).toContain('su-transfer')
    expect(wrapper.text()).toContain('可选组件')
    expect(wrapper.text()).toContain('已选组件')
    expect(wrapper.findAll('.su-transfer__panel')[0].text()).toContain(
      'Button 按钮',
    )
    expect(wrapper.findAll('.su-transfer__panel')[1].text()).toContain(
      'Tree 树',
    )
  })

  it('支持勾选后移动到右侧', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        data,
        modelValue: [],
        onChange,
      },
    })

    await wrapper.findAll('.su-transfer__item input')[0].setValue(true)
    await wrapper.findAll('.su-transfer__button')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['button']])
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['button'],
      'right',
      ['button'],
    ])
    expect(onChange).toHaveBeenCalledWith(['button'], 'right', ['button'])
  })

  it('支持从右侧移回左侧', async () => {
    const wrapper = mount(Transfer, {
      props: {
        data,
        modelValue: ['button', 'tree'],
      },
    })

    const rightPanel = wrapper.findAll('.su-transfer__panel')[1]
    await rightPanel.findAll('.su-transfer__item input')[0].setValue(true)
    await wrapper.findAll('.su-transfer__button')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['tree']])
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['tree'],
      'left',
      ['button'],
    ])
  })

  it('支持筛选和自定义筛选方法', async () => {
    const wrapper = mount(Transfer, {
      props: {
        data,
        filterable: true,
        filterMethod: (query, option) =>
          `${option.description}`.includes(query),
      },
    })

    await wrapper.find('.su-transfer__filter-input').setValue('基础')

    expect(wrapper.findAll('.su-transfer__panel')[0].text()).toContain(
      'Button 按钮',
    )
    expect(wrapper.findAll('.su-transfer__panel')[0].text()).not.toContain(
      'Input 输入框',
    )
  })

  it('全选只勾选未禁用选项', async () => {
    const wrapper = mount(Transfer, {
      props: {
        data,
      },
    })

    await wrapper.find('.su-transfer__header input').setValue(true)
    await wrapper.findAll('.su-transfer__button')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['button', 'input', 'tree'],
    ])
  })

  it('支持插槽自定义标题、空状态和选项内容', () => {
    const wrapper = mount(Transfer, {
      props: {
        data: [],
      },
      slots: {
        'left-title': '左侧标题',
        'right-title': '右侧标题',
        empty: ({ direction }: { direction: string }) => `${direction} 空`,
        default: ({ option }: { option: TransferOption }) =>
          `组件：${option.label}`,
      },
    })
    const optionWrapper = mount(Transfer, {
      props: {
        data: [data[0]],
      },
      slots: {
        default: ({ option }: { option: TransferOption }) =>
          `组件：${option.label}`,
      },
    })

    expect(wrapper.text()).toContain('左侧标题')
    expect(wrapper.text()).toContain('right 空')
    expect(optionWrapper.text()).toContain('组件：Button 按钮')
  })

  it('禁用状态不会响应移动', async () => {
    const wrapper = mount(Transfer, {
      props: {
        data,
        disabled: true,
      },
    })

    expect(
      wrapper.findAll('.su-transfer__button')[0].attributes('disabled'),
    ).toBe('')
    await wrapper.findAll('.su-transfer__button')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
