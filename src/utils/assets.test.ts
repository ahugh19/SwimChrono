import { assetUrl } from "./assets"

describe("assetUrl", () => {
  it("keeps relative paths relative when no base url is configured", () => {
    expect(assetUrl("video/test.mp4")).toBe("video/test.mp4")
    expect(assetUrl("/csv/a.csv")).toBe("csv/a.csv")
  })

  it("passes absolute urls through untouched", () => {
    expect(assetUrl("https://cdn.example.org/v.mp4")).toBe("https://cdn.example.org/v.mp4")
    expect(assetUrl("blob:abc")).toBe("blob:abc")
  })
})
