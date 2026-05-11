import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return } from "../../../../../utils/values"

interface SchemaProps {
  transform?: any,
  fill?: string,
  fontSize?: string,
}

interface VisRankingChangeTextLaneProps {
  layerList: LayerType[],
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  schema?: SchemaProps,
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

function VisRankingChangeTextLane(props: VisRankingChangeTextLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;
  const [contentText, setContentText] = useState<number>(0)
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const [arrowUpStyle, setArrowUpStyle] = useState<EditableElementType | undefined>()
  const [arrowDownStyle, setArrowDownStyle] = useState<EditableElementType | undefined>()
  const UP = "up"
  const DOWN = "down"
  const NOCHANGE = "NOCHANGE"
  const [rankingChangeStatus, setRankingChangeStatus] = useState<string>(NOCHANGE)
  const fontSize = 20;

  useEffect(() => {
    if (!currentSwimmerVideo || currentFrameIndex === 0) return
    const _thisFrameLaneList = currentSwimmerVideo[currentFrameIndex]
    const _lastFrameLaneList = currentSwimmerVideo[currentFrameIndex - 1]
    if (_thisFrameLaneList && _thisFrameLaneList[laneIndex] && _lastFrameLaneList && _lastFrameLaneList[laneIndex]) {
      const _thisSortedFrame = Object.entries(_thisFrameLaneList)
        .sort((a, b) => b[1].distanceSwam - a[1].distanceSwam).map((d) => d[1]);
      let _thisRankingNum = 0
      _thisSortedFrame.forEach((d, i) => {
        if (d.swimmerId === _thisFrameLaneList[laneIndex].swimmerId) {
          _thisRankingNum = i + 1
        }
      })

      const _lastSortedFrame = Object.entries(_lastFrameLaneList)
        .sort((a, b) => b[1].distanceSwam - a[1].distanceSwam).map((d) => d[1]);
      let _lastRankingNum = 0
      _lastSortedFrame.forEach((d, i) => {
        if (d.swimmerId === _lastFrameLaneList[laneIndex].swimmerId) {
          _lastRankingNum = i + 1
        }
      })

      if (_thisRankingNum < _lastRankingNum) {
        setRankingChangeStatus(UP)
      } else if (_thisRankingNum > _lastRankingNum) {
        setRankingChangeStatus(DOWN)
      }
      // else {
      //   setRankingChangeStatus(NOCHANGE)
      // }

      setContentText(_thisRankingNum)
      setLaneData(_thisFrameLaneList[laneIndex])
      setTextStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.rankingChangeTextLane[0].id
      ))
      setArrowUpStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.rankingChangeTextLane[1].id
      ))
      setArrowDownStyle(editableElementList.find(
        (e) => e.id === editableElementInVisConfig.rankingChangeTextLane[2].id
      ))
    }
  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    // frame[lane].x_middle / VALUEHalfDistance * svgLaneWidth
    <g
      transform={
        `translate(
        ${isMove
          ? laneData && svgWidth
            ? (laneData.direction === VALUEFrameDataDirection_advance
              ? x + (laneData.x_middle / VALUEHalfDistance) * svgWidth
              : (laneData.x_middle / VALUEHalfDistance) * svgWidth - x)
            : x
          : DEFAULTSwimFlow2PositionXNoMove}
        ,
        ${svgHeight
          ? y + (laneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum - fontSize
          : y}
          )
        rotate(${r})
        scale(${s / 100})`
      }
      visibility={visibility ? "visible" : "hidden"}
    >
      {
        contentText === 1 ?
          <></> :
          <>
            <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              {rankingChangeStatus === UP ?
              <g>
                <path
                  d="M6.50256 10.5001L1.65646 10.5001C1.50479 10.5002 1.35649 10.4554 1.23032 10.3712C1.10416 10.287 1.0058 10.1673 0.94769 10.0272C0.889581 9.88708 0.874335 9.73289 0.903879 9.58412C0.933423 9.43535 1.00643 9.29869 1.11366 9.19142L9.4366 0.869255C9.72414 0.5818 10.1141 0.420316 10.5207 0.420317C10.9272 0.420317 11.3172 0.5818 11.6047 0.869256L19.9269 9.19142C20.034 9.2986 20.107 9.43512 20.1366 9.58374C20.1662 9.73237 20.1511 9.88643 20.0932 10.0265C20.0352 10.1665 19.9371 10.2862 19.8112 10.3705C19.6853 10.4548 19.5372 10.4999 19.3856 10.5001L14.5403 10.5001L14.5403 19.6825C14.5403 20.0892 14.3787 20.4792 14.0912 20.7667C13.8036 21.0543 13.4136 21.2158 13.007 21.2158L8.03666 21.2158C7.63 21.2158 7.23999 21.0543 6.95243 20.7667C6.66488 20.4792 6.50333 20.0892 6.50333 19.6825L6.50333 10.5001L6.50256 10.5001Z"
                  fill={arrowUpStyle?.shapeFillColor ?? "#1fae4eff"}
                  stroke={arrowUpStyle?.shapeStrokeColor}
                  strokeWidth={arrowUpStyle?.shapeStrokeWidth}
                  visibility={visibility && arrowUpStyle?.visible ? "visible" : "hidden"} />
              </g> :
              <g>
                <path
                  d="M13.6488 11.1356H18.4949C18.6466 11.1355 18.7949 11.1804 18.921 11.2646C19.0472 11.3487 19.1456 11.4685 19.2037 11.6086C19.2618 11.7487 19.277 11.9029 19.2475 12.0516C19.2179 12.2004 19.1449 12.3371 19.0377 12.4443L10.7148 20.7665C10.4272 21.0539 10.0373 21.2154 9.6307 21.2154C9.22412 21.2154 8.83418 21.0539 8.54664 20.7665L0.224471 12.4443C0.117329 12.3371 0.0443532 12.2006 0.0147602 12.052C-0.0148328 11.9034 0.000284806 11.7493 0.0582035 11.6093C0.116122 11.4692 0.214244 11.3495 0.340174 11.2652C0.466104 11.1809 0.614194 11.1358 0.765737 11.1356H5.61107L5.61107 1.95325C5.61107 1.54659 5.77262 1.15658 6.06017 0.869025C6.34773 0.581469 6.73774 0.419922 7.1444 0.419922L12.1147 0.419922C12.5214 0.419922 12.9114 0.581469 13.1989 0.869025C13.4865 1.15658 13.648 1.54659 13.648 1.95325L13.648 11.1356H13.6488Z"
                  fill={arrowDownStyle?.shapeFillColor ?? "#a72424ff"}
                  stroke={arrowDownStyle?.shapeStrokeColor}
                  strokeWidth={arrowDownStyle?.shapeStrokeWidth}
                  visibility={visibility && arrowDownStyle?.visible ? "visible" : "hidden"} />
              </g>
            }
            </svg>
            <text
              x={`${textStyle?.x ? textStyle?.x + 25 : 25}`}
              y={`${textStyle?.y ? textStyle?.y + 20 : 20}`}
              style={{ fontFamily: 'OlympicStyle' }}
              fill={textStyle?.fontFillColor}
              fontSize={textStyle?.fontSize}
              visibility={visibility && textStyle?.visible ? "visible" : "hidden"}
            >
              {contentText}
            </text>
          </>
      }
    </g>
  )
}

export default VisRankingChangeTextLane