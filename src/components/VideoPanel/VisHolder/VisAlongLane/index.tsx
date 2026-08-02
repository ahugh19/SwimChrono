import VisAccelerationTextLane from "./VisAccelerationTextLane"
import VisCurrentSpeedTextLane from "./VisCurrentSpeedTextLane"
import VisCurrentSpeedGlyphLane from "./VIsCurrentSpeedGlyphLane"
import VisCustomizedIconLane from "./VisCustomizedIconLane"
import VisCustomizedTextLane from "./VisCustomizedTextLane"
import VisDistanceSwumTextLane from "./VisDistanceSwumTextLane"
import VisDistanceToLeaderTextLane from "./VisDistanceToLeaderTextLane"
import VisElapsedTimeLane from "./VisElapsedTimeLane"
import VisLaneHighlight from "./VisLaneHighlight"
import VisNationalityIconLane from "./VisNationalityIconLane"
import VisNationalityTextLane from "./VisNationalityTextLane"
import VisSwimmerNameTextLane from "./VisSwimmerNameTextLane"
import VisWorldRecordTextLane from "./VisWorldRecordTextLane"
import { LayerType, SwimmerInfoType, SwimmerVideoDataType, VisIntervalType } from "../../../../types"
import { embeddedVisTypeComposeType_INDIVIDUAL, VALUE_customizedIconIndividual, VALUE_elapsedTimeLane, VALUE_nationalityIconLane, VALUE_nationalityTextLane, VALUE_currentSpeedTextLane, VALUE_accelerationTextLane, VALUE_distanceSwumTextLane, VALUE_distanceToLeaderTextLane, VALUE_rankingTextLane, VALUE_swimmerNameTextLane, VALUE_worldRecordTextLane, VALUE_currentSpeedGlyphLane, VALUE_customizedTextIndividual, VALUE_laneHighlight, VALUE_rankingFlagLane, VALUE_distanceDivedTextLane, VALUE_distanceDivedArrowLane, VALUE_strokeCountTextLane, VALUE_distanceToLeaderBarLane, VALUE_top3SpeedLane, VALUE_top3DistanceGapLane, VALUE_distanceToLeaderPacManLane, VALUE_distanceLeftLane, VALUE_rankingChangeTextLane, VALUE_climbCount, VALUE_climbIcon } from "../../../../utils/values"
import { useEffect } from "react"
import VisRankingChangeTextLane from "./VisRankingChangeTextLane"
import VisRankingTextLane from "./VisRankingTextLane"
import VisRankingFlagLane from "./VisRankingFlagLane"
import VisDistanceDivedTextLane from "./VisDistanceDivedTextLane"
import VisDistanceDivedArrowLane from "./VisDistanceDivedArrowLane"
import VisStrokeCountTextLane from "./VisStrokeCountTextLane"
import VisDistanceToLeaderBarLane from "./VisDistanceToLeaderBarLane"
import VisTop3SpeedLane from "./VisTop3SpeedLane"
import VisTop3DistanceGapLane from "./VisTop3DistanceGapLane"
import VisDistanceToLeaderPacManLane from "./VisDistanceToLeaderPacManLane"
import VisDistanceLeftLane from "./VisDistanceLeftLane"
import VisClimbCount from "./VisClimbCount"
import VisClimbIcon from "./VisClimbIcon"

interface VisAlongLaneProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
  swimmersInfo: SwimmerInfoType[] | null | undefined,
  svgWidth: number | undefined,
  svgHeight: number | undefined
}

function VisAlongLane(props: VisAlongLaneProps) {
  const { layerList, currentSwimmerVideo, currentFrameIndex, swimmersInfo, svgHeight, svgWidth } = props;

  useEffect(() => {
    if (!currentSwimmerVideo) return

  }, [])

  function isCurrentFrameInIntervalList(intervalList: VisIntervalType[] | null) {
    if (!intervalList) return true // whole video duration
    for (const interval of intervalList) {
      if (currentFrameIndex >= interval.startFrame && currentFrameIndex <= interval.endFrame) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      {
        swimmersInfo?.map((swimmer, laneIndex) => {// swimmerId = laneIndex
          {
            return layerList.slice().reverse().map((layer, i) => {
              const embeddedVis = layer.embeddedVis
              if (!embeddedVis || embeddedVis.composeType !== embeddedVisTypeComposeType_INDIVIDUAL || !currentSwimmerVideo || !isCurrentFrameInIntervalList(layer.intervalList) || embeddedVis.visibleLanes && !embeddedVis.visibleLanes.includes(laneIndex)) return
              switch (embeddedVis.visName) {
                case VALUE_accelerationTextLane:
                  return <VisAccelerationTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_currentSpeedTextLane:
                  return <VisCurrentSpeedTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_currentSpeedGlyphLane:
                  return <VisCurrentSpeedGlyphLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_customizedTextIndividual:
                  return <VisCustomizedTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    customizedText={embeddedVis.customizedText}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_customizedIconIndividual:
                  return <VisCustomizedIconLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    customizedIcon={embeddedVis.customizedIcon}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceDivedArrowLane:
                  return <VisDistanceDivedArrowLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceDivedTextLane:
                  return <VisDistanceDivedTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceLeftLane:
                  return <VisDistanceLeftLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceSwumTextLane:
                  return <VisDistanceSwumTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceToLeaderBarLane:
                  return <VisDistanceToLeaderBarLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceToLeaderPacManLane:
                  return <VisDistanceToLeaderPacManLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_distanceToLeaderTextLane:
                  return <VisDistanceToLeaderTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_elapsedTimeLane:
                  return <VisElapsedTimeLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_laneHighlight:
                  return <VisLaneHighlight
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_nationalityTextLane:
                  return <VisNationalityTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_nationalityIconLane:
                  return <VisNationalityIconLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_rankingChangeTextLane:
                  return <VisRankingChangeTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_rankingTextLane:
                  return <VisRankingTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_rankingFlagLane:
                  return <VisRankingFlagLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_strokeCountTextLane:
                  return <VisStrokeCountTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_swimmerNameTextLane:
                  return <VisSwimmerNameTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_top3DistanceGapLane:
                  return <VisTop3DistanceGapLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_top3SpeedLane:
                  return <VisTop3SpeedLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_worldRecordTextLane:
                  return <VisWorldRecordTextLane
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_climbCount:
                  return <VisClimbCount
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
                case VALUE_climbIcon:
                  return <VisClimbIcon
                    key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
                    laneIndex={laneIndex}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    x={embeddedVis.positionXAndWidthRatio && svgWidth ? embeddedVis.positionXAndWidthRatio * svgWidth : embeddedVis.positionX}
                    y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
                    r={embeddedVis.positionR}
                    s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
                    isMove={embeddedVis.positionMove}
                    layerList={layerList}
                    currentSwimmerVideo={currentSwimmerVideo}
                    currentFrameIndex={currentFrameIndex}
                    editableElementList={embeddedVis.editableElementList}
                    visibility={layer.visibility}
                  />
              }
            })
          }
        })
      }
    </>
  )
}

export default VisAlongLane