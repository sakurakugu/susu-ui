import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Space from './Space.vue'

describe('Space', () => {
  it('渲染默认横向间距', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<button>保存</button><button>取消</button>',
      },
    })

    expect(wrapper.classes()).toContain('su-space')
    expect(wrapper.classes()).toContain('su-space--horizontal')
    expect(wrapper.findAll('.su-space__item')).toHaveLength(2)
    expect(wrapper.attributes('style')).toContain(
      'column-gap: var(--su-space-md)',
    )
  })

  it('支持纵向排列和数字间距', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'vertical',
        size: 20,
      },
      slots: {
        default: '<span>第一行</span><span>第二行</span>',
      },
    })

    expect(wrapper.classes()).toContain('su-space--vertical')
    expect(wrapper.attributes('style')).toContain('column-gap: 20px')
    expect(wrapper.attributes('style')).toContain('row-gap: 20px')
  })

  it('支持数组间距、换行和对齐', () => {
    const wrapper = mount(Space, {
      props: {
        size: ['large', 4],
        wrap: true,
        align: 'center',
        justify: 'between',
      },
      slots: {
        default: '<span>一</span><span>二</span>',
      },
    })

    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain(
      'column-gap: var(--su-space-lg)',
    )
    expect(wrapper.attributes('style')).toContain('row-gap: 4px')
    expect(wrapper.attributes('style')).toContain('align-items: center')
    expect(wrapper.attributes('style')).toContain(
      'justify-content: space-between',
    )
  })

  it('支持分隔符插槽', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<span>列表</span><span>详情</span><span>编辑</span>',
        separator: '<span>/</span>',
      },
    })

    expect(wrapper.classes()).toContain('has-separator')
    expect(wrapper.findAll('.su-space__separator')).toHaveLength(2)
    expect(wrapper.text()).toContain('/')
  })

  it('支持填充和行内模式', () => {
    const wrapper = mount(Space, {
      props: {
        fill: true,
        inline: true,
      },
      slots: {
        default: '<span>左</span><span>右</span>',
      },
    })

    expect(wrapper.classes()).toContain('is-fill')
    expect(wrapper.classes()).toContain('is-inline')
  })
})
