import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return } from "../../../../../utils/values"

interface VisElapsedTimeLaneProps {
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

function VisLaneHighlight(props: VisElapsedTimeLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [rectStyle, setRectStyle] = useState<EditableElementType | undefined>()
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[0] && _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]) {
      const leaderFrameData = _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]
      setLaneData(_thisFrameLaneList[laneIndex])
      setRectStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.laneHighlight[0].id
      ))
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  useEffect(() => {
    setWidth(svgWidth ? svgWidth * 100 / s : 0)
  }, [svgWidth, s])

  useEffect(() => {
    if (svgHeight && svgHeight != 0) {
      setHeight(svgHeight / DEFAULTSwimFlow2LaneSum * 100/ s)
    } else {
      setHeight(0)
    }
  }, [svgHeight, s])

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
          ? y + (laneIndex) * svgHeight / DEFAULTSwimFlow2LaneSum
          : y}
          )
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x={`${rectStyle?.x ? rectStyle?.x + 0 : 0}`}
        y={`${rectStyle?.y ? rectStyle?.y + 0 : 0}`}
        width={width} height={height}
        fill={rectStyle?.shapeFillColor}
        stroke={rectStyle?.shapeStrokeColor}
        strokeWidth={rectStyle?.shapeStrokeWidth}
        visibility={visibility && rectStyle?.visible ? "visible" : "hidden"}
      />
    </g>
  )
}

export default VisLaneHighlight