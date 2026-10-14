import { Line, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import DurationRect, { IntervalEdge } from './DurationRect';
import { LayerType, VisIntervalType } from '../../../../types';
import { durationRectHeight, durationRectLineStroke, uiLineColor, rectBorderRadius, TRIGGER_COMP_START_END, MANUAL_TRIGGER_NAME } from '../../../../utils/values'
import { useThemeColors } from '../../../../utils/theme'

export interface IntervalDraft {
  layerUuid: string
  intervalIndex: number
  start: number
  end: number
}

interface TemporalInfoItemProps {
  raceStart: number,
  videoEnd: number,
  canvasWidth: number,
  canvasContentPadding: number,
  layer: LayerType,
  y: number,
  scaleX: (x: number) => number,
  scaleW: (w: number) => number,
  isClicked: boolean,
  isHovered: boolean,
  draft: IntervalDraft | null,
  onMouseMoveOnDurationRect: (interval: VisIntervalType | null, edited: boolean) => void,
  onMouseLeaveDurationRect: () => void,
  onIntervalPointerDown: (layer: LayerType, intervalIndex: number, edge: IntervalEdge, start: number, end: number, e: KonvaEventObject<MouseEvent>) => void,
}

// One timeline row: background, pre-start shading and the layer's
// interval bars (or a single whole-video bar without triggers). Times are
// in seconds from the start of the video.
function TemporalInfoItem(props: TemporalInfoItemProps) {
  const { raceStart, videoEnd, canvasWidth, canvasContentPadding, layer, y, scaleW, scaleX, isClicked, isHovered, draft,
    onMouseMoveOnDurationRect, onMouseLeaveDurationRect, onIntervalPointerDown } = props
  const palette = useThemeColors()

  const rowFill = isClicked
    ? (layer.visibility ? palette.layerRowSelected : palette.layerRowSelectedInvisible)
    : isHovered
      ? palette.backgroundElevated
      : (layer.visibility ? palette.background : palette.backgroundElevated)
  const barFill = layer.visibility ? palette.layerBarFill : palette.layerBarFillInvisible
  const edited = layer.intervalEdited === true
  const showHandles = isClicked || isHovered

  function draftFor(index: number, start: number, end: number) {
    if (draft && draft.layerUuid === layer.uuid && draft.intervalIndex === index) return { start: draft.start, end: draft.end }
    return { start, end }
  }

  const hasIntervals = !!layer.intervalList && layer.intervalList.length > 0

  return (
    <>
      <Rect
        x={0}
        y={y}
        width={Math.max(canvasWidth, scaleW(videoEnd) + 2 * canvasContentPadding)}
        height={durationRectHeight}
        fill={rowFill}
        cornerRadius={rectBorderRadius}
      />
      {/* shade the part of the video before the race starts */}
      <Rect
        x={scaleX(0)}
        y={y}
        width={Math.max(0, scaleW(raceStart))}
        height={durationRectHeight}
        fill={palette.backgroundPreStart}
        opacity={0.6}
        listening={false}
      />
      <Line
        points={[canvasContentPadding, y + durationRectHeight + durationRectLineStroke, canvasWidth - canvasContentPadding, y + durationRectHeight + durationRectLineStroke]}
        stroke={uiLineColor}
        strokeWidth={durationRectLineStroke}
        listening={false}
      />
      {
        !hasIntervals && layer.embeddedVis?.visName
          ? (() => {
            const { start, end } = draftFor(0, raceStart, videoEnd)
            return <DurationRect
              key={`layer-${layer.uuid}-video-duration`}
              x={scaleX(start)}
              y={y}
              w={scaleW(end - start)}
              h={durationRectHeight}
              color={barFill}
              label="whole race"
              triggerCompType={TRIGGER_COMP_START_END}
              visibility={layer.visibility}
              edited={false}
              showHandles={showHandles}
              onMouseMoveRect={() => onMouseMoveOnDurationRect(null, false)}
              onMouseLeaveRect={onMouseLeaveDurationRect}
              onPointerDown={(edge, e) => onIntervalPointerDown(layer, 0, edge, start, end, e)}
            />
          })()
          : layer.intervalList?.map((interval, i) => {
            const { start, end } = draftFor(i, interval.relativeStartMoment, interval.relativeEndMoment)
            const label = interval.triggerConfig.name === MANUAL_TRIGGER_NAME
              ? "manual"
              : interval.isMerged ? interval.mergedTriggers.map((t) => t.name).join(" + ") : interval.triggerConfig.name
            return <DurationRect
              key={`layer-${layer.uuid}-${i}`}
              x={scaleX(start)}
              y={y}
              w={scaleW(end - start)}
              h={durationRectHeight}
              color={barFill}
              label={label}
              triggerCompType={interval.triggerConfig.triggerType}
              visibility={layer.visibility}
              edited={edited}
              showHandles={showHandles}
              onMouseMoveRect={() => onMouseMoveOnDurationRect(interval, edited)}
              onMouseLeaveRect={onMouseLeaveDurationRect}
              onPointerDown={(edge, e) => onIntervalPointerDown(layer, i, edge, start, end, e)}
            />
          })
      }
    </>
  )
}

export default TemporalInfoItem
