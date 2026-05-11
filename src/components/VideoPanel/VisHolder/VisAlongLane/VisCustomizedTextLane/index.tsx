import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, CustomizedIconType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, editableElementInVisConfig, VALUE_customizedTextIndividual } from "../../../../../utils/values"

interface VisCustomizedTextLaneProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  customizedText: string | undefined
  visibility: boolean
  isMove: boolean,
  laneIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
  editableElementList: EditableElementType[]
}

function VisCustomizedTextLane(props: VisCustomizedTextLaneProps) {

  const { currentSwimmerVideo, currentFrameIndex, customizedText, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, visibility, editableElementList } = props;
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const fontSize = 20;


  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      setLaneData(_thisFrameLaneList[laneIndex])
      setTextStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig[VALUE_customizedTextIndividual][0].id
      ))
    }
  }, [currentFrameIndex, currentSwimmerVideo])

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
            rotate(${r})
            scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <text 
        x={`${textStyle?.x ? textStyle?.x + 20 : 20}`}
        y={`${textStyle?.y ? textStyle?.y + 20 : 20}`}
        fill={textStyle?.fontFillColor}
        fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}
      >
        {customizedText ? customizedText : "Your customized text"}
      </text>
    </g>
  )
}

export default VisCustomizedTextLane