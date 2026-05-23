import FieldSelect from "./components/fieldSelect";
import { FieldInput } from "./components/fieldInput";
import { Card } from "./components/card";
import { Layout } from "./layout";
import { FILAMENT_PRICE_OPTIONS } from "./config/constants";

function App() {
  return (
    <Layout>
      <Card title="Settings">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            console.log([...data.entries()]);
          }}
        >
          <FieldInput
            label={"Cost per hour"}
            placeholder={"Enter Cost per hour"}
            description="Cost per hour"
            name={"costPerHour"}
          />
          <FieldInput
            label={"Multiplier"}
            placeholder={"Enter Multiplier"}
            description="Pricing multiplier"
            name={"multiplier"}
          />
          <FieldInput
            label={"Power Consumption"}
            placeholder={"Enter Power Consumption"}
            description="Power consumption in watts"
            name={"powerConsumption"}
          />
        </form>
      </Card>
      <Card title="Plate">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            console.log([...data.entries()]);
          }}
        >
          <FieldSelect
            options={FILAMENT_PRICE_OPTIONS}
            label={"Filament Pricing"}
            placeholder={"Select Filament Pricing"}
            description="Cost per kg of filament"
            name={"filamentPrice"}
          />
          <div className="flex gap-4">
            <FieldInput
              label={"Print Time (Hours)"}
              placeholder={"Enter Hours"}
              name={"printTimeHours"}
            />
            <FieldInput
              label={"Print Time (Minutes)"}
              placeholder={"Enter Minutes"}
              name={"printTimeMinutes"}
            />
          </div>
          <FieldInput
            label={"Print Weight"}
            placeholder={"Enter Print Weight"}
            description="Weight in grams"
            name={"printWeight"}
          />
        </form>
      </Card>
    </Layout>
  );
}

export default App;
