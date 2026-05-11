import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, VALUEHalfDistance, DEFAULT_VIDEO_PIXEL_WIDTH } from "../../../../../utils/values";
import { getFlagSVG, getNationAbbr, scaleConstantValue } from "../../../../../utils"

interface VisWorldRecordLineProps {
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

function VisWorldRecordLine(props: VisWorldRecordLineProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [worldRecordPos, setWorldRecordPos] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [shapeStyle, setShapeStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()
  const [lineStyle, setLineStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)

      const leaderFrameData = frameList[frameList[0].currentLeader]

      // leaderFrameData.x_world is in metres along the half-pool. Convert to
      // pixels using the live svgWidth, falling back to DEFAULT_VIDEO_PIXEL_WIDTH.
      setWorldRecordPos(Math.round(
        leaderFrameData.x_world / VALUEHalfDistance
        * (svgWidth ? svgWidth * 100 / s : DEFAULT_VIDEO_PIXEL_WIDTH)
      ))

    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.worldRecordLine[0].id) {
        setShapeStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordLine[1].id) {
        setBgStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordLine[2].id) {
        setLineStyle(e)
      }
    })

  }, [currentFrameIndex, currentSwimmerVideo, svgWidth, s])

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      <line
        x1={(worldRecordPos ? worldRecordPos : 0) + (lineStyle?.x ? lineStyle?.x + 0 : 0)}
        y1={0 + (lineStyle?.y ? lineStyle?.y + 0 : 0)}
        x2={(worldRecordPos ? worldRecordPos : 0) + (lineStyle?.x ? lineStyle?.x + 0 : 0)}
        y2={(svgHeight ? svgHeight * 100 / s : 100) + (lineStyle?.y ? lineStyle?.y + 0 : 0)}
        stroke={lineStyle?.shapeStrokeColor}
        strokeWidth={lineStyle?.shapeStrokeWidth}
        visibility={visibility && lineStyle?.visible ? "visible" : "hidden"} />

      <g
        transform={`translate(${worldRecordPos ? worldRecordPos - scaleConstantValue(18, s) : 0}, ${y})`}>
        <rect
          x={`${bgStyle?.x ?? 0}`}
          y={`${bgStyle?.y ?? 0}`}
          width="37"
          height="24"
          fill={bgStyle?.shapeFillColor}
          stroke={bgStyle?.shapeStrokeColor}
          strokeWidth={bgStyle?.shapeStrokeWidth}
          visibility={visibility && bgStyle?.visible ? "visible" : "hidden"} />
        <path
          d="M8.52046 19H4.68646L3.96646 6.4H7.36846V15.31L11.3105 6.4H14.8025L15.1445 15.292L18.6725 6.4H22.0925L16.3685 19H12.5165L12.1385 10.846L8.52046 19ZM29.8675 10.504C29.9275 10.204 29.9155 9.946 29.8315 9.73C29.7595 9.502 29.6095 9.328 29.3815 9.208C29.1535 9.088 28.8535 9.028 28.4815 9.028H26.0155L25.4395 11.998H27.9055C28.4575 11.998 28.8955 11.872 29.2195 11.62C29.5555 11.356 29.7715 10.984 29.8675 10.504ZM29.2195 6.4C30.2515 6.4 31.0735 6.592 31.6855 6.976C32.3095 7.348 32.7295 7.846 32.9455 8.47C33.1615 9.094 33.1975 9.772 33.0535 10.504C32.9215 11.176 32.6275 11.83 32.1715 12.466C31.7155 13.102 31.1035 13.624 30.3355 14.032C29.5675 14.428 28.6495 14.626 27.5815 14.626H24.9175L24.0355 19H20.9035L23.4235 6.4H29.2195ZM29.3815 13.546L31.5955 19H28.1395L26.1055 13.546H29.3815Z"
          fill={shapeStyle?.shapeFillColor}
          stroke={shapeStyle?.shapeStrokeColor}
          strokeWidth={shapeStyle?.shapeStrokeWidth}
          visibility={visibility && shapeStyle?.visible ? "visible" : "hidden"} />
      </g>
    </g>
  )
}

export default VisWorldRecordLine