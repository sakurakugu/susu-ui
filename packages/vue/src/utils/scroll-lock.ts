let lockCount = 0
let previousOverflow = ''
let previousPaddingRight = ''

function getScrollbarWidth() {
  const documentWidth = document.documentElement.clientWidth

  if (!documentWidth) {
    return 0
  }

  return Math.max(0, window.innerWidth - documentWidth)
}

function getBodyPaddingRight() {
  const paddingRight = window.getComputedStyle(document.body).paddingRight
  const value = Number.parseFloat(paddingRight)

  return Number.isFinite(value) ? value : 0
}

export function lockBodyScroll() {
  let released = false

  if (lockCount === 0) {
    const scrollbarWidth = getScrollbarWidth()

    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${getBodyPaddingRight() + scrollbarWidth}px`
    }
  }

  lockCount += 1

  return () => {
    if (released) {
      return
    }

    released = true
    lockCount = Math.max(0, lockCount - 1)

    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }
}
