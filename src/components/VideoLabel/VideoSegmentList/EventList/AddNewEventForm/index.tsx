import { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Form, Input, Row, Col, Radio, Select, Space, message, Popover, Tooltip } from 'antd'
import { ClockCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import '../../../../../App.css'
import { EventType, VideoType } from '../../../../../types';
import { keyEventOptions, eventTypeOptions, eventOptionsCopiedAll, uiWarningOrange } from '../../../../../utils/values';
import TextArea from 'antd/es/input/TextArea';
import { IComponentPropsWithStore, Store } from "../../../../../store";
import styles from "./index.module.less"


interface EventFormProps {
  startMoment: number,
  endMoment: number,
  keyEvent: string,
  note: string,
  type: string,
}

interface AddNewEventFormProps extends IComponentPropsWithStore {
  currentVideo: VideoType | null,
  currentTime: number,
  onAddNewEventFormFinish: (values: EventType) => void,
  copiedEvent: EventType | null,
  copiedFields: string[],
  onResetForm: () => void,
}

function AddNewEventForm(props: AddNewEventFormProps) {
  const store = props.store as Store
  const { onAddNewEventFormFinish, currentTime, currentVideo, copiedEvent, copiedFields, onResetForm } = props
  const [form] = Form.useForm()
  const keyEventValue = Form.useWatch('keyEvent', form);
  const eventTypeValue = Form.useWatch('type', form);
  const startMomentValue = Form.useWatch('startMoment', form);
  const [isKeyChanged, setIsKeyChanged] = useState<boolean>(false)

  async function onFinish(values: EventFormProps) {
    if (!currentVideo) {
      message.error("no video")
      return
    } else {
      onAddNewEventFormFinish({
        ...values,
        startMoment: Number(values.startMoment),
        endMoment: values.type === "point" ? Number(values.startMoment) : (values.endMoment ? Number(values.endMoment) : -1),
        key: `${currentVideo.key}-event-${values.startMoment}-${values.keyEvent}`,
        videoKey: `${currentVideo.key}`,
      })
      form.resetFields()
      setIsKeyChanged(false)
    }
  };

  useEffect(() => {
    if (store.selectedEventRecord && (store.selectedEventRecord.keyEvent !== keyEventValue || store.selectedEventRecord.startMoment !== startMomentValue)) {
      setIsKeyChanged(true)
    }
  }, [keyEventValue, startMomentValue])

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
    if (store.selectedEventRecord && store.checkIsKeyExist(store.selectedEventRecord, store.eventList)) {
      form.setFieldsValue(store.selectedEventRecord)
    } else if (store.selectedEventRecord === null && !copiedEvent) {
      form.resetFields()
      setIsKeyChanged(false)
    }
  }, [store.selectedEventRecord, copiedEvent])

  useEffect(() => {
    if (copiedEvent) {
      form.setFieldsValue(copiedEvent)
      const removeFields = eventOptionsCopiedAll.filter((el) => !copiedFields.includes(el))
      removeFields.forEach((rf) => {
        form.setFieldValue(rf, null)
      })
    }
  }, [copiedEvent])

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
        name="eventForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        submitter={false}
      >

        <Form.Item
          label={store.selectedEventRecord && store.selectedEventRecord.keyEvent !== keyEventValue
            ?
            <>
              {`Key Event`} <Tooltip title="Changing this field will change the key of this record, and add a new record. Remember to delete the old record. ">
                <span> <WarningTwoTone twoToneColor={uiWarningOrange} /></span></Tooltip>
            </>
            :
            "Key Event"}
          name="keyEvent"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          rules={[{ required: true, message: 'Please select Key Event!' }]}
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
            dropdownStyle={{ height: 400 }}
            listHeight={400}
            options={keyEventOptions} />

        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          rules={[{ required: true, message: 'Please select the event type! Interval or point?' }]}
          style={{ marginBottom: "0px", width: "800px" }}
        >
          <Radio.Group options={eventTypeOptions} />
        </Form.Item>

        <Form.Item
          label="Event Start"
          name="startMoment"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: 'Please input event start moment!' }]}
          style={{ marginBottom: "0px", width: "270px" }}
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
                store.selectedEventRecord ?
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
          label="Event End"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: 'Please input event end moment!' }]}
          style={{ marginBottom: "0px", width: "540px" }}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                name="endMoment"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>{
              store.selectedEventRecord ?
                <Space>
                  <Popover
                    content={<Button size="small" type="primary" danger onClick={setEndMoment}>continue</Button>}
                    title="This will change the end moment, continue?"
                    trigger="hover">
                    <Button type="primary" size="small">set end</Button>
                  </Popover>
                  <Button type="default" title={"go to end moment"} icon={<ClockCircleTwoTone />} onClick={goToEnd} size="small"></Button>
                </Space> :
                <Space>
                  <Button type="primary" onClick={setEndMoment}>set end</Button>
                  <Button type="default" title={"go to end moment"} icon={<ClockCircleTwoTone />} onClick={goToEnd} size="small"></Button>
                </Space>
            }
            </Col>
            {
              eventTypeValue === "point"
                ?
                <Col span={16}>This field will be automatically filled.</Col>
                :
                null
            }
          </Row>
        </Form.Item>

        {/* <Form.Item
          label="Camera Shot"
          name="cameraShot"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
          // rules={[{ required: true, message: 'Please select Camera Shot!' }]}
          style={{ marginBottom: "0px", width: "600px" }}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            placeholder="multiple selection, ordered by appearnce"
            dropdownStyle={{ height: 560 }}
            listHeight={560}
            options={cameraShotOptions} />
        </Form.Item> */}

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
              {store.selectedEventRecord && !isKeyChanged ? "update event" : "add event"}
            </Button>
            <Button className={styles.dangerBtn} onClick={onResetForm} type="dashed" htmlType="reset">reset form</Button>
          </Space>
        </Form.Item>
      </ProForm>
    </div>

  );
}

export default inject('store')(observer(AddNewEventForm))
