import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisDistanceLeftLane from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType, LayerType } from "../../../../../types"

const baseElements: EditableElementType[] = [
  { id: "text-1", type: "text", visible: true, fontFillColor: "#ff0000", fontSize: 22, x: 5, y: 7 },
  { id: "background-shape-1-start", type: "shape", visible: true, shapeFillColor: "#aaaaaa", shapeStrokeColor: "#000000", shapeStrokeWidth: 0 },
  { id: "background-shape-1-end", type: "shape", visible: true, shapeFillColor: "#bbbbbb", shapeStrokeColor: "#000000", shapeStrokeWidth: 0 },
]

function renderWith(elements: EditableElementType[]) {
  return render(
    <svg>
      <VisDistanceLeftLane
        layerList={[] as LayerType[]}
        currentSwimmerVideo={makeSwimmerVideo()}
        currentFrameIndex={0}
        x={0} y={0} r={0} s={100}
        isMove={false}
        laneIndex={0}
        svgWidth={1920}
        svgHeight={1080}
        editableElementList={elements}
        visibility={true}
      />
    </svg>
  )
}

describe("VisDistanceLeftLane", () => {
  it("applies textStyle x/y/visible/fill/fontSize to the text element", () => {
    const { container } = renderWith(baseElements)
    const text = container.querySelector("text")!
    expect(text).toBeTruthy()
    expect(text.getAttribute("fill")).toBe("#ff0000")
    expect(text.getAttribute("font-size")).toBe("22")
    expect(text.getAttribute("visibility")).toBe("visible")
    // x should include the textStyle.x offset (5)
    const xAttr = parseFloat(text.getAttribute("x") || "0")
    expect(xAttr).toBe(5)
    expect(text.getAttribute("y")).toBe("7")
  })

  it("hides text when text-1 visible=false", () => {
    const elements = [{ ...baseElements[0], visible: false }, baseElements[1], baseElements[2]]
    const { container } = renderWith(elements)
    const text = container.querySelector("text")!
    expect(text.getAttribute("visibility")).toBe("hidden")
  })

  it("uses rectStyle2 color as gradient end stop when visible", () => {
    const { container } = renderWith(baseElements)
    const stops = container.querySelectorAll("stop")
    // each gradient has 2 stops, two gradients defined
    const advanceStops = Array.from(stops).slice(0, 2)
    expect(advanceStops[0].getAttribute("stop-color")).toBe("#aaaaaa")
    expect(advanceStops[1].getAttribute("stop-color")).toBe("#bbbbbb")
    expect(advanceStops[1].getAttribute("stop-opacity")).toBe("0")
  })

  it("falls back to rectStyle1 color when rectStyle2.visible=false", () => {
    const elements: EditableElementType[] = [
      baseElements[0],
      baseElements[1],
      { ...baseElements[2], visible: false },
    ]
    const { container } = renderWith(elements)
    const stops = container.querySelectorAll("stop")
    const advanceEndStop = stops[1]
    expect(advanceEndStop.getAttribute("stop-color")).toBe("#aaaaaa")
    expect(advanceEndStop.getAttribute("stop-opacity")).toBe("1")
  })
})
