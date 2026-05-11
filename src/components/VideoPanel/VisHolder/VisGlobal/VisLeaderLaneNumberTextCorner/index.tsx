import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values";

interface VisLeaderLaneNumberTextCornerProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  editableElementList: EditableElementType[],
  visibility: boolean,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
}

function VisLeaderLaneNumberTextCorner(props: VisLeaderLaneNumberTextCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [value, setValue] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [valueStyle, setValueStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      setValue(leaderFrameData.currentLeader)
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.leaderLaneNumberTextCorner[0].id) {
        setValueStyle(e)
      } else if (e.id === editableElementInVisConfig.leaderLaneNumberTextCorner[1].id) {
        setBgStyle(e)
      }
    })

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x={`${bgStyle?.x ? bgStyle?.x + 0 : 0}`}
        y={`${bgStyle?.y ? bgStyle?.y + 0 : 0}`}
        width="17"
        height="17"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"} />
      <text
        x={`${valueStyle?.x ? valueStyle?.x + 8.5 : 8.5}`}
        y={`${valueStyle?.y ? valueStyle?.y + 12 : 12}`}
        textAnchor="middle"
        style={{ fontFamily: 'OlympicStyle' }}
        fill={valueStyle?.fontFillColor}
        fontSize={valueStyle?.fontSize}
        visibility={visibility && valueStyle?.visible ? "visible" : "hidden"}
      >
        {value}
      </text>
    </g>
  )
}

export default VisLeaderLaneNumberTextCorner