import { buildRecommendation, patternText, RecommendationSummary } from "./triggerRecommendation"

const summary: RecommendationSummary = {
  source: "x", generatedAt: "2026-10-14", videos: 2, annotations: 10,
  byData: {
    "wr (world record)": { total: 6, medianDuration: 4, patterns: [{ relation: "after", event: "turning", count: 4 }, { relation: "before", event: "race end", count: 2 }] },
    "wr (world record) splitted": { total: 4, medianDuration: 6, patterns: [{ relation: "after", event: "turning", count: 4 }] },
  },
}

describe("buildRecommendation", () => {
  it("merges the labels of a data name and ranks the patterns", () => {
    const rec = buildRecommendation("worldRecord", summary)
    expect(rec?.total).toBe(10)
    expect(rec?.patterns[0]).toEqual({ text: "after a turn", count: 8, percent: 80 })
    expect(rec?.patterns[1]).toEqual({ text: "before the race end", count: 2, percent: 20 })
    expect(rec?.medianDuration).toBe(5)
  })

  it("returns null without review data", () => {
    expect(buildRecommendation("strokeCount", summary)).toBeNull()
    expect(buildRecommendation("worldRecord", null)).toBeNull()
  })

  it("words the patterns", () => {
    expect(patternText("after+before+during", "race start")).toBe("around the race start")
    expect(patternText("before", "jump into the water")).toBe("before the dive")
  })
})
