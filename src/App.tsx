import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layout";
import { Nav } from "./components/nav";
import { QuotationsLayout } from "./pages/quotationsLayout";
import { QuotationsEmpty } from "./pages/quotationsEmpty";
import { QuoteDetailPage } from "./pages/quoteDetailPage";
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
        <Route element={<QuotationsLayout />}>
          <Route path="/" element={<QuotationsEmpty />} />
          <Route path="/quote/:id" element={<QuoteDetailPage />} />
          <Route path="/quote/:id/edit" element={<QuoteFormPage />} />
        </Route>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/printer-cost" element={<PrinterCostPage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
