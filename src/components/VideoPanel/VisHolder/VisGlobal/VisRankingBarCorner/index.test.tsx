import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisRankingBarCorner from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType } from "../../../../../types"

const elements: EditableElementType[] = [
  { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#111111", shapeStrokeColor: "#222222", shapeStrokeWidth: 1 },
  { id: "background-shape-2", type: "shape", visible: true, shapeFillColor: "#333333", shapeStrokeColor: "#444444", shapeStrokeWidth: 2 },
  { id: "text-1", type: "text", visible: true, fontFillColor: "#aaaaaa", fontSize: 9, x: 1, y: 0 },
  { id: "text-2", type: "text", visible: true, fontFillColor: "#bbbbbb", fontSize: 10, x: 0, y: 0 },
  { id: "text-3", type: "text", visible: true, fontFillColor: "#cccccc", fontSize: 11, x: 0, y: 0 },
]

function renderWith(els: EditableElementType[]) {
  return render(
    <svg>
      <VisRankingBarCorner
        currentSwimmerVideo={makeSwimmerVideo()}
        currentFrameIndex={0}
        x={0} y={0} r={0} s={100}
        editableElementList={els}
        visibility={true}
      />
    </svg>
  )
}

describe("VisRankingBarCorner", () => {
  it("applies stroke and visibility to shape rects", () => {
    const { container } = renderWith(elements)
    const rects = container.querySelectorAll("rect")
    expect(rects.length).toBeGreaterThan(0)
    // bg1 (lane number column, width 27)
    const bg1 = Array.from(rects).find((r) => r.getAttribute("width") === "27")
    expect(bg1).toBeDefined()
    expect(bg1!.getAttribute("fill")).toBe("#111111")
    expect(bg1!.getAttribute("stroke")).toBe("#222222")
    expect(bg1!.getAttribute("stroke-width")).toBe("1")
    expect(bg1!.getAttribute("visibility")).toBe("visible")
    // bg2 (data column, width 165)
    const bg2 = Array.from(rects).find((r) => r.getAttribute("width") === "165")
    expect(bg2).toBeDefined()
    expect(bg2!.getAttribute("fill")).toBe("#333333")
    expect(bg2!.getAttribute("stroke")).toBe("#444444")
    expect(bg2!.getAttribute("stroke-width")).toBe("2")
  })

  it("hides bg1 rects when visible=false", () => {
    const els = elements.map((e) => e.id === "background-shape-1" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const rects = container.querySelectorAll("rect")
    const bg1Hidden = Array.from(rects).filter((r) => r.getAttribute("width") === "27" && r.getAttribute("visibility") === "hidden")
    expect(bg1Hidden.length).toBeGreaterThan(0)
  })

  it("applies text fontSize/fill/visible per text element", () => {
    const { container } = renderWith(elements)
    const texts = container.querySelectorAll("text")
    const text1 = Array.from(texts).find((t) => t.getAttribute("font-size") === "9")
    expect(text1).toBeDefined()
    expect(text1!.getAttribute("fill")).toBe("#aaaaaa")
    expect(text1!.getAttribute("visibility")).toBe("visible")
  })

  it("hides text-3 when visible=false", () => {
    const els = elements.map((e) => e.id === "text-3" ? { ...e, visible: false } : e)
    const { container } = renderWith(els)
    const text3List = Array.from(container.querySelectorAll("text")).filter((t) => t.getAttribute("font-size") === "11")
    expect(text3List.length).toBeGreaterThan(0)
    text3List.forEach((t) => expect(t.getAttribute("visibility")).toBe("hidden"))
  })
})
