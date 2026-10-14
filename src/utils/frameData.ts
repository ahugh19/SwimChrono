import Papa from "papaparse"
import { VideoFrameDataType } from "../types"

export type ProgressCallback = (loadedBytes: number, totalBytes: number | null) => void

// Download a CSV while reporting progress, then parse it into frame rows
// sorted by frameId. Reading the body through a ReadableStream gives
// byte-level progress (Content-Length permitting) and lets the caller
// abort a stale download when the user switches video.
export async function loadFrameData(
  url: string,
  signal: AbortSignal,
  onProgress?: ProgressCallback,
): Promise<VideoFrameDataType[]> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const lengthHeader = response.headers.get("Content-Length")
  const total = lengthHeader ? parseInt(lengthHeader, 10) : null

  let csvText: string
  if (response.body && typeof TextDecoder !== "undefined") {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const parts: string[] = []
    let loaded = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      loaded += value.byteLength
      parts.push(decoder.decode(value, { stream: true }))
      onProgress?.(loaded, total)
    }
    parts.push(decoder.decode())
    csvText = parts.join("")
  } else {
    csvText = await response.text()
    onProgress?.(csvText.length, csvText.length)
  }

  return parseFrameCsv(csvText)
}

export function parseFrameCsv(csvText: string): VideoFrameDataType[] {
  const parsed = Papa.parse<VideoFrameDataType>(csvText, {
    header: true,
    dynamicTyping: true,
    delimiter: ",",
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  })
  return parsed.data
    .filter((d) => typeof d.frameId === "number")
    .sort((a, b) => a.frameId - b.frameId)
}
