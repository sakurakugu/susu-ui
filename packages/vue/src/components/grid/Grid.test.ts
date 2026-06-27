import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from './Grid.vue'
import GridItem from './GridItem.vue'

describe('Grid', () => {
  it('渲染默认十二列网格', () => {
    const wrapper = mount(Grid, {
      slots: {
        default: '<div>销售概览</div><div>线索统计</div>',
      },
    })

    expect(wrapper.classes()).toContain('su-grid')
    expect(wrapper.attributes('style')).toContain('--su-grid-columns: 12')
    expect(wrapper.attributes('style')).toContain(
      '--su-grid-column-gap: var(--su-space-md)',
    )
    expect(wrapper.text()).toContain('销售概览')
  })

  it('支持列数、间距、对齐和紧凑填充', () => {
    const wrapper = mount(Grid, {
      props: {
        columns: 4,
        gap: [24, 'small'],
        align: 'center',
        justify: 'start',
        dense: true,
      },
    })

    expect(wrapper.classes()).toContain('su-grid--dense')
    expect(wrapper.attributes('style')).toContain('--su-grid-columns: 4')
    expect(wrapper.attributes('style')).toContain('--su-grid-column-gap: 24px')
    expect(wrapper.attributes('style')).toContain(
      '--su-grid-row-gap: var(--su-space-sm)',
    )
    expect(wrapper.attributes('style')).toContain('align-items: center')
    expect(wrapper.attributes('style')).toContain('justify-items: start')
  })

  it('支持自动适配最小项目宽度', () => {
    const wrapper = mount(Grid, {
      props: {
        minItemWidth: 180,
      },
    })

    expect(wrapper.classes()).toContain('su-grid--auto-fit')
    expect(wrapper.attributes('style')).toContain(
      '--su-grid-min-item-width: 180px',
    )
  })

  it('GridItem 支持跨列、跨行、偏移和排序', () => {
    const wrapper = mount(GridItem, {
      props: {
        span: 3,
        rowSpan: 2,
        offset: 1,
        order: 4,
      },
      slots: {
        default: '重点客户',
      },
    })

    expect(wrapper.classes()).toContain('su-grid__item')
    expect(wrapper.attributes('style')).toContain('grid-column: 2 / span 3')
    expect(wrapper.attributes('style')).toContain('grid-row: span 2')
    expect(wrapper.attributes('style')).toContain('order: 4')
    expect(wrapper.text()).toContain('重点客户')
  })
})
