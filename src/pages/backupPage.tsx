import { useRef, useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppState } from "@/store/appStateContext";
import {
  markBackedUp,
  parseBackup,
  serializeBackup,
  type AppData,
} from "@/store/appData";

type Status = { type: "success" | "error"; message: string } | null;

function downloadBackup(data: AppData) {
  const blob = new Blob([serializeBackup(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `3d-printing-pricing-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function BackupPage() {
  const { data, importData, resetData } = useAppState();
  const [status, setStatus] = useState<Status>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      downloadBackup(data);
      markBackedUp(data);
      setStatus({ type: "success", message: "Backup downloaded." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not create the backup file.",
      });
    }
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const imported = parseBackup(text);
      importData(imported);
      // The live data now matches this file, so treat it as the saved baseline.
      markBackedUp(imported);
      setStatus({ type: "success", message: "Backup imported successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not import the file.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    event.target.value = "";
    if (file) void handleFile(file);
  };

  const handleReset = () => {
    resetData();
    setConfirmingReset(false);
    setStatus({ type: "success", message: "All data has been cleared." });
  };

  return (
    <Card title="Backup & Restore">
      <div className="flex w-full max-w-md flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Your data is saved automatically in this browser. Use export to keep a
          copy, or import to restore it on another device.
        </p>
        {status && (
          <div
            role="status"
            className={
              status.type === "error"
                ? "rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                : "rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
            }
          >
            {status.message}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Export</span>
          <p className="text-sm text-muted-foreground">
            Download all your settings and inputs as a JSON file.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={handleExport}
          >
            Download backup
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Import</span>
          <p className="text-sm text-muted-foreground">
            Restore data from a previously exported backup file. This replaces
            your current data.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose backup file
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Reset</span>
          <p className="text-sm text-muted-foreground">
            Clear all saved settings and inputs. This cannot be undone.
          </p>
          {confirmingReset ? (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="self-start"
                onClick={handleReset}
              >
                Yes, clear everything
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="self-start text-muted-foreground hover:text-foreground"
                onClick={() => setConfirmingReset(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="self-start"
              onClick={() => setConfirmingReset(true)}
            >
              Clear all data
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
