import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, CustomizedIconType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";

interface VisCustomizedIconProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  customizedIcon: CustomizedIconType | undefined
  visibility: boolean
}

function VisCustomizedIcon(props: VisCustomizedIconProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, customizedIcon, visibility } = props;

  const [opacity, setOpacity] = useState<number>(0)

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
    } else {
      setOpacity(0)
    }

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`
        translate(${x}, ${y})
        scale(${s / 100})
        scale(${customizedIcon && customizedIcon.size ? customizedIcon.size : 1})
        rotate(${r})
      `}
      visibility={visibility ? "visible" : "hidden"}
    >
      {customizedIcon && customizedIcon.svgContent ? <g dangerouslySetInnerHTML={{ __html: customizedIcon.svgContent }} /> : null}
    </g>
  )
}

export default VisCustomizedIcon