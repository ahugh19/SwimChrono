import { loadFontCss, serializeOverlay, svgMarkupToImage, downloadBlob } from "./overlay"

// PNG of the frame currently shown in the editor, at the video's native size.
export async function exportSnapshot(video: HTMLVideoElement, overlay: SVGSVGElement, filename: string): Promise<void> {
  const width = video.videoWidth || overlay.clientWidth
  const height = video.videoHeight || overlay.clientHeight
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available.")
  ctx.drawImage(video, 0, 0, width, height)
  const img = await svgMarkupToImage(serializeOverlay(overlay, width, height, await loadFontCss()))
  ctx.drawImage(img, 0, 0, width, height)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
  if (!blob) throw new Error("The snapshot could not be encoded.")
  downloadBlob(blob, filename)
}
