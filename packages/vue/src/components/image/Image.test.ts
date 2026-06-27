import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Image from './Image.vue'

describe('Image', () => {
  it('渲染图片和基础样式', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/cover.png',
        alt: '封面图',
        width: 240,
        height: '160px',
        radius: 8,
        fit: 'contain',
      },
    })

    const image = wrapper.find('.su-image__img')

    expect(wrapper.classes()).toContain('su-image')
    expect(wrapper.attributes('style')).toContain('--su-image-width: 240px')
    expect(wrapper.attributes('style')).toContain('--su-image-height: 160px')
    expect(wrapper.attributes('style')).toContain('--su-image-radius: 8px')
    expect(image.attributes('src')).toBe('/cover.png')
    expect(image.attributes('alt')).toBe('封面图')
    expect(image.attributes('style')).toContain('object-fit: contain')
  })

  it('加载完成后隐藏占位并触发事件', async () => {
    const onLoad = vi.fn()
    const wrapper = mount(Image, {
      props: {
        src: '/cover.png',
        onLoad,
      },
    })

    expect(wrapper.find('.su-image__placeholder').exists()).toBe(true)

    await wrapper.find('.su-image__img').trigger('load')

    expect(wrapper.classes()).toContain('is-loaded')
    expect(wrapper.find('.su-image__placeholder').exists()).toBe(false)
    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(onLoad).toHaveBeenCalledTimes(1)
  })

  it('加载失败后展示错误内容并触发事件', async () => {
    const onError = vi.fn()
    const wrapper = mount(Image, {
      props: {
        src: '/missing.png',
        fallbackText: '加载失败',
        onError,
      },
    })

    await wrapper.find('.su-image__img').trigger('error')

    expect(wrapper.classes()).toContain('is-error')
    expect(wrapper.find('.su-image__img').exists()).toBe(false)
    expect(wrapper.find('.su-image__error-text').text()).toBe('加载失败')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('支持错误插槽和占位插槽', () => {
    const wrapper = mount(Image, {
      slots: {
        placeholder: '<span class="custom-placeholder">加载中</span>',
        error: '<span class="custom-error">暂无图片</span>',
      },
    })

    expect(wrapper.find('.custom-error').text()).toBe('暂无图片')
    expect(wrapper.find('.custom-placeholder').exists()).toBe(false)
  })

  it('支持预览点击事件', async () => {
    const wrapper = mount(Image, {
      props: {
        src: '/cover.png',
        preview: true,
      },
    })

    await wrapper.find('.su-image__img').trigger('load')
    await wrapper.find('.su-image__preview').trigger('click')

    expect(wrapper.emitted('preview')).toEqual([['/cover.png']])
  })

  it('切换图片地址后重置加载状态', async () => {
    const wrapper = mount(Image, {
      props: {
        src: '/old.png',
      },
    })

    await wrapper.find('.su-image__img').trigger('load')
    expect(wrapper.classes()).toContain('is-loaded')

    await wrapper.setProps({
      src: '/new.png',
    })

    expect(wrapper.classes()).not.toContain('is-loaded')
    expect(wrapper.find('.su-image__placeholder').exists()).toBe(true)
  })
})
