import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";

interface VisWorldRecordSplitDiffCornerProps {
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

function VisWorldRecordSplitDiffCorner(props: VisWorldRecordSplitDiffCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [worldRecordSplitDiff, setWorldRecordSplitDiff] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const [shape1Style, setShape1Style] = useState<EditableElementType | undefined>()
  const [shape2Style, setShape2Style] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      if (leaderFrameData.currentLap50 && leaderFrameData.world50) {
        setWorldRecordSplitDiff(leaderFrameData.currentLap50 - leaderFrameData.world50)
      }
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.worldRecordSplitDiffCorner[0].id) {
        setTextStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordSplitDiffCorner[1].id) {
        setShape1Style(e)
      } else if (e.id === editableElementInVisConfig.worldRecordSplitDiffCorner[2].id) {
        setShape2Style(e)
      }
    })

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      {
        worldRecordSplitDiff && worldRecordSplitDiff <= 0
          ? <rect 
              x={`${shape1Style?.x ? shape1Style?.x + 0 : 0}`}
              y={`${shape1Style?.y ? shape1Style?.y + 0 : 0}`}
              width="42"
              height="17"
              fill={shape1Style?.shapeFillColor}
              stroke={shape1Style?.shapeStrokeColor}
              strokeWidth={shape1Style?.shapeStrokeWidth}
              visibility={visibility && shape1Style?.visible ? "visible" : "hidden"} />
          : <rect
              x={`${shape2Style?.x ? shape2Style?.x + 0 : 0}`}
              y={`${shape2Style?.y ? shape2Style?.y + 0 : 0}`}
              width="42"
              height="17"
              fill={shape2Style?.shapeFillColor}
              stroke={shape2Style?.shapeStrokeColor}
              strokeWidth={shape2Style?.shapeStrokeWidth}
              visibility={visibility && shape2Style?.visible ? "visible" : "hidden"} />
      }

      <text
        x={`${textStyle?.x ? textStyle?.x + 20 : 20}`}
        y={`${textStyle?.y ? textStyle?.y + 13 : 13}`}
        style={{ fontFamily: 'OlympicStyle' }}
        fill={textStyle?.fontFillColor}
        fontSize={textStyle?.fontSize}
        textAnchor="middle"
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}
      >
        {worldRecordSplitDiff && worldRecordSplitDiff!==0 ? worldRecordSplitDiff.toFixed(2) : null}
      </text>
    </g>
  )
}

export default VisWorldRecordSplitDiffCorner