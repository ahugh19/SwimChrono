import { Row, Flex, ColorPicker, InputNumber, Switch } from 'antd'
import type { Color } from 'antd/es/color-picker';
import { EditableElementType } from '../../../types';
import { DEFAULTSwimFlow2ShapeControllerFillColor, DEFAULTSwimFlow2ShapeControllerStrokeColor, DEFAULTSwimFlow2ShapeControllerStrokeWidth } from '../../../utils/values';
import { useEffect, useState } from 'react';

interface IShapeControllerProps {
  editingElement: EditableElementType | undefined;
  onShapeFillColorChange: (hex: string) => void;
  onShapeStrokeColorChange: (hex: string) => void;
  onShapeStrokeWidthChange: (width: number) => void;
  onShapeVisibilityChange: (visible: boolean) => void;
  strokeDisable: boolean;
}

function ShapeController(props: IShapeControllerProps) {

  const { onShapeFillColorChange, onShapeStrokeColorChange, onShapeStrokeWidthChange, onShapeVisibilityChange, editingElement, strokeDisable } = props;

  const [fillColor, setFillColor] = useState<string>(
    editingElement?.shapeFillColor ?? DEFAULTSwimFlow2ShapeControllerFillColor
  )
  const [strokeColor, setStrokeColor] = useState<string>(
    editingElement?.shapeStrokeColor ?? DEFAULTSwimFlow2ShapeControllerStrokeColor
  )
  const [strokeWidth, setStrokeWidth] = useState<number>(
    editingElement?.shapeStrokeWidth ?? DEFAULTSwimFlow2ShapeControllerStrokeWidth
  )

  useEffect(() => {
    if (!editingElement) return
    setFillColor(editingElement.shapeFillColor ?? DEFAULTSwimFlow2ShapeControllerFillColor)
    setStrokeColor(editingElement.shapeStrokeColor ?? DEFAULTSwimFlow2ShapeControllerStrokeColor)
    setStrokeWidth(editingElement.shapeStrokeWidth ?? DEFAULTSwimFlow2ShapeControllerStrokeWidth)
  }, [editingElement])

  function handleShapeVisibilityChange(checked: boolean) {
    onShapeVisibilityChange(checked)
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Shape
      </Row>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Visibility:</Row>
          <Switch size="small" onChange={handleShapeVisibilityChange} defaultChecked/>
        </Row>
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Fill:</Row>
          <ColorPicker
            size="small"
            value={fillColor}
            showText
            onChange={(_v: Color, hex: string) => setFillColor(hex)}
            onChangeComplete={(c: Color) => onShapeFillColorChange(c.toHexString())} />
        </Row>
      </Flex>
      {
        strokeDisable ? null
          : <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
            <Row>
              <Row style={{ alignItems: "center", marginRight: "10px" }}>Stroke:</Row>
              <ColorPicker
                size="small"
                value={strokeColor}
                showText
                onChange={(_v: Color, hex: string) => setStrokeColor(hex)}
                onChangeComplete={(c: Color) => onShapeStrokeColorChange(c.toHexString())} />
              <InputNumber
                size="small"
                style={{ width: "70px", marginLeft: "10px" }}
                min={0} max={100}
                keyboard={true}
                value={strokeWidth}
                changeOnWheel={true}
                suffix="px"
                onChange={(v) => setStrokeWidth((v as number) ?? 0)}
                onBlur={() => onShapeStrokeWidthChange(strokeWidth)}
                onPressEnter={() => onShapeStrokeWidthChange(strokeWidth)} />
            </Row>
          </Flex>
      }
    </div>
  )
}

export default ShapeController
