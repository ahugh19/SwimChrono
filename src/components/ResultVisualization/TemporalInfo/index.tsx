import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store";
import { Button, Space, Tag, Switch, Tooltip, Select, Segmented, Tabs, Typography, Empty, Spin, Slider, Badge } from 'antd'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import { PlayCircleFilled, PauseCircleFilled, LeftOutlined, RightOutlined, StarTwoTone } from '@ant-design/icons'
import styles from "./index.module.less"
import { VideoType, VisType } from '../../../types'
import VisTable from './VisTable'
import Legend from './Legend'
import GanttChart, { GanttBlock } from './GanttChart'
import { GroupType, layoutGantt } from '../ganttLayout'
import ResizeHandle, { readStoredSize, writeStoredSize } from '../../ResizeHandle'
import PageHeader from '../../PageHeader'
import { formatClock } from '../../../utils'
import { uiHighlightStar } from '../../../utils/values'
import { useThemeColors } from '../../../utils/theme'

const { Text } = Typography

const GANTT_HEIGHT_KEY = "swimchrono.result.ganttHeight"
// The bboxes were labelled on a 1280x720 frame and have always been shown
// on a fixed 640x360 player (exactly half size). Keep the player fixed so
// the stored coordinates stay valid without any further transform.
const PLAYER_WIDTH = 640
const PLAYER_HEIGHT = 360

interface TemporalInfoProps extends IComponentPropsWithStore { }

function videoLabel(video: VideoType) {
  return `${video.year} · ${video.gender} ${video.distance} m ${video.style} · ${video.level}`
}

