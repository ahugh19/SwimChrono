import { LayerType, SwimmerVideoDataType } from "../../../../types"
import { embeddedVisTypeComposeType_GLOBAL } from "../../../../utils/values"
import { globalVisRegistry, isFrameInIntervals, resolveS, resolveX, resolveY } from "../visRegistry"

interface VisGlobalProps {
  layerList: LayerType[]
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
  svgWidth: number | undefined,
  svgHeight: number | undefined
}

// Renders each screen-anchored layer whose trigger interval contains the
// current frame.
function VisGlobal(props: VisGlobalProps) {
  const { layerList, currentSwimmerVideo, currentFrameIndex, svgWidth, svgHeight } = props;
  if (!currentSwimmerVideo) return null

  return (
    <>
      {layerList.map((layer, i) => {
        const embeddedVis = layer.embeddedVis
        if (!embeddedVis || embeddedVis.composeType !== embeddedVisTypeComposeType_GLOBAL) return null
        if (!isFrameInIntervals(currentFrameIndex, layer.intervalList)) return null
        const Vis = globalVisRegistry[embeddedVis.visName]
        if (!Vis) return null
        return <Vis
          key={`${layer.uuid}-layer-${i}`}
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
        />
      })}
    </>
  )
}

export default VisGlobal
