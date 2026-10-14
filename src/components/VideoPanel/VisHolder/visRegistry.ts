// Registry mapping a layer's `visName` to the component that renders it.
// Adding a visualization means adding one line here (plus its editable
// elements in utils/values.tsx) instead of a new switch case.
import type { ComponentType } from "react"
import type { CustomizedIconType, EditableElementType, LayerType, SwimmerVideoDataType } from "../../../types"
import {
  VALUE_accelerationTextLane, VALUE_climbCount, VALUE_climbIcon, VALUE_climbLine,
  VALUE_currentSpeedGlyphLane, VALUE_currentSpeedTextLane, VALUE_customizedIconGlobal,
  VALUE_customizedIconIndividual, VALUE_customizedTextGlobal, VALUE_customizedTextIndividual,
  VALUE_distanceDivedArrowLane, VALUE_distanceDivedTextLane, VALUE_distanceLeftLane,
  VALUE_distanceSwumBarCorner, VALUE_distanceSwumTextCorner, VALUE_distanceSwumTextLane,
  VALUE_distanceToLeaderBarLane, VALUE_distanceToLeaderPacManLane, VALUE_distanceToLeaderTextLane,
  VALUE_elapsedTimeCorner, VALUE_elapsedTimeLane, VALUE_laneHighlight, VALUE_lapDistanceCorner,
  VALUE_leaderLaneNumberTextCorner, VALUE_nationalityIconLane, VALUE_nationalityTextLane,
  VALUE_olympicRecordCorner, VALUE_raceNameCorner, VALUE_rankingBarCorner, VALUE_rankingChangeTextLane,
  VALUE_rankingFlagLane, VALUE_rankingTextLane, VALUE_strokeCountTextLane, VALUE_swimmerNameTextLane,
  VALUE_top3DistanceGapLane, VALUE_top3SpeedLane, VALUE_worldRecordCorner, VALUE_worldRecordLine,
  VALUE_worldRecordSplitCorner, VALUE_worldRecordSplitDiffCorner, VALUE_worldRecordTextLane,
} from "../../../utils/values"

import VisAccelerationTextLane from "./VisAlongLane/VisAccelerationTextLane"
import VisCurrentSpeedTextLane from "./VisAlongLane/VisCurrentSpeedTextLane"
import VisCurrentSpeedGlyphLane from "./VisAlongLane/VIsCurrentSpeedGlyphLane"
import VisCustomizedIconLane from "./VisAlongLane/VisCustomizedIconLane"
import VisCustomizedTextLane from "./VisAlongLane/VisCustomizedTextLane"
import VisDistanceSwumTextLane from "./VisAlongLane/VisDistanceSwumTextLane"
import VisDistanceToLeaderTextLane from "./VisAlongLane/VisDistanceToLeaderTextLane"
import VisElapsedTimeLane from "./VisAlongLane/VisElapsedTimeLane"
import VisLaneHighlight from "./VisAlongLane/VisLaneHighlight"
import VisNationalityIconLane from "./VisAlongLane/VisNationalityIconLane"
import VisNationalityTextLane from "./VisAlongLane/VisNationalityTextLane"
import VisSwimmerNameTextLane from "./VisAlongLane/VisSwimmerNameTextLane"
import VisWorldRecordTextLane from "./VisAlongLane/VisWorldRecordTextLane"
import VisRankingChangeTextLane from "./VisAlongLane/VisRankingChangeTextLane"
import VisRankingTextLane from "./VisAlongLane/VisRankingTextLane"
import VisRankingFlagLane from "./VisAlongLane/VisRankingFlagLane"
import VisDistanceDivedTextLane from "./VisAlongLane/VisDistanceDivedTextLane"
import VisDistanceDivedArrowLane from "./VisAlongLane/VisDistanceDivedArrowLane"
import VisStrokeCountTextLane from "./VisAlongLane/VisStrokeCountTextLane"
import VisDistanceToLeaderBarLane from "./VisAlongLane/VisDistanceToLeaderBarLane"
import VisTop3SpeedLane from "./VisAlongLane/VisTop3SpeedLane"
import VisTop3DistanceGapLane from "./VisAlongLane/VisTop3DistanceGapLane"
import VisDistanceToLeaderPacManLane from "./VisAlongLane/VisDistanceToLeaderPacManLane"
import VisDistanceLeftLane from "./VisAlongLane/VisDistanceLeftLane"
import VisClimbCount from "./VisAlongLane/VisClimbCount"
import VisClimbIcon from "./VisAlongLane/VisClimbIcon"

import VisCustomizedIcon from "./VisGlobal/VisCustomizedIcon"
import VisElapsedTimeCorner from "./VisGlobal/VisElapsedTimeCorner"
import VisCustomizedText from "./VisGlobal/VisCustomizedText"
import VisRankingBarCorner from "./VisGlobal/VisRankingBarCorner"
import VisWorldRecordLine from "./VisGlobal/VisWorldRecordLine"
import VisWorldRecordSplitCorner from "./VisGlobal/VisWorldRecordSplitCorner"
import VisWorldRecordSplitDiffCorner from "./VisGlobal/VisWorldRecordSplitDiffCorner"
import VisWorldRecordCorner from "./VisGlobal/VisWorldRecordCorner"
import VisOlympicRecordCorner from "./VisGlobal/VisOlympicRecordCorner"
import VisLapDistanceCorner from "./VisGlobal/VisLapDistanceCorner"
import VisRaceNameCorner from "./VisGlobal/VisRaceNameCorner"
import VisDistanceSwumTextCorner from "./VisGlobal/VisDistanceSwumTextCorner"
import VisLeaderLaneNumberTextCorner from "./VisGlobal/VisLeaderLaneNumberTextCorner"
import VisDistanceSwumBarCorner from "./VisGlobal/VisDistanceSwumBarCorner"
import VisClimbLine from "./VisGlobal/VisClimbLine"

