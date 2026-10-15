import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Modal, Form, Input, Select, Progress, Space, Typography, Alert, Row, Col } from 'antd'
import type { MenuProps } from 'antd'
import { DownloadOutlined, DownOutlined, FileTextOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Store } from '../../../store'
import { message } from '../../../utils/feedback'
import { exportSnapshot } from '../../../utils/export/snapshot'
import { detectExportFormat, exportVideo, ExportFormat } from '../../../utils/export/video'
import { downloadBlob } from '../../../utils/export/overlay'
import { formatClock } from '../../../utils'
import { formatTimecode, parseTimecode } from '../../../utils/timecode'

const { Text } = Typography

interface ExportMenuProps {
  store: Store | undefined
  onExportConfig: () => void
}

interface VideoFormValues {
  start: string // timecode mm:ss:ff at the source frame rate
  end: string
  scale: number // 1 = source size
  fps: number
  filename: string
}

// "Export" dropdown of the header: configuration json, a png of the
// current frame, or a video with the visualizations rendered in.
function ExportMenu({ store, onExportConfig }: ExportMenuProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat | null | undefined>(undefined)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number; startedAt: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [form] = Form.useForm<VideoFormValues>()

  const meta = store?.currentVideoMetaData
  const video = store?.videoElement
  const sourceWidth = video?.videoWidth || 1920
  const sourceHeight = video?.videoHeight || 1080
  const duration = video?.duration && Number.isFinite(video.duration) ? video.duration : 0
  const sourceFps = meta?.framerate ?? 50
  const toTc = (t: number) => formatTimecode(t, sourceFps)
  const fromTc = (t: string | undefined) => (t === undefined ? null : parseTimecode(t, sourceFps))
  const defaultFilename = (startSec: number, endSec: number) =>
    `swimchrono-${meta?.name ?? "video"}-${formatClock(startSec, 1).replace(":", "m")}-${formatClock(endSec, 1).replace(":", "m")}`

  // Live estimate of the work: frames to render and a rough duration
  // (measured: about 0.12 s per 1080p frame in Chrome).
  const wStart = Form.useWatch("start", form)
  const wEnd = Form.useWatch("end", form)
  const wScale = Form.useWatch("scale", form)
  const wFps = Form.useWatch("fps", form)
  const estimate = useMemo(() => {
    const seconds = Math.max(0, (fromTc(wEnd) ?? 0) - (fromTc(wStart) ?? 0))
    const frames = Math.round(seconds * (wFps ?? 0))
    const pixels = sourceWidth * sourceHeight * (wScale ?? 1) * (wScale ?? 1)
    const perFrame = 0.04 + 0.08 * (pixels / (1920 * 1080))
    return { frames, seconds: Math.round(frames * perFrame) }
  }, [wStart, wEnd, wScale, wFps, sourceWidth, sourceHeight])

  const sizeOptions = useMemo(() => [1, 2 / 3, 1 / 2].map((scale) => ({
    value: scale,
    label: `${Math.round(sourceWidth * scale)} × ${Math.round(sourceHeight * scale)}${scale === 1 ? " (source)" : ""}`,
  })), [sourceWidth, sourceHeight])

  useEffect(() => {
    if (!videoOpen) return
    const startSec = meta?.raceStartTime ?? 0
    form.setFieldsValue({ start: toTc(startSec), end: toTc(duration), scale: 1, fps: sourceFps, filename: defaultFilename(startSec, duration) })
    detectExportFormat(sourceWidth, sourceHeight, meta?.framerate ?? 50).then(setFormat)
  }, [videoOpen])

  async function snapshot() {
    if (!store?.videoElement || !store.svgElement) { message.warning("No video on screen yet."); return }
    try {
      const name = `swimchrono-${meta?.name ?? "video"}-${formatClock(store.videoElement.currentTime, 2).replace(":", "m")}s.png`
      await exportSnapshot(store.videoElement, store.svgElement, name)
      message.success(`Snapshot saved as ${name}`)
    } catch (e) {
      message.error(`Snapshot failed: ${(e as Error).message}`)
    }
  }

  async function startVideoExport() {
    if (!store?.videoElement || !store.svgElement || !meta) return
    const values = await form.validateFields()
    const fmt = format
    if (!fmt) { message.error("This browser cannot encode video."); return }
    const startSec = fromTc(values.start) ?? 0
    const endSec = fromTc(values.end) ?? duration
    const width = Math.round(sourceWidth * values.scale / 2) * 2
    const height = Math.round(sourceHeight * values.scale / 2) * 2
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setProgress({ done: 0, total: 1, startedAt: performance.now() })
    const wasPlaying = !store.videoElement.paused
    store.videoElement.pause()
    try {
      const blob = await exportVideo({
        store,
        sourceVideo: store.videoElement,
        overlaySize: { width: store.svgElement.clientWidth, height: store.svgElement.clientHeight },
        start: startSec,
        end: endSec,
        fps: values.fps,
        width,
        height,
        format: fmt,
        signal: controller.signal,
        onProgress: (done, total) => setProgress((p) => ({ done, total, startedAt: p?.startedAt ?? performance.now() })),
      })
      const base = (values.filename || defaultFilename(startSec, endSec)).trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\.(mp4|webm)$/i, "")
      const name = `${base}.${fmt}`
      downloadBlob(blob, name)
      message.success(`Video saved as ${name} (${(blob.size / 1_048_576).toFixed(1)} MB)`)
      setVideoOpen(false)
    } catch (e) {
      if ((e as Error).name === "AbortError") message.info("Export canceled.")
      else message.error(`Export failed: ${(e as Error).message}`)
    } finally {
      setRunning(false)
      setProgress(null)
      abortRef.current = null
      if (wasPlaying) store.videoElement.play()
    }
  }

  const items: MenuProps['items'] = [
    { key: 'config', icon: <FileTextOutlined />, label: 'Configuration (JSON)', onClick: onExportConfig },
    { key: 'snapshot', icon: <PictureOutlined />, label: 'Snapshot of this frame (PNG)', onClick: snapshot },
    { key: 'video', icon: <VideoCameraOutlined />, label: 'Video with visualizations…', onClick: () => setVideoOpen(true) },
  ]

  const percent = progress ? Math.round((progress.done / progress.total) * 100) : 0
  const eta = useMemo(() => {
    if (!progress || progress.done < 5) return null
    const elapsed = (performance.now() - progress.startedAt) / 1000
    const remaining = (elapsed / progress.done) * (progress.total - progress.done)
    return remaining < 90 ? `${Math.round(remaining)} s` : `${Math.round(remaining / 60)} min`
  }, [progress])

  const timecodeRule = { validator: (_r: unknown, v: string) => (fromTc(v) === null ? Promise.reject(new Error(`Use mm:ss:ff (frames at ${sourceFps} fps) or seconds`)) : Promise.resolve()) }
  const setFromPlayer = (field: "start" | "end") => {
    if (!video) return
    form.setFieldValue(field, toTc(video.currentTime))
    form.validateFields([field]).catch(() => undefined)
  }

  return (
    <>
      <Dropdown
        menu={{ items, style: { minWidth: 280, whiteSpace: "nowrap" } }}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{ minWidth: 280 }}
      >
        <Button icon={<DownloadOutlined />} aria-haspopup="menu">Export <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} /></Button>
      </Dropdown>
      <Modal
        title="Export video with visualizations"
        open={videoOpen}
        onCancel={() => { if (running) abortRef.current?.abort(); else setVideoOpen(false) }}
        maskClosable={!running}
        footer={
          <Space>
            <Button onClick={() => { if (running) abortRef.current?.abort(); else setVideoOpen(false) }}>{running ? "Cancel" : "Close"}</Button>
            <Button type="primary" onClick={startVideoExport} loading={running} disabled={format === null || format === undefined}>Start</Button>
          </Space>
        }
      >
        {format === null && <Alert type="warning" showIcon style={{ marginBottom: 12 }} message="This browser can encode neither MP4 (WebCodecs) nor WebM (MediaRecorder). Try Chrome, Edge or Safari 16.4+." />}
        {format === "webm" && <Alert type="info" showIcon style={{ marginBottom: 12 }} message="MP4 encoding is not available here; a WebM file will be recorded in real time (export takes as long as the clip)." />}
        <Form form={form} layout="vertical" size="small" disabled={running}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start"
                label="Start (mm:ss:ff)"
                rules={[{ required: true }, timecodeRule]}
                extra={meta ? `Race start in the data: ${toTc(meta.raceStartTime)}` : undefined}
              >
                <Input placeholder="mm:ss:ff" addonAfter={<Button type="link" size="small" style={{ padding: 0, height: "auto" }} onClick={() => setFromPlayer("start")}>use player time</Button>} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end"
                label="End (mm:ss:ff)"
                rules={[{ required: true }, timecodeRule, ({ getFieldValue }) => ({ validator: (_r, v) => { const e = fromTc(v), st = fromTc(getFieldValue("start")); return e !== null && st !== null && e <= st ? Promise.reject(new Error("End must be after start")) : Promise.resolve() } })]}
                extra={`Video ends at ${toTc(duration)}`}
              >
                <Input placeholder="mm:ss:ff" addonAfter={<Button type="link" size="small" style={{ padding: 0, height: "auto" }} onClick={() => setFromPlayer("end")}>use player time</Button>} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="scale" label="Size"><Select options={sizeOptions} /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fps" label="Export frame rate"><Select options={[meta?.framerate ?? 50, 30, 25].filter((v, i, a) => a.indexOf(v) === i).map((v) => ({ value: v, label: `${v} fps` }))} /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="filename" label="File name" rules={[{ required: true, message: "Enter a file name" }]}>
            <Input addonAfter={`.${format ?? "mp4"}`} />
          </Form.Item>
        </Form>
        <div style={{ padding: "8px 12px", borderRadius: 4, background: "var(--background-color-elevated)", border: "1px solid var(--border-color-soft)" }}>
          <div><Text strong>{estimate.frames} frames</Text><Text>, about {estimate.seconds < 90 ? `${estimate.seconds} s` : `${Math.round(estimate.seconds / 60)} min`}</Text></div>
          <div style={{ marginTop: 2 }}><Text type="secondary">Smaller size, lower frame rate or a shorter range make it faster.</Text></div>
          <div style={{ marginTop: 6 }}>
            <Text type="secondary">
              Output: {format === "mp4" ? "MP4 (H.264)" : format === "webm" ? "WebM" : "–"} at {wFps ?? sourceFps} fps, no audio. The timecodes above count frames at the source rate ({sourceFps} fps). The visualizations are rendered exactly as in the editor.
              {format === "webm" ? " WebM is recorded in real time, so it takes at least as long as the clip." : ""}
            </Text>
          </div>
        </div>
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 10 }}
          message="Keep this tab in the foreground while exporting. Browsers slow down timers in background tabs, which stalls the export."
        />
        {progress && (
          <div style={{ marginTop: 12 }}>
            <Progress percent={percent} status={running ? "active" : "normal"} />
            <Text type="secondary">{progress.done} / {progress.total} frames{eta ? ` · about ${eta} left` : ""}</Text>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ExportMenu
