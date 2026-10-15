import { tokenizeJson } from "./json"

describe("tokenizeJson", () => {
  it("distinguishes keys, strings, numbers and literals", () => {
    const kinds = tokenizeJson('{"a": "b", "n": 1.5, "t": true}').map((t) => t.kind)
    expect(kinds).toEqual(["punct", "attr", "punct", "text", "string", "punct", "text", "attr", "punct", "text", "tag", "punct", "text", "attr", "punct", "text", "comment", "punct"])
  })
})
