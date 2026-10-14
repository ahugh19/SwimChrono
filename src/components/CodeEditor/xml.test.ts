import { formatXml, tokenizeXml } from "./xml"

describe("tokenizeXml", () => {
  it("splits tags, attributes, strings and text", () => {
    const kinds = tokenizeXml('<svg viewBox="0 0 1 1"><!-- c --><path d="M0 0"/>hi</svg>').map((t) => t.kind)
    expect(kinds).toEqual(["tag", "text", "attr", "punct", "string", "tag", "comment", "tag", "text", "attr", "punct", "string", "punct", "tag", "text", "tag", "tag"])
  })
})

describe("formatXml", () => {
  it("indents nested elements", () => {
    expect(formatXml('<svg><g><path d="M0 0"/></g></svg>')).toBe('<svg>\n  <g>\n    <path d="M0 0"/>\n  </g>\n</svg>')
  })
})
