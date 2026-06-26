import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from './Pagination.vue'

describe('Pagination', () => {
  it('渲染默认分页', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 80,
      },
    })

    expect(wrapper.classes()).toContain('su-pagination')
    expect(wrapper.classes()).toContain('su-pagination--medium')
    expect(wrapper.findAll('.su-pagination__page')).toHaveLength(6)
    expect(wrapper.find('.su-pagination__more').exists()).toBe(true)
    expect(wrapper.find('.su-pagination__page.is-active').text()).toBe('1')
  })

  it('支持 v-model 更新当前页', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 1,
        total: 80,
      },
    })

    await wrapper.findAll('.su-pagination__page')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('currentChange')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3, 10])
  })

  it('支持上一页和下一页', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 2,
        total: 40,
      },
    })

    await wrapper.find('.su-pagination__prev').trigger('click')
    await wrapper.setProps({ modelValue: 1 })
    await wrapper.find('.su-pagination__next').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
    expect(wrapper.emitted('prevClick')?.[0]).toEqual([1])
    expect(wrapper.emitted('nextClick')?.[0]).toEqual([2])
  })

  it('支持页码折叠和快速跳页', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 10,
        total: 300,
        pagerCount: 7,
      },
    })

    expect(wrapper.findAll('.su-pagination__more')).toHaveLength(2)

    await wrapper.findAll('.su-pagination__more')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15])
  })

  it('支持修改每页条数', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 2,
        pageSize: 10,
        total: 100,
        showSizeChanger: true,
      },
    })

    await wrapper.find('select').setValue('20')

    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
    expect(wrapper.emitted('sizeChange')?.[0]).toEqual([20])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 20])
  })

  it('支持跳转输入', async () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 1,
        total: 100,
        showQuickJumper: true,
      },
    })

    await wrapper.find('input').setValue('6')
    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('支持简单模式、总数和尺寸', () => {
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 2,
        total: 35,
        size: 'large',
        simple: true,
        showTotal: true,
      },
    })

    expect(wrapper.classes()).toContain('su-pagination--large')
    expect(wrapper.classes()).toContain('is-simple')
    expect(wrapper.find('.su-pagination__total').text()).toBe('共 35 条')
    expect(wrapper.find('.su-pagination__simple').text()).toBe('2 / 4')
    expect(wrapper.find('.su-pagination__pager').exists()).toBe(false)
  })

  it('支持禁用和单页隐藏', async () => {
    const disabledWrapper = mount(Pagination, {
      props: {
        total: 30,
        disabled: true,
      },
    })

    await disabledWrapper.findAll('.su-pagination__page')[1].trigger('click')
    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()

    const hiddenWrapper = mount(Pagination, {
      props: {
        total: 5,
        hideOnSinglePage: true,
      },
    })

    expect(hiddenWrapper.find('.su-pagination').exists()).toBe(false)
  })
})
