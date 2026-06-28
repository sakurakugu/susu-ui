type ThemeTransitionUpdate = () => void | Promise<void>

type ThemeTransitionPoint = {
  x: number
  y: number
}

export type ThemeTransitionOptions = {
  event?: MouseEvent | PointerEvent
  point?: ThemeTransitionPoint
  root?: HTMLElement
  duration?: number
  easing?: string
}

type ViewTransition = {
  ready: Promise<void>
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: ThemeTransitionUpdate) => ViewTransition
}

function 获取根元素(root?: HTMLElement) {
  if (root) return root
  if (typeof document === 'undefined') return undefined
  return document.documentElement
}

function 获取过渡中心(options: ThemeTransitionOptions): ThemeTransitionPoint {
  if (options.point) return options.point
  if (options.event) {
    return {
      x: options.event.clientX,
      y: options.event.clientY,
    }
  }
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 0,
    }
  }
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
}

function 获取扩散半径(point: ThemeTransitionPoint) {
  if (typeof window === 'undefined') return 0
  return Math.hypot(
    Math.max(point.x, window.innerWidth - point.x),
    Math.max(point.y, window.innerHeight - point.y),
  )
}

export async function withThemeTransition(
  update: ThemeTransitionUpdate,
  options: ThemeTransitionOptions = {},
) {
  if (typeof document === 'undefined') {
    await update()
    return
  }

  const transitionDocument = document as ViewTransitionDocument

  if (!transitionDocument.startViewTransition) {
    await update()
    return
  }

  const point = 获取过渡中心(options)
  const radius = 获取扩散半径(point)
  const transition = transitionDocument.startViewTransition(update)

  await transition.ready

  const target = 获取根元素(options.root)
  target?.animate(
    {
      clipPath: [
        `circle(0px at ${point.x}px ${point.y}px)`,
        `circle(${radius}px at ${point.x}px ${point.y}px)`,
      ],
    },
    {
      duration: options.duration ?? 500,
      easing: options.easing ?? 'ease-out',
      pseudoElement: '::view-transition-new(root)',
    },
  )
}
