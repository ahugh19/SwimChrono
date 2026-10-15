import { useEffect, useState } from "react"
import { DEFAULTSwimFlow2GLOBAL_blur } from "../../../utils/values"
import { Row, Flex, InputNumber, Tooltip, Button } from "antd"
import { InfoCircleOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';

interface GlobalControllerProps {
  defaultBlur: number,
  defaultMinDuration: number,
  onBlurChange: (x: number) => void,
  onMinDurationChange: (y: number) => void,
}

// Global settings section. Styled like the other controller sections (a
// 14px title row followed by label/input rows) instead of a boxed Collapse.
function GlobalController(props: GlobalControllerProps) {
  const { defaultBlur, defaultMinDuration, onBlurChange, onMinDurationChange } = props;

  const [open, setOpen] = useState(false)
  const [blurValue, setBlurValue] = useState<number>(defaultBlur ?? DEFAULTSwimFlow2GLOBAL_blur)
  const [minDurationValue, setMinDurationValue] = useState<number>(defaultMinDuration ?? 3)

  useEffect(() => {
    setBlurValue(defaultBlur ?? DEFAULTSwimFlow2GLOBAL_blur)
  }, [defaultBlur])

  useEffect(() => {
    setMinDurationValue(defaultMinDuration ?? 3)
  }, [defaultMinDuration])

  return (
    <div style={{ marginTop: 12 }}>
      <Row style={{ alignItems: "center", height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        <Button
          type="text"
          size="small"
          style={{ padding: 0, height: 20, fontSize: 14, fontWeight: 500 }}
          icon={open ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          Global settings
        </Button>
        <Tooltip placement="top" title="Values that apply to every layer.">
          <InfoCircleOutlined style={{ marginLeft: 6, color: "var(--text-color-faint)" }} />
        </Tooltip>
      </Row>
      {open && <>
        <Flex style={{ marginTop: "8px" }} gap={"small"} justify={"flex-start"} align={"center"}>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>
            Blur:
            <Tooltip placement="top"
              title="The larger the value, the more blurred the embedded visualizations appear. 0 means no blur.">
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
        <Flex style={{ marginTop: "8px" }} gap={"small"} justify={"flex-start"} align={"center"}>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>
            Minimum duration:
            <Tooltip placement="top"
              title="The shortest duration a visualization interval may have.">
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
      </>}
    </div>
  )
}

export default GlobalController
