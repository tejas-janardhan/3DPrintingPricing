import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layout";
import { Nav } from "./components/nav";
import { QuotationsPage } from "./pages/quotationsPage";
import { QuoteFormPage } from "./pages/quoteFormPage";
import { SettingsPage } from "./pages/settingsPage";
import { PrinterCostPage } from "./pages/printerCostPage";
import { BackupPage } from "./pages/backupPage";
import { useBackupReminder } from "./hooks/useBackupReminder";

function App() {
  useBackupReminder();

  return (
    <Layout>
      <Nav />
      <Routes>
        <Route path="/" element={<QuotationsPage />} />
        <Route path="/quote/:id" element={<QuoteFormPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/printer-cost" element={<PrinterCostPage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
