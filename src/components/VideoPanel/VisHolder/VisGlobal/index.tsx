import { LayerType, SwimmerVideoDataType } from "../../../../types"
import { embeddedVisTypeComposeType_GLOBAL } from "../../../../utils/values"
import { globalVisRegistry, isFrameInIntervals, resolveS, resolveX, resolveY } from "../visRegistry"

interface VisGlobalProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined
  // click-to-select support (optional so tests can omit it)
  selectedLayerUuid?: string
  onSelectLayer?: (uuid: string) => void
  selectableClassName?: string
  selectedClassName?: string
}

// Renders each screen-anchored layer whose trigger interval contains the
// current frame.
function VisGlobal(props: VisGlobalProps) {
  const { layerList, currentSwimmerVideo, currentFrameIndex, svgWidth, svgHeight, selectedLayerUuid, onSelectLayer, selectableClassName, selectedClassName } = props;
  if (!currentSwimmerVideo) return null

  return (
    <>
      {layerList.map((layer, i) => {
        const embeddedVis = layer.embeddedVis
        if (!embeddedVis || embeddedVis.composeType !== embeddedVisTypeComposeType_GLOBAL) return null
        if (!isFrameInIntervals(currentFrameIndex, layer.intervalList)) return null
        const Vis = globalVisRegistry[embeddedVis.visName]
        if (!Vis) return null
        const className = [selectableClassName, layer.uuid === selectedLayerUuid ? selectedClassName : ""].filter(Boolean).join(" ")
        return <g
          key={`${layer.uuid}-layer-${i}`}
          className={className || undefined}
          data-layer-uuid={layer.uuid}
          onClick={(e) => { e.stopPropagation(); onSelectLayer?.(layer.uuid) }}
        ><Vis
          visibility={layer.visibility}
          x={resolveX(embeddedVis, svgWidth)}
          y={resolveY(embeddedVis, svgHeight)}
          r={embeddedVis.positionR}
          s={resolveS(embeddedVis, svgWidth)}
          editableElementList={embeddedVis.editableElementList}
          customizedIcon={embeddedVis.customizedIcon}
          customizedText={embeddedVis.customizedText}
          currentSwimmerVideo={currentSwimmerVideo}
          currentFrameIndex={currentFrameIndex}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        /></g>
      })}
    </>
  )
}

export default VisGlobal
