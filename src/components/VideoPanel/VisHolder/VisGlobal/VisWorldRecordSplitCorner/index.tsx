import { useEffect, useState } from "react";
import { SwimmerVideoFrameType, SwimmerVideoDataType, LayerType, EditableElementType } from "../../../../../types";
import { editableElementInVisConfig } from "../../../../../utils/values";

interface VisWorldRecordSplitCornerProps {
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

function VisWorldRecordSplitCorner(props: VisWorldRecordSplitCornerProps) {

  const { currentSwimmerVideo, currentFrameIndex, x, y, r, s, editableElementList, visibility } = props;

  const [worldRecordSplit, setWorldRecordSplit] = useState<number | string | null>(null)
  const [opacity, setOpacity] = useState<number>(0)
  const [textStyle, setTextStyle] = useState<EditableElementType | undefined>()
  const [wrTextStyle, setWrTextStyle] = useState<EditableElementType | undefined>()
  const [wrBgStyle, setWrBgStyle] = useState<EditableElementType | undefined>()
  const [splitTextStyle, setSplitTextStyle] = useState<EditableElementType | undefined>()
  const [bgStyle, setBgStyle] = useState<EditableElementType | undefined>()

  useEffect(() => {
    if (!currentSwimmerVideo) return
    const frameList = currentSwimmerVideo[currentFrameIndex]

    if (frameList && frameList[0] && frameList[frameList[0].currentLeader]) {
      setOpacity(1)

      const leaderFrameData = frameList[frameList[0].currentLeader]
      if (leaderFrameData.world50) {
        setWorldRecordSplit(leaderFrameData.world50.toFixed(2))
      }
    } else {
      setOpacity(0)
    }

    setTextStyle(editableElementList.find((e) => e.id === editableElementInVisConfig.worldRecordSplitCorner[0].id))
    setWrTextStyle(editableElementList.find((e) => e.id === editableElementInVisConfig.worldRecordSplitCorner[1].id))
    setWrBgStyle(editableElementList.find((e) => e.id === editableElementInVisConfig.worldRecordSplitCorner[2].id))
    setSplitTextStyle(editableElementList.find((e) => e.id === editableElementInVisConfig.worldRecordSplitCorner[3].id))
    setBgStyle(editableElementList.find((e) => e.id === editableElementInVisConfig.worldRecordSplitCorner[4].id))

  }, [currentFrameIndex, currentSwimmerVideo])

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) rotate(${r}) scale(${s / 100})`}
      visibility={visibility ? "visible" : "hidden"}
    >
      <rect
        x={`${bgStyle?.x ?? 0}`}
        y={`${bgStyle?.y ?? 0}`}
        width="103" height="17"
        fill={bgStyle?.shapeFillColor}
        stroke={bgStyle?.shapeStrokeColor}
        strokeWidth={bgStyle?.shapeStrokeWidth}
        visibility={visibility && bgStyle?.visible ? "visible" : "hidden"} />
      <rect
        x={`${(wrBgStyle?.x ?? 0) + 7}`}
        y={`${(wrBgStyle?.y ?? 0) + 3}`}
        width="18.7" height="11" rx="2.2"
        fill={wrBgStyle?.shapeFillColor}
        stroke={wrBgStyle?.shapeStrokeColor}
        strokeWidth={wrBgStyle?.shapeStrokeWidth}
        visibility={visibility && wrBgStyle?.visible ? "visible" : "hidden"} />
      <path
        d="M11.387 12H9.45403L9.09103 5.6475H10.8062V10.1396L12.7936 5.6475H14.5542L14.7266 10.1305L16.5053 5.6475H18.2296L15.3437 12H13.4017L13.2111 7.88903L11.387 12ZM22.1495 7.7166C22.1797 7.56535 22.1737 7.43527 22.1313 7.32637C22.095 7.21142 22.0194 7.1237 21.9044 7.0632C21.7895 7.0027 21.6382 6.97245 21.4507 6.97245H20.2074L19.917 8.46982H21.1603C21.4386 8.46982 21.6594 8.4063 21.8228 8.27925C21.9922 8.14615 22.1011 7.9586 22.1495 7.7166ZM21.8228 5.6475C22.3431 5.6475 22.7575 5.7443 23.066 5.9379C23.3806 6.12545 23.5924 6.37652 23.7013 6.69112C23.8102 7.00572 23.8283 7.34755 23.7557 7.7166C23.6892 8.0554 23.541 8.38513 23.3111 8.70578C23.0812 9.02643 22.7726 9.2896 22.3854 9.4953C21.9982 9.69495 21.5354 9.79477 20.9969 9.79477H19.6538L19.2092 12H17.6301L18.9006 5.6475H21.8228ZM21.9044 9.25028L23.0207 12H21.2783L20.2528 9.25028H21.9044Z"
        fill={wrTextStyle?.shapeFillColor}
        stroke={wrTextStyle?.shapeStrokeColor}
        strokeWidth={wrTextStyle?.shapeStrokeWidth}
        visibility={visibility && wrTextStyle?.visible ? "visible" : "hidden"} />
      <path
        d="M37.8825 5.03687L37.7198 6.10637C37.1269 5.87387 36.8014 5.76925 36.1969 5.76925C35.5459 5.76925 34.7786 6.00175 34.7786 6.85037C34.7786 8.40812 38.2661 8.04775 38.2661 10.7215C38.2661 12.4536 36.9293 13.1395 35.3018 13.1395C34.7321 13.1395 34.1741 12.9767 33.6394 12.8024L33.7556 11.7212C34.1509 11.884 34.8484 12.1165 35.4413 12.1165C36.1039 12.1165 37.0339 11.7445 37.0339 10.7912C37.0339 8.97775 33.5464 9.47762 33.5464 6.955C33.5464 5.5135 34.6856 4.74625 36.1504 4.74625C36.6851 4.74625 37.3245 4.83925 37.8825 5.03687ZM40.6175 6.98318V9.38005H41.594C42.2056 9.38005 42.975 9.07427 42.975 8.16682C42.975 7.29882 42.0675 6.98318 41.456 6.98318H40.6175ZM39.6312 13V6.11518H41.4362C42.8467 6.11518 44.0205 6.60836 44.0205 8.17668C44.0205 9.70555 42.827 10.248 41.5842 10.248H40.6175V13H39.6312ZM45.1614 13V6.11518H46.1477V12.132H49.0279V13H45.1614ZM50.103 13V6.11518H51.0894V13H50.103ZM54.2193 13V6.98318H52.0789V6.11518H57.3461V6.98318H55.2057V13H54.2193Z"
        fill={splitTextStyle?.shapeFillColor}
        stroke={splitTextStyle?.shapeStrokeColor}
        strokeWidth={splitTextStyle?.shapeStrokeWidth}
        visibility={visibility && splitTextStyle?.visible ? "visible" : "hidden"} />

      <text
        x={`${(textStyle?.x ?? 0) + 68}`}
        y={`${(textStyle?.y ?? 0) + 13}`}
        style={{ fontFamily: 'OlympicStyle' }}
        fill={textStyle?.fontFillColor} fontSize={textStyle?.fontSize}
        visibility={visibility && textStyle?.visible ? "visible" : "hidden"}>
        {worldRecordSplit}
      </text>
    </g>
  )
}

export default VisWorldRecordSplitCorner
