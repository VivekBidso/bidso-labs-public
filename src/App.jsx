import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Entry from "./pages/Entry";
import Ineligible from "./pages/Ineligible";
import DesignerStage1 from "./pages/DesignerStage1";
import DesignerStage2 from "./pages/DesignerStage2";
import Submitted from "./pages/Submitted";
import Manufacturer from "./pages/Manufacturer";
import Brand from "./pages/Brand";
import Status from "./pages/Status";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/submit" element={<Entry />} />
      <Route path="/ineligible" element={<Ineligible />} />
      <Route path="/designer" element={<DesignerStage1 />} />
      <Route path="/designer/:referenceNumber/stage-two" element={<DesignerStage2 />} />
      <Route path="/submitted" element={<Submitted />} />
      <Route path="/manufacturer" element={<Manufacturer />} />
      <Route path="/brand" element={<Brand />} />
      <Route path="/status" element={<Status />} />
      <Route path="/status/:referenceNumber" element={<Status />} />
    </Routes>
  );
}
