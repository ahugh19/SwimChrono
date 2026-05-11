import CssController from "./CssController"
import IconController from "./IconController"
import EditableElementController from "./EditableElementController"
import PositionController from "./PositionController"
import ShapeController from "./ShapeController"
import TextController from "./TextController"
import VisSelectionPanel from "./VisSelectionPanel"
import DataSelectionPanel from "./DataSelectionPanel"
import CustomizedIconController from "./CustomizedIconPanel"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react"
import { EditableElementType, EmbeddedVisType, LayerType } from "../../types"
import { embeddedVisTypeComposeType_GLOBAL, embeddedVisTypeComposeType_INDIVIDUAL, editableElementInVisConfig, VALUE_customizedIconGlobal, VALUE_customizedIconIndividual } from "../../utils/values"
import LaneController from "./LaneController"
import { Row, Typography, Divider } from "antd"
import GlobalController from "./GlobalController"

const { Title, Text } = Typography

interface ControllerPanelProps extends IComponentPropsWithStore {

}

const ControllerPanel = forwardRef((props: ControllerPanelProps, ref) => {
  const { store } = props;
  const [dataName, setDataName] = useState<string | null>(null)
  const [currentLayer, setCurrentLayer] = useState<LayerType | null>(null)
  const [currentEditingElementId, setCurrentEditingElementId] = useState<string>("")
  const [editingElement, setEditingElement] = useState<EditableElementType | undefined>(undefined)
  const [editingMode, setEditingMode] = useState<string>("none")
  const [selectedVis, setSelectedVis] = useState<EmbeddedVisType | null>(null)
  const refControllerPanel = useRef<any>(null)
  const refChooseData = useRef<any>(null)
  const refChooseVis = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    controllerPanelComponent: refControllerPanel.current,
    controllerPanelChooseData: refChooseData.current?.chooseData,
    controllerPanelChooseVis: refChooseVis.current?.chooseVis
  }))

  useEffect(() => {
    if (!currentLayer || !currentLayer.embeddedVis) {
      setEditingElement(undefined)
    } else {
      setEditingElement(currentLayer.embeddedVis.editableElementList.find((e) => e.id === currentEditingElementId))
      if (currentEditingElementId.includes("text-")) {
        setEditingMode("text")
      } else if (currentEditingElementId.includes("shape-") || currentEditingElementId.includes("line-")) {
        setEditingMode("shape")
      } else if (currentEditingElementId.includes("icon-")) {
        setEditingMode("icon")
      } else if (currentEditingElementId.includes("color-")) {
        setEditingMode("color")
      } else {
        setEditingMode("default")
      }
    }
  }, [currentEditingElementId])

  useEffect(() => {
    if (!editingElement) return
    // console.log(JSON.parse(JSON.stringify(editingElement)))
  }, [editingElement])

  useEffect(() => {
    if (!store) return
    if (store.selectedLayerIndex === null) {
      setCurrentLayer(null)
    } else {
      setCurrentLayer(store.layerList[store.selectedLayerIndex])
    }
  }, [store?.selectedLayerIndex])

  useEffect(() => {
    if (!currentLayer || !currentLayer.embeddedVis) {
      setDataName(null)
    } else {
      setDataName(currentLayer.embeddedVis.dataName)
      setSelectedVis(currentLayer.embeddedVis)
    }
  }, [currentLayer])

  useEffect(() => {
    if (!currentLayer) return
    setEditingElement(undefined)
    setEditingMode("none")
    setCurrentEditingElementId("")
  }, [currentLayer?.name])

  function onBlurChange(blur: number) {
    store?.updateGlobalSettingBlur(blur)
  }

  function onMinDurationChange(minDuration: number) {
    store?.updateGlobalSettingMinDuration(minDuration)
  }

  function onDataSelect(dName: string) {
    setDataName(dName)
  }

  function onVisSelect(vis: EmbeddedVisType) {
    setSelectedVis(vis)
    store?.setSelectedLayerVis(vis)
  }

  function onXChange(x: number, xRatio: number | undefined) {
    store?.updateCurrentLayerVisPosX(x, xRatio)
  }

  function onYChange(y: number, yRatio: number | undefined) {
    store?.updateCurrentLayerVisPosY(y, yRatio)
  }

  function onRChange(r: number) {
    store?.updateCurrentLayerVisPosR(r)
  }

  function onSChange(s: number, sRatio: number | undefined) {
    store?.updateCurrentLayerVisPosS(s, sRatio)
  }

  function onMoveChange(isMove: boolean) {
    console.log(isMove)
    store?.updateCurrentLayerVisPosMove(isMove)
  }

  function onEditableElementSelect(elementId: string) {
    setCurrentEditingElementId(elementId)
    store?.updateEditingElementId(elementId)
  }

  function onShapeFillColorChange(hex: string) {
    store?.updateCurrentLayerVisShapeFillColor(hex)
  }

  function onShapeStrokeColorChange(hex: string) {
    store?.updateCurrentLayerVisShapeStrokeColor(hex)
  }

  function onShapeStrokeWidthChange(width: number) {
    store?.updateCurrentLayerVisShapeStrokeWidth(width)
  }

  function onShapeVisibilityChange(visible: boolean) {
    store?.updateCurrentLayerVisShapeVisibility(visible)
  }

  function onFontFillColorChange(hex: string) {
    store?.updateCurrentLayerVisFontFillColor(hex)
  }

  function onFontSizeChange(size: number) {
    store?.updateCurrentLayerVisFontSize(size)
  }

  function onFontTextContentChange(content: string) {
    store?.updateCurrentLayerVisFontTextContent(content)
  }

  function onFontVisibilityChange(visible: boolean) {
    store?.updateCurrentLayerVisFontVisibility(visible)
  }

  function onFontXChange(x: number) {
    store?.updateCurrentLayerVisFontX(x)
  }

  function onFontYChange(y: number) {
    store?.updateCurrentLayerVisFontY(y)
  }

  function onIconSizeChange(size: number) {
    store?.updateCurrentLayerVisIconSize(size)
  }

  function onIconVisibilityChange(visible: boolean) {
    store?.updateCurrentLayerVisIconVisibility(visible)
  }

  function onLaneChange(values: string[]) {
    store?.updateCurrentLayerLanes(values.map(Number))
  }

  function onSvgContentChange(svgContent: string) {
    store?.updateCurrentLayerVisSvgContent(svgContent)
  }

  function onCustomizedIconSizeChange(size: number) {
    store?.updateCurrentLayerCustomizedVisIconSize(size)
  }

  function onCustomizedIconVisibilityChange(visible: boolean) {
    store?.updateCurrentLayerCustomizedVisIconVisibility(visible)
  }

  return (

    <div ref={refControllerPanel}>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "16px", fontWeight: 600 }}>Controller Panel</Row>
      {
        store
          ? <GlobalController
            defaultBlur={store?.globalSetting.blur}
            defaultMinDuration={store?.globalSetting.minDuration}
            onBlurChange={onBlurChange}
            onMinDurationChange={onMinDurationChange}
          />
          : null
      }

      {
        currentLayer === null ?
          "Please select a layer first."
          :
          <>
            <DataSelectionPanel
              ref={refChooseData}
              currentLayer={currentLayer}
              onDataSelect={onDataSelect} />
            <Divider style={{ margin: "24px 0" }} />
            <VisSelectionPanel
              ref={refChooseVis}
              currentLayer={currentLayer}
              dataName={dataName}
              onVisSelect={onVisSelect} />

            {
              currentLayer.embeddedVis?.visName === VALUE_customizedIconGlobal || currentLayer.embeddedVis?.visName === VALUE_customizedIconIndividual
                ?
                <>
                  <CustomizedIconController
                    onCustomizedIconSizeChange={onCustomizedIconSizeChange}
                    onSvgContentChange={onSvgContentChange}
                    onCustomizedIconVisibilityChange={onCustomizedIconVisibilityChange}
                    defaultSize={currentLayer.embeddedVis?.customizedIcon?.size}
                    currentLayer={currentLayer}
                  />
                  <Divider style={{ margin: "24px 0" }} />
                </>
                :
                null
            }

            {
              currentLayer.embeddedVis?.composeType === embeddedVisTypeComposeType_INDIVIDUAL
                ?
                <>
                  <LaneController
                    swimmerInfo={store?.currentVideoMetaData?.swimmersInfo}
                    onLaneChange={onLaneChange}
                    selectedVis={selectedVis}
                    currentLayer={currentLayer}
                  />
                  <Divider style={{ margin: "24px 0" }} />
                </>
                :
                null
            }

            {
              store?.svgElement ?
                <>
                  <PositionController
                    maxX={store.svgElement.getBoundingClientRect().width}
                    maxY={currentLayer.embeddedVis?.composeType === embeddedVisTypeComposeType_GLOBAL ? store.svgElement.getBoundingClientRect().height : Math.ceil(store.svgElement.getBoundingClientRect().height / 8)}
                    svgWidth={store.svgElement.getBoundingClientRect().width}
                    svgHeight={store.svgElement.getBoundingClientRect().height}
                    defaultX={currentLayer.embeddedVis?.positionX}
                    defaultXAndWidthRatio={currentLayer.embeddedVis?.positionXAndWidthRatio}
                    defaultY={currentLayer.embeddedVis?.positionY}
                    defaultYAndHeightRatio={currentLayer.embeddedVis?.positionYAndHeightRatio}
                    defaultR={currentLayer.embeddedVis?.positionR}
                    defaultS={currentLayer.embeddedVis?.positionS}
                    defaultMove={currentLayer.embeddedVis?.positionMove}
                    disableMove={currentLayer.embeddedVis?.composeType === embeddedVisTypeComposeType_GLOBAL}
                    onXChange={onXChange}
                    onYChange={onYChange}
                    onRChange={onRChange}
                    onSChange={onSChange}
                    onMoveChange={onMoveChange}
                  />
                  <Divider style={{ margin: "24px 0" }} />

                  {currentLayer.embeddedVis?.visName !== VALUE_customizedIconGlobal && currentLayer.embeddedVis?.visName !== VALUE_customizedIconIndividual ?
                    <>
                      <EditableElementController
                        onEditableElementSelect={onEditableElementSelect}
                        currentLayer={currentLayer}
                      />
                      {/* <Divider style={{ margin: "24px 0" }} /> */}
                    </>
                    : null
                  }
                  <div style={{ height: 24, display: "block" }}></div>

                  {
                    editingMode === "shape" || editingMode === "color"
                      ?
                      <>
                        <ShapeController
                          editingElement={editingElement ? JSON.parse(JSON.stringify(editingElement)) : undefined}
                          onShapeFillColorChange={onShapeFillColorChange}
                          onShapeStrokeColorChange={onShapeStrokeColorChange}
                          onShapeStrokeWidthChange={onShapeStrokeWidthChange}
                          onShapeVisibilityChange={onShapeVisibilityChange}
                          strokeDisable={editingMode === "color"}
                        />
                        <Divider style={{ margin: "24px 0" }} />
                      </>
                      :
                      null
                  }

                  {
                    editingMode === "text" && currentLayer.embeddedVis?.visName !== VALUE_customizedIconGlobal && currentLayer.embeddedVis?.visName !== VALUE_customizedIconIndividual
                      ?
                      <>
                        <TextController
                          editingElement={editingElement ? JSON.parse(JSON.stringify(editingElement)) : undefined}
                          defaultTextContent={currentLayer.embeddedVis?.customizedText}
                          onFontColorChange={onFontFillColorChange}
                          onFontSizeChange={onFontSizeChange}
                          onFontTextContentChange={onFontTextContentChange} 
                          onFontVisibilityChange={onFontVisibilityChange}
                          onFontXChange={onFontXChange}
                          onFontYChange={onFontYChange}/>
                        <Divider style={{ margin: "24px 0" }} />
                      </>
                      :
                      null
                  }

                  {
                    editingMode === "icon"
                      ?
                      <>
                        <IconController
                          editingElement={editingElement ? JSON.parse(JSON.stringify(editingElement)) : undefined}
                          onIconSizeChange={onIconSizeChange}
                          onIconVisibilityChange={onIconVisibilityChange} />
                        <Divider style={{ margin: "24px 0" }} />
                      </>
                      :
                      null
                  }


                  <CssController />
                </>
                :
                "error when rendering svg element"
            }

          </>
      }

    </div>
  )
})

export default inject('store')(observer(ControllerPanel))