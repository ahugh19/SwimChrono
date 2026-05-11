import { useState, useEffect } from 'react'
import { Text, Line, Rect } from 'react-konva';
import DurationRect from './DurationRect';
import { VideoType, VisType, LayerType, VisIntervalType } from '../../../../types';
import { durationRectHeight, durationRectLineStroke, uiLineColor, rectBorderRadius, TRIGGER_COMP_START_END } from '../../../../utils/values'
import { useThemeColors } from '../../../../utils/theme'

interface DurationRectProps {
  raceStart: number,
  videoEnd: number,
  canvasWidth: number,
  canvasHeight: number,
  onMouseMoveOnDurationRect: (interval: VisIntervalType | null) => void,
  onMouseLeaveDurationRect: () => void,
  onMouseClickOnDurationRect: (layer: LayerType) => void,
  canvasContentPadding: number,
  layer: LayerType,
  y: number,
  scaleX: (x: number) => number,
  scaleW: (w: number) => number,
  isClicked: boolean,
}

// a list of visualizaiton's temporal infomation
// all the time are in "seconds"

function TemporalInfoItem(props: DurationRectProps) {
  const { raceStart, videoEnd, canvasWidth, onMouseMoveOnDurationRect, onMouseLeaveDurationRect, onMouseClickOnDurationRect, canvasContentPadding, layer, y, scaleW, scaleX, isClicked } = props
  const palette = useThemeColors()
  const uiBackgroundNormal = palette.background
  const uiBackgroundNormalInvisible = palette.backgroundElevated
  const uiBackgroundHighlight = palette.layerRowSelected
  const uiBackgroundHighlightInvisible = palette.layerRowSelectedInvisible
  const videoPreStartColor = palette.backgroundPreStart
  const videoPreStartColorInVisible = palette.backgroundPreStartInvisible

  function getRectColor(_layer: LayerType, _visInterval?: VisIntervalType) {
    return _layer.visibility ? palette.layerBarFill : palette.layerBarFillInvisible
  }

  function getPreStartRectColor(_layer: LayerType, _visInterval?: VisIntervalType) {
    return _layer.visibility ? videoPreStartColor : videoPreStartColorInVisible
  }

  useEffect(() => {
    console.log(videoEnd)
  }, [videoEnd])

  return (
    <>
      <Rect
        x={0}
        y={y}
        width={scaleW(videoEnd)}
        height={durationRectHeight}
        fill={isClicked ?
          (layer.visibility ?
            uiBackgroundHighlight :
            uiBackgroundHighlightInvisible
          ) :
          (layer.visibility ?
            uiBackgroundNormal :
            uiBackgroundNormalInvisible
          )}
        cornerRadius={rectBorderRadius}
      />
      <Line
        points={[canvasContentPadding, y + durationRectHeight + durationRectLineStroke, canvasWidth - canvasContentPadding, y + durationRectHeight + durationRectLineStroke]}
        stroke={uiLineColor}
        strokeWidth={durationRectLineStroke}
        lineCap='round'
        lineJoin='round'
      />
      {
        (!layer.intervalList || layer.intervalList && layer.intervalList.length === 0) && layer.embeddedVis?.visName
          ?
          <DurationRect
            key={`layer-${layer.uuid}-video-duration`}
            x={scaleX(raceStart)}
            y={y}
            w={scaleW(videoEnd)}
            realStartW={scaleW(raceStart)}
            h={durationRectHeight}
            color={getRectColor(layer)}
            preStartColor={getPreStartRectColor(layer)}
            onMousseMoveRect={() => onMouseMoveOnDurationRect(null)}
            onMouseLeaveRect={() => onMouseLeaveDurationRect()}
            onMouseClickRect={() => onMouseClickOnDurationRect(layer)}
            triggerCompType={TRIGGER_COMP_START_END}
            visibility={layer.visibility}
          />
          : layer.intervalList?.map((interval, i) => {
            const x = interval.relativeStartMoment as number
            const w = interval.duration as number
            return <DurationRect
              key={`layer-${layer.uuid}-${interval.triggerConfig.name}-${i}`}
              x={scaleX(x)}
              y={y}
              w={scaleW(w)}
              realStartW={scaleW(raceStart)}
              h={durationRectHeight}
              color={getRectColor(layer, interval)}
              preStartColor={getPreStartRectColor(layer)}
              onMousseMoveRect={() => onMouseMoveOnDurationRect(interval)}
              onMouseLeaveRect={() => onMouseLeaveDurationRect()}
              onMouseClickRect={() => onMouseClickOnDurationRect(layer)}
              triggerCompType={interval.triggerConfig.triggerType}
              visibility={layer.visibility}
            />
          })
      }
    </>
  )
}

export default TemporalInfoItem