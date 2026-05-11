import { LayerType, SwimmerVideoDataType, SwimmerVideoFrameType, VideoFrameDataType, VisIntervalType } from "../../../../types"
import { embeddedVisTypeComposeType_GLOBAL, VALUE_customizedIconGlobal, VALUE_customizedTextGlobal, VALUE_distanceSwumTextCorner, VALUE_elapsedTimeCorner, VALUE_lapDistanceCorner, VALUE_olympicRecordCorner, VALUE_raceNameCorner, VALUE_rankingBarCorner, VALUE_worldRecordCorner, VALUE_worldRecordLine, VALUE_worldRecordSplitCorner, VALUE_worldRecordSplitDiffCorner, VALUE_leaderLaneNumberTextCorner, VALUE_distanceSwumBarCorner } from "../../../../utils/values";
import VisCustomizedIcon from "./VisCustomizedIcon";
import VisElapsedTimeCorner from "./VisElapsedTimeCorner";
import VisCustomizedText from "./VisCustomizedText";
import VisRankingBarCorner from "./VisRankingBarCorner";
import VisWorldRecordLine from "./VisWorldRecordLine";
import VisWorldRecordSplitCorner from "./VisWorldRecordSplitCorner";
import VisWorldRecordSplitDiffCorner from "./VisWorldRecordSplitDiffCorner";
import VisWorldRecordCorner from "./VisWorldRecordCorner";
import VisOlympicRecordCorner from "./VisOlympicRecordCorner";
import VisLapDistanceCorner from "./VisLapDistanceCorner";
import VisRaceNameCorner from "./VisRaceNameCorner";
import VisDistanceSwumTextCorner from "./VisDistanceSwumTextCorner";
import VisLeaderLaneNumberTextCorner from "./VisLeaderLaneNumberTextCorner";
import VisDistanceSwumBarCorner from "./VisDistanceSwumBarCorner";

interface VisGlobalProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined
}

function VisGlobal(props: VisGlobalProps) {

  const { layerList, currentSwimmerVideo, currentFrameIndex, svgWidth, svgHeight } = props;

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
      {layerList.map((layer, i) => {
        const embeddedVis = layer.embeddedVis
        if (!embeddedVis || embeddedVis.composeType !== embeddedVisTypeComposeType_GLOBAL || !currentSwimmerVideo || !isCurrentFrameInIntervalList(layer.intervalList)) return
        // console.log(embeddedVis.customizedText)
        switch (embeddedVis.visName) {
          case VALUE_customizedIconGlobal:
            return <VisCustomizedIcon
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              customizedIcon={embeddedVis.customizedIcon}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex} />
          case VALUE_customizedTextGlobal:
            return <VisCustomizedText
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              customizedText={embeddedVis.customizedText}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex} />
          case VALUE_distanceSwumTextCorner:
            return <VisDistanceSwumTextCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_distanceSwumBarCorner:
            return <VisDistanceSwumBarCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_elapsedTimeCorner:
            return <VisElapsedTimeCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex} />
          case VALUE_lapDistanceCorner:
            return <VisLapDistanceCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_leaderLaneNumberTextCorner:
            return <VisLeaderLaneNumberTextCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_olympicRecordCorner:
            return <VisOlympicRecordCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_raceNameCorner:
            return <VisRaceNameCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_rankingBarCorner:
            return <VisRankingBarCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex} />
          case VALUE_worldRecordCorner:
            return <VisWorldRecordCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_worldRecordSplitCorner:
            return <VisWorldRecordSplitCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_worldRecordSplitDiffCorner:
            return <VisWorldRecordSplitDiffCorner
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          case VALUE_worldRecordLine:
            return <VisWorldRecordLine
              key={`${layer.uuid}-layer-${i}`}
              visibility={layer.visibility}
              x={embeddedVis.positionXAndWidthRatio && svgWidth? embeddedVis.positionXAndWidthRatio * svgWidth :  embeddedVis.positionX}
              y={embeddedVis.positionYAndHeightRatio && svgHeight ? embeddedVis.positionYAndHeightRatio * svgHeight : embeddedVis.positionY}
              r={embeddedVis.positionR}
              s={embeddedVis.positionSRatio && svgWidth? embeddedVis.positionSRatio * svgWidth : embeddedVis.positionS}
              editableElementList={embeddedVis.editableElementList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight} />
          default:
            return null
        }
      })}
    </>
  )
}

export default VisGlobal