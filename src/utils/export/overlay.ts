import { createRoot, Root } from "react-dom/client"
import { DEFAULTSwimFlow2GLOBAL_blur } from "../values"
import { flushSync } from "react-dom"
import { createElement } from "react"
import { assetUrl } from "../assets"
import { Store } from "../../store"
import OverlaySvg from "../../components/VideoPanel/VisHolder/OverlaySvg"

// Helpers shared by the snapshot and video exports: the overlay svg is
// serialized with the OlympicStyle font inlined, rasterized through an
// <img>, and drawn over the video frame on a canvas.

const SVG_NS = "http://www.w3.org/2000/svg"
let fontCssPromise: Promise<string> | null = null

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

// @font-face rule with the font embedded, so the serialized svg renders the
// badge text the same way as the page does. Empty string when unavailable.
export function loadFontCss(): Promise<string> {
  if (!fontCssPromise) {
    fontCssPromise = fetch(assetUrl("font/Frutiger-55-Roman.otf"))
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((buf) => `@font-face{font-family:'OlympicStyle';src:url(data:font/otf;base64,${toBase64(buf)}) format('opentype');}`)
      .catch(() => "")
  }
  return fontCssPromise
}

// Clone of the overlay sized to `width` x `height` pixels while keeping the
// on-screen viewBox, so the export looks exactly like the editor.
export function serializeOverlay(svg: SVGSVGElement, width: number, height: number, fontCss: string): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${svg.clientWidth || width} ${svg.clientHeight || height}`)
  }
  clone.setAttribute("width", String(width))
  clone.setAttribute("height", String(height))
  clone.setAttribute("xmlns", SVG_NS)
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
  clone.removeAttribute("style")
  clone.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"))
  if (fontCss) {
    const style = document.createElementNS(SVG_NS, "style")
    style.textContent = fontCss
    clone.insertBefore(style, clone.firstChild)
  }
  return new XMLSerializer().serializeToString(clone)
}

export function svgMarkupToImage(markup: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("The overlay could not be rasterized.")) }
    img.src = url
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

const settle = () => new Promise<void>((resolve) => setTimeout(() => requestAnimationFrame(() => resolve()), 0))

export interface OverlayRenderer {
  // Renders the overlay for a frame index and returns the live svg element.
  render: (frameIndex: number) => Promise<SVGSVGElement>
  dispose: () => void
}

// Off-screen React root drawing the overlay at the editor's size for any
// frame, independent from the playback loop.
export function createOverlayRenderer(store: Store, width: number, height: number): OverlayRenderer {
  const container = document.createElement("div")
  container.style.cssText = `position:fixed;left:-100000px;top:0;width:${width}px;height:${height}px;pointer-events:none;`
  document.body.appendChild(container)
  const root: Root = createRoot(container)
  return {
    async render(frameIndex: number) {
      flushSync(() => {
        root.render(createElement(OverlaySvg, {
          width, height,
          layerList: store.layerList,
          videoMetaData: store.currentVideoMetaData,
          currentSwimmerVideo: store.currentSwimmerVideo,
          currentFrameIndex: frameIndex,
          blur: store.globalSetting.blur ?? DEFAULTSwimFlow2GLOBAL_blur,
        }))
      })
      // The vis components derive their text in effects: let them run.
      await settle()
      await settle()
      const svg = container.querySelector("svg")
      if (!svg) throw new Error("Overlay did not render.")
      return svg as SVGSVGElement
    },
    dispose() {
      root.unmount()
      container.remove()
    },
  }
}