function TemporalInfo(props: TemporalInfoProps) {
  const store = props.store as Store
  const palette = useThemeColors()

  const [groupType, setGroupType] = useState<GroupType>('placement')
  const [showAll, setShowAll] = useState(false)
  const [commonScale, setCommonScale] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [currentVideoKey, setCurrentVideoKey] = useState<string | null>(null)
  const [selectedVisKey, setSelectedVisKey] = useState<string | null>(null)
  const [hovered, setHovered] = useState<{ vis: VisType; x: number; y: number } | null>(null)
  const [filteredKeys, setFilteredKeys] = useState<Set<string> | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  // Off by default so the overlay never gets in the way of watching the video.
  const [bboxVisible, setBboxVisible] = useState(false)
  const [sideTab, setSideTab] = useState<'now' | 'table'>('now')
  const [ganttHeight, setGanttHeight] = useState<number>(() => readStoredSize(GANTT_HEIGHT_KEY) ?? 260)
  const [ganttWidth, setGanttWidth] = useState(800)

  const playerRef = useRef<any>(null)
  const pendingSeek = useRef<number | null>(null)
  const ganttScrollRef = useRef<HTMLDivElement | null>(null)
  const bboxCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const videos = store.processedVideoData
  const visLists = store.processedVisData

  const loadedOnce = useRef(false)
  useEffect(() => {
    if (loadedOnce.current) return // StrictMode runs effects twice in dev
    loadedOnce.current = true
    store.getProcessedData()
    store.getExistingData()
  }, [])

  useEffect(() => {
    if (currentVideoKey === null && videos.length > 0) {
      setCurrentVideoKey(videos[0].key)
      pendingSeek.current = videos[0].startMoment
    }
  }, [videos.length])

  // Layout every video once per grouping; "all" view reuses the same blocks.
  const blocks: GanttBlock[] = useMemo(
    () => videos.map((video, i) => ({ video, layout: layoutGantt(visLists[i] ?? [], groupType) })),
    [videos, visLists, groupType],
  )
  const currentIndex = videos.findIndex((v) => v.key === currentVideoKey)
  const currentVideo = currentIndex >= 0 ? videos[currentIndex] : null
  const currentVisList = currentIndex >= 0 ? (visLists[currentIndex] ?? []) : []
  const visibleBlocks = showAll ? blocks : blocks.filter((b) => b.video.key === currentVideoKey)
  const presentKeys = useMemo(() => {
    const keys = new Set<string>()
    visibleBlocks.forEach((b) => b.layout.groups.forEach((g) => keys.add(g.key)))
    return keys
  }, [visibleBlocks])

  const inFilter = useCallback((vis: VisType) => filteredKeys === null || filteredKeys.has(vis.key), [filteredKeys])
  const activeVis = useMemo(
    () => currentVisList.filter((v) => v.startMoment <= currentTime && currentTime < v.endMoment && inFilter(v)),
    [currentVisList, currentTime, inFilter],
  )
  const selectedVis = currentVisList.find((v) => v.key === selectedVisKey) ?? null

  // ---- player plumbing
  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, 'seconds')
    setCurrentTime(seconds)
  }, [])

  function selectVideo(key: string, thenSeek?: number) {
    const video = videos.find((v) => v.key === key)
    if (!video) return
    pendingSeek.current = thenSeek ?? video.startMoment
    setCurrentVideoKey(key)
    setSelectedVisKey(null)
    setFilteredKeys(null)
    setPlaying(false)
    setCurrentTime(pendingSeek.current)
  }

  function onPlayerReady() {
    if (pendingSeek.current !== null) {
      seek(pendingSeek.current)
      pendingSeek.current = null
    }
  }

  function selectVis(vis: VisType, video?: VideoType) {
    const targetKey = video?.key ?? vis.videoKey
    if (targetKey !== currentVideoKey) {
      selectVideo(targetKey, vis.startMoment)
      setSelectedVisKey(vis.key)
      return
    }
    setSelectedVisKey(vis.key)
    seek(vis.startMoment)
  }

  function onGanttSeek(video: VideoType, relativeSeconds: number) {
    if (video.key !== currentVideoKey) selectVideo(video.key, video.startMoment + relativeSeconds)
    else seek(video.startMoment + relativeSeconds)
  }

  // Table "to start / to end" buttons go through the store.
  useEffect(() => {
    if (store.seekTime === null) return
    seek(store.seekTime)
    store.setVideoPlayerSeekTime(null)
  }, [store.seekTime])

  // ---- measurements
  useEffect(() => {
    const el = ganttScrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setGanttWidth(el.clientWidth))
    ro.observe(el)
    setGanttWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => { writeStoredSize(GANTT_HEIGHT_KEY, ganttHeight) }, [ganttHeight])

  // ctrl / cmd + wheel zooms the gantt horizontally
  useEffect(() => {
    const el = ganttScrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      setZoom((z) => Math.min(12, Math.max(1, z * (e.deltaY > 0 ? 1 / 1.15 : 1.15))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ---- bbox overlay on the video
  useEffect(() => {
    const canvas = bboxCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT)
    if (!bboxVisible) return
    // Same mapping as the labelling tool used: half-size frame, 4px inset.
    const draw = (vis: VisType, stroke: string, lineWidth: number, fill?: string, dash?: number[]) => {
      const b = vis.visBbox
      const x = b.x1 / 2, y = (b.y1 - 4) / 2, w = (b.x2 - b.x1 - 4) / 2, h = (b.y2 - b.y1 - 4) / 2
      ctx.save()
      ctx.setLineDash(dash ?? [])
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h) }
      ctx.strokeStyle = stroke
      ctx.lineWidth = lineWidth
      ctx.strokeRect(x, y, w, h)
      ctx.restore()
    }
    activeVis.forEach((v) => { if (v.key !== selectedVisKey) draw(v, 'rgba(255, 165, 0, 0.9)', 1.5) })
    if (hovered && hovered.vis.videoKey === currentVideoKey) draw(hovered.vis, 'rgba(255,255,255,0.9)', 1.5, undefined, [4, 3])
    if (selectedVis) draw(selectedVis, palette.accent, 2.5, palette.accentSoft)
  }, [activeVis, selectedVis, hovered, bboxVisible, currentVideoKey])

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
    if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p) }
  }

  const loading = videos.length === 0
  const url = currentVideo?.url ?? ''
  const urlName = store.urlList.find((u) => u.key === url)?.urlVideoName ?? ''
  const annotationCount = visLists.reduce((n, l) => n + l.length, 0)

  return (
    <div className={styles.page} onKeyDown={onKeyDown}>
      <PageHeader
        title="Results"
        extra={<Tag bordered={false}>{videos.length} videos · {annotationCount} annotations</Tag>}
        tour={{
          storageKey: "swimchrono.tourSeen.results",
          steps: [
            { title: '🎥 Pick a video', description: 'This list holds the 31 race videos of the review. You can search it, or step through it with the arrow buttons.', target: () => document.querySelector('[data-tour="video-select"]') as HTMLElement },
            { title: '📺 Player', description: 'The chosen video plays here. Turn on "bbox" to draw the annotations that are visible right now. Orange is visible, blue is selected, dashed is hovered.', target: () => document.querySelector('[data-tour="player"]') as HTMLElement },
            { title: '🗂 Annotations', description: 'The first tab lists what is on screen at the current time. Click a card to select it. The second tab is the full table of the video. When you filter a column, the other bars in the chart fade out and their boxes disappear from the video.', target: () => document.querySelector('[data-tour="side"]') as HTMLElement, placement: 'left' },
            { title: '🎛 Chart controls', description: 'Group the bars by placement or by movement. Show all videos at once, on one shared time scale if you like. Zoom the chart. The legend explains the colours.', target: () => document.querySelector('[data-tour="gantt-bar"]') as HTMLElement, placement: 'top' },
            { title: '📊 Gantt chart', description: 'Each bar is one annotation. Click a bar to select it and jump the player to it. Drag on the chart to move the playhead. Hold Ctrl (or ⌘) and scroll to zoom. Press Space to play. Drag the gutter above the chart to change its height.', target: () => document.querySelector('[data-tour="gantt"]') as HTMLElement, placement: 'top' },
          ],
        }}
      >
        <Space size={6} data-tour="video-select">
          <Text className={styles.label}>Video</Text>
          <Button size="small" icon={<LeftOutlined />} disabled={currentIndex <= 0} onClick={() => selectVideo(videos[currentIndex - 1].key)} title="Previous video" />
          <Select
            size="small"
            className={styles.videoSelect}
            value={currentVideoKey ?? undefined}
            placeholder={loading ? "loading…" : "choose a video"}
            onChange={(key) => selectVideo(key)}
            options={videos.map((v, i) => ({ value: v.key, label: `${i + 1}. ${videoLabel(v)}` }))}
            showSearch
            optionFilterProp="label"
          />
          <Button size="small" icon={<RightOutlined />} disabled={currentIndex < 0 || currentIndex >= videos.length - 1} onClick={() => selectVideo(videos[currentIndex + 1].key)} title="Next video" />
        </Space>
      </PageHeader>

      <div className={styles.upper}>
        <div className={styles.playerArea} data-tour="player">
          <div className={styles.playerBox}>
            {url && (
              <ReactPlayer
                ref={playerRef}
                url={url}
                width={PLAYER_WIDTH}
                height={PLAYER_HEIGHT}
                playing={playing}
                controls={true}
                onReady={onPlayerReady}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onProgress={(v: OnProgressProps) => setCurrentTime(v.playedSeconds)}
                progressInterval={100}
              />
            )}
            <canvas className={styles.bboxCanvas} ref={bboxCanvasRef} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} />
          </div>
          <div className={styles.controls}>
            <Button type="primary" shape="circle" size="small" icon={playing ? <PauseCircleFilled /> : <PlayCircleFilled />} onClick={() => setPlaying((p) => !p)} title="Play / pause (space)" />
            <Tag className={styles.time} title="Player time · time relative to the race start">
              {formatClock(currentTime, 2)}
              {currentVideo && <Text type="secondary" style={{ marginLeft: 6, fontSize: 11 }}>race {currentTime - currentVideo.startMoment < 0 ? '−' : '+'}{Math.abs(currentTime - currentVideo.startMoment).toFixed(2)} s</Text>}
            </Tag>
            <Switch size="small" checked={bboxVisible} onChange={setBboxVisible} />
            <Text className={styles.label}>bbox</Text>
            {filteredKeys && <Tag color="blue" closable onClose={() => setFilteredKeys(null)}>table filter: {filteredKeys.size} shown</Tag>}
            <span className={styles.spacer} />
            <Tooltip title={url}><Text type="secondary" ellipsis className={styles.urlName}>{urlName || url}</Text></Tooltip>
          </div>
        </div>

        <div className={styles.side} data-tour="side">
          <Tabs
            size="small"
            className={styles.sideTabs}
            activeKey={sideTab}
            onChange={(k) => setSideTab(k as 'now' | 'table')}
            items={[
              {
                key: 'now',
                label: <Badge size="small" count={activeVis.length} offset={[10, 0]} color={palette.accent} showZero={false}>At this moment</Badge>,
                children: (
                  <div className={styles.nowList}>
                    {activeVis.length === 0
                      ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No annotation at this moment" />
                      : activeVis.map((vis) => (
                        <div
                          key={vis.key}
                          className={`${styles.nowCard} ${vis.key === selectedVisKey ? styles.selected : ''}`}
                          onClick={() => setSelectedVisKey(vis.key === selectedVisKey ? null : vis.key)}
                          onMouseEnter={(e) => setHovered({ vis, x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <div className={styles.nowHead}>
                            <Text strong>{formatClock(vis.startMoment, 2)} – {formatClock(vis.endMoment, 2)}</Text>
                            <Text type="secondary">{vis.duration.toFixed(2)} s</Text>
                            {vis.highlight === 'true' && <StarTwoTone twoToneColor={uiHighlightStar} title="highlighted case" />}
                          </div>
                          <Space size={[4, 4]} wrap>
                            <Tag color="geekblue">{vis.placement}</Tag>
                            <Tag color={vis.movement === 'static' ? 'default' : 'purple'}>{vis.movement}</Tag>
                            {vis.keyEvent && <Tag>{vis.temporalRelation.join('/')} {vis.keyEvent}</Tag>}
                          </Space>
                          <div className={styles.nowRow}><Text type="secondary">data</Text>{vis.data.map((d) => <Tag key={d}>{d}</Tag>)}</div>
                          <div className={styles.nowRow}><Text type="secondary">vis</Text>{vis.visType.map((d) => <Tag key={d}>{d}</Tag>)}</div>
                          {vis.note && <Text type="secondary" className={styles.note}>{vis.note}</Text>}
                        </div>
                      ))}
                  </div>
                ),
              },
              {
                key: 'table',
                label: `Table (${currentVisList.length})`,
                children: (
                  <div className={styles.tableWrap}>
                    <VisTable
                      visList={currentVisList}
                      currentVideo={currentVideo}
                      currentTime={currentTime}
                      selectedVisKey={selectedVisKey}
                      onSelectVis={(vis) => selectVis(vis)}
                      onFilteredChange={setFilteredKeys}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <ResizeHandle direction="row" value={ganttHeight} min={120} max={Math.max(200, window.innerHeight - 320)} invert onChange={setGanttHeight} onDoubleClick={() => setGanttHeight(260)} />

      <div className={styles.ganttBar} data-tour="gantt-bar">
        <Space size={6}>
          <Text className={styles.label}>Group by</Text>
          <Segmented size="small" value={groupType} onChange={(v) => setGroupType(v as GroupType)} options={[{ label: 'placement', value: 'placement' }, { label: 'movement', value: 'movement' }]} />
        </Space>
        <span className={styles.divider} />
        <Space size={6}>
          <Switch size="small" checked={showAll} onChange={setShowAll} />
          <Text className={styles.label}>All videos</Text>
          {showAll && <>
            <Switch size="small" checked={commonScale} onChange={setCommonScale} style={{ marginLeft: 8 }} />
            <Text className={styles.label}>Same time scale</Text>
          </>}
        </Space>
        <span className={styles.divider} />
        <Space size={6} className={styles.zoom}>
          <Text className={styles.label}>Zoom</Text>
          <Slider min={1} max={12} step={0.1} value={zoom} onChange={setZoom} style={{ width: 110, margin: 0 }} tooltip={{ formatter: (v) => `${v?.toFixed(1)}×` }} />
          <Button size="small" type="text" disabled={zoom === 1} onClick={() => setZoom(1)}>reset</Button>
          <Text type="secondary" className={styles.hint}>ctrl/⌘ + wheel · drag to scrub · space to play</Text>
        </Space>
        <span className={styles.spacer} />
        <Legend groupType={groupType} presentKeys={presentKeys} />
      </div>
      <div className={styles.gantt} style={{ height: ganttHeight }} ref={ganttScrollRef} tabIndex={0} data-tour="gantt">
        {loading
          ? <div className={styles.loading}><Spin /> <Text type="secondary">Loading annotations…</Text></div>
          : <GanttChart
            blocks={visibleBlocks}
            width={ganttWidth - 2}
            zoom={zoom}
            showTitles={showAll}
            commonScale={showAll && commonScale}
            currentVideoKey={currentVideoKey}
            currentTime={currentTime}
            selectedVisKey={selectedVisKey}
            hoveredVisKey={hovered?.vis.key ?? null}
            filteredKeys={filteredKeys}
            onHover={(vis, x, y) => setHovered(vis ? { vis, x, y } : null)}
            onSelectVis={selectVis}
            onSeek={onGanttSeek}
          />}
      </div>

      {hovered && hovered.x > 0 && (
        <div className={styles.tooltip} style={{ left: Math.min(hovered.x + 14, window.innerWidth - 340), top: Math.min(hovered.y + 14, window.innerHeight - 160) }}>
          <div><b>{formatClock(hovered.vis.startMoment, 2)} – {formatClock(hovered.vis.endMoment, 2)}</b> · {hovered.vis.duration.toFixed(2)} s</div>
          <div>{hovered.vis.placement} · {hovered.vis.movement}{hovered.vis.keyEvent ? ` · ${hovered.vis.temporalRelation.join('/')} ${hovered.vis.keyEvent}` : ''}</div>
          <div>data: {hovered.vis.data.join(', ')}</div>
          <div>vis: {hovered.vis.visType.join(', ')}</div>
          <div className={styles.tooltipHint}>click: select and seek · drag on the chart: scrub</div>
        </div>
      )}
    </div>
  )
}

export default inject('store')(observer(TemporalInfo))
