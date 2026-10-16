import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Col, Row, Select, Flex } from 'antd'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store"
import { LayerType } from '../../../types'
import { sportOf } from '../../../utils/raceInfo'

// Data that only exists for one sport; everything else is swimming data.
const CLIMBING_DATA = new Set(['climb'])

const DATA_OPTIONS = [
  { value: 'elapsedTime', label: 'Elapsed Time' },
  { value: 'climb', label: 'Climb' },
  { value: 'nationality', label: 'Nationality' },
  { value: 'currentSpeed', label: 'Current Speed' },
  { value: 'worldRecord', label: 'World Record' },
  { value: 'olympicRecord', label: 'Olympic Record' },
  { value: 'differenceRecordAndLeader', label: 'Difference between Record and Leader' },
  { value: 'swimmerName', label: 'Swimmer Name' },
  { value: 'leaderLaneNumber', label: 'Leader Lane Number' },
  { value: 'distanceDived', label: 'Distance Dived' },
  { value: 'distanceSwum', label: 'Distance Swum' },
  { value: 'acceleration', label: 'Acceleration' },
  { value: 'distanceToLeader', label: 'Distance to Leader' },
  { value: 'ranking', label: 'Ranking' },
  { value: 'lapDistance', label: 'Lap Distance' },
  { value: 'raceName', label: 'Race Name' },
  { value: 'strokeCount', label: 'Stroke Count' },
]

interface DataSelectionPanelProps extends IComponentPropsWithStore {
  onDataSelect: (dName: string) => void,
  currentLayer: LayerType
}

const DataSelectionPanel = forwardRef((props: DataSelectionPanelProps, ref) => {
  const { store, onDataSelect, currentLayer } = props;
  const refChooseData = useRef(null)

  useImperativeHandle(ref, () =>({
    chooseData: refChooseData.current
  }))

  function handleChange(value: string) {
    onDataSelect(value)
  };

  // Data of the other sport stays listed but grayed out, like the examples.
  const videoSport = sportOf(store?.currentVideoMetaData)
  const options = DATA_OPTIONS.map((o) => {
    const dataSport = CLIMBING_DATA.has(o.value) ? "climbing" : "swimming"
    const fits = dataSport === videoSport
    return {
      ...o,
      disabled: !fits,
      title: fits ? o.label : `${o.label} is ${dataSport} data and does not apply to a ${videoSport} video`,
    }
  })

  return (
    <div ref={refChooseData}>
      <Row style={{ alignItems: "center", width: "200px", fontSize: "14px", fontWeight: 500, marginTop: "12px" }}>Data</Row>
      <Row style={{ height: "24px", lineHeight: "24px", marginTop: "8px" }}>
        <Flex style={{ width: "80%" }} vertical gap={"small"} justify={"flex-start"} align={"center"}>
          <Select
            style={{ width: "100%" }}
            showSearch
            size="small"
            placeholder="Select data to embed"
            onChange={handleChange}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={currentLayer.embeddedVis?.dataName}
            options={options}
          />
        </Flex>
      </Row>
    </div>

  )
})

export default inject('store')(observer(DataSelectionPanel))