import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Spin, Progress } from "antd"
import { message } from "../../utils/feedback"
import { PlayCircleOutlined, PauseCircleOutlined, VideoCameraFilled, InfoCircleOutlined } from '@ant-design/icons';
import DataPanel from "./DataPanel"
import PreferencePanel from "./PreferencePanel"
import VisHolder from "./VisHolder"
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { assetUrl } from "../../utils/assets"
import { loadFrameData } from "../../utils/frameData"

interface VideoPanelProps extends IComponentPropsWithStore {
  onVideoDurationChange: (duration: number) => void
  onCurrentVideoTimeChange: (currentTime: number) => void
}

const VideoPanel = forwardRef((props: VideoPanelProps, ref) => {
  const { store, onVideoDurationChange, onCurrentVideoTimeChange } = props;

  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [dataProgress, setDataProgress] = useState<number | null>(0);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [frameRate, setFrameRate] = useState<number>(50);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [videoRatio, setVideoRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(ref, () => ({
    videoPanelComponent: videoRef.current
  }))

  useEffect(() => {
    if (!store || !store.currentVideoMetaData) return
    const metaData = store.currentVideoMetaData
    setVideoSrc(assetUrl(metaData.video))
    setFrameRate(metaData.framerate)

    // Abort the previous download when the user switches video before
    // it finished, so a stale CSV can't overwrite the new one.
    const controller = new AbortController()
    setIsDataLoading(true)
    setDataProgress(0)

    loadFrameData(assetUrl(`csv/${metaData.dataCSV}`), controller.signal, (loaded, total) => {
      setDataProgress(total && total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : null)
    })
      .then((rows) => {
        if (controller.signal.aborted) return
        store.setCurrentSwimmerVideo(rows)
        if (rows.length > 0) {
          message.success("Video data loaded.")
        }
        setIsDataLoading(false)
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error("Failed to load video data", error)
        message.error("Failed to load video data.")
        setIsDataLoading(false)
      })

    return () => controller.abort()
  }, [store?.currentVideoMetaData])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && videoRatio) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let newWidth = containerWidth;
        let newHeight = containerWidth / videoRatio;

        // If the computed height overflows the container, recompute the width instead.
        if (newHeight > containerHeight) {
          newHeight = containerHeight;
          newWidth = containerHeight * videoRatio;
        }

        setSize({ width: newWidth, height: newHeight });
      }
    };

    // Observe container resizes.
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Disconnect the observer on unmount.
    return () => {
      resizeObserver.disconnect();
    };
  }, [videoRatio]); // only recompute once videoRatio is known


  useEffect(() => {
    setIsVideoLoading(true)
    if (videoRef.current && store && store.currentVideoMetaData) {

      const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
      if (videoRef.current.parentElement) {
        videoRef.current.parentElement.style.aspectRatio = `${ratio}`
      }

      videoRef.current.src = videoSrc
      videoRef.current.load()
      videoRef.current.currentTime = store.currentVideoMetaData.raceStartTime
      store.setVideoElement(videoRef.current)

      // 'timeupdate' fires only 4-10 times per second — far slower than the video framerate.
      // const updateFrameIndex = () => {
      //   if (videoRef.current) {
      //     const frameIndex = Math.floor(videoRef.current.currentTime * frameRate);
      //     console.log(videoRef.current.currentTime, videoRef.current.currentTime * frameRate, frameIndex)
      //     setCurrentFrameIndex(frameIndex);
      //   }
      //   if (videoRef.current?.currentTime) {
      //     onCurrentVideoTimeChange(videoRef.current?.currentTime);
      //   }
      // };
      // videoRef.current.addEventListener("timeupdate", updateFrameIndex);
      // return () => {
      //   if (videoRef.current)
      //     videoRef.current.removeEventListener("timeupdate", updateFrameIndex);
      // };

      const updateFrameIndex = () => {
        if (!videoRef.current) return;
        const frameIndex = Math.floor(videoRef.current.currentTime * frameRate);
        if (frameIndex !== currentFrameIndex) {
          setCurrentFrameIndex(frameIndex);
          onCurrentVideoTimeChange(videoRef.current.currentTime);
        }
        requestAnimationFrame(updateFrameIndex);
      };
      const animationFrameId = requestAnimationFrame(updateFrameIndex);
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [videoSrc, store?.currentVideoMetaData?.raceStartTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleMetadataLoaded = () => {
      onVideoDurationChange(video.duration);
    };
    // Play state can also change from the timeline (space key), so follow
    // the element instead of assuming the button is the only control.
    const onPlay = () => setIsVideoPlay(true)
    const onPause = () => setIsVideoPlay(false)
    video.addEventListener("loadedmetadata", handleMetadataLoaded);
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
    };
  }, [videoRef.current]);

  function playPauseVideo() {
    setIsVideoPlay(!isVideoPlay)
  }

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlay) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isVideoPlay])

  function handleLoadedData() {
    if (videoRef.current) {
      const video = videoRef.current;
      const ratio = video.videoWidth / video.videoHeight;
      setVideoRatio(ratio);
      setIsVideoLoading(false)
    }
  }

  return (
    <div className={styles.videoPanelContainer} ref={containerRef}>
      <div className={styles.videoWrapper} style={{ width: size.width, height: size.height }}>
        <video ref={videoRef} src={videoSrc} onLoadedData={handleLoadedData} crossOrigin="anonymous" muted></video>
        <div className={styles.visHolder} style={{ width: size.width, height: size.height }}>
          <VisHolder
            svgHeight={size.height}
            svgWidth={size.width}
            currentSwimmerVideo={store?.currentSwimmerVideo}
            currentFrameIndex={currentFrameIndex}
          />
        </div>
        <div className={styles.videoBtn}>
          <Button
            size="large"
            type="text"
            title={"Play the video"}
            disabled={isVideoLoading}
            icon={isVideoPlay ? <PauseCircleOutlined style={{ fontSize: "20px" }} /> : <PlayCircleOutlined style={{ fontSize: "20px" }} />}
            onClick={playPauseVideo}
          />
        </div>
        {/* what this video is for, under the video's bottom-left corner */}
        {
          store?.currentVideoMetaData?.description &&
          <div className={styles.videoNote}>
            <InfoCircleOutlined />
            <span>{store.currentVideoMetaData.description}</span>
          </div>
        }
        {/* source file, tucked under the video's bottom-right corner */}
        <div className={styles.videoCaption} title={store?.currentVideoMetaData ? store.currentVideoMetaData.video : undefined}>
          <VideoCameraFilled />
          <span>{store?.currentVideoMetaData ? `${store.currentVideoMetaData.videoName}.mp4` : "No video"}</span>
        </div>
      </div>
      {
        (isVideoLoading || isDataLoading) &&
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBox}>
            <div className={styles.loadingRow}>
              <span>Race data</span>
              {
                isDataLoading
                  ? (dataProgress === null
                    ? <Spin size="small" />
                    : <Progress percent={dataProgress} size="small" showInfo={true} style={{ width: 160, margin: 0 }} />)
                  : <span className={styles.loadingDone}>ready</span>
              }
            </div>
            <div className={styles.loadingRow}>
              <span>Video</span>
              {isVideoLoading ? <Spin size="small" /> : <span className={styles.loadingDone}>ready</span>}
            </div>
          </div>
        </div>
      }
      {/* <DataPanel />
        <PreferencePanel /> */}
    </div >
  )
})

export default inject('store')(observer(VideoPanel))