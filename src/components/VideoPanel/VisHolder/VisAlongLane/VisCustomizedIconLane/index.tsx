import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, CustomizedIconType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return } from "../../../../../utils/values"

interface VisCustomizedIconLaneProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  customizedIcon: CustomizedIconType | undefined
  visibility: boolean
  isMove: boolean,
  laneIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
}

function VisCustomizedIconLane(props: VisCustomizedIconLaneProps) {

  const { currentSwimmerVideo, currentFrameIndex, customizedIcon, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, visibility } = props;
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()


  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      setLaneData(_thisFrameLaneList[laneIndex])
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      transform={
        `
        scale(${laneData && laneData.direction === VALUEFrameDataDirection_advance ? 1 : -1}, 1)
        translate(
            ${isMove
          ? laneData && svgWidth
            ? (laneData.direction === VALUEFrameDataDirection_advance
              ? x + (laneData.x_middle / VALUEHalfDistance) * svgWidth
              : -((laneData.x_middle / VALUEHalfDistance) * svgWidth - x))
            : x
          : DEFAULTSwimFlow2PositionXNoMove}
            ,
            ${svgHeight
          ? y + (laneIndex) * svgHeight / DEFAULTSwimFlow2LaneSum
          : y}
              )
            scale(${s / 100})
            scale(${customizedIcon && customizedIcon.size ? customizedIcon.size : 1})
            rotate(${r})
        `
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      {customizedIcon && customizedIcon.svgContent ? 
        <g 
          visibility={visibility && customizedIcon.visible ? "visible" : "hidden"}
          dangerouslySetInnerHTML={{ __html: customizedIcon.svgContent }} /> :
        null}
    </g>
  )
}

export default VisCustomizedIconLane