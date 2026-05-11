import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Col, Row, Select, Flex } from 'antd'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store"
import { LayerType } from '../../../types'

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

  return (
    <div ref={refChooseData}>
      <Row style={{ alignItems: "center", width: "200px", fontSize: "14px", fontWeight: 500, marginTop: "16px" }}>Data</Row>
      <Row style={{ height: "24px", lineHeight: "24px", marginTop: "20px" }}>
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
            options={[
              { value: 'elapsedTime', label: 'Elapsed Time' },
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
              { value: 'strokeCount', label: 'Stoke Count'},
            ]}
          />
        </Flex>
      </Row>
    </div>

  )
})

export default inject('store')(observer(DataSelectionPanel))