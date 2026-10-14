import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../../store";
import { Stage, Layer, Label, Tag, Text } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import styles from "./index.module.less"
import { VisIntervalType, LayerType } from '../../../types';
import { durationRectHeight, durationRectMarginY, durationRectLineStroke, MIN_INTERVAL_SECONDS } from '../../../utils/values'
import { useThemeColors } from '../../../utils/theme'
import TemporalInfoItem, { IntervalDraft } from './TemporalInfoItem';
import { IntervalEdge } from './TemporalInfoItem/DurationRect';
import PlayingLine from './DurationRectGroup/PlayingLine';
import { formatClock } from '../../../utils';

interface TemporalInfoProps extends IComponentPropsWithStore {
  videoElement: HTMLVideoElement | null
  videoEnd: number
  raceStart: number
  canvasWidth: number
  canvasHeight: number
  currentVideoTime: number
  onSeek: (time: number) => void
}

type DragState =
  | { kind: 'scrub' }
  | { kind: 'edge'; layer: LayerType; layerIndex: number; intervalIndex: number; edge: 'start' | 'end'; start: number; end: number }
  | { kind: 'move'; layer: LayerType; layerIndex: number; intervalIndex: number; start: number; end: number; grabTime: number; moved: boolean; clientX: number }

export const ROW_HEIGHT = durationRectHeight + durationRectLineStroke + durationRectMarginY

