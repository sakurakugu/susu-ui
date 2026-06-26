<script lang="ts">
import type { CSSProperties, PropType, VNode } from 'vue'
import { Comment, Fragment, computed, defineComponent, h } from 'vue'

type SpaceDirection = 'horizontal' | 'vertical'
type SpaceSize = 'small' | 'medium' | 'large' | number | string
type SpaceAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
type SpaceJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
type SpaceGap = SpaceSize | [SpaceSize, SpaceSize]

const sizeMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'var(--su-space-sm)',
  medium: 'var(--su-space-md)',
  large: 'var(--su-space-lg)',
}

const justifyMap: Record<SpaceJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

function normalizeSize(size: SpaceSize) {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return sizeMap[size as keyof typeof sizeMap] ?? size
}

function flattenNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment) {
      return []
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      return flattenNodes(node.children as VNode[])
    }

    return [node]
  })
}

export default defineComponent({
  name: 'SuSpace',
  props: {
    direction: {
      type: String as PropType<SpaceDirection>,
      default: 'horizontal',
    },
    size: {
      type: [String, Number, Array] as PropType<SpaceGap>,
      default: 'medium',
    },
    align: {
      type: String as PropType<SpaceAlign>,
      default: undefined,
    },
    justify: {
      type: String as PropType<SpaceJustify>,
      default: 'start',
    },
    wrap: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: [String, Number],
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const normalizedGap = computed(() => {
      const [horizontal, vertical] = Array.isArray(props.size)
        ? props.size
        : [props.size, props.size]

      return {
        column: normalizeSize(horizontal),
        row: normalizeSize(vertical),
      }
    })

    const styles = computed<CSSProperties>(() => ({
      columnGap: normalizedGap.value.column,
      rowGap: normalizedGap.value.row,
      alignItems:
        props.align === 'start'
          ? 'flex-start'
          : props.align === 'end'
            ? 'flex-end'
            : props.align,
      justifyContent: justifyMap[props.justify],
    }))

    return () => {
      const children = flattenNodes(slots.default?.() ?? [])
      const separatorNodes = slots.separator?.()
      const separator = separatorNodes ?? props.separator

      return h(
        'div',
        {
          class: [
            'su-space',
            `su-space--${props.direction}`,
            {
              'is-inline': props.inline,
              'is-wrap': props.wrap,
              'is-fill': props.fill,
              'has-separator': Boolean(separator),
            },
          ],
          style: styles.value,
        },
        children.flatMap((child, index) => {
          const item = h('div', { class: 'su-space__item' }, [child])

          if (!separator || index === children.length - 1) {
            return [item]
          }

          return [
            item,
            h(
              'div',
              {
                class: 'su-space__separator',
                role: 'presentation',
              },
              separatorNodes ? slots.separator?.() : separator,
            ),
          ]
        }),
      )
    }
  },
})
</script>

<style>
.su-space {
  display: flex;
  color: inherit;
}

.su-space.is-inline {
  display: inline-flex;
  vertical-align: middle;
}

.su-space--horizontal {
  flex-direction: row;
}

.su-space--vertical {
  flex-direction: column;
}

.su-space--horizontal.is-wrap {
  flex-wrap: wrap;
}

.su-space.is-fill {
  width: 100%;
}

.su-space__item {
  display: inline-flex;
  max-width: 100%;
}

.su-space.is-fill > .su-space__item {
  flex: 1;
}

.su-space--vertical > .su-space__item {
  width: 100%;
}

.su-space__separator {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  white-space: nowrap;
}

.su-space--vertical > .su-space__separator {
  align-self: flex-start;
}
</style>
