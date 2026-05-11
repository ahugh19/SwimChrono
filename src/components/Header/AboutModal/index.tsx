import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Button,
  Space,
  ConfigProvider,
  Select,
  theme,
  Flex,
  Modal,
  Divider,
  Typography,
} from "antd";

const { Title, Paragraph, Text, Link } = Typography;

function AboutModal() {
  return (
    <>
      <Paragraph>
        We provide following demo links of labeling tools used in our systematic review.
      </Paragraph>

      <Paragraph>
        <ul>
          <li>
            <Link href="label-vis">Visualization Labeling Tool</Link>
          </li>
          <li>
            <Link href="label-event">Event Labeling Tool</Link>
          </li>
          <li>
            <Link href="label-camera">Camera Shot Labeling Tool</Link>
          </li>
          <li>
            <Link href="visualization">Result Gantt Charts</Link>
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        This project uses browser compatibility data from caniuse.com (licensed under CC-BY-4.0). This project is under the MIT license.
      </Paragraph>
    </>
  );
}

export default AboutModal;
