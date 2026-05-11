import { MenuOutlined, HomeOutlined, EditOutlined, BuildOutlined, ProjectOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

function NavBtns() {
  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 40, bottom: 100 }}
        icon={<MenuOutlined />}
      >
        <FloatButton href="/swimchrono/" tooltip="Home: SwimChrono" icon={<HomeOutlined />}>
        </FloatButton>
        <FloatButton href="label-vis" tooltip="Vis Label Tool" icon={<EditOutlined />}>
        </FloatButton>
        <FloatButton href="label-event" tooltip="Event Label Tool" icon={<ProjectOutlined />}>
        </FloatButton>
        <FloatButton href="label-camera" tooltip="Camera Shot Label Tool" icon={<VideoCameraOutlined />}>
        </FloatButton>
        <FloatButton href="visualization" tooltip="Result Gantt Charts" icon={<BuildOutlined />}>
        </FloatButton>
      </FloatButton.Group>
    </>
  )
}

export default NavBtns
