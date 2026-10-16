import TimelinePanel from "./TimelinePanel"
import TriggerPanel from "./TriggerPanel"
import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { DownloadOutlined, LoginOutlined, PlusOutlined, InfoCircleOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import { Button, Tooltip, Slider, Typography, Popover } from 'antd';
import { Stage, Layer, Text } from 'react-konva';
import Konva from 'konva';
import TemporalInfo from './TemporalInfo'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../store"
import TimelineAxis from './TimelineAxis';
import { durationRectHeight, layerPartWidth, timelinePaddingLeft, triggerStartBorderColor, triggerEndBorderColor, triggerEndDurationBorderColor } from '../../utils/values';
import { useThemeColors } from '../../utils/theme';
import ResizeHandle, { readStoredSize, writeStoredSize } from '../ResizeHandle';
import styles from "./index.module.less"
import LayerGroup from "./LayerGroup"
import { formatTime, formatClock, downloadJson, readFile } from '../../utils';


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
  const canvasContentPadding = timelinePaddingLeft
  const palette = useThemeColors()

  const [ganttCanvasHeight, setGanttCanvasHeight] = useState<number>(canvasDefaultHeight)
  const [ganttAreaWidth, setGanttAreaWidth] = useState<number>(canvasDefaultWidth)
  const [canvasWidth, setCanvasWidth] = useState<number>(canvasDefaultWidth)
  const [timelineDivWidth, setTimelineDivWidth] = useState<number>(0)
  const [sliderWidth, setSliderWidth] = useState<number>(0)
  const [raceStart, setRaceStart] = useState<number>(0)
  // Visible window of the timeline in percent of the video; drives both
  // the range slider and the canvas zoom (ctrl/cmd + wheel).
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100])
  // Width of the layer-list column (buttons + name); the gantt takes the rest.
  const LAYER_COLUMN_KEY = "swimchrono.layout.layerColumnWidth"
  const [layerColumnWidth, setLayerColumnWidth] = useState<number>(() => readStoredSize(LAYER_COLUMN_KEY) ?? layerPartWidth)
  useEffect(() => { writeStoredSize(LAYER_COLUMN_KEY, layerColumnWidth) }, [layerColumnWidth])
  const axisScrollRef = useRef<HTMLDivElement | null>(null)

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

  // When a video is loaded, fit the race once (as soon as the duration and
  // the width are known). fitRace is defined further down; reach it by ref.
  const fitRaceRef = useRef<() => void>(() => undefined)
  const zoomedForVideo = useRef<string | null>(null)
  useEffect(() => {
    // Duration and race start arrive after the video name when switching
    // videos, so the key includes them: the fit is redone once they are in.
    const name = store?.currentVideoMetaData?.name
    if (!name || !(videoDuration > 0) || !(ganttAreaWidth > 0)) return
    const key = `${name}|${videoDuration.toFixed(3)}|${raceStart}`
    if (zoomedForVideo.current === key) return
    zoomedForVideo.current = key
    fitRaceRef.current()
  }, [store?.currentVideoMetaData?.name, videoDuration, ganttAreaWidth, raceStart])

  useEffect(() => {
    // Scroll event handlers.
    const handleTemporalInfoScroll = () => {
      if (layerGroupRef.current && temporalInfoRef.current) {
        layerGroupRef.current.scrollTop = temporalInfoRef.current.scrollTop
      }
      if (axisScrollRef.current && temporalInfoRef.current) {
        axisScrollRef.current.scrollLeft = temporalInfoRef.current.scrollLeft
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

    // The panel can be resized by its gutter, not only by the window.
    const ro = new ResizeObserver(updateTimelineDivWidth)
    if (timelineDivRef.current) ro.observe(timelineDivRef.current)
    window.addEventListener('resize', updateTimelineDivWidth);

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateTimelineDivWidth);
    };
  }, [])

  // The stage at 100% zoom is exactly as wide as the gantt container's
  // visible area, measured directly so the ruler (same width) and the
  // rows always scroll to the same positions.
  useEffect(() => {
    const el = temporalInfoRef.current
    if (!el) return
    const measure = () => setGanttAreaWidth(Math.max(0, el.clientWidth))
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [timelineDivWidth, layerColumnWidth])

  // Keep the zoom window when the available width changes (window resize,
  // layer column or controller panel dragged): recompute the stage width
  // and scroll offset from the current range instead of resetting them.
  // The ref is written synchronously in applyZoom (not from a state effect)
  // so a fit requested in the same commit as a width change is not undone.
  const zoomRangeRef = useRef<[number, number]>([0, 100])
  useEffect(() => {
    setSliderWidth(ganttAreaWidth + canvasContentPadding * 2)
    if (ganttAreaWidth <= 0) return
    applyZoom(zoomRangeRef.current[0], zoomRangeRef.current[1])
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

  // Apply a visible window [startPct, endPct] of the video to the canvas.
  // The scroll offset is applied after React has resized the stage (see the
  // effect below); setting it right away would be clamped to the old width.
  const pendingScrollLeft = useRef<number | null>(null)
  const applyZoom = useCallback((startPct: number, endPct: number) => {
    const range = Math.max(2, Math.min(100, endPct - startPct))
    const start = Math.max(0, Math.min(100 - range, startPct))
    zoomRangeRef.current = [start, start + range]
    setZoomRange((prev) => (prev[0] === start && prev[1] === start + range ? prev : [start, start + range]))
    const width = ganttAreaWidth / (range / 100)
    pendingScrollLeft.current = width * (start / 100)
    setCanvasWidth(width)
  }, [ganttAreaWidth])

  useEffect(() => {
    const scrollLeft = pendingScrollLeft.current
    if (scrollLeft === null) return
    pendingScrollLeft.current = null
    const apply = () => {
      if (temporalInfoRef.current) temporalInfoRef.current.scrollLeft = scrollLeft
      if (axisScrollRef.current) axisScrollRef.current.scrollLeft = scrollLeft
    }
    apply()
    requestAnimationFrame(apply)
  }, [canvasWidth])

  // Zoom so the race (race start to the end of the video) fills the timeline.
  const fitRace = useCallback(() => {
    if (!(videoDuration > 0)) return
    const racePct = Math.max(0, Math.min(95, (raceStart / videoDuration) * 100))
    // Leave about 12px before the race start so the first bar's left edge
    // and its handle are not clipped by the canvas edge.
    const gapPx = 12
    const gapPct = ganttAreaWidth > 0 ? (gapPx / ganttAreaWidth) * (100 - racePct) : 0
    applyZoom(Math.max(0, racePct - gapPct), 100)
  }, [videoDuration, raceStart, ganttAreaWidth, applyZoom])

  // Assigned during render so the auto-fit effect above sees it on the first commit.
  fitRaceRef.current = fitRace

  function handleSliderChange(value: number[]) {
    applyZoom(value[0], value[1])
  }

  // ctrl / cmd + wheel zooms around the cursor; shift + wheel pans.
  useEffect(() => {
    const el = temporalInfoRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const [start, end] = zoomRange
      const range = end - start
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15
      const newRange = Math.max(2, Math.min(100, range * factor))
      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const cursorPct = start + (offsetX / el.clientWidth) * range
      const newStart = cursorPct - (offsetX / el.clientWidth) * newRange
      applyZoom(newStart, newStart + newRange)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomRange, applyZoom])

  const seekTo = useCallback((time: number) => {
    const video = store?.videoElement
    if (!video) return
    const clamped = Math.max(0, Math.min(videoDuration || video.duration || 0, time))
    if (Number.isFinite(clamped)) video.currentTime = clamped
  }, [store?.videoElement, videoDuration])

  // Keyboard: space play/pause, arrows step a frame (shift: 1 s), home/end.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
    const video = store?.videoElement
    if (!video) return
    const frame = 1 / (store?.currentVideoMetaData?.framerate ?? 50)
    switch (e.key) {
      case ' ':
        e.preventDefault()
        if (video.paused) video.play(); else video.pause()
        break
      case 'ArrowLeft':
        e.preventDefault()
        seekTo(video.currentTime - (e.shiftKey ? 1 : frame))
        break
      case 'ArrowRight':
        e.preventDefault()
        seekTo(video.currentTime + (e.shiftKey ? 1 : frame))
        break
      case 'Home':
        // Home returns to the race start, the natural origin for authoring.
        e.preventDefault(); seekTo(e.shiftKey ? 0 : raceStart); break
      case 'End':
        e.preventDefault(); seekTo(videoDuration); break
      default:
        break
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
      <div
        className={styles.swimflowTimelineContainer}
        ref={timelineDivRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{ "--layer-part-width": `${layerColumnWidth}px` } as React.CSSProperties}
      >
        <div className={styles.columnGutter}>
          <ResizeHandle
            direction="col"
            value={layerColumnWidth}
            min={170}
            max={Math.max(260, timelineDivWidth - 300)}
            onChange={setLayerColumnWidth}
            onDoubleClick={() => setLayerColumnWidth(layerPartWidth)}
            title="Drag to resize the layer list. Double-click to reset."
          />
        </div>
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
              <Popover
                placement="topLeft"
                trigger="click"
                title="Timeline legend"
                content={
                  <div className={styles.legend}>
                    <div className={styles.legendRow}><span className={styles.legendBar}><i style={{ background: triggerStartBorderColor }} /></span><span><b>Green edge</b>: initiation trigger. The bar starts where its condition on the race data is met.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar}><i className={styles.legendEnd} style={{ background: triggerEndBorderColor }} /></span><span><b>Purple edge</b>: conclusion trigger decided by a condition on the race data.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar}><i className={styles.legendEnd} style={{ background: triggerEndDurationBorderColor }} /></span><span><b>Gray edge</b>: conclusion trigger decided by a fixed duration.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar} style={{ outline: `1px dashed ${palette.accent}`, outlineOffset: -1 }} /><span><b>Dashed outline</b>: interval edited by hand. The ↺ button of the layer restores the trigger result.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar}><i style={{ background: palette.accent, width: 5 }} /><i className={styles.legendEnd} style={{ background: palette.accent, width: 5 }} /></span><span><b>Handles</b>: drag the edges to change the start or the end, drag the middle to move the bar.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar} style={{ background: palette.backgroundPreStart, opacity: 0.9 }} /><span><b>Shaded area</b>: before the race start.</span></div>
                    <div className={styles.legendRow}><span className={styles.legendBar} /><span><b>"whole race"</b>: layer without triggers, shown from the race start to the end of the video.</span></div>
                  </div>
                }
              >
                <Button type="text" size="small" icon={<InfoCircleOutlined />} aria-label="Timeline legend" className={styles.legendBtn}>Legend</Button>
              </Popover>
            </div>
            <div title={"Video time · time relative to the race start. Space: play/pause · ←/→: step a frame (shift: 1 s) · Home: race start · drag on the ruler to seek · ctrl/⌘ + wheel: zoom"} className={styles.timeTextContainer}>
              <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{formatClock(currentVideoTime, 2)}</Typography.Text>
              <Typography.Text type="secondary" style={{ marginLeft: 6, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
                race {currentVideoTime - raceStart < 0 ? "−" : "+"}{Math.abs(currentVideoTime - raceStart).toFixed(2)} s
              </Typography.Text>
            </div>
          </div>

          <div className={styles.topRightPart}>
            <div className={styles.sliderRow} style={{ width: `${sliderWidth}px` }}>
              <div className={styles.sliderContainer}>
                <Slider onChange={handleSliderChange} range={{ draggableTrack: true }} value={zoomRange} min={0} max={100} step={0.01} tooltip={{ formatter: (value) => `${value !== undefined ? formatClock(value / 100 * videoDuration, 1) : 0}` }} />
              </div>
              <Tooltip title="Fit the race to the timeline (race start to the end of the video)">
                <Button type="text" size="small" icon={<ColumnWidthOutlined />} onClick={fitRace} aria-label="Fit race" className={styles.fitBtn}>Fit race</Button>
              </Tooltip>
            </div>
            <div className={styles.timelineAxisContainer} ref={axisScrollRef} style={{ width: ganttAreaWidth }}>
              <Stage width={canvasWidth} height={timelineAxisCanvasHeight} ref={konvaStageTimelineAxisRef}>
                <Layer>
                  <TimelineAxis
                    canvasWidth={canvasWidth}
                    canvasHeight={timelineAxisCanvasHeight}
                    canvasContentPadding={canvasContentPadding}
                    videoEnd={videoDuration}
                    raceStart={raceStart}
                    currentTime={currentVideoTime}
                    onSeek={seekTo} />
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
                onSeek={seekTo}
              />
            </div>
          </div>
        </div>
        {/* <Button onClick={testControlVideo}>test</Button> */}
      </div>
  )
})

export default inject('store')(observer(LayerPanel))