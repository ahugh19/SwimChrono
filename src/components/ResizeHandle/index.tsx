import { useEffect, useRef } from 'react'
import styles from './index.module.less'

interface ResizeHandleProps {
  // 'col' resizes a width by dragging left/right, 'row' a height up/down.
  direction: 'col' | 'row'
  // Current size of the pane being resized and its bounds.
  value: number
  min: number
  max: number
  // When the pane sits on the right / bottom of the handle, dragging
  // towards it must shrink it: set `invert`.
  invert?: boolean
  onChange: (next: number) => void
  onDoubleClick?: () => void
  title?: string
}

// Thin draggable gutter between two panes. Pointer deltas are applied to
// the starting size, so the drag stays stable even if the pane re-lays out.
function ResizeHandle(props: ResizeHandleProps) {
  const { direction, value, min, max, invert, onChange, onDoubleClick, title } = props
  const drag = useRef<{ start: number; size: number } | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = drag.current
      if (!d) return
      const pos = direction === 'col' ? e.clientX : e.clientY
      const delta = (pos - d.start) * (invert ? -1 : 1)
      onChange(Math.round(Math.min(max, Math.max(min, d.size + delta))))
    }
    const onUp = () => {
      if (!drag.current) return
      drag.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [direction, invert, min, max, onChange])

  return (
    <div
      className={`${styles.handle} ${direction === 'col' ? styles.col : styles.row}`}
      title={title ?? (onDoubleClick ? 'Drag to resize · double-click to reset' : 'Drag to resize')}
      role="separator"
      aria-orientation={direction === 'col' ? 'vertical' : 'horizontal'}
      onMouseDown={(e) => {
        if (e.button !== 0) return
        e.preventDefault()
        drag.current = { start: direction === 'col' ? e.clientX : e.clientY, size: value }
        document.body.style.cursor = direction === 'col' ? 'col-resize' : 'row-resize'
        document.body.style.userSelect = 'none'
      }}
      onDoubleClick={onDoubleClick}
    >
      <span className={styles.grip} />
    </div>
  )
}

export default ResizeHandle

// Small helper for persisting a pane size in localStorage.
export function readStoredSize(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(key)
    const n = raw === null ? NaN : Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export function writeStoredSize(key: string, value: number | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, String(value))
  } catch {
    // ignore (private mode)
  }
}
