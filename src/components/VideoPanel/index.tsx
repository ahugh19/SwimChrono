import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Spin, Row, message, Tag } from "antd"
import { PlayCircleOutlined, PauseCircleOutlined, VideoCameraFilled } from '@ant-design/icons';
import DataPanel from "./DataPanel"
import PreferencePanel from "./PreferencePanel"
import VisHolder from "./VisHolder"
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { VideoFrameDataType } from "../../types"
import Papa from 'papaparse'

interface VideoPanelProps extends IComponentPropsWithStore {
  onVideoDurationChange: (duration: number) => void
  onCurrentVideoTimeChange: (currentTime: number) => void
}

const VideoPanel = forwardRef((props: VideoPanelProps, ref) => {
  const { store, onVideoDurationChange, onCurrentVideoTimeChange } = props;

  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
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
    setVideoSrc(store.currentVideoMetaData.video)
    setFrameRate(store.currentVideoMetaData.framerate)
    const fetchVideoData = async () => {
      setIsDataLoading(true)
      const csvFileName = store.currentVideoMetaData?.dataCSV; // CSV file derived from the video metadata
      try {
        const response = await fetch(`csv/${csvFileName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvText = await response.text();
        const parsedData = Papa.parse<VideoFrameDataType>(csvText.trim(), {
          header: true,
          dynamicTyping: true, // auto-convert numeric strings to numbers
          delimiter: ",",
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(), // strip whitespace from headers
        });
        // console.log(parsedData)
        if (parsedData.data.length > 0) {
          store.setCurrentSwimmerVideo(parsedData.data.filter((d) => typeof d.frameId === "number").sort((a, b) => a.frameId - b.frameId))
          message.success("Successfully load video data.")
          store.log()
          setIsDataLoading(false)
          // store.addDefaultLayer()
        } else {
          store.setCurrentSwimmerVideo([]);
        }
      } catch (error) {
        message.error("Failed to load video data.")
        // store.setCurrentSwimmerVideo([]);
      }
    };

    fetchVideoData();
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
    if (!videoRef.current) return
    const handleMetadataLoaded = () => {
      onVideoDurationChange(videoRef.current!.duration);
    };
    videoRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);
    return () => {
      videoRef.current?.removeEventListener("loadedmetadata", handleMetadataLoaded);
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
      <Row className={styles.videoTitle}>
        <Spin spinning={isVideoLoading || isDataLoading} percent={"auto"}></Spin>
        {
          store?.currentVideoMetaData ?
            <Tag bordered={false} icon={<VideoCameraFilled />}>{`${store?.currentVideoMetaData.videoName}.mp4`}</Tag> :
            <Tag bordered={false}>No video.</Tag>
        }
      </Row>
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
      </div>
      {/* <DataPanel />
        <PreferencePanel /> */}
    </div >
  )
})

export default inject('store')(observer(VideoPanel))