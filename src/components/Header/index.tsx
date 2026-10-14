import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button, Select, Modal, Tooltip } from 'antd';
import { BulbFilled, BulbOutlined, DownloadOutlined, GithubOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../store"
import styles from "./index.module.less"
import { exampleList, videoMetaDataList } from '../../utils/values';
import AboutModal from './AboutModal'
import { useTheme } from '../../utils/theme'
import Brand from '../Brand'
import AppNav from '../AppNav'

interface HeaderProps extends IComponentPropsWithStore {
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const Header = forwardRef((props: HeaderProps, ref) => {
  const { store, fileInputRef } = props;
  const { mode, toggle } = useTheme();

  const refVideoSelection = useRef(null)
  const refImportExport = useRef(null)
  const refExampleSelection = useRef(null)
  const refPages = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    videoSelection: refVideoSelection.current,
    importExport: refImportExport.current,
    exampleSelection: refExampleSelection.current,
    pages: refPages.current,
  }))

  function handleVideoChange(value: string) {
    const selectedVideoMetaData = videoMetaDataList.filter(vmd => vmd.name === value)
    if (selectedVideoMetaData.length > 0) {
      store?.setCurrentVideoMetaData(selectedVideoMetaData[0])
    }
  }

  function handleImportClick() {
    if (fileInputRef.current === null) return;
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  function handleExampleClick(value: any) {
    const exampleFileName = exampleList.find((e) => e.exampleName === value)?.configuration
    if (exampleFileName) {
      // console.log(exampleFileName)
      store?.importExample(exampleFileName)
    }
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
            defaultValue={"none"}
            onChange={handleExampleClick}
            options={exampleList
              .map((e) => ({ value: e.exampleName, label: e.exampleName }))
              .concat({ value: "none", label: "none" })}
          />
        </div>

        <div className={styles.group} ref={refImportExport}>
          <span className={styles.label}>Config</span>
          <Button icon={<UploadOutlined />} onClick={handleImportClick}>Import</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportClick}>Export</Button>
        </div>

        <div className={styles.right}>
          <span ref={refPages}><AppNav mode="menu" /></span>
          <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Button
              type='text'
              aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              icon={mode === 'dark' ? <BulbOutlined /> : <BulbFilled />}
              onClick={toggle}
            />
          </Tooltip>
          <Tooltip title="Source code on GitHub">
            <Button
              type='text'
              aria-label="Source code on GitHub"
              icon={<GithubOutlined />}
              href="https://github.com/ahugh19/SwimChrono"
              target="_blank"
              rel="noreferrer"
            />
          </Tooltip>
          <Button type='text' icon={<InfoCircleOutlined />} onClick={showModal}>About</Button>
        </div>
      </div>

      <Modal title="About SwimChrono" open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel} footer={null}>
        <AboutModal />
      </Modal>
    </>
  )
});

export default inject('store')(observer(Header))