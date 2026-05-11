import { Row, Select, Flex, Space } from 'antd'
import { useEffect, useState } from "react";
import { GatewayOutlined, FontSizeOutlined, StarOutlined, MoreOutlined, BgColorsOutlined } from '@ant-design/icons';
import { LayerType } from '../../../types';
import { editableElementInVisConfig } from '../../../utils/values';

interface ItemControllerProps {
  currentLayer: LayerType,
  onEditableElementSelect: (elementId: string) => void;
}

interface OptionProps {
  label: string,
  value: string,
  type: string,
}

function EditableElementController(props: ItemControllerProps) {

  const { currentLayer, onEditableElementSelect } = props;

  const [options, setOptions] = useState<OptionProps[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  function getIcon(type: string) {
    switch (type) {
      case "text":
        return <FontSizeOutlined />
      case "shape":
        return <GatewayOutlined />
      case "icon":
        return <StarOutlined />
      case "color":
        return <BgColorsOutlined />
      default:
        return <MoreOutlined />
    }
  }

  const handleChange = (value: string) => {
    if (value === "") {
      setSelectedOption(null)
      return
    }
    setSelectedOption(value)
    onEditableElementSelect(value)
  };

  useEffect(() => {
    if (!currentLayer.embeddedVis || !(currentLayer?.embeddedVis?.visName in editableElementInVisConfig)) return
    setSelectedOption(null)
    setOptions(editableElementInVisConfig[currentLayer.embeddedVis.visName].map((e) => {
      return {
        label: e.id,
        value: e.id,
        type: e.type
      }
    }))
  }, [currentLayer.embeddedVis?.visName, currentLayer])

  return (
    <div>
      <Row style={{ alignItems: "center", width: "200px", fontSize: "14px", fontWeight: 500 }}>
        Editing item
      </Row>
      <Row>
        <Flex style={{ marginTop: "10px", width: "80%" }} vertical gap={"small"} justify={"flex-start"} align={"center"}>
          <Select
            style={{ width: '100%' }}
            placeholder="select an item to edit"
            // defaultValue={options.map((o) => o.value)}
            onChange={handleChange}
            value={selectedOption}
            size="small"
            options={options}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {getIcon(option.data.type)}
                </span>
                {option.data.label}
              </Space>
            )}
          // filterSort={(optionA, optionB) =>
          //   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          // }
          />
        </Flex>
      </Row>
    </div>
  )
}

export default EditableElementController