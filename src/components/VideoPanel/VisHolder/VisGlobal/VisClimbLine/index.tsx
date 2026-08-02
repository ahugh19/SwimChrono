import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig, VALUEClimbHeight, VALUEClimbVideoHeight, VALUEClimbVideoWidth, VALUEClimbWidth } from "../../../../../utils/values";
import { getFlagSVG, getNationAbbr, scaleConstantValue } from "../../../../../utils"

interface VisClimbLineProps {
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

function VisClimbLine(props: VisClimbLineProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [worldRecordPos, setWorldRecordPos] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [circleStyle, setCircleStyle] = useState<EditableElementType | undefined>()
  const [trialStyle, setTrialStyle] = useState<EditableElementType | undefined>()
  const [lineStyle, setLineStyle] = useState<EditableElementType | undefined>()
  const [milestones, setMilestones] = useState<any[]>()
  const [trials, setTrials] = useState<any[]>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)

      const leaderFrameData = frameList[frameList[0].currentLeader]

      // leaderFrameData.x_world: unit meter
      // need to transfer to pixel Math.round(recordPositionX / 50 * 1920)
      // console.log(leaderFrameData.x_world)

      // setWorldRecordPos(Math.round(leaderFrameData.x_world / 50 * (svgWidth ? svgWidth * 100 / s : 1920)))
      //@ts-ignore
      setMilestones(JSON.parse(leaderFrameData.milestones_before_ori))
      //@ts-ignore
      setTrials(JSON.parse(leaderFrameData.trail_ori))
      // console.log(leaderFrameData.milestones_before_ori, JSON.parse(leaderFrameData.milestones_before_ori))

    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.climbLine[0].id) {
        setCircleStyle(e)
      } else if (e.id === editableElementInVisConfig.climbLine[1].id) {
        setTrialStyle(e)
      } else if (e.id === editableElementInVisConfig.climbLine[2].id) {
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
      {
        svgWidth && svgHeight ?
          <polyline
            fill="none"
            stroke={lineStyle?.shapeStrokeColor}
            strokeWidth={lineStyle?.shapeStrokeWidth}
            points={
              milestones?.map(m =>
                `${m.eventY / VALUEClimbVideoHeight * svgWidth},
                ${svgHeight - m.eventX / VALUEClimbVideoWidth * svgHeight}`
              ).join(" ")
            }
            visibility={visibility && lineStyle?.visible ? "visible" : "hidden"}
          />
          : null
      }
      {
        svgWidth && svgHeight ?
          trials?.map(
            (m, i) =>
              <circle
                key={`climb-line-milestone-${i}`}
                cx={m.eventY / VALUEClimbVideoHeight * svgWidth}
                cy={svgHeight - m.eventX / VALUEClimbVideoWidth * svgHeight}
                r={4.5 * (i / 60)}
                fill={trialStyle?.shapeFillColor}
                opacity={i / 60}
                visibility={visibility && trialStyle?.visible ? "visible" : "hidden"}
                strokeWidth={trialStyle?.shapeStrokeWidth} />) :
          null
      }
      {
        svgWidth && svgHeight ?
          milestones?.map(
            (m, i) =>
              <circle
                key={`climb-line-trial-${i}`}
                cx={m.eventY / VALUEClimbVideoHeight * svgWidth}
                cy={svgHeight - m.eventX / VALUEClimbVideoWidth * svgHeight}
                r={5}
                fill={circleStyle?.shapeFillColor}
                stroke={circleStyle?.shapeStrokeColor}
                visibility={visibility && circleStyle?.visible ? "visible" : "hidden"}
                strokeWidth={circleStyle?.shapeStrokeWidth} />) :
          null
      }
    </g>
  )
}

export default VisClimbLine