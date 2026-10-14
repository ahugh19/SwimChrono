import { useMemo, useRef } from "react"
import { tokenizeXml } from "./xml"
import styles from "./index.module.less"

interface CodeEditorProps {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  minRows?: number
}

// Plain textarea with a highlighted copy painted underneath it. No
// dependency, good enough for svg snippets.
function CodeEditor({ value, onChange, placeholder, minRows = 12 }: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement | null>(null)
  const tokens = useMemo(() => tokenizeXml(value), [value])

  function syncScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const pre = preRef.current
    if (!pre) return
    pre.scrollTop = e.currentTarget.scrollTop
    pre.scrollLeft = e.currentTarget.scrollLeft
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault()
      const el = e.currentTarget
      const { selectionStart, selectionEnd } = el
      const next = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd)
      onChange(next)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = selectionStart + 2 })
    }
  }

  const rows = Math.max(minRows, value.split("\n").length + 1)

  return (
    <div className={styles.editor} style={{ minHeight: `${rows * 1.5}em` }}>
      <pre ref={preRef} className={styles.highlight} aria-hidden="true">
        {tokens.map((t, i) => <span key={i} className={styles[t.kind]}>{t.text}</span>)}
        {"\n"}
      </pre>
      <textarea
        className={styles.input}
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        wrap="off"
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default CodeEditor
