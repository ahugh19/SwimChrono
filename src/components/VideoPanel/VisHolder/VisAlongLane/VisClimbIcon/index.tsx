import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, VALUEClimbHeight, VALUEClimbWidth, VALUEClimbVideoHeight, VALUEClimbVideoWidth } from "../../../../../utils/values"

interface SchemaProps {
  transform?: any,
  fill?: string,
  fontSize?: string,
}

interface VisClimbIconProps {
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

function VisClimbIcon(props: VisClimbIconProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [iconStyle, setIconStyle] = useState<EditableElementType | undefined>()
  const fontSize = 20;

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[0] && _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]) {
      const leaderFrameData = _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]
      // setContentText(leaderFrameData.elapsed.toFixed(2) + " s")
      console.log(leaderFrameData.acceleration)
      setLaneData(_thisFrameLaneList[laneIndex])
      setIconStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.climbIcon[0].id
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
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      {
        laneData ?
          <g transform={
            `translate(0, -70) rotate(180) scale(${20 / 100})`}>
            <path d="M93.7,110.4l-71.7,48c-1.7,1.2-4,.6-5.2-1.2,0-.6-.6-1.2-.6-2.3V45c0-2.3,1.7-4,4-4s1.7,0,2.3.6l71.7,48v-44.5c0-2.3,1.7-4,4-4s1.7,0,2.3.6l82.7,54.9c1.7,1.2,2.3,3.5,1.2,5.2,0,0-.6.6-1.2,1.2l-82.7,54.9c-1.7,1.2-4,.6-5.2-1.2,0-.6-.6-1.2-.6-2.3v-44.5h0l-1.2.6Z" fill={iconStyle?.shapeFillColor} />
          </g>
          :
          null
      }
    </g>
  )
}

export default VisClimbIcon