import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import QRCode from './QRCode.vue'

describe('QRCode', () => {
  it('根据内容渲染二维码 SVG', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'https://susu-ui.example.com/order/20260628',
      },
    })

    expect(wrapper.classes()).toContain('su-qrcode')
    expect(wrapper.find('svg.su-qrcode__svg').exists()).toBe(true)
    expect(wrapper.find('.su-qrcode__modules').attributes('d')).toContain('M')
    expect(wrapper.attributes('style')).toContain('--su-qrcode-size: 160px')
  })

  it('支持自定义尺寸、留白、颜色和圆角', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'INV-20260628-009',
        size: 220,
        margin: 4,
        color: '#111827',
        backgroundColor: '#ffffff',
        radius: 12,
      },
    })

    const svg = wrapper.find('svg')

    expect(wrapper.attributes('style')).toContain('--su-qrcode-size: 220px')
    expect(wrapper.attributes('style')).toContain('--su-qrcode-color: #111827')
    expect(wrapper.attributes('style')).toContain('--su-qrcode-radius: 12px')
    expect(svg.attributes('viewBox')).toBeTruthy()
  })

  it('支持图标插槽', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'login-token-6482',
      },
      slots: {
        icon: '<span class="brand-mark">S</span>',
      },
    })

    expect(wrapper.classes()).toContain('has-icon')
    expect(wrapper.find('.su-qrcode__icon').exists()).toBe(true)
    expect(wrapper.find('.brand-mark').text()).toBe('S')
  })

  it('内容为空时展示空状态', () => {
    const wrapper = mount(QRCode)

    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toContain('暂无二维码内容')
  })

  it('过期状态支持刷新事件', async () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'ticket-expired',
        status: 'expired',
      },
    })

    expect(wrapper.classes()).toContain('su-qrcode--expired')
    expect(wrapper.find('.su-qrcode__mask').exists()).toBe(true)
    expect(wrapper.text()).toContain('二维码已失效')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('加载状态展示加载文案', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'ticket-loading',
        status: 'loading',
        statusText: '正在生成付款码',
      },
    })

    expect(wrapper.classes()).toContain('su-qrcode--loading')
    expect(wrapper.find('.su-qrcode__spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('正在生成付款码')
  })
})
