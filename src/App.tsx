import FieldSelect from "./components/fieldSelect";
import { Card } from "./components/card";
import { Layout } from "./layout";

function App() {
  return (
    <Layout>
      <Card>
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
      </Card>
      <Card>
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
      </Card>
    </Layout>
  );
}

export default App;
