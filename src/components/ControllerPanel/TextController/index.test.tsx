import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import TextController from "./index"
import { EditableElementType } from "../../../types"

const editing: EditableElementType = {
  id: "text-1", type: "text", visible: true,
  fontFillColor: "#ffffff", fontSize: 20, x: 0, y: 0,
}

function setup(defaultText: string | undefined = undefined) {
  const onFontSizeChange = vi.fn()
  const onFontXChange = vi.fn()
  const onFontYChange = vi.fn()
  const onFontTextContentChange = vi.fn()
  const result = render(
    <TextController
      editingElement={editing}
      defaultTextContent={defaultText}
      onFontColorChange={vi.fn()}
      onFontSizeChange={onFontSizeChange}
      onFontTextContentChange={onFontTextContentChange}
      onFontVisibilityChange={vi.fn()}
      onFontXChange={onFontXChange}
      onFontYChange={onFontYChange}
    />
  )
  return { ...result, onFontSizeChange, onFontXChange, onFontYChange, onFontTextContentChange }
}

describe("TextController", () => {
  it("size InputNumber commits only on blur / Enter", () => {
    const { container, onFontSizeChange } = setup()
    const inputs = container.querySelectorAll('input[role="spinbutton"]')
    // x=index 0, y=index 1, size=index 2
    const sizeInput = inputs[2] as HTMLInputElement
    fireEvent.change(sizeInput, { target: { value: "1" } })
    fireEvent.change(sizeInput, { target: { value: "12" } })
    expect(onFontSizeChange).not.toHaveBeenCalled()
    fireEvent.blur(sizeInput)
    expect(onFontSizeChange).toHaveBeenCalledWith(12)
  })

  it("X/Y InputNumbers commit on blur, not on each keystroke", () => {
    const { container, onFontXChange, onFontYChange } = setup()
    const inputs = container.querySelectorAll('input[role="spinbutton"]')
    const xInput = inputs[0] as HTMLInputElement
    const yInput = inputs[1] as HTMLInputElement
    fireEvent.change(xInput, { target: { value: "5" } })
    fireEvent.change(yInput, { target: { value: "9" } })
    expect(onFontXChange).not.toHaveBeenCalled()
    expect(onFontYChange).not.toHaveBeenCalled()
    fireEvent.blur(xInput)
    fireEvent.blur(yInput)
    expect(onFontXChange).toHaveBeenCalledWith(5)
    expect(onFontYChange).toHaveBeenCalledWith(9)
  })

  it("text content TextArea commits on blur, not per keystroke", () => {
    const { container, onFontTextContentChange } = setup("hi")
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "hello world" } })
    expect(onFontTextContentChange).not.toHaveBeenCalled()
    fireEvent.blur(textarea)
    expect(onFontTextContentChange).toHaveBeenCalledWith("hello world")
  })
})
