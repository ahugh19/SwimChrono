import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Button, Select, Tooltip } from 'antd';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../store"
import styles from "./index.module.less"
import { exampleList, videoMetaDataList } from '../../utils/values';
import { sportOf } from '../../utils/raceInfo';
import { message } from '../../utils/feedback';
import { useState, useEffect } from 'react';
import { useTheme } from '../../utils/theme'
import Brand from '../Brand'
import HeaderActions from '../HeaderActions'
import ExportMenu from './ExportMenu'
import ImportMenu from './ImportMenu'

interface HeaderProps extends IComponentPropsWithStore {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onHelpClick?: () => void
}

const Header = forwardRef((props: HeaderProps, ref) => {
  const { store, fileInputRef, onHelpClick } = props;
  const { mode, toggle } = useTheme();

  const refVideoSelection = useRef(null)
  const refImportExport = useRef(null)
  const refExampleSelection = useRef(null)
  const refPages = useRef<HTMLSpanElement>(null)
  const refHelp = useRef<HTMLButtonElement>(null)

  useImperativeHandle(ref, () => ({
    videoSelection: refVideoSelection.current,
    importExport: refImportExport.current,
    exampleSelection: refExampleSelection.current,
    pages: refPages.current,
    help: refHelp.current,
  }))

  // Example currently loaded ("none" when the layers are the user's own).
  const [exampleValue, setExampleValue] = useState<string>("none")

  function sportOfExample(exampleName: string) {
    const example = exampleList.find((e) => e.exampleName === exampleName)
    const meta = videoMetaDataList.find((v) => v.name.toLowerCase() === (example?.videoName ?? "").toLowerCase())
    return sportOf(meta)
  }

  function handleVideoChange(value: string) {
    const selectedVideoMetaData = videoMetaDataList.filter(vmd => vmd.name === value)
    if (selectedVideoMetaData.length > 0) {
      store?.setCurrentVideoMetaData(selectedVideoMetaData[0])
    }
  }

  // After a video switch, an example of the other sport no longer applies.
  useEffect(() => {
    if (exampleValue === "none" || !store?.currentVideoMetaData) return
    const videoSport = sportOf(store.currentVideoMetaData)
    if (sportOfExample(exampleValue) !== videoSport) {
      message.warning(`The "${exampleValue}" example was made for ${sportOfExample(exampleValue)} and does not fit a ${videoSport} video. Load a matching example or switch the video back.`)
      setExampleValue("none")
    }
  }, [store?.currentVideoMetaData?.name])

  function handleImportClick() {
    if (fileInputRef.current === null) return;
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  function handleExampleClick(value: string) {
    if (value === "none") { setExampleValue("none"); return }
    const example = exampleList.find((e) => e.exampleName === value)
    if (!example) return
    const videoSport = sportOf(store?.currentVideoMetaData)
    const exampleSport = sportOfExample(value)
    if (exampleSport !== videoSport) {
      // Climbing examples only fit the climbing video and vice versa: the
      // data columns and visualizations differ.
      message.error(`"${value}" is a ${exampleSport} example and cannot be loaded on a ${videoSport} video. Select the "${example.videoName}" video first.`)
      return
    }
    if (example.videoName.toLowerCase() !== (store?.currentVideoMetaData?.name ?? "").toLowerCase()) {
      message.info(`"${value}" was designed for the "${example.videoName}" video; its layers are applied to the current video.`)
    }
    setExampleValue(value)
    store?.importExample(example.configuration)
  }

  function handleExportClick() {
    store?.exportConfig()
  }

  return (
    <>
      <div className={styles.headerContainer}>
        <Brand />

        <span className={styles.divider} />

        <div className={styles.group} ref={refVideoSelection}>
          <span className={styles.label}>Video</span>
          <Select
            showSearch
            className={styles.select}
            placeholder="choose a video"
            defaultValue={videoMetaDataList[0].name}
            optionFilterProp="label"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={videoMetaDataList.map((vmd) => ({ value: vmd.name, label: vmd.name }))}
            onChange={handleVideoChange} />
        </div>

        <div className={styles.group} ref={refExampleSelection}>
          <span className={styles.label}>Example</span>
          <Select
            className={styles.select}
            placeholder="choose an example"
            value={exampleValue}
            onChange={handleExampleClick}
            options={exampleList
              .map((e) => ({ value: e.exampleName, label: e.exampleName }))
              .concat({ value: "none", label: "none" })}
          />
        </div>

        <div className={styles.group} ref={refImportExport}>
          <span className={styles.label}>File</span>
          <ImportMenu onUpload={handleImportClick} />
          <ExportMenu store={store} onExportConfig={handleExportClick} />
        </div>

        <HeaderActions
          pagesRef={refPages}
          helpRef={refHelp}
          onHelpClick={onHelpClick}
          leading={
            <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
              <Button
                type='text'
                aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                icon={mode === 'dark' ? <BulbOutlined /> : <BulbFilled />}
                onClick={toggle}
              />
            </Tooltip>
          }
        />
      </div>

    </>
  )
});

export default inject('store')(observer(Header))