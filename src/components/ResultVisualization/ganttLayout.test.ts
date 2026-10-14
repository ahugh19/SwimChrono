import { layoutGantt, packRows, blockHeight, GANTT } from "./ganttLayout"
import { VisType } from "../../types"

function vis(partial: Partial<VisType>): VisType {
  return {
    key: Math.random().toString(36).slice(2), startMoment: 0, endMoment: 1, duration: 1, data: ["speed"], visType: [],
    visBbox: { x1: 0, y1: 0, x2: 1, y2: 1 }, morph: "", enteringAnimation: "", updatingAnimation: [], leavingAnimation: "",
    movement: "static", placement: "bottom left", placementRelativeTo: "", cameraShot: [], keyEvent: "", temporalRelation: [],
    videoKey: "v", highlight: "false",
    relativeTimeInfo: { relativeStartMoment: partial.startMoment ?? 0, relativeEndMoment: partial.endMoment ?? 1 },
    ...partial,
  }
}

describe("packRows", () => {
  it("shares a row only for the same data set without time overlap", () => {
    const a = vis({ startMoment: 0, endMoment: 5, data: ["speed"] })
    const b = vis({ startMoment: 6, endMoment: 9, data: ["speed"] })
    const c = vis({ startMoment: 2, endMoment: 4, data: ["speed"] }) // overlaps a
    const d = vis({ startMoment: 10, endMoment: 12, data: ["rank"] }) // other data
    const rows = packRows([d, c, b, a])
    expect(rows.map((r) => r.length)).toEqual([2, 1, 1])
    expect(rows[0].map((v) => v.startMoment)).toEqual([0, 6])
  })
})

describe("layoutGantt", () => {
  it("groups by placement in the canonical order and reports the extent", () => {
    const list = [
      vis({ placement: "bottom left", endMoment: 30 }),
      vis({ placement: "along lane", endMoment: 12 }),
      vis({ placement: "somewhere else", endMoment: 3 }),
    ]
    const layout = layoutGantt(list, "placement")
    expect(layout.groups.map((g) => g.key)).toEqual(["along lane", "bottom left", "somewhere else"])
    expect(layout.rowCount).toBe(3)
    expect(layout.maxEnd).toBe(30)
    expect(blockHeight(layout, true)).toBe(GANTT.titleHeight + GANTT.axisHeight + 3 * (GANTT.rowHeight + GANTT.rowGap) + 3 * GANTT.groupGap + GANTT.padding)
  })

  it("groups by movement", () => {
    const layout = layoutGantt([vis({ movement: "moving" }), vis({ movement: "static" })], "movement")
    expect(layout.groups.map((g) => g.key)).toEqual(["static", "moving"])
  })
})
