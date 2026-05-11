import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Checkbox, Form, Input, Row, Col, Radio, Select, Space, message, Popover } from 'antd'
import { ClockCircleTwoTone } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import '../../../../../App.css'
import { VideoType, VisBboxType, VisType } from '../../../../../types';
import { cameraShotOptions, dataOptions, enteringAnimationOptions, keyEventOptions, leavingAnimationOptions, morphOptions, movementOptions, placementOptions, temporalRelationOptions, updatingAnimationOptions, visTypeOptions, placementRelativeToScreenOptions, placementRelativeToPlayerOptions, highlightOptions, visOptionsCopiedAll } from '../../../../../utils/values';
import TextArea from 'antd/es/input/TextArea';
import { IComponentPropsWithStore, Store } from "../../../../../store";
import styles from "./index.module.less"


interface VisFormProps {
  visBbox: VisBboxType,
  startMoment: number,
  endMoment: number,
  data: string[],
  visType: string[],
  morph: string,
  movement: string,
  enteringAnimation: string,
  leavingAnimation: string,
  updatingAnimation: string[],
  placement: string,
  cameraShot: string[],
  keyEvent: string,
  temporalRelation: string[],
  note: string,
  highlight: string,
}

interface AddNewVisFormProps extends IComponentPropsWithStore {
  currentVideo: VideoType | null,
  currentTime: number,
  onAddNewVisFormFinish: (values: VisType) => void,
  copiedVis: VisType | null,
  copiedFields: string[],
  onResetForm: () => void,
}

