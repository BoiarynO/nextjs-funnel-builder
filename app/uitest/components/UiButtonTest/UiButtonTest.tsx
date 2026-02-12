import Button from "@/components/ui/button/Button";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
      {children}
    </div>
  );
}

export default function UiButtonTest() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Text colors
        </h3>
        <p style={{ color: "var(--primary-text-color)" }}>Primary text example</p>
        <p style={{ color: "var(--secondary-text-color)" }}>Secondary text example</p>
      </div>

      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Button
      </h2>

      <div>
        <Label>Default</Label>
        <Button>Default</Button>
      </div>

      <div>
        <Label>Filled</Label>
        <Button filled>Filled</Button>
      </div>

      <div>
        <Label>Outlined</Label>
        <Button outlined>Outlined</Button>
      </div>

      <div>
        <Label>Fill width</Label>
        <Button fill filled>
          Fill width
        </Button>
      </div>

      <div>
        <Label>Disabled</Label>
        <Button disabled filled>
          Disabled
        </Button>
      </div>

      <div>
        <Label>Custom className example</Label>
        <Button filled className="custom-button-example" style={{ textTransform: "uppercase" }}>
          Custom styled
        </Button>
      </div>
    </section>
  );
}
