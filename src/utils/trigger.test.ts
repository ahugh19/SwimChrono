import { calIntervalByTrigger, clearIntervals } from "./index"
import { TRIGGER_COMP_START_DURATION, TRIGGER_COMP_START_END } from "./values"
import { SwimmerVideoDataType, TriggerCompType, VideoMetaDataType, VisIntervalType } from "../types"

// One swimmer (id 0) swimming 0.1 m per frame at 50 fps: frame n = n/10 m.
function makeFrames(frameCount: number): SwimmerVideoDataType {
  const frames: SwimmerVideoDataType = {}
  for (let i = 0; i < frameCount; i++) {
    frames[i] = { 0: { frameId: i, swimmerId: 0, distanceSwam: i / 10, currentLeader: 0 } as any }
  }
  return frames
}

const meta = { framerate: 50, name: "test" } as VideoMetaDataType

function trigger(partial: Partial<TriggerCompType>): TriggerCompType {
  return {
    name: "t", triggerType: TRIGGER_COMP_START_END, priority: 1,
    subjectStart: "distanceSwam", compareStart: ">=", valueStart: 10,
    subjectEnd: "distanceSwam", compareEnd: "<=", valueEnd: 20,
    ...partial,
  }
}

describe("calIntervalByTrigger", () => {
  it("returns an empty list without trigger components", () => {
    expect(calIntervalByTrigger(meta, makeFrames(10), null)).toEqual([])
    expect(calIntervalByTrigger(meta, makeFrames(10), { triggerCompList: null })).toEqual([])
  })

  it("finds a start+end interval from the leader's values", () => {
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [trigger({})] })
    expect(result).toHaveLength(1)
    expect(result[0].startFrame).toBe(100)
    expect(result[0].endFrame).toBe(200)
    expect(result[0].relativeStartMoment).toBeCloseTo(2)
    expect(result[0].duration).toBeCloseTo(2)
    expect(result[0].isMerged).toBe(false)
  })

  it("computes a start+duration interval in seconds", () => {
    // Equality has a 0.1 tolerance, so 9.9 m (frame 99) already matches.
    const t = trigger({ triggerType: TRIGGER_COMP_START_DURATION, compareStart: "=", valueStart: 10, valueEnd: 3 })
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [t] })
    expect(result).toHaveLength(1)
    expect(result[0].startFrame).toBe(99)
    expect(result[0].endFrame).toBe(249)
  })

  it("re-arms a start+duration trigger while its start condition stays true", () => {
    // Existing semantics (kept for paper replication): with ">=" the trigger
    // fires again right after each duration ends, and the adjacent segments
    // are merged into one interval reaching the last frame.
    const t = trigger({ triggerType: TRIGGER_COMP_START_DURATION, valueEnd: 3 })
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [t] })
    expect(result).toHaveLength(1)
    expect(result[0].startFrame).toBe(100)
    expect(result[0].endFrame).toBe(499)
    expect(result[0].isMerged).toBe(true)
  })

  it("clamps a start+duration interval to the last frame", () => {
    const t = trigger({ triggerType: TRIGGER_COMP_START_DURATION, valueStart: 45, valueEnd: 10 })
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [t] })
    expect(result).toHaveLength(1)
    expect(result[0].endFrame).toBe(499)
  })

  it("merges intervals that are closer than one second", () => {
    const a = trigger({ name: "a", valueStart: 10, valueEnd: 20 })
    const b = trigger({ name: "b", valueStart: 20.5, valueEnd: 30 }) // starts 5 frames after a ends
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [a, b] })
    expect(result).toHaveLength(1)
    expect(result[0].startFrame).toBe(100)
    expect(result[0].endFrame).toBe(300)
    expect(result[0].isMerged).toBe(true)
    expect(result[0].mergedTriggers.map((t) => t.name)).toEqual(["a", "b"])
  })

  it("keeps intervals separated by more than one second apart", () => {
    const a = trigger({ name: "a", valueStart: 10, valueEnd: 20 })
    const b = trigger({ name: "b", valueStart: 30, valueEnd: 40 })
    const result = calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [a, b] })
    expect(result.map((r) => [r.startFrame, r.endFrame])).toEqual([[100, 200], [300, 400]])
  })

  it("drops segments shorter than 0.2 s", () => {
    const t = trigger({ valueStart: 10, valueEnd: 10.5 }) // 5 frames
    expect(calIntervalByTrigger(meta, makeFrames(500), { triggerCompList: [t] })).toEqual([])
  })
})

describe("clearIntervals", () => {
  it("keeps only the first interval of each overlapping group", () => {
    const mk = (startFrame: number, endFrame: number): VisIntervalType =>
      ({ startFrame, endFrame, triggerConfig: trigger({}), relativeStartMoment: 0, relativeEndMoment: 0, duration: 0, isMerged: false, mergedTriggers: [] })
    const result = clearIntervals([mk(0, 10), mk(5, 15), mk(20, 30)])
    expect(result.map((r) => [r.startFrame, r.endFrame])).toEqual([[0, 10], [20, 30]])
  })
})
