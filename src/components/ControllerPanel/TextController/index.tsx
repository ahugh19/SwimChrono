import { Row, Select, Flex, InputNumber, Space, ColorPicker, Input, Switch } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useEffect, useState } from "react"
import { EditableElementType } from '../../../types';
import { DEFAULTSwimFlow2TextControllerFillColor, DEFAULTSwimFlow2TextControllerFontSize } from '../../../utils/values'

const { TextArea } = Input

interface ITextControllerProps {
  editingElement: EditableElementType | undefined;
  defaultTextContent: string | undefined;
  onFontColorChange: (hex: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontTextContentChange: (content: string) => void;
  onFontVisibilityChange: (visible: boolean) => void;
  onFontXChange: (x: number) => void;
  onFontYChange: (y: number) => void;
}

interface FontFamilyOptionProps {
  label: string,
  value: string
}

function TextController(props: ITextControllerProps) {
  const { editingElement, defaultTextContent, onFontColorChange, onFontSizeChange, onFontTextContentChange, onFontVisibilityChange, onFontXChange, onFontYChange } = props;

  const fontFamilyOptions: FontFamilyOptionProps[] = [{
    label: "Arial",
    value: "Arial"
  }]

  const [fontFillColor, setFontFillColor] = useState<string>(
    editingElement?.fontFillColor ?? DEFAULTSwimFlow2TextControllerFillColor
  )
  const [fontSize, setFontSize] = useState<number>(
    editingElement?.fontSize ?? DEFAULTSwimFlow2TextControllerFontSize
  )
  const [xValue, setXValue] = useState<number>(editingElement?.x ?? 0)
  const [yValue, setYValue] = useState<number>(editingElement?.y ?? 0)
  const [textContent, setTextContent] = useState<string>(defaultTextContent ?? "")

  useEffect(() => {
    if (!editingElement) return
    setFontFillColor(editingElement.fontFillColor ?? DEFAULTSwimFlow2TextControllerFillColor)
    setFontSize(editingElement.fontSize ?? DEFAULTSwimFlow2TextControllerFontSize)
    setXValue(editingElement.x ?? 0)
    setYValue(editingElement.y ?? 0)
  }, [editingElement])

  useEffect(() => {
    setTextContent(defaultTextContent ?? "")
  }, [defaultTextContent])

  function handleTextVisibilityChange(checked: boolean) {
    onFontVisibilityChange(checked)
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Text
      </Row>
      {
        defaultTextContent !== undefined
          ? <Flex style={{ marginTop: "10px", width: "100%" }} vertical gap={"small"} justify={"flex-start"} align={"left"}>
            <Row>
              <Row style={{ alignItems: "center", width: "20%" }}>Content:</Row>
              <TextArea style={{ width: "70%", marginRight: "10px", marginLeft: "10px" }}
                rows={1} size="small"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                onBlur={() => onFontTextContentChange(textContent)}
                onPressEnter={() => onFontTextContentChange(textContent)} />
            </Row>
          </Flex>
          : null
      }
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Visibility:</Row>
          <Switch size="small" onChange={handleTextVisibilityChange} defaultChecked/>
        </Row>
      </Flex>
      <Flex style={{ marginTop: "10px", width: "80%" }} vertical gap={"small"} justify={"flex-start"} align={"center"}>
        <Select
          style={{ width: '100%' }}
          placeholder="select font"
          options={fontFamilyOptions}
          defaultValue={"Arial"}
          size="small"
          optionRender={(option) => (
            <Space>
              {option.data.label}
            </Space>
          )}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "start", marginRight: "10px" }}>X:</Row>
          <InputNumber
            style={{ width: 100 }}
            size="small"
            keyboard={true}
            value={xValue}
            addonAfter="px"
            changeOnWheel={true}
            onChange={(v) => setXValue((v as number) ?? 0)}
            onBlur={() => onFontXChange(xValue)}
            onPressEnter={() => onFontXChange(xValue)} />
        </Row>
        <Row>
          <Row style={{ alignItems: "start", marginRight: "10px" }}>Y:</Row>
          <InputNumber
            size="small"
            style={{ width: 100 }}
            keyboard={true}
            value={yValue}
            addonAfter="px"
            changeOnWheel={true}
            onChange={(v) => setYValue((v as number) ?? 0)}
            onBlur={() => onFontYChange(yValue)}
            onPressEnter={() => onFontYChange(yValue)} />
        </Row>
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Size:</Row>
          <InputNumber
            size="small"
            style={{ width: "70px", marginRight: "10px", marginLeft: "10px" }}
            min={0} max={100}
            keyboard={true}
            value={fontSize}
            changeOnWheel={true}
            suffix="px"
            onChange={(v) => setFontSize((v as number) ?? 0)}
            onBlur={() => onFontSizeChange(fontSize)}
            onPressEnter={() => onFontSizeChange(fontSize)} />
        </Row>
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Color:</Row>
          <ColorPicker
            size="small"
            value={fontFillColor}
            showText
            onChange={(_v: Color, hex: string) => setFontFillColor(hex)}
            onChangeComplete={(c: Color) => onFontColorChange(c.toHexString())} />
        </Row>
      </Flex>
    </div>
  )
}

export default TextController
