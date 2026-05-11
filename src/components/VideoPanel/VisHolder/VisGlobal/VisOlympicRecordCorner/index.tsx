import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";

interface VisOlympicRecordCornerProps {
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

function VisOlympicRecordCorner(props: VisOlympicRecordCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility, svgHeight, svgWidth } = props;

  const [olympicRecord, setOlympicRecord] = useState<number | string | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [orValueStyle, setOrValueStyle] = useState<EditableElementType | undefined>()
  const [orTextStyle, setOrTextStyle] = useState<EditableElementType | undefined>()
  const [orBgStyle, setOrBgStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)
      const leaderFrameData = frameList[frameList[0].currentLeader]
      setOlympicRecord(leaderFrameData.olympic)
    } else {
      setOpacity(0)
    }

    editableElementList.forEach((e) => {
      if (e.id === editableElementInVisConfig.olympicRecordCorner[0].id) {
        setOrValueStyle(e)
      } else if (e.id === editableElementInVisConfig.olympicRecordCorner[1].id) {
        setOrTextStyle(e)
      } else if (e.id === editableElementInVisConfig.olympicRecordCorner[2].id) {
        setOrBgStyle(e)
      } else if (e.id === editableElementInVisConfig.olympicRecordCorner[3].id) {
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
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"} />
      <rect
        x={`${orBgStyle?.x ? orBgStyle?.x + 3 : 3}`}
        y={`${orBgStyle?.y ? orBgStyle?.y + 3 : 3}`}
        width="18.7"
        height="11"
        rx="2.2"
        fill={orBgStyle?.shapeFillColor}
        stroke={orBgStyle?.shapeStrokeColor}
        strokeWidth={orBgStyle?.shapeStrokeWidth}
        visibility={visibility && orBgStyle?.visible ? "visible" : "hidden"}/>
      <path
        d="M8.3787 12.0635C7.931 12.0635 7.52565 11.9849 7.16265 11.8276C6.79965 11.6703 6.49715 11.4494 6.25515 11.1651C6.01315 10.8747 5.84678 10.5329 5.75603 10.1396C5.66528 9.74032 5.66528 9.3017 5.75603 8.82375C5.85283 8.3458 6.02525 7.9102 6.2733 7.51695C6.52135 7.11765 6.82385 6.77582 7.1808 6.49147C7.53775 6.20107 7.92798 5.97722 8.35148 5.81992C8.78103 5.66262 9.21965 5.58397 9.66735 5.58397C10.1272 5.58397 10.5386 5.66262 10.9016 5.81992C11.2646 5.97722 11.5671 6.20107 11.8091 6.49147C12.0511 6.77582 12.2144 7.11765 12.2991 7.51695C12.3899 7.9102 12.3868 8.3458 12.29 8.82375C12.1993 9.3017 12.0299 9.74032 11.7818 10.1396C11.5338 10.5329 11.2313 10.8747 10.8743 11.1651C10.5174 11.4494 10.1241 11.6703 9.69458 11.8276C9.27108 11.9849 8.83245 12.0635 8.3787 12.0635ZM8.65095 10.7113C8.9837 10.7113 9.28923 10.6297 9.56753 10.4663C9.85188 10.303 10.0909 10.0791 10.2845 9.79477C10.4781 9.51042 10.6112 9.18675 10.6838 8.82375C10.7564 8.4547 10.7503 8.13102 10.6656 7.85272C10.587 7.56837 10.4387 7.34452 10.2209 7.18117C10.0092 7.01782 9.73693 6.93615 9.40418 6.93615C9.06538 6.93615 8.7538 7.01782 8.46945 7.18117C8.19115 7.34452 7.9552 7.56837 7.7616 7.85272C7.568 8.13102 7.4349 8.4547 7.3623 8.82375C7.2897 9.18675 7.29273 9.51042 7.37138 9.79477C7.45608 10.0791 7.60733 10.303 7.82513 10.4663C8.04293 10.6297 8.3182 10.7113 8.65095 10.7113ZM16.9309 7.7166C16.9611 7.56535 16.9551 7.43527 16.9127 7.32637C16.8764 7.21142 16.8008 7.1237 16.6859 7.0632C16.5709 7.0027 16.4197 6.97245 16.2321 6.97245H14.9888L14.6984 8.46982H15.9417C16.22 8.46982 16.4408 8.4063 16.6042 8.27925C16.7736 8.14615 16.8825 7.9586 16.9309 7.7166ZM16.6042 5.6475C17.1245 5.6475 17.5389 5.7443 17.8475 5.9379C18.1621 6.12545 18.3738 6.37652 18.4827 6.69112C18.5916 7.00572 18.6098 7.34755 18.5372 7.7166C18.4706 8.0554 18.3224 8.38513 18.0925 8.70578C17.8626 9.02643 17.554 9.2896 17.1668 9.4953C16.7796 9.69495 16.3168 9.79477 15.7784 9.79477H14.4353L13.9906 12H12.4115L13.682 5.6475H16.6042ZM16.6859 9.25028L17.8021 12H16.0597L15.0342 9.25028H16.6859Z"
        fill={orTextStyle?.shapeFillColor}
        stroke={orTextStyle?.shapeStrokeColor}
        strokeWidth={orTextStyle?.shapeStrokeWidth}
        visibility={visibility && orTextStyle?.visible ? "visible" : "hidden"} />

      <text
        x={`${orValueStyle?.x ? orValueStyle?.x + 30 : 30}`}
        y={`${orValueStyle?.y ? orValueStyle?.y + 13 : 13}`}
        style={{ fontFamily: 'OlympicStyle' }}
        fill={orValueStyle?.fontFillColor}
        fontSize={orValueStyle?.fontSize}
        visibility={visibility && orValueStyle?.visible ? "visible" : "hidden"}
      >
        {olympicRecord}
      </text>

    </g>
  )
}

export default VisOlympicRecordCorner