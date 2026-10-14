import { raceNameParts, recordLabel, eventLabel, raceRound } from "./raceInfo"
import { VideoMetaDataType } from "../types"

const base = { lanes: 8, raceStartTime: 0, dataCSV: "", framerate: 50, poolLapLength: 50, type: "individual", video: "", videoName: "", note: "", swimmersInfo: [] }

describe("raceInfo", () => {
  it("builds the race name from the metadata", () => {
    const meta = { ...base, name: "paris24-men-back-final-100m", distance: 100, gender: "men", year: 2024, style: "backstroke", level: "Olympic" } as VideoMetaDataType
    expect(raceNameParts(meta)).toEqual({ gender: "M", distance: "100", style: "back", round: "F" })
    expect(recordLabel(meta)).toBe("OR")
  })

  it("adapts to a local competition", () => {
    const meta = { ...base, name: "Local 100m breast F", distance: 100, gender: "women", year: 2021, style: "breaststroke", level: "France Championship" } as VideoMetaDataType
    expect(raceNameParts(meta)).toEqual({ gender: "W", distance: "100", style: "breast", round: "F" })
    expect(recordLabel(meta)).toBe("CR")
    expect(eventLabel(meta)).toBe("FRANCE CHAMPIONSHIP 2021")
  })

  it("detects the round from the name", () => {
    expect(raceRound({ ...base, name: "men 200m semi 1", level: "Olympic" } as unknown as VideoMetaDataType)).toBe("SF")
    expect(raceRound({ ...base, name: "heat 3", level: "x" } as unknown as VideoMetaDataType)).toBe("H")
    expect(raceRound(null)).toBe("")
  })
})
