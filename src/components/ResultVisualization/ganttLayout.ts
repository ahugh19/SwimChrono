// Pure layout helpers for the result gantt charts. Kept free of React and
// Konva so the packing / grouping logic is unit-testable and memoisable.
import { VisType } from "../../types"
import {
  placementOptionsStringList, VIS_MOVEMENT_STATIC,
  rectColorDefault, rectColorMoving, rectColorStatic,
  rectColorBottomRight, rectColorBottomLeft, rectColorTopRight, rectColorTopLeft,
  rectColorFrontPlayer, rectColorBehindPlayer, rectColorAlong,
  VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT, VIS_PLACEMENT_SCREEN_BOTTOM_LEFT, VIS_PLACEMENT_SCREEN_TOP_RIGHT,
  VIS_PLACEMENT_SCREEN_TOP_LEFT, VIS_PLACEMENT_PLAYER_FRONT, VIS_PLACEMENT_PLAYER_BEHIND, VIS_PLACEMENT_LANE_ALONG,
} from "../../utils/values"

export type GroupType = "placement" | "movement"

export interface GanttGroup {
  key: string
  label: string
  color: string
  rows: VisType[][]
}

export interface GanttLayout {
  groups: GanttGroup[]
  rowCount: number
  itemCount: number
  maxEnd: number // latest relative end moment in seconds
}

// Geometry shared by the renderer and the height calculation.
export const GANTT = {
  rowHeight: 16,
  rowGap: 3,
  groupGap: 10,
  axisHeight: 22,
  titleHeight: 24,
  gutter: 118, // group labels on the left
  padding: 8,
  blockGap: 18, // between videos in the "all" view
}

export const MOVEMENT_STATIC = VIS_MOVEMENT_STATIC
export const MOVEMENT_GROUPS = [VIS_MOVEMENT_STATIC, "moving", "move with players"]

const placementColors: Record<string, string> = {
  [VIS_PLACEMENT_PLAYER_FRONT]: rectColorFrontPlayer,
  [VIS_PLACEMENT_PLAYER_BEHIND]: rectColorBehindPlayer,
  [VIS_PLACEMENT_SCREEN_BOTTOM_LEFT]: rectColorBottomLeft,
  [VIS_PLACEMENT_SCREEN_BOTTOM_RIGHT]: rectColorBottomRight,
  [VIS_PLACEMENT_SCREEN_TOP_LEFT]: rectColorTopLeft,
  [VIS_PLACEMENT_SCREEN_TOP_RIGHT]: rectColorTopRight,
  [VIS_PLACEMENT_LANE_ALONG]: rectColorAlong,
}

export function isMoving(vis: Pick<VisType, "movement">) {
  return vis.movement !== VIS_MOVEMENT_STATIC
}

export function groupKeyOf(vis: VisType, groupType: GroupType): string {
  return groupType === "movement" ? (vis.movement || "static") : (vis.placement || "others")
}

export function colorForGroup(key: string, groupType: GroupType): string {
  if (groupType === "movement") return key === VIS_MOVEMENT_STATIC ? rectColorStatic : rectColorMoving
  return placementColors[key] ?? rectColorDefault
}

export function relativeStart(vis: VisType) {
  return vis.relativeTimeInfo?.relativeStartMoment ?? 0
}

export function relativeEnd(vis: VisType) {
  return vis.relativeTimeInfo?.relativeEndMoment ?? relativeStart(vis) + Math.max(0, vis.duration)
}

function sameSet(a: string[] | undefined, b: string[] | undefined) {
  const x = a ?? [], y = b ?? []
  if (x.length !== y.length) return false
  const s = new Set(x)
  return y.every((v) => s.has(v))
}

// Pack items into rows: an item joins the first row whose items carry the
// same data set and don't overlap it in time; otherwise it opens a row.
export function packRows(items: VisType[]): VisType[][] {
  const sorted = [...items].sort((a, b) => a.startMoment - b.startMoment)
  const rows: VisType[][] = []
  for (const item of sorted) {
    const row = rows.find((r) => r.some((x) => sameSet(x.data, item.data)) && r.every((x) => x.endMoment <= item.startMoment))
    if (row) row.push(item)
    else rows.push([item])
  }
  return rows
}

export function layoutGantt(visList: VisType[], groupType: GroupType): GanttLayout {
  const order = groupType === "movement" ? MOVEMENT_GROUPS : placementOptionsStringList
  const buckets = new Map<string, VisType[]>()
  for (const vis of visList) {
    const key = groupKeyOf(vis, groupType)
    const bucket = buckets.get(key)
    if (bucket) bucket.push(vis)
    else buckets.set(key, [vis])
  }
  const keys = [
    ...order.filter((k) => buckets.has(k)),
    ...[...buckets.keys()].filter((k) => !order.includes(k)),
  ]
  const groups: GanttGroup[] = keys.map((key) => ({
    key,
    label: key,
    color: colorForGroup(key, groupType),
    rows: packRows(buckets.get(key) as VisType[]),
  }))
  const rowCount = groups.reduce((n, g) => n + g.rows.length, 0)
  const maxEnd = visList.reduce((m, v) => Math.max(m, relativeEnd(v)), 0)
  return { groups, rowCount, itemCount: visList.length, maxEnd: Math.max(maxEnd, 0.01) }
}

// Height of one video block (title optional) in pixels.
export function blockHeight(layout: GanttLayout, withTitle: boolean) {
  const rows = layout.rowCount * (GANTT.rowHeight + GANTT.rowGap)
  return (withTitle ? GANTT.titleHeight : 0) + GANTT.axisHeight + rows + layout.groups.length * GANTT.groupGap + GANTT.padding
}
