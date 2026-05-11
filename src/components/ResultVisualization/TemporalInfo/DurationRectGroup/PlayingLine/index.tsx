import { Line } from 'react-konva';
import { VideoType } from '../../../../../types';
import { useThemeColors } from '../../../../../utils/theme';

interface PlayingLineProps {
  video: VideoType,
  playingLineX: number,
  playingLineY1: number,
  playingLineY2: number,
}

function PlayingLine(props: PlayingLineProps) {
  const { video, playingLineX, playingLineY1, playingLineY2 } = props
  const palette = useThemeColors();
  return (
    <Line
      key={`playingLine-${video.key}`}
      points={[playingLineX, playingLineY1, playingLineX, playingLineY2]}
      stroke={palette.textBright}
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
    />
  )
}

export default PlayingLine
