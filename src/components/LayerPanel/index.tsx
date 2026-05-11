import TimelinePanel from "./TimelinePanel"
import TriggerPanel from "./TriggerPanel"
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { DownloadOutlined, LoginOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Slider } from 'antd';
import { Stage, Layer, Text } from 'react-konva';
import Konva from 'konva';
import TemporalInfo from './TemporalInfo'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../store"
import TimelineAxis from './TimelineAxis';
import { chromeScrollBarWidth, durationRectHeight, layerPartWidth } from '../../utils/values';
import styles from "./index.module.less"
import LayerGroup from "./LayerGroup"
import { formatTime, downloadJson, readFile } from '../../utils';


interface LayerPanelProps extends IComponentPropsWithStore {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  videoDuration: number
  currentVideoTime: number
}

const LayerPanel = forwardRef((props: LayerPanelProps, ref) => {
  const { store, fileInputRef, videoDuration, currentVideoTime } = props
  const konvaStageTimelineAxisRef = useRef<Konva.Stage>(null)
  const temporalInfoRef = useRef<HTMLDivElement | null>(null);
  const layerGroupRef = useRef<HTMLDivElement | null>(null);
  const timelineDivRef = useRef<HTMLDivElement | null>(null);
  const refAddLayerBtn = useRef(null)
  const refLayerGroup = useRef<any>(null)

  const canvasDefaultWidth = 900
  const canvasDefaultHeight = 340
  const timelineAxisCanvasHeight = 24
  const canvasContentPadding = 1

  const [ganttCanvasHeight, setGanttCanvasHeight] = useState<number>(canvasDefaultHeight)
  const [ganttAreaWidth, setGanttAreaWidth] = useState<number>(canvasDefaultWidth)
  const [canvasWidth, setCanvasWidth] = useState<number>(canvasDefaultWidth)
  const [timelineDivWidth, setTimelineDivWidth] = useState<number>(0)
  const [sliderWidth, setSliderWidth] = useState<number>(0)
  const [raceStart, setRaceStart] = useState<number>(0)

  // from js
  const [videoEle, setVideoEle] = useState<HTMLVideoElement | null>(null)

  useImperativeHandle(ref, () => ({
    layerPanelComponent: timelineDivRef.current,
    addLayerBtn: refAddLayerBtn.current,
    layerGroupBtn: refLayerGroup.current?.layerGroupBtn
  }))

  useEffect(() => {
    if (!store) return
    setVideoEle(store.videoElement)
  }, [store?.videoElement])

  useEffect(() => {
    if (!store) return
    setRaceStart(store.currentVideoMetaData?.raceStartTime as number)
  }, [store?.currentVideoMetaData])

  useEffect(() => {
    // Scroll event handlers.
    const handleTemporalInfoScroll = () => {
      if (layerGroupRef.current && temporalInfoRef.current) {
        layerGroupRef.current.scrollTop = temporalInfoRef.current.scrollTop
      }
    };

    const temporalInfoElement = temporalInfoRef.current;
    temporalInfoElement?.addEventListener('scroll', handleTemporalInfoScroll);
    temporalInfoElement?.addEventListener('wheel', function (event) {
      if (event.deltaX !== 0) {
        // Prevent default horizontal scrolling.
        event.preventDefault();
      }
    }, { passive: false });

    const handleLayerGroupScroll = () => {
      if (layerGroupRef.current && temporalInfoRef.current) {
        temporalInfoRef.current.scrollTop = layerGroupRef.current.scrollTop
      }
    };
    const layerGroupElement = layerGroupRef.current;
    layerGroupElement?.addEventListener('scroll', handleLayerGroupScroll);

  }, []);

  useEffect(() => {
    function updateTimelineDivWidth() {
      if (timelineDivRef.current) {
        setTimelineDivWidth(timelineDivRef.current.offsetWidth)
      }
    }

    updateTimelineDivWidth()

    window.addEventListener('resize', updateTimelineDivWidth);

    return () => {
      window.removeEventListener('resize', updateTimelineDivWidth);
    };
  }, [])

  useEffect(() => {
    setGanttAreaWidth(timelineDivWidth - layerPartWidth - chromeScrollBarWidth - canvasContentPadding)
  }, [timelineDivWidth])

  useEffect(() => {
    setSliderWidth(ganttAreaWidth + canvasContentPadding * 2)
    setCanvasWidth(ganttAreaWidth)
  }, [ganttAreaWidth])

  useEffect(() => {
    if (!store) return
    if (store.layerList && store.layerList.length > 0) {
      let res: number = 0
      store.layerList.forEach(() => {
        res = res + (durationRectHeight)
      })
      setGanttCanvasHeight(res > canvasDefaultHeight ? res : canvasDefaultHeight)
    }
  }, [store?.layerList.length])

  // function getVideoObj(jsMetaData: any, jsVideoData: any, videoEnd: number) {
  //   const videoObj: VideoObjType = {
  //     key: jsMetaData.video,
  //     startMomentInS: jsMetaData.raceStartTime,
  //     endMomentInS: videoEnd,
  //     frames: jsVideoData,
  //     framerate: jsMetaData.framerate,
  //     lanes: jsMetaData.lanes,
  //     url: jsMetaData.video,
  //     distance: jsMetaData.distance,
  //     poolLapLength: jsMetaData.poolLapLength, // the length of one lap
  //     gender: jsMetaData.gender, // "men", "women", "mixed"
  //     year: jsMetaData.year,
  //     type: jsMetaData.type,
  //     style: jsMetaData.style,
  //     level: jsMetaData.level,

  //     // // TODO: include them in metadata
  //     // distance: 100,
  //     // poolLapLength: 50, // the length of one lap
  //     // gender: "women", // "men", "women", "mixed"
  //     // year: 2021,
  //     // type: "individual",
  //     // style: "breaststroke",
  //     // level: "France Championship",
  //   }
  //   console.log(videoObj)
  //   return videoObj
  // }

  function handleWheel(e: any) {
    if (e.shiftKey && temporalInfoRef.current) {
      e.preventDefault();
      temporalInfoRef.current.scrollLeft += e.deltaY;
    }
  }

  function handleSliderChange(value: number[]) {
    const start = value[0] / 100
    const end = value[1] / 100
    const range = end - start
    setCanvasWidth(ganttAreaWidth / range)
    if (temporalInfoRef.current) {
      temporalInfoRef.current.scrollLeft = temporalInfoRef.current.scrollWidth * start
    }
  }

  function onAddVisBtnClick(e: any) {
    store?.addNewInitLayer()
  }

  function handleImportClick() {
    if (fileInputRef.current === null) return;
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  function handleExportClick() {
    store?.exportConfig()
  }

  return (
      <div className={styles.swimflowTimelineContainer} ref={timelineDivRef}>
        <div className={styles.topPart}>
          <div className={styles.topLeftPart}>
            <div className={styles.ioBtnContainer} ref={refAddLayerBtn}>
              {/* <Tooltip title="import templates">
                <Button onClick={handleImportClick} type="link" shape="circle" size="small" icon={<LoginOutlined />} />
              </Tooltip>
              <Tooltip title="download templates">
                <Button onClick={handleExportClick} type="link" shape="circle" size="small" icon={<DownloadOutlined />} />
              </Tooltip> */}
              <Tooltip title="Add a new visualization layer.">
                <Button onClick={onAddVisBtnClick} type="link" shape="circle" size="small" icon={<PlusOutlined />}>
                  Add a New Layer
                </Button>
              </Tooltip>
            </div>
            <div title={"Current time of the played video"} className={styles.timeTextContainer}>
              {currentVideoTime.toFixed(2)}
            </div>
          </div>

          <div className={styles.topRightPart}>
            <div className={styles.sliderContainer} style={{ width: `${sliderWidth}px` }}>
              <Slider onChange={handleSliderChange} range={{ draggableTrack: true }} defaultValue={[0, 100]} step={0.01} tooltip={{ formatter: (value) => `${value !== undefined ? formatTime(value / 100 * videoDuration) : 0}` }} />
            </div>
            <div className={styles.timelineAxisContainer}>
              <Stage width={ganttAreaWidth} height={timelineAxisCanvasHeight} ref={konvaStageTimelineAxisRef}>
                <Layer>
                  <TimelineAxis
                    canvasWidth={ganttAreaWidth}
                    canvasContentPadding={canvasContentPadding} />
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        <div className={styles.bottomPart}>
          <div className={styles.layerWrapper}>
            <div className={styles.layerContainer} ref={layerGroupRef}>
              <LayerGroup ref={refLayerGroup} />
            </div>
          </div>

          <div className={styles.ganttWrapper}>
            <div className={styles.ganttContainer} ref={temporalInfoRef}>
              <TemporalInfo
                videoElement={videoEle}
                raceStart={raceStart}
                videoEnd={videoDuration}
                canvasWidth={canvasWidth}
                canvasHeight={ganttCanvasHeight}
                currentVideoTime={currentVideoTime}
              />
            </div>
          </div>
        </div>
        {/* <Button onClick={testControlVideo}>test</Button> */}
      </div>
  )
})

export default inject('store')(observer(LayerPanel))