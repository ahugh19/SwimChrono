import { useState, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import Konva from 'konva';
import DurationRect from './DurationRect';
import { VideoType, VisType } from '../../../../types';
import { VIS_MOVEMENT_STATIC, VIS_MOVEMENT_MOVING, rectColorDefault, rectColorMoving, rectColorStatic, VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT, rectColorBottomRight, VIS_PLACEMENT_SCREEN_BOTTOM_LEFT, rectColorBottomLeft, VIS_PLACEMENT_SCREEN_TOP_RIGHT, rectColorTopRight, VIS_PLACEMENT_SCREEN_TOP_LEFT, rectColorTopLeft, VIS_PLACEMENT_PLAYER_FRONT, rectColorFrontPlayer, VIS_PLACEMENT_PLAYER_BEHIND, rectColorBehindPlayer, VIS_PLACEMENT_LANE_ALONG, rectColorAlong, placementOptionsStringList } from '../../../../utils/values'
import { useThemeColors } from '../../../../utils/theme'
import * as _ from "lodash";
import PlayingLine from './PlayingLine';

interface DurationRectProps {
  visList: VisType[],
  maxEndThisVis: number,
  canvasWidth: number,
  canvasHeight: number,
  onMouseMoveOnDurationRect: (vis: VisType) => void,
  onMouseLeaveDurationRect: () => void,
  onMouseClickOnDurationRect: (vis: VisType, maxEndThisVis: number, video: VideoType) => void,
  groupType: string,
  videoGroupIndex: number,
  processedVisData: VisType[][],
  processedVideoData: VideoType[],
  currentTime: number,
  currentPlayingVideoUrl: string,
  canvasContentPadding: number,
}

function DurationRectGroup(props: DurationRectProps) {
  const { visList, maxEndThisVis, canvasWidth, onMouseMoveOnDurationRect, onMouseLeaveDurationRect, onMouseClickOnDurationRect, groupType, videoGroupIndex, processedVideoData, processedVisData, currentTime, currentPlayingVideoUrl, canvasContentPadding } = props
  const palette = useThemeColors()
  const uiTextLight = palette.textBright

  const [video, setVideo] = useState<VideoType | null>(null)
  const [ganttItemLists, setGanttItemLists] = useState<VisType[][][]>([])
  const [thisVideoGroupOffsetY, setThisVideoGroupOffsetY] = useState<number>(0)
  const [timelineAxisY, setTimelineAxisY] = useState<number>(0)
  const [timelineAxisXMin, setTimelineAxisXMin] = useState<number>(canvasContentPadding)
  const [timelineAxisXMax, setTimelineAxisXMax] = useState<number>(0)
  const [totalHeight, setTotalHeight] = useState<number>(0)

  const durationRectHeight = 20 // height of each rect
  const durationRectSubGroupMarginY = 10 // gap between subgroups within a video
  const durationRectMarginY = 3 // gap between rows inside a subgroup
  const durationRectGroupOffsetY = 30 // gap between per-video gantt charts
  const durationRectGroupTitleHeight = 10 // title height for each video gantt
  const durationRectGroupTitleHeightWithMargin = 20 // title height + margin for each video gantt
  const durationRectGroupTimelineMargin = 10 // margin around the timeline axis for each video
  const legendHeight = 40 // legend height

  const OPTION_PLACEMENT = "placement"
  const OPTION_MOVEMENT = "movement"

  const chartWidth = canvasWidth - 2 * canvasContentPadding

  useEffect(() => {
    // console.log(placementOptionsStringList)
    if (visList.length === 0) return
    const videoL = processedVideoData.filter((v) => v.key === visList[0].videoKey)
    if (videoL.length === 0) return
    setVideo(videoL[0])
    const iniRectGroupVisLists = placementOptionsStringList.map((pos) => { return { placement: pos, visList: [] as VisType[] } })
    visList.forEach((v) => {
      iniRectGroupVisLists.forEach((rgvl) => {
        if (rgvl.placement === v.placement) rgvl.visList.push(v)
      })
    })
    const iniGanttItemLists: VisType[][][] = []
    iniRectGroupVisLists.map((vl) => arrangeGanttItems(vl.visList)).forEach((vl) => {
      if (vl.length > 0) iniGanttItemLists.push(vl)
    })
    setGanttItemLists(iniGanttItemLists)

    let _totalHeight = 0
    iniGanttItemLists.forEach((igil, igilIndex) => {
      _totalHeight = _totalHeight + igil.length * (durationRectHeight + durationRectMarginY) + durationRectSubGroupMarginY
    })
    setTotalHeight(_totalHeight)

    const _thisVideoGroupOffsetY = videoGroupIndex > 0 ? legendHeight + calPreviousOffset() + durationRectGroupTitleHeightWithMargin * videoGroupIndex : 0 + legendHeight
    setThisVideoGroupOffsetY(_thisVideoGroupOffsetY)

    const _timelineAxisY = _thisVideoGroupOffsetY + durationRectGroupTitleHeight + durationRectGroupTimelineMargin
    setTimelineAxisY(_timelineAxisY)
    setTimelineAxisXMax(chartWidth + canvasContentPadding)
  }, [])

  function calPreviousOffset() {
    let previousOffset = 0
    processedVisData.forEach((pVL, pVLIndex) => {
      if (pVLIndex < videoGroupIndex) {
        const iniRectGroupVisLists = placementOptionsStringList.map((pos) => { return { placement: pos, visList: [] as VisType[] } })

        pVL.forEach((v) => {
          iniRectGroupVisLists.forEach((rgvl) => {
            if (rgvl.placement === v.placement) rgvl.visList.push(v)
          })
        })

        const iniGanttItemLists: VisType[][][] = []
        iniRectGroupVisLists.map((vl) => arrangeGanttItems(vl.visList)).forEach((vl) => {
          if (vl.length > 0) iniGanttItemLists.push(vl)
        })

        let thisTotalHeight = 0
        iniGanttItemLists.forEach((igil, igilIndex) => {
          thisTotalHeight = thisTotalHeight + igil.length * (durationRectHeight + durationRectMarginY) + durationRectSubGroupMarginY
        })

        previousOffset = previousOffset + durationRectGroupOffsetY + durationRectGroupTitleHeightWithMargin + durationRectGroupTimelineMargin + thisTotalHeight
      }
    })
    return previousOffset
  }

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

  function arrangeGanttItems(listInput: VisType[]): VisType[][] {
    listInput.sort((a, b) => a.startMoment - b.startMoment)
    const rows: VisType[][] = [];
    for (const item of listInput) {
      let placed = false;
      // First, try to find a row whose items share the same data and don't time-conflict.
      for (const row of rows) {
        if (row.some(rowItem => _.xor(rowItem.data, item.data).length === 0) && // order-independent array equality
          // row.some(rowItem => _.isEqual(rowItem.data, item.data)) && // strict ordered comparison (alternative)
          row.every(rowItem => rowItem.endMoment <= item.startMoment)) {
          row.push(item);
          placed = true;
          break;
        }
      }
      // Pack tightly by placement.
      // If none matched, fall back to any non-conflicting row.
      if (!placed) {
        for (const row of rows) {
          if (row.some(rowItem => _.xor(rowItem.data, item.data).length === 0) && row.every(rowItem => rowItem.endMoment <= item.startMoment)) {
            row.push(item);
            placed = true;
            break;
          }
        }
      }
      // Still nothing fits — create a new row.
      if (!placed) {
        rows.push([item]);
      }
    }
    return rows;
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
      {video ?
        <>
          <Text
            key={`title-${video.key}-${videoGroupIndex}`}
            x={canvasContentPadding}
            y={thisVideoGroupOffsetY}
            height={durationRectGroupTitleHeight}
            fill={uiTextLight}
            text={`${video.year} ${video.gender} ${video.type} ${video.distance} ${video.level}`}
          />
          <Line
            key={`timelineAxis-${video.key}-${videoGroupIndex}`}
            points={[timelineAxisXMin, timelineAxisY, timelineAxisXMax, timelineAxisY]}
            stroke={"grey"}
            strokeWidth={4}
            lineCap='round'
            lineJoin='round'
          />
          {
            ganttItemLists.map((ganttItemList, placementIndex) => {
              const thisPlacementGroupOffsetY =
                durationRectGroupTitleHeightWithMargin +
                durationRectGroupTimelineMargin + thisVideoGroupOffsetY +
                (placementIndex === 0 ? 0 : (eval(ganttItemLists.map((gil, gilIndex) => gilIndex < placementIndex ? gil.length : 0).join("+"))) * (durationRectHeight + durationRectMarginY) +
                  durationRectSubGroupMarginY * placementIndex)
              return ganttItemList.map((visL, indexWithInPlacementGroup) => {
                const y = thisPlacementGroupOffsetY + indexWithInPlacementGroup * (durationRectHeight + durationRectMarginY)
                return visL.map((v, i) => {
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
              })
            })
          }
          {
            video.url === currentPlayingVideoUrl
              ?
              <PlayingLine
                video={video}
                playingLineX={getPlayingLineX()}
                playingLineY1={timelineAxisY - 2}
                playingLineY2={timelineAxisY + totalHeight}
              />
              :
              null
          }

        </>
        :
        null}
    </>
  )
}

export default DurationRectGroup