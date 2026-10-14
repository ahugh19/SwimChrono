import { normalizeConfiguration, CONFIG_FORMAT_VERSION } from "./validation"

const layer = {
  uuid: "u1", isSelected: false, visibility: true, name: "L",
  intervalList: null, triggerCompList: null, embeddedVis: null,
}

describe("normalizeConfiguration", () => {
  it("accepts the legacy bare array", () => {
    const result = normalizeConfiguration([layer])
    expect(result?.format).toBe(0)
    expect(result?.layers).toHaveLength(1)
  })

  it("accepts the versioned envelope and returns its video name", () => {
    const result = normalizeConfiguration({ format: CONFIG_FORMAT_VERSION, video: "climbing", layers: [layer] })
    expect(result?.video).toBe("climbing")
    expect(result?.layers[0].name).toBe("L")
  })

  it("rejects invalid shapes and newer formats", () => {
    expect(normalizeConfiguration({ layers: "nope" })).toBeNull()
    expect(normalizeConfiguration([{ uuid: 1 }])).toBeNull()
    expect(normalizeConfiguration({ format: CONFIG_FORMAT_VERSION + 1, layers: [layer] })).toBeNull()
  })
})
