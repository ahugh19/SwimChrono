import { isFrameInIntervals } from "./visRegistry"

describe("isFrameInIntervals", () => {
  it("shows trigger-less layers only from the race start", () => {
    expect(isFrameInIntervals(10, null, 100)).toBe(false)
    expect(isFrameInIntervals(100, null, 100)).toBe(true)
    expect(isFrameInIntervals(5, null)).toBe(true)
  })

  it("checks inclusive interval bounds", () => {
    const list = [{ startFrame: 10, endFrame: 20 }]
    expect(isFrameInIntervals(9, list, 0)).toBe(false)
    expect(isFrameInIntervals(10, list, 0)).toBe(true)
    expect(isFrameInIntervals(20, list, 0)).toBe(true)
    expect(isFrameInIntervals(21, list, 0)).toBe(false)
  })
})
