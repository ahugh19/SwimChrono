import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values"

interface VisDistanceToLeaderBarLaneProps {
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

function VisDistanceToLeaderBarLane(props: VisDistanceToLeaderBarLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<number>(0)
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const [barStyle, setBarStyle] = useState<EditableElementType | undefined>()
  const barWidth = 100;
  const gapBetweenBarAndText = 20;
  const baseMaxDistance = 4;


  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      setContentText(_thisFrameLaneList[laneIndex].distanceToLeader)
      setLaneData(_thisFrameLaneList[laneIndex])

      editableElementList.forEach((e) => {
        if (e.id === editableElementInVisConfig.distanceToLeaderBarLane[0].id) {
          setTextStyle(e)
        } else if (e.id === editableElementInVisConfig.distanceToLeaderBarLane[1].id) {
          setBarStyle(e)
        }
      })

    }
  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    // frame[lane].x_middle / VALUEHalfDistance * svgLaneWidth
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
          ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - DEFAULTSwimFlow2TextControllerFontSize
          : y}
          )
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x="0" y="0" height="30"
        width={barWidth * (contentText / baseMaxDistance)}
        fill={barStyle?.shapeFillColor}
        fillOpacity={barStyle?.shapeFillOpacity}
        stroke={barStyle?.shapeStrokeColor}
        strokeWidth={barStyle?.shapeStrokeWidth}
        visibility={visibility && barStyle?.visible ? "visible" : "hidden"} />

      <text 
        x={`${(textStyle?.x ? textStyle?.x + 0 : 0) + barWidth * (contentText / baseMaxDistance) + gapBetweenBarAndText}`}
        y={`${textStyle?.y ? textStyle?.y + 25 : 25}`}
        fill={textStyle?.fontFillColor} fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}>
        {contentText === 0 ? "Leader" : `${contentText.toFixed(2)} m`}
      </text>
    </g>
  )
}

export default VisDistanceToLeaderBarLane