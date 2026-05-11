import React, { useEffect, useState } from 'react';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Typography, InputNumber, Card } from 'antd';
import { LayerType, TriggerCompType, TriggerFormProps } from '../../../../types';
import { optionsTriggerType, optionsCompare, TRIGGER_COMP_START_DURATION, optionsSubjectNoDuration, optionsSubjectDuration, SUBJECT_DURATION, COMPARE_EQUAL, optionsCompareOnlyEqual, optionsEvent } from '../../../../utils/values';
import { getNumberUnit } from '../../../../utils';
import AIChat from './AIChat';

const { Text, Title, Paragraph } = Typography

interface TriggerDrawerProps {
  onClose: (values: TriggerFormProps | null) => void,
  isOpen: boolean,
  currentLayer: LayerType | null,
}

const triggerFormListName = "triggerCompList"
const triggerFormName = "triggerConfiguration"

function TriggerDrawer(props: TriggerDrawerProps) {
  const { onClose, isOpen, currentLayer } = props;
  const [form] = Form.useForm();
  const [isStartDuration, setIsStartDuration] = useState<any[]>([])
  // const subjectValue = Form.useWatch('subjectStart', form);
  const [subjectStartValue, setSubjectStartValue] = useState<string>("")
  const [subjectEndValue, setSubjectEndValue] = useState<string>("")
  const [triggerRecommendation, setTriggerRecommendation] = useState<string>("")

  function onTriggerTypeChange(fieldName: number, value: string) {
    if (value === TRIGGER_COMP_START_DURATION) {
      form.setFields([
        {
          name: [triggerFormListName, fieldName, 'subjectEnd'],
          value: SUBJECT_DURATION,
        },
        {
          name: [triggerFormListName, fieldName, 'compareEnd'],
          value: COMPARE_EQUAL,
        },
      ])
      setIsStartDuration(isStartDuration.map((v, index) => index === fieldName ? true : v))
    } else {
      form.setFields([
        {
          name: [triggerFormListName, fieldName, 'subjectEnd'],
          value: undefined,
        },
        {
          name: [triggerFormListName, fieldName, 'compareEnd'],
          value: undefined,
        },
      ])
      setIsStartDuration(isStartDuration.map((v, index) => index === fieldName ? false : v))
    }
  }

  const onFormFinish = (values: TriggerFormProps) => {
    onClose(values)
  };

  useEffect(() => {
    if (!currentLayer) return
    if (!currentLayer.triggerCompList && form) {
      form.resetFields()
    } else {
      form.setFieldsValue({ triggerCompList: currentLayer.triggerCompList })
    }
    if (currentLayer.embeddedVis && currentLayer.embeddedVis.triggerRecommendation) {
      setTriggerRecommendation(currentLayer.embeddedVis.triggerRecommendation)
    }
  }, [currentLayer])

  useEffect(() => {
    setSubjectEndValue(SUBJECT_DURATION)
  }, [...isStartDuration])

  function onAddTriggerFromAI(triggerComp: TriggerCompType | null) {
    if (!triggerComp || !currentLayer) return
    if (!currentLayer.triggerCompList) {
      form.setFieldsValue({ triggerCompList: [triggerComp] })
    } else {
      form.setFieldsValue({ triggerCompList: [...currentLayer.triggerCompList, triggerComp] })
    }
  }

  function onAddTriggerCompArrayFromAI(triggerComps: TriggerCompType[] | null) {
    if (!triggerComps || !currentLayer) return
    if (!currentLayer.triggerCompList) {
      form.setFieldsValue({ triggerCompList: triggerComps })
    } else {
      form.setFieldsValue({ triggerCompList: [...currentLayer.triggerCompList, ...triggerComps] })
    }
  }

  return (
    <Drawer
      maskClosable={false}
      title="Trigger Panel"
      width={400}
      onClose={() => onClose(null)}
      open={isOpen}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={() => onClose(null)}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()} htmlType="submit">
            Confirm
          </Button>
        </Space>
      }
    >
      <Card style={{ maxWidth: 330, marginBottom: 20 }}>
        <Row>
          <Title level={5} style={{ margin: "0 0 10px 0" }}>
            Trigger recommendation
          </Title>
          <Paragraph>
            {triggerRecommendation === "" ? "No trigger recommendation for this visualization" : triggerRecommendation}
          </Paragraph>
        </Row>
      </Card>
      <AIChat
        onAddTriggerFromAI={onAddTriggerFromAI}
        onAddTriggerCompArrayFromAI={onAddTriggerCompArrayFromAI} />
      <Form
        onFinish={onFormFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        name={triggerFormName}
        style={{ maxWidth: 330 }}
        autoComplete="off"
      >
        <Form.List name={triggerFormListName}>
          {(fields, { add, remove }) => (
            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
              {fields.map((field) => (
                <Card
                  size="small"
                  title={<Row><b>{`TriggerComp ${field.name + 1}`}</b></Row>}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                        setIsStartDuration(isStartDuration.splice(field.name, 1))
                      }}
                    />
                  }
                >
                  <Form.Item
                    name={[field.name, 'name']}
                    label='Name'
                    rules={[{ required: true, message: 'Please enter trigger name' }]}
                  >
                    <Input size="small" placeholder="Please enter trigger name" />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'triggerType']}
                    label="Type"
                    rules={[{ required: true, message: 'Please select a trigger type' }]}
                  >
                    <Select
                      size="small"
                      placeholder="Please select a type"
                      onChange={(value) => onTriggerTypeChange(field.name, value)}
                      options={optionsTriggerType.map((t) => ({ label: t, value: t }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'priority']}
                    label="priority"
                    rules={[{ required: true, message: 'Please select the priority' }]}
                  >
                    <InputNumber size="small" min={1} max={fields.length} changeOnWheel={true} />
                  </Form.Item>

                  <Form.Item>
                    <Row><b>Start Trigger</b></Row>
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'subjectStart']}
                    label="Subject"
                    rules={[{ required: true, message: 'Please select the subject for start trigger.' }]}
                  >
                    <Select
                      size="small"
                      placeholder="Please select subject"
                      onChange={(e) => { setSubjectStartValue(e) }}
                      options={optionsSubjectNoDuration.map((t) => ({ label: t, value: t }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'compareStart']}
                    label="Compare"
                    rules={[{ required: true, message: 'Please select the compare for start trigger.' }]}
                  >
                    <Select
                      size="small"
                      placeholder="Please select compare"
                      options={subjectStartValue === "event" ? optionsCompareOnlyEqual.map((t) => ({ label: t, value: t })) : optionsCompare.map((t) => ({ label: t, value: t }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'valueStart']}
                    label="Value"
                    rules={[{ required: true, message: 'Please select the value for start trigger.' }]}
                  >
                    {
                      subjectStartValue === "event" ?
                        <Select
                          size="small"
                          placeholder="Please select event"
                          options={optionsEvent.map((t) => ({ label: t, value: t }))}
                        /> :
                        <InputNumber
                          size="small"
                          min={-400}
                          max={400}
                          changeOnWheel={true}
                          addonAfter={getNumberUnit(subjectStartValue)}
                        />
                    }
                  </Form.Item>

                  <Form.Item>
                    <Row><b>End Trigger</b></Row>
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'subjectEnd']}
                    label="Subject"
                    rules={[{ required: true, message: 'Please select the subject for end trigger.' }]}
                  >
                    <Select
                      size="small"
                      placeholder="Please select subject"
                      disabled={isStartDuration[field.name]}
                      onChange={(e) => { setSubjectEndValue(e) }}
                      options={isStartDuration[field.name] ? optionsSubjectDuration.map((t) => ({ label: t, value: t })) : optionsSubjectNoDuration.map((t) => ({ label: t, value: t }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'compareEnd']}
                    label="Compare"
                    rules={[{ required: true, message: 'Please select the compare for end trigger.' }]}
                  >
                    <Select
                      size="small"
                      placeholder="Please select compare"
                      disabled={isStartDuration[field.name]}
                      options={subjectStartValue === "event" ? optionsCompareOnlyEqual.map((t) => ({ label: t, value: t })) : optionsCompare.map((t) => ({ label: t, value: t }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'valueEnd']}
                    label="Value"
                    rules={[{ required: true, message: 'Please select the value for end trigger.' }]}
                  >
                    {
                      subjectEndValue === "event" ?
                        <Select
                          size="small"
                          placeholder="Please select event"
                          options={optionsEvent.map((t) => ({ label: t, value: t }))}
                        /> :
                        <InputNumber
                          size="small"
                          min={isStartDuration[field.name] ? 0 : -400}
                          max={isStartDuration[field.name] ? 50 : 400}
                          changeOnWheel={true}
                          addonAfter={getNumberUnit(subjectEndValue)}
                        />
                    }
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => {
                add()
                setIsStartDuration([...isStartDuration, undefined])
              }} block>
                + Add a New Trigger for this Visualization
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Drawer >
  );
};

export default TriggerDrawer;