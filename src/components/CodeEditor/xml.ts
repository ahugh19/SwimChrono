// Tiny helpers for the svg code editor: a tokenizer for syntax highlighting
// and an indentation-based formatter. Both are deliberately small and only
// need to cope with well-formed svg markup.

export type TokenKind = "tag" | "attr" | "string" | "comment" | "text" | "punct"
export interface Token { kind: TokenKind; text: string }

export function tokenizeXml(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = src.length
  while (i < n) {
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i)
      const stop = end === -1 ? n : end + 3
      tokens.push({ kind: "comment", text: src.slice(i, stop) }); i = stop; continue
    }
    if (src[i] === "<") {
      // tag open: "<", "</", "<?" or "<!"
      let j = i + 1
      while (j < n && /[/?!]/.test(src[j])) j++
      while (j < n && /[\w:.-]/.test(src[j])) j++
      tokens.push({ kind: "tag", text: src.slice(i, j) }); i = j
      // attributes until ">"
      while (i < n && src[i] !== ">") {
        if (/\s/.test(src[i])) { let k = i; while (k < n && /\s/.test(src[k])) k++; tokens.push({ kind: "text", text: src.slice(i, k) }); i = k; continue }
        if (src[i] === '"' || src[i] === "'") {
          const q = src[i]; let k = src.indexOf(q, i + 1); k = k === -1 ? n - 1 : k
          tokens.push({ kind: "string", text: src.slice(i, k + 1) }); i = k + 1; continue
        }
        if (src[i] === "=" || src[i] === "/" || src[i] === "?") { tokens.push({ kind: "punct", text: src[i] }); i++; continue }
        let k = i; while (k < n && /[^\s=>/"']/.test(src[k])) k++
        if (k === i) k = i + 1
        tokens.push({ kind: "attr", text: src.slice(i, k) }); i = k
      }
      if (i < n) { tokens.push({ kind: "tag", text: ">" }); i++ }
      continue
    }
    let k = src.indexOf("<", i); if (k === -1) k = n
    tokens.push({ kind: "text", text: src.slice(i, k) }); i = k
  }
  return tokens
}

// Re-indents markup one element per line. Text content is kept inline.
export function formatXml(src: string, indent = "  "): string {
  const parts = src.replace(/>\s+</g, "><").trim().match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? []
  const out: string[] = []
  let depth = 0
  for (const raw of parts) {
    const part = raw.trim()
    if (!part) continue
    const isClose = /^<\//.test(part)
    const isSelfClosing = /\/>$/.test(part) || /^<[?!]/.test(part)
    const isOpen = /^<[^/?!]/.test(part) && !isSelfClosing
    if (isClose) depth = Math.max(0, depth - 1)
    if (part.startsWith("<")) {
      // put long attribute lists one per line
      const attrs = part.match(/^(<[\w:.-]+)((?:\s+[^\s=]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*(\/?>)$/)
      if (attrs && attrs[2].trim().length > 60) {
        const list = attrs[2].match(/[^\s=]+(?:=(?:"[^"]*"|'[^']*'))?/g) ?? []
        out.push(indent.repeat(depth) + attrs[1])
        list.forEach((a) => out.push(indent.repeat(depth + 1) + a))
        out.push(indent.repeat(depth) + attrs[3])
      } else {
        out.push(indent.repeat(depth) + part)
      }
    } else {
      out.push(indent.repeat(depth) + part)
    }
    if (isOpen) depth++
  }
  return out.join("\n")
}
