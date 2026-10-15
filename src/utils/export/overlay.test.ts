import { serializeOverlay } from "./overlay"

describe("serializeOverlay", () => {
  it("sizes the clone, keeps the viewBox and inlines the font", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 800 450")
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("class", "selectable")
    svg.appendChild(g)
    const out = serializeOverlay(svg, 1920, 1080, "@font-face{font-family:'OlympicStyle'}")
    expect(out).toContain('width="1920"')
    expect(out).toContain('height="1080"')
    expect(out).toContain('viewBox="0 0 800 450"')
    expect(out).toContain("@font-face")
    expect(out).not.toContain("selectable")
    expect(svg.getAttribute("width")).toBeNull() // the original is untouched
  })
})
