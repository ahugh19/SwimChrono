import { CustomizedIconType } from "../../../types"

interface CustomGlyphProps {
  icon: CustomizedIconType
  visibility: boolean
}

// Renders a user-supplied svg in place of a visualization's built-in glyph.
function CustomGlyph({ icon, visibility }: CustomGlyphProps) {
  if (!icon.svgContent) return null
  return (
    <g
      transform={`scale(${icon.size ?? 1})`}
      visibility={visibility && icon.visible !== false ? "visible" : "hidden"}
      dangerouslySetInnerHTML={{ __html: icon.svgContent }}
    />
  )
}

export default CustomGlyph