// Props shared by every per-lane visualization.
export interface LaneVisProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType
  currentFrameIndex: number
  x: number
  y: number
  r: number
  s: number
  isMove: boolean
  laneIndex: number
  svgWidth: number | undefined
  svgHeight: number | undefined
  editableElementList: EditableElementType[]
  customizedIcon?: CustomizedIconType
  customizedText?: string
  visibility: boolean
}

// Props shared by every global (screen-anchored) visualization. Components
// that don't need `customizedIcon` / `customizedText` simply ignore them.
export interface GlobalVisProps {
  visibility: boolean
  x: number
  y: number
  r: number
  s: number
  editableElementList: EditableElementType[]
  currentSwimmerVideo: SwimmerVideoDataType
  currentFrameIndex: number
  svgWidth: number | undefined
  svgHeight: number | undefined
  customizedIcon?: CustomizedIconType
  customizedText?: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const laneVisRegistry: Record<string, ComponentType<any>> = {
  [VALUE_accelerationTextLane]: VisAccelerationTextLane,
  [VALUE_currentSpeedTextLane]: VisCurrentSpeedTextLane,
  [VALUE_currentSpeedGlyphLane]: VisCurrentSpeedGlyphLane,
  [VALUE_customizedTextIndividual]: VisCustomizedTextLane,
  [VALUE_customizedIconIndividual]: VisCustomizedIconLane,
  [VALUE_distanceSwumTextLane]: VisDistanceSwumTextLane,
  [VALUE_distanceToLeaderTextLane]: VisDistanceToLeaderTextLane,
  [VALUE_distanceToLeaderBarLane]: VisDistanceToLeaderBarLane,
  [VALUE_distanceToLeaderPacManLane]: VisDistanceToLeaderPacManLane,
  [VALUE_distanceLeftLane]: VisDistanceLeftLane,
  [VALUE_distanceDivedTextLane]: VisDistanceDivedTextLane,
  [VALUE_distanceDivedArrowLane]: VisDistanceDivedArrowLane,
  [VALUE_elapsedTimeLane]: VisElapsedTimeLane,
  [VALUE_laneHighlight]: VisLaneHighlight,
  [VALUE_nationalityIconLane]: VisNationalityIconLane,
  [VALUE_nationalityTextLane]: VisNationalityTextLane,
  [VALUE_rankingChangeTextLane]: VisRankingChangeTextLane,
  [VALUE_rankingTextLane]: VisRankingTextLane,
  [VALUE_rankingFlagLane]: VisRankingFlagLane,
  [VALUE_strokeCountTextLane]: VisStrokeCountTextLane,
  [VALUE_swimmerNameTextLane]: VisSwimmerNameTextLane,
  [VALUE_top3DistanceGapLane]: VisTop3DistanceGapLane,
  [VALUE_top3SpeedLane]: VisTop3SpeedLane,
  [VALUE_worldRecordTextLane]: VisWorldRecordTextLane,
  [VALUE_climbCount]: VisClimbCount,
  [VALUE_climbIcon]: VisClimbIcon,
}

export const globalVisRegistry: Record<string, ComponentType<any>> = {
  [VALUE_customizedIconGlobal]: VisCustomizedIcon,
  [VALUE_customizedTextGlobal]: VisCustomizedText,
  [VALUE_distanceSwumTextCorner]: VisDistanceSwumTextCorner,
  [VALUE_distanceSwumBarCorner]: VisDistanceSwumBarCorner,
  [VALUE_elapsedTimeCorner]: VisElapsedTimeCorner,
  [VALUE_lapDistanceCorner]: VisLapDistanceCorner,
  [VALUE_leaderLaneNumberTextCorner]: VisLeaderLaneNumberTextCorner,
  [VALUE_olympicRecordCorner]: VisOlympicRecordCorner,
  [VALUE_raceNameCorner]: VisRaceNameCorner,
  [VALUE_rankingBarCorner]: VisRankingBarCorner,
  [VALUE_worldRecordCorner]: VisWorldRecordCorner,
  [VALUE_worldRecordSplitCorner]: VisWorldRecordSplitCorner,
  [VALUE_worldRecordSplitDiffCorner]: VisWorldRecordSplitDiffCorner,
  [VALUE_worldRecordLine]: VisWorldRecordLine,
  [VALUE_climbLine]: VisClimbLine,
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Position helpers shared by both holders: ratios (relative to the video
// size) win over absolute pixel values when they are present.
export function resolveX(vis: { positionX: number; positionXAndWidthRatio?: number }, svgWidth: number | undefined) {
  return vis.positionXAndWidthRatio && svgWidth ? vis.positionXAndWidthRatio * svgWidth : vis.positionX
}
export function resolveY(vis: { positionY: number; positionYAndHeightRatio?: number }, svgHeight: number | undefined) {
  return vis.positionYAndHeightRatio && svgHeight ? vis.positionYAndHeightRatio * svgHeight : vis.positionY
}
export function resolveS(vis: { positionS: number; positionSRatio?: number }, svgWidth: number | undefined) {
  return vis.positionSRatio && svgWidth ? vis.positionSRatio * svgWidth : vis.positionS
}

// Layers without triggers ("whole race") are shown from the race start to
// the end of the video, matching the bar drawn on the timeline.
export function isFrameInIntervals(frameIndex: number, intervalList: { startFrame: number; endFrame: number }[] | null, raceStartFrame = 0) {
  if (!intervalList) return frameIndex >= raceStartFrame
  for (const interval of intervalList) {
    if (frameIndex >= interval.startFrame && frameIndex <= interval.endFrame) return true
  }
  return false
}
