import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Carousel, { type CarouselItem } from './Carousel.vue'

const items: CarouselItem[] = [
  {
    key: 'campaign',
    title: '夏季活动',
    description: '面向华东客户配置限时权益。',
    image: '/campaign.png',
  },
  {
    key: 'report',
    title: '经营周报',
    description: '查看渠道转化和新增商机。',
    image: '/report.png',
  },
  {
    key: 'release',
    title: '版本发布',
    description: '同步本周上线范围和回滚预案。',
    image: '/release.png',
  },
]

describe('Carousel', () => {
  it('渲染基础轮播内容和样式变量', () => {
    const wrapper = mount(Carousel, {
      props: {
        items,
        height: 320,
        label: '运营横幅',
      },
    })

    expect(wrapper.classes()).toContain('su-carousel')
    expect(wrapper.attributes('style')).toContain('--su-carousel-height: 320px')
    expect(wrapper.attributes('aria-label')).toBe('运营横幅')
    expect(wrapper.findAll('.su-carousel__slide')).toHaveLength(3)
    expect(wrapper.find('.su-carousel__title').text()).toBe('夏季活动')
    expect(wrapper.findAll('.su-carousel__indicator')).toHaveLength(3)
  })

  it('支持下一张、上一张和 change 事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Carousel, {
      props: {
        items,
        modelValue: 0,
        arrow: 'always',
        onChange,
      },
    })

    await wrapper.find('.su-carousel__arrow--next').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, 0])
    expect(onChange).toHaveBeenCalledWith(1, 0)

    await wrapper.setProps({ modelValue: 1 })
    await wrapper.find('.su-carousel__arrow--previous').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('支持指示器点击切换', async () => {
    const wrapper = mount(Carousel, {
      props: {
        items,
        modelValue: 0,
      },
    })

    await wrapper.findAll('.su-carousel__indicator')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 0])
  })

  it('非循环模式会禁用边界箭头', () => {
    const wrapper = mount(Carousel, {
      props: {
        items,
        modelValue: 0,
        loop: false,
        arrow: 'always',
      },
    })

    expect(wrapper.find('.su-carousel__arrow--previous').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.su-carousel__arrow--next').attributes('disabled')).toBeUndefined()
  })

  it('支持键盘快捷切换', async () => {
    const wrapper = mount(Carousel, {
      props: {
        items,
        modelValue: 1,
      },
    })

    await wrapper.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])

    await wrapper.setProps({ modelValue: 2 })
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('支持自动播放并在悬停时暂停', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Carousel, {
      props: {
        items,
        autoplay: true,
        interval: 1000,
      },
    })

    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([1])

    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('支持作用域插槽自定义内容', () => {
    const wrapper = mount(Carousel, {
      props: {
        items: items.slice(0, 1),
      },
      slots: {
        default: ({ item, index, active }) =>
          h('div', { class: 'custom-slide' }, `${index}-${item.title}-${active}`),
      },
    })

    expect(wrapper.find('.custom-slide').text()).toBe('0-夏季活动-true')
  })

  it('无数据时展示空状态', () => {
    const wrapper = mount(Carousel, {
      props: {
        emptyText: '暂无活动',
      },
    })

    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('.su-carousel__empty').text()).toBe('暂无活动')
    expect(wrapper.find('.su-carousel__indicator').exists()).toBe(false)
  })
})
