import { Rect, Text } from 'react-konva';
import { rectColorMoving, rectColorStatic, rectColorBottomLeft, rectColorBottomRight, rectColorTopLeft, rectColorTopRight, rectColorFrontPlayer, rectColorBehindPlayer, rectColorAlong } from '../../../../utils/values';
import { useThemeColors } from '../../../../utils/theme';

interface LegendProps {
  groupType: string,
}

function Legend(props: LegendProps) {
  const { groupType } = props
  const palette = useThemeColors();
  const uiTextLight = palette.textBright;
  const uiBackgroundNormal = palette.background;
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
              x={30}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={160}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={30}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={180}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={330}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={440}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={550}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={660}
              y={6}
              height={20}
              fill={uiTextLight}
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
              x={770}
              y={6}
              height={20}
              fill={uiTextLight}
              text="along lane"
            />
            <Rect
              x={850}
              y={2}
              width={20}
              height={20}
              cornerRadius={1}
              fill={uiBackgroundNormal}
              strokeEnabled={true}
              stroke={uiTextLight}
              strokeWidth={1.5}
            />
            <Text
              x={880}
              y={6}
              height={20}
              fill={uiTextLight}
              text="mov"
            />
          </>
      }
    </>
  );
}

export default Legend