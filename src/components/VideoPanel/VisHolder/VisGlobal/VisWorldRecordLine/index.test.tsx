import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisWorldRecordLine from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType } from "../../../../../types"

const elements: EditableElementType[] = [
  { id: "shape-1", type: "shape", visible: true, shapeFillColor: "#aaa111", shapeStrokeColor: "#111aaa", shapeStrokeWidth: 0 },
  { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#bbb222", shapeStrokeColor: "#222bbb", shapeStrokeWidth: 0 },
  { id: "line-1", type: "shape", visible: true, shapeFillColor: "#ccc333", shapeStrokeColor: "#333ccc", shapeStrokeWidth: 2 },
]

function renderWith(els: EditableElementType[]) {
  return render(
    <svg>
      <VisWorldRecordLine
        currentSwimmerVideo={makeSwimmerVideo()}
        currentFrameIndex={0}
        x={0} y={0} r={0} s={100}
        editableElementList={els}
        visibility={true}
        svgWidth={1920}
        svgHeight={1080}
      />
    </svg>
  )
}

describe("VisWorldRecordLine", () => {
  it("renders line-1 with stroke and visibility", () => {
    const { container } = renderWith(elements)
    const line = container.querySelector("line")!
    expect(line.getAttribute("stroke")).toBe("#333ccc")
    expect(line.getAttribute("stroke-width")).toBe("2")
    expect(line.getAttribute("visibility")).toBe("visible")
  })

  it("hides shape-1 (the WR text path) independently of background", () => {
    const els = elements.map((e) => e.id === "shape-1" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const path = container.querySelector("path")!
    expect(path.getAttribute("visibility")).toBe("hidden")
    const rect = container.querySelector("rect")!
    expect(rect.getAttribute("visibility")).toBe("visible")
  })

  it("hides background-shape-1 (rect) independently of shape-1", () => {
    const els = elements.map((e) => e.id === "background-shape-1" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const rect = container.querySelector("rect")!
    expect(rect.getAttribute("visibility")).toBe("hidden")
    const path = container.querySelector("path")!
    expect(path.getAttribute("visibility")).toBe("visible")
  })
})
