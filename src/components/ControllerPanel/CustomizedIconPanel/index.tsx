import { Row, Flex, InputNumber, Button, Tag, Switch, Modal, Space, Typography, Tooltip } from 'antd'
import { useEffect, useState, useRef } from "react"
import { DEFAULTSwimFlow2CustomizedIconControllerIconSize } from '../../../utils/values'
import { LayerType } from "../../../types"
import { FileImageOutlined, FileExcelOutlined, CodeOutlined, CopyOutlined, AlignLeftOutlined } from '@ant-design/icons';
import CodeEditor from '../../CodeEditor'
import { formatXml } from '../../CodeEditor/xml'
import { message } from '../../../utils/feedback'
import styles from './index.module.less'

interface ICustomizedIconControllerProps {
  onCustomizedIconSizeChange: (size: number) => void;
  onSvgContentChange: (svgContent: string) => void;
  onCustomizedIconVisibilityChange: (visible: boolean) => void;
  defaultSize: number | undefined;
  currentLayer: LayerType
  // For built-in badges: the svg they draw by default (editable copy) and a hint.
  builtInSvg?: string
  builtInHint?: string
}

function CustomizedIconController(props: ICustomizedIconControllerProps) {
  const { onSvgContentChange, onCustomizedIconSizeChange, onCustomizedIconVisibilityChange, defaultSize, currentLayer, builtInSvg, builtInHint } = props;

  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const customSvg = currentLayer.embeddedVis?.customizedIcon?.svgContent ?? ""
  // What the layer currently draws: the custom svg, else the built-in one.
  const svgContent = customSvg || builtInSvg || ""

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

  function openEditor() {
    setDraft(formatXml(svgContent))
    setEditorOpen(true)
  }

  function applyDraft() {
    const text = draft.trim()
    if (!/<svg[\s>]/i.test(text)) {
      message.error("The code must contain an <svg> element.")
      return
    }
    onSvgContentChange(text)
    setFileName("edited in the code editor")
    setEditorOpen(false)
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      message.success("SVG code copied.")
    } catch {
      message.error("Could not copy. Select the text and copy it manually.")
    }
  }

  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        Customized SVG Icon
      </Row>

      <Flex style={{ marginTop: "8px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "10px" }}>Visibility:</Row>
          <Switch size="small" onChange={handleCustomizedIconVisibilityChange} defaultChecked/>
        </Row>
      </Flex>

      {/* Preview of the current icon, or a hint when there is none yet */}
      <div className={styles.preview} title={svgContent ? "Current icon" : "No icon yet"}>
        {svgContent
          ? <div className={styles.previewSvg} dangerouslySetInnerHTML={{ __html: svgContent }} />
          : <Typography.Text type="secondary">{builtInHint ?? "No SVG yet. Upload a file or write the code."}</Typography.Text>}
      </div>
      {builtInHint && svgContent && !customSvg && (
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>{builtInHint}</Typography.Text>
      )}

      <Flex style={{ marginTop: "8px" }} gap={"small"} justify={"flex-start"} align={"center"} wrap>
        <Button type="default" size="small" onClick={triggerFileInput}>
          Upload a SVG file
        </Button>
        <Button type="default" size="small" icon={<CodeOutlined />} onClick={openEditor}>
          {svgContent ? "View / edit code" : "Write code"}
        </Button>
        <Row>
          <Row style={{ alignItems: "center", marginRight: "6px" }}>Size:</Row>
          <InputNumber
            size="small"
            style={{ width: "70px" }}
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

      <Row style={{ marginTop: 8 }}>
        <Tag
          icon={fileName ? <FileImageOutlined /> : <FileExcelOutlined />}
          color={fileName ? "success" : "default"}
        >
          {fileName ? fileName : customSvg ? "icon from the configuration" : builtInSvg ? "built-in icon" : "No file uploaded."}</Tag>
      </Row>

      <input
        type="file"
        accept=".svg"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      <Modal
        title="SVG code"
        open={editorOpen}
        onCancel={() => setEditorOpen(false)}
        width={640}
        footer={
          <Space>
            <Tooltip title="Re-indent the markup">
              <Button icon={<AlignLeftOutlined />} onClick={() => setDraft(formatXml(draft))} disabled={!draft.trim()}>Format</Button>
            </Tooltip>
            <Tooltip title="Copy the code to the clipboard">
              <Button icon={<CopyOutlined />} onClick={copyDraft} disabled={!draft}>Copy</Button>
            </Tooltip>
            <Button onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={applyDraft} disabled={!draft.trim()}>Apply</Button>
          </Space>
        }
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
          Paste or edit the markup of one <Typography.Text code>&lt;svg&gt;</Typography.Text> element. The icon is drawn at its own size and scaled by the Size value.
        </Typography.Paragraph>
        <CodeEditor
          value={draft}
          onChange={setDraft}
          placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 16">…</svg>'}
        />
        {draft.trim() && (
          <div className={styles.preview} style={{ marginTop: 10 }}>
            <div className={styles.previewSvg} dangerouslySetInnerHTML={{ __html: draft }} />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomizedIconController
