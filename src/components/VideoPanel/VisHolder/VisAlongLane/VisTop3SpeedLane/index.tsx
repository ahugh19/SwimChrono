import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values"
import { getFlagSVG } from "../../../../../utils"

interface VisTop3SpeedLaneProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
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

function VisTop3SpeedLane(props: VisTop3SpeedLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;

  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [speedText, setSpeedText] = useState<number | null>()
  const [speedTextStyle, setSpeedTextStyle] = useState<EditableElementType | undefined>()
  const [speedBgStyle, setSpeedBgStyle] = useState<EditableElementType | undefined>()
  const [flagIconStyle, setFlagIconStyle] = useState<EditableElementType | undefined>()
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()

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
      if (rankingNum <= 3 && _thisFrameLaneList[laneIndex].distanceRemaining > 2) {
        setIsRendering(true)
        setSpeedText(_thisFrameLaneList[laneIndex].speed)
        setLaneData(_thisFrameLaneList[laneIndex])

        editableElementList.forEach((e) => {
          if (e.id === editableElementInVisConfig.top3SpeedLane[0].id) {
            setSpeedTextStyle(e)
          } else if (e.id === editableElementInVisConfig.top3SpeedLane[1].id) {
            setFlagIconStyle(e)
          } else if (e.id === editableElementInVisConfig.top3SpeedLane[2].id) {
            setSpeedBgStyle(e)
          }
        })
      } else {
        setIsRendering(false)
      }
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <>
      {
        isRendering ?
          <g
            transform={
              `translate(
                ${isMove
                  ? laneData && svgWidth
                    ? (laneData.direction === VALUEFrameDataDirection_advance
                      ? x + (laneData.x_middle / VALUEHalfDistance) * svgWidth
                      : (laneData.x_middle / VALUEHalfDistance) * svgWidth - x - 140 * s / 100)
                    : x
                : DEFAULTSwimFlow2PositionXNoMove}
              ,
              ${svgHeight
                ? y + (laneIndex) * svgHeight / DEFAULTSwimFlow2LaneSum
                : y}
              )
              rotate(${r})
              scale(${s / 100})`
                  }
            visibility={visibility ? "visible" : "hidden"}
          >

            <rect x="0.25" y="0.25" width="120" height="30.5" fill="url(#paint_linear_top3_speed_lane)" fillOpacity={speedBgStyle?.shapeFillOpacity} stroke={speedBgStyle?.shapeStrokeColor} strokeWidth={speedBgStyle?.shapeStrokeWidth} visibility={visibility && speedBgStyle?.visible ? "visible" : "hidden"}/>
            <defs>
              <linearGradient id="paint_linear_top3_speed_lane" x1="0.25" y1="3.5" x2="120.25" y2="3.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.4" stopColor={speedBgStyle?.shapeFillColor} stopOpacity="0.5" />
                <stop offset="1" stopColor={speedBgStyle?.shapeFillColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {
              laneData
                ? <>
                  <svg x="0.5" y="4" width="46" height="23" viewBox="0 0 46 23">
                    <g visibility={visibility && flagIconStyle?.visible ? "visible" : "hidden"} dangerouslySetInnerHTML={{ __html: getFlagSVG(laneData?.nationality) }}></g>
                  </svg>
                  <text
                    x={`${speedTextStyle?.x ? speedTextStyle?.x + 120 : 120}`}
                    y={`${speedTextStyle?.y ? speedTextStyle?.y + 23 : 23}`}
                    style={{ fontFamily: 'OlympicStyle' }}
                    fill={speedTextStyle?.fontFillColor}
                    fontSize={speedTextStyle?.fontSize}
                    textAnchor="end"
                    visibility={visibility && speedTextStyle?.visible ? "visible" : "hidden"}
                  >
                    {speedText}
                    <tspan fontSize={speedTextStyle?.fontSize ? speedTextStyle?.fontSize * (10 / 12) : DEFAULTSwimFlow2TextControllerFontSize}>{` M/S`}</tspan>
                  </text>
                </>
                : null
            }
          </g >
          :
          null
      }
    </>
  )
}

export default VisTop3SpeedLane