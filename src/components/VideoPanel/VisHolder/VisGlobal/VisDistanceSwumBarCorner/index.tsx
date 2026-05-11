import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values";

interface VisDistanceSwumBarCornerProps {
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

function VisDistanceSwumBarCorner(props: VisDistanceSwumBarCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [value, setValue] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [valueStyle, setValueStyle] = useState<EditableElementType | undefined>()
  const [barStyle, setBarStyle] = useState<EditableElementType | undefined>()
  const [barBgStyle, setBarBgStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  // todo get distance sum from data
  const distanceSum = 100
  const barWidth = 83

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      setValue(leaderFrameData.distanceSwam)
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.distanceSwumBarCorner[0].id) {
        setValueStyle(e)
      } else if (e.id === editableElementInVisConfig.distanceSwumBarCorner[1].id) {
        setBarStyle(e)
      } else if (e.id === editableElementInVisConfig.distanceSwumBarCorner[2].id) {
        setBarBgStyle(e)
      } else if (e.id === editableElementInVisConfig.distanceSwumBarCorner[3].id) {
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
        width="97"
        height="27"
        x={`${bgStyle?.x ? bgStyle?.x + 0 : 0}`}
        y={`${bgStyle?.y ? bgStyle?.y + 0 : 0}`}
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"}/>

      <rect 
        x={`${barBgStyle?.x ? barBgStyle?.x + 7 : 7}`}
        y={`${barBgStyle?.y ? barBgStyle?.y + 18 : 18}`}
        width={barWidth}
        height="4"
        fill={barBgStyle?.shapeFillColor}
        stroke={barBgStyle?.shapeStrokeColor}
        strokeWidth={barBgStyle?.shapeStrokeWidth}
        visibility={visibility && barBgStyle?.visible ? "visible" : "hidden"}/>
      
      <rect
        x={`${barStyle?.x ? barStyle?.x + 7 : 7}`}
        y={`${barStyle?.y ? barStyle?.y + 18 : 18}`}
        width={barWidth * (value === null ? distanceSum : value / distanceSum)}
        height="4"
        fill={barStyle?.shapeFillColor}
        stroke={barStyle?.shapeStrokeColor}
        strokeWidth={barStyle?.shapeStrokeWidth}
        visibility={visibility && barStyle?.visible ? "visible" : "hidden"}/>

      <text
        x={`${valueStyle?.x ? valueStyle?.x + 90 : 90}`}
        y={`${valueStyle?.y ? valueStyle?.y + 13 : 13}`}
        textAnchor="end"
        style={{ fontFamily: 'OlympicStyle' }}
        fill={valueStyle?.fontFillColor}
        fontSize={valueStyle?.fontSize}
        visibility={visibility && valueStyle?.visible ? "visible" : "hidden"}
        >
        {`${value?.toFixed(2)} / ${distanceSum}`}
        <tspan fontSize={valueStyle?.fontSize ? valueStyle?.fontSize * (10 / 12) : DEFAULTSwimFlow2TextControllerFontSize}>M</tspan>
      </text>
    </g>
  )
}

export default VisDistanceSwumBarCorner