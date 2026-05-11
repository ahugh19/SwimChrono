import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, VALUEHalfDistance, VALUE_elapsedTimeCorner } from "../../../../../utils/values";
import { getFlagSVG, getNationAbbr } from "../../../../../utils"

interface VisRankingBarCornerProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  editableElementList: EditableElementType[],
  visibility: boolean,
}

function VisRankingBarCorner(props: VisRankingBarCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility } = props;

  const [top3Lanes, setTop3Lanes] = useState<(string | number | null | undefined)[]>([null, null, null])
  const [top3Nations, setTop3Nations] = useState<(string | null)[]>([null, null, null])
  const [top3Names, setTop3Names] = useState<(string | null)[]>([null, null, null])
  const [top3TimeDiff, setTop3TimeDiff] = useState<(string | null)[]>(["0", null, null])
  const [opacity, setOpacity] = useState<number>(0)
  const [bg1Style, setBg1Style] = useState<EditableElementType | undefined>()
  const [bg2Style, setBg2Style] = useState<EditableElementType | undefined>()
  const [text1Style, setText1Style] = useState<EditableElementType | undefined>()
  const [text2Style, setText2Style] = useState<EditableElementType | undefined>()
  const [text3Style, setText3Style] = useState<EditableElementType | undefined>()

  const topNumber = 3 // show top 3's ranking

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)

      const leaderFrameData = frameList[frameList[0].currentLeader]
      const sortedFrame = Object.entries(frameList)
        .sort((a, b) => b[1].distanceSwam - a[1].distanceSwam).map((d) => d[1]);

      for (let i = 0; i < topNumber; i++) {
        const thisFrame = sortedFrame[i]
        if (thisFrame) {
          const thisCurrentLap = thisFrame.distanceSwam - VALUEHalfDistance > 0 ? Math.ceil((thisFrame.distanceSwam - VALUEHalfDistance) / VALUEHalfDistance) : 0
          const lapKey = `currentLap${thisCurrentLap * VALUEHalfDistance}`

          setTop3TimeDiff((prevTimeDiffs) =>
            prevTimeDiffs.map((value, index) =>
              index === i
                //@ts-ignore
                ? ( thisFrame && leaderFrameData && thisFrame[lapKey] && leaderFrameData[lapKey] ? Math.abs(thisFrame[lapKey] - leaderFrameData[lapKey]).toFixed(2) : "")
                : value
            )
          );

          setTop3Lanes((prevLanes) =>
            prevLanes.map((value, index) =>
              index === i
                ? Object.entries(frameList).find(([key, value]) => value.name === thisFrame.name)?.[0] ? parseInt(Object.entries(frameList).find(([key, value]) => value.name === thisFrame.name)?.[0]!) + 1 : undefined
                : value
            )
          );

          setTop3Nations((prevNations) =>
            prevNations.map((value, index) =>
              index === i ? thisFrame.nationality : value
            )
          );

          setTop3Names((prevNames) =>
            prevNames.map((value, index) => {
              const nameList = thisFrame.name.split(" ")
              let lastName = ""
              if (Array.isArray(nameList)) {
                if (nameList.length > 0) {
                  lastName = nameList[0]
                }
              }
              if (index === i) {
                return lastName
              } else {
                return value
              }
            }

            )
          );

        }
      }
    } else {
      setOpacity(0)
    }


    setBg1Style(editableElementList.find((e) => e.id === editableElementInVisConfig.rankingBarCorner[0].id))
    setBg2Style(editableElementList.find((e) => e.id === editableElementInVisConfig.rankingBarCorner[1].id))
    setText1Style(editableElementList.find((e) => e.id === editableElementInVisConfig.rankingBarCorner[2].id))
    setText2Style(editableElementList.find((e) => e.id === editableElementInVisConfig.rankingBarCorner[3].id))
    setText3Style(editableElementList.find((e) => e.id === editableElementInVisConfig.rankingBarCorner[4].id))

  }, [currentFrameIndex, currentSwimmerVideo])

  function renderRow(index: number, baseY: number) {
    const flagSvgY = baseY + 2
    return (
      <g key={`ranking-row-${index}`}>
        <rect
          x={`${bg1Style?.x ?? 0}`}
          y={`${(bg1Style?.y ?? 0) + baseY}`}
          width="27" height="15"
          fill={bg1Style?.shapeFillColor}
          stroke={bg1Style?.shapeStrokeColor}
          strokeWidth={bg1Style?.shapeStrokeWidth}
          visibility={visibility && bg1Style?.visible ? "visible" : "hidden"} />
        <text
          x={`${(text1Style?.x ?? 0) + 11}`}
          y={`${(text1Style?.y ?? 0) + baseY + 11}`}
          fill={text1Style?.fontFillColor}
          fontSize={text1Style?.fontSize}
          visibility={visibility && text1Style?.visible ? "visible" : "hidden"}>
          {top3Lanes[index]}
        </text>
        <rect
          x={`${(bg2Style?.x ?? 0) + 27}`}
          y={`${(bg2Style?.y ?? 0) + baseY}`}
          width="165" height="15"
          fill={bg2Style?.shapeFillColor}
          stroke={bg2Style?.shapeStrokeColor}
          strokeWidth={bg2Style?.shapeStrokeWidth}
          visibility={visibility && bg2Style?.visible ? "visible" : "hidden"} />
        <svg x="54" y={flagSvgY} width="21" height="11" viewBox="0 0 21 11"
          visibility={visibility && bg2Style?.visible ? "visible" : "hidden"}>
          <g dangerouslySetInnerHTML={{ __html: getFlagSVG(top3Nations[index]) }}></g>
        </svg>
        <text
          x={`${(text2Style?.x ?? 0) + 33}`}
          y={`${(text2Style?.y ?? 0) + baseY + 11}`}
          fill={text2Style?.fontFillColor}
          fontSize={text2Style?.fontSize}
          visibility={visibility && text2Style?.visible ? "visible" : "hidden"}>
          {getNationAbbr(top3Nations[index])}
        </text>
        <text
          x={`${(text3Style?.x ?? 0) + 80}`}
          y={`${(text3Style?.y ?? 0) + baseY + 11}`}
          fill={text3Style?.fontFillColor}
          fontSize={text3Style?.fontSize}
          visibility={visibility && text3Style?.visible ? "visible" : "hidden"}>
          {top3Names[index]}
        </text>
        <text
          x={`${(text3Style?.x ?? 0) + 160}`}
          y={`${(text3Style?.y ?? 0) + baseY + 11}`}
          fill={text3Style?.fontFillColor}
          fontSize={text3Style?.fontSize}
          visibility={visibility && text3Style?.visible ? "visible" : "hidden"}>
          {index === 0 ? "" : (top3TimeDiff[index] ? `+${top3TimeDiff[index]}` : "")}
        </text>
      </g>
    )
  }

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      {
        top3TimeDiff[2] === null
          ? null
          : <>
            {renderRow(0, 0)}
            {renderRow(1, 16)}
            {renderRow(2, 32)}
          </>
      }

    </g>
  )
}

export default VisRankingBarCorner
