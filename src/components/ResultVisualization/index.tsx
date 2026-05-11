import { useState, useEffect, useRef } from 'react'
import Statistics from './Statistics'
import TemporalInfo from './TemporalInfo'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"



interface ResultVisualizationProps extends IComponentPropsWithStore {

}

function ResultVisualization(props: ResultVisualizationProps) {
  const store = props.store as Store

  return (
    <div>
      <TemporalInfo />
      {/* <Statistics /> */}
    </div>
  )
}

export default inject('store')(observer(ResultVisualization))
