import VisAlongLane from "./VisAlongLane"
import { DEFAULTSwimFlow2GLOBAL_blur } from "../../../utils/values"
import VisGlobal from "./VisGlobal"
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store"
import { useEffect, useState, useRef } from "react"
import { LayerType, SwimmerVideoFrameType, SwimmerVideoDataType } from "../../../types"

interface VisHolderProps extends IComponentPropsWithStore {
  svgWidth: number | undefined,
  svgHeight: number | undefined,
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined
  currentFrameIndex: number,
}

function VisHolder(props: VisHolderProps) {
  const { store, svgWidth, svgHeight, currentSwimmerVideo, currentFrameIndex } = props;

  const [layerList, setLayerList] = useState<LayerType[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const selectedLayerUuid = store && store.selectedLayerIndex !== null ? store.layerList[store.selectedLayerIndex]?.uuid : undefined
  const onSelectLayer = (uuid: string) => store?.selectLayerByUuid(uuid)
  const meta = store?.currentVideoMetaData
  const raceStartFrame = meta ? Math.round(meta.raceStartTime * meta.framerate) : 0

  useEffect(() => {
    store?.setSvgElement(svgRef.current)
  }, [])

  useEffect(() => {
    if (!store) return
    const reverseLayerList = [...store?.layerList]
    reverseLayerList.reverse()
    setLayerList(reverseLayerList)
  }, [store?.layerList])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${svgWidth ? svgWidth : 0} ${svgHeight ? svgHeight : 0}`} ref={svgRef} style={{ pointerEvents: "none" }}>
      <defs>
        <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={`${store && store.globalSetting.blur !== null ? store.globalSetting.blur : DEFAULTSwimFlow2GLOBAL_blur}`} />
        </filter>
      </defs>

      <g filter="url(#blurFilter)">
        <VisAlongLane
          layerList={layerList}
          swimmersInfo={store?.currentVideoMetaData?.swimmersInfo}
          currentSwimmerVideo={currentSwimmerVideo}
          currentFrameIndex={currentFrameIndex}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          raceStartFrame={raceStartFrame}
          videoMetaData={meta}
          selectedLayerUuid={selectedLayerUuid}
          onSelectLayer={onSelectLayer}
          selectableClassName={styles.selectable}
          selectedClassName={styles.selected}
        />
      </g>

      <g filter="url(#blurFilter)">
        <VisGlobal
          layerList={layerList}
          currentSwimmerVideo={currentSwimmerVideo}
          currentFrameIndex={currentFrameIndex}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          raceStartFrame={raceStartFrame}
          videoMetaData={meta}
          selectedLayerUuid={selectedLayerUuid}
          onSelectLayer={onSelectLayer}
          selectableClassName={styles.selectable}
          selectedClassName={styles.selected}
        />
      </g>
    </svg>
  )
}

export default inject('store')(observer(VisHolder))