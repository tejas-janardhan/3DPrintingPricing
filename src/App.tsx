import "./App.css";
import FieldSelect from "./components/fieldSelect";

function App() {
  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.target as HTMLFormElement);
          console.log([...data.entries()]);
        }}
      >
        <FieldSelect
          options={[
            { label: "Rs 950 (JAMG HE)", value: 950 },
            { label: "Rs 800 (Numakers)", value: 800 },
          ]}
          label={"Filament Pricing"}
          placeholder={"Select Filament Pricing"}
          description="Cost per kg of filament"
          name={"filamentPrice"}
        />
      </form>
    </div>
  );
}

export default App;
