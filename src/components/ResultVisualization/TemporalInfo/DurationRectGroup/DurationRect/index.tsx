import { Rect } from 'react-konva';
import { useThemeColors } from '../../../../../utils/theme';

interface DurationRectProps {
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  isVisInMotion: boolean,
  onMousseMoveRect: () => void,
  onMouseLeaveRect: () => void,
  onMouseClickRect: () => void,
}

function DurationRect(props: DurationRectProps) {
  const {x, y, w, h, color, isVisInMotion, onMousseMoveRect, onMouseLeaveRect, onMouseClickRect} = props;
  const palette = useThemeColors();

  const handleClick = () => {
    onMouseClickRect()
  };

  const handleMove = () => {
    onMousseMoveRect()
  }

  const handleLeave = () => {
    onMouseLeaveRect()
  }

  return (
    <Rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={color}
      strokeEnabled={isVisInMotion}
      stroke={palette.textBright}
      strokeWidth={1.5}
      cornerRadius={1}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    />
  );
}

export default DurationRect
