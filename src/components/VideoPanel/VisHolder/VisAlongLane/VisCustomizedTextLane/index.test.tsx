import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VisCustomizedTextLane from "./index"
import { makeSwimmerVideo } from "../../../../../test/fixtures"
import { EditableElementType, LayerType } from "../../../../../types"

// Regression test for previous bug: VisCustomizedTextLane referenced
// editableElementInVisConfig.currentSpeedTextLane[0].id (cosmetic copy/paste).
// After fix it should look up the entry via VALUE_customizedTextIndividual
// — but since both happen to use id="text-1", the user-visible behaviour
// is the same. This test pins behaviour against the customized text id.
describe("VisCustomizedTextLane", () => {
  it("applies text-1 fill/fontSize from editable element list", () => {
    const elements: EditableElementType[] = [
      { id: "text-1", type: "text", visible: true, fontFillColor: "#33ccff", fontSize: 30 },
    ]
    const { container } = render(
      <svg>
        <VisCustomizedTextLane
          layerList={[] as LayerType[]}
          currentSwimmerVideo={makeSwimmerVideo()}
          currentFrameIndex={0}
          x={0} y={0} r={0} s={100}
          customizedText="hello"
          isMove={false}
          laneIndex={0}
          svgWidth={1920}
          svgHeight={1080}
          editableElementList={elements}
          visibility={true}
        />
      </svg>
    )
    const text = container.querySelector("text")!
    expect(text.textContent).toContain("hello")
    expect(text.getAttribute("fill")).toBe("#33ccff")
    expect(text.getAttribute("font-size")).toBe("30")
    expect(text.getAttribute("visibility")).toBe("visible")
  })
})
