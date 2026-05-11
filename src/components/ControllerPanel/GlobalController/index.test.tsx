import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import GlobalController from "./index"

function setup() {
  const onBlurChange = vi.fn()
  const onMinDurationChange = vi.fn()
  const result = render(
    <GlobalController
      defaultBlur={0.5}
      defaultMinDuration={3}
      onBlurChange={onBlurChange}
      onMinDurationChange={onMinDurationChange}
    />
  )
  // The InputNumber inputs live inside a Collapse panel that is collapsed
  // by default. Click the header so the inputs mount in the DOM.
  const header = result.container.querySelector(".ant-collapse-header") as HTMLElement
  fireEvent.click(header)
  return { ...result, onBlurChange, onMinDurationChange }
}

describe("GlobalController", () => {
  it("does not commit blur on every keystroke", () => {
    const { container, onBlurChange } = setup()
    const inputs = container.querySelectorAll('input[role="spinbutton"]')
    const blurInput = inputs[0] as HTMLInputElement
    fireEvent.change(blurInput, { target: { value: "1" } })
    fireEvent.change(blurInput, { target: { value: "1.2" } })
    expect(onBlurChange).not.toHaveBeenCalled()
  })

  it("commits blur on blur and Enter", () => {
    const { container, onBlurChange } = setup()
    const inputs = container.querySelectorAll('input[role="spinbutton"]')
    const blurInput = inputs[0] as HTMLInputElement
    fireEvent.change(blurInput, { target: { value: "1.5" } })
    fireEvent.blur(blurInput)
    expect(onBlurChange).toHaveBeenLastCalledWith(1.5)
    fireEvent.change(blurInput, { target: { value: "2.7" } })
    fireEvent.keyDown(blurInput, { key: "Enter", code: "Enter" })
    expect(onBlurChange).toHaveBeenLastCalledWith(2.7)
  })

  it("commits minDuration on blur", () => {
    const { container, onMinDurationChange } = setup()
    const inputs = container.querySelectorAll('input[role="spinbutton"]')
    const minInput = inputs[1] as HTMLInputElement
    fireEvent.change(minInput, { target: { value: "12" } })
    fireEvent.blur(minInput)
    expect(onMinDurationChange).toHaveBeenCalledWith(12)
  })

  it("retains focus across parent re-renders", () => {
    const { container, rerender, onBlurChange, onMinDurationChange } = setup()
    const blurInput = container.querySelectorAll('input[role="spinbutton"]')[0] as HTMLInputElement
    blurInput.focus()
    expect(document.activeElement).toBe(blurInput)
    rerender(
      <GlobalController
        defaultBlur={0.5}
        defaultMinDuration={3}
        onBlurChange={onBlurChange}
        onMinDurationChange={onMinDurationChange}
      />
    )
    expect(document.activeElement).toBe(blurInput)
  })
})
