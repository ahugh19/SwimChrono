import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, VideoFrameDataType } from "../../../../../types";
import { VALUEHalfDistance, editableElementInVisConfig, DEFAULTSwimFlow2PositionXNoMove, DEFAULTSwimFlow2LaneSum, VALUEFrameDataDirection_advance, VALUEFrameDataDirection_return, DEFAULTSwimFlow2TextControllerFontSize } from "../../../../../utils/values"
import { getFlagSVG } from "../../../../../utils"

interface VisDistanceToLeaderPacManLaneProps {
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

function VisDistanceToLeaderPacManLane(props: VisDistanceToLeaderPacManLaneProps) {
  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, isMove, laneIndex, svgWidth, svgHeight, editableElementList, visibility } = props;

  const [isPacManRendering, setIsPacManRendering] = useState<boolean>(true)
  const [isDotRendering, setIsDotRendering] = useState<boolean>(true)
  const [circles, setCircles] = useState<any[]>([])
  const [currentLeaderLaneIndex, setCurrentLeaderLaneIndex] = useState<number>(0)
  const [pacManStyle, setPacManStyle] = useState<EditableElementType | undefined>()
  const [foodStyle, setFoodStyle] = useState<EditableElementType | undefined>()
  const [laneData, setLaneData] = useState<VideoFrameDataType | undefined>()
  const [width, setWidth] = useState<number>(0)
  const [dotR, setDotR] = useState<number>(5)

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

      if (_thisFrameLaneList && _thisFrameLaneList[0] && _thisFrameLaneList[_thisFrameLaneList[0].currentLeader]) {
        setCurrentLeaderLaneIndex(_thisFrameLaneList[0].currentLeader)
      }

      if (rankingNum === 1) {
        setLaneData(_thisFrameLaneList[laneIndex])
        setIsPacManRendering(true)
      } else {
        setIsPacManRendering(false)
      }

      if (rankingNum === 2) {
        const distanceRemaining = _thisFrameLaneList[laneIndex].distanceRemaining
        if (!svgWidth || distanceRemaining === null || distanceRemaining === undefined) return
        const count = distanceRemaining > VALUEHalfDistance ? distanceRemaining % VALUEHalfDistance : distanceRemaining;
        let circles = [];
        const unit = width / VALUEHalfDistance
        const foodFill = editableElementList.find((e) => e.id === editableElementInVisConfig.distanceToLeaderPacManLane[1].id)?.shapeFillColor ?? "#ffffff"
        const foodStroke = editableElementList.find((e) => e.id === editableElementInVisConfig.distanceToLeaderPacManLane[1].id)?.shapeStrokeColor
        const foodStrokeWidth = editableElementList.find((e) => e.id === editableElementInVisConfig.distanceToLeaderPacManLane[1].id)?.shapeStrokeWidth
        if (_thisFrameLaneList[laneIndex].direction === VALUEFrameDataDirection_advance) {
          for (let i = 0; i < count; i++) {
            circles.push(<circle key={`pac-man-dot-advance-${i}`} cx={`${unit * i}`} cy="0" r={`${dotR}`} fill={foodFill} stroke={foodStroke} strokeWidth={foodStrokeWidth} />)
          }
        } else {
          for (let i = 0; i < count; i++) {
            circles.push(<circle key={`pac-man-dot-back-${i}`} cx={`${width - unit * i}`} cy="0" r={`${dotR}`} fill={foodFill} stroke={foodStroke} strokeWidth={foodStrokeWidth} />)
          }
        }
        setCircles(circles)
        setIsDotRendering(true)
      } else {
        setIsDotRendering(false)
      }

      editableElementList.forEach((e) => {
        if (e.id === editableElementInVisConfig.distanceToLeaderPacManLane[0].id) {
          setPacManStyle(e)
        } else if (e.id === editableElementInVisConfig.distanceToLeaderPacManLane[1].id) {
          setFoodStyle(e)
        }
      })

    }
  }, [currentFrameIndex, currentSwimmerVideo, width, dotR])

  useEffect(() => {
    setWidth(svgWidth ? svgWidth * 100 / s : 0)
  }, [svgWidth, s])

  useEffect(() => {
    setDotR(5 * s / 100)
  }, [s])

  return (
    <>
      {
        isPacManRendering ?
          <g
            transform={
              `
              scale(${laneData && laneData.direction === VALUEFrameDataDirection_advance ? 1 : -1}, 1)
              translate(
                ${isMove
                ? laneData && svgWidth
                  ? (laneData.direction === VALUEFrameDataDirection_advance
                    ? x + (laneData.x_middle / VALUEHalfDistance) * svgWidth
                    : -((laneData.x_middle / VALUEHalfDistance) * svgWidth - x))
                  : x
                : DEFAULTSwimFlow2PositionXNoMove}
              ,
              ${svgHeight
                ? y + (laneIndex) * svgHeight / DEFAULTSwimFlow2LaneSum
                : y}
              )
              rotate(${r})
              scale(${s / 100})
              `
            }
            visibility={visibility ? "visible" : "hidden"}
          >
            {
              laneData
                ?
                <g transform="scale(-1, 1)" visibility={visibility && pacManStyle?.visible ? "visible" : "hidden"}>
                  <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <mask id="pacman-mask">
                          <rect width="100" height="100" fill="white" />
                          <path id="mouth" fill="black"
                            d="M50,50 L80,35 A30,30 0 0,1 80,65 Z">
                            <animate attributeName="d"
                              values="M50,50 L80,35 A30,30 0 0,1 80,65 Z;
                          M50,50 L80,50 A30,30 0 0,1 80,50 Z;
                          M50,50 L80,35 A30,30 0 0,1 80,65 Z"
                              dur="0.3s" repeatCount="indefinite" />
                          </path>
                        </mask>
                        <circle cx="50" cy="50" r="30"
                          fill={pacManStyle?.shapeFillColor ?? "yellow"}
                          stroke={pacManStyle?.shapeStrokeColor}
                          strokeWidth={pacManStyle?.shapeStrokeWidth}
                          mask="url(#pacman-mask)" />
                        <circle cx="60" cy="38" r="3" fill={pacManStyle?.shapeStrokeColor ?? "black"} />
                  </svg>
                </g>
                : null
            }
          </g>
          : null
      }
      {
        isDotRendering ?
          <g
            transform={
              `translate(0,
                  ${svgHeight
                ? y + (currentLeaderLaneIndex + 0.5) * svgHeight / DEFAULTSwimFlow2LaneSum
                : y}
                  )
                rotate(${r})
                scale(${s / 100})`
            }
            visibility={visibility && foodStyle?.visible ? "visible" : "hidden"}
          >
            {circles}
          </g>
          :
          null
      }
    </>
  )
}

export default VisDistanceToLeaderPacManLane