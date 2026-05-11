import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values"
import { getFlagSVG, scaleConstantValue } from "../../../../../utils"

interface VisTop3DistanceGapLaneProps {
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

function VisTop3DistanceGapLane(props: VisTop3DistanceGapLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;

  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [distanceGapText, setDistanceGapText] = useState<string | number | null>()
  const [distanceGapTextStyle, setDistanceGapTextStyle] = useState<EditableElementType | undefined>()
  const [distanceGapBgStyle, setDistanceGapBgStyle] = useState<EditableElementType | undefined>()
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
        if (rankingNum === 1) {
          setDistanceGapText("LEADER")
        } else {
          setDistanceGapText(`+ ${_thisFrameLaneList[laneIndex].distanceToLeader.toFixed(1)}`)
        }

        setLaneData(_thisFrameLaneList[laneIndex])

        editableElementList.forEach((e) => {
          if (e.id === editableElementInVisConfig.top3DistanceGapLane[0].id) {
            setDistanceGapTextStyle(e)
          } else if (e.id === editableElementInVisConfig.top3DistanceGapLane[1].id) {
            setFlagIconStyle(e)
          } else if (e.id === editableElementInVisConfig.top3DistanceGapLane[2].id) {
            setDistanceGapBgStyle(e)
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
                    : (laneData.x_middle / VALUEHalfDistance) * svgWidth - x - scaleConstantValue(140, s))
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

            <rect x="0.25" y="0.25" width="120" height="30.5" fill="url(#paint_linear_top3_distance_gap_lane)" fillOpacity={distanceGapBgStyle?.shapeFillOpacity} stroke={distanceGapBgStyle?.shapeStrokeColor} strokeWidth={distanceGapBgStyle?.shapeStrokeWidth} visibility={visibility && distanceGapBgStyle?.visible ? "visible" : "hidden"}/>
            <defs>
              <linearGradient id="paint_linear_top3_distance_gap_lane" x1="0.25" y1="3.5" x2="120.25" y2="3.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.4" stopColor={distanceGapBgStyle?.shapeFillColor} stopOpacity="0.5" />
                <stop offset="1" stopColor={distanceGapBgStyle?.shapeFillColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {
              laneData
                ? <>
                  <svg x="0.5" y="4" width="46" height="23" viewBox="0 0 46 23">
                    <g visibility={visibility && flagIconStyle?.visible ? "visible" : "hidden"} dangerouslySetInnerHTML={{ __html: getFlagSVG(laneData?.nationality) }}></g>
                  </svg>
                  <text x={`${distanceGapTextStyle?.x ? distanceGapTextStyle?.x + 120 : 120}`} y={`${distanceGapTextStyle?.y ? distanceGapTextStyle?.y + 23 : 23}`} style={{ fontFamily: 'OlympicStyle' }}
                    fill={distanceGapTextStyle?.fontFillColor}
                    fontSize={distanceGapTextStyle?.fontSize}
                    textAnchor="end"
                    visibility={visibility && distanceGapTextStyle?.visible ? "visible" : "hidden"}
                  >
                    {distanceGapText}
                    {
                      distanceGapText === "LEADER" ?
                        null :
                        <tspan fontSize={distanceGapTextStyle?.fontSize ? distanceGapTextStyle?.fontSize * (10 / 12) : DEFAULTSwimFlow2TextControllerFontSize}>{` M`}</tspan>
                    }
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

export default VisTop3DistanceGapLane