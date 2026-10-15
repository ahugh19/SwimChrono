import { useState } from 'react'
import { Button, Dropdown, Modal, Typography, Table, Space, Tag } from 'antd'
import type { MenuProps } from 'antd'
import { UploadOutlined, DownOutlined, FileTextOutlined, QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons'
import JsonBlock from '../../CodeEditor/JsonBlock'
import { CONFIG_FORMAT_VERSION } from '../../../types/validation'
import { APP_VERSION } from '../../../utils/version'
import { message } from '../../../utils/feedback'

const { Text, Paragraph, Title } = Typography

interface ImportMenuProps {
  onUpload: () => void
}

// Example configuration shown in the format dialog: one trigger-driven
// layer, in the versioned envelope written by Export.
const EXAMPLE = {
  format: CONFIG_FORMAT_VERSION,
  appVersion: APP_VERSION,
  video: "paris24-men-back-final-100m",
  exportedAt: "2026-10-15T09:30:00.000Z",
  layers: [
    {
      uuid: "6f1d0c2e-3b7a-4a1e-9c21-5e8b2d7f4a10",
      name: "WR split",
      visibility: true,
      isSelected: false,
      intervalEdited: false,
      triggerCompList: [
        {
          name: "after each turn",
          triggerType: "start+duration",
          priority: 1,
          subjectStart: "event", compareStart: "equal to (=)", valueStart: "turn",
          subjectEnd: "duration", compareEnd: "equal to (=)", valueEnd: 4,
        },
      ],
      intervalList: [
        { startFrame: 3120, endFrame: 3320, relativeStartMoment: 62.4, relativeEndMoment: 66.4, duration: 4, isMerged: false, mergedTriggers: [], triggerConfig: { name: "after each turn", triggerType: "start+duration", priority: 1, subjectStart: "event", compareStart: "equal to (=)", valueStart: "turn", subjectEnd: "duration", compareEnd: "equal to (=)", valueEnd: 4 } },
      ],
      embeddedVis: {
        visName: "worldRecordSplitCorner",
        visIcon: "generalCorner.png",
        dataName: "worldRecord",
        composeType: "global",
        positionX: 24, positionXAndWidthRatio: 0.027,
        positionY: 410, positionYAndHeightRatio: 0.91,
        positionR: 0, positionS: 100, positionSRatio: 0.11,
        positionMove: false,
        editableElementList: [
          { id: "background-shape-1", type: "shape", visible: true, shapeFillColor: "#1B505D", shapeStrokeColor: "#c9c9c9", shapeStrokeWidth: 0 },
          { id: "text-1", type: "text", visible: true, fontSize: 10, fontFillColor: "#ffffff" },
        ],
      },
    },
  ],
}

const FIELDS = [
  { key: "format", field: "format", type: "number", note: `Format version written by Export (currently ${CONFIG_FORMAT_VERSION}). Files with a newer version are refused.` },
  { key: "video", field: "video", type: "string", note: "Name of the video the configuration was made for. A different loaded video only triggers a warning." },
  { key: "layers", field: "layers", type: "Layer[]", note: "The layers, top of the list first. A bare array of layers (the format of the shipped examples) is also accepted." },
  { key: "l.name", field: "layers[].name / uuid / visibility", type: "string / string / boolean", note: "Display name, unique id, and whether the layer is drawn." },
  { key: "l.trig", field: "layers[].triggerCompList", type: "Trigger[] | null", note: "Trigger components (name, triggerType start+end or start+duration, priority, subject/compare/value for start and end). null shows the layer for the whole race." },
  { key: "l.int", field: "layers[].intervalList", type: "Interval[] | null", note: "Frames where the layer is visible, computed from the triggers (startFrame, endFrame, relative moments in seconds). Recomputed when another video is loaded, unless intervalEdited is true." },
  { key: "l.edit", field: "layers[].intervalEdited", type: "boolean", note: "true when the intervals were changed by hand on the timeline." },
  { key: "v", field: "layers[].embeddedVis", type: "object | null", note: "The visualization: visName and dataName (see the Visualization picker), composeType global or individual, position (px plus ratios of the video size), rotation, scale, editable elements with their styles, optional customizedText / customizedIcon (svg)." },
]

function ImportMenu({ onUpload }: ImportMenuProps) {
  const [open, setOpen] = useState(false)

  async function copyExample() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(EXAMPLE, null, 2))
      message.success("Example copied.")
    } catch {
      message.error("Could not copy. Select the text and copy it manually.")
    }
  }

  const items: MenuProps['items'] = [
    { key: 'upload', icon: <FileTextOutlined />, label: 'Upload a configuration (JSON)', onClick: onUpload },
    { key: 'format', icon: <QuestionCircleOutlined />, label: 'About the JSON format…', onClick: () => setOpen(true) },
  ]

  return (
    <>
      <Dropdown menu={{ items, style: { minWidth: 280, whiteSpace: "nowrap" } }} trigger={['click']} placement="bottomLeft" overlayStyle={{ minWidth: 280 }}>
        <Button icon={<UploadOutlined />} aria-haspopup="menu">Import <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} /></Button>
      </Dropdown>
      <Modal title="Configuration file format" open={open} onCancel={() => setOpen(false)} footer={null} width={760}>
        <Paragraph>
          A configuration is the JSON file written by <Text strong>Export → Configuration</Text>. It holds the layers of the authoring page with their visualizations, triggers and the computed intervals, so a design can be saved, shared and imported again. Exported files are pretty-printed with two-space indentation.
        </Paragraph>
        <Space style={{ marginBottom: 6 }} align="center">
          <Title level={5} style={{ margin: 0 }}>Example</Title>
          <Tag bordered={false}>one layer</Tag>
          <Button size="small" icon={<CopyOutlined />} onClick={copyExample}>Copy</Button>
        </Space>
        <JsonBlock value={EXAMPLE} maxHeight={300} />
        <Title level={5} style={{ margin: "14px 0 6px" }}>Fields</Title>
        <Table
          size="small"
          pagination={false}
          dataSource={FIELDS}
          columns={[
            { title: "Field", dataIndex: "field", width: 230, render: (v: string) => <Text code>{v}</Text> },
            { title: "Type", dataIndex: "type", width: 150, render: (v: string) => <Text type="secondary">{v}</Text> },
            { title: "Meaning", dataIndex: "note" },
          ]}
        />
        <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
          Import validates the file and replaces the current layers. Intervals are recomputed from the triggers for the loaded video; hand-edited intervals (intervalEdited) are kept as they are.
        </Paragraph>
      </Modal>
    </>
  )
}

export default ImportMenu
