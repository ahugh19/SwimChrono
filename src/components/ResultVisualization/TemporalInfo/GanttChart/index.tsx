import { memo, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { VideoType, VisType } from '../../../../types'
import { GANTT, GanttLayout, blockHeight, isMoving, relativeEnd, relativeStart } from '../../ganttLayout'
import { useThemeColors } from '../../../../utils/theme'
import { formatClock } from '../../../../utils'
import { pickTickStep } from '../../../LayerPanel/TimelineAxis'

export interface GanttBlock {
  video: VideoType
  layout: GanttLayout
}

interface GanttChartProps {
  blocks: GanttBlock[]
  width: number
  zoom: number
  showTitles: boolean
  commonScale: boolean
  currentVideoKey: string | null
  currentTime: number // absolute player time of the current video
  selectedVisKey: string | null
  hoveredVisKey: string | null
  filteredKeys: Set<string> | null // table filter: bars outside it are dimmed
  onHover: (vis: VisType | null, clientX: number, clientY: number) => void
  onSelectVis: (vis: VisType, video: VideoType) => void
  onSeek: (video: VideoType, relativeSeconds: number) => void
}

interface VisRectProps {
  vis: VisType
  x: number
  y: number
  w: number
  h: number
  color: string
  state: 'normal' | 'hover' | 'selected' | 'dimmed'
  outline: string
  accent: string
  onEnter: (vis: VisType, e: KonvaEventObject<MouseEvent>) => void
  onMove: (vis: VisType, e: KonvaEventObject<MouseEvent>) => void
  onLeave: (e: KonvaEventObject<MouseEvent>) => void
  onClick: (vis: VisType) => void
}

// One annotation bar. Memoised so hovering one bar doesn't re-render the
// other ~1500 bars of the "all videos" view.
const VisRect = memo(function VisRect(props: VisRectProps) {
  const { vis, x, y, w, h, color, state, outline, accent, onEnter, onMove, onLeave, onClick } = props
  const moving = isMoving(vis)
  return (
    <Rect
      name="vis"
      x={x}
      y={y}
      width={Math.max(1.5, w)}
      height={h}
      fill={color}
      opacity={state === 'dimmed' ? 0.12 : state === 'normal' ? 0.92 : 1}
      listening={state !== 'dimmed'}
      stroke={state === 'selected' ? accent : state === 'hover' ? outline : moving ? outline : undefined}
      strokeWidth={state === 'selected' ? 2 : state === 'hover' ? 1.5 : moving ? 1 : 0}
      dash={moving && state === 'normal' ? [3, 2] : undefined}
      cornerRadius={2}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onMouseEnter={(e) => onEnter(vis, e)}
      onMouseMove={(e) => onMove(vis, e)}
      onMouseLeave={onLeave}
      onClick={() => onClick(vis)}
    />
  )
})

function GanttChart(props: GanttChartProps) {
  const { blocks, width, zoom, showTitles, commonScale, currentVideoKey, currentTime, selectedVisKey, hoveredVisKey, filteredKeys, onHover, onSelectVis, onSeek } = props
  const palette = useThemeColors()
  const stageRef = useRef<Konva.Stage>(null)
  const scrub = useRef<{ video: VideoType; x0: number; chartW: number } | null>(null)

  const stageWidth = Math.max(200, Math.floor(width * zoom))
  const chartX0 = GANTT.gutter + GANTT.padding
  const chartW = stageWidth - chartX0 - GANTT.padding
  const globalMax = Math.max(0.01, ...blocks.map((b) => b.layout.maxEnd))

  // Vertical placement of every block, computed once per render.
  let cursor = 0
  const placed = blocks.map((b) => {
    const top = cursor
    const h = blockHeight(b.layout, showTitles)
    cursor += h + (showTitles ? GANTT.blockGap : 0)
    return { ...b, top, height: h }
  })
  const stageHeight = Math.max(60, cursor)

  function scaleFor(layout: GanttLayout) {
    const max = commonScale ? globalMax : layout.maxEnd
    return (t: number) => chartX0 + (t / max) * chartW
  }

  function blockAtY(y: number) {
    return placed.find((b) => y >= b.top && y < b.top + b.height) ?? null
  }

  function relativeTimeAt(block: typeof placed[number], clientX: number) {
    const stage = stageRef.current
    if (!stage) return 0
    const rect = stage.container().getBoundingClientRect()
    const x = clientX - rect.left - chartX0
    const max = commonScale ? globalMax : block.layout.maxEnd
    return Math.min(max, Math.max(0, (x / chartW) * max))
  }

  function setCursor(cursorStyle: string) {
    const container = stageRef.current?.container()
    if (container) container.style.cursor = cursorStyle
  }

  function onStageMouseDown(e: KonvaEventObject<MouseEvent>) {
    if (e.evt.button !== 0 || e.target.name() === 'vis') return
    const stage = stageRef.current
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const block = blockAtY(pos.y)
    if (!block) return
    scrub.current = { video: block.video, x0: 0, chartW }
    onSeek(block.video, relativeTimeAt(block, e.evt.clientX))
  }

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      const s = scrub.current
      if (!s) return
      const block = placed.find((b) => b.video.key === s.video.key)
      if (block) onSeek(block.video, relativeTimeAt(block, ev.clientX))
    }
    const onUp = () => { scrub.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  })

  const handleEnter = (vis: VisType, e: KonvaEventObject<MouseEvent>) => { setCursor('pointer'); onHover(vis, e.evt.clientX, e.evt.clientY) }
  const handleMove = (vis: VisType, e: KonvaEventObject<MouseEvent>) => onHover(vis, e.evt.clientX, e.evt.clientY)
  const handleLeave = () => { setCursor(''); onHover(null, 0, 0) }

  return (
    <Stage width={stageWidth} height={stageHeight} ref={stageRef} onMouseDown={onStageMouseDown}>
      <Layer>
        {placed.map((block) => {
          const { video, layout, top } = block
          const sx = scaleFor(layout)
          const isCurrent = video.key === currentVideoKey
          const axisY = top + (showTitles ? GANTT.titleHeight : 0) + GANTT.axisHeight - 1
          const max = commonScale ? globalMax : layout.maxEnd
          const pxPerSecond = chartW / max
          const step = pickTickStep(pxPerSecond, 60)
          const ticks: number[] = []
          for (let t = 0; t <= max + 1e-6; t += step) ticks.push(Math.round(t * 1000) / 1000)
          let rowY = axisY + GANTT.groupGap / 2 + 2
          const handleClick = (vis: VisType) => onSelectVis(vis, video)
          const title = `${video.year} · ${video.gender} ${video.distance} m ${video.style} · ${video.level}`
          return (
            <Group key={video.key}>
              {/* block background for the current video */}
              {showTitles && (
                <Rect x={0} y={top} width={stageWidth} height={block.height} fill={isCurrent ? palette.layerRowSelectedInvisible : 'transparent'} cornerRadius={4} listening={false} />
              )}
              {showTitles && (
                <Text x={GANTT.padding} y={top + 5} text={`${title}   ·   ${layout.itemCount} annotations`} fontSize={12} fontStyle={isCurrent ? 'bold' : 'normal'} fill={isCurrent ? palette.accent : palette.textBright} listening={false} />
              )}
              {/* time axis */}
              <Line points={[chartX0, axisY, chartX0 + chartW, axisY]} stroke={palette.borderSoft} strokeWidth={1} listening={false} />
              {ticks.map((t) => {
                const label = formatClock(t)
                const lx = sx(t) + 3 + label.length * 6 > stageWidth ? sx(t) - 3 - label.length * 6 : sx(t) + 3
                return (
                  <Group key={t} listening={false}>
                    <Line points={[sx(t), axisY - 5, sx(t), axisY]} stroke={palette.text} strokeWidth={1} />
                    <Text x={lx} y={axisY - 17} text={label} fontSize={10} fill={palette.text} />
                    <Line points={[sx(t), axisY, sx(t), top + block.height - GANTT.padding]} stroke={palette.borderSoft} strokeWidth={1} opacity={0.35} />
                  </Group>
                )
              })}
              {/* groups */}
              {layout.groups.map((group) => {
                const groupTop = rowY
                const groupH = group.rows.length * (GANTT.rowHeight + GANTT.rowGap)
                const nodes = group.rows.map((row, ri) => {
                  const y = groupTop + ri * (GANTT.rowHeight + GANTT.rowGap)
                  return row.map((vis) => {
                    const x = sx(relativeStart(vis))
                    const w = sx(relativeEnd(vis)) - x
                    const dimmed = filteredKeys !== null && !filteredKeys.has(vis.key)
                    const state = vis.key === selectedVisKey ? 'selected' : dimmed ? 'dimmed' : vis.key === hoveredVisKey ? 'hover' : 'normal'
                    return <VisRect key={vis.key} vis={vis} x={x} y={y} w={w} h={GANTT.rowHeight} color={group.color} state={state} outline={palette.textBright} accent={palette.accent} onEnter={handleEnter} onMove={handleMove} onLeave={handleLeave} onClick={handleClick} />
                  })
                })
                rowY += groupH + GANTT.groupGap
                return (
                  <Group key={group.key}>
                    <Rect x={GANTT.padding} y={groupTop - 2} width={GANTT.gutter - GANTT.padding} height={groupH + 1} fill={group.color} opacity={0.18} cornerRadius={3} listening={false} />
                    <Rect x={GANTT.padding} y={groupTop - 2} width={3} height={groupH + 1} fill={group.color} cornerRadius={1} listening={false} />
                    <Text x={GANTT.padding + 8} y={groupTop} width={GANTT.gutter - GANTT.padding - 10} height={groupH} verticalAlign="middle" text={`${group.label} (${group.rows.reduce((n, r) => n + r.length, 0)})`} fontSize={10} fill={palette.textBright} wrap="none" ellipsis listening={false} />
                    {nodes}
                  </Group>
                )
              })}
              {/* playhead for the video in the player */}
              {isCurrent && currentTime >= video.startMoment && (
                <Group listening={false}>
                  <Line points={[sx(Math.min(max, currentTime - video.startMoment)), axisY - 6, sx(Math.min(max, currentTime - video.startMoment)), top + block.height - GANTT.padding]} stroke={palette.accent} strokeWidth={1.5} />
                </Group>
              )}
            </Group>
          )
        })}
      </Layer>
    </Stage>
  )
}

export default GanttChart
