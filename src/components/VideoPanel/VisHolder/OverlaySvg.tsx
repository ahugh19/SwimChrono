import { LayerType, SwimmerVideoDataType, VideoMetaDataType } from "../../../types"
import VisAlongLane from "./VisAlongLane"
import VisGlobal from "./VisGlobal"

interface OverlaySvgProps {
  width: number
  height: number
  layerList: LayerType[]
  videoMetaData: VideoMetaDataType | null
  currentSwimmerVideo: SwimmerVideoDataType | null
  currentFrameIndex: number
  blur: number
}

// Pure version of the on-screen overlay (no store side effects, no
// interaction), used to render arbitrary frames for the exports.
function OverlaySvg(props: OverlaySvgProps) {
  const { width, height, layerList, videoMetaData, currentSwimmerVideo, currentFrameIndex, blur } = props
  const reversed = [...layerList].reverse()
  const raceStartFrame = videoMetaData ? Math.round(videoMetaData.raceStartTime * videoMetaData.framerate) : 0
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={`${blur}`} />
        </filter>
      </defs>
      <g filter="url(#blurFilter)">
        <VisAlongLane
          layerList={reversed}
          swimmersInfo={videoMetaData?.swimmersInfo}
          currentSwimmerVideo={currentSwimmerVideo}
          currentFrameIndex={currentFrameIndex}
          svgWidth={width}
          svgHeight={height}
          raceStartFrame={raceStartFrame}
          videoMetaData={videoMetaData}
        />
      </g>
      <g filter="url(#blurFilter)">
        <VisGlobal
          layerList={reversed}
          currentSwimmerVideo={currentSwimmerVideo}
          currentFrameIndex={currentFrameIndex}
          svgWidth={width}
          svgHeight={height}
          raceStartFrame={raceStartFrame}
          videoMetaData={videoMetaData}
        />
      </g>
    </svg>
  )
}

export default OverlaySvg
