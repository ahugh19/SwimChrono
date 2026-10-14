import { parseFrameCsv } from "./frameData"

describe("parseFrameCsv", () => {
  it("parses rows, converts numbers and sorts by frameId", () => {
    const csv = "frameId, swimmerId ,speed\n5,0,1.5\n3,1,2\n\n4,0,abc\n"
    const rows = parseFrameCsv(csv)
    expect(rows.map((r) => r.frameId)).toEqual([3, 4, 5])
    expect(rows[0].swimmerId).toBe(1)
    expect(rows[2].speed).toBe(1.5)
  })

  it("drops rows without a numeric frameId", () => {
    const rows = parseFrameCsv("frameId,swimmerId\nx,0\n7,1\n")
    expect(rows).toHaveLength(1)
    expect(rows[0].frameId).toBe(7)
  })
})
