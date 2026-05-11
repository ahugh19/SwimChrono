import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button, Space, Select, Modal, Typography } from 'antd';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore } from "../../store"
import styles from "./index.module.less"
import { exampleList, videoMetaDataList } from '../../utils/values';
import SwimChronoLogo from '/SwimChronoLogo.svg'
import AboutModal from './AboutModal'
import { useTheme } from '../../utils/theme'

const { Title, Paragraph, Text, Link } = Typography;

interface HeaderProps extends IComponentPropsWithStore {
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const Header = forwardRef((props: HeaderProps, ref) => {
  const { store, fileInputRef } = props;
  const { mode, toggle } = useTheme();

  const refVideoSelection = useRef(null)
  const refImportExport = useRef(null)
  const refExampleSelection = useRef(null)

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
    exampleSelection: refExampleSelection.current
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
        <Space align="center">
          <div className={styles.logo}>
            <img className={styles.logoSvg} src={SwimChronoLogo}></img>
          </div>
          <div className={styles.title} style={{ display: "inline" }}>
            SwimChr
            <span className={styles.highlight}>o</span>
            n
            <span className={styles.highlight}>o</span>
          </div>
          <div className={styles.btnGroupLeft} ref={refVideoSelection}>
            <div className={styles.text}>Video </div>
            <Select
              showSearch
              allowClear
              style={{ width: "200px" }}
              placeholder="choose a video"
              defaultValue={videoMetaDataList[0].name}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={videoMetaDataList.map((vmd) => {
                return {
                  value: vmd.name,
                  label: vmd.name,
                  // disabled: vmd.name === "test" ? false : true
                }
              })}
              onChange={handleVideoChange} />
          </div>
          <div className={styles.btnGroupLeft} ref={refImportExport}>
            <div className={styles.text}>Config </div>
            <Button onClick={handleImportClick}>Import</Button>
            <Button onClick={handleExportClick}>Export</Button>
          </div>
          <div className={styles.btnGroupLeft} ref={refExampleSelection}>
            <div className={styles.text}>Example </div>
            <Select
              placeholder="choose an example"
              onChange={handleExampleClick}
              style={{ width: "200px" }}
              defaultValue={"none"}
              // options={exampleList.map((e) => {
              //   return { value: e.exampleName, label: e.exampleName, disabled: e.exampleName !== "100m comic style" }
              // }).concat({ value: "none", label: "none", disabled: false })}
              options={exampleList.map((e) => {
                return { value: e.exampleName, label: e.exampleName, disabled: false }
              }).concat({ value: "none", label: "none", disabled: false })}
              />
          </div>
          <div className={styles.btnGroupRight}>
            <Button
              type='text'
              icon={mode === 'dark' ? <BulbOutlined /> : <BulbFilled />}
              title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={toggle}
            />
            {/* <Button type='text' disabled>Supplementary Materials</Button> */}
            <Button type='text' onClick={showModal}>Supplementary</Button>
            {/* <div className={styles.logoContainer}>
              <img className={styles.logo} src="img/logo/cnrs.png" />
              <img className={styles.logo} src="img/logo/inria.png" />
              <img className={styles.logo} src="img/logo/ups.png" />
              <img className={styles.logo} src="img/logo/zju.png" />
              <img className={styles.logo} src="img/logo/xjlu.png" />
              <img className={styles.logo} src="img/logo/ecly.png" />
            </div> */}
          </div>
        </Space>
      </div>

      <Modal title="Supplementary" open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
        <AboutModal />
      </Modal>
    </>
  )
});

export default inject('store')(observer(Header))