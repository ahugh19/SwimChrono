import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisDistanceToLeaderPacManLane from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType, LayerType } from "../../../../../types"

const editableElementList: EditableElementType[] = [
  { id: "shape-pac-man", type: "shape", visible: true, shapeFillColor: "#abcdef", shapeStrokeColor: "#123456", shapeStrokeWidth: 2 },
  { id: "shape-food", type: "shape", visible: true, shapeFillColor: "#fedcba", shapeStrokeColor: "#654321", shapeStrokeWidth: 1 },
]

function renderComponent(overrides: Partial<EditableElementType>[] = [{}, {}]) {
  const merged = editableElementList.map((e, i) => ({ ...e, ...overrides[i] }))
  return render(
    <svg>
      <VisDistanceToLeaderPacManLane
        layerList={[] as LayerType[]}
        currentSwimmerVideo={makeSwimmerVideo()}
        currentFrameIndex={0}
        x={0} y={0} r={0} s={100}
        isMove={false}
        laneIndex={0}
        svgWidth={1920}
        svgHeight={1080}
        editableElementList={merged}
        visibility={true}
      />
    </svg>
  )
}

describe("VisDistanceToLeaderPacManLane", () => {
  it("uses pac-man editable shape colors instead of hardcoded yellow/black", () => {
    const { container } = renderComponent()
    const circles = container.querySelectorAll("circle")
    // first circle = pac-man head (with mask)
    const head = Array.from(circles).find((c) => c.getAttribute("r") === "30")
    expect(head).toBeDefined()
    expect(head!.getAttribute("fill")).toBe("#abcdef")
    expect(head!.getAttribute("stroke")).toBe("#123456")
    expect(head!.getAttribute("stroke-width")).toBe("2")
    // eye circle uses pac-man stroke color (the contrast)
    const eye = Array.from(circles).find((c) => c.getAttribute("r") === "3")
    expect(eye).toBeDefined()
    expect(eye!.getAttribute("fill")).toBe("#123456")
  })

  it("uses food editable color for dots in second-place lane", () => {
    const { container } = render(
      <svg>
        <VisDistanceToLeaderPacManLane
          layerList={[] as LayerType[]}
          currentSwimmerVideo={makeSwimmerVideo()}
          currentFrameIndex={0}
          x={0} y={0} r={0} s={100}
          isMove={false}
          laneIndex={1} // second place gets dots
          svgWidth={1920}
          svgHeight={1080}
          editableElementList={editableElementList}
          visibility={true}
        />
      </svg>
    )
    const dots = container.querySelectorAll("circle")
    const food = Array.from(dots).filter((c) => c.getAttribute("fill") === "#fedcba")
    expect(food.length).toBeGreaterThan(0)
  })

  it("hides pac-man when shape-pac-man visible=false", () => {
    const { container } = renderComponent([{ visible: false }, {}])
    const head = container.querySelector('circle[r="30"]')
    // ancestor <g> should be hidden
    const ancestorG = head?.closest("g[visibility]")
    expect(ancestorG?.getAttribute("visibility")).toBe("hidden")
  })
})
