import { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Form, Input, Row, Col, Radio, Select, Space, message, Popover, Tooltip } from 'antd'
import { ClockCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import '../../../../../App.css'
import { CameraShotType, VideoType } from '../../../../../types';
import { keyEventOptions, cameraShotOptionsCopiedAll, cameraShotOptions, uiWarningOrange } from '../../../../../utils/values';
import TextArea from 'antd/es/input/TextArea';
import { IComponentPropsWithStore, Store } from "../../../../../store";
import styles from "./index.module.less"


interface CameraShotFormProps {
  startMoment: number,
  cameraShot: string,
  isConnectedToPrevious: string,
  note: string,
}

interface AddNewCameraShotFormProps extends IComponentPropsWithStore {
  currentVideo: VideoType | null,
  currentTime: number,
  onAddNewCameraShotFormFinish: (values: CameraShotType) => void,
  copiedCameraShot: CameraShotType | null,
  copiedFields: string[],
  onResetForm: () => void,
}

function AddNewCameraShotForm(props: AddNewCameraShotFormProps) {
  const store = props.store as Store
  const { onAddNewCameraShotFormFinish, currentTime, currentVideo, copiedCameraShot, copiedFields, onResetForm } = props
  const [form] = Form.useForm()
  const cameraShotValue = Form.useWatch('cameraShot', form);
  const startMomentValue = Form.useWatch('startMoment', form);
  const [isKeyChanged, setIsKeyChanged] = useState<boolean>(false)

  async function onFinish(values: CameraShotFormProps) {
    if (!currentVideo) {
      message.error("no video")
      return
    } else {
      onAddNewCameraShotFormFinish({
        ...values,
        startMoment: Number(values.startMoment),
        key: `${currentVideo.key}-camera-${values.startMoment}-${values.cameraShot}`,
        videoKey: `${currentVideo.key}`,
      })
      form.resetFields()
      setIsKeyChanged(false)
    }
  };

  useEffect(() => {
    if (store.selectedCameraShotRecord && (store.selectedCameraShotRecord.cameraShot !== cameraShotValue || store.selectedCameraShotRecord.startMoment !== startMomentValue)) {
      setIsKeyChanged(true)
    }
  }, [cameraShotValue, startMomentValue])

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function setStartMoment() {
    form.setFieldValue("startMoment", currentTime)
    setIsKeyChanged(true)
  }

  function setEndMoment() {
    form.setFieldValue("endMoment", currentTime)
  }

  function goToStart() {
    const startT = form.getFieldValue("startMoment")
    if (startT && Number(startT) !== -1) {
      store.setVideoPlayerSeekTime(Number(startT))
    }
  }

  function goToEnd() {
    const endT = form.getFieldValue("endMoment")
    // console.log(endT)
    if (endT && Number(endT) !== -1) {
      store.setVideoPlayerSeekTime(Number(endT))
    }
  }

  useEffect(() => {
    if (form) {
      form.setFieldValue("endMoment", -1)
    }
  }, [])

  useEffect(() => {
    if (store.selectedCameraShotRecord && store.checkIsKeyExist(store.selectedCameraShotRecord, store.cameraShotList)) {
      form.setFieldsValue(store.selectedCameraShotRecord)
    } else if (store.selectedCameraShotRecord === null && !copiedCameraShot) {
      form.resetFields()
      setIsKeyChanged(false)
    }
  }, [store.selectedCameraShotRecord, copiedCameraShot])

  useEffect(() => {
    if (copiedCameraShot) {
      form.setFieldsValue(copiedCameraShot)
      const removeFields = cameraShotOptionsCopiedAll.filter((el) => !copiedFields.includes(el))
      removeFields.forEach((rf) => {
        form.setFieldValue(rf, null)
      })
    }
  }, [copiedCameraShot])

  return (
    <div>
      <ProForm
        layout="inline"
        grid={true}
        rowProps={{
          gutter: [0, 16],
        }}
        size='small'
        form={form}
        name="cameraShotForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        submitter={false}
      >

        <Form.Item
          label="Is Connected to Previous"
          name="isConnectedToPrevious"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          rules={[{ required: true, message: 'Please input camera shot IsConnectedToPrevious!' }]}
          style={{ marginBottom: "0px", width: "800px" }}
        >
          <Radio.Group>
            <Radio value={"true"}>true</Radio>
            <Radio value={"false"}>false</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Camera Shot Start"
          name="startMoment"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: 'Please input camera shot start moment!' }]}
          style={{ marginBottom: "0px", width: "500px" }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="startMoment"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {
                store.selectedCameraShotRecord ?
                  <Space>
                    <Popover
                      content={<Button size="small" type="primary" danger onClick={setStartMoment}>continue</Button>}
                      title="This will change the key of this record, continue?"
                      trigger="hover">
                      <Button type="primary" size="small">set start</Button>
                    </Popover>
                    <Button type="default" title={"go to start moment"} icon={<ClockCircleTwoTone />} onClick={goToStart} size="small"></Button>
                  </Space> :
                  <Space>
                    <Button type="primary" size="small" onClick={setStartMoment}>set start</Button>
                    <Button type="default" title={"go to start moment"} icon={<ClockCircleTwoTone />} onClick={goToStart} size="small"></Button>
                  </Space>
              }
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={store.selectedCameraShotRecord && store.selectedCameraShotRecord.cameraShot !== cameraShotValue
            ?
            <>
              {`Camera Shot`} <Tooltip title="Changing this field will change the key of this record, and add a new record. Remember to delete the old record. ">
                <span> <WarningTwoTone twoToneColor={uiWarningOrange} /></span></Tooltip>
            </>
            :
            "Camera Shot"}
          name="cameraShot"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: 'Please select Camera Shot!' }]}
          style={{ marginBottom: "0px", width: "800px" }}
        >
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            dropdownStyle={{ height: 600 }}
            listHeight={600}
            options={cameraShotOptions} />

        </Form.Item>

        <Form.Item
          label="Notes"
          name="note"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 20 }}
          style={{ marginBottom: "0px", width: "800px" }}
        >
          <TextArea placeholder="type any issues here." />
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 6 }}
          style={{ marginTop: "0px", marginBottom: "20px", width: "960px" }}
        >
          <Space>
            <Button type="primary" htmlType="submit">
              {store.selectedCameraShotRecord && !isKeyChanged ? "update camera shot" : "add camera shot"}
            </Button>
            <Button className={styles.dangerBtn} onClick={onResetForm} type="dashed" htmlType="reset">reset form</Button>
          </Space>
        </Form.Item>
      </ProForm>
    </div>

  );
}

export default inject('store')(observer(AddNewCameraShotForm))