function AddNewVisForm(props: AddNewVisFormProps) {
  const store = props.store as Store
  const { onAddNewVisFormFinish, currentTime, currentVideo, copiedVis, copiedFields, onResetForm } = props
  const [form] = Form.useForm()
  const [bbox, setBbox] = useState<VisBboxType | null>(null)
  const [isKeyChanged, setIsKeyChanged] = useState<boolean>(false)

  async function onFinish(values: VisFormProps) {
    if (!currentVideo) {
      message.error("no video")
      return
    } else {
      onAddNewVisFormFinish({
        ...values,
        startMoment: Number(values.startMoment),
        endMoment: values.endMoment ? Number(values.endMoment) : -1,
        key: `${currentVideo.key}-${values.startMoment}-${values.visBbox.x1}-${values.visBbox.y1}`,
        duration: values.endMoment === -1 ? -1 : values.endMoment - values.startMoment,
        placementRelativeTo: placementRelativeToScreenOptions.indexOf(values.placement) !== -1 ? "screen" : (placementRelativeToPlayerOptions.indexOf(values.placement) !== -1 ? "player" : "lane"),
        videoKey: `${currentVideo.key}`,
      })
      form.resetFields()
      setIsKeyChanged(false)
    }
  };

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

  function setVisBbox() {
    setBbox({ x1: store.pos.x1, y1: store.pos.y1, x2: store.pos.x2, y2: store.pos.y2 })
    form.setFieldValue("visBbox", { x1: store.pos.x1, y1: store.pos.y1, x2: store.pos.x2, y2: store.pos.y2 })
    setIsKeyChanged(true)
  }

  useEffect(() => {
    if (form) {
      form.setFieldValue("endMoment", -1)
    }
  }, [])

  useEffect(() => {
    setBbox(null)
    form.setFieldValue("visBbox", null)
  }, [store.pos.x1, store.pos.y1, store.pos.x2, store.pos.y2])

  useEffect(() => {
    if (store.selectedVisRecord && store.checkIsKeyExist(store.selectedVisRecord, store.visList)) {
      form.setFieldsValue(store.selectedVisRecord)
      setBbox(store.selectedVisRecord.visBbox)
    } else if (store.selectedVisRecord === null && !copiedVis) {
      form.resetFields()
      setIsKeyChanged(false)
    }
  }, [store.selectedVisRecord, copiedVis])

  useEffect(() => {
    if (copiedVis) {
      form.setFieldsValue(copiedVis)
      const removeFields = visOptionsCopiedAll.filter((el) => !copiedFields.includes(el))
      removeFields.forEach((rf) => {
        form.setFieldValue(rf, null)
      })
      if (removeFields.includes("visBbox")) {
        setBbox(null)
      } else {
        setBbox(copiedVis.visBbox)
      }
    }
  }, [copiedVis])

  return (
    <div>
      <div className={styles.coorBox}>
        {`Vis bbox is ${bbox ? `(${bbox.x1},${bbox.y1}), (${bbox.x2},${bbox.y2}).` : "undefined."} (This will be reset each time the rectangle position or size is changed, so it requires a new click on the [bbox] btn.)`}
      </div>
      <ProForm
        // layout="inline"
        layout="inline"
        grid={true}
        rowProps={{
          gutter: [0, 16],
        }}
        size='small'
        form={form}
        name="visForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        submitter={false}
      >
        <Form.Item
          label="Vis Bbox"
          name="visBbox"
          rules={[{ required: true, message: 'Please input vis bbox!' }]}
          style={{ marginBottom: "0px", width: "320px" }}
        >
          <Row>
            <Col span={16}>
              <Form.Item
                name="visBbox"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              {
                store.selectedVisRecord ?
                  <Popover
                    content={
                      <>
                        <Button size="small" type="primary" danger onClick={setVisBbox}>continue</Button>
                      </>
                    }
                    title="This will change the key of this record, continue?"
                    trigger="hover">
                    <Button type="primary" size="small">set bbox</Button>
                  </Popover> :
                  <Button type="primary" size="small" onClick={setVisBbox}>set bbox</Button>
              }
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="Vis Start"
          name="startMoment"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: 'Please input vis start moment!' }]}
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
                store.selectedVisRecord ?
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
          label="Vis End"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: 'Please input vis end moment!' }]}
          style={{ marginBottom: "0px", width: "270px" }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="endMoment"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>{
              store.selectedVisRecord ?
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
          </Row>
        </Form.Item>

        <Form.Item
          label="Data"
          name="data"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Please select data!' }]}
          style={{ marginBottom: "0px", width: "760px" }}
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
            dropdownStyle={{ height: 720 }}
            listHeight={700}
            placeholder="multiple selection"
            options={dataOptions} />
        </Form.Item>


        <Form.Item
          label="Vis Type"
          name="visType"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: 'Please select vis type!' }]}
          style={{ marginBottom: "0px", width: "480px" }}
        >
          <Checkbox.Group options={visTypeOptions} />
        </Form.Item>

        <Form.Item
          label="Placement"
          name="placement"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: 'Please select Vis Placement!' }]}
          style={{ marginBottom: "0px", width: "280px" }}
        >
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            dropdownStyle={{ height: 450 }}
            listHeight={450}
            options={placementOptions} />
        </Form.Item>

        <Form.Item
          label="Morph"
          name="morph"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true, message: 'Please select Vis Morph!' }]}
          style={{ marginBottom: "0px", width: "480px" }}
        >
          <Radio.Group options={morphOptions} />
        </Form.Item>

        <Form.Item
          label="Movement"
          name="movement"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          rules={[{ required: true, message: 'Please select Vis Movement!' }]}
          style={{ marginBottom: "0px", width: "440px" }}
        >
          <Radio.Group options={movementOptions} />
        </Form.Item>

        <Form.Item
          label="Key Event"
          name="keyEvent"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          rules={[{ required: true, message: 'Please select Key Event!' }]}
          style={{ marginBottom: "0px", width: "400px" }}
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
          label="Temporal Relation"
          name="temporalRelation"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          // rules={[{ required: true, message: 'Please select Temporal Relation!' }]}
          style={{ marginBottom: "0px", width: "480px" }}
        >
          <Checkbox.Group options={temporalRelationOptions} />
        </Form.Item>

        <Form.Item
          label="Highlight"
          name="highlight"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          rules={[{ required: true, message: 'Please select highlight or not!' }]}
          style={{ marginBottom: "0px", width: "220px" }}
        >
          <Radio.Group options={highlightOptions} />
        </Form.Item>

        <Form.Item
          label="Entering"
          name="enteringAnimation"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          rules={[{ required: true, message: 'Please select Enter Animation!' }]}
          style={{ marginBottom: "0px", width: "360px" }}
        >
          <Radio.Group options={enteringAnimationOptions} />
        </Form.Item>

        <Form.Item
          label="Leaving"
          name="leavingAnimation"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          // rules={[{ required: true, message: 'Please select Leaving Animation!' }]}
          style={{ marginBottom: "0px", width: "360px" }}
        >
          <Radio.Group options={leavingAnimationOptions} />
        </Form.Item>

        <Form.Item
          label="Updating"
          name="updatingAnimation"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          // rules={[{ required: true, message: 'Please select Updating Animation!' }]}
          style={{ marginBottom: "0px", width: "960px" }}
        >
          <Checkbox.Group options={updatingAnimationOptions} />
        </Form.Item>

        {/* <Form.Item
        label="Vis Placed Relative to"
        name="placementRelativeTo"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: 'Please select Vis Placed Relative to!' }]}
      >
        <Radio.Group options={placementRelativeToOptions} />
      </Form.Item>

      <Form.Item
        label="Vis Placement"
        name="placement"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: 'Please select Vis Placement!' }]}
      >
        <Radio.Group options={placementOptions} />
      </Form.Item> */}

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
          <TextArea placeholder="type any issues here, like missing data attributes." />
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 6 }}
          style={{ marginTop: "0px", marginBottom: "20px", width: "960px" }}
        >
          <Space>
            <Button type="primary" htmlType="submit">
              {store.selectedVisRecord && !isKeyChanged ? "update vis" : "add vis"}
            </Button>
            <Button className={styles.dangerBtn} onClick={onResetForm} type="dashed" htmlType="reset">reset form</Button>
          </Space>
        </Form.Item>
      </ProForm>
    </div>

  );
}

export default inject('store')(observer(AddNewVisForm))
