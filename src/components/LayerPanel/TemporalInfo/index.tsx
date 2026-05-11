import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store";
import { Stage, Layer, Text } from 'react-konva';
import Konva from 'konva';
import styles from "./index.module.less"
import { VideoType, VisType, VisIntervalType, LayerType } from '../../../types';
import { durationRectHeight, durationRectMarginY, durationRectLineStroke } from '../../../utils/values'
import { useThemeColors } from '../../../utils/theme'
import TemporalInfoItem from './TemporalInfoItem';
import PlayingLine from './DurationRectGroup/PlayingLine';

interface RTemporalInfoProps extends IComponentPropsWithStore {
  videoElement: HTMLVideoElement | null
  videoEnd: number
  raceStart: number
  canvasWidth: number
  canvasHeight: number
  currentVideoTime: number
}

function TemporalInfo(props: RTemporalInfoProps) {
  const { store, videoElement, raceStart, videoEnd, canvasWidth, canvasHeight, currentVideoTime } = props;
  const palette = useThemeColors();

  const [layerList, setLayerList] = useState<LayerType[] | null>(null);

  const [tooltipTextX, setTooltipTextX] = useState<number>(0);
  const [tooltipTextY, setTooltipTextY] = useState<number>(0);
  const [tooltipTextContent, setTooltipTextContent] = useState<string>("");
  const konvaStageRef = useRef<Konva.Stage>(null)

  const tooltipOffset = 10
  const canvasContentPadding = 2

  const [seekTime, setSeekTime] = useState<number | null>(0)

  const [totalHeight, setTotalHeight] = useState<number>(0)
  const [timelineAxisXMax, setTimelineAxisXMax] = useState<number>(0)

  const chartWidth = canvasWidth - 2 * canvasContentPadding


  useEffect(() => {
    if (!store) return
    setLayerList(store.layerList)
  }, [store?.layerList])

  function onMouseMoveOnDurationRect(interval: VisIntervalType | null) {
    if (!konvaStageRef.current) return
    const pointerPos = konvaStageRef.current.getPointerPosition();
    if (!pointerPos) return
    setTooltipTextX(pointerPos.x + tooltipOffset)
    setTooltipTextY(pointerPos.y + tooltipOffset)

    let tooltipText = ""
    if (interval) {
      if (interval.isMerged) {
        let triggerNames = ""
        interval.mergedTriggers.forEach((mt, i) => {
          if (i === 0) {
            triggerNames = triggerNames + `${mt.name}`
          } else if (mt.name !== interval.mergedTriggers[i - 1].name) {
            triggerNames = triggerNames + `, ${mt.name}`
          }
        })
        tooltipText = `Decided by triggers: ${triggerNames}.`
      } else {
        tooltipText = `Decided by trigger: ${interval.triggerConfig.name}.`
      }
    } else {
      tooltipText = `Decided by video duration.`
    }
    setTooltipTextContent(tooltipText)
  }

  function onMouseLeaveDurationRect() {
    setTooltipTextContent("")
  }

  function onMouseClickDurationRect(layer: LayerType) {
    if (!konvaStageRef.current) return
    const pointerPos = konvaStageRef.current.getPointerPosition();
    // console.log(pointerPos, videoElement)
    if (!pointerPos || !videoElement) return
    setSeekTime((pointerPos.x - canvasContentPadding) / (canvasWidth - 2 * canvasContentPadding) * videoEnd)
  }

  function onMouseClickStage() {
    if (!konvaStageRef.current) return
    const pointerPos = konvaStageRef.current.getPointerPosition();
    if (!pointerPos || !videoElement) return
    setSeekTime((pointerPos.x - canvasContentPadding) / (canvasWidth - 2 * canvasContentPadding) * videoEnd)
  }

  function scaleX(x: number) {
    return videoEnd * chartWidth === 0 ? 0 : x / videoEnd * chartWidth + canvasContentPadding
  }

  function scaleW(w: number) {
    return videoEnd * chartWidth === 0 ? 0 : w / videoEnd * chartWidth
  }

  function getPlayingLineX() {
    let x = canvasContentPadding
    if (currentVideoTime >= videoEnd) {
      x = timelineAxisXMax
    } else {
      x = scaleX(currentVideoTime)
    }
    return x
  }

  useEffect(() => {
    setTimelineAxisXMax(chartWidth + canvasContentPadding)
  }, [])

  useEffect(() => {
    setTotalHeight(canvasHeight)
  }, [layerList])

  useEffect(() => {
    if (!videoElement || !seekTime) return
    videoElement.currentTime = seekTime
  }, [seekTime])

  return (
    <div className={styles.temporalInfo}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        ref={konvaStageRef}
        onClick={onMouseClickStage}
      >
        <Layer>
          {
            layerList?.map((layer, index) => {
              return <TemporalInfoItem
                key={`temporal-info-item-${index}`}
                videoEnd={videoEnd}
                raceStart={raceStart}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                onMouseMoveOnDurationRect={onMouseMoveOnDurationRect}
                onMouseLeaveDurationRect={onMouseLeaveDurationRect}
                onMouseClickOnDurationRect={onMouseClickDurationRect}
                canvasContentPadding={canvasContentPadding}
                layer={layer}
                isClicked={layer.isSelected}
                y={index * (durationRectHeight + durationRectLineStroke + durationRectMarginY)}
                scaleX={scaleX}
                scaleW={scaleW}
              />
            })
          }
          <Text
            x={tooltipTextX}
            y={tooltipTextY}
            text={tooltipTextContent}
            fill={palette.text}
          />
          <PlayingLine
            playingLineX={getPlayingLineX()}
            playingLineY1={0}
            playingLineY2={totalHeight}
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default inject('store')(observer(TemporalInfo))