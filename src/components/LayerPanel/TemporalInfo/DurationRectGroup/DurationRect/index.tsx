import { useEffect, useState } from 'react';
import { Rect, Line } from 'react-konva';
import { rectBorderRadius, strokeColor, strokeWidth, triggerEndBorderColor, triggerStartBorderColor } from '../../../../../utils/values';

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
  const { x, y, w, h, color, isVisInMotion, onMousseMoveRect, onMouseLeaveRect, onMouseClickRect } = props;

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
        stroke={triggerStartBorderColor}
        strokeWidth={triggerBorderWidthNormal} />
      <Line points={[getEndX(), y, getEndX(), y + h]}
        stroke={triggerEndBorderColor}
        strokeWidth={triggerBorderWidthNormal} />
    </>
  );
}

export default DurationRect