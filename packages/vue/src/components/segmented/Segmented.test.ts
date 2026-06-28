import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, ref } from 'vue'
import Segmented, { type SegmentedOption } from './Segmented.vue'
import { formKey } from '../form/context'

const options: SegmentedOption[] = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month', disabled: true },
]

const SegmentedModelDemo = defineComponent({
  name: 'SegmentedModelDemo',
  components: { Segmented },
  props: {
    onChange: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const value = ref('day')
    return { options, value }
  },
  template: `
    <Segmented v-model="value" :options="options" name="range" @change="onChange" />
  `,
})

describe('Segmented', () => {
  it('渲染默认分段控制器', () => {
    const wrapper = mount(Segmented, {
      props: {
        options,
      },
    })

    expect(wrapper.classes()).toContain('su-segmented')
    expect(wrapper.classes()).toContain('su-segmented--medium')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.findAll('.su-segmented__item')).toHaveLength(3)
    expect(wrapper.find('.su-segmented__item').attributes('aria-checked')).toBe('true')
  })

  it('支持 v-model 更新和 change 事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(SegmentedModelDemo, {
      props: {
        onChange,
      },
    })

    await wrapper.findAll('.su-segmented__item')[1].trigger('click')

    expect(wrapper.vm.value).toBe('week')
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange.mock.calls[0][0]).toBe('week')
  })

  it('跳过禁用选项', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'day',
        options,
        onChange,
      },
    })

    const items = wrapper.findAll('.su-segmented__item')
    await items[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(onChange).not.toHaveBeenCalled()
    expect(items[2].attributes('disabled')).toBeDefined()
  })

  it('支持键盘切换', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'day',
        options,
      },
      attachTo: document.body,
    })

    await wrapper.findAll('.su-segmented__item')[0].trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['week'])
    expect(wrapper.emitted('change')?.[0][0]).toBe('week')

    wrapper.unmount()
  })

  it('支持尺寸、块级和禁用状态', () => {
    const wrapper = mount(Segmented, {
      props: {
        options,
        size: 'large',
        block: true,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('su-segmented--large')
    expect(wrapper.classes()).toContain('is-block')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-segmented__item').attributes('disabled')).toBeDefined()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Segmented, {
      props: {
        options,
      },
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

    expect(wrapper.classes()).toContain('su-segmented--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-segmented__item').attributes('disabled')).toBeDefined()
  })
})
