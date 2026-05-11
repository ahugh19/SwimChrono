import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import PositionController from "./index"

function setup() {
  const onXChange = vi.fn()
  const onYChange = vi.fn()
  const onRChange = vi.fn()
  const onSChange = vi.fn()
  const onMoveChange = vi.fn()
  const result = render(
    <PositionController
      maxX={1920} maxY={1080}
      svgWidth={1920} svgHeight={1080}
      defaultX={100}
      defaultXAndWidthRatio={100 / 1920}
      defaultY={50}
      defaultYAndHeightRatio={50 / 1080}
      defaultR={0}
      defaultS={100}
      defaultMove={false}
      disableMove={false}
      onXChange={onXChange}
      onYChange={onYChange}
      onRChange={onRChange}
      onSChange={onSChange}
      onMoveChange={onMoveChange}
    />
  )
  return { ...result, onXChange, onYChange, onRChange, onSChange }
}

describe("PositionController", () => {
  it("does not commit X to parent on every keystroke (commit-on-blur semantics)", () => {
    const { onXChange, container } = setup()
    const xInput = container.querySelector('input[role="spinbutton"]')! as HTMLInputElement
    fireEvent.change(xInput, { target: { value: "1" } })
    fireEvent.change(xInput, { target: { value: "12" } })
    fireEvent.change(xInput, { target: { value: "123" } })
    expect(onXChange).not.toHaveBeenCalled()
  })

  it("commits X on blur with the typed value and ratio", () => {
    const { onXChange, container } = setup()
    const xInput = container.querySelector('input[role="spinbutton"]')! as HTMLInputElement
    fireEvent.change(xInput, { target: { value: "456" } })
    fireEvent.blur(xInput)
    expect(onXChange).toHaveBeenCalledTimes(1)
    expect(onXChange).toHaveBeenCalledWith(456, 456 / 1920)
  })

  it("commits X on Enter", () => {
    const { onXChange, container } = setup()
    const xInput = container.querySelector('input[role="spinbutton"]')! as HTMLInputElement
    fireEvent.change(xInput, { target: { value: "789" } })
    fireEvent.keyDown(xInput, { key: "Enter", code: "Enter" })
    expect(onXChange).toHaveBeenCalledWith(789, 789 / 1920)
  })

  it("keeps focus across re-renders driven by parent prop changes", () => {
    const onXChange = vi.fn()
    const { container, rerender } = render(
      <PositionController
        maxX={1920} maxY={1080}
        svgWidth={1920} svgHeight={1080}
        defaultX={100} defaultXAndWidthRatio={100 / 1920}
        defaultY={50} defaultYAndHeightRatio={50 / 1080}
        defaultR={0} defaultS={100}
        defaultMove={false} disableMove={false}
        onXChange={onXChange}
        onYChange={vi.fn()} onRChange={vi.fn()}
        onSChange={vi.fn()} onMoveChange={vi.fn()}
      />
    )
    const xInput = container.querySelector('input[role="spinbutton"]')! as HTMLInputElement
    xInput.focus()
    expect(document.activeElement).toBe(xInput)
    // Simulate parent re-render with the same defaultX (would have remounted with old key).
    rerender(
      <PositionController
        maxX={1920} maxY={1080}
        svgWidth={1920} svgHeight={1080}
        defaultX={100} defaultXAndWidthRatio={100 / 1920}
        defaultY={50} defaultYAndHeightRatio={50 / 1080}
        defaultR={0} defaultS={100}
        defaultMove={false} disableMove={false}
        onXChange={onXChange}
        onYChange={vi.fn()} onRChange={vi.fn()}
        onSChange={vi.fn()} onMoveChange={vi.fn()}
      />
    )
    expect(document.activeElement).toBe(xInput)
  })
})
