import { useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, Tooltip, Flex, Row, Divider } from 'antd'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../../store"
import { visControllerPanelConfig, visSelectionPanelTooltip } from '../../../utils/values';
import { EmbeddedVisType, LayerType } from '../../../types';
import { useTheme } from '../../../utils/theme';

interface VisSelectionPanelProps extends IComponentPropsWithStore {
  dataName: string | null,
  onVisSelect: (vis: EmbeddedVisType) => void,
  currentLayer: LayerType
}

const VisSelectionPanel = forwardRef((props: VisSelectionPanelProps, ref) => {
  const { dataName, onVisSelect, currentLayer } = props;
  const { mode } = useTheme();
  const refChooseVis = useRef(null)

  // The visIcon PNGs are pale-grey line drawings designed to read on a
  // dark button. In light mode the button surface is also pale, so the
  // unselected icons disappear. Use a muted mid-grey backdrop — dark
  // enough for the pale glyphs to register but quiet enough that it
  // doesn't outshout the selected (primary blue) button.
  const unselectedBgFix = mode === 'light' ? { background: '#8a8a8a', borderColor: '#8a8a8a' } : {}

  useImperativeHandle(ref, () => ({
    chooseVis: refChooseVis.current
  }))

  function handleVisClick(vis: EmbeddedVisType) {
    onVisSelect(vis)
  }

  return (
    <div ref={refChooseVis}>
      {
        dataName
          ?
          <>
            <Tooltip title="choose one visualization type" placement="left" open={currentLayer.embeddedVis?.visName ? false : true}>
              <Row style={{ alignItems: "center", width: "80px", fontSize: "14px", fontWeight: 500 }}>Visualization</Row>
            </Tooltip>
            <Row>
              <Flex style={{ marginTop: "10px" }} wrap gap={"middle"} justify={"flex-start"} align={"center"}>
                {visControllerPanelConfig[dataName].visList.map((v, i) => {
                  const isSelected = v.visName === currentLayer.embeddedVis?.visName
                  const selectedHighlight = isSelected ? {
                    boxShadow: '0 0 0 2px var(--my-theme-color), 0 4px 12px rgba(43, 171, 234, 0.35)',
                    transform: 'scale(1.06)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  } : {
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }
                  return <Tooltip title={visSelectionPanelTooltip[v.visName]} key={`vis-icon-btn-${i}`} placement="top">
                    <Button
                      size='middle'
                      style={{ display: "flex", alignItems: "center", padding: "4px 8px", ...(isSelected ? selectedHighlight : { ...unselectedBgFix, ...selectedHighlight }) }}
                      type={isSelected ? "primary" : "dashed"}
                      onClick={() => handleVisClick(v)}>
                      <img style={{ width: "22px" }} src={`./img/visIcon/${v.visIcon}`}></img>
                    </Button>
                  </Tooltip>
                })}
              </Flex>
            </Row>
            <Divider style={{ margin: "24px 0" }} />
          </>
          :
          null
      }

    </div>
  )
})

export default inject('store')(observer(VisSelectionPanel))