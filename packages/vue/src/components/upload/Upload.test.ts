import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Upload from './Upload.vue'

function createFile(name = 'avatar.png', type = 'image/png') {
  return new File(['hello'], name, { type })
}

describe('Upload', () => {
  it('渲染默认上传触发器', () => {
    const wrapper = mount(Upload)

    expect(wrapper.classes()).toContain('su-upload')
    expect(wrapper.find('.su-upload__trigger').text()).toContain('选择文件')
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('选择文件后更新列表并触发上传成功', async () => {
    const wrapper = mount(Upload)
    const input = wrapper.find('input')
    const file = createFile()

    Object.defineProperty(input.element, 'files', {
      value: [file],
      configurable: true,
    })

    await input.trigger('change')
    await Promise.resolve()

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.find('.su-upload__name').text()).toBe('avatar.png')
    expect(wrapper.find('.su-upload__status').text()).toBe('完成')
  })

  it('支持限制数量并触发超出事件', async () => {
    const wrapper = mount(Upload, {
      props: {
        limit: 1,
        modelValue: [
          {
            uid: '1',
            name: 'old.txt',
            size: 1,
            type: 'text/plain',
            status: 'success',
            percentage: 100,
          },
        ],
      },
    })
    const input = wrapper.find('input')

    Object.defineProperty(input.element, 'files', {
      value: [createFile('new.txt', 'text/plain')],
      configurable: true,
    })

    await input.trigger('change')

    expect(wrapper.emitted('exceed')).toBeTruthy()
    expect(wrapper.findAll('.su-upload__item')).toHaveLength(1)
  })

  it('支持 beforeUpload 拦截文件', async () => {
    const wrapper = mount(Upload, {
      props: {
        beforeUpload: () => false,
      },
    })
    const input = wrapper.find('input')

    Object.defineProperty(input.element, 'files', {
      value: [createFile()],
      configurable: true,
    })

    await input.trigger('change')
    await Promise.resolve()

    expect(wrapper.find('.su-upload__item').exists()).toBe(false)
  })

  it('支持自定义上传请求进度和结果', async () => {
    const request = vi.fn((options) => {
      options.onProgress(60)
      options.onSuccess({ ok: true })
    })
    const wrapper = mount(Upload, {
      props: {
        request,
      },
    })
    const input = wrapper.find('input')

    Object.defineProperty(input.element, 'files', {
      value: [createFile('report.pdf', 'application/pdf')],
      configurable: true,
    })

    await input.trigger('change')
    await Promise.resolve()

    expect(request).toHaveBeenCalled()
    expect(wrapper.emitted('progress')?.[0][1]).toBe(60)
    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.find('.su-upload__status').text()).toBe('完成')
  })

  it('支持移除文件', async () => {
    const wrapper = mount(Upload, {
      props: {
        modelValue: [
          {
            uid: '1',
            name: 'demo.txt',
            size: 1,
            type: 'text/plain',
            status: 'ready',
            percentage: 0,
          },
        ],
      },
    })

    await wrapper.find('.su-upload__remove').trigger('click')

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([])
  })
})
