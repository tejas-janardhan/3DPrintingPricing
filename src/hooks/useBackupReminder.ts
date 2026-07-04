import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BACKUP_REMINDER_INTERVAL_MS } from "@/config/constants";
import { isBackupStale } from "@/store/appData";
import { useAppState } from "@/store/appStateContext";

/**
 * Every 30 minutes, if the live data differs from the last exported backup,
 * nudges the user with a toast so unsaved work isn't silently lost. Reads the
 * latest data through a ref so the interval never needs to be torn down and
 * recreated as the user edits.
 */
export function useBackupReminder() {
  const { data } = useAppState();
  const navigate = useNavigate();

  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBackupStale(dataRef.current)) return;
      toast.warning("You have unsaved changes", {
        description: "Export a backup so your data isn't lost.",
        duration: 10000,
        action: {
          label: "Back up",
          onClick: () => navigate("/backup"),
        },
      });
    }, BACKUP_REMINDER_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [navigate]);
}
