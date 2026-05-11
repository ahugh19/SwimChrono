import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values"
import { getFlagSVG } from "../../../../../utils"

interface VisRankingFlagLaneProps {
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

function VisRankingFlagLane(props: VisRankingFlagLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;

  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [rankingText, setRankingText] = useState<number | null>()
  const [rankingTextStyle, setRankingTextStyle] = useState<EditableElementType | undefined>()
  const [rankingBgStyle, setRankingBgStyle] = useState<EditableElementType | undefined>()
  const [nameTextStyle, setNameTextStyle] = useState<EditableElementType | undefined>()
  const [nameBgStyle, setNameBgStyle] = useState<EditableElementType | undefined>()
  const [flagIconStyle, setFlagIconStyle] = useState<EditableElementType | undefined>()
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [arriveAtEndCount, setArriveAtEndCount] = useState<number>(0)

  const textAdjustWidthPortion = 1.62

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex]) {
      if (Object.keys(_thisFrameLaneList).length === 8) {
        const sortedFrame = Object.entries(_thisFrameLaneList)
          .sort((a, b) => b[1].distanceSwam - a[1].distanceSwam).map((d) => d[1]);
        let rankingNum = 0
        sortedFrame.forEach((d, i) => {
          if (d.swimmerId === _thisFrameLaneList[laneIndex].swimmerId) {
            rankingNum = i + 1
          }
        })
        if (rankingNum <= 3) {
          setIsRendering(true)
          setRankingText(rankingNum)
          setLaneData(_thisFrameLaneList[laneIndex])

          editableElementList.forEach((e) => {
            if (e.id === editableElementInVisConfig.rankingFlagLane[0].id) {
              setRankingTextStyle(e)
            } else if (e.id === editableElementInVisConfig.rankingFlagLane[1].id) {
              setNameTextStyle(e)
            } else if (e.id === editableElementInVisConfig.rankingFlagLane[2].id) {
              setFlagIconStyle(e)
            } else if (e.id === editableElementInVisConfig.rankingFlagLane[3].id) {
              setRankingBgStyle(e)
            } else if (e.id === editableElementInVisConfig.rankingFlagLane[4].id) {
              setNameBgStyle(e)
            }
          })
        } else {
          setIsRendering(false)
        }
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
                      : (laneData.x_middle / VALUEHalfDistance) * svgWidth - x - 260)
                    : x
                  : x}
              ,
              ${svgHeight
                ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - DEFAULTSwimFlow2TextControllerFontSize
                : y}
              )
              rotate(${r})
              scale(${s / 100})`
            }
            visibility={visibility ? "visible" : "hidden"}
          >
            {/* <text fill={textStyle?.fontFillColor} fontSize={textStyle?.fontSize}>
        {contentText}
      </text> */}

            <rect x="216.25" y="0.25" width="30.5" height="30.5" fill={rankingBgStyle?.shapeFillColor} stroke={rankingBgStyle?.shapeStrokeColor} strokeWidth={rankingBgStyle?.shapeStrokeWidth} visibility={visibility && rankingBgStyle?.visible ? "visible" : "hidden"}/>
            <rect x="0.25" y="0.25" width="214.5" height="30.5" fill={nameBgStyle?.shapeFillColor} fillOpacity={nameBgStyle?.shapeFillOpacity} stroke={nameBgStyle?.shapeStrokeColor} strokeWidth={nameBgStyle?.shapeStrokeWidth} visibility={visibility && nameBgStyle?.visible ? "visible" : "hidden"}/>

            {
              laneData
                ? <>
                  <svg x="6" y="4" width="46" height="23" viewBox="0 0 46 23" visibility={visibility && flagIconStyle?.visible ? "visible" : "hidden"}>
                    <g dangerouslySetInnerHTML={{ __html: getFlagSVG(laneData?.nationality) }}></g>
                  </svg>
                  <text
                    x={`${nameTextStyle?.x ? nameTextStyle?.x + 210 : 210}`}
                    y={`${nameTextStyle?.y ? nameTextStyle?.y + 23 : 23}`}
                    style={{ fontFamily: 'OlympicStyle' }}
                    fill={nameTextStyle?.fontFillColor}
                    fontSize={nameTextStyle?.fontSize}
                    textLength={laneData.name.split(' ')[0].length * (nameTextStyle?.fontSize!! / textAdjustWidthPortion)}
                    lengthAdjust="spacing"
                    textAnchor="end"
                    visibility={visibility && nameTextStyle?.visible ? "visible" : "hidden"}
                  >
                    {laneData.name.split(' ')[0]}
                  </text>
                  <text
                    x={`${nameTextStyle?.x ? nameTextStyle?.x + 223 : 223}`}
                    y={`${nameTextStyle?.y ? nameTextStyle?.y + 25 : 25}`}
                    style={{ fontFamily: 'OlympicStyle' }}
                    fill={rankingTextStyle?.fontFillColor} fontSize={rankingTextStyle?.fontSize}
                    visibility={visibility && rankingTextStyle?.visible ? "visible" : "hidden"}>
                    {rankingText}
                  </text>
                </>
                : null
            }
          </g>
          :
          null
      }
    </>

  )
}

export default VisRankingFlagLane