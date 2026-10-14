import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import "./App.css";
import { ThemeProvider, ThemedAntdProvider } from "./utils/theme";

// The label tools and the result charts are rarely visited; keep them
// out of the main bundle so the authoring page loads faster.
const LabelTool = lazy(() => import("./pages/LabelTool"));
const Visualization = lazy(() => import("./pages/Visualization"));

function RouteFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Spin size="large" />
    </div>
  );
}

function App() {
  return (
    <Router basename="/SwimChrono">
      <ThemeProvider>
        <ThemedAntdProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="label-vis" element={<LabelTool labelType="vis" />} />
              <Route path="label-event" element={<LabelTool labelType="event" />} />
              <Route path="label-camera" element={<LabelTool labelType="camera" />} />
              <Route path="visualization" element={<Visualization />} />
            </Routes>
          </Suspense>
        </ThemedAntdProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;
