import { Line } from 'react-konva';
import { useThemeColors } from '../../../utils/theme';

interface TimelineAxisProps {
  canvasWidth: number
  canvasContentPadding: number
}

function TimelineAxis(props: TimelineAxisProps) {
  const { canvasWidth, canvasContentPadding } = props;
  const palette = useThemeColors();

  const tickLineHeight = 10 // major tick height
  const tickTextHeight = 12 // tick label height
  const tickMargin = 2 // gap between tick label and tick mark

  const tickLineStartX = canvasContentPadding
  const tickLineStartY = tickTextHeight + tickMargin
  const tickLineEndY = tickLineStartY + tickLineHeight

  const axisStartX = canvasContentPadding
  const axisY = tickLineEndY

  const chartWidth = canvasWidth - 2 * canvasContentPadding

  const timelineAxisY = axisY
  const timelineAxisXMin = axisStartX
  const timelineAxisXMax = chartWidth + canvasContentPadding

  return (
    <>
      <Line
        points={[tickLineStartX, tickLineStartY, tickLineStartX, tickLineEndY]}
        stroke={palette.text}
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      />
      <Line
        points={[timelineAxisXMin, timelineAxisY, timelineAxisXMax, timelineAxisY]}
        stroke={palette.text}
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      />
    </>
  );
}

export default TimelineAxis
