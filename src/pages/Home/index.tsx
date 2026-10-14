import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import LayerPanel from '../../components/LayerPanel';
import ControllerPanel from '../../components/ControllerPanel';
import VideoPanel from '../../components/VideoPanel';
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { Button, Divider, Space, Tour, FloatButton } from 'antd';
import { QuestionCircleOutlined, FieldTimeOutlined, EyeOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, RollbackOutlined, AppstoreOutlined } from "@ant-design/icons";
import type { TourProps } from 'antd';
import ResizeHandle, { readStoredSize, writeStoredSize } from '../../components/ResizeHandle';


interface HomeProps extends IComponentPropsWithStore {

}

const TOUR_SEEN_STORAGE_KEY = "swimchrono.tourSeen"
const CONTROLLER_WIDTH_KEY = "swimchrono.layout.controllerWidth"
const LAYER_HEIGHT_KEY = "swimchrono.layout.layerHeight"

function readTourSeen(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(TOUR_SEEN_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function markTourSeen(): void {
  try {
    window.localStorage.setItem(TOUR_SEEN_STORAGE_KEY, "1")
  } catch {
    // Best effort: ignore localStorage failures (Safari private mode).
  }
}

function Home(props: IComponentPropsWithStore) {
  const { store } = props;

  // Open the tour automatically on first visit; users who closed it
  // before keep the auto-open suppressed. The "HELP TOUR" floating
  // button always triggers the tour manually.
  const [tourOpen, setTourOpen] = useState<boolean>(() => !readTourSeen());
  const [tourCurrent, setTourCurrent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const childHeaderRef = useRef<any>(null);
  const childVideoPanelRef = useRef<any>(null);
  const childLayerPanelRef = useRef<any>(null);
  const childControllerPanelRef = useRef<any>(null);
  const tourOpenBtnRef = useRef(null);

  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);

  // Panel sizes; null keeps the responsive CSS default (clamp()). Dragging
  // the gutters sets a pixel value which is remembered across sessions.
  const [controllerWidth, setControllerWidth] = useState<number | null>(() => readStoredSize(CONTROLLER_WIDTH_KEY));
  const [layerHeight, setLayerHeight] = useState<number | null>(() => readStoredSize(LAYER_HEIGHT_KEY));
  const controllerDivRef = useRef<HTMLDivElement | null>(null);
  const layerDivRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { writeStoredSize(CONTROLLER_WIDTH_KEY, controllerWidth) }, [controllerWidth]);
  useEffect(() => { writeStoredSize(LAYER_HEIGHT_KEY, layerHeight) }, [layerHeight]);
  const layoutStyle = {
    ...(controllerWidth !== null ? { "--width-controller-panel": `${controllerWidth}px` } : {}),
    ...(layerHeight !== null ? { "--height-layer-panel": `${layerHeight}px` } : {}),
  } as React.CSSProperties;
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [videoStart, setVideoStart] = useState<number>(0)

  async function onFileInput(e: any) {
    console.log("File input:", e)
    store?.importConfig(e)
  }

  function onVideoDurationChange(duration: number) {
    setVideoDuration(duration)
  }

  function onCurrentVideoTimeChange(currentTime: number) {
    setCurrentVideoTime(currentTime)
  }

  useEffect(() => {
    store?.addDefaultLayer()
  }, [])

  const steps: TourProps['steps'] = [
    {
      title: <div>🎉 Welcome to SwimChrono! 🏊 ⏰</div>,
      description: <div>
        <p>Let’s take a quick tour of this tool! 🚀</p>
        <p>P.S. For the best experience, use Chrome (v56+), Safari, Edge (Chromium-based), or Opera. 😉</p>
      </div>,
    },
    {
      title: '🎥 Choose a Video',
      description: 'Pick a video from our list! Each video comes with a dataset that tracks positions and events. 📊',
      target: () => childHeaderRef.current?.videoSelection,
    },
    {
      title: '📂 Import/Export Configuration',
      description: 'Load your custom settings by importing a JSON configuration file (must follow our framework). Once set, export it for later use! 🔄',
      target: () => childHeaderRef.current?.importExport,
    },
    {
      title: '🧪 Try an Example',
      description: 'Not sure where to start? Choose an example from our list and explore! 🏊‍♂️',
      target: () => childHeaderRef.current?.exampleSelection,
    },
    {
      title: '📺 Video Panel',
      description: <div>
        <p>Watch the video along with embedded visualizations here. 🎬</p>
        <p>Hover a visualization to highlight it and <b>click it to select its layer</b> for editing. 🎯</p>
      </div>,
      target: () => childVideoPanelRef.current?.videoPanelComponent,
    },
    {
      title: '📊 Layer Panel & Timeline',
      description: <div>
        <p>Each layer is a row; the bars show <b>when</b> it is visible. 🕒</p>
        <p>Drag on the ruler or the rows to <b>seek</b>, drag a bar's edges to <b>change its length</b>, or drag the bar to move it. Edited bars get a dashed outline; <RollbackOutlined /> restores the trigger result.</p>
        <p>Keys: <b>Space</b> play/pause · <b>←/→</b> one frame (Shift: 1 s) · <b>Home</b> race start · <b>Ctrl/⌘ + wheel</b> zoom.</p>
        <p>Drag the gutters between the panels to resize them (double-click to reset). ↔️</p>
      </div>,
      target: () => childLayerPanelRef.current?.layerPanelComponent,
      placement: "top"
    },
    {
      title: '➕ Add a New Layer',
      description: 'Click the "Add" button to create a new visualization layer. ✨',
      target: () => childLayerPanelRef.current?.addLayerBtn,
      placement: "top"
    },
    {
      title: '⚙️ Controller Panel',
      description: 'Customize visualization details in this panel. 🎛️',
      target: () => childControllerPanelRef.current?.controllerPanelComponent,
      placement: "left"
    },
    {
      title: '📌 Choose Data',
      description: 'Select the data you want to visualize. 📈',
      target: () => childControllerPanelRef.current?.controllerPanelChooseData,
      placement: "left"
    },
    {
      title: '🎨 Pick a Visualization',
      description: 'Choose how to display the data! Customize elements like lane, color, size, and position. You can even tweak individual elements like shapes or text. ✍️',
      target: () => childControllerPanelRef.current?.controllerPanelChooseVis,
      placement: "left"
    },
    {
      title: '⏳ Set a Trigger',
      description: <div>
        <p>Control when and how the visualization appears using the Trigger Panel (<FieldTimeOutlined />).</p>
        <p>Adjust layer order (<ArrowUpOutlined />&<ArrowDownOutlined />), copy (<CopyOutlined />), disable (<EyeOutlined />) or delete (<DeleteOutlined />) layers as needed. ⚡</p>
      </div>,
      target: () => childLayerPanelRef.current?.layerGroupBtn,
      placement: "right"
    },
    {
      title: <div><AppstoreOutlined /> Other Pages</div>,
      description: <div>
        <p>This <b>Pages</b> menu is the entrance to the other tools of the project:</p>
        <ul style={{ paddingLeft: 18, margin: "4px 0" }}>
          <li><b>Vis labels</b> — label embedded visualizations in race videos (bbox, data, placement, animation).</li>
          <li><b>Event labels</b> — label race events (start, turns, finish …).</li>
          <li><b>Camera labels</b> — label camera shots.</li>
          <li><b>Results</b> — gantt charts of all 1544 annotations of the systematic review, per video or all at once.</li>
        </ul>
        <p>Each page has its own short tour behind the <QuestionCircleOutlined /> button in its header. The About dialog lists the paper and the changelog.</p>
      </div>,
      target: () => childHeaderRef.current?.pages,
      placement: "bottomRight"
    },
    {
      title: '🔄 Restart the Tour',
      description: 'Need a refresher? Click this button to start the tour again!',
      target: () => tourOpenBtnRef.current,
      placement: "left"
    }
  ];


  return (
    <div className={styles.home} style={layoutStyle}>
      <div className={styles.header}>
        <Header
          ref={childHeaderRef}
          fileInputRef={fileInputRef} />
      </div>
      <div className={styles.videoPanel}>
        <VideoPanel
        ref={childVideoPanelRef}
        onVideoDurationChange={onVideoDurationChange}
        onCurrentVideoTimeChange={onCurrentVideoTimeChange}
        />
      </div>
      <div className={styles.layerPanel} ref={layerDivRef}>
        <LayerPanel
          ref={childLayerPanelRef}
          fileInputRef={fileInputRef}
          videoDuration={videoDuration}
          currentVideoTime={currentVideoTime}
          />
      </div>
      <div className={styles.controllerPanel} ref={controllerDivRef}>
        <ControllerPanel ref={childControllerPanelRef} />
      </div>
      <div className={styles.controllerGutter}>
        <ResizeHandle
          direction="col"
          invert
          value={controllerWidth ?? controllerDivRef.current?.offsetWidth ?? 360}
          min={240}
          max={720}
          onChange={setControllerWidth}
          onDoubleClick={() => setControllerWidth(null)}
          title="Drag to resize the controller panel · double-click to reset"
        />
      </div>
      <div className={styles.layerGutter}>
        <ResizeHandle
          direction="row"
          invert
          value={layerHeight ?? layerDivRef.current?.offsetHeight ?? 400}
          min={200}
          max={Math.max(260, window.innerHeight - 260)}
          onChange={setLayerHeight}
          onDoubleClick={() => setLayerHeight(null)}
          title="Drag to resize the layer panel · double-click to reset"
        />
      </div>
      <input type="file" onChange={(e) => onFileInput(e)} style={{ display: 'none' }} ref={fileInputRef} />
      <FloatButton
        ref={tourOpenBtnRef}
        icon={<QuestionCircleOutlined />}
        description="HELP TOUR"
        shape="square"
        style={{ insetInlineEnd: 50, right: 40, bottom: 20 }}
        onClick={() => setTourOpen(true)}
      />
      <Tour
        open={tourOpen}
        onClose={(current) => { setTourOpen(false); setTourCurrent(current); markTourSeen() }}
        onFinish={() => { setTourCurrent(0); markTourSeen() }}
        onChange={(current) => { setTourCurrent(current) }}
        current={tourCurrent}
        // mask={true}
        type="primary"
        steps={steps}
        mask={{
          color: '#1f5b7a5f',
        }}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
        gap={{ offset: 10, radius: 4 }} />
    </div>
  )
}

export default inject('store')(observer(Home));