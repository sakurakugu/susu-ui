import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.vue'

const items: BreadcrumbItem[] = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components' },
  { label: 'Breadcrumb 面包屑' },
]

describe('Breadcrumb', () => {
  it('渲染面包屑列表和当前页', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items,
      },
    })

    expect(wrapper.classes()).toContain('su-breadcrumb')
    expect(wrapper.attributes('aria-label')).toBe('面包屑导航')
    expect(wrapper.findAll('.su-breadcrumb__item')).toHaveLength(3)
    expect(wrapper.find('.su-breadcrumb__current').text()).toBe(
      'Breadcrumb 面包屑',
    )
    expect(
      wrapper.find('.su-breadcrumb__current').attributes('aria-current'),
    ).toBe('page')
  })

  it('支持自定义分隔符', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items,
        separator: '>',
      },
    })

    expect(wrapper.findAll('.su-breadcrumb__separator')).toHaveLength(2)
    expect(wrapper.find('.su-breadcrumb__separator').text()).toBe('>')
  })

  it('点击非当前项时触发 click 事件', async () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items,
      },
    })

    await wrapper.find('.su-breadcrumb__link').trigger('click')

    expect(wrapper.emitted('click')?.[0]).toEqual([
      items[0],
      0,
      expect.any(MouseEvent),
    ])
  })

  it('禁用项不会触发 click 事件', async () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [{ label: '首页', disabled: true }, { label: '组件' }],
      },
    })

    await wrapper.find('.su-breadcrumb__button').trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(
      wrapper.find('.su-breadcrumb__button').attributes('disabled'),
    ).toBeDefined()
  })

  it('支持 item 和 separator 插槽', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items,
      },
      slots: {
        item: `
          <template #item="{ item }">
            <span class="custom-item">{{ item.label }}</span>
          </template>
        `,
        separator: '<span class="custom-separator">/</span>',
      },
    })

    expect(wrapper.find('.custom-item').exists()).toBe(true)
    expect(wrapper.find('.custom-separator').exists()).toBe(true)
  })
})
