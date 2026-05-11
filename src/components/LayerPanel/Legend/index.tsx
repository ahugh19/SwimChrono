import { Rect, Text } from 'react-konva';
import { rectColorMoving, rectColorStatic, rectColorBottomLeft, rectColorBottomRight, rectColorTopLeft, rectColorTopRight, rectColorFrontPlayer, rectColorBehindPlayer, rectColorAlong } from '../../../utils/values';
import { useThemeColors } from '../../../utils/theme';

interface LegendProps {
  groupType: string,
}

function Legend(props: LegendProps) {
  const { groupType } = props
  const palette = useThemeColors();
  const textColor = palette.text;
  return (
    <>
      {
        groupType === "movement" ?
          <>
            <Rect
              x={0}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorMoving}
            />
            <Text
              fill={textColor}
              x={30}
              y={6}
              height={20}
              text="vis in motion"
            />
            <Rect
              x={130}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorStatic}
            />
            <Text
              fill={textColor}
              x={160}
              y={6}
              height={20}
              text="static vis"
            />
          </>
          :
          <>
            <Rect
              x={0}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorFrontPlayer}
            />
            <Text
              fill={textColor}
              x={30}
              y={6}
              height={20}
              text="in front of player"
            />
            <Rect
              x={150}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorBehindPlayer}
            />
            <Text
              fill={textColor}
              x={180}
              y={6}
              height={20}
              text="behind player"
            />
            <Rect
              x={300}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorBottomLeft}
            />
            <Text
              fill={textColor}
              x={330}
              y={6}
              height={20}
              text="bottom left"
            />
            <Rect
              x={410}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorBottomRight}
            />
            <Text
              fill={textColor}
              x={440}
              y={6}
              height={20}
              text="bottom right"
            />
            <Rect
              x={520}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorTopLeft}
            />
            <Text
              fill={textColor}
              x={550}
              y={6}
              height={20}
              text="top left"
            />
            <Rect
              x={630}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorTopRight}
            />
            <Text
              fill={textColor}
              x={660}
              y={6}
              height={20}
              text="top right"
            />
            <Rect
              x={740}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={rectColorAlong}
            />
            <Text
              fill={textColor}
              x={770}
              y={6}
              height={20}
              text="along lane"
            />
            <Rect
              x={850}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={palette.legendOverlayBg}
              strokeEnabled={true}
              stroke={palette.legendStroke}
              strokeWidth={1.5}
            />
            <Text
              fill={textColor}
              x={880}
              y={6}
              height={20}
              text="mov"
            />
          </>
      }
    </>
  );
}

export default Legend