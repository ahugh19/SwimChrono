import { formatTimecode, parseTimecode } from "./timecode"

describe("timecode", () => {
  it("formats seconds with frames", () => {
    expect(formatTimecode(46.68, 50)).toBe("00:46:34")
    expect(formatTimecode(3725.5, 25)).toBe("1:02:05:12")
    expect(formatTimecode(10.98, 50)).toBe("00:10:49")
    expect(formatTimecode(0, 50)).toBe("00:00:00")
  })

  it("parses timecodes and plain seconds", () => {
    expect(parseTimecode("00:46:34", 50)).toBeCloseTo(46.68)
    expect(parseTimecode("1:02:05:12", 25)).toBeCloseTo(3725.48)
    expect(parseTimecode("01:30", 50)).toBe(90)
    expect(parseTimecode("12.5", 50)).toBe(12.5)
  })

  it("rejects invalid input", () => {
    expect(parseTimecode("", 50)).toBeNull()
    expect(parseTimecode("00:61:00", 50)).toBeNull()
    expect(parseTimecode("00:10:50", 50)).toBeNull() // frame index must be below fps
    expect(parseTimecode("abc", 50)).toBeNull()
  })
})
