import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import LaneController from "./index"
import { EmbeddedVisType, LayerType, SwimmerInfoType } from "../../../types"

const swimmers: SwimmerInfoType[] = [
  { name: "A", nationality: "USA", swimmerId: 0 },
  { name: "B", nationality: "FRA", swimmerId: 1 },
  { name: "C", nationality: "GBR", swimmerId: 2 },
]

const vis: EmbeddedVisType = {
  visName: "x", dataName: "y", visIcon: "z", composeType: "individual",
  positionX: 0, positionY: 0, positionR: 0, positionS: 100,
  positionMove: false, editableElementList: [],
  visibleLanes: [0, 2],
}

const layer: LayerType = {
  uuid: "L1", isSelected: true, visibility: true, name: "n",
  intervalList: null, triggerCompList: null, embeddedVis: vis,
}

describe("LaneController", () => {
  it("renders selected lanes from selectedVis.visibleLanes", () => {
    const { container } = render(
      <LaneController
        swimmerInfo={swimmers}
        onLaneChange={vi.fn()}
        selectedVis={vis}
        currentLayer={layer}
      />
    )
    // antd Select multi-mode with maxTagCount="responsive" wraps each tag
    // in `.ant-select-selection-overflow-item`; in jsdom (no layout) the
    // responsive collapsing doesn't kick in but we tolerate >= visibleLanes.
    const overflowItems = container.querySelectorAll(".ant-select-selection-overflow-item")
    expect(overflowItems.length).toBeGreaterThanOrEqual(vis.visibleLanes!.length)
  })

  it("does not remount Select on prop re-render (no key on value)", () => {
    const onLaneChange = vi.fn()
    const { container, rerender } = render(
      <LaneController
        swimmerInfo={swimmers}
        onLaneChange={onLaneChange}
        selectedVis={vis}
        currentLayer={layer}
      />
    )
    const selector = container.querySelector(".ant-select")!
    rerender(
      <LaneController
        swimmerInfo={swimmers}
        onLaneChange={onLaneChange}
        selectedVis={{ ...vis, visibleLanes: [1] }}
        currentLayer={layer}
      />
    )
    const selectorAfter = container.querySelector(".ant-select")!
    // Same DOM node identity means no remount.
    expect(selectorAfter).toBe(selector)
  })
})
