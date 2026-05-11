import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CustomizedIconController from "./index"
import { LayerType } from "../../../types"

const layer: LayerType = {
  uuid: "layer-1",
  isSelected: true,
  visibility: true,
  name: "test",
  intervalList: null,
  triggerCompList: null,
  embeddedVis: {
    visName: "VisCustomizedIconGlobal",
    visIcon: "x.png",
    dataName: "elapsedTime",
    composeType: "global",
    positionX: 0, positionY: 0, positionR: 0, positionS: 100,
    positionMove: false,
    editableElementList: [],
    customizedIcon: { svgContent: undefined, size: 1, visible: true },
  },
}

function setup() {
  const onCustomizedIconSizeChange = vi.fn()
  const result = render(
    <CustomizedIconController
      onCustomizedIconSizeChange={onCustomizedIconSizeChange}
      onSvgContentChange={vi.fn()}
      onCustomizedIconVisibilityChange={vi.fn()}
      defaultSize={1}
      currentLayer={layer} />
  )
  return { ...result, onCustomizedIconSizeChange }
}

describe("CustomizedIconController", () => {
  it("commits size as fraction (percent / 100) on blur, not per keystroke", () => {
    const { container, onCustomizedIconSizeChange } = setup()
    const input = container.querySelector('input[role="spinbutton"]') as HTMLInputElement
    fireEvent.change(input, { target: { value: "5" } })
    fireEvent.change(input, { target: { value: "50" } })
    expect(onCustomizedIconSizeChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onCustomizedIconSizeChange).toHaveBeenCalledWith(0.5)
  })
})
