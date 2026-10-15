import { useMemo } from "react"
import { tokenizeJson } from "./json"
import styles from "./index.module.less"

interface JsonBlockProps {
  value: unknown
  maxHeight?: number
}

// Read-only, highlighted, pretty-printed JSON.
function JsonBlock({ value, maxHeight = 360 }: JsonBlockProps) {
  const text = useMemo(() => (typeof value === "string" ? value : JSON.stringify(value, null, 2)), [value])
  const tokens = useMemo(() => tokenizeJson(text), [text])
  return (
    <pre className={styles.jsonBlock} style={{ maxHeight }}>
      {tokens.map((t, i) => <span key={i} className={styles[t.kind]}>{t.text}</span>)}
    </pre>
  )
}

export default JsonBlock
