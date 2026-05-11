import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Checkbox, Form, Input, Row, Col, Radio, Popover, Space } from 'antd'
import { FileAddFilled } from '@ant-design/icons';
import '../../../../App.css'
import { VideoType } from '../../../../types';
import { IComponentPropsWithStore, Store } from "../../../../store";
import { genderOptions, styleOptions, typeOptions } from '../../../../utils/values';
import styles from './index.module.less'

interface VideoFormProps {
  startMoment: number,
  endMoment: number,
  raceName: string,
  gender: string,
  distance: string,
  year: number,
  type: string,
  style: string,
  level: string,
}

interface AddNewVideoFormProps extends IComponentPropsWithStore {
  url: string,
  currentTime: number,
  onAddNewVideoFormFinish: (values: VideoType) => void
}

function AddNewVideoForm(props: AddNewVideoFormProps) {
  const store = props.store as Store
  const { onAddNewVideoFormFinish, url, currentTime } = props
  const [form] = Form.useForm()
  const [isKeyChanged, setIsKeyChanged] = useState<boolean>(false)

  function onFinish(values: VideoFormProps) {
    onAddNewVideoFormFinish({
      key: `${url}-${values.startMoment}`,
      ...values,
      startMoment: Number(values.startMoment),
      endMoment: values.endMoment ? Number(values.endMoment) : -1,
      year: Number(values.year),
      visList: [],
      url: url
    })
    form.resetFields()
    setIsKeyChanged(false)
  };

  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };

  function setStartMoment() {
    form.setFieldValue("startMoment", currentTime)
    setIsKeyChanged(true)
  }

  function setEndMoment() {
    form.setFieldValue("endMoment", currentTime)
  }

  useEffect(() => {
    if (store.selectedVideoRecord && store.checkIsKeyExist(store.selectedVideoRecord, store.videoList)) {
      form.setFieldsValue(store.selectedVideoRecord)
    } else if (store.selectedVideoRecord === null) {
      form.resetFields()
      setIsKeyChanged(false)
    }
  }, [store.selectedVideoRecord])

  return (
    <Form
      form={form}
      name="videoForm"
      size="small"
      layout="inline"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={styles.videoFormContainer}
    >
      <Form.Item
        label="Video Start"
        name="startMoment"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: 'Please input video start moment!' }]}
        style={{ marginBottom: "10px", width: "288px" }}
      >
        <Row>
          <Col span={14}>
            <Form.Item
              name="startMoment"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            {
              store.selectedVideoRecord ?
                <Popover
                  content={
                    <>
                      <Button size="small" type="primary" danger onClick={setStartMoment}>continue</Button>
                    </>
                  }
                  title="This will change the key of this record, continue?"
                  trigger="hover">
                  <Button type="primary" size="small">set start</Button>
                </Popover> :
                <Button type="primary" size="small" onClick={setStartMoment}>set start</Button>
            }
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        label="Video End"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: 'Please input video end moment!' }]}
        style={{ marginBottom: "10px", width: "280px" }}
      >
        <Row>
          <Col span={14}>
            <Form.Item
              name="endMoment"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={setEndMoment}>set end</Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        style={{ marginBottom: "10px" }}
        rules={[{ required: true, message: 'Please input gender!' }]}
      >
        <Radio.Group options={genderOptions} />
      </Form.Item>

      <Form.Item
        label="Year"
        name="year"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        style={{ marginBottom: "10px", width: "100px" }}
        rules={[{ required: true, message: 'Please input year!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Distance"
        name="distance"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        style={{ marginBottom: "10px", width: "140px" }}
        rules={[{ required: true, message: 'Please input distance!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        style={{ marginBottom: "10px" }}
        rules={[{ required: true, message: 'Please input type!' }]}
      >
        <Radio.Group options={typeOptions} />
      </Form.Item>

      <Form.Item
        label="Level"
        name="level"
        style={{ marginBottom: "10px", width: "250px" }}
        rules={[{ required: true, message: 'Please input race level!' }]}
      >
        <Input placeholder="final, sem final ..." />
      </Form.Item>

      <Form.Item
        label="Style"
        name="style"
        style={{ marginBottom: "10px" }}
        rules={[{ required: true, message: 'Please input style!' }]}
      >
        <Radio.Group options={styleOptions} />
      </Form.Item>

      {/* <Form.Item
        label="Race Name"
        name="raceName"
        style={{ marginBottom: "10px", width: "575px" }}
        rules={[{ required: true, message: 'Please input race name!' }]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {store.selectedVideoRecord && !isKeyChanged ? "update video" : "add video"}
          </Button>
          <Button type="dashed" className={styles.dangerBtn} htmlType="reset">reset form</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default inject('store')(observer(AddNewVideoForm))
