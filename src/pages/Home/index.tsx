import React, { useEffect, useRef, useState } from 'react';
import NavBtns from "../../components/NavBtns"
import Header from '../../components/Header';
import LayerPanel from '../../components/LayerPanel';
import ControllerPanel from '../../components/ControllerPanel';
import VideoPanel from '../../components/VideoPanel';
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { Button, Divider, Space, Tour, FloatButton, notification } from 'antd';
import { QuestionCircleOutlined, FieldTimeOutlined, EyeOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TourProps } from 'antd';


interface HomeProps extends IComponentPropsWithStore {

}

const TOUR_SEEN_STORAGE_KEY = "swimchrono.tourSeen"

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

  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    store?.addDefaultLayer()
    api.warning({
      message: "⏳ Loading may take a while.",
      description:
        "You're using the development version, which loads videos locally. This might take some time—thanks for your patience! 🙌",
      placement: "bottom",
      duration: null,
    });
    // setTourOpen(true)
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
      description: 'Watch the video along with embedded visualizations here. 🎬',
      target: () => childVideoPanelRef.current?.videoPanelComponent,
    },
    {
      title: '📊 Layer Panel',
      description: 'Configure visualization layers and check each layer’s timeline in this panel. 🕒',
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
      title: '🔄 Restart the Tour',
      description: 'Need a refresher? Click this button to start the tour again!',
      target: () => tourOpenBtnRef.current,
      placement: "left"
    }
  ];


  return (
    <div className={styles.home}>
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
      <div className={styles.layerPanel}>
        <LayerPanel
          ref={childLayerPanelRef}
          fileInputRef={fileInputRef}
          videoDuration={videoDuration}
          currentVideoTime={currentVideoTime}
          />
      </div>
      <div className={styles.controllerPanel}>
        <ControllerPanel ref={childControllerPanelRef} />
      </div>
      <input type="file" onChange={(e) => onFileInput(e)} style={{ display: 'none' }} ref={fileInputRef} />
      <NavBtns />
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
        <>{contextHolder}</>
    </div>
  )
}

export default inject('store')(observer(Home));