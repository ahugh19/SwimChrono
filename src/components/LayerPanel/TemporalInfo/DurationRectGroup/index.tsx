import { useState, useEffect } from 'react'
import { Text, Line } from 'react-konva';
import DurationRect from './DurationRect';
import { VideoType, VisType } from '../../../../types';
import { VIS_MOVEMENT_STATIC, VIS_MOVEMENT_MOVING, rectColorDefault, rectColorMoving, rectColorStatic, VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT, rectColorBottomRight, VIS_PLACEMENT_SCREEN_BOTTOM_LEFT, rectColorBottomLeft, VIS_PLACEMENT_SCREEN_TOP_RIGHT, rectColorTopRight, VIS_PLACEMENT_SCREEN_TOP_LEFT, rectColorTopLeft, VIS_PLACEMENT_PLAYER_FRONT, rectColorFrontPlayer, VIS_PLACEMENT_PLAYER_BEHIND, rectColorBehindPlayer, VIS_PLACEMENT_LANE_ALONG, rectColorAlong, durationRectHeight, durationRectMarginY, durationRectLineStroke, uiLineColor, OPTION_PLACEMENT, OPTION_MOVEMENT } from '../../../../utils/values'
import PlayingLine from './PlayingLine';

interface DurationRectProps {
  maxEndThisVis: number,
  canvasWidth: number,
  canvasHeight: number,
  onMouseMoveOnDurationRect: (vis: VisType) => void,
  onMouseLeaveDurationRect: () => void,
  onMouseClickOnDurationRect: (vis: VisType, maxEndThisVis: number, video: VideoType) => void,
  groupType: string,
  video: VideoType | null,
  currentTime: number,
  canvasContentPadding: number,
  ganttItemLists: VisType[][][]
}

function DurationRectGroup(props: DurationRectProps) {
  const { maxEndThisVis, canvasWidth, onMouseMoveOnDurationRect, onMouseLeaveDurationRect, onMouseClickOnDurationRect, groupType, video, currentTime, canvasContentPadding, ganttItemLists } = props

  const [timelineAxisXMax, setTimelineAxisXMax] = useState<number>(0)
  const [totalHeight, setTotalHeight] = useState<number>(0)

  const chartWidth = canvasWidth - 2 * canvasContentPadding

  useEffect(() => {
    let _totalHeight = 0
    ganttItemLists.forEach((igil, igilIndex) => {
      _totalHeight = _totalHeight + igil.length * (durationRectHeight + durationRectMarginY)
    })
    setTotalHeight(_totalHeight)

    setTimelineAxisXMax(chartWidth + canvasContentPadding)

  }, [video])

  function scaleX(x: number) {
    return x / maxEndThisVis * chartWidth + canvasContentPadding
  }

  function scaleW(w: number) {
    return w / maxEndThisVis * chartWidth
  }

  function getRectColor(vis: VisType) {
    let color = rectColorDefault
    if (groupType === OPTION_MOVEMENT) {
      if (vis.movement === VIS_MOVEMENT_MOVING) color = rectColorMoving
      if (vis.movement === VIS_MOVEMENT_STATIC) color = rectColorStatic
    } else if (groupType === OPTION_PLACEMENT) {
      if (vis.placement === VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT) color = rectColorBottomRight
      if (vis.placement === VIS_PLACEMENT_SCREEN_BOTTOM_LEFT) color = rectColorBottomLeft
      if (vis.placement === VIS_PLACEMENT_SCREEN_TOP_RIGHT) color = rectColorTopRight
      if (vis.placement === VIS_PLACEMENT_SCREEN_TOP_LEFT) color = rectColorTopLeft
      if (vis.placement === VIS_PLACEMENT_PLAYER_FRONT) color = rectColorFrontPlayer
      if (vis.placement === VIS_PLACEMENT_PLAYER_BEHIND) color = rectColorBehindPlayer
      if (vis.placement === VIS_PLACEMENT_LANE_ALONG) color = rectColorAlong
    }
    return color
  }

  function getPlayingLineX() {
    let x = canvasContentPadding
    if (video && currentTime > video.startMoment) {
      if (currentTime - video.startMoment >= maxEndThisVis) {
        x = timelineAxisXMax
      } else {
        x = scaleX(currentTime - video.startMoment)
      }
    }
    return x
  }

  return (
    <>
      {
        video
          ?
          <>
            {
              ganttItemLists.map((ganttItemList, placementIndex) => {
                const thisPlacementGroupOffsetY =
                  (placementIndex === 0 ? 0 : (eval(ganttItemLists.map((gil, gilIndex) => gilIndex < placementIndex ? gil.length : 0).join("+"))) * (durationRectHeight + durationRectMarginY))
                return ganttItemList.map((visL, indexWithInPlacementGroup) => {
                  const y = thisPlacementGroupOffsetY + indexWithInPlacementGroup * (durationRectHeight + durationRectMarginY)
                  return <>
                    <Line
                      points={[canvasContentPadding, y + durationRectHeight + 0.5 * durationRectLineStroke, canvasWidth - canvasContentPadding, y + durationRectHeight + 0.5 * durationRectLineStroke]}
                      stroke={uiLineColor}
                      strokeWidth={durationRectLineStroke}
                      lineCap='round'
                      lineJoin='round'
                    />
                    {
                      visL.map((v, i) => {
                        const x = v.relativeTimeInfo?.relativeStartMoment as number
                        const w = v.duration
                        return <DurationRect
                          key={`rect-${v.key}-${i}`}
                          x={scaleX(x)}
                          y={y}
                          w={scaleW(w)}
                          h={durationRectHeight}
                          color={getRectColor(v)}
                          isVisInMotion={v.movement === VIS_MOVEMENT_STATIC ? false : true}
                          onMousseMoveRect={() => onMouseMoveOnDurationRect(v)}
                          onMouseLeaveRect={() => onMouseLeaveDurationRect()}
                          onMouseClickRect={() => onMouseClickOnDurationRect(v, maxEndThisVis, video)}
                        />
                      })
                    }
                  </>
                })
              })
            }
            <PlayingLine
              playingLineX={getPlayingLineX()}
              playingLineY1={0}
              playingLineY2={totalHeight}
            />
          </>
          :
          null}
    </>
  )
}

export default DurationRectGroup