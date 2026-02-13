import Button from "@/components/ui/button/Button";
import Heading from "@/components/ui/heading/Heading";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--secondary-text-color)" }}>
      {children}
    </div>
  );
}

export default function UiButtonTest() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <Heading as="h3">Text colors</Heading>
        <p style={{ marginTop: "0.5rem", color: "var(--primary-text-color)" }}>Primary text example</p>
        <p style={{ color: "var(--secondary-text-color)" }}>Secondary text example</p>
      </div>

      <Heading as="h2">Button</Heading>

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
