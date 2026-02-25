import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorRoom from "./pages/EditorRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<EditorRoom />} />
    </Routes>
  );
}

export default App;