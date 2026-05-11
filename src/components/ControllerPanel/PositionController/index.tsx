import { useState, useEffect } from "react"
import { Row, Flex, InputNumber, Checkbox } from "antd"

interface PositionControllerProps {
  maxX: number | undefined,
  maxY: number | undefined,
  svgWidth: number | undefined,
  svgHeight: number | undefined,
  defaultX?: number,
  defaultXAndWidthRatio?: number,
  defaultY?: number,
  defaultYAndHeightRatio?: number,
  defaultR?: number,
  defaultS?: number,
  defaultMove?: boolean,
  disableMove: boolean,
  onXChange: (x: number, xRatio: number | undefined) => void,
  onYChange: (y: number, yRatio: number | undefined) => void,
  onSChange: (s: number, rRatio: number | undefined) => void,
  onRChange: (r: number) => void,
  onMoveChange: (value: boolean) => void,
}

function resolveX(defaultX: number | undefined, xRatio: number | undefined, svgWidth: number | undefined) {
  if (xRatio !== undefined && svgWidth) return xRatio * svgWidth
  return defaultX ?? 0
}

function resolveY(defaultY: number | undefined, yRatio: number | undefined, svgHeight: number | undefined) {
  if (yRatio !== undefined && svgHeight) return yRatio * svgHeight
  return defaultY ?? 0
}

function PositionController(props: PositionControllerProps) {
  const { svgWidth, svgHeight, defaultX, defaultXAndWidthRatio, defaultY, defaultYAndHeightRatio, defaultR, defaultS, defaultMove, disableMove, onXChange, onYChange, onRChange, onSChange, onMoveChange } = props;

  const [xValue, setXValue] = useState<number>(() => resolveX(defaultX, defaultXAndWidthRatio, svgWidth))
  const [yValue, setYValue] = useState<number>(() => resolveY(defaultY, defaultYAndHeightRatio, svgHeight))
  const [sValue, setSValue] = useState<number>(defaultS ?? 100)
  const [rValue, setRValue] = useState<number>(defaultR ?? 0)

  const [xRatio, setXRatio] = useState<number | undefined>(defaultXAndWidthRatio)
  const [yRatio, setYRatio] = useState<number | undefined>(defaultYAndHeightRatio)

  // Resync local state from props when the selected layer or import changes.
  // Note: we deliberately do NOT depend on every render's identity; only the
  // primitive prop values gate this effect so user typing isn't clobbered.
  useEffect(() => {
    setXValue(resolveX(defaultX, defaultXAndWidthRatio, svgWidth))
    setXRatio(defaultXAndWidthRatio)
  }, [defaultX, defaultXAndWidthRatio, svgWidth])

  useEffect(() => {
    setYValue(resolveY(defaultY, defaultYAndHeightRatio, svgHeight))
    setYRatio(defaultYAndHeightRatio)
  }, [defaultY, defaultYAndHeightRatio, svgHeight])

  useEffect(() => {
    setSValue(defaultS ?? 100)
  }, [defaultS])

  useEffect(() => {
    setRValue(defaultR ?? 0)
  }, [defaultR])

  function commitX(value: number) {
    if (svgWidth) {
      const ratio = value / svgWidth
      setXRatio(ratio)
      onXChange(value, ratio)
    } else {
      onXChange(value, undefined)
    }
  }

  function commitY(value: number) {
    if (svgHeight) {
      const ratio = value / svgHeight
      setYRatio(ratio)
      onYChange(value, ratio)
    } else {
      onYChange(value, undefined)
    }
  }

  function commitS(value: number) {
    if (svgWidth) {
      onSChange(value, value / svgWidth)
    } else {
      onSChange(value, undefined)
    }
  }

  function commitR(value: number) {
    onRChange(value)
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Position
      </Row>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>X:</Row>
          <InputNumber
            style={{ width: 100 }}
            size="small"
            keyboard={true}
            value={xValue}
            addonAfter="px"
            changeOnWheel={true}
            onChange={(v) => setXValue((v as number) ?? 0)}
            onBlur={() => commitX(xValue)}
            onPressEnter={() => commitX(xValue)} />
          <Row style={{ alignItems: "center", marginRight: "20px", color: "var(--text-color-faint)" }}>{xRatio ? `${(xRatio * 100).toFixed(0)} % video width` : "No width ratio data"}</Row>
        </Row>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Y:</Row>
          <InputNumber
            size="small"
            style={{ width: 100 }}
            keyboard={true}
            value={yValue}
            addonAfter="px"
            changeOnWheel={true}
            onChange={(v) => setYValue((v as number) ?? 0)}
            onBlur={() => commitY(yValue)}
            onPressEnter={() => commitY(yValue)} />
          <Row style={{ alignItems: "center", marginRight: "20px", color: "var(--text-color-faint)" }}>{yRatio ? `${(yRatio * 100).toFixed(0)} % video height` : "No height ratio data"}</Row>
        </Row>
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row style={{ alignItems: "center", marginRight: "10px" }}>Scale:</Row>
        <InputNumber
          size="small" min={0}
          style={{ width: 100 }}
          keyboard={true}
          value={sValue}
          addonAfter="%"
          changeOnWheel={true}
          onChange={(v) => setSValue((v as number) ?? 0)}
          onBlur={() => commitS(sValue)}
          onPressEnter={() => commitS(sValue)} />
        <Row style={{ alignItems: "center", marginRight: "10px", marginLeft: "20px" }}>Rotation:</Row>
        <InputNumber
          size="small"
          style={{ width: 100 }}
          keyboard={true}
          value={rValue}
          addonAfter="deg"
          changeOnWheel={true}
          onChange={(v) => setRValue((v as number) ?? 0)}
          onBlur={() => commitR(rValue)}
          onPressEnter={() => commitR(rValue)} />
      </Flex>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Checkbox
          key={`controller-move-${defaultMove}`}
          disabled={disableMove}
          defaultChecked={defaultMove}
          onChange={(e) => onMoveChange(e.target.checked)}>Move with swimmer</Checkbox>
      </Flex>
    </div >
  )
}

export default PositionController
