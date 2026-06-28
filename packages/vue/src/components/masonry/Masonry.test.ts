import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Masonry from './Masonry.vue'

describe('Masonry', () => {
  it('渲染默认三列瀑布流', () => {
    const wrapper = mount(Masonry, {
      slots: {
        default: '<article>项目周报</article><article>线索复盘</article>',
      },
    })

    expect(wrapper.classes()).toContain('su-masonry')
    expect(wrapper.attributes('style')).toContain('--su-masonry-columns: 3')
    expect(wrapper.attributes('style')).toContain('--su-masonry-column-gap: var(--su-space-md)')
    expect(wrapper.text()).toContain('项目周报')
  })

  it('支持列数、间距和列填充方式', () => {
    const wrapper = mount(Masonry, {
      props: {
        columns: 4,
        gap: [24, 'small'],
        columnFill: 'auto',
      },
    })

    expect(wrapper.attributes('style')).toContain('--su-masonry-columns: 4')
    expect(wrapper.attributes('style')).toContain('--su-masonry-column-gap: 24px')
    expect(wrapper.attributes('style')).toContain('--su-masonry-row-gap: var(--su-space-sm)')
    expect(wrapper.attributes('style')).toContain('column-fill: auto')
  })

  it('支持按最小列宽自适应', () => {
    const wrapper = mount(Masonry, {
      props: {
        minColumnWidth: 220,
      },
    })

    expect(wrapper.classes()).toContain('su-masonry--auto')
    expect(wrapper.attributes('style')).toContain('--su-masonry-min-column-width: 220px')
  })

  it('支持数据源和 item 插槽', () => {
    const wrapper = mount(Masonry, {
      props: {
        items: [
          { id: 'report', title: '经营日报' },
          { id: 'case', title: '客户案例' },
        ],
        itemKey: 'id',
        itemTag: 'article',
      },
      slots: {
        item: '<template #item="{ item }">{{ item.title }}</template>',
      },
    })

    expect(wrapper.classes()).toContain('su-masonry--with-data')
    expect(wrapper.findAll('.su-masonry__item')).toHaveLength(2)
    expect(wrapper.find('.su-masonry__item').element.tagName).toBe('ARTICLE')
    expect(wrapper.text()).toContain('经营日报')
    expect(wrapper.text()).toContain('客户案例')
  })
})
