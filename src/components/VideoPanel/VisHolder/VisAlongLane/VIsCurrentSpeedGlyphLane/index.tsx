import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFillColor } from "../../../../../utils/values"
import { getGradientColor } from "../../../../../utils"

interface VisCurrentSpeedGlyphLaneProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  isMove: boolean,
  laneIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
  editableElementList: EditableElementType[]
  visibility: boolean
}

function VisCurrentSpeedGlyphLane(props: VisCurrentSpeedGlyphLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<number>(0)
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [glyphColor, setGlyphColor] = useState<string>(DEFAULTSwimFlow2TextControllerFillColor)
  const [shapeVisible, setShapeVisible] = useState<boolean | undefined>(undefined)

  const baseHeight = 120;
  const minHeight = 40; // minimum glyph height
  const fontSize = 20;
  const maxSpeed = 1.6; // TODO compute speed max from data
  const w = 100;
  const radius = w / 2;
  const [percent, setPercent] = useState<number>(1)
  const [h, setH] = useState<number>(0)
  const [thisFrameLaneList, setThisFrameLaneList] = useState<SwimmerVideoFrameType | null>(null)


  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      setContentText(_thisFrameLaneList[laneIndex].speed)
      setLaneData(_thisFrameLaneList[laneIndex])
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  useEffect(() => {
    const color1 = editableElementList.find((e) => e.id === editableElementInVisConfig.currentSpeedGlyphLane[0].id)?.shapeFillColor
    const color2 = editableElementList.find((e) => e.id === editableElementInVisConfig.currentSpeedGlyphLane[1].id)?.shapeFillColor
    setGlyphColor(
      getGradientColor((60 - contentText / maxSpeed * 70) * 5, color1 ? color1 : '#7AA2E3', color2 ? color2 : '#FFC94A')
    )
    const visible = editableElementList.find((e) => e.id === editableElementInVisConfig.currentSpeedGlyphLane[0].id)?.visible || editableElementList.find((e) => e.id === editableElementInVisConfig.currentSpeedGlyphLane[1].id)?.visible
    setShapeVisible(visible)
    setPercent(Math.min(contentText / maxSpeed, 1))
  }, [contentText])

  useEffect(() => {
    setH(1 - percent > 0 ? minHeight + (baseHeight - minHeight) * (1 - percent) : minHeight);
  }, [percent])

  return (
    <g
      transform={
        `translate(
        ${isMove
          ? laneData && svgWidth
            ? (laneData.direction === VALUEFrameDataDirection_advance
              ? x + (laneData.x_middle / VALUEHalfDistance) * svgWidth
              : (laneData.x_middle / VALUEHalfDistance) * svgWidth - x)
            : x
          : DEFAULTSwimFlow2PositionXNoMove}
        ,
        ${svgHeight
          ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - fontSize
          : y}
          )
        scale(${s / 100})
        scale(
        ${laneData && svgWidth
          ? (laneData.direction === VALUEFrameDataDirection_advance ? 1 : -1)
          : 1}
          , 1)
        rotate(${r})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <path
        visibility={visibility && shapeVisible ? "visible" : "hidden"}
        fill={glyphColor}
        d={`
          M ${w / 2} ${percent * h} 
          A ${radius} ${radius} 0 0 0 ${w / 2} ${(1 - percent) * h}
          L 0 ${h / 2}
          Z
        `} >
      </path>
    </g>
  )
}

export default VisCurrentSpeedGlyphLane