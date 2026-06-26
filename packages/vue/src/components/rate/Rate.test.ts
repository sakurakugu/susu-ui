import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Rate from './Rate.vue'

describe('Rate', () => {
  it('渲染默认评分', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
      },
    })

    expect(wrapper.classes()).toContain('su-rate')
    expect(wrapper.classes()).toContain('su-rate--medium')
    expect(wrapper.findAll('.su-rate__item')).toHaveLength(5)
  })

  it('支持 v-model 更新', async () => {
    const wrapper = mount(Rate)

    await wrapper.findAll('.su-rate__item')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
  })

  it('支持自定义最大值和尺寸', () => {
    const wrapper = mount(Rate, {
      props: {
        max: 7,
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-rate--large')
    expect(wrapper.findAll('.su-rate__item')).toHaveLength(7)
  })

  it('支持再次点击清除评分', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
        clearable: true,
      },
    })

    await wrapper.findAll('.su-rate__item')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    expect(wrapper.emitted('change')?.[0]).toEqual([0])
  })

  it('支持半星评分', async () => {
    const wrapper = mount(Rate, {
      props: {
        allowHalf: true,
      },
    })
    const item = wrapper.findAll('.su-rate__item')[2]

    item.element.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 20,
      }) as DOMRect

    await item.trigger('click', {
      clientX: 8,
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.5])
  })

  it('支持小数精度评分', async () => {
    const wrapper = mount(Rate, {
      props: {
        precision: 0.1,
      },
    })
    const item = wrapper.findAll('.su-rate__item')[3]

    item.element.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 100,
      }) as DOMRect

    await item.trigger('click', {
      clientX: 70,
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3.7])
  })

  it('支持展示任意小数评分', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3.7,
      },
    })

    expect(wrapper.findAll('.su-rate__star-fill')[3].attributes('style')).toBe(
      'width: 70%;',
    )
  })

  it('支持自定义图标', () => {
    const wrapper = mount(Rate, {
      slots: {
        icon: '<span class="custom-rate-icon">心</span>',
      },
    })

    expect(wrapper.find('.custom-rate-icon').exists()).toBe(true)
  })

  it('支持悬停预览并离开恢复', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 2,
      },
    })

    await wrapper.findAll('.su-rate__item')[3].trigger('mousemove')

    expect(wrapper.emitted('hoverChange')?.[0]).toEqual([4])

    await wrapper.trigger('mouseleave')

    expect(wrapper.findAll('.su-rate__star-fill')[3].attributes('style')).toBe(
      'width: 0%;',
    )
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(Rate, {
      props: {
        disabled: true,
      },
    })
    const readonlyWrapper = mount(Rate, {
      props: {
        readonly: true,
      },
    })

    await disabledWrapper.findAll('.su-rate__item')[1].trigger('click')
    await readonlyWrapper.findAll('.su-rate__item')[1].trigger('click')

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(
      disabledWrapper.find('.su-rate__item').attributes('disabled'),
    ).toBeDefined()
    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('支持键盘操作', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 2,
        allowHalf: true,
      },
    })

    await wrapper.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.5])

    await wrapper.setProps({
      modelValue: 2.5,
    })
    await wrapper.trigger('keydown', {
      key: 'End',
    })

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('支持辅助文本', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 4,
        showText: true,
        texts: ['极差', '失望', '一般', '满意', '惊喜'],
      },
    })

    expect(wrapper.find('.su-rate__text').text()).toBe('满意')
  })
})
