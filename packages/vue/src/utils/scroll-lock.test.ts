import { afterEach, describe, expect, it, vi } from 'vitest'
import { lockBodyScroll } from './scroll-lock'

describe('scroll-lock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    vi.restoreAllMocks()
  })

  it('支持多个弹层共享背景滚动锁', () => {
    document.body.style.overflow = 'scroll'
    document.body.style.paddingRight = '5px'
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1183)

    const releaseFirst = lockBodyScroll()
    const releaseSecond = lockBodyScroll()

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('22px')

    releaseFirst()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('22px')

    releaseFirst()
    expect(document.body.style.overflow).toBe('hidden')

    releaseSecond()
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.body.style.paddingRight).toBe('5px')
  })
})
