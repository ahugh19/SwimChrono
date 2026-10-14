import { useEffect, useRef } from 'react';
import { Group, Line, Rect, Text, Label, Tag } from 'react-konva';
import Konva from 'konva';
import { useThemeColors } from '../../../utils/theme';
import { formatClock } from '../../../utils';

interface TimelineAxisProps {
  canvasWidth: number
  canvasHeight: number
  canvasContentPadding: number
  videoEnd: number
  raceStart: number
  currentTime: number
  onSeek: (time: number) => void
}

const TICK_STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300]

// Pick the coarsest step that keeps major ticks at least `minPx` apart.
export function pickTickStep(pxPerSecond: number, minPx = 70): number {
  for (const step of TICK_STEPS) {
    if (step * pxPerSecond >= minPx) return step
  }
  return TICK_STEPS[TICK_STEPS.length - 1]
}

function TimelineAxis(props: TimelineAxisProps) {
  const { canvasWidth, canvasHeight, canvasContentPadding, videoEnd, raceStart, currentTime, onSeek } = props;
  const palette = useThemeColors();
  const groupRef = useRef<Konva.Group>(null)
  const scrubbing = useRef(false)

  const chartWidth = Math.max(0, canvasWidth - 2 * canvasContentPadding)
  const pxPerSecond = videoEnd > 0 ? chartWidth / videoEnd : 0
  const axisY = canvasHeight - 1

  function timeFromClientX(clientX: number) {
    const stage = groupRef.current?.getStage()
    if (!stage || videoEnd <= 0) return 0
    const rect = stage.container().getBoundingClientRect()
    const x = clientX - rect.left - canvasContentPadding
    return Math.min(videoEnd, Math.max(0, (x / chartWidth) * videoEnd))
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (scrubbing.current) onSeek(timeFromClientX(e.clientX)) }
    const onUp = () => { scrubbing.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  })

  const major = pickTickStep(pxPerSecond)
  const minor = major / 5
  const ticks: { t: number; isMajor: boolean }[] = []
  if (videoEnd > 0 && pxPerSecond > 0) {
    const showMinor = minor * pxPerSecond >= 8
    for (let t = 0; t <= videoEnd + 1e-6; t += minor) {
      const isMajor = Math.abs(t / major - Math.round(t / major)) < 1e-6
      if (isMajor || showMinor) ticks.push({ t: Math.round(t * 1000) / 1000, isMajor })
    }
  }

  const x = (t: number) => canvasContentPadding + t * pxPerSecond
  const playheadX = x(Math.min(currentTime, videoEnd))
  const labelFont = 10
  const labelWidth = (text: string) => text.length * labelFont * 0.6
  // Labels sit right of their tick, except near the end where they would
  // be clipped by the canvas: those flip to the left of the tick.
  const labelX = (t: number, text: string) => {
    const w = labelWidth(text)
    return x(t) + 3 + w > canvasWidth - 1 ? x(t) - 3 - w : x(t) + 3
  }
  const badgeText = formatClock(currentTime, 2)
  const badgeW = labelWidth(badgeText) + 4
  const badgeX = Math.min(Math.max(0, playheadX - badgeW / 2), Math.max(0, canvasWidth - badgeW))
  const raceStartText = "race start"

  return (
    <Group
      ref={groupRef}
      onMouseDown={(e) => {
        scrubbing.current = true
        onSeek(timeFromClientX(e.evt.clientX))
      }}
      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'col-resize' }}
      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = '' }}
    >
      {/* hit area */}
      <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="transparent" />
      <Line points={[canvasContentPadding, axisY, canvasContentPadding + chartWidth, axisY]} stroke={palette.borderSoft} strokeWidth={1} />
      {ticks.map(({ t, isMajor }) => (
        <Group key={t}>
          <Line
            points={[x(t), axisY - (isMajor ? 8 : 4), x(t), axisY]}
            stroke={isMajor ? palette.text : palette.borderSoft}
            strokeWidth={1}
          />
          {isMajor && (
            <Text
              x={labelX(t, formatClock(t))}
              y={axisY - 20}
              text={formatClock(t)}
              fontSize={labelFont}
              fill={palette.text}
              listening={false}
            />
          )}
        </Group>
      ))}
      {/* race start marker */}
      {raceStart > 0 && raceStart < videoEnd && (
        <Group listening={false}>
          <Line points={[x(raceStart), 0, x(raceStart), axisY]} stroke={palette.text} strokeWidth={1} dash={[3, 3]} opacity={0.7} />
          {/* label yields to the playhead badge when they would overlap */}
          {Math.abs(playheadX - x(raceStart)) > badgeW && <Text
            x={labelX(raceStart, raceStartText)}
            y={2}
            text={raceStartText}
            fontSize={9}
            fill={palette.text}
            opacity={0.8}
          />}
        </Group>
      )}
      {/* playhead marker + time badge */}
      <Line points={[playheadX, axisY - 10, playheadX, axisY]} stroke={palette.accent} strokeWidth={2} listening={false} />
      <Label x={badgeX} y={0} listening={false}>
        <Tag fill={palette.accent} cornerRadius={3} pointerDirection="none" />
        <Text text={badgeText} fontSize={labelFont} padding={2} fill="#ffffff" />
      </Label>
    </Group>
  );
}

export default TimelineAxis
