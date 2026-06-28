import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TagInput from './TagInput.vue'

describe('TagInput', () => {
  it('渲染默认标签输入框', () => {
    const wrapper = mount(TagInput, {
      props: {
        placeholder: '添加客户标签',
      },
    })

    expect(wrapper.classes()).toContain('su-tag-input')
    expect(wrapper.classes()).toContain('su-tag-input--medium')
    expect(wrapper.find('input').attributes('placeholder')).toBe('添加客户标签')
  })

  it('支持 v-model 添加标签', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
      },
    })
    const input = wrapper.find('input')

    await input.setValue('续费意向')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['重点客户', '续费意向']])
    expect(wrapper.emitted('add')?.[0]).toEqual(['续费意向'])
    expect(input.element.value).toBe('')
  })

  it('支持逗号添加标签', async () => {
    const wrapper = mount(TagInput)
    const input = wrapper.find('input')

    await input.setValue('华东区域')
    await input.trigger('keydown', { key: ',' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['华东区域']])
  })

  it('默认失焦时提交输入内容', async () => {
    const wrapper = mount(TagInput)
    const input = wrapper.find('input')

    await input.setValue('待回访')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['待回访']])
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('支持移除标签和退格删除最后一个标签', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户', '续费意向'],
      },
    })

    await wrapper.find('.su-tag-input__tag-close').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['续费意向']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['重点客户', 0])

    await wrapper.setProps({ modelValue: ['续费意向'] })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])
  })

  it('支持清空标签', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
        clearable: true,
      },
    })

    await wrapper.find('.su-tag-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('阻止重复标签并触发 invalid', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
      },
    })
    const input = wrapper.find('input')

    await input.setValue('重点客户')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('invalid')?.[0]).toEqual(['重点客户'])
  })

  it('允许重复标签', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
        allowDuplicate: true,
      },
    })
    const input = wrapper.find('input')

    await input.setValue('重点客户')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['重点客户', '重点客户']])
  })

  it('支持最大标签数量限制', async () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
        max: 1,
      },
    })

    expect(wrapper.classes()).toContain('is-limit-reached')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('支持自定义标签校验', async () => {
    const validateTag = vi.fn((tag: string) => tag.length >= 3)
    const wrapper = mount(TagInput, {
      props: {
        validateTag,
      },
    })
    const input = wrapper.find('input')

    await input.setValue('高')
    await input.trigger('keydown', { key: 'Enter' })

    expect(validateTag).toHaveBeenCalledWith('高', [])
    expect(wrapper.emitted('invalid')?.[0]).toEqual(['高'])
  })

  it('支持尺寸、状态、禁用和只读状态', () => {
    const disabledWrapper = mount(TagInput, {
      props: {
        size: 'large',
        status: 'error',
        disabled: true,
      },
    })
    const readonlyWrapper = mount(TagInput, {
      props: {
        readonly: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('su-tag-input--large')
    expect(disabledWrapper.classes()).toContain('su-tag-input--error')
    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('支持前后置插槽和标签插槽', () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['VIP'],
      },
      slots: {
        prefix: '前',
        suffix: '后',
        tag: '<template #tag="{ tag }"><strong>{{ tag }}客户</strong></template>',
      },
    })

    expect(wrapper.find('.su-tag-input__prefix').text()).toBe('前')
    expect(wrapper.find('.su-tag-input__suffix').text()).toBe('后')
    expect(wrapper.find('.su-tag-input__tag').text()).toContain('VIP客户')
  })

  it('暴露输入框控制方法', () => {
    const wrapper = mount(TagInput, {
      props: {
        modelValue: ['重点客户'],
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
