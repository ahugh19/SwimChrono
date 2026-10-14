import { Group, Rect, Line, Text } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { TRIGGER_COMP_START_END, rectBorderRadius, triggerEndBorderColor, triggerStartBorderColor, triggerEndDurationBorderColor, triggerStartBorderColorInvisible, triggerEndBorderColorInvisible, triggerEndDurationBorderColorInvisible, durationRectHandleWidth } from '../../../../../utils/values';
import { useThemeColors } from '../../../../../utils/theme';

export type IntervalEdge = 'start' | 'end' | 'move'

interface DurationRectProps {
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  label?: string,
  triggerCompType: string,
  visibility: boolean,
  edited: boolean,
  showHandles: boolean,
  onMouseMoveRect: () => void,
  onMouseLeaveRect: () => void,
  onPointerDown: (edge: IntervalEdge, e: KonvaEventObject<MouseEvent>) => void,
}

function setCursor(e: KonvaEventObject<MouseEvent>, cursor: string) {
  const container = e.target.getStage()?.container()
  if (container) container.style.cursor = cursor
}

function DurationRect(props: DurationRectProps) {
  const { x, y, w, h, color, label, triggerCompType, visibility, edited, showHandles, onMouseMoveRect, onMouseLeaveRect, onPointerDown } = props;
  const palette = useThemeColors()

  const borderWidth = 2
  const endX = Math.max(x + borderWidth, x + w - borderWidth)
  const endColor = triggerCompType === TRIGGER_COMP_START_END
    ? (visibility ? triggerEndBorderColor : triggerEndBorderColorInvisible)
    : (visibility ? triggerEndDurationBorderColor : triggerEndDurationBorderColorInvisible)
  const startColor = visibility ? triggerStartBorderColor : triggerStartBorderColorInvisible
  const handleW = durationRectHandleWidth

  return (
    <Group>
      <Rect
        x={x}
        y={y + 2}
        width={Math.max(1, w)}
        height={h - 4}
        fill={color}
        cornerRadius={rectBorderRadius + 2}
        stroke={edited ? palette.accent : undefined}
        strokeWidth={edited ? 1 : 0}
        dash={edited ? [4, 3] : undefined}
        onMouseDown={(e) => onPointerDown('move', e)}
        onMouseMove={onMouseMoveRect}
        onMouseLeave={onMouseLeaveRect}
        onMouseEnter={(e) => setCursor(e, 'grab')}
        onMouseOut={(e) => setCursor(e, '')}
      />
      {label && w > 36 && (
        <Text
          x={x + 8}
          y={y + 2}
          width={Math.max(0, w - 16)}
          height={h - 4}
          verticalAlign="middle"
          text={label}
          fontSize={10}
          fill={visibility ? palette.textBright : palette.text}
          wrap="none"
          ellipsis
          listening={false}
        />
      )}
      <Line points={[x + 1, y + 2, x + 1, y + h - 2]} stroke={startColor} strokeWidth={borderWidth} listening={false} />
      <Line points={[endX, y + 2, endX, y + h - 2]} stroke={endColor} strokeWidth={borderWidth} listening={false} />
      {/* resize handles: always hit-testable, drawn only on hover / selection */}
      <Rect
        x={x - handleW / 2}
        y={y}
        width={handleW}
        height={h}
        fill={palette.accent}
        opacity={showHandles ? 0.9 : 0}
        cornerRadius={2}
        onMouseDown={(e) => onPointerDown('start', e)}
        onMouseEnter={(e) => setCursor(e, 'ew-resize')}
        onMouseLeave={(e) => setCursor(e, '')}
      />
      <Rect
        x={x + w - handleW / 2}
        y={y}
        width={handleW}
        height={h}
        fill={palette.accent}
        opacity={showHandles ? 0.9 : 0}
        cornerRadius={2}
        onMouseDown={(e) => onPointerDown('end', e)}
        onMouseEnter={(e) => setCursor(e, 'ew-resize')}
        onMouseLeave={(e) => setCursor(e, '')}
      />
    </Group>
  );
}

export default DurationRect
