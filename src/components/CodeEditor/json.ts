import type { Token } from "./xml"

// Tokenizer for pretty-printed JSON, used for read-only highlighted views.
export function tokenizeJson(src: string): Token[] {
  const tokens: Token[] = []
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(true|false|null)|([{}\[\],])|(\s+)|(.)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    if (m[1] !== undefined) {
      tokens.push({ kind: m[2] ? "attr" : "string", text: m[1] })
      if (m[2]) tokens.push({ kind: "punct", text: m[2] })
    } else if (m[3] !== undefined) tokens.push({ kind: "tag", text: m[3] })
    else if (m[4] !== undefined) tokens.push({ kind: "comment", text: m[4] })
    else if (m[5] !== undefined) tokens.push({ kind: "punct", text: m[5] })
    else tokens.push({ kind: "text", text: m[6] ?? m[7] ?? "" })
  }
  return tokens
}
