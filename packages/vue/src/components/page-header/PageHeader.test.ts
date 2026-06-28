import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader, { type PageHeaderBreadcrumbItem } from './PageHeader.vue'

const breadcrumb: PageHeaderBreadcrumbItem[] = [{ label: '项目' }, { label: '客户增长计划' }]

describe('PageHeader', () => {
  it('渲染标题、副标题和面包屑', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '客户增长计划',
        subtitle: '沉淀关键客户线索，跟进本周销售转化。',
        breadcrumb,
      },
    })

    expect(wrapper.classes()).toContain('su-page-header')
    expect(wrapper.find('.su-page-header__title').text()).toBe('客户增长计划')
    expect(wrapper.find('.su-page-header__subtitle').text()).toBe(
      '沉淀关键客户线索，跟进本周销售转化。',
    )
    expect(wrapper.find('.su-breadcrumb').exists()).toBe(true)
  })

  it('点击返回按钮时触发 back 事件', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '订单详情',
        showBack: true,
      },
    })

    await wrapper.find('.su-page-header__back').trigger('click')

    expect(wrapper.emitted('back')?.[0]).toEqual([expect.any(MouseEvent)])
  })

  it('点击面包屑节点时透出 breadcrumbClick 事件', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '客户增长计划',
        breadcrumb,
      },
    })

    await wrapper.find('.su-breadcrumb__link').trigger('click')

    expect(wrapper.emitted('breadcrumbClick')?.[0]).toEqual([
      breadcrumb[0],
      0,
      expect.any(MouseEvent),
    ])
  })

  it('支持标题、标签、操作区和页脚插槽', () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: true,
      },
      slots: {
        title: '<span class="custom-title">审批详情</span>',
        tags: '<span class="custom-tag">待处理</span>',
        extra: '<button class="custom-extra">通过</button>',
        footer: '<div class="custom-footer">流程记录</div>',
        default: '<div class="custom-body">当前节点由法务组处理。</div>',
      },
    })

    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-tag').exists()).toBe(true)
    expect(wrapper.find('.custom-extra').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
    expect(wrapper.find('.custom-body').exists()).toBe(true)
  })

  it('支持 ghost 和 size 样式类', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '资产台账',
        size: 'large',
        ghost: true,
      },
    })

    expect(wrapper.classes()).toContain('su-page-header--large')
    expect(wrapper.classes()).toContain('su-page-header--ghost')
  })
})
