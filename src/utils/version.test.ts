import { APP_VERSION } from "./version"

describe("APP_VERSION", () => {
  it("is a semver string taken from package.json", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
