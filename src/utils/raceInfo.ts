import { VideoMetaDataType } from "../types"

// Helpers deriving display strings from a video's metadata, so the corner
// visualizations adapt to whichever race is loaded.

const STYLE_SHORT: Record<string, string> = {
  backstroke: "back",
  freestyle: "free",
  breaststroke: "breast",
  butterfly: "fly",
  medley: "medley",
  medlay: "medley",
  climbing: "climb",
}

const GENDER_SHORT: Record<string, string> = { men: "M", women: "W", mixed: "X" }

export function isOlympic(meta: VideoMetaDataType | null | undefined) {
  return !!meta && /olympic/i.test(meta.level)
}

// "F" for a final, "SF" for a semi-final, "H" for a heat, "" otherwise.
export function raceRound(meta: VideoMetaDataType | null | undefined) {
  if (!meta) return ""
  const name = (meta.name ?? "").toLowerCase().trim()
  if (/semi/.test(name)) return "SF"
  if (/final|\bf$/.test(name)) return "F"
  if (/heat/.test(name)) return "H"
  return ""
}

export function raceNameParts(meta: VideoMetaDataType | null | undefined) {
  if (!meta) return { gender: "", distance: "", style: "", round: "" }
  const styleKey = (meta.style ?? "").toLowerCase()
  return {
    gender: GENDER_SHORT[(meta.gender ?? "").toLowerCase()] ?? (meta.gender ?? "").slice(0, 1).toUpperCase(),
    distance: String(meta.distance ?? ""),
    style: STYLE_SHORT[styleKey] ?? styleKey.split(/\s+/)[0],
    round: raceRound(meta),
  }
}

// Label of the competition record: "OR" at the Olympics, "CR" elsewhere.
export function recordLabel(meta: VideoMetaDataType | null | undefined) {
  return isOlympic(meta) ? "OR" : "CR"
}

// Text shown by the event logo when the event has no dedicated logo.
export function eventLabel(meta: VideoMetaDataType | null | undefined) {
  if (!meta) return ""
  return `${meta.level} ${meta.year}`.trim().toUpperCase()
}
