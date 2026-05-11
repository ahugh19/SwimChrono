import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisWorldRecordSplitCorner from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType } from "../../../../../types"

const elements: EditableElementType[] = [
  { id: "text-1-spit-value", type: "text", visible: true, fontFillColor: "#ffeeaa", fontSize: 11, x: 1, y: 0 },
  { id: "shape-1-WR-text", type: "shape", visible: true, shapeFillColor: "#aabbcc", shapeStrokeColor: "#000111", shapeStrokeWidth: 0.5 },
  { id: "shape-2-WR-bg", type: "shape", visible: true, shapeFillColor: "#ddeeff", shapeStrokeColor: "#222333", shapeStrokeWidth: 0.7 },
  { id: "shape-2-split", type: "shape", visible: true, shapeFillColor: "#444555", shapeStrokeColor: "#666777", shapeStrokeWidth: 0.9 },
  { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#888999", shapeStrokeColor: "#aaaaaa", shapeStrokeWidth: 1.1 },
]

function renderWith(els: EditableElementType[]) {
  return render(
    <svg>
      <VisWorldRecordSplitCorner
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

describe("VisWorldRecordSplitCorner", () => {
  it("applies stroke + visibility to background-shape-1", () => {
    const { container } = renderWith(elements)
    const bg = container.querySelector('rect[width="103"]')!
    expect(bg.getAttribute("fill")).toBe("#888999")
    expect(bg.getAttribute("stroke")).toBe("#aaaaaa")
    expect(bg.getAttribute("stroke-width")).toBe("1.1")
    expect(bg.getAttribute("visibility")).toBe("visible")
  })

  it("hides background-shape-1 when visible=false", () => {
    const els = elements.map((e) => e.id === "background-shape-1" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const bg = container.querySelector('rect[width="103"]')!
    expect(bg.getAttribute("visibility")).toBe("hidden")
  })

  it("applies WR badge bg fill/stroke/visible to shape-2-WR-bg", () => {
    const { container } = renderWith(elements)
    const wrBg = container.querySelector('rect[width="18.7"]')!
    expect(wrBg.getAttribute("fill")).toBe("#ddeeff")
    expect(wrBg.getAttribute("stroke")).toBe("#222333")
    expect(wrBg.getAttribute("stroke-width")).toBe("0.7")
    expect(wrBg.getAttribute("visibility")).toBe("visible")
  })

  it("hides shape-1-WR-text path independently of bg", () => {
    const els = elements.map((e) => e.id === "shape-1-WR-text" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const paths = container.querySelectorAll("path")
    // first path is WR text path
    const wrPath = paths[0]
    expect(wrPath.getAttribute("visibility")).toBe("hidden")
    // bg should still be visible
    const bg = container.querySelector('rect[width="103"]')!
    expect(bg.getAttribute("visibility")).toBe("visible")
  })

  it("applies text-1-spit-value font + offset", () => {
    const { container } = renderWith(elements)
    const text = container.querySelector("text")!
    expect(text.getAttribute("fill")).toBe("#ffeeaa")
    expect(text.getAttribute("font-size")).toBe("11")
    expect(text.getAttribute("visibility")).toBe("visible")
    const xAttr = parseFloat(text.getAttribute("x") || "0")
    expect(xAttr).toBe(69) // 68 + textStyle.x=1
  })
})
