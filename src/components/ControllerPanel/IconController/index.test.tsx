import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import IconController from "./index"
import { EditableElementType } from "../../../types"

const editing: EditableElementType = {
  id: "icon-1", type: "icon", visible: true, iconSize: 40,
}

function setup() {
  const onIconSizeChange = vi.fn()
  const onIconVisibilityChange = vi.fn()
  const result = render(
    <IconController editingElement={editing}
      onIconSizeChange={onIconSizeChange}
      onIconVisibilityChange={onIconVisibilityChange} />
  )
  return { ...result, onIconSizeChange }
}

describe("IconController", () => {
  it("does not commit on keystroke; commits on blur and Enter", () => {
    const { container, onIconSizeChange } = setup()
    const input = container.querySelector('input[role="spinbutton"]') as HTMLInputElement
    fireEvent.change(input, { target: { value: "1" } })
    fireEvent.change(input, { target: { value: "12" } })
    expect(onIconSizeChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onIconSizeChange).toHaveBeenCalledWith(12)
    fireEvent.change(input, { target: { value: "30" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
    expect(onIconSizeChange).toHaveBeenLastCalledWith(30)
  })

  it("retains focus when parent re-renders with the same editing element", () => {
    const onIconSizeChange = vi.fn()
    const onIconVisibilityChange = vi.fn()
    const { container, rerender } = render(
      <IconController editingElement={editing}
        onIconSizeChange={onIconSizeChange}
        onIconVisibilityChange={onIconVisibilityChange} />
    )
    const input = container.querySelector('input[role="spinbutton"]') as HTMLInputElement
    input.focus()
    rerender(
      <IconController editingElement={{ ...editing }}
        onIconSizeChange={onIconSizeChange}
        onIconVisibilityChange={onIconVisibilityChange} />
    )
    expect(document.activeElement).toBe(input)
  })
})
