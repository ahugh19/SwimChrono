import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType, CustomizedIconType } from "../../../../../types";
import { editableElementInVisConfig, VALUE_customizedTextGlobal } from "../../../../../utils/values";

interface VisCustomizedTextProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  customizedText: string | undefined,
  visibility: boolean,
  editableElementList: EditableElementType[],
}

function VisCustomizedText(props: VisCustomizedTextProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, customizedText, editableElementList, visibility } = props;

  const [opacity, setOpacity] = useState<number>(0)
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    // console.log(customizedText)

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig[VALUE_customizedTextGlobal]?.[0]?.id) {
        setTextStyle(e)
      }
    })
    // setTextStyle(editableElementList.find(
    //   (e) => e.id === editableElementInVisConfig[VALUE_customizedTextGlobal]?.[0]?.id
    // ))

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`
        translate(${x}, ${y})
        rotate(${r})
        scale(${s / 100})
      `}
      visibility={visibility ? "visible" : "hidden"}
    >
      <text
        x={`${textStyle?.x ? textStyle?.x + 20 : 20}`}
        y={`${textStyle?.y ? textStyle?.y + 20 : 20}`}
        fill={textStyle?.fontFillColor}
        fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}
        >
        {customizedText ? customizedText : null}
      </text>
    </g>
  )
}

export default VisCustomizedText