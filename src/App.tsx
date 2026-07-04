import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layout";
import { Nav } from "./components/nav";
import { CalculatorPage } from "./pages/calculatorPage";
import { BackupPage } from "./pages/backupPage";

function App() {
  return (
    <Layout>
      <Nav />
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
