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
import { Link as RouterLink } from "react-router-dom";
import { APP_PAGES } from "../../AppNav";
import { APP_VERSION } from "../../../utils/version";

const { Title, Paragraph, Text, Link } = Typography;

function AboutModal() {
  return (
    <>
      <Paragraph>
        <Text strong>SwimChrono</Text> <Text type="secondary">v{APP_VERSION}</Text> — an authoring tool for
        embedded visualizations in swimming-race videos, from the paper{" "}
        <Link href="https://doi.org/10.1109/TVCG.2026.3689361" target="_blank" rel="noreferrer">
          Diving Deep into Time: Temporal Arrangements for Embedded Visualization in Swimming Videos
        </Link>{" "}
        (IEEE TVCG 2026). The code used for the paper is tagged <Text code>v1.0.0</Text>; later versions
        improve the tool beyond the paper (see the{" "}
        <Link href="https://github.com/ahugh19/SwimChrono#changelog" target="_blank" rel="noreferrer">changelog</Link>).
      </Paragraph>

      <Paragraph>
        Demo links of the labeling tools used in our systematic review:
      </Paragraph>

      <Paragraph>
        <ul>
          {APP_PAGES.filter((p) => p.path !== "/").map((p) => (
            <li key={p.path}>
              <RouterLink to={p.path} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {p.icon}
                {p.label}
              </RouterLink>
            </li>
          ))}
        </ul>
      </Paragraph>

      <Paragraph>
        This project uses browser compatibility data from caniuse.com (licensed under CC-BY-4.0). This project is under the MIT license.
      </Paragraph>
    </>
  );
}

export default AboutModal;
