import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, DEFAULTSwimFlow2LapDistance, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values";

interface VisRaceNameCornerProps {
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

function VisRaceNameCorner(props: VisRaceNameCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [gender, setGender] = useState<string | null>(null)
  const [distance, setDistance] = useState<string | null>(null)
  const [swimmingStyle, setSwimmingStyle] = useState<string | null>(null)
  const [raceLevel, setRaceLevel] = useState<string | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [valueStyle, setValueStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      //todo: load race name from data
      // setGender("M")
      // setDistance("100")
      // setSwimmingStyle("back")
      // setRaceLevel("F")
      // setGender("M")
      // setDistance("200")
      // setSwimmingStyle("mix")
      // setRaceLevel("F")
      setGender("F")
      setDistance("100")
      setSwimmingStyle("breast")
      setRaceLevel("F")
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.raceNameCorner[0].id) {
        setValueStyle(e)
      } else if (e.id === editableElementInVisConfig.raceNameCorner[1].id) {
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
        width="97"
        height="15"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"}/>
      <text
        x={`${valueStyle?.x ? valueStyle?.x + 45 : 45}`}
        y={`${valueStyle?.y ? valueStyle?.y + 11 : 11}`}
        textAnchor="middle"
        style={{ fontFamily: 'OlympicStyle' }}
        fill={valueStyle?.fontFillColor}
        fontSize={valueStyle?.fontSize}
        visibility={visibility && valueStyle?.visible ? "visible" : "hidden"}
      >
        {`${gender} ${distance}`}
        <tspan fontSize={valueStyle?.fontSize ? valueStyle?.fontSize * (10 / 12) : DEFAULTSwimFlow2TextControllerFontSize}>M</tspan>
        {` ${swimmingStyle?.[0].toUpperCase()}`}
        <tspan fontSize={valueStyle?.fontSize ? valueStyle?.fontSize * (10 / 12) : DEFAULTSwimFlow2TextControllerFontSize}>{`${swimmingStyle?.slice(1).toUpperCase()} `}</tspan>
        {`${raceLevel}`}
      </text>
    </g>
  )
}

export default VisRaceNameCorner