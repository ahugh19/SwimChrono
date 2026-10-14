import { LayerType, SwimmerInfoType, SwimmerVideoDataType, VideoMetaDataType } from "../../../../types"
import { embeddedVisTypeComposeType_INDIVIDUAL } from "../../../../utils/values"
import { isFrameInIntervals, laneVisRegistry, resolveS, resolveX, resolveY } from "../visRegistry"

interface VisAlongLaneProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
  swimmersInfo: SwimmerInfoType[] | null | undefined,
  svgWidth: number | undefined,
  svgHeight: number | undefined
  videoMetaData?: VideoMetaDataType | null
  raceStartFrame?: number
  // click-to-select support (optional so tests can omit it)
  selectedLayerUuid?: string
  onSelectLayer?: (uuid: string) => void
  selectableClassName?: string
  selectedClassName?: string
}

// Renders, for every lane, each visible per-lane layer whose trigger
// interval contains the current frame. Layer order is reversed so the
// first layer in the panel is painted last (on top).
function VisAlongLane(props: VisAlongLaneProps) {
  const { layerList, currentSwimmerVideo, currentFrameIndex, swimmersInfo, svgHeight, svgWidth, videoMetaData, raceStartFrame = 0, selectedLayerUuid, onSelectLayer, selectableClassName, selectedClassName } = props;
  if (!currentSwimmerVideo || !swimmersInfo) return null

  const orderedLayers = layerList.slice().reverse()

  return (
    <>
      {
        swimmersInfo.map((_swimmer, laneIndex) => // swimmerId = laneIndex
          orderedLayers.map((layer, i) => {
            const embeddedVis = layer.embeddedVis
            if (!embeddedVis || embeddedVis.composeType !== embeddedVisTypeComposeType_INDIVIDUAL) return null
            if (!isFrameInIntervals(currentFrameIndex, layer.intervalList, raceStartFrame)) return null
            if (embeddedVis.visibleLanes && !embeddedVis.visibleLanes.includes(laneIndex)) return null
            const Vis = laneVisRegistry[embeddedVis.visName]
            if (!Vis) return null
            const className = [selectableClassName, layer.uuid === selectedLayerUuid ? selectedClassName : ""].filter(Boolean).join(" ")
            return <g
              key={`lane-${laneIndex}-${layer.uuid}-layer-${i}`}
              className={className || undefined}
              data-layer-uuid={layer.uuid}
              onClick={(e) => { e.stopPropagation(); onSelectLayer?.(layer.uuid) }}
            ><Vis
              laneIndex={laneIndex}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              x={resolveX(embeddedVis, svgWidth)}
              y={resolveY(embeddedVis, svgHeight)}
              r={embeddedVis.positionR}
              s={resolveS(embeddedVis, svgWidth)}
              isMove={embeddedVis.positionMove}
              layerList={layerList}
              currentSwimmerVideo={currentSwimmerVideo}
              currentFrameIndex={currentFrameIndex}
              editableElementList={embeddedVis.editableElementList}
              customizedIcon={embeddedVis.customizedIcon}
              customizedText={embeddedVis.customizedText}
              videoMetaData={videoMetaData}
              laneCount={videoMetaData?.lanes}
              poolLength={videoMetaData?.poolLapLength}
              lapLength={videoMetaData?.poolLapLength}
              visibility={layer.visibility}
            /></g>
          })
        )
      }
    </>
  )
}

export default VisAlongLane
