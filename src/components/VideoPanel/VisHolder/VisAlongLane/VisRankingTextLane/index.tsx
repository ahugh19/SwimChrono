import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return } from "../../../../../utils/values"

interface SchemaProps {
  transform?: any,
  fill?: string,
  fontSize?: string,
}

interface VisRankingTextLaneProps {
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

function VisRankingTextLane(props: VisRankingTextLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<number>(0)
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const fontSize = 20;

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      const sortedFrame = Object.entries(_thisFrameLaneList)
        .sort((a, b) => b[1].distanceSwam - a[1].distanceSwam).map((d) => d[1]);
      let rankingNum = 0
      sortedFrame.forEach((d, i) => {
        if (d.swimmerId === _thisFrameLaneList[laneIndex].swimmerId) {
          rankingNum = i + 1
        }
      })
      setContentText(rankingNum)
      setLaneData(_thisFrameLaneList[laneIndex])
      setTextStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.rankingTextLane[0].id
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

export default VisRankingTextLane