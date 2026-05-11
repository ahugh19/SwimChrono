import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../../store";
import { Stage, Layer, Text } from 'react-konva';
import Konva from 'konva';
import Legend from './Legend';
import { useThemeColors } from '../../../utils/theme';
import { Button, Space, Tag, Switch, Tooltip } from 'antd'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import styles from "./index.module.less"
import { PlayCircleFilled, PauseCircleFilled, CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import DurationRectGroup from './DurationRectGroup';
import { VideoType, VisType } from '../../../types';
import VisTable from './VisTable';

interface RTemporalInfoProps extends IComponentPropsWithStore {
}

const OPTION_PLACEMENT = "placement"
const OPTION_MOVEMENT = "movement"

function TemporalInfo(props: RTemporalInfoProps) {
  const store = props.store as Store
  const palette = useThemeColors();
  const [groupType, setGroupType] = useState<string>(OPTION_PLACEMENT);
  const [tooltipTextX, setTooltipTextX] = useState<number>(0);
  const [tooltipTextY, setTooltipTextY] = useState<number>(0);
  const [tooltipTextContent, setTooltipTextContent] = useState<string>("");
  const [maxM, setMaxM] = useState<number>(1);
  const konvaStageRef = useRef<Konva.Stage>(null)
  const [editingMode, setEditingMode] = useState<boolean>(false) // editing of canvas (overall mode)

  const canvasWidth = 900
  const canvasHeight = 15500
  const tooltipOffset = 10
  const canvasContentPadding = 2

  const [currentTime, setCurrentTime] = useState<number>(0)
  const [seekTime, setSeekTime] = useState<number | null>(0)
  const [playFlag, setPlayFlag] = useState<boolean>(false)
  const [urlIndex, setUrlIndex] = useState<number>(0)
  const [url, setUrl] = useState<string>("")
  const [urlVideoName, setUrlVideoName] = useState<string>("")
  const [currentVisList, setCurrentVisList] = useState<VisType[]>([])
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null)
  const videoMajorPlayerRef = useRef<any>(null)
  const canvasLabelRef = useRef<HTMLCanvasElement>(null)
  const canvasVideoWidth = 640
  const canvasVideoHeight = 360

  function onMouseMoveOnDurationRect(vis: VisType) {
    if (!konvaStageRef.current) return
    const pointerPos = konvaStageRef.current.getPointerPosition();
    if (!pointerPos) return
    setTooltipTextX(pointerPos.x + tooltipOffset)
    setTooltipTextY(pointerPos.y + tooltipOffset)
    setTooltipTextContent(
      `Event: ${vis.temporalRelation} ${vis.keyEvent}\nDuration: ${vis.duration.toFixed(2)} s\n\nVis Type:\n${vis.visType.join('\n')}\n\nData:\n${vis.data.join('\n')}\n`
      )
  }

  function onMouseLeaveDurationRect() {
    setTooltipTextContent("")
  }

  function onMouseClickDurationRect(vis: VisType, maxEndThisVis: number, video: VideoType) {
    if (!canvasLabelRef.current) return
    const ctx = canvasLabelRef.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, 640, 360)
      ctx.fillStyle = "rgba(225,225,225,0.5)"
      ctx.fillRect(0, 0, 640, 360)
      ctx.fillStyle = "rgba(225,225,225,0)"
      ctx.beginPath();
      ctx.rect((vis.visBbox.x1) / 2, (vis.visBbox.y1 - 4) / 2, (vis.visBbox.x2 - vis.visBbox.x1 - 4) / 2, (vis.visBbox.y2 - vis.visBbox.y1 - 4) / 2);
      ctx.strokeStyle = "rgb(255, 64, 64)";
      ctx.stroke();
    }

    if (video.url === url) {
      if (!konvaStageRef.current) return
      const pointerPos = konvaStageRef.current.getPointerPosition();
      if (!pointerPos) return
      setSeekTime((pointerPos.x - canvasContentPadding) / (canvasWidth - 2 * canvasContentPadding) * maxEndThisVis + video.startMoment)
    } else {
      setCurrentVideo(video)
      store.urlList.forEach((u)=>{
        if (u.key === video.url) {
          setUrl(u.key)
        }
      })
    }
  }

  useEffect(() => {
    store.getProcessedData()
    store.getExistingData()
    if (store.urlList.length !== 0) {
      setUrlIndex(0)
      setUrl(store.urlList[0].key)
    }
  }, [])

  useEffect(() => {
    let maxMoment = 0.01
    store.processedVideoData.forEach((video) => {
      if (video.relativeTimeInfo) {
        if (video.relativeTimeInfo.relativeEndMoment > maxMoment) {
          maxMoment = video.relativeTimeInfo.relativeEndMoment
        }
      }
      if (!currentVideo && store.urlList.length) {
        if (video.url === store.urlList[0].key) {
          setCurrentVideo(video)
        }
      }
    })
    store.processedVisData.forEach((visL) => {
      visL.forEach((vis) => {
        if (vis.relativeTimeInfo) {
          if (vis.relativeTimeInfo.relativeEndMoment > maxMoment) {
            maxMoment = vis.relativeTimeInfo.relativeEndMoment
          }
        }
      })
    })
    setMaxM(maxMoment)
  }, [store.processedVideoData, store.processedVisData])

  useEffect(() => {
    if (!currentVideo) return
    store.processedVisData.forEach((vl) => {
      if (vl.length) {
        if (vl[0].videoKey === currentVideo.key) {
          setCurrentVisList(vl)
        }
      }
    })
  }, [currentVideo])

  useEffect(() => {
    if (groupType === OPTION_MOVEMENT) {
      store.sortProcessedVisDataByMovement()
    } else if (groupType === OPTION_PLACEMENT) {
      store.sortProcessedVisDataByPlacement()
    }
    store.sortProcessedVisDataByStartMoment()
  }, [groupType])

  useEffect(() => {
    if (store.urlList.length > 0 && urlIndex >= 0) {
      setUrl(store.urlList[urlIndex].key)
      setUrlVideoName(store.urlList[urlIndex].urlVideoName)
    }
  }, [urlIndex])

  useEffect(() => {
    if (!videoMajorPlayerRef.current || !seekTime) return
    videoMajorPlayerRef.current.seekTo(seekTime)
    setSeekTime(null)
  }, [seekTime])

  useEffect(() => {
    if (store.seekTime === null) return
    setSeekTime(store.seekTime as number)
    store.setVideoPlayerSeekTime(null)
  }, [store.seekTime])

  function onEditSwitchChange(editChecked: boolean) {
    setEditingMode(editChecked)
  }

  function updateCurrentTime(v: OnProgressProps) {
    setCurrentTime(v.playedSeconds)
  }

  function updatePlayFlag() {
    setPlayFlag(!playFlag)
    store.setVideoPlayerSeekTime(null)
  }

  function onMajorPause() {
    setPlayFlag(false)
    store.setVideoPlayerSeekTime(null)
  }

  function onMajorPlay() {
    setPlayFlag(true)
    store.setVideoPlayerSeekTime(null)
  }

  function lastUrlIndex() {
    setUrlIndex(urlIndex === 0 ? 0 : urlIndex - 1)
  }

  function nextUrlIndex() {
    setUrlIndex(urlIndex === store.urlList.length - 1 ? store.urlList.length - 1 : urlIndex + 1)
  }
  return (
    <div className={styles.temporalInfoContainer}>
      <div className={styles.videoPart}>
        <ReactPlayer
          className={styles.videoMajor}
          ref={videoMajorPlayerRef}
          url={url}
          onProgress={(v) => updateCurrentTime(v)}
          onPlay={() => onMajorPlay()}
          onPause={() => onMajorPause()}
          playing={playFlag}
          controls={true} />
        <canvas
          className={styles.labelPreview}
          ref={canvasLabelRef}
          width={canvasVideoWidth}
          height={canvasVideoHeight}
          style={{ visibility: editingMode ? "visible" : "hidden" }} />
        <Space className={styles.editBtnGroup} size={"middle"}>
          <Switch onChange={onEditSwitchChange} checkedChildren="bbox" />
          <Tooltip>
            <div style={{ width: "120px" }}>{editingMode ? "Show bbox" : "Don't show bbox."}</div>
          </Tooltip>
          <Tag color="volcano">{url}</Tag>
        </Space>
        <Space className={styles.playBtnGroup} size={"middle"}>
          <Button type="primary" shape='circle' size="small" icon={playFlag ? <PauseCircleFilled /> : <PlayCircleFilled />} onClick={updatePlayFlag}></Button>
          <Tag style={{ width: "90px" }} title="current time">{currentTime ? currentTime.toFixed(4) : 0} s</Tag>
          <Tag>Url Index {urlIndex}/{store.urlList.length > 0 ? store.urlList.length - 1 : null}</Tag>
          <Button type="default" size="small" onClick={lastUrlIndex} icon={<CaretLeftFilled />}>last url</Button>
          <Button type="default" size="small" onClick={nextUrlIndex} icon={<CaretRightFilled />}>next url</Button>
        </Space>
        <div className={styles.visTableContainer}>
          <VisTable
            visList={currentVisList}
            currentVideo={currentVideo}
            canvasEl={canvasLabelRef}
            currentTime={currentTime}
          />
        </div>
      </div>
      {/* <Space className={styles.controlerContainer}>
        <div>Group by placement and data.</div>
        <Radio.Group onChange={onGroupTypeChange} value={groupType}>
          <Radio value={OPTION_MOVEMENT}>movement</Radio>
          <Radio value={OPTION_PLACEMENT}>placement</Radio>
        </Radio.Group>
      </Space> */}
      <div className={styles.canvasContainer}>
        <Stage width={canvasWidth} height={canvasHeight} ref={konvaStageRef}>
          <Layer>
            <Legend groupType={groupType} />
            {store.processedVisData.map((vList, videoGroupIndex) => {
              let maxEndThisVis = 0
              vList.forEach((v) => {
                if (v.relativeTimeInfo?.relativeEndMoment as number > maxEndThisVis) { maxEndThisVis = v.relativeTimeInfo?.relativeEndMoment as number }
              })
              return <DurationRectGroup
                key={`durationRectGroup-${videoGroupIndex}`}
                maxEndThisVis={maxEndThisVis}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                visList={vList}
                videoGroupIndex={videoGroupIndex}
                onMouseMoveOnDurationRect={onMouseMoveOnDurationRect}
                onMouseLeaveDurationRect={onMouseLeaveDurationRect}
                onMouseClickOnDurationRect={onMouseClickDurationRect}
                groupType={groupType}
                processedVideoData={store.processedVideoData}
                processedVisData={store.processedVisData}
                currentTime={currentTime}
                currentPlayingVideoUrl={url}
                canvasContentPadding={canvasContentPadding}
              />
            }
            )}
            <Text
              x={tooltipTextX}
              y={tooltipTextY}
              fill={palette.textBright}
              text={tooltipTextContent}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default inject('store')(observer(TemporalInfo))