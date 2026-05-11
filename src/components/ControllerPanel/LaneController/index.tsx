import { Row, Flex, Select, Space, Tooltip } from "antd"
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { EmbeddedVisType, LayerType, SwimmerInfoType } from "../../../types";
import { getFlagEmoji } from "../../../utils";

interface ILaneControllerProps {
  swimmerInfo: SwimmerInfoType[] | null | undefined;
  onLaneChange: (values: string[]) => void;
  selectedVis: EmbeddedVisType | null
  currentLayer: LayerType
}

interface OptionProps {
  label: string,
  value: string,
  emoji: string,
  desc: string,
}

function LaneController(props: ILaneControllerProps) {
  const { swimmerInfo, onLaneChange, selectedVis, currentLayer } = props;

  const options: OptionProps[] = useMemo(() => {
    if (!swimmerInfo) return []
    return swimmerInfo.map((s) => ({
      label: `${s.swimmerId + 1} ${s.name}`,
      value: `${s.swimmerId}`,
      emoji: getFlagEmoji(s.nationality) as string,
      desc: `${s.swimmerId + 1} ${s.name}`,
    }))
  }, [swimmerInfo])

  const allValues = useMemo(() => options.map((o) => o.value), [options])

  const [value, setValue] = useState<string[]>([])

  useEffect(() => {
    if (!selectedVis) {
      setValue([])
      return
    }
    if (selectedVis.visibleLanes) {
      setValue(selectedVis.visibleLanes.map((l) => `${l}`))
    } else {
      setValue(allValues)
    }
  }, [selectedVis, allValues, currentLayer.uuid])

  const handleChange = (values: string[]) => {
    setValue(values)
    onLaneChange(values)
  };

  return (
    <div>
      <Row style={{ alignItems: "center", width: "80px", fontSize: "14px", fontWeight: 500 }}>
        Lane
        <div style={{ marginLeft: "10px" }}>
          <Tooltip title="No. 1 is at the top vertically.">
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      </Row>
      <Row>
        <Flex style={{ marginTop: "10px", width: "80%" }} vertical gap={"small"} justify={"flex-start"} align={"center"}>
          <Select
            size="small"
            mode="multiple"
            maxTagCount={'responsive'}
            style={{ width: '100%' }}
            placeholder="select lanes"
            value={value}
            onChange={handleChange}
            options={options}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.emoji}
                </span>
                {option.data.desc}
              </Space>
            )}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Flex>
      </Row>
    </div>
  )
}

export default LaneController
