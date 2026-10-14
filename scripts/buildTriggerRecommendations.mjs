// Aggregates the systematic-review annotations (public/labelTool/result-vis25.json)
// into a small summary used by the authoring tool's trigger recommendations.
// Run with: yarn build:recommendations  (the output is committed).
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = "labelTool/result-vis25.json"
const data = JSON.parse(readFileSync(join(root, "public", source), "utf8"))

const byData = {}
const median = (xs) => {
  if (xs.length === 0) return null
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

for (const vis of data.visList) {
  const relation = [...(vis.temporalRelation ?? [])].sort().join("+") || "unspecified"
  const event = vis.keyEvent || "unspecified"
  const duration = vis.duration > 0 ? vis.duration : null
  for (const label of vis.data ?? []) {
    const entry = (byData[label] ??= { total: 0, patterns: {}, durations: [] })
    entry.total += 1
    const key = `${relation}|${event}`
    entry.patterns[key] = (entry.patterns[key] ?? 0) + 1
    if (duration !== null) entry.durations.push(duration)
  }
}

const out = {
  source,
  generatedAt: new Date().toISOString().slice(0, 10),
  videos: data.videoList.length,
  annotations: data.visList.length,
  byData: Object.fromEntries(
    Object.entries(byData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, e]) => [label, {
        total: e.total,
        medianDuration: median(e.durations) === null ? null : Math.round(median(e.durations) * 100) / 100,
        patterns: Object.entries(e.patterns)
          .map(([key, count]) => { const [relation, event] = key.split("|"); return { relation, event, count } })
          .sort((a, b) => b.count - a.count),
      }]),
  ),
}

writeFileSync(join(root, "public/labelTool/trigger-recommendations.json"), JSON.stringify(out, null, 1) + "\n")
console.log(`wrote trigger-recommendations.json: ${Object.keys(out.byData).length} data labels, ${out.annotations} annotations`)
