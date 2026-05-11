import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisRankingChangeTextLane from "./index"
import { makeFrame } from "../../../../../test/fixtures"
import { EditableElementType, LayerType, SwimmerVideoDataType } from "../../../../../types"

// Build a 2-frame video where lane 0 falls from 1st to 2nd between frames 0 and 1.
function makeRankingDropVideo(): SwimmerVideoDataType {
  const frame0: Record<number, ReturnType<typeof makeFrame>> = {}
  const frame1: Record<number, ReturnType<typeof makeFrame>> = {}
  // frame 0: lane 0 leads (distance 50), lane 1 second (distance 40)
  frame0[0] = makeFrame({ swimmerId: 0, distanceSwam: 50, currentLeader: 0 })
  frame0[1] = makeFrame({ swimmerId: 1, distanceSwam: 40, currentLeader: 0 })
  // frame 1: lane 1 overtakes — lane 0 drops to 2nd
  frame1[0] = makeFrame({ swimmerId: 0, distanceSwam: 50, currentLeader: 1 })
  frame1[1] = makeFrame({ swimmerId: 1, distanceSwam: 60, currentLeader: 1 })
  return { 0: frame0, 1: frame1 }
}

const baseElements: EditableElementType[] = [
  { id: "text-1", type: "text", visible: true, fontFillColor: "#ffffff", fontSize: 20 },
  { id: "shape-arrow-up", type: "shape", visible: true, shapeFillColor: "#11ff22", shapeStrokeColor: "#000000", shapeStrokeWidth: 1 },
  { id: "shape-arrow-down", type: "shape", visible: true, shapeFillColor: "#ff0011", shapeStrokeColor: "#000000", shapeStrokeWidth: 2 },
]

function renderAtFrame(frameIndex: number, els = baseElements) {
  return render(
    <svg>
      <VisRankingChangeTextLane
        layerList={[] as LayerType[]}
        currentSwimmerVideo={makeRankingDropVideo()}
        currentFrameIndex={frameIndex}
        x={0} y={0} r={0} s={100}
        isMove={false}
        laneIndex={0}
        svgWidth={1920}
        svgHeight={1080}
        editableElementList={els}
        visibility={true}
      />
    </svg>
  )
}

describe("VisRankingChangeTextLane", () => {
  it("renders down arrow with shape-arrow-down editable colour when ranking drops", () => {
    const { container } = renderAtFrame(1)
    const path = container.querySelector("path")
    expect(path).toBeTruthy()
    expect(path!.getAttribute("fill")).toBe("#ff0011")
    expect(path!.getAttribute("stroke")).toBe("#000000")
    expect(path!.getAttribute("stroke-width")).toBe("2")
    expect(path!.getAttribute("visibility")).toBe("visible")
  })

  it("hides the arrow when its visible flag is false", () => {
    const els = baseElements.map((e) => e.id === "shape-arrow-down" ? { ...e, visible: false } : e)
    const { container } = renderAtFrame(1, els)
    const path = container.querySelector("path")!
    expect(path.getAttribute("visibility")).toBe("hidden")
  })
})
