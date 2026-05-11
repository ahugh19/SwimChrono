import { Rect, Line } from 'react-konva';
import { TRIGGER_COMP_START_END, rectBorderRadius, triggerEndBorderColor, triggerStartBorderColor, triggerEndDurationBorderColor, triggerStartBorderColorInvisible, triggerEndBorderColorInvisible, triggerEndDurationBorderColorInvisible } from '../../../../../utils/values';
import { useThemeColors } from '../../../../../utils/theme';

interface DurationRectProps {
  x: number,
  y: number,
  w: number,
  realStartW: number, // make the part (before video start) grey
  h: number,
  color: string,
  preStartColor: string,
  onMousseMoveRect: () => void,
  onMouseLeaveRect: () => void,
  onMouseClickRect: () => void,
  triggerCompType: string,
  visibility: boolean,
}

function DurationRect(props: DurationRectProps) {
  const { x, y, w, realStartW, h, color, preStartColor, triggerCompType, onMousseMoveRect, onMouseLeaveRect, onMouseClickRect, visibility } = props;
  const palette = useThemeColors()

  const triggerBorderWidthNormal = 2

  const handleClick = () => {
    onMouseClickRect()
  };

  const handleMove = () => {
    onMousseMoveRect()
  }

  const handleLeave = () => {
    onMouseLeaveRect()
  }

  function getEndX() {
    const _xEnd = x + w - triggerBorderWidthNormal
    if (_xEnd > x + triggerBorderWidthNormal) {
      return _xEnd
    } else {
      return x + triggerBorderWidthNormal
    }
  }

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={color}
        cornerRadius={rectBorderRadius}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      />
      <Line points={[x, y, x, y + h]}
        stroke={visibility ? triggerStartBorderColor : triggerStartBorderColorInvisible}
        strokeWidth={triggerBorderWidthNormal} />
      <Line points={[getEndX(), y, getEndX(), y + h]}
        stroke={triggerCompType === TRIGGER_COMP_START_END ? (visibility ? triggerEndBorderColor : triggerEndBorderColorInvisible) : (visibility ? triggerEndDurationBorderColor : triggerEndDurationBorderColorInvisible)}
        strokeWidth={triggerBorderWidthNormal} />
      <Rect
        x={5}
        y={y}
        width={realStartW > triggerBorderWidthNormal ? realStartW - triggerBorderWidthNormal - 3 : 0}
        height={h}
        fill={ x > triggerBorderWidthNormal ? palette.backgroundElevated : preStartColor}
        cornerRadius={rectBorderRadius}
        // onClick={handleClick}
        // onMouseMove={handleMove}
        // onMouseLeave={handleLeave}
      />
    </>
  );
}

export default DurationRect