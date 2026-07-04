import { SettingsCard } from "@/components/settingsCard";
import { useAppState } from "@/store/appStateContext";

export function SettingsPage() {
  const { data, setSettings } = useAppState();

  return (
    <div className="flex flex-col gap-4">
      <SettingsCard settings={data.settings} onChange={setSettings} />
    </div>
  );
}
