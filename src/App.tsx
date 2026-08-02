import Home from "./pages/Home";
import LabelTool from "./pages/LabelTool";
import Visualization from "./pages/Visualization";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider, ThemedAntdProvider } from "./utils/theme";

function App() {
  return (
    <Router basename="/SwimChrono">
      <ThemeProvider>
        <ThemedAntdProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="label-vis" element={<LabelTool labelType="vis" />} />
            <Route path="label-event" element={<LabelTool labelType="event" />} />
            <Route path="label-camera" element={<LabelTool labelType="camera" />} />
            <Route path="visualization" element={<Visualization />} />
          </Routes>
        </ThemedAntdProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;
