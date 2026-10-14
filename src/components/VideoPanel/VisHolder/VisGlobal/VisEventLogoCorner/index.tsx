import { useEffect, useState } from "react";
import { SwimmerVideoDataType, EditableElementType, VideoMetaDataType, CustomizedIconType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";
import { eventLabel, isOlympic } from "../../../../../utils/raceInfo";
import { OLYMPIC_RINGS_SVG } from "./olympicRings";

interface VisEventLogoCornerProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  editableElementList: EditableElementType[],
  visibility: boolean,
  videoMetaData?: VideoMetaDataType | null,
  svgWidth?: number,
  // Optional custom svg replacing the built-in badge.
  customizedIcon?: CustomizedIconType,
}

// Event badge: the Olympic rings for an Olympic race, otherwise the name
// and year of the competition from the video's metadata.
function VisEventLogoCorner(props: VisEventLogoCornerProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, videoMetaData, svgWidth, customizedIcon } = props;
  const customSvg = customizedIcon?.svgContent
  const [opacity, setOpacity] = useState<number>(0)
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]
    setOpacity(frameList && frameList[0] && frameList[frameList[0].currentLeader] ? 1 : 0)
    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.eventLogoCorner[0].id) setBgStyle(e)
      else if (e.id === editableElementInVisConfig.eventLogoCorner[1].id) setTextStyle(e)
    })
  }, [currentFrameIndex, currentSwimmerVideo, editableElementList])

  const olympic = isOlympic(videoMetaData)
  const label = eventLabel(videoMetaData)
  const fontSize = textStyle?.fontSize ?? 7
  const width = olympic ? 40 : Math.max(40, Math.round(label.length * fontSize * 0.62) + 10)
  // The badge was placed for a 40px-wide logo; when the event name makes it
  // wider, grow it to the left so it stays inside the video.
  const overflow = svgWidth ? Math.max(0, x + width * (s / 100) - svgWidth) : 0
  const shiftX = overflow > 0 ? -Math.min(width - 40, overflow / (s / 100)) : 0

  if (customSvg) {
    return (
      <g
        opacity={opacity}
        transform={`translate(${x}, ${y}) scale(${s / 100}) scale(${customizedIcon?.size ?? 1}) rotate(${r})`}
        visibility={visibility && customizedIcon?.visible !== false ? "visible" : "hidden"}
      >
        <g dangerouslySetInnerHTML={{ __html: customSvg }} />
      </g>
    )
  }

  return (
    <g
      opacity={opacity}
      transform={`translate(${x + shiftX * (s / 100)}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x={bgStyle?.x ?? 0}
        y={bgStyle?.y ?? 0}
        width={width}
        height="16"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"} />
      {olympic
        ? <g dangerouslySetInnerHTML={{ __html: OLYMPIC_RINGS_SVG }} />
        : <text
          x={(textStyle?.x ?? 0) + width / 2}
          y={(textStyle?.y ?? 0) + 11}
          textAnchor="middle"
          style={{ fontFamily: 'OlympicStyle' }}
          fontSize={fontSize}
          fill={textStyle?.fontFillColor}
          visibility={visibility && textStyle?.visible ? "visible" : "hidden"}
        >{label}</text>}
    </g>
  )
}

export default VisEventLogoCorner
