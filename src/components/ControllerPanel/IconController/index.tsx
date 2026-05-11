import { Row, Flex, InputNumber, Switch } from 'antd'
import { useEffect, useState } from "react"
import { EditableElementType } from '../../../types';
import { DEFAULTSwimFlow2TextControllerFontSize } from '../../../utils/values'

interface IIconControllerProps {
  editingElement: EditableElementType | undefined;
  onIconSizeChange: (size: number) => void;
  onIconVisibilityChange: (visible: boolean) => void;
}

function IconController(props: IIconControllerProps) {
  const { editingElement, onIconSizeChange, onIconVisibilityChange } = props;

  const [iconSizeValue, setIconSizeValue] = useState<number>(
    editingElement?.iconSize ?? DEFAULTSwimFlow2TextControllerFontSize
  );

  useEffect(() => {
    if (!editingElement) return
    setIconSizeValue(editingElement.iconSize ?? DEFAULTSwimFlow2TextControllerFontSize)
  }, [editingElement])

  function handleIconVisibilityChange(checked: boolean) {
    onIconVisibilityChange(checked)
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Icon
      </Row>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Visibility:</Row>
          <Switch size="small" onChange={handleIconVisibilityChange} defaultChecked/>
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
            value={iconSizeValue}
            changeOnWheel={true}
            suffix="px"
            onChange={(v) => setIconSizeValue((v as number) ?? 0)}
            onBlur={() => onIconSizeChange(iconSizeValue)}
            onPressEnter={() => onIconSizeChange(iconSizeValue)} />
        </Row>
      </Flex>
    </div>
  )
}

export default IconController
