import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return } from "../../../../../utils/values"
import { getGradientColor } from "../../../../../utils"

interface SchemaProps {
  transform?: any,
  fill?: string,
  fontSize?: string,
}

interface VisDistanceLeftLaneProps {
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

function VisDistanceLeftLane(props: VisDistanceLeftLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<number>(0)
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const [rectStyle1, setRectStyle1] = useState<EditableElementType | undefined>()
  const [rectStyle2, setRectStyle2] = useState<EditableElementType | undefined>()
  const [gradColor, setGradColor] = useState<string | undefined>()
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const fontSize = 20;

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      setContentText(_thisFrameLaneList[laneIndex].distanceSwam)
      setLaneData(_thisFrameLaneList[laneIndex])
      setTextStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.distanceLeftLane[0].id
      ))
      setRectStyle1(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.distanceLeftLane[1].id
      ))
      setRectStyle2(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.distanceLeftLane[2].id
      ))
      if (rectStyle1 && rectStyle2 && rectStyle1.shapeFillColor && rectStyle2.shapeFillColor) {
        setGradColor(getGradientColor(_thisFrameLaneList[laneIndex].distanceSwam % VALUEHalfDistance / VALUEHalfDistance, rectStyle1?.shapeFillColor, rectStyle2?.shapeFillColor))
      }
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  useEffect(() => {
    setWidth(svgWidth ? svgWidth * 100 / s * (1 - contentText % VALUEHalfDistance / VALUEHalfDistance) : 0)
  }, [svgWidth, s, contentText])

  useEffect(() => {
    if (svgHeight && svgHeight != 0) {
      setHeight((svgHeight / DEFAULTSwimFlow2LaneSum * 100 / s) * 0.8)
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
          ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - fontSize
          : y}
          )
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      <text
        x={`${(textStyle?.x ?? 0) + (laneData && svgWidth ? (laneData.direction === VALUEFrameDataDirection_advance ? 0 : svgWidth - 100) : 0)}`}
        y={`${textStyle?.y ?? 0}`}
        fill={textStyle?.fontFillColor}
        fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}>
        {contentText}
      </text>

      <defs>
        <linearGradient id="VisDistanceLeftLane-grad1-advance" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={rectStyle1?.shapeFillColor} stopOpacity="1" />
          <stop offset="100%" stopColor={rectStyle2?.visible ? rectStyle2?.shapeFillColor : rectStyle1?.shapeFillColor} stopOpacity={rectStyle2?.visible ? "0" : "1"} />
        </linearGradient>

        <linearGradient id="VisDistanceLeftLane-grad1-return" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={rectStyle1?.shapeFillColor} stopOpacity="1" />
          <stop offset="100%" stopColor={rectStyle2?.visible ? rectStyle2?.shapeFillColor : rectStyle1?.shapeFillColor} stopOpacity={rectStyle2?.visible ? "0" : "1"} />
        </linearGradient>
      </defs>
      <rect x={laneData && svgWidth ? (laneData.direction === VALUEFrameDataDirection_advance
        ? "0" : `${(laneData.x_middle / VALUEHalfDistance) * svgWidth - x}`) : "0"} y="0"
        width={width} height={height}
        fill={laneData ? `url(#VisDistanceLeftLane-grad1-${laneData.direction})` : rectStyle1?.shapeFillColor}
        stroke={rectStyle1?.shapeStrokeColor}
        strokeWidth={rectStyle1?.shapeStrokeWidth}
        visibility={visibility && rectStyle1?.visible ? "visible" : "hidden"}
      />
    </g>
  )
}

export default VisDistanceLeftLane