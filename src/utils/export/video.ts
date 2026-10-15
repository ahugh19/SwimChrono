import { Muxer, ArrayBufferTarget } from "mp4-muxer"
import { Store } from "../../store"
import { createOverlayRenderer, loadFontCss, serializeOverlay, svgMarkupToImage } from "./overlay"

export type ExportFormat = "mp4" | "webm"

export interface ExportVideoOptions {
  store: Store
  sourceVideo: HTMLVideoElement
  overlaySize: { width: number; height: number } // on-screen overlay size (viewBox)
  start: number // seconds, video time
  end: number
  fps: number
  width: number
  height: number
  format: ExportFormat
  onProgress?: (done: number, total: number) => void
  signal?: AbortSignal
}

const AVC_CODEC = "avc1.640028" // H.264 High profile, level 4.0 (up to 1080p30 / 720p60)

// MP4 needs WebCodecs with an H.264 encoder (Chrome, Edge, Safari 16.4+).
export async function detectExportFormat(width: number, height: number, fps: number): Promise<ExportFormat | null> {
  if (typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined") {
    try {
      const support = await VideoEncoder.isConfigSupported({ codec: AVC_CODEC, width, height, framerate: fps })
      if (support.supported) return "mp4"
    } catch {
      // fall through
    }
  }
  if (typeof MediaRecorder !== "undefined" && typeof HTMLCanvasElement.prototype.captureStream === "function") return "webm"
  return null
}

function once(el: EventTarget, type: string, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => { el.removeEventListener(type, onEvent); reject(new DOMException("Aborted", "AbortError")) }
    const onEvent = () => { signal?.removeEventListener("abort", onAbort); resolve() }
    el.addEventListener(type, onEvent, { once: true })
    signal?.addEventListener("abort", onAbort, { once: true })
  })
}

async function openSourceVideo(src: string, signal?: AbortSignal): Promise<HTMLVideoElement> {
  const v = document.createElement("video")
  v.muted = true
  v.playsInline = true
  v.preload = "auto"
  v.crossOrigin = "anonymous"
  v.src = src
  if (v.readyState < 1) await once(v, "loadedmetadata", signal)
  return v
}

async function seek(v: HTMLVideoElement, t: number, signal?: AbortSignal) {
  if (Math.abs(v.currentTime - t) < 1e-4 && v.readyState >= 2) return
  const done = once(v, "seeked", signal)
  v.currentTime = t
  await done
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function exportVideo(opts: ExportVideoOptions): Promise<Blob> {
  const { store, sourceVideo, overlaySize, start, end, fps, width, height, format, onProgress, signal } = opts
  if (!store.currentVideoMetaData) throw new Error("No video loaded.")
  const framerate = store.currentVideoMetaData.framerate
  const total = Math.max(1, Math.round((end - start) * fps))
  const fontCss = await loadFontCss()
  const video = await openSourceVideo(sourceVideo.currentSrc || sourceVideo.src, signal)
  const renderer = createOverlayRenderer(store, overlaySize.width, overlaySize.height)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available.")

  async function drawFrame(i: number) {
    const t = start + i / fps
    await seek(video, t, signal)
    const svg = await renderer.render(Math.floor(t * framerate))
    const img = await svgMarkupToImage(serializeOverlay(svg, width, height, fontCss))
    ctx!.drawImage(video, 0, 0, width, height)
    ctx!.drawImage(img, 0, 0, width, height)
  }

  try {
    if (format === "mp4") {
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: { codec: "avc", width, height, frameRate: fps },
        fastStart: "in-memory",
        firstTimestampBehavior: "offset",
      })
      let encodeError: Error | null = null
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => { encodeError = e },
      })
      encoder.configure({
        codec: AVC_CODEC,
        width,
        height,
        bitrate: Math.round(width * height * fps * 0.12), // ~12 Mbps at 1080p50
        framerate: fps,
        avc: { format: "avc" },
      } as VideoEncoderConfig)
      const frameDuration = Math.round(1_000_000 / fps)
      for (let i = 0; i < total; i++) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError")
        if (encodeError) throw encodeError
        await drawFrame(i)
        const frame = new VideoFrame(canvas, { timestamp: i * frameDuration, duration: frameDuration })
        encoder.encode(frame, { keyFrame: i % (fps * 2) === 0 })
        frame.close()
        while (encoder.encodeQueueSize > 4) await sleep(5)
        onProgress?.(i + 1, total)
      }
      await encoder.flush()
      encoder.close()
      muxer.finalize()
      return new Blob([(muxer.target as ArrayBufferTarget).buffer], { type: "video/mp4" })
    }

    // WebM fallback: MediaRecorder samples the canvas in real time, so each
    // frame is held on screen for 1/fps before drawing the next one.
    const stream = canvas.captureStream(fps)
    const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "video/webm"
    const chunks: BlobPart[] = []
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    const stopped = once(recorder, "stop")
    await drawFrame(0)
    recorder.start(1000)
    const t0 = performance.now()
    for (let i = 0; i < total; i++) {
      if (signal?.aborted) { recorder.stop(); throw new DOMException("Aborted", "AbortError") }
      await drawFrame(i)
      onProgress?.(i + 1, total)
      const due = t0 + ((i + 1) * 1000) / fps
      const wait = due - performance.now()
      if (wait > 0) await sleep(wait)
    }
    recorder.stop()
    await stopped
    return new Blob(chunks, { type: mime.split(";")[0] })
  } finally {
    renderer.dispose()
    video.removeAttribute("src")
    video.load()
  }
}
