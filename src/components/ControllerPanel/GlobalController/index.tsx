import { useEffect, useState } from "react"
import { Row, Flex, InputNumber, Collapse, theme, Tooltip } from "antd"
import { CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface GlobalControllerProps {
  defaultBlur: number,
  defaultMinDuration: number,
  onBlurChange: (x: number) => void,
  onMinDurationChange: (y: number) => void,
}

function GlobalController(props: GlobalControllerProps) {
  const { defaultBlur, defaultMinDuration, onBlurChange, onMinDurationChange } = props;

  const [blurValue, setBlurValue] = useState<number>(defaultBlur ?? 0.5)
  const [minDurationValue, setMinDurationValue] = useState<number>(defaultMinDuration ?? 3)

  useEffect(() => {
    setBlurValue(defaultBlur ?? 0.5)
  }, [defaultBlur])

  useEffect(() => {
    setMinDurationValue(defaultMinDuration ?? 3)
  }, [defaultMinDuration])

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
    paddingLeft: 0,
  };

  return (
    <div>
      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: token.colorBgContainer }}
        items={[{
          key: '1',
          label: <Flex gap={"small"} justify={"flex-start"} align={"center"}>
            <Row>Global settings</Row>
            <Tooltip placement="top" title="Settings for global values.">
              <InfoCircleOutlined />
            </Tooltip>
          </Flex>,
          children: <>
            <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
              <Row style={{ alignItems: "center", marginRight: "10px" }}>
                Blur effect:
                <Tooltip placement="top"
                  title="The larger the value, the more blurred the embedded visualizations will appear. A value of 0 means no blur effect.">
                  <InfoCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
              </Row>
              <InputNumber
                style={{ width: 100 }}
                size="small"
                min={0}
                keyboard={true}
                value={blurValue}
                changeOnWheel={true}
                onChange={(v) => setBlurValue((v as number) ?? 0)}
                onBlur={() => onBlurChange(blurValue)}
                onPressEnter={() => onBlurChange(blurValue)} />
            </Flex>
            <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
              <Row style={{ alignItems: "center", marginRight: "10px" }}>
                Minium duration:
                <Tooltip placement="top"
                  title="The shortest allowable duration for visualization intervals.">
                  <InfoCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
              </Row>
              <InputNumber
                size="small" min={0}
                style={{ width: 100 }}
                keyboard={true}
                value={minDurationValue}
                addonAfter="s"
                changeOnWheel={true}
                onChange={(v) => setMinDurationValue((v as number) ?? 0)}
                onBlur={() => onMinDurationChange(minDurationValue)}
                onPressEnter={() => onMinDurationChange(minDurationValue)} />
            </Flex>
          </>,
          style: panelStyle,
        }]}
      />
    </div >
  )
}

export default GlobalController
