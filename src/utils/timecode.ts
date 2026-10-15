// Timecode helpers: "mm:ss:ff" (or "h:mm:ss:ff") with frames at the video's
// frame rate. Plain numbers are accepted as seconds.

export function formatTimecode(seconds: number, fps: number): string {
  const total = Math.max(0, seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = Math.floor(total % 60)
  // floor (with a little tolerance) so a frame never rounds up to the next second
  const f = Math.floor((total - Math.floor(total)) * fps + 1e-6) % fps
  const core = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`
  return h > 0 ? `${h}:${core}` : core
}

// Returns seconds, or null when the text is not a valid timecode.
export function parseTimecode(text: string, fps: number): number | null {
  const t = text.trim()
  if (t === "") return null
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t)
  const parts = t.split(":").map((p) => p.trim())
  if (parts.length < 2 || parts.length > 4 || parts.some((p) => !/^\d+$/.test(p))) return null
  const nums = parts.map((p) => parseInt(p, 10))
  // mm:ss:ff, h:mm:ss:ff, or mm:ss (no frames)
  let h = 0, m = 0, s = 0, f = 0
  if (nums.length === 4) [h, m, s, f] = nums
  else if (nums.length === 3) [m, s, f] = nums
  else [m, s] = nums
  if (s >= 60 || m >= 60 && nums.length === 4 || f >= fps) return null
  return h * 3600 + m * 60 + s + f / fps
}
