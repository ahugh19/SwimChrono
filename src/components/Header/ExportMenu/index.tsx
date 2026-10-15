import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Modal, Form, InputNumber, Select, Progress, Space, Typography, Alert } from 'antd'
import type { MenuProps } from 'antd'
import { DownloadOutlined, FileTextOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Store } from '../../../store'
import { message } from '../../../utils/feedback'
import { exportSnapshot } from '../../../utils/export/snapshot'
import { detectExportFormat, exportVideo, ExportFormat } from '../../../utils/export/video'
import { downloadBlob } from '../../../utils/export/overlay'
import { formatClock } from '../../../utils'

const { Text } = Typography

interface ExportMenuProps {
  store: Store | undefined
  onExportConfig: () => void
}

interface VideoFormValues {
  start: number
  end: number
  scale: number // 1 = source size
  fps: number
}

// "Export" dropdown of the header: configuration json, a png of the
// current frame, or a video with the visualizations rendered in.
function ExportMenu({ store, onExportConfig }: ExportMenuProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat | null | undefined>(undefined)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [form] = Form.useForm<VideoFormValues>()

  const meta = store?.currentVideoMetaData
  const video = store?.videoElement
  const sourceWidth = video?.videoWidth || 1920
  const sourceHeight = video?.videoHeight || 1080
  const duration = video?.duration && Number.isFinite(video.duration) ? video.duration : 0

  const sizeOptions = useMemo(() => [1, 2 / 3, 1 / 2].map((scale) => ({
    value: scale,
    label: `${Math.round(sourceWidth * scale)} × ${Math.round(sourceHeight * scale)}${scale === 1 ? " (source)" : ""}`,
  })), [sourceWidth, sourceHeight])

  useEffect(() => {
    if (!videoOpen) return
    form.setFieldsValue({ start: meta?.raceStartTime ?? 0, end: Math.round(duration * 100) / 100, scale: 1, fps: meta?.framerate ?? 50 })
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
    const width = Math.round(sourceWidth * values.scale / 2) * 2
    const height = Math.round(sourceHeight * values.scale / 2) * 2
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setProgress({ done: 0, total: 1 })
    const wasPlaying = !store.videoElement.paused
    store.videoElement.pause()
    try {
      const blob = await exportVideo({
        store,
        sourceVideo: store.videoElement,
        overlaySize: { width: store.svgElement.clientWidth, height: store.svgElement.clientHeight },
        start: values.start,
        end: values.end,
        fps: values.fps,
        width,
        height,
        format: fmt,
        signal: controller.signal,
        onProgress: (done, total) => setProgress({ done, total }),
      })
      const name = `swimchrono-${meta.name}-${formatClock(values.start, 1).replace(":", "m")}-${formatClock(values.end, 1).replace(":", "m")}.${fmt}`
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

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button icon={<DownloadOutlined />}>Export</Button>
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
          <Space size="middle">
            <Form.Item name="start" label="Start (s)" rules={[{ required: true }]}>
              <InputNumber min={0} max={duration} step={0.1} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="end" label="End (s)" rules={[{ required: true }, ({ getFieldValue }) => ({ validator: (_r, v) => v > getFieldValue("start") ? Promise.resolve() : Promise.reject(new Error("End must be after start")) })]}>
              <InputNumber min={0} max={duration} step={0.1} style={{ width: 120 }} />
            </Form.Item>
          </Space>
          <Space size="middle">
            <Form.Item name="scale" label="Size"><Select options={sizeOptions} style={{ width: 180 }} /></Form.Item>
            <Form.Item name="fps" label="Frame rate"><Select options={[meta?.framerate ?? 50, 30, 25].filter((v, i, a) => a.indexOf(v) === i).map((v) => ({ value: v, label: `${v} fps` }))} style={{ width: 110 }} /></Form.Item>
          </Space>
        </Form>
        <Text type="secondary">
          Output: {format === "mp4" ? "MP4 (H.264)" : format === "webm" ? "WebM" : "–"} · the visualizations are rendered exactly as shown in the editor · no audio.
        </Text>
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 10 }}
          message="Keep this tab in the foreground while exporting. Browsers slow down timers in background tabs, which stalls the export."
        />
        {progress && (
          <div style={{ marginTop: 12 }}>
            <Progress percent={percent} status={running ? "active" : "normal"} />
            <Text type="secondary">{progress.done} / {progress.total} frames</Text>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ExportMenu
