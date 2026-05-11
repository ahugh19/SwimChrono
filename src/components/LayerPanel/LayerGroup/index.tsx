import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { VideoObjType, TriggerFormProps, VisIntervalType, LayerType } from '../../../types'
import styles from './index.module.less'
import { Button, Input, message } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, FieldTimeOutlined, CopyOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import TriggerDrawer from './TriggerDrawer'
import { useThemeColors } from "../../../utils/theme"
import { calIntervalByTrigger } from '../../../utils'
import { IComponentPropsWithStore } from "../../../store"
import { inject, observer } from "mobx-react"

interface LayerGroupProps extends IComponentPropsWithStore {

}

const LayerGroup = forwardRef((props: LayerGroupProps, ref) => {
  const { store } = props;
  const palette = useThemeColors()
  const uiBackgroundNormal = palette.background
  const uiBackgroundNormalInvisible = palette.backgroundElevated
  const uiBackgroundHighlight = palette.layerRowSelected
  const uiBackgroundHighlightInvisible = palette.layerRowSelectedInvisible

  const [layerList, setLayerList] = useState<LayerType[] | null>(null)
  const [isTriggerDrawerOpen, setIsTriggerDrawerOpen] = useState<boolean>(false);
  const refLayerGroupBtn = useRef(null)

  useImperativeHandle(ref, () => ({
    layerGroupBtn: refLayerGroupBtn.current
  }))

  useEffect(() => {
    if (!store) return
    setLayerList(store.layerList)
  }, [store?.layerList])

  function showDrawer() {
    setIsTriggerDrawerOpen(true);
  };

  function onDrawerClose(values: TriggerFormProps | null) {
    setIsTriggerDrawerOpen(false)
    if (!store?.currentVideoMetaData || !store.currentSwimmerVideo || !values) return
    const visIntervals = calIntervalByTrigger(store.currentVideoMetaData, store.currentSwimmerVideo, values)
    store.updateCurrentLayerVisIntervals(visIntervals, values.triggerCompList)
  };

  function onVisibleClick(e: any, index: number) {
    store?.setSelectedLayerIndex(index)
    store?.setLayerVisibility(index)
  }

  function onTriggerClick(e: any, index: number) {
    store?.setSelectedLayerIndex(index)
    if (layerList && (!layerList[index].embeddedVis)) {
      message.warning("Please select a visualization first.")
    } else if (layerList && layerList[index].embeddedVis) {
      showDrawer()
    }
  }

  function onCopyClick(e: any, index: number) {
    store?.setSelectedLayerIndex(index)
    store?.copyLayer(index)
  }

  function onChangeOrder(e: any, index: number, direction: string) {
    if (!store) return
    if (direction === "up" && index > 0) {
      // setLayerIndex(index - 1)
      store?.setSelectedLayerIndex(index - 1)
    } else if (direction === "down" && index < store.layerList.length - 1) {
      // setLayerIndex(index + 1)
      store?.setSelectedLayerIndex(index + 1)
    }
    store?.changeLayerOrder(index, direction)
  }

  function onDeleteClick(e: any, index: number) {
    // store?.setSelectedLayerIndex(index)
    store?.deleteLayer(index)
  }

  function onLayerInputChange(e: any, index: number) {
    store?.setSelectedLayerIndex(index)
    store?.setLayerName(index, e.target.value)
  }

  function onLayerInputClick(e: any, index: number) {
    store?.setSelectedLayerIndex(index)
  }

  return (
    <>
      {
        store
          ?
          store?.layerList?.map((layer, index) => {
            return <div className={styles.layerItemContainer}
              style={{
                backgroundColor: index === store.selectedLayerIndex ?
                  (layer.visibility ?
                    uiBackgroundHighlight :
                    uiBackgroundHighlightInvisible
                  ) :
                  (layer.visibility ?
                    uiBackgroundNormal :
                    uiBackgroundNormalInvisible
                  )
              }}
              key={`layer-${index}`}
              ref={index === 0 ? refLayerGroupBtn : null}
            >
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Set visibility" icon={layer.visibility ? <EyeOutlined /> : <EyeInvisibleOutlined />} onClick={(e) => onVisibleClick(e, index)}></Button>
              </div>
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Set triggers" icon={<FieldTimeOutlined />} onClick={(e) => onTriggerClick(e, index)}></Button>
              </div>
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Copy this layer" icon={<CopyOutlined />} onClick={(e) => onCopyClick(e, index)}></Button>
              </div>
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Move the layer up" icon={<ArrowUpOutlined />} onClick={(e) => onChangeOrder(e, index, "up")}></Button>
              </div>
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Move the layer down" icon={<ArrowDownOutlined />} onClick={(e) => onChangeOrder(e, index, "down")}></Button>
              </div>
              <div className={styles.controlBtn}>
                <Button size="small" type="link" title="Delete the layer" icon={<DeleteOutlined />} onClick={(e) => onDeleteClick(e, index)}></Button>
              </div>
              <Input className={styles.layerName} size="small" onClick={(e) => onLayerInputClick(e, index)} onChange={(e) => onLayerInputChange(e, index)} value={layer.name} />
            </div>
          })
          :
          null
      }
      {
        store && store.selectedLayerIndex !== null
          ?
          <TriggerDrawer
            onClose={onDrawerClose}
            isOpen={isTriggerDrawerOpen}
            currentLayer={layerList ? layerList[store.selectedLayerIndex] : null}
          />
          :
          null
      }
    </>
  )
})

export default inject('store')(observer(LayerGroup))