function TemporalInfo(props: TemporalInfoProps) {
  const { store, raceStart, videoEnd, canvasWidth, canvasHeight, currentVideoTime, onSeek } = props;
  const palette = useThemeColors();

  const konvaStageRef = useRef<Konva.Stage>(null)
  const dragRef = useRef<DragState | null>(null)
  const [draft, setDraft] = useState<IntervalDraft | null>(null)
  const [hoverRow, setHoverRow] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  const canvasContentPadding = 2
  const chartWidth = canvasWidth - 2 * canvasContentPadding
  const layerList = store?.layerList ?? []

  function scaleX(x: number) {
    return videoEnd * chartWidth === 0 ? 0 : x / videoEnd * chartWidth + canvasContentPadding
  }
  function scaleW(w: number) {
    return videoEnd * chartWidth === 0 ? 0 : w / videoEnd * chartWidth
  }

  function timeFromClientX(clientX: number) {
    const stage = konvaStageRef.current
    if (!stage || videoEnd <= 0) return 0
    const rect = stage.container().getBoundingClientRect()
    const x = clientX - rect.left - canvasContentPadding
    return Math.min(videoEnd, Math.max(0, (x / chartWidth) * videoEnd))
  }

  function pointerFromClient(clientX: number, clientY: number) {
    const stage = konvaStageRef.current
    if (!stage) return { x: 0, y: 0 }
    const rect = stage.container().getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  // Neighbouring intervals of the same layer bound how far an edge can go.
  function boundsFor(layer: LayerType, intervalIndex: number) {
    const list = layer.intervalList ?? []
    const prevEnd = intervalIndex > 0 ? list[intervalIndex - 1].relativeEndMoment : 0
    const nextStart = intervalIndex < list.length - 1 ? list[intervalIndex + 1].relativeStartMoment : videoEnd
    return { min: prevEnd, max: nextStart }
  }

  function rangeText(start: number, end: number) {
    return `${formatClock(start, 2)} – ${formatClock(end, 2)}  (${(end - start).toFixed(2)} s)`
  }

  function onIntervalPointerDown(layer: LayerType, intervalIndex: number, edge: IntervalEdge, start: number, end: number, e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true
    const layerIndex = layerList.findIndex((l) => l.uuid === layer.uuid)
    if (layerIndex < 0) return
    store?.setSelectedLayerIndex(layerIndex)
    if (edge === 'move') {
      dragRef.current = { kind: 'move', layer, layerIndex, intervalIndex, start, end, grabTime: timeFromClientX(e.evt.clientX), moved: false, clientX: e.evt.clientX }
    } else {
      dragRef.current = { kind: 'edge', layer, layerIndex, intervalIndex, edge, start, end }
      setDraft({ layerUuid: layer.uuid, intervalIndex, start, end })
    }
  }

  function onStageMouseDown(e: KonvaEventObject<MouseEvent>) {
    if (e.evt.button !== 0) return
    dragRef.current = { kind: 'scrub' }
    onSeek(timeFromClientX(e.evt.clientX))
  }

  function onStageMouseMove(e: KonvaEventObject<MouseEvent>) {
    const p = pointerFromClient(e.evt.clientX, e.evt.clientY)
    const row = Math.floor(p.y / ROW_HEIGHT)
    setHoverRow(row >= 0 && row < layerList.length ? row : null)
  }

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current
      if (!d) return
      const t = timeFromClientX(ev.clientX)
      const p = pointerFromClient(ev.clientX, ev.clientY)
      if (d.kind === 'scrub') {
        onSeek(t)
        return
      }
      if (d.kind === 'edge') {
        const { min, max } = boundsFor(d.layer, d.intervalIndex)
        let start = d.start
        let end = d.end
        if (d.edge === 'start') start = Math.min(Math.max(t, min), end - MIN_INTERVAL_SECONDS)
        else end = Math.max(Math.min(t, max), start + MIN_INTERVAL_SECONDS)
        dragRef.current = { ...d, start, end }
        setDraft({ layerUuid: d.layer.uuid, intervalIndex: d.intervalIndex, start, end })
        setTooltip({ x: p.x + 12, y: p.y + 12, text: rangeText(start, end) })
        return
      }
      if (d.kind === 'move') {
        if (!d.moved && Math.abs(ev.clientX - d.clientX) < 3) return
        const { min, max } = boundsFor(d.layer, d.intervalIndex)
        const duration = d.end - d.start
        let start = d.start + (t - d.grabTime)
        start = Math.min(Math.max(start, min), max - duration)
        const end = start + duration
        dragRef.current = { ...d, moved: true }
        setDraft({ layerUuid: d.layer.uuid, intervalIndex: d.intervalIndex, start, end })
        setTooltip({ x: p.x + 12, y: p.y + 12, text: rangeText(start, end) })
      }
    }
    const onUp = (ev: MouseEvent) => {
      const d = dragRef.current
      dragRef.current = null
      if (!d) return
      if (d.kind === 'edge') {
        store?.updateLayerInterval(d.layerIndex, d.intervalIndex, d.start, d.end)
      } else if (d.kind === 'move') {
        if (d.moved && draft) {
          store?.updateLayerInterval(d.layerIndex, d.intervalIndex, draft.start, draft.end)
        } else if (!d.moved) {
          onSeek(timeFromClientX(ev.clientX))
        }
      }
      setDraft(null)
      setTooltip(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  })

  function onMouseMoveOnDurationRect(interval: VisIntervalType | null, edited: boolean) {
    if (dragRef.current) return
    const stage = konvaStageRef.current
    const pointerPos = stage?.getPointerPosition()
    if (!pointerPos) return
    let text = `Whole race: ${rangeText(raceStart, videoEnd)}`
    if (interval) {
      const names = interval.isMerged
        ? interval.mergedTriggers.map((t) => t.name).filter((n, i, arr) => i === 0 || n !== arr[i - 1]).join(", ")
        : interval.triggerConfig.name
      text = `${rangeText(interval.relativeStartMoment, interval.relativeEndMoment)}\n${edited ? "Edited by hand · ↺ restores the trigger result" : `Trigger: ${names}`}`
    } else {
      text = `${text}\nNo trigger — shown from the race start · drag the edges to limit it`
    }
    setTooltip({ x: pointerPos.x + 12, y: pointerPos.y + 12, text })
  }

  function onMouseLeaveDurationRect() {
    if (!dragRef.current) setTooltip(null)
  }

  const totalHeight = Math.max(canvasHeight, layerList.length * ROW_HEIGHT)
  const playingLineX = currentVideoTime >= videoEnd ? chartWidth + canvasContentPadding : scaleX(currentVideoTime)

  return (
    <div className={styles.temporalInfo}>
      <Stage
        width={canvasWidth}
        height={totalHeight}
        ref={konvaStageRef}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseLeave={() => setHoverRow(null)}
      >
        <Layer>
          {
            layerList.map((layer, index) => (
              <TemporalInfoItem
                key={`temporal-info-item-${layer.uuid}`}
                videoEnd={videoEnd}
                raceStart={raceStart}
                canvasWidth={canvasWidth}
                canvasContentPadding={canvasContentPadding}
                layer={layer}
                isClicked={index === store?.selectedLayerIndex}
                isHovered={index === hoverRow}
                draft={draft}
                y={index * ROW_HEIGHT}
                scaleX={scaleX}
                scaleW={scaleW}
                onMouseMoveOnDurationRect={onMouseMoveOnDurationRect}
                onMouseLeaveDurationRect={onMouseLeaveDurationRect}
                onIntervalPointerDown={onIntervalPointerDown}
              />
            ))
          }
          <PlayingLine
            playingLineX={playingLineX}
            playingLineY1={0}
            playingLineY2={totalHeight}
          />
          {tooltip && (() => {
            // Size estimate of the label, then flip it left / up when it
            // would leave the visible part of the (possibly scrolled) chart.
            const lines = tooltip.text.split("\n")
            const boxW = Math.min(360, Math.max(...lines.map((l) => l.length)) * 6.4 + 14)
            const boxH = lines.length * 11 * 1.3 + 14
            const scroller = konvaStageRef.current?.container().parentElement
            const visLeft = scroller?.scrollLeft ?? 0
            const visRight = visLeft + (scroller?.clientWidth ?? canvasWidth)
            const visTop = scroller?.scrollTop ?? 0
            const visBottom = visTop + (scroller?.clientHeight ?? totalHeight)
            let lx = tooltip.x
            if (lx + boxW > visRight) lx = Math.max(visLeft, tooltip.x - 24 - boxW)
            let ly = tooltip.y
            if (ly + boxH > visBottom) ly = Math.max(visTop, tooltip.y - 24 - boxH)
            return (
              <Label x={lx} y={ly} listening={false}>
                <Tag fill={palette.legendOverlayBg} stroke={palette.accent} strokeWidth={1} cornerRadius={4} shadowBlur={6} shadowOpacity={0.25} />
                <Text text={tooltip.text} fontSize={11} padding={6} fill={palette.textBright} lineHeight={1.3} />
              </Label>
            )
          })()}
        </Layer>
      </Stage>
    </div>
  )
}

export default inject('store')(observer(TemporalInfo))
