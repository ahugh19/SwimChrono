import { useState, useEffect, useRef, useCallback } from 'react'
import { inject, observer } from "mobx-react";
import ReactPlayer from 'react-player'
import { Button, Space, Tag, Switch, message, Tooltip } from 'antd'
import { PlayCircleFilled, PauseCircleFilled, CaretLeftFilled, CaretRightFilled, ForwardFilled, BackwardFilled, LeftCircleFilled, RightCircleFilled, FastBackwardFilled, FastForwardFilled } from '@ant-design/icons';
import '../../App.css'
import { OnProgressProps } from 'react-player/base';
import VideoSegmentList from './VideoSegmentList';
import { IComponentPropsWithStore, Store } from "../../store";
import CanvasSelect from '../../tool';
import styles from "./index.module.less";


interface VideoLabelProps extends IComponentPropsWithStore {
  labelType: string
}

function VideoLabel(props: VideoLabelProps) {
  const store = props.store as Store
  const { labelType } = props;
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [seekTime, setSeekTime] = useState<number | null>(0)
  const [playFlag, setPlayFlag] = useState<boolean>(false)
  const [urlIndex, setUrlIndex] = useState<number>(0)
  const [url, setUrl] = useState<string>("")
  const [urlVideoName, setUrlVideoName] = useState<string>("")
  const [editor, setEditor] = useState<CanvasSelect | null>(null)
  const [isDrawingRect, setIsDrawingRect] = useState<boolean>(false) // editing of rect editor (detailed status)
  const [editingMode, setEditingMode] = useState<boolean>(false) // editing of canvas (overall mode)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)

  const videoMajorPlayerRef = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasLabelRef = useRef<HTMLCanvasElement>(null)
  const placeholderSrc = "./border.png"
  const canvasWidth = 640
  const canvasHeight = 360
  const framSecond = 1 / 30

  const screenshotRef = useRef<HTMLDivElement>(null)
  const [screenshot, setScreenshot] = useState<any>(undefined)
  const onButtonClick = useCallback(() => {
    if (!videoMajorPlayerRef.current) return
    const iframe = document.getElementsByTagName("iframe")[0];
    const elmnt = iframe.contentWindow?.document.getElementsByTagName("video")[0];
    console.log(elmnt)
  }, [videoMajorPlayerRef])

  useEffect(() => {
    store.getExistingData()
    if (!canvasRef.current) return
    const instance = new CanvasSelect(canvasRef.current, placeholderSrc);
    // base 64 -> Blob -> object URL
    setEditor(instance)
    canvasRef.current.removeEventListener("mousedown", (e) => {
      if (e.button === 2) {
        e.stopPropagation()
      }
    })
    if (store.urlList.length !== 0) {
      setUrlIndex(0)
      setUrl(store.urlList[0].key)
    }
  }, [])

  useEffect(() => {
    if (store.urlList.length > 0 && urlIndex >= 0 && urlIndex < store.urlList.length) {
      setUrl(store.urlList[urlIndex].key)
      setUrlVideoName(store.urlList[urlIndex].urlVideoName)
      store.setSelectedVideoRecord(null)
      // setVideoDuration(videoMajorPlayerRef.current.getDuration())
    }
  }, [urlIndex, store.urlList])

  useEffect(() => {
    if (!editor) return
    editor.createType = 1;
    editor.scrollZoom = false;
    editor.on("load", (placeholderSrc: any) => { });
    editor.on("select", (info: any) => {
      // console.log("select", info);
      // info can be mutated here:
      // change the label: info.label="hello"
      // change the per-shape fill: info.fillStyle="#0f0"
      // then call instance.update() to refresh the view.
    });
    // add
    editor.on("add", (info: any) => {
      // console.log("add", info);
      // setIsDrawingRect(false)
      editor.createType = 0
    });
    // delete
    editor.on("delete", (info: any) => {
      // console.log("delete", info);
    });
    editor.on("updated", (result: any) => {
      // console.log('annotation result', result);
      if (result.length > 0 && result[0].coor.length > 0) {
        store.updatePos({
          x1: result[0].coor[0][0] as number,
          y1: result[0].coor[0][1] as number,
          x2: result[0].coor[1][0] as number,
          y2: result[0].coor[1][1] as number,
        })
      }
    });
  }, [editor])

  // useEffect(() => {
  //   if (!editor) return
  //   if (!isDrawingRect) {
  //     editor.createType = 0 // 
  //   } else {
  //     editor.createType = 1 // 
  //   }
  // }, [isDrawingRect, editor])

  function onEdit() {
    setIsDrawingRect(true)
  }

  function onClearAll() {
    if (!editor) return
    editor.setData([])
  }

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

  function lastSecond() {
    if (currentTime > 0) {
      setSeekTime(currentTime - 1)
    }
  }

  function nextSecond() {
    setSeekTime(currentTime + 1)
  }

  function last3Second() {
    if (currentTime > 3) {
      setSeekTime(currentTime - 3)
    }
  }

  function next3Second() {
    setSeekTime(currentTime + 3)
  }

  function lastFrame() {
    if (currentTime > framSecond) {
      setSeekTime(currentTime - framSecond)
    } else {
      setSeekTime(0)
    }
  }

  function nextFrame() {
    setSeekTime(currentTime + framSecond)
    // if (videoDuration) {
    //   if (currentTime < videoDuration - framSecond) {
    //     setSeekTime(currentTime + framSecond)
    //   } else {
    //     setSeekTime(videoDuration)
    //   }
    // } else {
    //   message.warning("Cannot get video duration.")
    // }
  }

  function last3Frame() {
    if (currentTime > 3 * framSecond) {
      setSeekTime(currentTime - 3 * framSecond)
    } else {
      setSeekTime(0)
    }
  }

  function next3Frame() {
    setSeekTime(currentTime + 3 * framSecond)
  }

  function last5Frame() {
    if (currentTime > 5 * framSecond) {
      setSeekTime(currentTime - 5 * framSecond)
    } else {
      setSeekTime(0)
    }
  }

  function next5Frame() {
    setSeekTime(currentTime + 5 * framSecond)
  }

  function last10Frame() {
    if (currentTime > 10 * framSecond) {
      setSeekTime(currentTime - 10 * framSecond)
    } else {
      setSeekTime(0)
    }
  }

  function next10Frame() {
    setSeekTime(currentTime + 10 * framSecond)
    // if (videoDuration) {
    //   if (currentTime < videoDuration - framSecond) {
    //     setSeekTime(currentTime + framSecond)
    //   } else {
    //     setSeekTime(videoDuration)
    //   }
    // } else {
    //   message.warning("Cannot get video duration.")
    // }
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

  function onEditSwitchChange(editChecked: boolean) {
    setEditingMode(editChecked)
  }

  return (
      <div style={{width: "100vw", height: "100vh", background: "var(--background-color)"}}>
        <div className={styles.videoPart}>
          <ReactPlayer
            className={styles.videoMajor}
            ref={videoMajorPlayerRef}
            url={url}
            onProgress={(v) => updateCurrentTime(v)}
            onPlay={() => onMajorPlay()}
            onPause={() => onMajorPause()}
            playing={playFlag}
            controls={!editingMode} />
          <canvas
            className={styles.videoMajor}
            ref={canvasRef}
            id="canvasContainer"
            width={canvasWidth}
            height={canvasHeight}
            style={{ visibility: editingMode ? "visible" : "hidden" }} />
          <canvas
            className={styles.labelPreview}
            ref={canvasLabelRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ visibility: editingMode ? "visible" : "hidden" }} />
          <Space className={styles.editBtnGroup} size={"middle"}>
            <Switch onChange={onEditSwitchChange} checkedChildren="edit" />
            <Tooltip title="When editing, there will be a green border around video player.">
              <div style={{ width: "120px", color: "var(--text-color-bright)" }}>{editingMode ? "Bbox editing..." : "No editing."}</div>
            </Tooltip>
            <Button type="primary" onClick={onEdit} disabled={!editingMode || isDrawingRect} size="small">draw rect</Button>
            <Button type="default" onClick={onClearAll} disabled={!editingMode || isDrawingRect} size="small">clear rect</Button>
            <div className={styles.bboxText}>
              {
                store.pos.x1 === -1 ?
                  `current bbox: none` :
                  `current bbox: (${store.pos.x1},${store.pos.y1}), (${store.pos.x2},${store.pos.y2})`
              }
            </div>
          </Space>
          <Space className={styles.playBtnGroup} size={"middle"}>
            <Button type="primary" shape='circle' size="small" icon={playFlag ? <PauseCircleFilled /> : <PlayCircleFilled />} onClick={updatePlayFlag}></Button>
            {/* <span title="current time">{formatTime(currentTime)}</span> */}
            <Tag style={{ width: "90px" }} title="current time">{currentTime ? currentTime.toFixed(4) : 0} s</Tag>
            <Button type="link" size="small" onClick={last3Second} icon={<FastBackwardFilled />} >last 3s</Button>
            <Button type="link" size="small" onClick={lastSecond} icon={<LeftCircleFilled />} >last second</Button>
            <Button type="link" size="small" onClick={nextSecond} icon={<RightCircleFilled />}>next second</Button>
            <Button type="link" size="small" onClick={next3Second} icon={<FastForwardFilled />} >next 3s</Button>
          </Space>
          <Space className={styles.frameBtnGroup} size={"middle"}>
            <Button type="link" size="small" title={"last 10 frames"} onClick={last10Frame} icon={<BackwardFilled />} >10 f</Button>
            <Button type="link" size="small" title={"last 5 frames"} onClick={last5Frame} icon={<CaretLeftFilled />} >5 f</Button>
            <Button type="link" size="small" title={"last 3 frames"} onClick={last3Frame} icon={<CaretLeftFilled />} >3 f</Button>
            <Button type="link" size="small" title={"last frame"} onClick={lastFrame} icon={<CaretLeftFilled />} >last f</Button>
            <Button type="link" size="small" title={"next frame"} onClick={nextFrame} icon={<CaretRightFilled />}>next f</Button>
            <Button type="link" size="small" title={"next 3 frames"} onClick={next3Frame} icon={<CaretRightFilled />}>3 f</Button>
            <Button type="link" size="small" title={"next 5 frames"} onClick={next5Frame} icon={<CaretRightFilled />}>5 f</Button>
            <Button type="link" size="small" title={"next 10 frames"} onClick={next10Frame} icon={<ForwardFilled />}>10 f</Button>
          </Space>
          <Space className={styles.urlBtnGroup} size={"middle"}>
            <Tag>Url Index {urlIndex}/{store.urlList.length > 0 ? store.urlList.length - 1 : null}</Tag>
            <Button type="default" size="small" onClick={lastUrlIndex} icon={<CaretLeftFilled />}>last url</Button>
            <Button type="default" size="small" onClick={nextUrlIndex} icon={<CaretRightFilled />}>next url</Button>
            <Tag color="volcano">{url}</Tag>
          </Space>
          <Tag className={styles.urlNameTag} color="cyan">{urlVideoName}</Tag>
        </div>
        <div>
          <VideoSegmentList labelType={labelType} canvasEl={canvasLabelRef} url={url} currentTime={currentTime} />
        </div>
        {/* <div style={{ position: "absolute", right: "10px", top: "10px" }}>
          <div>
            <button style={{ marginBottom: '10px' }} onClick={onButtonClick}>
              Take screenshot
            </button>
          </div>
          <img width={100} src={screenshot} />
        </div> */}
      </div>
  )
}

export default inject('store')(observer(VideoLabel))
