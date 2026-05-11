import { Row, Flex, InputNumber, Button, Tag, Switch } from 'antd'
import { useEffect, useState, useRef } from "react"
import { DEFAULTSwimFlow2CustomizedIconControllerIconSize } from '../../../utils/values'
import { LayerType } from "../../../types"
import { FileImageOutlined, FileExcelOutlined } from '@ant-design/icons';

interface ICustomizedIconControllerProps {
  onCustomizedIconSizeChange: (size: number) => void;
  onSvgContentChange: (svgContent: string) => void;
  onCustomizedIconVisibilityChange: (visible: boolean) => void;
  defaultSize: number | undefined;
  currentLayer: LayerType
}

function CustomizedIconController(props: ICustomizedIconControllerProps) {
  const { onSvgContentChange, onCustomizedIconSizeChange, onCustomizedIconVisibilityChange, defaultSize, currentLayer } = props;

  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Stored as percent (UI units); the parent expects a fraction so we divide on commit.
  const [sizePercent, setSizePercent] = useState<number>(
    defaultSize === undefined
      ? DEFAULTSwimFlow2CustomizedIconControllerIconSize * 100
      : defaultSize * 100
  )

  useEffect(() => {
    setSizePercent(
      defaultSize === undefined
        ? DEFAULTSwimFlow2CustomizedIconControllerIconSize * 100
        : defaultSize * 100
    )
  }, [defaultSize])

  function commitSize() {
    onCustomizedIconSizeChange(sizePercent / 100)
  }

  useEffect(() => {
    setFileName(null)
  }, [currentLayer.embeddedVis?.visName])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name)

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onSvgContentChange(e.target.result as string)
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  function handleCustomizedIconVisibilityChange(checked: boolean) {
    onCustomizedIconVisibilityChange(checked)
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Customized SVG Icon
      </Row>

      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Visibility:</Row>
          <Switch size="small" onChange={handleCustomizedIconVisibilityChange} defaultChecked/>
        </Row>
      </Flex>

      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Button type="default" size="small" onClick={triggerFileInput}>
            Upload a SVG file
          </Button>
        </Row>
        <Row style={{ marginLeft: "10px" }}>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Size:</Row>
          <InputNumber
            size="small"
            style={{ width: "70px", marginRight: "10px", marginLeft: "10px" }}
            min={0}
            keyboard={true}
            value={sizePercent}
            changeOnWheel={true}
            suffix="%"
            onChange={(v) => setSizePercent((v as number) ?? 0)}
            onBlur={commitSize}
            onPressEnter={commitSize} />
        </Row>
      </Flex>

      <Row style={{ marginTop: 10 }}>
        <Tag
          icon={fileName ? <FileImageOutlined /> : <FileExcelOutlined />}
          color={fileName ? "success" : "default"}
        >
          {fileName ? fileName : "No file uploaded."}</Tag>
      </Row>

      <input
        type="file"
        accept=".svg"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

    </div>
  )
}

export default CustomizedIconController
