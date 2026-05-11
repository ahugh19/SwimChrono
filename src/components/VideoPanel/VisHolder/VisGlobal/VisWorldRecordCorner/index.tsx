import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";

interface VisWorldRecordCornerProps {
  currentSwimmerVideo: SwimmerVideoDataType | null | undefined,
  currentFrameIndex: number,
  x: number,
  y: number,
  r: number,
  s: number,
  editableElementList: EditableElementType[],
  visibility: boolean,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
}

function VisWorldRecordCorner(props: VisWorldRecordCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [worldRecord, setWorldRecord] = useState<number | string | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [wrValueStyle, setWrValueStyle] = useState<EditableElementType | undefined>()
  const [wrTextStyle, setWrTextStyle] = useState<EditableElementType | undefined>()
  const [wrBgStyle, setWrBgStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      setWorldRecord(leaderFrameData.world)
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.worldRecordCorner[0].id) {
        setWrValueStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordCorner[1].id) {
        setWrTextStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordCorner[2].id) {
        setWrBgStyle(e)
      } else if (e.id === editableElementInVisConfig.worldRecordCorner[3].id) {
        setBgStyle(e)
      }
    })

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x={`${bgStyle?.x ? bgStyle?.x + 0 : 0}`}
        y={`${bgStyle?.y ? bgStyle?.y + 0 : 0}`}
        width="73"
        height="17"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"}  
      />
      <rect
        x={`${wrBgStyle?.x ? wrBgStyle?.x + 3 : 3}`}
        y={`${wrBgStyle?.y ? wrBgStyle?.y + 3 : 3}`}
        width="18.7"
        height="11"
        rx="2.2"
        fill={wrBgStyle?.shapeFillColor}
        stroke={wrBgStyle?.shapeStrokeColor}
        strokeWidth={wrBgStyle?.shapeStrokeWidth}
        visibility={visibility && wrBgStyle?.visible ? "visible" : "hidden"}
      />
      <path
        d="M7.38701 12H5.45403L5.09103 5.6475H6.80621V10.1396L8.79363 5.6475H10.5542L10.7266 10.1305L12.5053 5.6475H14.2296L11.3437 12H9.40166L9.21108 7.88903L7.38701 12ZM18.1495 7.7166C18.1797 7.56535 18.1737 7.43527 18.1313 7.32637C18.095 7.21142 18.0194 7.1237 17.9044 7.0632C17.7895 7.0027 17.6382 6.97245 17.4507 6.97245H16.2074L15.917 8.46982H17.1603C17.4386 8.46982 17.6594 8.4063 17.8228 8.27925C17.9922 8.14615 18.1011 7.9586 18.1495 7.7166ZM17.8228 5.6475C18.3431 5.6475 18.7575 5.7443 19.066 5.9379C19.3806 6.12545 19.5924 6.37652 19.7013 6.69112C19.8102 7.00572 19.8283 7.34755 19.7557 7.7166C19.6892 8.0554 19.541 8.38513 19.3111 8.70578C19.0812 9.02643 18.7726 9.2896 18.3854 9.4953C17.9982 9.69495 17.5354 9.79477 16.9969 9.79477H15.6538L15.2092 12H13.6301L14.9006 5.6475H17.8228ZM17.9044 9.25028L19.0207 12H17.2783L16.2528 9.25028H17.9044Z"
        fill={wrTextStyle?.shapeFillColor}
        stroke={wrTextStyle?.shapeStrokeColor}
        strokeWidth={wrTextStyle?.shapeStrokeWidth}
        visibility={visibility && wrTextStyle?.visible ? "visible" : "hidden"} />

      <text
        x={`${wrValueStyle?.x ? wrValueStyle?.x + 30 : 30}`}
        y={`${wrValueStyle?.y ? wrValueStyle?.y + 13 : 13}`}
        style={{ fontFamily: 'OlympicStyle' }}
        fill={wrValueStyle?.fontFillColor}
        fontSize={wrValueStyle?.fontSize}
        visibility={visibility && wrValueStyle?.visible ? "visible" : "hidden"}
      >
        {worldRecord}
      </text>

    </g>
  )
}

export default VisWorldRecordCorner