import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ShapeController from "./index"
import { EditableElementType } from "../../../types"

const editing: EditableElementType = {
  id: "shape-1", type: "shape", visible: true,
  shapeFillColor: "#aabbcc",
  shapeStrokeColor: "#112233",
  shapeStrokeWidth: 2,
}

function setup() {
  const onShapeFillColorChange = vi.fn()
  const onShapeStrokeColorChange = vi.fn()
  const onShapeStrokeWidthChange = vi.fn()
  const result = render(
    <ShapeController
      editingElement={editing}
      onShapeFillColorChange={onShapeFillColorChange}
      onShapeStrokeColorChange={onShapeStrokeColorChange}
      onShapeStrokeWidthChange={onShapeStrokeWidthChange}
      onShapeVisibilityChange={vi.fn()}
      strokeDisable={false}
    />
  )
  return { ...result, onShapeStrokeWidthChange }
}

describe("ShapeController", () => {
  it("does not commit strokeWidth on every keystroke; commits on blur", () => {
    const { container, onShapeStrokeWidthChange } = setup()
    const input = container.querySelector('input[role="spinbutton"]') as HTMLInputElement
    fireEvent.change(input, { target: { value: "1" } })
    fireEvent.change(input, { target: { value: "10" } })
    expect(onShapeStrokeWidthChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onShapeStrokeWidthChange).toHaveBeenCalledWith(10)
  })

  it("retains focus when parent re-renders", () => {
    const { container, rerender } = setup()
    const input = container.querySelector('input[role="spinbutton"]') as HTMLInputElement
    input.focus()
    rerender(
      <ShapeController
        editingElement={{ ...editing }}
        onShapeFillColorChange={vi.fn()}
        onShapeStrokeColorChange={vi.fn()}
        onShapeStrokeWidthChange={vi.fn()}
        onShapeVisibilityChange={vi.fn()}
        strokeDisable={false}
      />
    )
    expect(document.activeElement).toBe(input)
  })
})
