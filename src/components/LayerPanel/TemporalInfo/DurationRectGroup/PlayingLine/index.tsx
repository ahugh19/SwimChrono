import { Line, Shape } from 'react-konva';
import { uiBlue } from '../../../../../utils/values';
import { useThemeColors } from '../../../../../utils/theme';

interface PlayingLineProps {
  playingLineX: number,
  playingLineY1: number,
  playingLineY2: number,
}

function PlayingLine(props: PlayingLineProps) {
  const { playingLineX, playingLineY1 } = props
  const palette = useThemeColors()

  return (
    <>
      <Line
        key={`playingLine`}
        points={[playingLineX, playingLineY1, playingLineX, 10000]}
        stroke={uiBlue}
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      />
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(playingLineX - 4, playingLineY1);
          context.lineTo(playingLineX + 4, playingLineY1);
          context.lineTo(playingLineX, playingLineY1 + 4 * 1.732);
          context.closePath();
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        fill={uiBlue}
        stroke={uiBlue}
        strokeWidth={2}
      />
      <Line
        points={[playingLineX, playingLineY1 + 2 * 1.732, playingLineX, playingLineY1 + 4 * 1.732]}
        stroke={palette.background}
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      />
    </>

  )
}

export default PlayingLine
