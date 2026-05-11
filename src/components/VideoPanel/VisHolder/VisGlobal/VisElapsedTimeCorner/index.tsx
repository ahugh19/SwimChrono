import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, VALUE_elapsedTimeCorner } from "../../../../../utils/values";

interface VisElapsedTimeCornerProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  editableElementList: EditableElementType[],
  visibility: boolean,
}

function VisElapsedTimeCorner(props: VisElapsedTimeCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility } = props;

  const [timeText, setTimeText] = useState<string>("")
  const [opacity, setOpacity] = useState<number>(0)
  const [timeValueStyle, setTimeValueStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      setTimeText(leaderFrameData.elapsed.toFixed(2) + " s")
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.elapsedTimeCorner[0].id) {
        setTimeValueStyle(e)
      } else if (e.id === editableElementInVisConfig.elapsedTimeCorner[1].id) {
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
        width="52"
        height="15"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"}
      />
      <text
        x={`${timeValueStyle?.x ? timeValueStyle?.x + 45 : 45}`}
        y={`${timeValueStyle?.y ? timeValueStyle?.y + 11 : 11}`}
        textAnchor="end"
        style={{ fontFamily: 'OlympicStyle, sans-serif' }}
        fill={timeValueStyle?.fontFillColor}
        fontSize={timeValueStyle?.fontSize} 
        visibility={visibility && timeValueStyle?.visible ? "visible" : "hidden"}
      >
        {timeText}
      </text>

    </g>
  )
}

export default VisElapsedTimeCorner