import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, VALUEClimbHeight, VALUEClimbWidth, VALUEClimbVideoHeight, VALUEClimbVideoWidth } from "../../../../../utils/values"

interface SchemaProps {
  transform?: any,
  fill?: string,
  fontSize?: string,
}

interface VisClimbCountProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  schema?: SchemaProps,
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

function VisClimbCount(props: VisClimbCountProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<string>("")
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const fontSize = 20;

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[0] && _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]) {
      const leaderFrameData = _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]
      // setContentText(leaderFrameData.elapsed.toFixed(2) + " s")
      setContentText(leaderFrameData.strokeCount ? leaderFrameData.strokeCount + "" : "")
      setLaneData(_thisFrameLaneList[laneIndex])
      setTextStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.climbCount[0].id
      ))
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
              // ? 70 + x + (laneData.x_middle / VALUEClimbHeight) * svgWidth
              // : (laneData.x_middle / VALUEClimbHeight) * svgWidth - x - 70)
              ? (laneData.ori_eventY ? (laneData.ori_eventY as number / VALUEClimbVideoHeight * svgWidth + x) : 0)
              : (laneData.ori_eventY ? x - (laneData.ori_eventY as number / VALUEClimbVideoHeight * svgWidth) : 0)
            )
            : x
          : DEFAULTSwimFlow2PositionXNoMove}
        ,
        ${laneData && svgHeight
          // ? y + (laneIndex + 0.5) * svgHeight - fontSize
          // ? 30 + y + (laneData.y as number) / VALUEClimbWidth * svgHeight
          ? (laneData.ori_eventX ? (svgHeight - (laneData.ori_eventX as number) / VALUEClimbVideoWidth * svgHeight + y) : 0)
          : y}
          )
        rotate(${-90})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <text
        x={`${textStyle?.x ? textStyle?.x + 0 : 0}`}
        y={`${textStyle?.y ? textStyle?.y + 0 : 0}`}
        fill={textStyle?.fontFillColor}
        fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}>
        {contentText}
      </text>
    </g>
  )
}

export default VisClimbCount