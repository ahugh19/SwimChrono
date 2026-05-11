import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize, DEFAULTSwimFlow2LapDistance } from "../../../../../utils/values"

interface VisDistanceDivedArrowLaneProps {
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

function VisDistanceDivedArrowLane(props: VisDistanceDivedArrowLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [distanceDived, setDistanceDived] = useState<number>(0)
  const [lineEndX, setLineEndX] = useState<number>(0)
  const [arrowTipX, setArrowTipX] = useState<number>(0)
  const [lineStartX, setLineStartX] = useState<number>(0)

  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [shapeStyle, setShapeStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {

      setDistanceDived(_thisFrameLaneList[laneIndex].diving)
      setLaneData(_thisFrameLaneList[laneIndex])

      editableElementList.forEach((e) => {
        if (e.id === editableElementInVisConfig.distanceDivedArrowLane[0].id) {
          setShapeStyle(e)
        }
      })

    }
  }, [currentFrameIndex, currentSwimmerVideo])

  useEffect(() => {
    if (!svgWidth) return
    setLineEndX(svgWidth)
    setArrowTipX(svgWidth - distanceDived * (svgWidth / DEFAULTSwimFlow2LapDistance)) // x of the arrow tip
    setLineStartX(svgWidth - distanceDived * (svgWidth / DEFAULTSwimFlow2LapDistance) + 10) // shorten the line slightly so it doesn't extend past the arrow head
  }, [svgWidth, distanceDived])

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
          ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - DEFAULTSwimFlow2TextControllerFontSize
          : y}
          )
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <line x1={lineStartX} y1="50" x2={lineEndX} y2="50" stroke={shapeStyle?.shapeStrokeColor} strokeWidth={shapeStyle?.shapeStrokeWidth} visibility={visibility && shapeStyle?.visible ? "visible" : "hidden"}/>
      <polygon points={`${arrowTipX},50 ${arrowTipX + 20},40 ${arrowTipX + 20},60`} fill={shapeStyle?.shapeFillColor} visibility={visibility && shapeStyle?.visible ? "visible" : "hidden"}/>
    </g>
  )
}

export default VisDistanceDivedArrowLane