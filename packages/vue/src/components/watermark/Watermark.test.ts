import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Watermark from './Watermark.vue'

describe('Watermark', () => {
  it('渲染默认文本水印并包裹内容', () => {
    const wrapper = mount(Watermark, {
      slots: {
        default: '<div class="report-card">合同审批单</div>',
      },
    })

    expect(wrapper.classes()).toContain('su-watermark')
    expect(wrapper.find('.report-card').text()).toBe('合同审批单')
    expect(wrapper.find('.su-watermark__layer').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--su-watermark-image')
    expect(wrapper.attributes('style')).toContain('--su-watermark-size: 200px 140px')
  })

  it('支持多行文本和自定义水印参数', () => {
    const wrapper = mount(Watermark, {
      props: {
        content: ['内部资料', '研发中心'],
        width: 180,
        height: 120,
        gapX: 20,
        gapY: 30,
        offsetX: 12,
        offsetY: 18,
        rotate: -30,
        color: 'rgba(22, 119, 255, 0.8)',
        opacity: 0.2,
        fontSize: 18,
        fontWeight: 'bold',
      },
    })

    const style = wrapper.attributes('style')

    expect(style).toContain('--su-watermark-size: 200px 150px')
    expect(style).toContain('--su-watermark-position: 12px 18px')
    expect(decodeURIComponent(style ?? '')).toContain('内部资料')
    expect(decodeURIComponent(style ?? '')).toContain('研发中心')
    expect(decodeURIComponent(style ?? '')).toContain('rotate(-30)')
    expect(decodeURIComponent(style ?? '')).toContain('font-weight="bold"')
  })

  it('支持图片水印', () => {
    const wrapper = mount(Watermark, {
      props: {
        image: '/logo-watermark.png',
        imageWidth: 72,
        imageHeight: 28,
      },
    })

    const style = decodeURIComponent(wrapper.attributes('style') ?? '')

    expect(style).toContain('<image')
    expect(style).toContain('href="/logo-watermark.png"')
    expect(style).toContain('width="72"')
    expect(style).toContain('height="28"')
  })

  it('支持禁用水印', () => {
    const wrapper = mount(Watermark, {
      props: {
        disabled: true,
      },
      slots: {
        default: '<section>公开公告</section>',
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-watermark__layer').exists()).toBe(false)
    expect(wrapper.text()).toBe('公开公告')
  })

  it('支持全屏水印层级', () => {
    const wrapper = mount(Watermark, {
      props: {
        fullscreen: true,
        zIndex: 1200,
      },
    })

    expect(wrapper.classes()).toContain('is-fullscreen')
    expect(wrapper.attributes('style')).toContain('--su-watermark-z-index: 1200')
  })
})
